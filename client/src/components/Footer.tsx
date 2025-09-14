export default function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <i className="fas fa-atom text-primary text-xl"></i>
              <span className="text-lg font-bold text-foreground">QFRC</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Quantum Finance Reality Check - Your brutally honest Indian financial 
              advisor powered by AI and quantum algorithms.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="#portfolio" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-portfolio-optimization"
                >
                  Portfolio Optimization
                </a>
              </li>
              <li>
                <a 
                  href="#dashboard" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-reality-check-dashboard"
                >
                  Reality Check Dashboard
                </a>
              </li>
              <li>
                <a 
                  href="#advisor" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-ai-financial-advisor"
                >
                  AI Financial Advisor
                </a>
              </li>
              <li>
                <a 
                  href="#calculator" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-goal-calculator"
                >
                  Goal Calculator
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Education</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a 
                  href="#education" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-financial-myths"
                >
                  Financial Myths
                </a>
              </li>
              <li>
                <a 
                  href="#basics" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-investment-basics"
                >
                  Investment Basics
                </a>
              </li>
              <li>
                <a 
                  href="#tax" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-tax-planning"
                >
                  Tax Planning
                </a>
              </li>
              <li>
                <a 
                  href="#retirement" 
                  className="hover:text-primary transition-colors"
                  data-testid="link-retirement-planning"
                >
                  Retirement Planning
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/deeptarka" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-twitter"
                title="Follow DEEPTARKA on Twitter"
              >
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a 
                href="https://linkedin.com/in/deeptarka" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-linkedin"
                title="Connect with DEEPTARKA on LinkedIn"
              >
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a 
                href="https://github.com/deeptarka" 
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="link-github"
                title="View DEEPTARKA's projects on GitHub"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2024 Quantum Finance Reality Check. Created by{" "}
            <a 
              href="https://github.com/deeptarka" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              DEEPTARKA
            </a>
            . Built with React, Node.js, and Quantum Computing.{" "}
            <strong>Disclaimer:</strong> Not financial advice. Educational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
