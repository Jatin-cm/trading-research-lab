export interface NavItem {
  name: string
  href: string
  iconName: 'LayoutDashboard' | 'Scroll' | 'BookOpen' | 'Cpu' | 'FlaskConical' | 'Coins' | 'LineChart' | 'Activity' | 'Settings'
  badge?: string
  description: string
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    iconName: 'LayoutDashboard',
    description: 'Executive overview of trading research, equity, & statistics',
  },
  {
    name: 'Trading Plan',
    href: '/trading-plan',
    iconName: 'Scroll',
    description: 'Core rules, risk parameters, session guidelines, & discipline boundaries',
  },
  {
    name: 'Journal',
    href: '/journal',
    iconName: 'BookOpen',
    badge: 'Log',
    description: 'Trade logs, psychological state tracking, mistakes & annotations',
  },
  {
    name: 'Strategies',
    href: '/strategies',
    iconName: 'Cpu',
    description: 'System repository, active models, versioning & templates',
  },
  {
    name: 'Backtester',
    href: '/backtester',
    iconName: 'FlaskConical',
    description: 'Historical simulation workstation, scenario testing & stats',
  },
  {
    name: 'Paper Trading',
    href: '/paper-trading',
    iconName: 'Coins',
    badge: 'Live',
    description: 'Real-time forward testing execution sandbox without financial risk',
  },
  {
    name: 'Analytics',
    href: '/analytics',
    iconName: 'LineChart',
    description: 'Deep mathematical edge breakdown, streaks, timing & attribution',
  },
  {
    name: 'Market Data',
    href: '/market-data',
    iconName: 'Activity',
    description: 'Cross-asset watchlists, quotes, liquidity & price action',
  },
]

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    name: 'Settings',
    href: '/settings',
    iconName: 'Settings',
    description: 'Preferences, risk thresholds, API credentials & terminal theme',
  },
]

