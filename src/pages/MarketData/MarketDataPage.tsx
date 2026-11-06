import React, { useState } from 'react'
import {
  Activity,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  BarChart2,
  RefreshCw,
  Globe,
  Clock,
  Layers,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Select } from '@/components/ui/Select'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/Table'
import { mockWatchlistSymbols } from '@/services/mockData'
import { formatCurrency, formatCompactNumber } from '@/utils/formatters'
import { MarketType } from '@/types'
import { useToast } from '@/components/ui/Toast'

export const MarketDataPage: React.FC = () => {
  const [selectedMarket, setSelectedMarket] = useState<string>('ALL')
  const [selectedSymbol, setSelectedSymbol] = useState(mockWatchlistSymbols[0])
  const [searchQuery, setSearchQuery] = useState('')
  const [timeframe, setTimeframe] = useState('15m')
  const { addToast } = useToast()

  const filteredSymbols = mockWatchlistSymbols.filter((s) => {
    const matchesMarket = selectedMarket === 'ALL' || s.market === selectedMarket
    const matchesSearch =
      s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesMarket && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Market Data & Multi-Asset Watchlist"
        description="Cross-asset pricing radar: equities, futures, foreign exchange, crypto, & macro commodities. Real-time tick ingestion layer."
        badge={<Badge variant="bullish" dot>TICKS LIVE</Badge>}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            onClick={() =>
              addToast({
                title: 'Data Feeds Synced',
                description: 'Synchronized quote timestamps with external gateways.',
                type: 'success',
              })
            }
          >
            Poll Quotes
          </Button>
        }
      />

      {/* Global Market Sessions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-[#111622] border border-[#1e273a] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">New York (NYSE)</span>
            <span className="text-xs font-bold text-slate-200 font-mono">09:30 - 16:00 EST</span>
          </div>
          <Badge variant="bullish" dot size="sm">
            OPEN
          </Badge>
        </div>

        <div className="p-3 rounded-lg bg-[#111622] border border-[#1e273a] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">London (LSE)</span>
            <span className="text-xs font-bold text-slate-200 font-mono">08:00 - 16:30 GMT</span>
          </div>
          <Badge variant="bullish" dot size="sm">
            OPEN
          </Badge>
        </div>

        <div className="p-3 rounded-lg bg-[#111622] border border-[#1e273a] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Tokyo (TSE)</span>
            <span className="text-xs font-bold text-slate-200 font-mono">09:00 - 15:00 JST</span>
          </div>
          <Badge variant="neutral" size="sm">
            CLOSED
          </Badge>
        </div>

        <div className="p-3 rounded-lg bg-[#111622] border border-[#1e273a] flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-500 font-mono uppercase block">Crypto Markets</span>
            <span className="text-xs font-bold text-slate-200 font-mono">Global 24/7/365</span>
          </div>
          <Badge variant="info" dot size="sm">
            24/7
          </Badge>
        </div>
      </div>

      {/* Workstation Split: Watchlist (Left) + Terminal Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Watchlist Section (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold font-mono uppercase tracking-wider text-slate-400">
              Active Watchlist
            </h3>
            <span className="text-[11px] font-mono text-slate-500">
              {filteredSymbols.length} instruments
            </span>
          </div>

          {/* Filter Bar */}
          <div className="p-2.5 rounded-lg bg-[#111622] border border-[#1d2638] space-y-2">
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search symbol or instrument..."
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pt-1 font-mono text-[10px]">
              {['ALL', 'FUTURES', 'CRYPTO', 'FOREX', 'EQUITY', 'COMMODITIES'].map((m) => (
                <button
                  key={m}
                  onClick={() => setSelectedMarket(m)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors whitespace-nowrap ${
                    selectedMarket === m
                      ? 'bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40'
                      : 'text-slate-400 hover:text-slate-200 bg-[#0b0e14]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Symbols Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">24h Chg</TableHead>
                <TableHead className="text-right">Vol (24h)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSymbols.map((item) => {
                const isSelected = selectedSymbol.symbol === item.symbol
                return (
                  <TableRow
                    key={item.symbol}
                    onClick={() => setSelectedSymbol(item)}
                    className={`cursor-pointer ${isSelected ? 'bg-[#182335]' : ''}`}
                  >
                    <TableCell>
                      <div className="font-bold text-slate-100">{item.symbol}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                        {item.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-slate-100">
                      {item.price.toFixed(item.price > 100 ? 2 : 4)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-bold ${
                        item.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {item.change24h >= 0 ? '+' : ''}
                      {item.change24h.toFixed(2)}%
                    </TableCell>
                    <TableCell className="text-right text-slate-400 text-[11px]">
                      {formatCompactNumber(item.volume24h)}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Selected Symbol Terminal Chart View (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Card>
            {/* Header info */}
            <div className="p-4 border-b border-[#1c2436] bg-[#0c1018] flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold font-mono text-slate-100">
                    {selectedSymbol.symbol}
                  </h2>
                  <Badge variant="neutral">{selectedSymbol.market}</Badge>
                  <Badge variant={selectedSymbol.isOpen ? 'bullish' : 'neutral'} size="sm" dot>
                    {selectedSymbol.isOpen ? 'MARKET OPEN' : 'CLOSED'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedSymbol.name}</p>
              </div>

              <div className="text-right font-mono">
                <div className="text-xl font-bold text-slate-100 tabular-nums">
                  {selectedSymbol.price.toFixed(selectedSymbol.price > 100 ? 2 : 4)}
                </div>
                <div
                  className={`text-xs font-semibold ${
                    selectedSymbol.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {selectedSymbol.change24h >= 0 ? '+' : ''}
                  {selectedSymbol.change24h.toFixed(2)}% (24h)
                </div>
              </div>
            </div>

            {/* Timeframe Controls */}
            <div className="px-4 py-2 bg-[#0e131d] border-b border-[#1c2436] flex items-center justify-between">
              <div className="flex items-center gap-1 font-mono text-[11px]">
                {['1m', '5m', '15m', '1h', '4h', '1D', '1W'].map((tf) => (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded cursor-pointer ${
                      timeframe === tf
                        ? 'bg-blue-600/30 text-blue-300 font-bold border border-blue-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-mono text-slate-500 hidden sm:block">
                High: {selectedSymbol.high24h} | Low: {selectedSymbol.low24h}
              </div>
            </div>

            {/* Candlestick / Area Chart Placeholder Canvas */}
            <div className="p-8 h-80 bg-[#090d14] flex flex-col items-center justify-center relative overflow-hidden">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
                  backgroundSize: '24px 24px',
                }}
              />

              <div className="relative z-10 text-center p-5 rounded-lg bg-[#0e1420]/80 border border-[#212c40] max-w-sm">
                <BarChart2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-xs font-mono font-semibold text-slate-200">
                  {selectedSymbol.symbol} Chart Workstation ({timeframe})
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  External Market Data Providers (Polygon, Alpaca, Binance, IBKR) will plug directly into this stream in Phase 6.
                </p>
              </div>
            </div>

            {/* Metrics footer */}
            <div className="p-3.5 bg-[#0c1018] border-t border-[#1c2436] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono text-slate-400">
              <div>
                <span className="text-[10px] text-slate-500 block">24h High</span>
                <span className="text-slate-200">{selectedSymbol.high24h.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">24h Low</span>
                <span className="text-slate-200">{selectedSymbol.low24h.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">24h Volume</span>
                <span className="text-slate-200">{formatCompactNumber(selectedSymbol.volume24h)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block">Status</span>
                <span className="text-emerald-400 font-semibold">{selectedSymbol.lastUpdated}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

