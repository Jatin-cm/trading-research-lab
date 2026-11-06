import React, { useState } from 'react'
import {
  FlaskConical,
  Play,
  RotateCcw,
  Sliders,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Layers,
  BarChart2,
  Table as TableIcon,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { EquityChart } from '@/components/charts/EquityChart'
import { DrawdownChart } from '@/components/charts/DrawdownChart'
import { MonthlyReturnsMatrix } from '@/components/charts/MonthlyReturnsMatrix'
import { StatCard } from '@/components/ui/StatCard'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  mockEquityCurve,
  mockRecentTrades,
  mockMonthlyReturns,
  mockStrategies,
} from '@/services/mockData'
import { formatCurrency, formatPercent, formatRMultiple } from '@/utils/formatters'
import { useToast } from '@/components/ui/Toast'

export const BacktesterPage: React.FC = () => {
  const [strategy, setStrategy] = useState('London Breakout Momentum')
  const [market, setMarket] = useState('FOREX')
  const [symbol, setSymbol] = useState('EUR/USD')
  const [timeframe, setTimeframe] = useState('15m')
  const [initialCapital, setInitialCapital] = useState('100000')
  const [riskPerTrade, setRiskPerTrade] = useState('1.0')
  const [commission, setCommission] = useState('4.00')
  const [slippage, setSlippage] = useState('1.0')
  const [executionModel, setExecutionModel] = useState('BAR_CLOSE')
  const [isRunning, setIsRunning] = useState(false)
  const [hasRun, setHasRun] = useState(true)

  const { addToast } = useToast()

  const handleRunBacktest = () => {
    setIsRunning(true)
    setTimeout(() => {
      setIsRunning(false)
      setHasRun(true)
      addToast({
        title: 'Simulation Complete',
        description: `Backtest completed for ${strategy} on ${symbol} (${timeframe}). Profit Factor: 2.34`,
        type: 'success',
      })
    }, 800)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Quantitative Backtesting Workstation"
        description="Historical simulation laboratory: stress-test strategy algorithms against multi-year high-resolution tick and bar data."
        badge={<Badge variant="info">Engine: Fast Vectorized (Mock)</Badge>}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
            onClick={() => {
              setInitialCapital('100000')
              setRiskPerTrade('1.0')
              addToast({ title: 'Defaults Restored' })
            }}
          >
            Reset Parameters
          </Button>
        }
      />

      {/* Backtest Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-blue-400" />
            Simulation Configuration & Execution Setup
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-500">
            Phase 6 Automated Backtest Harness
          </span>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Strategy Selection"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              options={mockStrategies.map((s) => ({ value: s.name, label: s.name }))}
            />

            <Select
              label="Asset Market"
              value={market}
              onChange={(e) => setMarket(e.target.value)}
              options={[
                { value: 'FOREX', label: 'Forex (Currencies)' },
                { value: 'FUTURES', label: 'Index & Commodity Futures' },
                { value: 'EQUITY', label: 'Equities (US Stocks)' },
                { value: 'CRYPTO', label: 'Cryptocurrency' },
              ]}
            />

            <Select
              label="Symbol / Instrument"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              options={[
                { value: 'EUR/USD', label: 'EUR/USD (Euro)' },
                { value: 'NQ', label: 'NQ (Nasdaq 100 E-mini)' },
                { value: 'ES', label: 'ES (S&P 500 E-mini)' },
                { value: 'BTC/USD', label: 'BTC/USD (Bitcoin)' },
                { value: 'NVDA', label: 'NVDA (Nvidia)' },
              ]}
            />

            <Select
              label="Timeframe"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              options={[
                { value: '1m', label: '1 Minute (High Precision)' },
                { value: '5m', label: '5 Minutes' },
                { value: '15m', label: '15 Minutes (Recommended)' },
                { value: '1h', label: '1 Hour' },
                { value: '4h', label: '4 Hours' },
                { value: '1D', label: '1 Day' },
              ]}
            />

            <Input
              label="Initial Capital ($)"
              type="number"
              value={initialCapital}
              onChange={(e) => setInitialCapital(e.target.value)}
            />

            <Input
              label="Risk Per Trade (%)"
              type="number"
              step="0.1"
              value={riskPerTrade}
              onChange={(e) => setRiskPerTrade(e.target.value)}
            />

            <Input
              label="Round-Turn Comm ($)"
              type="number"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
            />

            <Select
              label="Execution Model"
              value={executionModel}
              onChange={(e) => setExecutionModel(e.target.value)}
              options={[
                { value: 'BAR_CLOSE', label: 'Bar Close (Strict)' },
                { value: 'INTRABAR_TICK', label: 'Intrabar Tick Simulation' },
                { value: 'PESSIMISTIC', label: 'Pessimistic Slippage Fill' },
              ]}
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-[#1a2233]">
            <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
              Historical Range: 2024-01-01 to 2026-05-01 (1,240 Bars / 18,400 Ticks)
            </div>
            <Button
              variant="primary"
              size="md"
              leftIcon={<Play className="w-4 h-4 fill-current" />}
              isLoading={isRunning}
              onClick={handleRunBacktest}
              className="w-full sm:w-auto"
            >
              RUN BACKTEST
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results View Placeholders */}
      {hasRun && (
        <div className="space-y-6">
          {/* Key Simulation Performance Stats */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400">
              Simulation Performance Summary
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <StatCard label="Net Profit" value="$28,420.50" change={28.42} changeLabel="ROI" variant="bullish" />
              <StatCard label="Win Rate" value="64.2%" subtext="95W / 53L" variant="bullish" />
              <StatCard label="Profit Factor" value="2.34" subtext="Gross Win / Loss" variant="bullish" />
              <StatCard label="Expectancy" value="+0.74R" subtext="Avg Payoff / Trade" variant="bullish" />
              <StatCard label="Max Drawdown" value="-4.12%" subtext="Peak to Trough" variant="bearish" />
              <StatCard label="Sharpe Ratio" value="1.95" subtext="Risk-Adjusted" />
            </div>
          </section>

          {/* Reusable Charts: Equity Curve & Drawdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartContainer
                title="Simulation Equity Curve"
                subtitle="Account growth over backtested period with reinvested equity"
                badge={<Badge variant="bullish">+28.42% Net Return</Badge>}
                height={260}
              >
                <EquityChart data={mockEquityCurve} height={240} />
              </ChartContainer>
            </div>

            <div>
              <ChartContainer
                title="Underwater Drawdown"
                subtitle="Depth and recovery duration of capital drawdowns"
                height={260}
              >
                <DrawdownChart data={mockEquityCurve} height={240} />
              </ChartContainer>
            </div>
          </div>

          {/* Monthly Returns Matrix Component */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                Monthly Returns (%)
              </CardTitle>
              <span className="text-[11px] font-mono text-slate-500">Calendar breakdown</span>
            </CardHeader>
            <CardContent>
              <MonthlyReturnsMatrix data={mockMonthlyReturns} />
            </CardContent>
          </Card>

          {/* Trade List Table Placeholder */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TableIcon className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-semibold text-slate-200">
                  Simulated Trade Execution Log
                </h3>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                Sample of 148 trades generated
              </span>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Direction</TableHead>
                  <TableHead className="text-right">Entry</TableHead>
                  <TableHead className="text-right">Exit</TableHead>
                  <TableHead className="text-right">R-Multiple</TableHead>
                  <TableHead className="text-right">P&L ($)</TableHead>
                  <TableHead className="text-center">Outcome</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentTrades.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-slate-400">{t.date}</TableCell>
                    <TableCell className="font-bold text-slate-100">{t.symbol}</TableCell>
                    <TableCell>
                      <Badge variant={t.direction === 'LONG' ? 'bullish' : 'bearish'}>
                        {t.direction}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{t.entryPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {t.exitPrice ? t.exitPrice.toFixed(2) : '—'}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        t.rMultiple >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatRMultiple(t.rMultiple)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        t.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatCurrency(t.pnl)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={t.result === 'WIN' ? 'bullish' : 'bearish'}>
                        {t.result}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  )
}

