import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from "recharts";

interface RealityCheckDashboardProps {
  data: any;
}

export default function RealityCheckDashboard({ data }: RealityCheckDashboardProps) {
  if (!data) return null;

  // Mock inflation impact data
  const inflationData = Array.from({ length: 10 }, (_, i) => ({
    year: 2025 + i,
    nominal: 450000,
    real: 450000 * Math.pow(0.94, i), // 6% inflation effect
  }));

  const healthScoreColor = data.healthScore >= 80 ? 'text-accent' : 
                           data.healthScore >= 60 ? 'text-secondary' : 'text-destructive';

  const currentAllocation = [
    { name: 'PPF', value: 40, color: '#3b82f6' },
    { name: 'ELSS', value: 35, color: '#f59e0b' },
    { name: 'Stocks', value: 25, color: '#10b981' }
  ];

  const optimizedAllocation = Object.entries(data.optimizedAllocation || {}).map(([name, value]) => ({
    name,
    value: Math.round((value as number) * 100),
    color: name === 'Index Funds' ? '#3b82f6' : 
           name === 'PPF' ? '#f59e0b' : 
           name === 'Stocks' ? '#10b981' : 
           name === 'Bonds' ? '#8b5cf6' : '#ef4444'
  }));

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Your Financial Reality Check
          </h2>
          <p className="text-muted-foreground">
            Based on your inputs and current market conditions
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Key Metrics */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Financial Health Score
                </h3>
                <div className="text-center">
                  <div className="relative w-32 h-32 mx-auto mb-4">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(214.3, 31.8%, 91.4%)"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="hsl(24, 95%, 53%)"
                        strokeWidth="3"
                        strokeDasharray={`${data.healthScore}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className={`text-2xl font-bold ${healthScoreColor}`} data-testid="health-score">
                        {data.healthScore}/100
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {data.healthScore >= 80 ? 'Excellent' : 
                     data.healthScore >= 60 ? 'Needs Improvement' : 'Critical'}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Key Insights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Savings Rate</span>
                    <span className="font-semibold text-accent" data-testid="savings-rate">
                      {data.savingsRate}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Debt-to-Income</span>
                    <span className={`font-semibold ${data.debtRatio > 40 ? 'text-destructive' : 'text-accent'}`} data-testid="debt-ratio">
                      {data.debtRatio}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Emergency Fund</span>
                    <span className={`font-semibold ${data.emergencyFundMonths < 6 ? 'text-secondary' : 'text-accent'}`} data-testid="emergency-fund">
                      {data.emergencyFundMonths} months
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Retirement Goal</span>
                    <span className={`font-semibold ${data.retirementStatus === 'Behind' ? 'text-destructive' : 'text-accent'}`} data-testid="retirement-status">
                      {data.retirementStatus}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Inflation Impact on Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={inflationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                    <Line type="monotone" dataKey="nominal" stroke="#3b82f6" strokeWidth={2} name="Nominal Value" />
                    <Line type="monotone" dataKey="real" stroke="#ef4444" strokeWidth={2} name="Real Value" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Optimization Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Current Allocation</h4>
                    <div className="space-y-2">
                      {currentAllocation.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="font-medium" data-testid={`current-allocation-${item.name.toLowerCase()}`}>
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Quantum-Optimized</h4>
                    <div className="space-y-2">
                      {optimizedAllocation.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded" 
                              style={{ backgroundColor: item.color }}
                            ></div>
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <span className="font-medium text-accent" data-testid={`optimized-allocation-${item.name.toLowerCase().replace(' ', '-')}`}>
                            {item.value}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
