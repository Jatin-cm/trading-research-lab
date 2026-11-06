/**
 * Domain types and models for Trading Research Lab (TRL)
 * Designed to cleanly support Phase 1 through Phase 12 roadmap.
 */

export type TradeDirection = 'LONG' | 'SHORT'
export type TradeStatus = 'OPEN' | 'CLOSED' | 'CANCELLED' | 'PENDING'
export type TradeResult = 'WIN' | 'LOSS' | 'BREAKEVEN'
export type MarketType = 'EQUITY' | 'CRYPTO' | 'FOREX' | 'FUTURES' | 'INDICES' | 'COMMODITIES'
export type OrderType = 'MARKET' | 'LIMIT' | 'STOP' | 'STOP_LIMIT'
export type StrategyStatus = 'ACTIVE' | 'TESTING' | 'ARCHIVED' | 'TEMPLATE' | 'LIVE'

export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
  role: 'RESEARCHER' | 'TRADER' | 'ADMIN'
  currency: string
  timezone: string
  createdAt: string
  preferences: UserPreferences
}

export interface UserPreferences {
  theme: 'dark' | 'terminal' | 'light'
  defaultRiskPercent: number
  defaultTimeframe: string
  notificationsEnabled: boolean
  soundEffects: boolean
  compactView: boolean
}

export interface MarketSymbol {
  symbol: string
  name: string
  market: MarketType
  price: number
  change24h: number
  volume24h: number
  high24h: number
  low24h: number
  isOpen: boolean
  pipSize?: number
  lotSize?: number
  lastUpdated: string
}

export interface Strategy {
  id: string
  name: string
  description: string
  version: string
  market: MarketType
  primaryTimeframe: string
  status: StrategyStatus
  tags: string[]
  winRate: number
  expectancy: number
  profitFactor: number
  maxDrawdown: number
  totalTrades: number
  avgR: number
  lastTested: string
  createdAt: string
  updatedAt: string
  rules?: {
    entry: string[]
    exit: string[]
    riskManagement: string[]
  }
}

export interface StrategyVersion {
  id: string
  strategyId: string
  version: string
  changelog: string
  parameters: Record<string, unknown>
  createdAt: string
  metricsSnapshot: PerformanceMetric
}

export interface Trade {
  id: string
  date: string
  symbol: string
  strategyId: string
  strategyName: string
  direction: TradeDirection
  entryPrice: number
  exitPrice?: number
  stopLoss: number
  takeProfit: number
  quantity: number
  rMultiple: number
  pnl: number
  status: TradeStatus
  result?: TradeResult
  commission: number
  slippage: number
  duration?: string
  notes?: string
}

export interface JournalEntry {
  id: string
  tradeId?: string
  date: string
  symbol: string
  direction: TradeDirection
  strategy: string
  entry: number
  stopLoss: number
  takeProfit: number
  exit?: number
  result: TradeResult
  rMultiple: number
  pnl: number
  emotion: 'CONFIDENT' | 'ANXIOUS' | 'NEUTRAL' | 'FOMO' | 'DISCIPLINED' | 'GREEDY'
  mistake?: 'NONE' | 'EARLY_EXIT' | 'CHASING' | 'OVERSIZED' | 'NO_STOP_LOSS' | 'BROKE_PLAN'
  tags: string[]
  screenshots: string[]
  notes: string
  lessonLearned?: string
}

export interface TradingPlan {
  id: string
  title: string
  version: string
  lastUpdated: string
  markets: MarketType[]
  sessions: {
    name: string
    hoursUTC: string
    active: boolean
  }[]
  timeframes: string[]
  riskRules: {
    maxRiskPerTradePercent: number
    dailyLossLimitPercent: number
    weeklyLossLimitPercent: number
    maxOpenPositions: number
    maxCorrelatedPositions: number
    minRiskRewardRatio: number
  }
  entryRules: string[]
  exitRules: string[]
  tradeManagementRules: string[]
  psychologyRules: string[]
  noTradeConditions: string[]
  dailyLimits: {
    maxDailyTrades: number
    maxDailyLossUSD: number
    profitLockTargetUSD: number
  }
  weeklyLimits: {
    maxWeeklyTrades: number
    maxWeeklyLossUSD: number
  }
}

export interface Backtest {
  id: string
  strategyId: string
  strategyName: string
  symbol: string
  market: MarketType
  timeframe: string
  startDate: string
  endDate: string
  initialCapital: number
  finalEquity: number
  netProfit: number
  returnPercent: number
  maxDrawdownPercent: number
  winRate: number
  profitFactor: number
  expectancy: number
  totalTrades: number
  winningTrades: number
  losingTrades: number
  trades: BacktestTrade[]
  createdAt: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
}

export interface BacktestTrade {
  id: string
  entryTime: string
  exitTime: string
  direction: TradeDirection
  entryPrice: number
  exitPrice: number
  stopLoss: number
  takeProfit: number
  size: number
  pnl: number
  rMultiple: number
  cumulativeEquity: number
}

export interface PaperAccount {
  id: string
  balance: number
  equity: number
  unrealizedPnl: number
  realizedPnl: number
  buyingPower: number
  marginUsed: number
  currency: string
  openPositionsCount: number
  pendingOrdersCount: number
}

export interface PaperOrder {
  id: string
  symbol: string
  direction: TradeDirection
  orderType: OrderType
  quantity: number
  targetPrice?: number
  stopLoss?: number
  takeProfit?: number
  status: 'NEW' | 'PARTIALLY_FILLED' | 'FILLED' | 'CANCELLED' | 'EXPIRED'
  createdAt: string
}

export interface PaperPosition {
  id: string
  symbol: string
  direction: TradeDirection
  entryPrice: number
  currentPrice: number
  quantity: number
  stopLoss: number
  takeProfit: number
  unrealizedPnl: number
  unrealizedPnlPercent: number
  rMultiple: number
  openTime: string
}

export interface PerformanceMetric {
  winRate: number
  profitFactor: number
  expectancy: number
  avgR: number
  maxDrawdown: number
  totalTrades: number
  avgWin: number
  avgLoss: number
  winLossRatio: number
  winningStreak: number
  losingStreak: number
  sharpeRatio?: number
  sortinoRatio?: number
}

export interface ResearchActivity {
  id: string
  type: 'STRATEGY_CREATED' | 'BACKTEST_COMPLETED' | 'PAPER_TRADE_RECORDED' | 'JOURNAL_ENTRY_ADDED' | 'STRATEGY_UPDATED' | 'PLAN_MODIFIED'
  title: string
  description: string
  timestamp: string
  link?: string
  statusBadge?: string
}

export interface EquityPoint {
  date: string
  equity: number
  drawdown: number
  benchmark?: number
}

export interface MonthlyReturn {
  year: number
  months: { [month: string]: number | null }
  total: number
}

