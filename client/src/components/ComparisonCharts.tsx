import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from "recharts";

export default function ComparisonCharts() {
  // Historical asset class performance data (10 years)
  const assetClassData = [
    { name: 'Year 1', Equity: 15.2, FD: 6.5, Gold: 12.1 },
    { name: 'Year 2', Equity: -8.5, FD: 6.8, Gold: 5.6 },
    { name: 'Year 3', Equity: 27.8, FD: 7.1, Gold: -1.2 },
    { name: 'Year 4', Equity: 18.9, FD: 6.4, Gold: 8.7 },
    { name: 'Year 5', Equity: -2.1, FD: 6.2, Gold: 15.3 },
    { name: 'Year 6', Equity: 31.2, FD: 5.9, Gold: 4.8 },
    { name: 'Year 7', Equity: 12.7, FD: 6.1, Gold: 9.2 },
    { name: 'Year 8', Equity: 16.8, FD: 6.3, Gold: 6.4 },
    { name: 'Year 9', Equity: -7.3, FD: 6.0, Gold: 11.8 },
    { name: 'Year 10', Equity: 24.1, FD: 6.2, Gold: 7.9 }
  ];

  // SIP vs Lump Sum scenarios
  const sipVsLumpSum = [
    { scenario: 'Bull Market Entry', SIP: 12.8, LumpSum: 18.2 },
    { scenario: 'Bear Market Entry', SIP: 12.8, LumpSum: 8.4 },
    { scenario: 'Volatile Market', SIP: 12.8, LumpSum: 11.6 },
    { scenario: 'Sideways Market', SIP: 12.8, LumpSum: 9.8 },
    { scenario: 'Recovery Phase', SIP: 12.8, LumpSum: 15.7 }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Investment Comparison Charts
          </h2>
          <p className="text-muted-foreground">
            See how different Indian investment options stack up over time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Equity vs FD vs Gold (10 Year Returns)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assetClassData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value}%`, '']} />
                  <Bar dataKey="Equity" fill="hsl(214, 84%, 56%)" name="Equity (12.8% CAGR)" />
                  <Bar dataKey="FD" fill="hsl(24, 95%, 53%)" name="FD (6.5% CAGR)" />
                  <Bar dataKey="Gold" fill="hsl(160, 84%, 39%)" name="Gold (8.2% CAGR)" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <p>• Equity: 12.8% CAGR with higher volatility</p>
                <p>• FD: 6.5% CAGR with stability</p>
                <p>• Gold: 8.2% CAGR with moderate volatility</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SIP vs Lump Sum (Market Timing Impact)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={sipVsLumpSum}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="scenario" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => [`${value}% CAGR`, '']} />
                  <Bar dataKey="SIP" fill="hsl(214, 84%, 56%)" name="SIP" />
                  <Bar dataKey="LumpSum" fill="hsl(24, 95%, 53%)" name="Lump Sum" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 text-xs text-muted-foreground space-y-1">
                <p>• SIP: Consistent 12.8% CAGR regardless of market timing</p>
                <p>• Lump Sum: 8-18% range based on entry timing</p>
                <p>• SIP reduces timing risk and builds discipline</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Key Investment Insights for Indian Investors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="text-center p-4 bg-primary/5 rounded-lg">
                <i className="fas fa-chart-line text-primary text-2xl mb-2"></i>
                <h4 className="font-semibold text-foreground mb-2">Equity Advantage</h4>
                <p className="text-muted-foreground">
                  Over 10+ years, equity consistently outperforms FDs and gold, 
                  making it essential for long-term wealth creation.
                </p>
              </div>

              <div className="text-center p-4 bg-accent/5 rounded-lg">
                <i className="fas fa-calendar-alt text-accent text-2xl mb-2"></i>
                <h4 className="font-semibold text-foreground mb-2">SIP Discipline</h4>
                <p className="text-muted-foreground">
                  Systematic investing removes emotion and timing risk, 
                  delivering more predictable returns than lump sum investing.
                </p>
              </div>

              <div className="text-center p-4 bg-secondary/5 rounded-lg">
                <i className="fas fa-balance-scale text-secondary text-2xl mb-2"></i>
                <h4 className="font-semibold text-foreground mb-2">Inflation Protection</h4>
                <p className="text-muted-foreground">
                  Only equity-heavy portfolios consistently beat inflation over time. 
                  FDs barely keep up, while gold provides moderate protection.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
