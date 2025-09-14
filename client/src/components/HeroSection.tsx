import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/contexts/TranslationContext';

export default function HeroSection() {
  const [showDemo, setShowDemo] = useState(false);
  const { t, tn } = useTranslation();
  
  const scrollToForm = () => {
    document.getElementById('financial-form')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <>
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              <span className="text-primary">{t('heroTitle')}</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={scrollToForm}
                className="bg-primary text-primary-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
                data-testid="button-start-reality-check"
              >
                <i className="fas fa-calculator mr-2"></i>
                {t('startRealityCheckBtn')}
              </button>
              <button 
                onClick={() => setShowDemo(true)}
                className="border border-border bg-card text-foreground px-8 py-4 rounded-lg text-lg font-semibold hover:bg-muted transition-colors"
                data-testid="button-watch-demo"
              >
                <i className="fas fa-play mr-2"></i>
                {t('watchDemoBtn')}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={showDemo} onOpenChange={setShowDemo}>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              <i className="fas fa-play text-primary mr-2"></i>
              {t('demoTitle')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <i className="fas fa-play-circle text-6xl text-primary mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">Interactive Demo</h3>
                <p className="text-muted-foreground">
                  Experience the full financial reality check process
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <i className="fas fa-chart-line text-3xl text-primary mb-3"></i>
                <h4 className="font-semibold mb-2">Input Your Data</h4>
                <p className="text-sm text-muted-foreground">
                  {tn('demoSteps.step1')}
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <i className="fas fa-brain text-3xl text-accent mb-3"></i>
                <h4 className="font-semibold mb-2">AI Analysis</h4>
                <p className="text-sm text-muted-foreground">
                  {tn('demoSteps.step2')}
                </p>
              </div>
              
              <div className="text-center p-4 border rounded-lg">
                <i className="fas fa-target text-3xl text-secondary mb-3"></i>
                <h4 className="font-semibold mb-2">Get Reality Check</h4>
                <p className="text-sm text-muted-foreground">
                  {tn('demoSteps.step3')}
                </p>
              </div>
            </div>
            
            <div className="bg-secondary/10 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">
                <i className="fas fa-info-circle text-primary mr-2"></i>
                What Makes QFRC Different?
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• <strong>Quantum-Inspired Optimization:</strong> Advanced algorithms for portfolio allocation</li>
                <li>• <strong>Indian Context:</strong> PPF, ELSS, NSE/BSE stocks, and local tax implications</li>
                <li>• <strong>Brutally Honest:</strong> No sugar-coating, just realistic financial projections</li>
                <li>• <strong>Real-time Data:</strong> Live market data for accurate analysis</li>
                <li>• <strong>AI-Powered Advice:</strong> Personalized recommendations based on your risk profile</li>
              </ul>
            </div>
            
            <div className="flex justify-center">
              <Button 
                onClick={() => {
                  setShowDemo(false);
                  setTimeout(scrollToForm, 100);
                }}
                className="px-8 py-3 text-lg"
              >
                <i className="fas fa-rocket mr-2"></i>
                {t('startRealityCheckBtn')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
