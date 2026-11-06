import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Shield,
  Key,
} from 'lucide-react'
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'

export interface TopbarProps {
  onToggleSidebar?: () => void
  onOpenMobileNav?: () => void
  onOpenSearch?: () => void
  isSidebarCollapsed?: boolean
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileNav,
  onOpenSearch,
}) => {
  const [currentTimeUTC, setCurrentTimeUTC] = useState('')
  const { addToast } = useToast()
  const { user, profile, signOut, isConfigured } = useAuth()
  const navigate = useNavigate()

  // Real-time UTC clock for trading sessions
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTimeUTC(
        now.toUTCString().slice(17, 25) + ' UTC'
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleLogout = async () => {
    await signOut()
    addToast({
      title: 'Logged Out',
      description: 'Your workstation session has been closed safely.',
      type: 'info',
    })
    navigate('/login', { replace: true })
  }

  const notificationItems: DropdownItem[] = [
    {
      id: 'n1',
      label: 'Backtest Completed: London Breakout (PF: 2.45)',
      onClick: () => addToast({ title: 'Backtest Loaded', description: 'London Breakout results open in Backtester' }),
    },
    {
      id: 'n2',
      label: 'Paper Order Executed: NQ Long filled @ 18,240.25',
      onClick: () => addToast({ title: 'Paper Position', description: 'Position tracking active in Paper Trading' }),
    },
    {
      id: 'n3',
      label: 'Trading Plan: Daily loss risk check verified [OK]',
      onClick: () => addToast({ title: 'Risk Check Pass', description: 'Risk parameters within normal tolerance', type: 'success' }),
    },
    {
      id: 'div',
      label: '',
      divider: true,
    },
    {
      id: 'clear',
      label: 'Clear all notifications',
      onClick: () => addToast({ title: 'Notifications Cleared', type: 'info' }),
    },
  ]

  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Trader TRL'
  const email = profile?.email || user?.email || 'researcher@tradinglab.internal'
  const initials = displayName
    .split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'TR'

  const profileItems: DropdownItem[] = [
    {
      id: 'identity',
      label: `${displayName}`,
      icon: <User className="w-4 h-4 text-blue-400" />,
      onClick: () => navigate('/settings'),
    },
    {
      id: 'email',
      label: email,
      disabled: true,
    },
    {
      id: 'status',
      label: isConfigured ? 'Database: Supabase Live (RLS Active)' : 'Database: Local Demo Provider',
      icon: <Shield className="w-4 h-4 text-emerald-400" />,
      disabled: true,
    },
    {
      id: 'div2',
      label: '',
      divider: true,
    },
    {
      id: 'settings',
      label: 'Workstation Settings',
      icon: <Key className="w-4 h-4" />,
      onClick: () => navigate('/settings'),
    },
    {
      id: 'logout',
      label: 'Log Out of Workstation',
      danger: true,
      icon: <LogOut className="w-4 h-4 text-rose-400" />,
      onClick: handleLogout,
    },
  ]

  return (
    <header className="sticky top-0 z-40 w-full h-14 bg-[#090d14]/95 backdrop-blur-xs border-b border-[#1b2333] flex items-center justify-between px-3 sm:px-5">
      {/* Left side: Hamburger + TRL text logo */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#141b26] cursor-pointer"
          aria-label="Open mobile navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* TRL text logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-mono font-black text-xs tracking-tighter">
            TRL
          </div>
          <div className="hidden sm:block">
            <span className="text-sm font-bold tracking-tight text-slate-100 font-mono">
              Trading Research Lab
            </span>
            <span className="text-[10px] text-slate-500 font-mono ml-2 hidden lg:inline">
              Workstation v1.5
            </span>
          </div>
        </div>
      </div>

      {/* Middle: Search bar trigger */}
      <div className="flex-1 max-w-md mx-3 hidden sm:block">
        <button
          type="button"
          onClick={onOpenSearch}
          className="w-full flex items-center justify-between px-3 py-1.5 rounded-md bg-[#111622] hover:bg-[#151c2a] border border-[#202a3d] hover:border-slate-600 text-xs text-slate-400 transition-colors group cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            <span className="font-mono">Quick search strategies, symbols, routes...</span>
          </div>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-[#090d14] border border-[#222c3e] rounded">
            Ctrl+K
          </kbd>
        </button>
      </div>

      {/* Right side: Market Status, Clocks, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Search Icon */}
        <button
          type="button"
          onClick={onOpenSearch}
          className="sm:hidden p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#141b26]"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Market Status Pills */}
        <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded bg-[#0e131d] border border-[#1b2333]">
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300 font-medium">NYSE</span>
            <span className="text-emerald-400 font-semibold">OPEN</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
            <span>CRYPTO</span>
            <span className="text-blue-400">24/7</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-[11px] font-mono text-slate-400 tabular-nums">
            {currentTimeUTC || '00:00:00 UTC'}
          </span>
        </div>

        {/* Notifications Dropdown */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="relative p-2 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#141b26] transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-[#090d14]" />
            </button>
          }
          items={notificationItems}
        />

        {/* Authenticated Profile Dropdown */}
        <Dropdown
          trigger={
            <button
              type="button"
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-md hover:bg-[#141b26] border border-transparent hover:border-[#212b3d] transition-colors"
            >
              <div className="w-6 h-6 rounded bg-[#1c2637] border border-[#2b394f] flex items-center justify-center text-[10px] font-mono font-bold text-slate-300">
                {initials}
              </div>
              <span className="hidden lg:inline text-xs font-medium text-slate-300 font-mono truncate max-w-[120px]">
                {displayName}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-500" />
            </button>
          }
          items={profileItems}
        />
      </div>
    </header>
  )
}
