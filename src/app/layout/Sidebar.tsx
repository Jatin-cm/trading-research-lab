import React from 'react'
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
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react'
import { MAIN_NAV_ITEMS, SECONDARY_NAV_ITEMS } from '@/config/navigation'
import { cn } from '@/utils/cn'
import { Tooltip } from '@/components/ui/Tooltip'

export interface SidebarProps {
  isCollapsed: boolean
  onToggleCollapse: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggleCollapse }) => {
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
    <aside
      className={cn(
        'hidden md:flex flex-col bg-[#0b0e14] border-r border-[#192233] transition-all duration-200 select-none z-30 shrink-0 sticky top-14 h-[calc(100vh-3.5rem)]',
        isCollapsed ? 'w-14' : 'w-56 lg:w-60'
      )}
    >
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {!isCollapsed && (
          <div className="px-2.5 pb-2 text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-500">
            Workstation
          </div>
        )}

        {MAIN_NAV_ITEMS.map((item) => {
          const navContent = (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-colors relative group',
                  isActive
                    ? 'bg-[#151c2a] text-blue-400 font-semibold border-l-2 border-blue-500 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111724]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  >
                    {getIcon(item.iconName)}
                  </span>

                  {!isCollapsed && (
                    <span className="truncate flex-1 tracking-tight">{item.name}</span>
                  )}

                  {!isCollapsed && item.badge && (
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#182335] text-blue-300 border border-blue-500/20">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          )

          return isCollapsed ? (
            <Tooltip key={item.href} content={item.name} position="right">
              {navContent}
            </Tooltip>
          ) : (
            <div key={item.href}>{navContent}</div>
          )
        })}

        {/* Separator */}
        <div className="pt-3 pb-1">
          <div className="h-px bg-[#182132]" />
        </div>

        {!isCollapsed && (
          <div className="px-2.5 pb-2 text-[10px] font-semibold font-mono uppercase tracking-wider text-slate-500">
            Preferences
          </div>
        )}

        {SECONDARY_NAV_ITEMS.map((item) => {
          const navContent = (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-2.5 py-2 rounded-md text-xs font-medium transition-colors relative group',
                  isActive
                    ? 'bg-[#151c2a] text-blue-400 font-semibold border-l-2 border-blue-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-[#111724]'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'transition-colors',
                      isActive ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  >
                    {getIcon(item.iconName)}
                  </span>
                  {!isCollapsed && (
                    <span className="truncate flex-1 tracking-tight">{item.name}</span>
                  )}
                </>
              )}
            </NavLink>
          )

          return isCollapsed ? (
            <Tooltip key={item.href} content={item.name} position="right">
              {navContent}
            </Tooltip>
          ) : (
            <div key={item.href}>{navContent}</div>
          )
        })}
      </div>

      {/* Footer & Collapse Toggle */}
      <div className="p-2 border-t border-[#182132] bg-[#090d14]/70">
        {!isCollapsed && (
          <div className="mb-2 p-2 rounded bg-[#0f1420] border border-[#1b2537] text-[11px] font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Paper Mode
              </span>
              <span className="text-emerald-400 font-semibold">Active</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-1 flex justify-between">
              <span>TRL v1.0.0</span>
              <span>Local Dev</span>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            'w-full flex items-center justify-center p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#141b27] transition-colors cursor-pointer',
            !isCollapsed && 'gap-2 text-xs'
          )}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  )
}

