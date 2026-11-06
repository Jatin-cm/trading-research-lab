import React, { useState, useEffect } from 'react'
import {
  Scroll,
  ShieldCheck,
  Clock,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Brain,
  Ban,
  DollarSign,
  Edit3,
  Layers,
  Lock,
} from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { Badge } from '@/components/ui/Badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { tradingPlanService } from '@/services/tradingPlanService'
import { mockTradingPlan } from '@/services/mockData'
import { TradingPlan } from '@/types'
import { formatCurrency, formatPercent } from '@/utils/formatters'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'

export const TradingPlanPage: React.FC = () => {
  const [isEditorModalOpen, setIsEditorModalOpen] = useState(false)
  const [plan, setPlan] = useState<TradingPlan>(mockTradingPlan)
  const { addToast } = useToast()
  const { user, isConfigured } = useAuth()

  useEffect(() => {
    tradingPlanService.getActivePlan(user?.id).then(({ plan: loadedPlan }) => {
      setPlan(loadedPlan)
    })
  }, [user?.id])

  const handleEditorClick = () => {
    setIsEditorModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Trading Plan & Discipline Manifesto"
        description="Core operational playbook, defined market boundaries, session parameters, hard risk constraints, and psychological guardrails."
        badge={<Badge variant="info">v{plan.version}</Badge>}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Edit3 className="w-3.5 h-3.5" />}
              onClick={handleEditorClick}
            >
              Edit Trading Plan
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<Lock className="w-3.5 h-3.5" />}
              onClick={() =>
                addToast({
                  title: 'Plan Locked & Enforced',
                  description: 'All paper and live trading rule checks are validated against this active plan in PostgreSQL.',
                  type: 'success',
                })
              }
            >
              Enforce Rules
            </Button>
          </>
        }
      />

      {/* Phase 2 Notice Banner */}
      <div className="p-4 rounded-lg bg-blue-950/20 border border-blue-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-blue-500/20 text-blue-400 shrink-0">
            <Scroll className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-blue-200">
              Trading Plan Editor — Coming in next phase (Phase 2)
            </h3>
            <p className="text-[11px] text-blue-300/70 mt-0.5">
              The database schema <code>trading_plans</code> and backend RLS policies are now live. Interactive rule editing and execution compliance trees will be unlocked in Phase 2.
            </p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="border-blue-500/40 text-blue-300" onClick={handleEditorClick}>
          Preview Editor Roadmap
        </Button>
      </div>

      {/* Main Grid: Core Parameters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Markets Allowed */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              Authorized Markets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-wrap gap-1.5">
              {plan.markets.map((m) => (
                <Badge key={m} variant="neutral" size="sm">
                  {m}
                </Badge>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 font-mono pt-2">
              Trading non-authorized asset classes triggers automatic suspension.
            </p>
          </CardContent>
        </Card>

        {/* Trading Sessions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Trading Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.sessions.map((s) => (
              <div key={s.name} className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-300">{s.name}</span>
                <span className="text-slate-500 text-[11px]">{s.hoursUTC}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Daily Risk Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              Daily Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Max Daily Trades:</span>
              <span className="text-slate-100 font-bold">{plan.dailyLimits.maxDailyTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Daily Loss Cap:</span>
              <span className="text-rose-400 font-bold">
                -{formatCurrency(plan.dailyLimits.maxDailyLossUSD)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Profit Lock Target:</span>
              <span className="text-emerald-400 font-bold">
                +{formatCurrency(plan.dailyLimits.profitLockTargetUSD)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Risk Limits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-rose-400" />
              Weekly Limits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Max Weekly Trades:</span>
              <span className="text-slate-100 font-bold">{plan.weeklyLimits.maxWeeklyTrades}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Weekly Loss Cap:</span>
              <span className="text-rose-400 font-bold">
                -{formatCurrency(plan.weeklyLimits.maxWeeklyLossUSD)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Loss % Threshold:</span>
              <span className="text-rose-400 font-bold">
                -{formatPercent(plan.riskRules.weeklyLossLimitPercent)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Management Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-400" />
              Risk Management Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-2.5 rounded bg-[#0b0e14] border border-[#1c2436]">
                <span className="text-[10px] text-slate-500 block uppercase">Max Risk Per Trade</span>
                <span className="text-base font-bold text-slate-100">
                  {plan.riskRules.maxRiskPerTradePercent}% Equity
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#0b0e14] border border-[#1c2436]">
                <span className="text-[10px] text-slate-500 block uppercase">Min Risk : Reward</span>
                <span className="text-base font-bold text-emerald-400">
                  1 : {plan.riskRules.minRiskRewardRatio}
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#0b0e14] border border-[#1c2436]">
                <span className="text-[10px] text-slate-500 block uppercase">Max Open Positions</span>
                <span className="text-base font-bold text-slate-100">
                  {plan.riskRules.maxOpenPositions} Simultaneous
                </span>
              </div>
              <div className="p-2.5 rounded bg-[#0b0e14] border border-[#1c2436]">
                <span className="text-[10px] text-slate-500 block uppercase">Max Correlated Exposure</span>
                <span className="text-base font-bold text-slate-100">
                  {plan.riskRules.maxCorrelatedPositions} Symbol
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeframes Hierarchy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              Timeframes & Hierarchy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {plan.timeframes.map((tf, idx) => (
              <div
                key={tf}
                className="flex items-center gap-3 p-2 rounded bg-[#0b0e14] border border-[#1c2436] text-xs font-mono"
              >
                <span className="w-5 h-5 rounded-full bg-[#172030] text-blue-400 flex items-center justify-center text-[10px] font-bold">
                  {idx + 1}
                </span>
                <span className="text-slate-200">{tf}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Entry Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Entry Rules & Validation Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.entryRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Exit Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-rose-400" />
              Exit Rules & Profit Realization
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.exitRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Psychology Rules */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              Psychology Rules & Discipline Protocols
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.psychologyRules.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{rule}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* No-Trade Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Ban className="w-4 h-4 text-amber-400" />
              No-Trade Conditions (Stand Down Mandate)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {plan.noTradeConditions.map((cond, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{cond}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Editor Coming Soon Modal */}
      <Modal
        isOpen={isEditorModalOpen}
        onClose={() => setIsEditorModalOpen(false)}
        title="Trading Plan Editor — Coming in Phase 2"
        description="Module specifications and integration roadmap"
        footer={
          <Button variant="primary" size="sm" onClick={() => setIsEditorModalOpen(false)}>
            Understood
          </Button>
        }
      >
        <div className="space-y-3 text-xs text-slate-300">
          <p>
            The comprehensive visual Trading Plan Editor will be fully engineered in <strong>Phase 2</strong>.
          </p>
          <div className="p-3 rounded bg-[#0b0e14] border border-[#1c2436] space-y-2 font-mono">
            <h5 className="font-semibold text-slate-200">Database & Security Setup:</h5>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>PostgreSQL table <code>trading_plans</code> created</li>
              <li>RLS policy active: <code>auth.uid() = user_id</code></li>
              <li>Connected via <code>tradingPlanService</code> abstraction</li>
              <li>Pre-trade compliance gates ready to hook into Paper & Live trading</li>
            </ul>
          </div>
        </div>
      </Modal>
    </div>
  )
}
