import { 
  type User, 
  type InsertUser, 
  type FinancialProfile, 
  type InsertFinancialProfile,
  type RealityCheckResult,
  type InsertRealityCheckResult,
  type MarketData,
  type InsertMarketData,
  type GoalCalculation,
  type InsertGoalCalculation
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Financial Profile methods
  getFinancialProfile(userId: string): Promise<FinancialProfile | undefined>;
  getFinancialProfileById(profileId: string): Promise<FinancialProfile | undefined>;
  createFinancialProfile(profile: InsertFinancialProfile): Promise<FinancialProfile>;
  updateFinancialProfile(id: string, profile: Partial<FinancialProfile>): Promise<FinancialProfile | undefined>;

  // Reality Check methods
  getRealityCheckResult(profileId: string): Promise<RealityCheckResult | undefined>;
  createRealityCheckResult(result: InsertRealityCheckResult): Promise<RealityCheckResult>;

  // Market Data methods
  getMarketData(symbol: string, exchange: string): Promise<MarketData | undefined>;
  getAllMarketData(): Promise<MarketData[]>;
  upsertMarketData(data: InsertMarketData): Promise<MarketData>;

  // Goal Calculation methods
  getGoalCalculation(profileId: string, goalType: string): Promise<GoalCalculation | undefined>;
  createGoalCalculation(calculation: InsertGoalCalculation): Promise<GoalCalculation>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private financialProfiles: Map<string, FinancialProfile>;
  private realityCheckResults: Map<string, RealityCheckResult>;
  private marketData: Map<string, MarketData>;
  private goalCalculations: Map<string, GoalCalculation>;

  constructor() {
    this.users = new Map();
    this.financialProfiles = new Map();
    this.realityCheckResults = new Map();
    this.marketData = new Map();
    this.goalCalculations = new Map();
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Financial Profile methods
  async getFinancialProfile(userId: string): Promise<FinancialProfile | undefined> {
    return Array.from(this.financialProfiles.values()).find(
      (profile) => profile.userId === userId
    );
  }

  async getFinancialProfileById(profileId: string): Promise<FinancialProfile | undefined> {
    console.log(`Looking for profile by ID: ${profileId}`);
    const profile = this.financialProfiles.get(profileId);
    console.log(`Found profile by ID:`, profile ? 'Yes' : 'No');
    return profile;
  }

  async createFinancialProfile(insertProfile: InsertFinancialProfile): Promise<FinancialProfile> {
    const id = randomUUID();
    const profile: FinancialProfile = { 
      ...insertProfile, 
      id,
      userId: insertProfile.userId || null,
      ppfAmount: insertProfile.ppfAmount || null,
      elssAmount: insertProfile.elssAmount || null,
      stockPicks: insertProfile.stockPicks ? [...insertProfile.stockPicks] : null,
      riskTolerance: insertProfile.riskTolerance || null,
      investmentHorizon: insertProfile.investmentHorizon || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.financialProfiles.set(id, profile);
    return profile;
  }

  async updateFinancialProfile(id: string, updates: Partial<FinancialProfile>): Promise<FinancialProfile | undefined> {
    const existing = this.financialProfiles.get(id);
    if (!existing) return undefined;

    const updated: FinancialProfile = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.financialProfiles.set(id, updated);
    return updated;
  }

  // Reality Check methods
  async getRealityCheckResult(profileId: string): Promise<RealityCheckResult | undefined> {
    return Array.from(this.realityCheckResults.values()).find(
      (result) => result.profileId === profileId
    );
  }

  async createRealityCheckResult(insertResult: InsertRealityCheckResult): Promise<RealityCheckResult> {
    const id = randomUUID();
    const result: RealityCheckResult = {
      ...insertResult,
      id,
      profileId: insertResult.profileId || null,
      healthScore: insertResult.healthScore || null,
      savingsRate: insertResult.savingsRate || null,
      debtRatio: insertResult.debtRatio || null,
      emergencyFundMonths: insertResult.emergencyFundMonths || null,
      retirementStatus: insertResult.retirementStatus || null,
      optimizedAllocation: insertResult.optimizedAllocation || null,
      aiAdvice: insertResult.aiAdvice || null,
      createdAt: new Date()
    };
    this.realityCheckResults.set(id, result);
    return result;
  }

  // Market Data methods
  async getMarketData(symbol: string, exchange: string): Promise<MarketData | undefined> {
    const key = `${symbol}-${exchange}`;
    return this.marketData.get(key);
  }

  async getAllMarketData(): Promise<MarketData[]> {
    return Array.from(this.marketData.values());
  }

  async upsertMarketData(insertData: InsertMarketData): Promise<MarketData> {
    const key = `${insertData.symbol}-${insertData.exchange}`;
    const existing = this.marketData.get(key);

    const data: MarketData = {
      id: existing?.id || randomUUID(),
      ...insertData,
      currentPrice: insertData.currentPrice || null,
      percentChange: insertData.percentChange || null,
      volume: insertData.volume || null,
      lastUpdated: new Date()
    };

    this.marketData.set(key, data);
    return data;
  }

  // Goal Calculation methods
  async getGoalCalculation(profileId: string, goalType: string): Promise<GoalCalculation | undefined> {
    return Array.from(this.goalCalculations.values()).find(
      (calc) => calc.profileId === profileId && calc.goalType === goalType
    );
  }

  async createGoalCalculation(insertCalc: InsertGoalCalculation): Promise<GoalCalculation> {
    const id = randomUUID();
    const calculation: GoalCalculation = {
      ...insertCalc,
      id,
      profileId: insertCalc.profileId || null,
      requiredSip: insertCalc.requiredSip || null,
      totalInvestment: insertCalc.totalInvestment || null,
      totalReturns: insertCalc.totalReturns || null,
      inflationAdjustedGoal: insertCalc.inflationAdjustedGoal || null,
      successProbability: insertCalc.successProbability || null,
      createdAt: new Date()
    };
    this.goalCalculations.set(id, calculation);
    return calculation;
  }
}

export const storage = new MemStorage();