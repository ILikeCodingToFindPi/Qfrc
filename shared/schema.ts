import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, json, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const financialProfiles = pgTable("financial_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  monthlyIncome: real("monthly_income").notNull(),
  monthlyExpenses: real("monthly_expenses").notNull(),
  currentSavings: real("current_savings").notNull(),
  totalDebts: real("total_debts").notNull(),
  ppfAmount: real("ppf_amount").default(0),
  elssAmount: real("elss_amount").default(0),
  stockPicks: json("stock_picks").$type<string[]>().default([]),
  riskTolerance: integer("risk_tolerance").default(5), // 1-10 scale
  investmentHorizon: text("investment_horizon").default("5-10"), // 1-3, 3-5, 5-10, 10+
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const realityCheckResults = pgTable("reality_check_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").references(() => financialProfiles.id),
  healthScore: integer("health_score"),
  savingsRate: real("savings_rate"),
  debtRatio: real("debt_ratio"),
  emergencyFundMonths: real("emergency_fund_months"),
  retirementStatus: text("retirement_status"),
  optimizedAllocation: json("optimized_allocation").$type<Record<string, number>>(),
  aiAdvice: text("ai_advice"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const marketData = pgTable("market_data", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  symbol: text("symbol").notNull(),
  exchange: text("exchange").notNull(), // NSE, BSE
  currentPrice: real("current_price"),
  percentChange: real("percent_change"),
  volume: real("volume"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const goalCalculations = pgTable("goal_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").references(() => financialProfiles.id),
  goalType: text("goal_type").notNull(), // home, education, retirement
  targetAmount: real("target_amount").notNull(),
  yearsToGoal: integer("years_to_goal").notNull(),
  expectedReturn: real("expected_return").notNull(),
  requiredSip: real("required_sip"),
  totalInvestment: real("total_investment"),
  totalReturns: real("total_returns"),
  inflationAdjustedGoal: real("inflation_adjusted_goal"),
  successProbability: real("success_probability"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertFinancialProfileSchema = createInsertSchema(financialProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertRealityCheckResultSchema = createInsertSchema(realityCheckResults).omit({
  id: true,
  createdAt: true,
});

export const insertMarketDataSchema = createInsertSchema(marketData).omit({
  id: true,
  lastUpdated: true,
});

export const insertGoalCalculationSchema = createInsertSchema(goalCalculations).omit({
  id: true,
  createdAt: true,
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertFinancialProfile = z.infer<typeof insertFinancialProfileSchema>;
export type FinancialProfile = typeof financialProfiles.$inferSelect;
export type InsertRealityCheckResult = z.infer<typeof insertRealityCheckResultSchema>;
export type RealityCheckResult = typeof realityCheckResults.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;
export type MarketData = typeof marketData.$inferSelect;
export type InsertGoalCalculation = z.infer<typeof insertGoalCalculationSchema>;
export type GoalCalculation = typeof goalCalculations.$inferSelect;
