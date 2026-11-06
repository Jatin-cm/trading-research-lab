import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Scroll,
  BookOpen,
  Cpu,
  FlaskConical,
  Coins,
  LineChart,
  Activity,
  Settings,
  X,
  ShieldCheck,
} from 'lucide-react'
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/config/navigation'
import { cn } from '@/utils/cn'

export interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export const MobileNav: React.FC<MobileNavProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  const getIcon = (iconName: string) => {
    const iconProps = { className: 'w-4 h-4 shrink-0' }
    switch (iconName) {
      case 'LayoutDashboard': return <LayoutDashboard {...iconProps} />
      case 'Scroll': return <Scroll {...iconProps} />
      case 'BookOpen': return <BookOpen {...iconProps} />
      case 'Cpu': return <Cpu {...iconProps} />
      case 'FlaskConical': return <FlaskConical {...iconProps} />
      case 'Coins': return <Coins {...iconProps} />
      case 'LineChart': return <LineChart {...iconProps} />
      case 'Activity': return <Activity {...iconProps} />
      case 'Settings': return <Settings {...iconProps} />
      default: return <LayoutDashboard {...iconProps} />
    }
  }

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-72 max-w-[80vw] bg-[#0c1018] border-r border-[#1e273a] flex flex-col h-full z-10 animate-in slide-in-from-left duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 h-14 border-b border-[#1b2333]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-mono font-black text-xs">
              TRL
            </div>
            <div>
              <span className="text-sm font-bold text-slate-100 font-mono">
                Trading Research Lab
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-[#161f2e]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2 text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-500 mb-2">
            Navigation
          </div>

          {MAIN_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-[#151c2a] text-blue-400 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111724]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>
                    {getIcon(item.iconName)}
                  </span>
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#182335] text-blue-300">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-4 pb-2">
            <div className="h-px bg-[#182132]" />
          </div>

          <div className="px-2 text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-500 mb-2">
            System
          </div>

          {SECONDARY_NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors',
                  isActive
                    ? 'bg-[#151c2a] text-blue-400 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111724]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-blue-400' : 'text-slate-500'}>
                    {getIcon(item.iconName)}
                  </span>
                  <span className="flex-1">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Drawer Footer */}
        <div className="p-3 border-t border-[#182132] bg-[#090d14]">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Paper Mode
            </span>
            <span className="text-emerald-400 font-semibold">Active</span>
          </div>
        </div>
      </div>
    </div>
  )
}

