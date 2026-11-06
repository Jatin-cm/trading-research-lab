import React, { useState } from 'react'
import {
  LineChart as LineChartIcon,
  BarChart3,
  Calendar,
  Clock,
  TrendingUp,
  Percent,
  Award,
  Layers,
  ArrowUpRight,
  Download,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { ChartContainer } from '@/components/ui/ChartContainer'
import { EquityChart } from '@/components/charts/EquityChart'
import { DrawdownChart } from '@/components/charts/DrawdownChart'
import { MonthlyReturnsMatrix } from '@/components/charts/MonthlyReturnsMatrix'
import { PerformanceBarChart } from '@/components/charts/PerformanceBarChart'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import {
  mockTradingStatistics,
  mockEquityCurve,
  mockMonthlyReturns,
  mockDayOfWeekStats,
  mockTimeOfDayStats,
  mockStrategies,
} from '@/services/mockData'
import { formatCurrency, formatPercent, formatRMultiple } from '@/utils/formatters'
import { useToast } from '@/components/ui/Toast'

export const AnalyticsPage: React.FC = () => {
  const [timeframe, setTimeframe] = useState('ALL')
  const { addToast } = useToast()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Quantitative Performance Analytics & Attribution"
        description="Comprehensive mathematical edge decomposition, risk attribution, streak dynamics, day-of-week tendencies, and cross-asset returns."
        badge={<Badge variant="bullish">Sharpe Ratio: 1.95</Badge>}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download className="w-3.5 h-3.5" />}
            onClick={() =>
              addToast({
                title: 'Report Generated',
                description: 'Statistical tearsheet compiled in PDF/CSV (Phase 8 full generator).',
              })
            }
          >
            Export Tearsheet
          </Button>
        }
      />

      {/* Performance Statistics Overview Grid */}
      <section className="space-y-2">
        <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400">
          Executive Statistical Breakdown
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          <StatCard label="Win Rate" value={`${mockTradingStatistics.winRate}%`} variant="bullish" />
          <StatCard label="Profit Factor" value={mockTradingStatistics.profitFactor.toFixed(2)} variant="bullish" />
          <StatCard label="Expectancy" value={formatRMultiple(mockTradingStatistics.expectancy)} variant="bullish" />
          <StatCard label="Average R" value={formatRMultiple(mockTradingStatistics.avgR)} variant="bullish" />
          <StatCard label="Average Win" value={formatCurrency(mockTradingStatistics.avgWin)} variant="bullish" />
          <StatCard label="Average Loss" value={`-${formatCurrency(mockTradingStatistics.avgLoss)}`} variant="bearish" />
          <StatCard label="Win Streak" value={`${mockTradingStatistics.winningStreak} Trades`} variant="bullish" />
          <StatCard label="Loss Streak" value={`${mockTradingStatistics.losingStreak} Trades`} variant="bearish" />
        </div>
      </section>

      {/* Equity & Drawdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartContainer
            title="Consolidated Portfolio Equity Curve"
            subtitle="Accumulated return trajectory across live, paper, & verified historical data"
            timeframes={['1M', '3M', '6M', '1Y', 'ALL']}
            activeTimeframe={timeframe}
            onTimeframeChange={setTimeframe}
            height={270}
          >
            <EquityChart data={mockEquityCurve} height={250} />
          </ChartContainer>
        </div>

        <div>
          <ChartContainer
            title="Underwater Drawdown Profile"
            subtitle="Historical risk drawdown depth & watermarks"
            height={270}
          >
            <DrawdownChart data={mockEquityCurve} height={250} />
          </ChartContainer>
        </div>
      </div>

      {/* Strategy Performance Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-200">
              Strategy Alpha Breakdown & Contribution
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Attribution across {mockStrategies.length} systems
          </span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Strategy Model</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Timeframe</TableHead>
              <TableHead className="text-right">Win Rate</TableHead>
              <TableHead className="text-right">Expectancy</TableHead>
              <TableHead className="text-right">Profit Factor</TableHead>
              <TableHead className="text-right">Max Drawdown</TableHead>
              <TableHead className="text-right">Total Trades</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockStrategies.map((strat) => (
              <TableRow key={strat.id}>
                <TableCell className="font-bold text-slate-100">{strat.name}</TableCell>
                <TableCell className="text-slate-400">{strat.market}</TableCell>
                <TableCell>{strat.primaryTimeframe}</TableCell>
                <TableCell className="text-right text-emerald-400 font-bold">
                  {strat.winRate}%
                </TableCell>
                <TableCell className="text-right text-blue-400 font-bold">
                  +{strat.expectancy}R
                </TableCell>
                <TableCell className="text-right font-semibold">
                  {strat.profitFactor.toFixed(2)}
                </TableCell>
                <TableCell className="text-right text-rose-400 font-semibold">
                  -{strat.maxDrawdown}%
                </TableCell>
                <TableCell className="text-right">{strat.totalTrades}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={strat.status === 'ACTIVE' ? 'bullish' : strat.status === 'TESTING' ? 'info' : 'neutral'}
                  >
                    {strat.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Timing Patterns: Day-of-Week & Time-of-Day */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              Day-of-Week P&L Performance ($)
            </CardTitle>
            <span className="text-[11px] font-mono text-slate-500">Distribution</span>
          </CardHeader>
          <CardContent>
            <PerformanceBarChart data={mockDayOfWeekStats} xKey="day" yKey="pnl" height={220} />
            <div className="mt-3 grid grid-cols-5 text-center text-[11px] font-mono text-slate-400 border-t border-[#1c2436] pt-2">
              {mockDayOfWeekStats.map((d) => (
                <div key={d.day}>
                  <div className="text-slate-500">{d.day} WR</div>
                  <div className="font-bold text-slate-200">{d.winRate}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              Time-of-Day Session Performance ($)
            </CardTitle>
            <span className="text-[11px] font-mono text-slate-500">Session kill-zones</span>
          </CardHeader>
          <CardContent>
            <PerformanceBarChart data={mockTimeOfDayStats} xKey="hour" yKey="pnl" height={220} />
            <div className="mt-3 text-[11px] font-mono text-slate-400 border-t border-[#1c2436] pt-2 text-center">
              Highest edge detected during <span className="text-emerald-400 font-bold">London Open</span> and <span className="text-emerald-400 font-bold">NY Afternoon</span>.
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Performance Heatmap Component */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-purple-400" />
            Monthly Returns Matrix (%)
          </CardTitle>
          <span className="text-[11px] font-mono text-slate-500">Cross-year consistency</span>
        </CardHeader>
        <CardContent>
          <MonthlyReturnsMatrix data={mockMonthlyReturns} />
        </CardContent>
      </Card>
    </div>
  )
}

