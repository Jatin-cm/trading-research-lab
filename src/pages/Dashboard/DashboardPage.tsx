import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Wallet,
  Scale,
  TrendingUp,
  Calendar,
  Percent,
  Plus,
  RefreshCw,
  Cpu,
  History,
  ArrowUpRight,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { StatCard } from '@/components/ui/StatCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card, CardContent } from '@/components/ui/Card'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { EquityChart } from '@/components/charts/EquityChart'
import { DrawdownChart } from '@/components/charts/DrawdownChart'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  dashboardService,
  AccountOverviewData,
} from '@/services/dashboardService'
import {
  EquityPoint,
  PerformanceMetric,
  ResearchActivity,
  Strategy,
  Trade,
} from '@/types'
import {
  mockAccountOverview,
  mockTradingStatistics,
  mockEquityCurve,
  mockRecentTrades,
  mockStrategies,
  mockResearchActivities,
} from '@/services/mockData'
import { formatCurrency, formatPercent, formatRMultiple } from '@/utils/formatters'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'

export const DashboardPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('ALL')
  const [chartView, setChartView] = useState<'equity' | 'drawdown'>('equity')
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Workstation data states loaded via dashboardService
  const [accountOverview, setAccountOverview] = useState<AccountOverviewData>(mockAccountOverview)
  const [tradingStats, setTradingStats] = useState<PerformanceMetric>(mockTradingStatistics)
  const [equityCurve, setEquityCurve] = useState<EquityPoint[]>(mockEquityCurve)
  const [recentTrades, setRecentTrades] = useState<Trade[]>(mockRecentTrades)
  const [activeStrategies, setActiveStrategies] = useState<Strategy[]>(
    mockStrategies.filter((s) => s.status === 'ACTIVE' || s.status === 'TESTING')
  )
  const [activities, setActivities] = useState<ResearchActivity[]>(mockResearchActivities)

  const { addToast } = useToast()
  const { user, isConfigured } = useAuth()

  const loadDashboardData = async () => {
    try {
      const [overview, stats, curve, trades, strats, acts] = await Promise.all([
        dashboardService.getAccountOverview(user?.id),
        dashboardService.getTradingStatistics(user?.id),
        dashboardService.getEquityCurve(user?.id),
        dashboardService.getRecentTrades(user?.id),
        dashboardService.getActiveStrategies(user?.id),
        dashboardService.getResearchActivities(user?.id),
      ])

      setAccountOverview(overview)
      setTradingStats(stats)
      setEquityCurve(curve)
      setRecentTrades(trades)
      setActiveStrategies(strats)
      setActivities(acts)
    } catch (err) {
      console.error('Error loading dashboard data:', err)
    }
  }

  useEffect(() => {
    loadDashboardData()
  }, [user?.id])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await loadDashboardData()
    setTimeout(() => {
      setIsRefreshing(false)
      addToast({
        title: 'Workstation Synced',
        description: isConfigured
          ? 'Live database records and tick executions refreshed.'
          : 'Data provider synchronized with research dataset.',
        type: 'success',
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Trading Research Lab"
        description="Integrated personal trading workstation: quantitative research, risk monitoring, strategy incubation, & performance statistics."
        badge={
          <Badge variant="bullish" dot>
            {isConfigured ? 'DATABASE CONNECTED' : 'LOCAL WORKSTATION'}
          </Badge>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />}
              onClick={handleRefresh}
            >
              Sync Data
            </Button>
            <Link to="/strategies">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-3.5 h-3.5" />}>
                New Strategy
              </Button>
            </Link>
          </>
        }
      />

      {/* Account Overview Grid */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold font-mono tracking-wider uppercase text-slate-400">
            Account Capital & P&L Overview
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">Currency: {accountOverview.currency} ($)</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <StatCard
            label="Account Balance"
            value={formatCurrency(accountOverview.accountBalance)}
            subtext="Available Cash"
            icon={<Wallet className="w-4 h-4" />}
          />
          <StatCard
            label="Net Equity"
            value={formatCurrency(accountOverview.equity)}
            change={accountOverview.todayPnlPercent}
            changeLabel="vs margin"
            icon={<Scale className="w-4 h-4" />}
          />
          <StatCard
            label="Today's P&L"
            value={formatCurrency(accountOverview.todayPnl)}
            change={accountOverview.todayPnlPercent}
            changeLabel="today"
            variant="bullish"
            icon={<TrendingUp className="w-4 h-4" />}
          />
          <StatCard
            label="This Week"
            value={formatCurrency(accountOverview.weekPnl)}
            change={accountOverview.weekPnlPercent}
            changeLabel="WTD"
            variant="bullish"
            icon={<Calendar className="w-4 h-4" />}
          />
          <StatCard
            label="This Month"
            value={formatCurrency(accountOverview.monthPnl)}
            change={accountOverview.monthPnlPercent}
            changeLabel="MTD"
            variant="bullish"
            icon={<Percent className="w-4 h-4" />}
          />
        </div>
      </section>

      {/* Trading Statistics Grid */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-semibold font-mono tracking-wider uppercase text-slate-400">
            Execution Statistics & Statistical Edge
          </h2>
          <span className="text-[11px] text-slate-500 font-mono">
            Sample: {tradingStats.totalTrades} Executed Trades
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard
            label="Win Rate"
            value={`${tradingStats.winRate}%`}
            subtext={`${Math.round(tradingStats.totalTrades * (tradingStats.winRate / 100))} wins`}
            variant="bullish"
          />
          <StatCard
            label="Profit Factor"
            value={tradingStats.profitFactor.toFixed(2)}
            subtext="Gross Win / Loss"
            variant="bullish"
          />
          <StatCard
            label="Expectancy"
            value={formatRMultiple(tradingStats.expectancy)}
            subtext="Expected R per trade"
            variant="bullish"
          />
          <StatCard
            label="Average R"
            value={formatRMultiple(tradingStats.avgR)}
            subtext="Average payoff ratio"
            variant="bullish"
          />
          <StatCard
            label="Max Drawdown"
            value={`-${tradingStats.maxDrawdown}%`}
            subtext="Peak-to-valley"
            variant="bearish"
          />
          <StatCard
            label="Total Trades"
            value={tradingStats.totalTrades}
            subtext="Sample size"
          />
        </div>
      </section>

      {/* Equity Curve & Analytics Chart Section */}
      <section>
        <ChartContainer
          title="Consolidated Performance & Equity Curve"
          subtitle="Realized growth from initial $100k allocation across all validated strategies"
          badge={
            <Badge variant="bullish">
              +{formatPercent(((accountOverview.equity - 100000) / 100000) * 100)}
            </Badge>
          }
          timeframes={['1M', '3M', '6M', '1Y', 'ALL']}
          activeTimeframe={timeframe}
          onTimeframeChange={setTimeframe}
          actions={
            <div className="flex items-center p-0.5 bg-[#0a0d14] rounded border border-[#1c2436]">
              <button
                type="button"
                onClick={() => setChartView('equity')}
                className={`px-2 py-0.5 text-[11px] font-mono rounded cursor-pointer ${
                  chartView === 'equity'
                    ? 'bg-blue-600/30 text-blue-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Equity ($)
              </button>
              <button
                type="button"
                onClick={() => setChartView('drawdown')}
                className={`px-2 py-0.5 text-[11px] font-mono rounded cursor-pointer ${
                  chartView === 'drawdown'
                    ? 'bg-rose-600/30 text-rose-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Drawdown (%)
              </button>
            </div>
          }
          height={320}
        >
          {chartView === 'equity' ? (
            <EquityChart data={equityCurve} height={300} />
          ) : (
            <DrawdownChart data={equityCurve} height={300} />
          )}
        </ChartContainer>
      </section>

      {/* Recent Trades Table & Active Strategies Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Trades Table (2 Cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-200">Recent Trades</h2>
            </div>
            <Link
              to="/journal"
              className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              Open Journal <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date / Time</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>Dir</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">Exit</TableHead>
                <TableHead className="text-right">R-Mult</TableHead>
                <TableHead className="text-right">P&L ($)</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTrades.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-slate-400 text-[11px]">{t.date}</TableCell>
                  <TableCell className="font-bold text-slate-100">{t.symbol}</TableCell>
                  <TableCell className="text-slate-300 truncate max-w-[140px]" title={t.strategyName}>
                    {t.strategyName}
                  </TableCell>
                  <TableCell>
                    <Badge variant={t.direction === 'LONG' ? 'bullish' : 'bearish'}>
                      {t.direction}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
                    {t.entryPrice.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right text-slate-300">
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

        {/* Research Activity Feed (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-200">Research & System Activity</h2>
            <span className="text-[11px] font-mono text-slate-500">Live Log</span>
          </div>

          <Card>
            <CardContent className="p-0 divide-y divide-[#182132]">
              {activities.map((act) => (
                <div key={act.id} className="p-3.5 hover:bg-[#151c29]/50 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold text-slate-200 leading-snug">
                      {act.title}
                    </h4>
                    {act.statusBadge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#182335] text-blue-300 border border-blue-500/20 shrink-0">
                        {act.statusBadge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {act.description}
                  </p>
                  <div className="mt-2 text-[10px] font-mono text-slate-500">
                    {act.timestamp}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Active Strategies Overview Section */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-slate-400" />
            <h2 className="text-sm font-semibold text-slate-200">Active & Incubating Strategies</h2>
          </div>
          <Link
            to="/strategies"
            className="text-xs font-mono text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Manage All ({activeStrategies.length}) <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {activeStrategies.map((strat) => (
            <Card key={strat.id} variant="interactive" className="flex flex-col justify-between">
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-100 font-mono tracking-tight">
                      {strat.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span>{strat.market}</span>
                      <span>•</span>
                      <span>{strat.primaryTimeframe}</span>
                    </div>
                  </div>
                  <Badge
                    variant={strat.status === 'ACTIVE' ? 'bullish' : 'info'}
                    size="sm"
                  >
                    {strat.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a2233] text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Win Rate</span>
                    <span className="font-bold text-emerald-400">{strat.winRate}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Expectancy</span>
                    <span className="font-bold text-blue-400">+{strat.expectancy}R</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Profit Factor</span>
                    <span className="font-semibold text-slate-200">{strat.profitFactor.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">Max DD</span>
                    <span className="font-semibold text-rose-400">-{strat.maxDrawdown}%</span>
                  </div>
                </div>
              </div>

              <div className="px-4 py-2 bg-[#0d121c] border-t border-[#182132] flex items-center justify-between text-[10px] font-mono text-slate-500 rounded-b-lg">
                <span>Ver: {strat.version}</span>
                <span>Tested: {strat.lastTested}</span>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
