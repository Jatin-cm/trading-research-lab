import React, { useState } from 'react'
import {
  Cpu,
  Plus,
  Search,
  Filter,
  CheckCircle,
  FlaskConical,
  Archive,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Percent,
  Sliders,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import { Modal } from '@/components/ui/Modal'
import { mockStrategies } from '@/services/mockData'
import { Strategy, StrategyStatus } from '@/types'
import { useToast } from '@/components/ui/Toast'

export const StrategiesPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('ALL')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { addToast } = useToast()

  const tabs = [
    { id: 'ALL', label: 'All Strategies', count: mockStrategies.length },
    { id: 'ACTIVE', label: 'Active', count: mockStrategies.filter((s) => s.status === 'ACTIVE').length },
    { id: 'TESTING', label: 'Testing', count: mockStrategies.filter((s) => s.status === 'TESTING').length },
    { id: 'ARCHIVED', label: 'Archived', count: mockStrategies.filter((s) => s.status === 'ARCHIVED').length },
    { id: 'TEMPLATE', label: 'Templates', count: mockStrategies.filter((s) => s.status === 'TEMPLATE').length },
  ]

  const filteredStrategies = mockStrategies.filter((s) => {
    const matchesTab = activeFilter === 'ALL' || s.status === activeFilter
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.market.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesTab && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Strategy Laboratory & System Portfolio"
        description="Central repository of quantitative and discretionary trading models, parameter sets, version changelogs, and statistical edge benchmarks."
        badge={<Badge variant="bullish">{mockStrategies.length} Systems Cataloged</Badge>}
        actions={
          <Button
            variant="primary"
            size="md"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Create Strategy
          </Button>
        }
      />

      {/* Tabs navigation */}
      <Tabs tabs={tabs} activeTab={activeFilter} onChange={setActiveFilter} variant="pills" />

      {/* Search and Quick Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#111622] rounded-lg border border-[#1d2638]">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search strategy name, asset class, or tag..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          Filtered: <span className="text-slate-100 font-bold">{filteredStrategies.length}</span> systems
        </div>
      </div>

      {/* Strategies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStrategies.map((strat) => {
          const getBadgeVariant = (st: StrategyStatus) => {
            switch (st) {
              case 'ACTIVE': return 'bullish'
              case 'TESTING': return 'info'
              case 'ARCHIVED': return 'neutral'
              case 'TEMPLATE': return 'outline'
              default: return 'default'
            }
          }

          return (
            <Card
              key={strat.id}
              variant="interactive"
              className="flex flex-col justify-between"
              onClick={() =>
                addToast({
                  title: `Strategy: ${strat.name}`,
                  description: `Status: ${strat.status} | Version: ${strat.version} | Last tested: ${strat.lastTested}`,
                })
              }
            >
              <div className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-100 font-mono tracking-tight">
                      {strat.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                      <span>{strat.market}</span>
                      <span>•</span>
                      <span>{strat.primaryTimeframe}</span>
                    </div>
                  </div>
                  <Badge variant={getBadgeVariant(strat.status)} size="sm">
                    {strat.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {strat.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {strat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#162030] text-slate-300 border border-[#212f45]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Performance Metrics Grid */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1a2233] text-xs font-mono">
                  <div className="p-2 rounded bg-[#0c1018] border border-[#182132]">
                    <span className="text-[10px] text-slate-500 block uppercase">Win Rate</span>
                    <span className="font-bold text-emerald-400 text-sm">{strat.winRate}%</span>
                  </div>
                  <div className="p-2 rounded bg-[#0c1018] border border-[#182132]">
                    <span className="text-[10px] text-slate-500 block uppercase">Expectancy</span>
                    <span className="font-bold text-blue-400 text-sm">+{strat.expectancy}R</span>
                  </div>
                  <div className="p-2 rounded bg-[#0c1018] border border-[#182132]">
                    <span className="text-[10px] text-slate-500 block uppercase">Profit Factor</span>
                    <span className="font-semibold text-slate-200">{strat.profitFactor.toFixed(2)}</span>
                  </div>
                  <div className="p-2 rounded bg-[#0c1018] border border-[#182132]">
                    <span className="text-[10px] text-slate-500 block uppercase">Max DD</span>
                    <span className="font-semibold text-rose-400">-{strat.maxDrawdown}%</span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-4 py-2.5 bg-[#0d121c] border-t border-[#182132] flex items-center justify-between text-[11px] font-mono text-slate-500 rounded-b-lg">
                <span>Version: <strong className="text-slate-300">{strat.version}</strong></span>
                <span>Last Tested: {strat.lastTested}</span>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredStrategies.length === 0 && (
        <div className="text-center py-12 border border-dashed border-[#222c3f] rounded-lg">
          <p className="text-xs text-slate-400">No strategies found matching "{searchQuery}"</p>
        </div>
      )}

      {/* Strategy Builder Placeholder Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Strategy — Strategy Builder (Phase 4)"
        description="Visual rule composer, parameter definition, and logic compiler"
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsCreateModalOpen(false)}>
            Close Roadmap
          </Button>
        }
      >
        <div className="space-y-3.5 text-xs text-slate-300">
          <p>
            The dedicated <strong>Strategy Builder</strong> will be engineered in <strong>Phase 4</strong>.
          </p>

          <div className="p-3.5 rounded bg-[#0b0e14] border border-[#1c2436] space-y-2">
            <h5 className="font-semibold text-slate-100 font-mono">Future Strategy Builder Architecture:</h5>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li>Declarative strategy definition language (JSON / TypeScript based)</li>
              <li>Universal format: 1 Strategy definition runs across Manual Backtesting, Automated Backtesting, Paper Trading, and Live Execution</li>
              <li>Parameter optimization engine (Walk-forward analysis, Monte Carlo simulation)</li>
              <li>Indicator integration (Moving Averages, VWAP, ATR, Fair Value Gaps, Liquidity Pools)</li>
            </ul>
          </div>

          <p className="text-slate-400">
            For now, the domain model <code>Strategy</code> and <code>StrategyVersion</code> in <code>src/types/</code> are fully mapped to support this schema seamlessly.
          </p>
        </div>
      </Modal>
    </div>
  )
}

