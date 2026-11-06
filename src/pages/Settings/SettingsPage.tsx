import React, { useState, useEffect } from 'react'
import {
  User,
  Palette,
  Sliders,
  Shield,
  Key,
  Bell,
  Save,
  ShieldAlert,
  Lock,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Tabs } from '@/components/ui/Tabs'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { userService } from '@/services/userService'

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const { user, profile, refreshProfile, isConfigured } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [timezone, setTimezone] = useState('America/New_York')
  const [defaultRisk, setDefaultRisk] = useState('1.0')
  const [defaultTimeframe, setDefaultTimeframe] = useState('15m')
  const [themeMode, setThemeMode] = useState('terminal-dark')
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const { addToast } = useToast()

  useEffect(() => {
    if (profile) {
      setName(profile.display_name || '')
      setEmail(profile.email || '')
    } else if (user) {
      setName((user.user_metadata?.display_name as string) || user.email?.split('@')[0] || '')
      setEmail(user.email || '')
    }
  }, [profile, user])

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'appearance', label: 'Appearance & Theme', icon: <Palette className="w-3.5 h-3.5" /> },
    { id: 'trading', label: 'Trading & Risk Defaults', icon: <Sliders className="w-3.5 h-3.5" /> },
    { id: 'api', label: 'API Keys & Secrets', icon: <Key className="w-3.5 h-3.5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-3.5 h-3.5" /> },
    { id: 'security', label: 'Security & Access', icon: <Shield className="w-3.5 h-3.5" /> },
  ]

  const handleSave = async () => {
    setIsSaving(true)
    if (user?.id) {
      await userService.updateProfile(user.id, {
        display_name: name,
        email: email,
      })
      await refreshProfile()
    }
    setTimeout(() => {
      setIsSaving(false)
      addToast({
        title: 'Settings Saved',
        description: 'Workstation user profile and risk configuration successfully persisted.',
        type: 'success',
      })
    }, 400)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Workstation Settings & Environment Configuration"
        description="Configure account parameters, default risk limits, terminal appearance, and encrypted API credentials."
        badge={
          <Badge variant={isConfigured ? 'bullish' : 'info'}>
            {isConfigured ? 'SUPABASE AUTH' : 'LOCAL DEMO AUTH'}
          </Badge>
        }
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Save className="w-3.5 h-3.5" />}
            isLoading={isSaving}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Researcher Profile</CardTitle>
            <span className="text-[11px] font-mono text-slate-500">
              UID: {user?.id ? `${user.id.slice(0, 12)}...` : 'Unauthenticated'}
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Full Name / Handle"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label="Email Address (Authenticated)"
                type="email"
                value={email}
                disabled
                helperText="Email is bound to your cryptographic session."
              />
              <Select
                label="Base Reporting Currency"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: 'USD', label: 'USD - United States Dollar ($)' },
                  { value: 'EUR', label: 'EUR - Euro (€)' },
                  { value: 'GBP', label: 'GBP - British Pound (£)' },
                  { value: 'JPY', label: 'JPY - Japanese Yen (¥)' },
                ]}
              />
              <Select
                label="Primary Timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                options={[
                  { value: 'America/New_York', label: 'Eastern Time (US / New York - EST)' },
                  { value: 'America/Chicago', label: 'Central Time (CST)' },
                  { value: 'Europe/London', label: 'London Time (GMT / BST)' },
                  { value: 'Asia/Tokyo', label: 'Tokyo Time (JST)' },
                  { value: 'UTC', label: 'Coordinated Universal Time (UTC)' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Terminal Theme & Interface Contrast</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <label className="text-xs font-medium text-slate-300 block">Theme Style</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  onClick={() => setThemeMode('terminal-dark')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    themeMode === 'terminal-dark'
                      ? 'border-blue-500 bg-[#162030]'
                      : 'border-[#1e273a] bg-[#0c1018]'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">Terminal Onyx (Default)</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Deep charcoal with emerald & rose financial accents.
                  </div>
                </div>

                <div
                  onClick={() => setThemeMode('pure-black')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    themeMode === 'pure-black'
                      ? 'border-blue-500 bg-[#162030]'
                      : 'border-[#1e273a] bg-[#0c1018]'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">High Contrast Black</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    OLED pure black background for intense low-light focus.
                  </div>
                </div>

                <div
                  onClick={() => setThemeMode('midnight')}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    themeMode === 'midnight'
                      ? 'border-blue-500 bg-[#162030]'
                      : 'border-[#1e273a] bg-[#0c1018]'
                  }`}
                >
                  <div className="text-xs font-bold text-slate-200">Midnight Slate</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Deep navy blue tinted trading desk environment.
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1c2436] space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="rounded bg-[#0c1018] border-slate-700 text-blue-600 focus:ring-0"
                />
                <span className="text-xs text-slate-300">
                  Enable subtle auditory ticks on trade fills and stop-loss breaches
                </span>
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trading & Risk Defaults Tab */}
      {activeTab === 'trading' && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>Global Trading & Risk Defaults</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Default Risk Per Trade (%)"
                type="number"
                step="0.1"
                value={defaultRisk}
                onChange={(e) => setDefaultRisk(e.target.value)}
                helperText="Pre-fills risk calculations in Backtester and Paper Trading."
              />
              <Select
                label="Default Chart Timeframe"
                value={defaultTimeframe}
                onChange={(e) => setDefaultTimeframe(e.target.value)}
                options={[
                  { value: '1m', label: '1 Minute' },
                  { value: '5m', label: '5 Minutes' },
                  { value: '15m', label: '15 Minutes (Default)' },
                  { value: '1h', label: '1 Hour' },
                  { value: '4h', label: '4 Hours' },
                  { value: '1D', label: 'Daily' },
                ]}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* API Keys & Secrets Tab */}
      {activeTab === 'api' && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              API Settings & Secrets Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Security Notice */}
            <div className="p-3.5 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200/90 leading-relaxed">
                <strong className="text-amber-300 block mb-1 font-mono">
                  SECURITY ARCHITECTURE POLICY:
                </strong>
                API credentials must <strong>NEVER</strong> be hardcoded in frontend code or Git repositories.
                Future broker & market data secrets will be loaded dynamically through server-side environment variables
                (<code>.env.local</code> / Vault) and signed backend proxies.
              </div>
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded bg-[#0c1018] border border-[#1c2436] space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-semibold">Supabase Backend Status</span>
                  <Badge variant={isConfigured ? 'bullish' : 'neutral'}>
                    {isConfigured ? 'CONNECTED' : 'LOCAL DEMO PROVIDER'}
                  </Badge>
                </div>
                <p className="text-[11px] text-slate-500">
                  {isConfigured ? 'PostgreSQL RLS Active with Auth Tokens' : 'Configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY'}
                </p>
              </div>

              <div className="p-3 rounded bg-[#0c1018] border border-[#1c2436] space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-semibold">Interactive Brokers (TWS / Gateway)</span>
                  <Badge variant="neutral">DISCONNECTED</Badge>
                </div>
                <p className="text-[11px] text-slate-500">Host: 127.0.0.1:7497 (Socket API)</p>
              </div>

              <div className="p-3 rounded bg-[#0c1018] border border-[#1c2436] space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span className="font-semibold">Alpaca Markets (Equities / Crypto)</span>
                  <Badge variant="neutral">CONFIG REQUIRED</Badge>
                </div>
                <p className="text-[11px] text-slate-500">Configured via ALPACA_API_KEY env var</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle>System & Risk Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-[#0c1018] border-slate-700 text-blue-600" />
              <span className="text-slate-300">Daily Loss Limit Warnings (trigger alerts at 80% threshold)</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-[#0c1018] border-slate-700 text-blue-600" />
              <span className="text-slate-300">Backtest Completion Notifications</span>
            </label>
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded bg-[#0c1018] border-slate-700 text-blue-600" />
              <span className="text-slate-300">Trading Plan Rule Breach Interceptions</span>
            </label>
          </CardContent>
        </Card>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <Card className="max-w-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-400" />
              Security & Environment Isolation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-slate-300">
            <p>
              TRL operates with strict Row Level Security (RLS) policies. Every table in the database verifies <code>auth.uid() = user_id</code> to guarantee zero cross-tenant visibility.
            </p>
            <div className="p-3 rounded bg-[#0c1018] border border-[#1c2436] font-mono text-[11px] text-slate-400 space-y-1">
              <div>Session Token: Cryptographically signed via Supabase JWT</div>
              <div>Row Level Security: Enabled on all tables</div>
              <div>Private Storage Bucket: trade-screenshots (User Isolated)</div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
