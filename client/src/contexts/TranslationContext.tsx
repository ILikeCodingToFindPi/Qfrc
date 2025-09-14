import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, TranslationData, translationService, translations } from '@/services/translationService';

interface TranslationContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof TranslationData) => string;
  tn: (key: string) => any; // For nested translations
  translations: TranslationData;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

interface TranslationProviderProps {
  children: ReactNode;
}

export function TranslationProvider({ children }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to load language preference from localStorage
    const saved = localStorage.getItem('qfrc-language');
    return (saved === 'hi' || saved === 'en') ? saved : 'en';
  });

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('qfrc-language', language);
    translationService.setLanguage(language);
  }, [language]);

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
  };

  const t = (key: keyof TranslationData): string => {
    return translationService.translate(key);
  };

  const tn = (key: string): any => {
    return translationService.translateNested(key);
  };

  const value: TranslationContextType = {
    language,
    setLanguage,
    t,
    tn,
    translations: translations[language]
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}