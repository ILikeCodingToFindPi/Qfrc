import { useQuery } from "@tanstack/react-query";

export default function LiveMarketData() {
  const { data: marketData, isLoading } = useQuery({
    queryKey: ["/api/market-data/indices"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: popularStocks } = useQuery({
    queryKey: ["/api/market-data/popular"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <section className="bg-card border-b border-border py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-8">
            <span className="text-sm font-semibold text-muted-foreground">
              Loading market data...
            </span>
          </div>
        </div>
      </section>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(price);
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}%`;
  };

  return (
    <section className="bg-card border-b border-border py-4">
      <div className="container mx-auto px-4">
        <div className="flex items-center space-x-8 overflow-x-auto">
          <span className="text-sm font-semibold text-muted-foreground whitespace-nowrap">
            LIVE NSE/BSE:
          </span>
          <div className="flex space-x-6 live-data">
            {marketData?.nifty && (
              <div className="flex items-center space-x-2" data-testid="market-nifty">
                <span className="text-sm font-medium">NIFTY 50</span>
                <span className="text-accent font-semibold">
                  {marketData.nifty.currentPrice?.toFixed(2)}
                </span>
                <span className={`text-xs ${marketData.nifty.percentChange >= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {formatChange(marketData.nifty.percentChange)}
                </span>
              </div>
            )}
            
            {marketData?.sensex && (
              <div className="flex items-center space-x-2" data-testid="market-sensex">
                <span className="text-sm font-medium">SENSEX</span>
                <span className="text-accent font-semibold">
                  {marketData.sensex.currentPrice?.toFixed(2)}
                </span>
                <span className={`text-xs ${marketData.sensex.percentChange >= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {formatChange(marketData.sensex.percentChange)}
                </span>
              </div>
            )}

            {popularStocks?.slice(0, 3).map((stock, index) => (
              <div key={stock.id} className="flex items-center space-x-2" data-testid={`market-stock-${index}`}>
                <span className="text-sm font-medium">{stock.symbol}</span>
                <span className="text-accent font-semibold">
                  {formatPrice(stock.currentPrice)}
                </span>
                <span className={`text-xs ${stock.percentChange >= 0 ? 'text-accent' : 'text-destructive'}`}>
                  {formatChange(stock.percentChange)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
