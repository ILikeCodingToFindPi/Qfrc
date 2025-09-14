
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

interface GameScenario {
  id: string;
  situation: string;
  options: {
    text: string;
    points: number;
    explanation: string;
  }[];
}

const gameScenarios: GameScenario[] = [
  {
    id: "coffee",
    situation: "You spend ₹300 daily on fancy coffee. Your friend says 'Just invest that money!'",
    options: [
      {
        text: "Keep buying coffee - YOLO! ☕",
        points: -2,
        explanation: "₹300/day = ₹1.1L/year! That could be a decent investment. But hey, caffeine addiction is real! 😅"
      },
      {
        text: "Switch to ₹20 tea, invest ₹280 📈",
        points: 3,
        explanation: "Smart! ₹280 × 365 = ₹1.02L/year invested. In 10 years with 12% returns = ₹18L! Your future self will thank you!"
      },
      {
        text: "Buy a coffee machine for ₹15k 🤖",
        points: 2,
        explanation: "Decent compromise! Breaks even in 50 days. You'll save money AND get your caffeine fix. Math nerds approve!"
      }
    ]
  },
  {
    id: "emi",
    situation: "Your cousin bought a ₹50L car on EMI. You have ₹50L cash. What do you do?",
    options: [
      {
        text: "Buy the same car with cash 🚗",
        points: 0,
        explanation: "Opportunity cost alert! That ₹50L in SIP could become ₹1.6Cr in 10 years. Your car will be worth... ₹15L? 🤔"
      },
      {
        text: "Buy a ₹15L car, invest ₹35L 🧠",
        points: 3,
        explanation: "Galaxy brain move! Your ₹35L becomes ₹1.1Cr in 10 years. Car gets you from A to B either way!"
      },
      {
        text: "Take the EMI, invest the ₹50L 📊",
        points: 2,
        explanation: "Risky but smart if loan rate < investment returns. Car loan at 8%, market at 12% = 4% profit! Math checks out!"
      }
    ]
  },
  {
    id: "insurance",
    situation: "Agent uncle says: 'This ULIP gives insurance + investment! Best of both worlds!'",
    options: [
      {
        text: "Sounds great! Sign me up! ✍️",
        points: -3,
        explanation: "Uncle scammed you! 😭 ULIPs give 4-6% returns. Term insurance + mutual funds = 12%+ returns. Math doesn't lie!"
      },
      {
        text: "Ask for the fine print 🔍",
        points: 2,
        explanation: "Smart move! Hidden charges, low returns, lock-in periods... Always read before you sign!"
      },
      {
        text: "Say 'No uncle, I'll buy term + invest' 💪",
        points: 3,
        explanation: "Chad move! You just saved yourself from years of poor returns. Uncle won't invite you to family functions though! 😂"
      }
    ]
  },
  {
    id: "fd",
    situation: "Mom says: 'FDs are safe, beta. Stock market is gambling!'",
    options: [
      {
        text: "Listen to mom, put everything in FD 👵",
        points: -1,
        explanation: "Mom's love is infinite, but FD returns aren't! 6.5% FD vs 6% inflation = You're becoming poorer every year! 📉"
      },
      {
        text: "Explain inflation to mom with examples 📚",
        points: 3,
        explanation: "Genius! Show her how ₹100 samosas become ₹200 in 10 years. FD won't even buy half! Markets beat inflation!"
      },
      {
        text: "Do 50-50: FD + SIP compromise 🤝",
        points: 2,
        explanation: "Diplomatic! Mom's happy, you're partially protected from inflation. Not optimal, but family peace > perfect portfolio!"
      }
    ]
  },
  {
    id: "crypto",
    situation: "Your friend made ₹10L in crypto and says 'Bro, mortgage your house and invest!'",
    options: [
      {
        text: "YOLO! Mortgage the house! 🚀",
        points: -5,
        explanation: "RIP! You just invented a new way to become homeless. Crypto = volatile. House = basic need. Never risk basics for gains!"
      },
      {
        text: "Invest only spare money (₹5k/month) 🎯",
        points: 2,
        explanation: "Sensible! Only invest what you can afford to lose. Crypto can moon or crash. Your house shouldn't depend on Elon's tweets!"
      },
      {
        text: "Congratulate friend, stick to index funds 🤓",
        points: 3,
        explanation: "Boring but brilliant! NIFTY 50 gives steady 12% long-term. Crypto gave your friend gains... this time. Survivor bias is real!"
      }
    ]
  }
];

export default function MoneyGame() {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [score, setScore] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    
    const points = gameScenarios[currentScenario].options[optionIndex].points;
    setScore(prev => prev + points);
  };

  const nextScenario = () => {
    if (currentScenario < gameScenarios.length - 1) {
      setCurrentScenario(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setCurrentScenario(0);
    setScore(0);
    setGameCompleted(false);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const getScoreMessage = () => {
    if (score >= 10) return "🏆 Financial Guru! You're ready to manage a mutual fund!";
    if (score >= 5) return "📈 Money Smart! You understand the basics pretty well!";
    if (score >= 0) return "📚 Learning Mode! Keep studying, you're getting there!";
    return "🤦‍♂️ Money Mistakes Master! Time to binge-watch financial literacy videos!";
  };

  if (gameCompleted) {
    return (
      <section className="py-16" id="money-game">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">Game Complete! 🎉</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-6xl mb-4">{score >= 5 ? "🎉" : "📚"}</div>
              <h3 className="text-xl font-bold mb-2">Your Score: {score} points</h3>
              <p className="text-lg mb-6">{getScoreMessage()}</p>
              <Button onClick={resetGame} className="mr-4">
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const scenario = gameScenarios[currentScenario];

  return (
    <section className="py-16" id="money-game">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            💰 Money Wisdom Game
          </h2>
          <p className="text-muted-foreground">
            Navigate hilarious financial situations and test your money smarts!
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <span className="text-sm">Scenario {currentScenario + 1} of {gameScenarios.length}</span>
            <span className="text-sm font-bold">Score: {score}</span>
          </div>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl">Scenario {currentScenario + 1}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-6">{scenario.situation}</p>
            
            <div className="space-y-3">
              {scenario.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedOption === index ? "default" : "outline"}
                  className="w-full text-left justify-start p-4 h-auto"
                  onClick={() => handleOptionSelect(index)}
                  disabled={selectedOption !== null}
                >
                  {option.text}
                </Button>
              ))}
            </div>

            {showExplanation && selectedOption !== null && (
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">
                  Points: {scenario.options[selectedOption].points > 0 ? '+' : ''}{scenario.options[selectedOption].points}
                </h4>
                <p className="text-sm">{scenario.options[selectedOption].explanation}</p>
                <Button onClick={nextScenario} className="mt-4">
                  {currentScenario < gameScenarios.length - 1 ? "Next Scenario" : "Finish Game"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
