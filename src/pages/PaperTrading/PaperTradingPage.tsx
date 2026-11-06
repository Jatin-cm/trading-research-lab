import React, { useState } from 'react'
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowUpCircle,
  ArrowDownCircle,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  mockPaperAccount,
  mockPaperPositions,
} from '@/services/mockData'
import { formatCurrency, formatRMultiple, formatPercent } from '@/utils/formatters'
import { useToast } from '@/components/ui/Toast'

export const PaperTradingPage: React.FC = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('NQ')
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY')
  const [orderType, setOrderType] = useState('MARKET')
  const [entryPrice, setEntryPrice] = useState('18345.50')
  const [stopLoss, setStopLoss] = useState('18290.00')
  const [takeProfit, setTakeProfit] = useState('18460.00')
  const [quantity, setQuantity] = useState('2')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { addToast } = useToast()

  const handleExecutePaperOrder = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      addToast({
        title: `Paper Order Submitted: ${direction} ${quantity} ${selectedSymbol}`,
        description: `Order routed through virtual simulation engine @ ${entryPrice}. SL: ${stopLoss}, TP: ${takeProfit}`,
        type: 'success',
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Forward Paper Trading Simulation Workstation"
        description="Zero-financial-risk execution sandbox: forward-test operational strategies against live market streams with real sizing constraints."
        badge={
          <Badge variant="bullish" dot>
            VIRTUAL BROKER ACTIVE
          </Badge>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() =>
              addToast({
                title: 'Virtual Quotes Refreshed',
                description: 'Syncing L1 mock order book depth.',
              })
            }
          >
            Refresh Feed
          </Button>
        }
      />

      {/* Paper Account Metrics Bar */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400">
          Paper Account Portfolio Status
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Paper Balance"
            value={formatCurrency(mockPaperAccount.balance)}
            subtext="Virtual Cash"
          />
          <StatCard
            label="Net Equity"
            value={formatCurrency(mockPaperAccount.equity)}
            change={2.45}
            changeLabel="unrealized"
            variant="bullish"
          />
          <StatCard
            label="Unrealized P&L"
            value={formatCurrency(mockPaperAccount.unrealizedPnl)}
            change={2.45}
            variant="bullish"
          />
          <StatCard
            label="Buying Power"
            value={formatCurrency(mockPaperAccount.buyingPower)}
            subtext="4:1 Intraday Margin"
          />
          <StatCard
            label="Open Positions"
            value={mockPaperAccount.openPositionsCount}
            subtext="Active risk"
          />
          <StatCard
            label="Pending Orders"
            value={mockPaperAccount.pendingOrdersCount}
            subtext="Limit / Stop"
          />
        </div>
      </section>

      {/* Main Trading Terminal Layout: Chart + Order Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart / Workspace Placeholder (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="flex flex-col">
            {/* Top Workspace Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 border-b border-[#1c2436] bg-[#0c1018]">
              <div className="flex items-center gap-3">
                <Select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  options={[
                    { value: 'NQ', label: 'NQ=F • E-mini Nasdaq' },
                    { value: 'ES', label: 'ES=F • E-mini S&P 500' },
                    { value: 'BTC/USD', label: 'BTC/USD • Bitcoin' },
                    { value: 'EUR/USD', label: 'EUR/USD • Euro' },
                    { value: 'NVDA', label: 'NVDA • Nvidia Corp' },
                  ]}
                  className="w-48 text-xs font-mono font-bold"
                />

                <div className="text-sm font-mono font-bold text-slate-100 flex items-center gap-2">
                  <span>18,345.50</span>
                  <span className="text-emerald-400 text-xs font-normal">+1.42%</span>
                </div>
              </div>

              {/* Timeframe selector */}
              <div className="flex items-center gap-1 font-mono text-[11px]">
                {['1m', '5m', '15m', '1h', '4h', '1D'].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    className={`px-2 py-0.5 rounded cursor-pointer ${
                      tf === '5m'
                        ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Canvas / Candlestick Chart Area */}
            <div className="p-6 h-80 bg-[#090d14] flex flex-col items-center justify-center relative overflow-hidden">
              {/* Subtle grid background */}
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              {/* Mock visual order lines */}
              <div className="absolute top-1/4 left-0 right-0 border-b border-dashed border-emerald-500/50 flex justify-between px-4 text-[10px] font-mono text-emerald-400">
                <span>Take Profit @ 18,460.00 (+2.50R)</span>
                <span>+$1,145.00</span>
              </div>
              <div className="absolute top-1/2 left-0 right-0 border-b border-blue-500/60 flex justify-between px-4 text-[10px] font-mono text-blue-400">
                <span>Position Avg Entry @ 18,345.50</span>
                <span>2 Contracts</span>
              </div>
              <div className="absolute bottom-1/4 left-0 right-0 border-b border-dashed border-rose-500/50 flex justify-between px-4 text-[10px] font-mono text-rose-400">
                <span>Stop Loss @ 18,290.00 (-1.00R)</span>
                <span>-$555.00</span>
              </div>

              {/* Center status message */}
              <div className="relative z-10 text-center p-4 rounded-lg bg-[#0e1420]/80 border border-[#212c40] max-w-sm">
                <p className="text-xs font-mono font-semibold text-slate-200">
                  Interactive Terminal Chart Workstation
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  Real-time TradingView / Canvas candlestick rendering engine connects in Phase 7.
                </p>
              </div>
            </div>

            <div className="p-3 bg-[#0c1018] border-t border-[#1c2436] flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>Spread: 0.25 pts (0.01%)</span>
              <span>Tick Liquidity: High</span>
              <span>Session: Regular Trading Hours</span>
            </div>
          </Card>
        </div>

        {/* Order Execution Panel (1 col) */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-emerald-400" />
                Virtual Order Entry
              </CardTitle>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                PAPER
              </span>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {/* Buy / Sell Direction Toggle */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('BUY')}
                  className={`py-2 px-3 rounded-md text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    direction === 'BUY'
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-[#151c28] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowUpCircle className="w-4 h-4" />
                  BUY / LONG
                </button>
                <button
                  type="button"
                  onClick={() => setDirection('SELL')}
                  className={`py-2 px-3 rounded-md text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    direction === 'SELL'
                      ? 'bg-rose-600 text-white shadow-md'
                      : 'bg-[#151c28] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowDownCircle className="w-4 h-4" />
                  SELL / SHORT
                </button>
              </div>

              <form onSubmit={handleExecutePaperOrder} className="space-y-3">
                <Select
                  label="Order Type"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  options={[
                    { value: 'MARKET', label: 'Market Order' },
                    { value: 'LIMIT', label: 'Limit Order' },
                    { value: 'STOP', label: 'Stop Market' },
                  ]}
                />

                <Input
                  label="Entry Target Price"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Stop Loss"
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                  />
                  <Input
                    label="Take Profit"
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                  />
                </div>

                <Input
                  label="Quantity / Contracts"
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />

                {/* Risk / Reward preview */}
                <div className="p-2.5 rounded bg-[#0b0e14] border border-[#1b2333] space-y-1 font-mono text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Risk:</span>
                    <span className="text-rose-400 font-semibold">-$555.00 (0.54%)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimated Reward:</span>
                    <span className="text-emerald-400 font-semibold">+$1,145.00 (1.12%)</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Risk-to-Reward:</span>
                    <span className="text-blue-400 font-bold">1 : 2.06 R</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  variant={direction === 'BUY' ? 'success' : 'danger'}
                  size="md"
                  className="w-full font-bold font-mono uppercase tracking-wider text-xs"
                  isLoading={isSubmitting}
                >
                  Submit Paper {direction} Order
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Positions Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-200">Open Paper Positions</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">Live mark-to-market</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Open Time</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Dir</TableHead>
              <TableHead className="text-right">Qty</TableHead>
              <TableHead className="text-right">Entry</TableHead>
              <TableHead className="text-right">Current</TableHead>
              <TableHead className="text-right">Stop Loss</TableHead>
              <TableHead className="text-right">Take Profit</TableHead>
              <TableHead className="text-right">P&L ($)</TableHead>
              <TableHead className="text-right">P&L (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPaperPositions.map((pos) => (
              <TableRow key={pos.id}>
                <TableCell className="text-slate-400">{pos.openTime}</TableCell>
                <TableCell className="font-bold text-slate-100">{pos.symbol}</TableCell>
                <TableCell>
                  <Badge variant={pos.direction === 'LONG' ? 'bullish' : 'bearish'}>
                    {pos.direction}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">{pos.quantity}</TableCell>
                <TableCell className="text-right">{pos.entryPrice.toFixed(2)}</TableCell>
                <TableCell className="text-right text-slate-100 font-bold">
                  {pos.currentPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-rose-400/80">
                  {pos.stopLoss.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-emerald-400/80">
                  {pos.takeProfit.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`text-right font-bold ${
                    pos.unrealizedPnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(pos.unrealizedPnl)}
                </TableCell>
                <TableCell
                  className={`text-right font-bold ${
                    pos.unrealizedPnlPercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  +{pos.unrealizedPnlPercent.toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

