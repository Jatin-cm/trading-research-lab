import React, { useState } from 'react'
import {
  BookOpen,
  Plus,
  Filter,
  Calendar as CalendarIcon,
  Tag,
  Camera,
  Brain,
  AlertOctagon,
  ArrowUpDown,
  Download,
  Search,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Tabs } from '@/components/ui/Tabs'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { Modal } from '@/components/ui/Modal'
import { mockJournalEntries } from '@/services/mockData'
import { formatCurrency, formatRMultiple } from '@/utils/formatters'
import { useToast } from '@/components/ui/Toast'

export const JournalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('trades')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterQuery, setFilterQuery] = useState('')
  const { addToast } = useToast()

  const tabs = [
    { id: 'trades', label: 'Trade Log', count: mockJournalEntries.length },
    { id: 'calendar', label: 'Calendar View' },
    { id: 'psychology', label: 'Psychology & Emotions' },
    { id: 'mistakes', label: 'Mistakes & Rules Broken' },
    { id: 'screenshots', label: 'Chart Screenshots' },
  ]

  const filteredEntries = mockJournalEntries.filter(
    (e) =>
      e.symbol.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.strategy.toLowerCase().includes(filterQuery.toLowerCase()) ||
      e.emotion.toLowerCase().includes(filterQuery.toLowerCase()) ||
      (e.mistake && e.mistake.toLowerCase().includes(filterQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Trading Journal & Execution Review"
        description="Detailed log of all executions, qualitative reflections, behavioral analysis, emotional states, and annotated chart snapshots."
        badge={<Badge variant="info">Phase 3 Ready</Badge>}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download className="w-3.5 h-3.5" />}
              onClick={() =>
                addToast({
                  title: 'Export Prepared',
                  description: 'Exporting journal data to CSV / JSON format is queued for Phase 3.',
                })
              }
            >
              Export Log
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-3.5 h-3.5" />}
              onClick={() => setIsModalOpen(true)}
            >
              + Log Trade
            </Button>
          </>
        }
      />

      {/* Tabs navigation */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[#111622] rounded-lg border border-[#1d2638]">
        <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter by symbol, strategy, emotion, mistake..."
            className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <div className="text-[11px] font-mono text-slate-400">
            Showing <span className="text-slate-200 font-bold">{filteredEntries.length}</span> entries
          </div>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Filter className="w-3 h-3" />}
            onClick={() =>
              addToast({
                title: 'Advanced Filtering',
                description: 'Tag, date range, and setup filter drawers will activate in Phase 3.',
              })
            }
          >
            Filters
          </Button>
        </div>
      </div>

      {activeTab === 'trades' && (
        <div className="space-y-3">
          {/* Main Journal Trade Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Dir</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead className="text-right">Entry</TableHead>
                <TableHead className="text-right">SL</TableHead>
                <TableHead className="text-right">TP</TableHead>
                <TableHead className="text-center">Result</TableHead>
                <TableHead className="text-right">R-Mult</TableHead>
                <TableHead className="text-right">P&L ($)</TableHead>
                <TableHead>Emotion</TableHead>
                <TableHead>Mistake</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell className="text-slate-400">{entry.date}</TableCell>
                  <TableCell className="font-bold text-slate-100">{entry.symbol}</TableCell>
                  <TableCell>
                    <Badge variant={entry.direction === 'LONG' ? 'bullish' : 'bearish'}>
                      {entry.direction}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-300 truncate max-w-[150px]" title={entry.strategy}>
                    {entry.strategy}
                  </TableCell>
                  <TableCell className="text-right">{entry.entry.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-rose-400/80">{entry.stopLoss.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-emerald-400/80">{entry.takeProfit.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={entry.result === 'WIN' ? 'bullish' : 'bearish'}>
                      {entry.result}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${
                      entry.rMultiple >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatRMultiple(entry.rMultiple)}
                  </TableCell>
                  <TableCell
                    className={`text-right font-bold ${
                      entry.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {formatCurrency(entry.pnl)}
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-[#182335] text-cyan-300">
                      {entry.emotion}
                    </span>
                  </TableCell>
                  <TableCell>
                    {entry.mistake && entry.mistake !== 'NONE' ? (
                      <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300">
                        {entry.mistake}
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px] font-mono">None</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Notes & qualitative review callout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-cyan-400" />
                  Latest Trade Debrief (NQ Long)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  "Textbook liquidity run after London open. Held patiently until initial resistance level. Sticking to the 1.5R breakeven rule protected initial capital smoothly."
                </p>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-500 font-mono">
                  <Tag className="w-3 h-3" />
                  <span>Tags: A+ Setup, Clean Follow-Through, Session Open</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertOctagon className="w-4 h-4 text-rose-400" />
                  Mistake Reflection (BTC/USD Long)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <p className="text-slate-300 leading-relaxed">
                  "Entered slightly late after candle already began pushing up. Stop was hit on subsequent sweep. Lesson: Do not chase once price has moved beyond 0.382 retracement zone."
                </p>
                <div className="flex items-center gap-2 pt-2 text-[11px] text-rose-400 font-mono">
                  <span>Rule Broken: Chased price outside designated kill-zone.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'calendar' && (
        <Card className="p-8 text-center">
          <CalendarIcon className="w-10 h-10 text-slate-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">Interactive Journal Calendar</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Calendar heatmap showing daily P&L, trade density, win/loss color shading, and daily debrief summaries. Arriving in Phase 3.
          </p>
        </Card>
      )}

      {activeTab === 'psychology' && (
        <Card className="p-8 text-center">
          <Brain className="w-10 h-10 text-cyan-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">Emotional State Correlation Analysis</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Correlate confidence, anxiety, discipline, and FOMO directly with win rate, average R, and expectancy. Arriving in Phase 3.
          </p>
        </Card>
      )}

      {activeTab === 'mistakes' && (
        <Card className="p-8 text-center">
          <AlertOctagon className="w-10 h-10 text-rose-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">Mistakes & Cost of Indiscipline</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Calculates exact dollar and R-multiple cost incurred from violating rules such as early exits, moving stop losses, and chasing breakouts.
          </p>
        </Card>
      )}

      {activeTab === 'screenshots' && (
        <Card className="p-8 text-center">
          <Camera className="w-10 h-10 text-blue-500 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-200">Annotated Chart Screenshot Gallery</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Before-and-after trade snapshots, TradingView chart sync, and multi-timeframe review canvas. Arriving in Phase 3.
          </p>
        </Card>
      )}

      {/* Create Trade Modal Placeholder */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Trade Entry — Phase 3 Journal"
        description="Trade logging and database persistence will be activated in Phase 3."
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsModalOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            In <strong>Phase 3</strong>, you will be able to log manual trades or import broker/exchange executions directly into this journal database with automatic R-multiple calculations, psychological tags, and chart uploads.
          </p>
          <div className="p-3 rounded bg-[#0b0e14] border border-[#1c2436] font-mono text-[11px] text-slate-400">
            Database Schema Prepared: <code>Trade</code>, <code>JournalEntry</code>, <code>Tag</code>, <code>MistakeType</code>, <code>PsychologyMetric</code>.
          </div>
        </div>
      </Modal>
    </div>
  )
}

