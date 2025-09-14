export type Asset = {
  id: string;
  name?: string;
};

export type MarketStats = {
  means: number[]; // expected returns per asset
  cov: number[][]; // covariance matrix (n x n)
  liquidity?: number[]; // optional liquidity per asset
};

export type ObjectiveSpec = {
  name: "sharpe" | "return" | "variance" | "custom";
  weight: number;
  params?: Record<string, any>;
};

export type ConstraintSpec =
  | { type: "budget" }
  | { type: "box"; min: number[]; max: number[] }
  | { type: "max_weight"; index: number; max: number }
  | { type: "long_only" };

export type ModelSpec = {
  assets: Asset[];
  objectives: ObjectiveSpec[];
  constraints?: ConstraintSpec[];
  hyperparams?: {
    states?: number;
    iterations?: number;
    initialTemp?: number;
    finalTemp?: number;
    tunnelingMass?: number;
    tunnelingHbar?: number;
    entanglementGamma?: number;
    perturbationScale?: number;
    seed?: number;
  };
};

function rand(seedRef: { s: number }): number {
  seedRef.s = (seedRef.s * 1664525 + 1013904223) >>> 0;
  return seedRef.s / 4294967296;
}

function l2(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return Math.sqrt(s);
}

function dot(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function matVecMul(mat: number[][], vec: number[]): number[] {
  const n = mat.length;
  const out = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += mat[i][j] * vec[j];
    out[i] = s;
  }
  return out;
}

function vecScale(v: number[], s: number): number[] {
  const out = new Array(v.length);
  for (let i = 0; i < v.length; i++) out[i] = v[i] * s;
  return out;
}

function vecAdd(a: number[], b: number[]): number[] {
  const out = new Array(a.length);
  for (let i = 0; i < a.length; i++) out[i] = a[i] + b[i];
  return out;
}

function normalizeBudget(w: number[], budget = 1): number[] {
  const n = w.length;
  let s = 0;
  for (let i = 0; i < n; i++) if (w[i] > 0) s += w[i];
  if (s === 0) {
    const u = budget / n;
    return new Array(n).fill(u);
  }
  const out = new Array(n);
  for (let i = 0; i < n; i++) out[i] = Math.max(0, w[i]) * (budget / s);
  return out;
}

function clampVec(w: number[], minArr?: number[], maxArr?: number[]) {
  const n = w.length;
  const out = new Array(n);
  for (let i = 0; i < n; i++) {
    const mn = minArr ? minArr[i] : -Infinity;
    const mx = maxArr ? maxArr[i] : Infinity;
    out[i] = Math.max(mn, Math.min(mx, w[i]));
  }
  return out;
}

function computeVariance(w: number[], cov: number[][]): number {
  const tmp = matVecMul(cov, w);
  return dot(w, tmp);
}

function entanglementPenalty(w: number[], corr: number[][], gamma: number): number {
  let s = 0;
  const n = w.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      s += corr[i][j] * w[i] * w[j];
    }
  }
  return gamma * s;
}

function covarianceToCorrelation(cov: number[][]): number[][] {
  const n = cov.length;
  const sd = new Array(n);
  for (let i = 0; i < n; i++) sd[i] = Math.sqrt(Math.max(cov[i][i], 1e-12));
  const corr: number[][] = new Array(n);
  for (let i = 0; i < n; i++) {
    corr[i] = new Array(n);
    for (let j = 0; j < n; j++) {
      corr[i][j] = cov[i][j] / (sd[i] * sd[j] + 1e-12);
    }
  }
  return corr;
}

export function createTranslator(spec: ModelSpec) {
  const n = spec.assets.length;
  const hyper = {
    states: spec.hyperparams?.states ?? Math.max(8, n * 2),
    iterations: spec.hyperparams?.iterations ?? 1200,
    initialTemp: spec.hyperparams?.initialTemp ?? 1.0,
    finalTemp: spec.hyperparams?.finalTemp ?? 1e-3,
    tunnelingMass: spec.hyperparams?.tunnelingMass ?? 1.0,
    tunnelingHbar: spec.hyperparams?.tunnelingHbar ?? 1.0,
    entanglementGamma: spec.hyperparams?.entanglementGamma ?? 0.5,
    perturbationScale: spec.hyperparams?.perturbationScale ?? 0.15,
    seed: spec.hyperparams?.seed ?? 42
  };

  function buildUtilityFunction(market: MarketStats) {
    const means = market.means;
    const cov = market.cov;
    const corr = covarianceToCorrelation(cov);
    const objSpecs = spec.objectives;
    return function utility(w: number[]) {
      let score = 0;
      for (let o of objSpecs) {
        if (o.name === "return") {
          score += o.weight * dot(means, w);
        } else if (o.name === "variance") {
          score -= o.weight * computeVariance(w, cov);
        } else if (o.name === "sharpe") {
          const ret = dot(means, w);
          const vol = Math.sqrt(Math.max(1e-12, computeVariance(w, cov)));
          score += o.weight * (ret / (vol + 1e-12));
        } else if (o.name === "custom") {
          score += o.weight * (o.params?.fn ? o.params.fn(w, market) : 0);
        }
      }
      score -= entanglementPenalty(w, corr, hyper.entanglementGamma);
      return score;
    };
  }

  function initialStates(seedRef: { s: number }, budget = 1) {
    const states: number[][] = [];
    for (let i = 0; i < hyper.states; i++) {
      const w = new Array(n);
      let ssum = 0;
      for (let j = 0; j < n; j++) {
        const r = rand(seedRef);
        w[j] = Math.abs(r - 0.5) * hyper.perturbationScale + 0.01;
        ssum += w[j];
      }
      for (let j = 0; j < n; j++) w[j] = (w[j] / ssum) * budget;
      states.push(w);
    }
    return states;
  }

  function propose(w: number[], seedRef: { s: number }) {
    const n = w.length;
    const cand = w.slice();
    const idx = Math.floor(rand(seedRef) * n);
    const change = (rand(seedRef) - 0.5) * hyper.perturbationScale;
    cand[idx] = Math.max(0, cand[idx] + change);
    const off = Math.floor(rand(seedRef) * n);
    cand[off] = Math.max(0, cand[off] - change * 0.5);
    return normalizeBudget(cand);
  }

  function tunnelingProb(V: number, E: number, dist: number) {
    if (E >= V) return 1;
    const m = hyper.tunnelingMass;
    const h = hyper.tunnelingHbar;
    const a = dist + 1e-12;
    const val = Math.exp(- (2 * Math.sqrt(2 * m * Math.max(0, V - E)) / h) * a);
    return Math.max(0, Math.min(1, val));
  }

  function enforceConstraints(w: number[]) {
    let out = w.slice();
    if (!spec.constraints) return normalizeBudget(out);
    for (let c of spec.constraints) {
      if (c.type === "long_only") {
        for (let i = 0; i < out.length; i++) out[i] = Math.max(0, out[i]);
      } else if (c.type === "box") {
        out = clampVec(out, c.min, c.max);
      } else if (c.type === "budget") {
        out = normalizeBudget(out);
      } else if (c.type === "max_weight") {
        out[c.index] = Math.min(out[c.index], c.max);
      }
    }
    return normalizeBudget(out);
  }

  return function translate(market: MarketStats) {
    const util = buildUtilityFunction(market);
    const seedRef = { s: hyper.seed };
    const states = initialStates(seedRef);
    const energies = states.map(s => util(enforceConstraints(s)));
    let best = { w: states[0].slice(), score: energies[0] };
    for (let i = 0; i < states.length; i++) {
      if (energies[i] > best.score) {
        best.score = energies[i];
        best.w = states[i].slice();
      }
    }
    const diagnostics: { iter: number; bestScore: number; avgScore: number }[] = [];
    for (let t = 0; t < hyper.iterations; t++) {
      const T = hyper.initialTemp * Math.pow(hyper.finalTemp / hyper.initialTemp, t / Math.max(1, hyper.iterations - 1));
      let sumScores = 0;
      for (let sIdx = 0; sIdx < states.length; sIdx++) {
        const cur = states[sIdx];
        const curScore = energies[sIdx];
        const cand = enforceConstraints(propose(cur, seedRef));
        const candScore = util(cand);
        const dist = l2(cur, cand);
        let accept = false;
        if (candScore >= curScore) accept = true;
        else {
          const pMetropolis = Math.exp((candScore - curScore) / (T + 1e-12));
          if (rand(seedRef) < pMetropolis) accept = true;
          else {
            const pt = tunnelingProb(curScore, candScore, dist);
            if (rand(seedRef) < pt) accept = true;
          }
        }
        if (accept) {
          states[sIdx] = cand;
          energies[sIdx] = candScore;
        }
        sumScores += energies[sIdx];
        if (energies[sIdx] > best.score) {
          best.score = energies[sIdx];
          best.w = states[sIdx].slice();
        }
      }
      diagnostics.push({ iter: t, bestScore: best.score, avgScore: sumScores / states.length });
      if (t % Math.max(1, Math.floor(hyper.iterations / 10)) === 0) {
        for (let i = 0; i < states.length; i++) {
          const alpha = Math.exp((energies[i] - diagnostics[diagnostics.length - 1].avgScore) / (Math.abs(T) + 1e-12));
          for (let j = 0; j < states[i].length; j++) states[i][j] *= alpha;
          states[i] = enforceConstraints(states[i]);
          energies[i] = util(states[i]);
        }
      }
    }

    const result = {
      allocation: best.w,
      score: best.score,
      diagnostics,
      hyper,
      spec
    };

    return result;
  };
}

export function exampleUsage() {
  const spec: ModelSpec = {
    assets: [{ id: "A" }, { id: "B" }, { id: "C" }, { id: "D" }],
    objectives: [
      { name: "return", weight: 1.0 },
      { name: "variance", weight: 0.8 },
      { name: "sharpe", weight: 0.4 }
    ],
    constraints: [{ type: "budget" }, { type: "long_only" }],
    hyperparams: { states: 24, iterations: 800, initialTemp: 0.9, finalTemp: 1e-3, entanglementGamma: 0.7, seed: 1337 }
  };

  const market: MarketStats = {
    means: [0.06, 0.08, 0.04, 0.1],
    cov: [
      [0.06, 0.02, 0.01, 0.015],
      [0.02, 0.08, 0.015, 0.02],
      [0.01, 0.015, 0.05, 0.01],
      [0.015, 0.02, 0.01, 0.09]
    ]
  };

  const translator = createTranslator(spec);
  const optimizer = translator(market);
  return optimizer;
}
