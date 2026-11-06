import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight, LayoutDashboard, Scroll, BookOpen, Cpu, FlaskConical, Coins, LineChart, Activity, Settings } from 'lucide-react'
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/config/navigation'
import { mockStrategies } from '@/services/mockData'

export interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        if (isOpen) {
          onClose()
        } else {
          // Trigger open handled by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const allNav = [...MAIN_NAV_ITEMS, ...SECONDARY_NAV_ITEMS]

  const filteredNav = allNav.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  )

  const filteredStrategies = mockStrategies.filter((s) =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.market.toLowerCase().includes(query.toLowerCase()) ||
    s.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
  )

  const handleSelect = (path: string) => {
    navigate(path)
    onClose()
    setQuery('')
  }

  const getNavIcon = (name: string) => {
    switch (name) {
      case 'Dashboard': return <LayoutDashboard className="w-4 h-4" />
      case 'Trading Plan': return <Scroll className="w-4 h-4" />
      case 'Journal': return <BookOpen className="w-4 h-4" />
      case 'Strategies': return <Cpu className="w-4 h-4" />
      case 'Backtester': return <FlaskConical className="w-4 h-4" />
      case 'Paper Trading': return <Coins className="w-4 h-4" />
      case 'Analytics': return <LineChart className="w-4 h-4" />
      case 'Market Data': return <Activity className="w-4 h-4" />
      case 'Settings': return <Settings className="w-4 h-4" />
      default: return <Search className="w-4 h-4" />
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-[#0e131d] border border-[#243044] rounded-lg shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-100">
        <div className="flex items-center px-4 border-b border-[#1c2538]">
          <Search className="w-4 h-4 text-slate-400 shrink-0 mr-3" />
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search pages, strategies, symbols, commands (e.g. Backtester, NQ, Breakout)..."
            className="w-full bg-transparent py-3.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-mono"
          />
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-[#161f2e] border border-[#253249] rounded">
            ESC
          </kbd>
        </div>

        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-[#171f2f]">
          {/* Pages */}
          {filteredNav.length > 0 && (
            <div className="py-2">
              <span className="px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-500 font-mono">
                Workstation Navigation
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredNav.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => handleSelect(item.href)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded text-left text-xs text-slate-300 hover:text-white hover:bg-[#162030] transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-slate-400 group-hover:text-blue-400">
                        {getNavIcon(item.name)}
                      </span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-300 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Strategies */}
          {filteredStrategies.length > 0 && (
            <div className="py-2">
              <span className="px-3 text-[10px] font-semibold tracking-wider uppercase text-slate-500 font-mono">
                Strategies
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredStrategies.map((strat) => (
                  <button
                    key={strat.id}
                    onClick={() => handleSelect('/strategies')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded text-left text-xs text-slate-300 hover:text-white hover:bg-[#162030] transition-colors group cursor-pointer"
                  >
                    <div>
                      <div className="font-medium text-slate-200">{strat.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {strat.market} • {strat.primaryTimeframe} • WR {strat.winRate}%
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1c2637] text-slate-400">
                      {strat.status}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredNav.length === 0 && filteredStrategies.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching pages or strategies found for "{query}"
            </div>
          )}
        </div>

        <div className="px-4 py-2 bg-[#090d14] border-t border-[#1c2538] flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Navigate with mouse or keyboard</span>
          <span>TRL Workstation Quick-Search</span>
        </div>
      </div>
    </div>
  )
}

