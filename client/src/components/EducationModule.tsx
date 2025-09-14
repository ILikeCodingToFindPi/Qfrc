import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function EducationModule() {
  const [isReading, setIsReading] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState(typeof window !== 'undefined' && 'speechSynthesis' in window);

  const readAloud = (text: string, moduleId: string) => {
    if (!speechSupported) {
      alert('Speech synthesis not supported in your browser');
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    if (isReading === moduleId) {
      setIsReading(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;
    
    utterance.onstart = () => setIsReading(moduleId);
    utterance.onend = () => setIsReading(null);
    utterance.onerror = () => setIsReading(null);

    window.speechSynthesis.speak(utterance);
  };

  const educationModules = [
    {
      id: "fd-myth",
      icon: "fas fa-times-circle",
      iconColor: "text-destructive",
      bgColor: "bg-destructive/10",
      title: "Myth: FDs are Safe Investments",
      description: "Fixed Deposits at 6.5% vs Inflation at 6.2% = Real return of just 0.3%. You're barely preserving wealth, not growing it.",
      metrics: [
        { label: "FD Return", value: "6.5%", color: "" },
        { label: "Inflation", value: "6.2%", color: "text-destructive" },
        { label: "Real Return", value: "0.3%", color: "text-secondary" }
      ]
    },
    {
      id: "sip-reality",
      icon: "fas fa-chart-bar",
      iconColor: "text-accent",
      bgColor: "bg-accent/10",
      title: "SIP vs Lump Sum Reality",
      description: "SIP in NIFTY 50 for 10 years: 12.8% CAGR. Lump sum timing matters, but SIP wins with discipline and removes emotion.",
      metrics: [
        { label: "SIP ₹10k/month", value: "₹23.2L after 10y", color: "text-accent" },
        { label: "Investment", value: "₹12L", color: "" },
        { label: "Profit", value: "₹11.2L", color: "text-accent" }
      ]
    },
    {
      id: "insurance-investment",
      icon: "fas fa-shield-alt",
      iconColor: "text-secondary",
      bgColor: "bg-secondary/10",
      title: "Insurance ≠ Investment",
      description: "ULIPs give 4-6% returns vs Term + Mutual Fund giving 12%+. Don't mix insurance with investment.",
      metrics: [
        { label: "ULIP Returns", value: "4-6%", color: "text-destructive" },
        { label: "Term + MF", value: "12%+", color: "text-accent" },
        { label: "Better by", value: "6-8%", color: "text-accent" }
      ]
    }
  ];

  return (
    <section className="py-16" id="education">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Financial Literacy Hub
          </h2>
          <p className="text-muted-foreground">
            Debunking common Indian financial myths with data
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {educationModules.map((module, index) => (
            <Card key={module.id} className="hover:shadow-xl transition-shadow" data-testid={`education-card-${index}`}>
              <CardContent className="p-6">
                <div className={`${module.bgColor} p-3 rounded-full w-fit mb-4`}>
                  <i className={`${module.icon} ${module.iconColor} text-xl`}></i>
                </div>
                
                <CardTitle className="text-xl mb-3">{module.title}</CardTitle>
                
                <p className="text-muted-foreground mb-4 text-sm">
                  {module.description}
                </p>

                <div className="bg-muted/50 rounded-lg p-3 mb-4">
                  {module.metrics.map((metric, metricIndex) => (
                    <div key={metricIndex} className="flex justify-between text-sm">
                      <span>{metric.label}:</span>
                      <span className={`font-semibold ${metric.color}`}>
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => readAloud(module.description, module.id)}
                    className="flex items-center gap-1"
                    disabled={!speechSupported}
                  >
                    <i className={`fas ${isReading === module.id ? 'fa-stop' : 'fa-volume-up'} text-sm`}></i>
                    {isReading === module.id ? 'Stop' : 'Read'}
                  </Button>
                  <Button 
                    variant="link" 
                    className="text-primary hover:text-primary/80 font-medium p-0 h-auto"
                    data-testid={`button-learn-more-${index}`}
                  >
                    Learn More →
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
