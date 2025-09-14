import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { marketDataService } from "./services/marketData";
import { quantumOptimizer } from "./services/quantumOptimizer";
import { aiAdvisor } from "./services/aiAdvisor";
import { insertFinancialProfileSchema, insertGoalCalculationSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Market data endpoints
  app.get("/api/market-data/live", async (req, res) => {
    try {
      await marketDataService.fetchLiveData();
      const marketData = await storage.getAllMarketData();
      res.json(marketData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch market data" });
    }
  });

  app.get("/api/market-data/popular", async (req, res) => {
    try {
      const popularStocks = await marketDataService.getPopularStocks();
      res.json(popularStocks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch popular stocks" });
    }
  });

  app.get("/api/market-data/indices", async (req, res) => {
    try {
      const indices = await marketDataService.getIndexData();
      res.json(indices);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch index data" });
    }
  });

  // Financial profile endpoints
  app.post("/api/financial-profile", async (req, res) => {
    try {
      const result = insertFinancialProfileSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input data", details: result.error });
      }

      const profile = await storage.createFinancialProfile(result.data);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to create financial profile" });
    }
  });

  app.get("/api/financial-profile/:userId", async (req, res) => {
    try {
      const profile = await storage.getFinancialProfile(req.params.userId);
      if (!profile) {
        return res.status(404).json({ error: "Financial profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch financial profile" });
    }
  });

  // Reality check endpoint
  app.post("/api/reality-check", async (req, res) => {
    try {
      const { profileId } = req.body;
      if (!profileId) {
        return res.status(400).json({ error: "Profile ID is required" });
      }

      console.log(`Reality check requested for profileId: ${profileId}`);
      
      // Get the financial profile by ID
      const profile = await storage.getFinancialProfileById(profileId);
      
      if (!profile) {
        console.log(`Profile not found for ID: ${profileId}`);
        return res.status(404).json({ error: "Financial profile not found" });
      }
      
      console.log(`Found profile for reality check`);

      // Calculate financial health metrics
      const monthlyIncome = profile.monthlyIncome || 0;
      const monthlyExpenses = profile.monthlyExpenses || 0;
      const currentSavings = profile.currentSavings || 0;
      const totalDebts = profile.totalDebts || 0;

      const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100 : 0;
      const debtRatio = monthlyIncome > 0 ? (totalDebts / (monthlyIncome * 12)) * 100 : 0;
      const emergencyFundMonths = monthlyExpenses > 0 ? currentSavings / monthlyExpenses : 0;
      
      // Calculate health score (0-100)
      let healthScore = 0;
      if (savingsRate >= 20) healthScore += 30;
      else if (savingsRate >= 10) healthScore += 15;
      
      if (debtRatio <= 30) healthScore += 25;
      else if (debtRatio <= 50) healthScore += 10;
      
      if (emergencyFundMonths >= 6) healthScore += 25;
      else if (emergencyFundMonths >= 3) healthScore += 15;
      
      if (profile.ppfAmount && profile.elssAmount) healthScore += 20;
      else if (profile.ppfAmount || profile.elssAmount) healthScore += 10;

      // Determine retirement status
      let retirementStatus = "Behind";
      if (healthScore >= 80) retirementStatus = "On Track";
      else if (healthScore >= 60) retirementStatus = "Needs Attention";

      // Get quantum-optimized portfolio allocation
      const optimizationResult = await quantumOptimizer.optimizePortfolio(profile);

      // Create reality check result
      const realityCheckResult = await storage.createRealityCheckResult({
        profileId,
        healthScore: Math.round(healthScore),
        savingsRate: Math.round(savingsRate * 100) / 100,
        debtRatio: Math.round(debtRatio * 100) / 100,
        emergencyFundMonths: Math.round(emergencyFundMonths * 10) / 10,
        retirementStatus,
        optimizedAllocation: optimizationResult.allocation,
        aiAdvice: ""
      });

      // Generate AI advice
      const advice = await aiAdvisor.generateAdvice(profile, realityCheckResult);
      
      // Update the result with AI advice
      const updatedResult = await storage.createRealityCheckResult({
        ...realityCheckResult,
        aiAdvice: advice.advice
      });

      res.json({
        ...updatedResult,
        optimizationResult,
        advice
      });

    } catch (error) {
      console.error('Reality check error:', error);
      res.status(500).json({ error: "Failed to generate reality check" });
    }
  });

  // Goal calculation endpoint
  app.post("/api/calculate-goal", async (req, res) => {
    try {
      const result = insertGoalCalculationSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ error: "Invalid input data", details: result.error });
      }

      const { targetAmount, yearsToGoal, expectedReturn, profileId, goalType } = result.data;
      
      // Calculate SIP requirement using compound interest formula
      const monthlyReturn = expectedReturn / 100 / 12;
      const totalMonths = yearsToGoal * 12;
      const requiredSip = targetAmount * monthlyReturn / (Math.pow(1 + monthlyReturn, totalMonths) - 1);
      const totalInvestment = requiredSip * totalMonths;
      const totalReturns = targetAmount - totalInvestment;
      
      // Adjust for inflation (assume 6% inflation)
      const inflationRate = 0.06;
      const inflationAdjustedGoal = targetAmount * Math.pow(1 + inflationRate, yearsToGoal);
      
      // Calculate success probability (simplified Monte Carlo)
      const volatility = expectedReturn > 10 ? 15 : 8; // Higher volatility for equity-heavy portfolios
      const successProbability = Math.max(0, Math.min(100, 
        85 - Math.abs(expectedReturn - 12) * 5 - Math.max(0, yearsToGoal - 20) * 2
      ));

      const goalCalculation = await storage.createGoalCalculation({
        profileId,
        goalType,
        targetAmount,
        yearsToGoal,
        expectedReturn,
        requiredSip: Math.round(requiredSip),
        totalInvestment: Math.round(totalInvestment),
        totalReturns: Math.round(totalReturns),
        inflationAdjustedGoal: Math.round(inflationAdjustedGoal),
        successProbability: Math.round(successProbability)
      });

      res.json(goalCalculation);

    } catch (error) {
      console.error('Goal calculation error:', error);
      res.status(500).json({ error: "Failed to calculate goal" });
    }
  });

  // Educational content endpoint
  app.get("/api/education/:topic", async (req, res) => {
    try {
      const { topic } = req.params;
      const content = await aiAdvisor.generateEducationalContent(topic);
      res.json({ content });
    } catch (error) {
      res.status(500).json({ error: "Failed to generate educational content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
