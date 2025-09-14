import { useState } from "react";
import LanguageSelector from "@/components/LanguageSelector";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fas fa-atom text-primary text-2xl"></i>
            <span className="text-xl font-bold text-foreground">QFRC</span>
            <span className="text-sm text-muted-foreground hidden sm:block">
              Quantum Finance Reality Check
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#dashboard" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-dashboard"
            >
              Dashboard
            </a>
            <a 
              href="#education" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-education"
            >
              Learn
            </a>
            <a 
              href="#calculator" 
              className="text-muted-foreground hover:text-primary transition-colors"
              data-testid="nav-calculator"
            >
              Calculator
            </a>
            <LanguageSelector />
            <button 
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
              data-testid="button-get-started"
            >
              Get Started
            </button>
          </nav>
          <button 
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-menu"
          >
            <i className="fas fa-bars text-xl"></i>
          </button>
        </div>
      </div>
    </header>
  );
}
