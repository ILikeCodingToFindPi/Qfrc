import { GoogleGenAI } from "@google/genai";
import { FinancialProfile, RealityCheckResult } from '@shared/schema';

const genai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "" 
});

interface FinancialAdvice {
  advice: string;
  riskLevel: 'low' | 'medium' | 'high';
  actionItems: string[];
  realityCheck: string;
}

class AIFinancialAdvisor {
  private async retryWithBackoff<T>(fn: () => Promise<T>, maxRetries: number = 3, baseDelay: number = 1000): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        console.log(`AI API attempt ${attempt}/${maxRetries} failed:`, error.message);
        
        if (attempt === maxRetries) {
          throw error;
        }
        
        // Exponential backoff: 1s, 2s, 4s
        const delay = baseDelay * Math.pow(2, attempt - 1);
        console.log(`Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    throw new Error('Max retries exceeded');
  }

  async generateAdvice(profile: FinancialProfile, results: RealityCheckResult): Promise<FinancialAdvice> {
    try {
      const prompt = this.buildPrompt(profile, results);
      
      const response = await this.retryWithBackoff(async () => {
        return await genai.models.generateContent({
          model: "gemini-2.5-flash", // Use flash model which is more stable
          config: {
            systemInstruction: "You are a brutally honest Indian financial advisor. Give direct, no-nonsense advice about Indian financial planning. Use Indian context (rupees, PPF, ELSS, NSE/BSE, etc.). Be harsh but constructive. Include specific actionable steps.",
            responseMimeType: "application/json",
            responseSchema: {
              type: "object",
              properties: {
                advice: { type: "string" },
                actionItems: { 
                  type: "array",
                  items: { type: "string" }
                },
                realityCheck: { type: "string" }
              },
              required: ["advice", "actionItems", "realityCheck"]
            }
          },
          contents: prompt
        });
      });

      const result = JSON.parse(response.text || '{}');
      
      return {
        advice: result.advice || "Unable to generate advice at this time.",
        riskLevel: this.determineRiskLevel(results),
        actionItems: result.actionItems || [],
        realityCheck: result.realityCheck || ""
      };

    } catch (error) {
      console.error('Error generating AI advice:', error);
      
      // Provide comprehensive fallback advice based on their financial data
      const monthlyIncome = profile.monthlyIncome || 0;
      const monthlyExpenses = profile.monthlyExpenses || 0;
      const savingsRate = results.savingsRate || 0;
      const debtRatio = results.debtRatio || 0;
      
      return {
        advice: this.getFallbackAdvice(savingsRate, debtRatio, monthlyIncome, monthlyExpenses, results.emergencyFundMonths || 0),
        riskLevel: this.determineRiskLevel(results),
        actionItems: this.getFallbackActionItems(savingsRate, debtRatio, results.emergencyFundMonths || 0),
        realityCheck: this.getFallbackRealityCheck(savingsRate, debtRatio, results.healthScore || 0)
      };
    }
  }

  private getFallbackAdvice(savingsRate: number, debtRatio: number, income: number, expenses: number, emergencyMonths: number): string {
    let advice = "Based on your financial profile: ";
    
    if (savingsRate < 20) {
      advice += "Your savings rate is too low for India's inflation reality. You're barely keeping up with 6-7% inflation. ";
    }
    
    if (debtRatio > 40) {
      advice += "Your debt burden is crushing your wealth-building potential. Every rupee going to EMIs is a rupee not growing your future. ";
    }
    
    if (emergencyMonths < 6) {
      advice += "You're one crisis away from financial disaster. Build that emergency fund before any investments. ";
    }
    
    advice += "The brutal truth: Most Indians think FDs at 6.5% are 'safe' while inflation eats 6.2% - that's just 0.3% real return. ";
    advice += "You need equity exposure for real wealth creation. Start SIPs in index funds, max out your ELSS for 80C benefits, and stop treating insurance as investment.";
    
    return advice;
  }

  private getFallbackActionItems(savingsRate: number, debtRatio: number, emergencyMonths: number): string[] {
    const actions = [];
    
    if (emergencyMonths < 6) {
      actions.push("Build emergency fund: Save ₹10-15K monthly until you have 6 months expenses");
    }
    
    if (savingsRate < 20) {
      actions.push("Cut lifestyle inflation: Reduce expenses by 15-20% to increase savings rate");
    }
    
    if (debtRatio > 30) {
      actions.push("Debt avalanche: Pay off highest interest debt first (credit cards, personal loans)");
    }
    
    actions.push("Start SIP: Invest ₹5000+ monthly in NIFTY 50 index fund for long-term wealth");
    actions.push("Max out ELSS: Use full ₹1.5L limit under 80C for tax savings + equity growth");
    actions.push("Avoid ULIPs: Separate insurance and investment - term insurance + mutual funds");
    
    return actions;
  }

  private getFallbackRealityCheck(savingsRate: number, debtRatio: number, healthScore: number): string {
    if (healthScore < 40) {
      return "Your financial situation needs immediate attention - you're in the danger zone.";
    } else if (healthScore < 60) {
      return "You're financially average, which means you're not building real wealth in India's inflation environment.";
    } else if (healthScore < 80) {
      return "Decent progress, but you need more aggressive wealth building to achieve financial freedom.";
    } else {
      return "Good financial discipline! Keep optimizing and stay the course for long-term wealth creation.";
    }
  }

  private buildPrompt(profile: FinancialProfile, results: RealityCheckResult): string {
    const monthlyIncome = profile.monthlyIncome?.toLocaleString('en-IN') || 'unknown';
    const monthlyExpenses = profile.monthlyExpenses?.toLocaleString('en-IN') || 'unknown';
    const currentSavings = profile.currentSavings?.toLocaleString('en-IN') || 'unknown';
    const totalDebts = profile.totalDebts?.toLocaleString('en-IN') || 'unknown';
    const savingsRate = results.savingsRate || 0;
    const debtRatio = results.debtRatio || 0;
    const emergencyFund = results.emergencyFundMonths || 0;

    return `
Analyze this Indian investor's financial situation and provide brutal honesty:

INCOME & EXPENSES:
- Monthly Income: ₹${monthlyIncome}
- Monthly Expenses: ₹${monthlyExpenses}
- Savings Rate: ${savingsRate}%

ASSETS & DEBTS:
- Current Savings: ₹${currentSavings}
- Total Debts: ₹${totalDebts}
- Debt-to-Income Ratio: ${debtRatio}%
- Emergency Fund: ${emergencyFund} months

INVESTMENTS:
- PPF: ₹${profile.ppfAmount?.toLocaleString('en-IN') || '0'}
- ELSS: ₹${profile.elssAmount?.toLocaleString('en-IN') || '0'}
- Stocks: ${profile.stockPicks?.join(', ') || 'None'}
- Risk Tolerance: ${profile.riskTolerance}/10
- Investment Horizon: ${profile.investmentHorizon}

CURRENT STATUS:
- Financial Health Score: ${results.healthScore}/100
- Retirement Status: ${results.retirementStatus}

Provide response in JSON format with these fields:
{
  "advice": "Brutally honest assessment of their financial situation in 2-3 paragraphs",
  "actionItems": ["Specific actionable step 1", "Specific actionable step 2", "Specific actionable step 3"],
  "realityCheck": "One harsh but motivating sentence about their financial reality"
}

Focus on:
- Indian inflation impact (6-7% annually)
- Real returns after inflation and taxes
- Retirement corpus needed (25-30x annual expenses)
- Common Indian investment mistakes (FDs, ULIPs, gold hoarding)
- Specific recommendations for their risk profile and horizon
    `;
  }

  private determineRiskLevel(results: RealityCheckResult): 'low' | 'medium' | 'high' {
    const debtRatio = results.debtRatio || 0;
    const emergencyFund = results.emergencyFundMonths || 0;
    
    if (debtRatio > 50 || emergencyFund < 3) {
      return 'high';
    } else if (debtRatio > 30 || emergencyFund < 6) {
      return 'medium';
    }
    return 'low';
  }

  async generateEducationalContent(topic: string): Promise<string> {
    try {
      const response = await genai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: "You are an Indian financial education expert. Explain complex financial concepts in simple Hindi/English terms with Indian examples and data."
        },
        contents: `Explain ${topic} in the context of Indian financial planning. Use current Indian data, examples, and debunk common myths.`
      });

      return response.text || "Educational content unavailable.";

    } catch (error) {
      console.error('Error generating educational content:', error);
      return "Unable to generate educational content at this time.";
    }
  }
}

export const aiAdvisor = new AIFinancialAdvisor();
