import axios from 'axios';
import { storage } from '../storage';

interface NSEResponse {
  symbol: string;
  companyName: string;
  lastPrice: number;
  change: number;
  pChange: number;
  totalTradedVolume: number;
}

interface MarketDataService {
  fetchLiveData(): Promise<void>;
  getPopularStocks(): Promise<any[]>;
  getIndexData(): Promise<any>;
}

class NSEMarketDataService implements MarketDataService {
  private popularStocks = ['TCS', 'RELIANCE', 'HDFCBANK', 'INFY', 'ITC', 'SBIN', 'BHARTIARTL', 'KOTAKBANK', 'LT', 'ASIANPAINT'];
  private indices = ['^NSEI', '^BSESN']; // NIFTY 50, SENSEX

  async fetchLiveData(): Promise<void> {
    try {
      console.log('Generating mock market data for popular stocks...');
      
      // Generate realistic market data for popular stocks
      for (const symbol of this.popularStocks) {
        try {
          const mockData = this.generateRealisticMarketData(symbol);
          
          const marketData = await storage.upsertMarketData({
            symbol,
            exchange: 'NSE',
            currentPrice: mockData.price,
            percentChange: mockData.change,
            volume: mockData.volume
          });
          
          console.log(`Updated ${symbol}: ₹${mockData.price.toFixed(2)} (${mockData.change > 0 ? '+' : ''}${mockData.change.toFixed(2)}%)`);
        } catch (error) {
          console.error(`Error storing data for ${symbol}:`, error);
        }
      }

      // Update indices
      await this.updateIndices();
      console.log('Market data update completed');

    } catch (error) {
      console.error('Error in fetchLiveData:', error);
    }
  }

  private generateRealisticMarketData(symbol: string) {
    // Base prices for realistic simulation
    const basePrices: Record<string, number> = {
      'TCS': 4234,
      'RELIANCE': 2856,
      'HDFCBANK': 1743,
      'INFY': 1456,
      'ITC': 456,
      'SBIN': 623,
      'BHARTIARTL': 1234,
      'KOTAKBANK': 1876,
      'LT': 3456,
      'ASIANPAINT': 3234
    };

    const basePrice = basePrices[symbol] || 1000;
    const changePercent = (Math.random() - 0.5) * 4; // -2% to +2%
    const price = basePrice * (1 + changePercent / 100);
    const volume = Math.floor(Math.random() * 1000000) + 100000;

    return {
      price: Math.round(price * 100) / 100,
      change: Math.round(changePercent * 100) / 100,
      volume
    };
  }

  private async updateIndices() {
    // NIFTY 50
    const niftyData = {
      symbol: 'NIFTY50',
      exchange: 'NSE',
      currentPrice: 22143.75 + (Math.random() - 0.5) * 200,
      percentChange: 0.85 + (Math.random() - 0.5) * 0.5,
      volume: 0
    };

    await storage.upsertMarketData(niftyData);

    // SENSEX
    const sensexData = {
      symbol: 'SENSEX',
      exchange: 'BSE',
      currentPrice: 72996.23 + (Math.random() - 0.5) * 500,
      percentChange: 0.72 + (Math.random() - 0.5) * 0.5,
      volume: 0
    };

    await storage.upsertMarketData(sensexData);
  }

  async getPopularStocks(): Promise<any[]> {
    const stocks = [];
    for (const symbol of this.popularStocks) {
      const data = await storage.getMarketData(symbol, 'NSE');
      if (data) {
        stocks.push(data);
      }
    }
    return stocks;
  }

  async getIndexData(): Promise<any> {
    const nifty = await storage.getMarketData('NIFTY50', 'NSE');
    const sensex = await storage.getMarketData('SENSEX', 'BSE');
    
    return {
      nifty,
      sensex
    };
  }
}

export const marketDataService = new NSEMarketDataService();

// Initialize market data immediately when server starts (for demo purposes)
(async () => {
  try {
    console.log('Initializing market data...');
    await marketDataService.fetchLiveData();
    console.log('Market data initialized successfully');
  } catch (error) {
    console.error('Error initializing market data:', error);
  }
})();

// Auto-update market data every 30 seconds for demo (regardless of market hours)
setInterval(async () => {
  try {
    await marketDataService.fetchLiveData();
    console.log('Market data updated');
  } catch (error) {
    console.error('Error in scheduled market data update:', error);
  }
}, 30 * 1000); // 30 seconds for frequent updates
