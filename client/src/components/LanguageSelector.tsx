import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/contexts/TranslationContext';
import { Language } from '@/services/translationService';

const languageOptions = [
  { 
    code: 'en' as Language, 
    name: 'English', 
    nativeName: 'English',
    flag: '🇺🇸'
  },
  { 
    code: 'hi' as Language, 
    name: 'Hindi', 
    nativeName: 'हिंदी',
    flag: '🇮🇳'
  }
];

export default function LanguageSelector() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languageOptions.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 bg-background/95 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-all"
          data-testid="language-selector-button"
        >
          <span className="text-lg">{currentLanguage?.flag}</span>
          <span className="hidden sm:inline font-medium">
            {currentLanguage?.nativeName}
          </span>
          <i className="fas fa-chevron-down text-xs opacity-60"></i>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[140px] bg-background/95 backdrop-blur-sm border-border/50"
      >
        {languageOptions.map((option) => (
          <DropdownMenuItem
            key={option.code}
            onClick={() => handleLanguageChange(option.code)}
            className={`flex items-center gap-2 cursor-pointer transition-colors ${
              language === option.code 
                ? 'bg-primary/10 text-primary' 
                : 'hover:bg-muted/50'
            }`}
            data-testid={`language-option-${option.code}`}
          >
            <span className="text-lg">{option.flag}</span>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{option.nativeName}</span>
              <span className="text-xs opacity-60">{option.name}</span>
            </div>
            {language === option.code && (
              <i className="fas fa-check text-primary text-xs ml-auto"></i>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}