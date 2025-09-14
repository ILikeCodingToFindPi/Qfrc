// Translation service for QFRC - Supporting Hindi and English

export type Language = 'en' | 'hi';

export interface TranslationData {
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  startRealityCheckBtn: string;
  watchDemoBtn: string;
  demoTitle: string;
  demoSteps: {
    step1: string;
    step2: string;
    step3: string;
  };
  
  // Financial Input Form
  formTitle: string;
  basicInfo: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  currentSavings: string;
  totalDebts: string;
  investments: string;
  ppfAmount: string;
  elssAmount: string;
  riskPreferences: string;
  riskTolerance: string;
  riskLow: string;
  riskModerate: string;
  riskHigh: string;
  investmentHorizon: string;
  horizon1to3: string;
  horizon3to5: string;
  horizon5to10: string;
  horizon10plus: string;
  startAnalysisBtn: string;
  loadingAnalysis: string;
  
  // Reality Check Dashboard
  dashboardTitle: string;
  dashboardSubtitle: string;
  healthScoreTitle: string;
  inflationImpactTitle: string;
  currentVsOptimized: string;
  currentAllocation: string;
  optimizedAllocation: string;
  keyInsights: string;
  expectedReturn: string;
  portfolioRisk: string;
  sharpeRatio: string;
  
  // AI Advisor Panel
  aiAdvisorTitle: string;
  aiAdvisorSubtitle: string;
  actionItems: string;
  riskAssessment: string;
  riskLowLabel: string;
  riskMediumLabel: string;
  riskHighLabel: string;
  
  // Goal Calculator
  goalCalculatorTitle: string;
  goalType: string;
  targetAmount: string;
  yearsToGoal: string;
  expectedReturnRate: string;
  calculateBtn: string;
  goalResults: string;
  monthlySipRequired: string;
  totalInvestment: string;
  wealthGrowth: string;
  
  // Goal Types
  goals: {
    home: string;
    homeDesc: string;
    education: string;
    educationDesc: string;
    retirement: string;
    retirementDesc: string;
    business: string;
    businessDesc: string;
  };
  
  // Footer
  footerDescription: string;
  featuresTitle: string;
  portfolioOptimization: string;
  realityCheckDashboard: string;
  aiFinancialAdvisor: string;
  goalCalculator: string;
  educationTitle: string;
  financialMyths: string;
  investmentBasics: string;
  marketInsights: string;
  supportTitle: string;
  contact: string;
  faq: string;
  disclaimer: string;
  
  // Common
  loading: string;
  error: string;
  success: string;
  cancel: string;
  save: string;
  back: string;
  next: string;
  
  // Error Messages
  errorCreateProfile: string;
  errorCalculateGoal: string;
  errorGeneral: string;
  
  // Success Messages
  successProfile: string;
  successGoal: string;
}

const englishTranslations: TranslationData = {
  // Hero Section
  heroTitle: "Your Brutally Honest Financial Reality Check",
  heroSubtitle: "Get quantum-powered portfolio optimization, real-time NSE/BSE data, and AI-driven advice that cuts through Indian financial myths. No sugar-coating, just facts.",
  startRealityCheckBtn: "Start Reality Check",
  watchDemoBtn: "Watch Demo",
  demoTitle: "QFRC Demo - How It Works",
  demoSteps: {
    step1: "Enter your complete financial picture - income, expenses, investments, and goals",
    step2: "Quantum algorithms analyze your financial health brutally",
    step3: "Receive honest advice and actionable investment strategies"
  },
  
  // Financial Input Form
  formTitle: "Tell Us About Your Finances",
  basicInfo: "Basic Information",
  monthlyIncome: "Monthly Income (₹)",
  monthlyExpenses: "Monthly Expenses (₹)", 
  currentSavings: "Current Savings (₹)",
  totalDebts: "Total Debts (₹)",
  investments: "Current Investments",
  ppfAmount: "PPF Amount (₹)",
  elssAmount: "ELSS Amount (₹)",
  riskPreferences: "Risk Preferences",
  riskTolerance: "Risk Tolerance (1-10)",
  riskLow: "Conservative",
  riskModerate: "Moderate",
  riskHigh: "Aggressive", 
  investmentHorizon: "Investment Horizon",
  horizon1to3: "1-3 years",
  horizon3to5: "3-5 years",
  horizon5to10: "5-10 years",
  horizon10plus: "10+ years",
  startAnalysisBtn: "Start Analysis",
  loadingAnalysis: "Analyzing your finances...",
  
  // Reality Check Dashboard
  dashboardTitle: "Your Financial Reality Check",
  dashboardSubtitle: "Based on your inputs and current market conditions",
  healthScoreTitle: "Financial Health Score",
  inflationImpactTitle: "Inflation Impact on Goals",
  currentVsOptimized: "Current vs Optimized Allocation",
  currentAllocation: "Current Allocation",
  optimizedAllocation: "Optimized Allocation", 
  keyInsights: "Key Insights",
  expectedReturn: "Expected Return",
  portfolioRisk: "Portfolio Risk",
  sharpeRatio: "Sharpe Ratio",
  
  // AI Advisor Panel
  aiAdvisorTitle: "AI Financial Advisor",
  aiAdvisorSubtitle: "Powered by GPT-5 - No sugar-coating, just facts",
  actionItems: "Action Items",
  riskAssessment: "Risk Assessment",
  riskLowLabel: "Low Risk",
  riskMediumLabel: "Medium Risk", 
  riskHighLabel: "High Risk",
  
  // Goal Calculator
  goalCalculatorTitle: "Goal Calculator",
  goalType: "Goal Type",
  targetAmount: "Target Amount (₹)",
  yearsToGoal: "Years to Goal",
  expectedReturnRate: "Expected Return Rate (%)",
  calculateBtn: "Calculate Goal",
  goalResults: "Goal Results",
  monthlySipRequired: "Monthly SIP Required",
  totalInvestment: "Total Investment",
  wealthGrowth: "Wealth Growth",
  
  // Goal Types
  goals: {
    home: "Home Purchase",
    homeDesc: "Buy your dream home in India",
    education: "Child Education", 
    educationDesc: "Secure your child's educational future",
    retirement: "Retirement Planning",
    retirementDesc: "Plan for a comfortable retirement",
    business: "Business Startup",
    businessDesc: "Fund your entrepreneurial dreams"
  },
  
  // Footer
  footerDescription: "Quantum Finance Reality Check - Your brutally honest Indian financial advisor powered by AI and quantum algorithms.",
  featuresTitle: "Features",
  portfolioOptimization: "Portfolio Optimization",
  realityCheckDashboard: "Reality Check Dashboard", 
  aiFinancialAdvisor: "AI Financial Advisor",
  goalCalculator: "Goal Calculator",
  educationTitle: "Education",
  financialMyths: "Financial Myths",
  investmentBasics: "Investment Basics",
  marketInsights: "Market Insights",
  supportTitle: "Support",
  contact: "Contact",
  faq: "FAQ",
  disclaimer: "Disclaimer",
  
  // Common
  loading: "Loading...",
  error: "Error",
  success: "Success", 
  cancel: "Cancel",
  save: "Save",
  back: "Back",
  next: "Next",
  
  // Error Messages
  errorCreateProfile: "Failed to create financial profile",
  errorCalculateGoal: "Failed to calculate goal",
  errorGeneral: "Something went wrong. Please try again.",
  
  // Success Messages
  successProfile: "Financial profile created successfully",
  successGoal: "Goal calculated successfully"
};

const hindiTranslations: TranslationData = {
  // Hero Section
  heroTitle: "आपकी बेहद ईमानदार वित्तीय वास्तविकता जांच",
  heroSubtitle: "क्वांटम-पावर्ड पोर्टफोलियो ऑप्टिमाइजेशन, रियल-टाइम NSE/BSE डेटा, और AI-संचालित सलाह प्राप्त करें जो भारतीय वित्तीय मिथकों को तोड़ती है। कोई चीनी-कोटिंग नहीं, सिर्फ तथ्य।",
  startRealityCheckBtn: "रियलिटी चेक शुरू करें",
  watchDemoBtn: "डेमो देखें",
  demoTitle: "QFRC डेमो - यह कैसे काम करता है",
  demoSteps: {
    step1: "अपनी पूर्ण वित्तीय तस्वीर दर्ज करें - आय, व्यय, निवेश और लक्ष्य",
    step2: "क्वांटम एल्गोरिदम आपके वित्तीय स्वास्थ्य का बेहद ईमानदार विश्लेषण करते हैं",
    step3: "ईमानदार सलाह और कार्ययोग्य निवेश रणनीति प्राप्त करें"
  },
  
  // Financial Input Form  
  formTitle: "हमें अपने वित्त के बारे में बताएं",
  basicInfo: "बुनियादी जानकारी",
  monthlyIncome: "मासिक आय (₹)",
  monthlyExpenses: "मासिक व्यय (₹)",
  currentSavings: "वर्तमान बचत (₹)",
  totalDebts: "कुल कर्ज (₹)",
  investments: "वर्तमान निवेश",
  ppfAmount: "PPF राशि (₹)",
  elssAmount: "ELSS राशि (₹)",
  riskPreferences: "जोखिम प्राथमिकताएं",
  riskTolerance: "जोखिम सहनशीलता (1-10)",
  riskLow: "रूढ़िवादी",
  riskModerate: "मध्यम",
  riskHigh: "आक्रामक",
  investmentHorizon: "निवेश अवधि",
  horizon1to3: "1-3 साल",
  horizon3to5: "3-5 साल", 
  horizon5to10: "5-10 साल",
  horizon10plus: "10+ साल",
  startAnalysisBtn: "विश्लेषण शुरू करें",
  loadingAnalysis: "आपके वित्त का विश्लेषण कर रहे हैं...",
  
  // Reality Check Dashboard
  dashboardTitle: "आपकी वित्तीय वास्तविकता जांच",
  dashboardSubtitle: "आपके इनपुट और वर्तमान बाजार स्थितियों के आधार पर",
  healthScoreTitle: "वित्तीय स्वास्थ्य स्कोर",
  inflationImpactTitle: "लक्ष्यों पर मुद्रास्फीति का प्रभाव",
  currentVsOptimized: "वर्तमान बनाम अनुकूलित आवंटन",
  currentAllocation: "वर्तमान आवंटन",
  optimizedAllocation: "अनुकूलित आवंटन",
  keyInsights: "मुख्य अंतर्दृष्टि",
  expectedReturn: "अपेक्षित रिटर्न",
  portfolioRisk: "पोर्टफोलियो जोखिम",
  sharpeRatio: "शार्प अनुपात",
  
  // AI Advisor Panel
  aiAdvisorTitle: "AI वित्तीय सलाहकार", 
  aiAdvisorSubtitle: "GPT-5 द्वारा संचालित - कोई चीनी-कोटिंग नहीं, सिर्फ तथ्य",
  actionItems: "कार्य सूची",
  riskAssessment: "जोखिम आकलन",
  riskLowLabel: "कम जोखिम",
  riskMediumLabel: "मध्यम जोखिम",
  riskHighLabel: "उच्च जोखिम",
  
  // Goal Calculator
  goalCalculatorTitle: "लक्ष्य कैलकुलेटर",
  goalType: "लक्ष्य प्रकार",
  targetAmount: "लक्ष्य राशि (₹)",
  yearsToGoal: "लक्ष्य तक वर्ष",
  expectedReturnRate: "अपेक्षित रिटर्न दर (%)",
  calculateBtn: "लक्ष्य गणना करें", 
  goalResults: "लक्ष्य परिणाम",
  monthlySipRequired: "आवश्यक मासिक SIP",
  totalInvestment: "कुल निवेश",
  wealthGrowth: "धन वृद्धि",
  
  // Goal Types
  goals: {
    home: "घर खरीदारी",
    homeDesc: "भारत में अपना सपनों का घर खरीदें",
    education: "बच्चे की शिक्षा",
    educationDesc: "अपने बच्चे के शैक्षणिक भविष्य को सुरक्षित करें",
    retirement: "सेवानिवृत्ति योजना", 
    retirementDesc: "आरामदायक सेवानिवृत्ति की योजना बनाएं",
    business: "व्यापार शुरुआत",
    businessDesc: "अपने उद्यमशीलता के सपनों को फंड करें"
  },
  
  // Footer
  footerDescription: "क्वांटम फाइनेंस रियलिटी चेक - AI और क्वांटम एल्गोरिदम द्वारा संचालित आपका बेहद ईमानदार भारतीय वित्तीय सलाहकार।",
  featuresTitle: "सुविधाएं",
  portfolioOptimization: "पोर्टफोलियो अनुकूलन", 
  realityCheckDashboard: "रियलिटी चेक डैशबोर्ड",
  aiFinancialAdvisor: "AI वित्तीय सलाहकार",
  goalCalculator: "लक्ष्य कैलकुलेटर",
  educationTitle: "शिक्षा",
  financialMyths: "वित्तीय मिथक",
  investmentBasics: "निवेश की मूल बातें",
  marketInsights: "बाजार अंतर्दृष्टि",
  supportTitle: "सहायता",
  contact: "संपर्क",
  faq: "FAQ",
  disclaimer: "अस्वीकरण",
  
  // Common
  loading: "लोड हो रहा है...",
  error: "त्रुटि",
  success: "सफलता",
  cancel: "रद्द करें",
  save: "सेव करें",
  back: "वापस",
  next: "अगला",
  
  // Error Messages
  errorCreateProfile: "वित्तीय प्रोफाइल बनाने में असफल",
  errorCalculateGoal: "लक्ष्य गणना करने में असफल", 
  errorGeneral: "कुछ गलत हो गया। कृपया पुन: प्रयास करें।",
  
  // Success Messages  
  successProfile: "वित्तीय प्रोफाइल सफलतापूर्वक बनाई गई",
  successGoal: "लक्ष्य सफलतापूर्वक गणना की गई"
};

export const translations: Record<Language, TranslationData> = {
  en: englishTranslations,
  hi: hindiTranslations
};

export class TranslationService {
  private currentLanguage: Language = 'en';
  private listeners: Array<(language: Language) => void> = [];

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    this.listeners.forEach(listener => listener(language));
  }

  translate(key: keyof TranslationData): string {
    return translations[this.currentLanguage][key] as string;
  }

  translateNested(key: string): any {
    const keys = key.split('.');
    let current: any = translations[this.currentLanguage];
    
    for (const k of keys) {
      current = current?.[k];
      if (current === undefined) {
        console.warn(`Translation missing for key: ${key}`);
        return key;
      }
    }
    
    return current;
  }

  onLanguageChange(listener: (language: Language) => void): () => void {
    this.listeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

// Singleton instance
export const translationService = new TranslationService();