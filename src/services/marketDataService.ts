import { MarketSymbol } from '@/types'
import { mockWatchlistSymbols } from './mockData'

class MarketDataService {
  private watchlist: MarketSymbol[] = [...mockWatchlistSymbols]

  async getWatchlist(): Promise<MarketSymbol[]> {
    return Promise.resolve([...this.watchlist])
  }

  async getSymbol(symbol: string): Promise<MarketSymbol | undefined> {
    return Promise.resolve(this.watchlist.find((s) => s.symbol === symbol))
  }
}

export const marketDataService = new MarketDataService()

