import { Trade, JournalEntry } from '@/types'
import { mockRecentTrades, mockJournalEntries } from './mockData'

class TradeService {
  private trades: Trade[] = [...mockRecentTrades]
  private journalEntries: JournalEntry[] = [...mockJournalEntries]

  async getRecentTrades(limit: number = 10): Promise<Trade[]> {
    return Promise.resolve(this.trades.slice(0, limit))
  }

  async getJournalEntries(): Promise<JournalEntry[]> {
    return Promise.resolve([...this.journalEntries])
  }
}

export const tradeService = new TradeService()

