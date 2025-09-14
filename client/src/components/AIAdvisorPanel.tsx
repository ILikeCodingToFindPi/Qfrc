import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface AIAdvisorPanelProps {
  data: any;
}

export default function AIAdvisorPanel({ data }: AIAdvisorPanelProps) {
  if (!data || !data.advice) return null;

  const riskLevelColors = {
    low: 'bg-accent/10 text-accent',
    medium: 'bg-secondary/10 text-secondary',
    high: 'bg-destructive/10 text-destructive'
  };

  const riskLevelIcons = {
    low: 'fas fa-check-circle',
    medium: 'fas fa-clock',
    high: 'fas fa-exclamation-triangle'
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader className="pb-6">
            <div className="flex items-center mb-6">
              <div className="bg-primary/10 p-3 rounded-full mr-4">
                <i className="fas fa-robot text-primary text-2xl"></i>
              </div>
              <div>
                <CardTitle className="text-2xl">AI Financial Advisor</CardTitle>
                <p className="text-muted-foreground">
                  Powered by GPT-5 - No sugar-coating, just facts
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="bg-muted/50 rounded-lg p-6 mb-6">
              <div className="prose prose-sm max-w-none text-foreground" data-testid="ai-advice-content">
                {data.advice.advice ? (
                  <div dangerouslySetInnerHTML={{ __html: data.advice.advice.replace(/\n/g, '<br/>') }} />
                ) : (
                  <p>{data.aiAdvice || "Generating personalized advice..."}</p>
                )}
              </div>
            </div>

            {data.advice.actionItems && data.advice.actionItems.length > 0 && (
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Action Items</h4>
                <ul className="space-y-2">
                  {data.advice.actionItems.map((item: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <i className="fas fa-arrow-right text-primary text-xs mt-1"></i>
                      <span className="text-sm text-foreground" data-testid={`action-item-${index}`}>
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              <div className={`rounded-lg p-4 text-center ${
                data.advice.riskLevel === 'high' ? riskLevelColors.high :
                data.advice.riskLevel === 'medium' ? riskLevelColors.medium :
                riskLevelColors.low
              }`}>
                <i className={`${
                  data.advice.riskLevel === 'high' ? riskLevelIcons.high :
                  data.advice.riskLevel === 'medium' ? riskLevelIcons.medium :
                  riskLevelIcons.low
                } text-2xl mb-2`}></i>
                <h3 className="font-semibold mb-1" data-testid="risk-level">
                  {data.advice.riskLevel === 'high' ? 'High Risk' :
                   data.advice.riskLevel === 'medium' ? 'Medium Risk' : 'Low Risk'}
                </h3>
                <p className="text-xs opacity-75">
                  {data.advice.riskLevel === 'high' ? 'Immediate action needed' :
                   data.advice.riskLevel === 'medium' ? 'Monitor and adjust' : 'Generally stable'}
                </p>
              </div>

              <div className="bg-secondary/10 rounded-lg p-4 text-center text-secondary">
                <i className="fas fa-clock text-2xl mb-2"></i>
                <h3 className="font-semibold mb-1">Time Sensitive</h3>
                <p className="text-xs text-muted-foreground">Emergency fund building</p>
              </div>

              <div className="bg-accent/10 rounded-lg p-4 text-center text-accent">
                <i className="fas fa-chart-line text-2xl mb-2"></i>
                <h3 className="font-semibold mb-1">Opportunity</h3>
                <p className="text-xs text-muted-foreground">Portfolio optimization</p>
              </div>
            </div>

            {data.advice.realityCheck && (
              <div className="mt-6 border-l-4 border-primary bg-primary/5 p-4 rounded">
                <p className="text-sm font-medium text-foreground" data-testid="reality-check-message">
                  <strong>Reality Check:</strong> {data.advice.realityCheck}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
