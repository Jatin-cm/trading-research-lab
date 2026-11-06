import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { TradingPlan } from '@/types'
import { Database } from '@/types/database'
import { mockTradingPlan } from './mockData'

export type TradingPlanRow = Database['public']['Tables']['trading_plans']['Row']
export type TradingPlanInsert = Database['public']['Tables']['trading_plans']['Insert']

class TradingPlanService {
  async getActivePlan(userId?: string): Promise<{ plan: TradingPlan; error: Error | null }> {
    if (!isSupabaseConfigured() || !userId) {
      return { plan: mockTradingPlan, error: null }
    }

    try {
      const { data, error } = await supabase
        .from('trading_plans')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (error) throw error

      if (!data) {
        return { plan: mockTradingPlan, error: null }
      }

      // Map DB row to UI domain TradingPlan interface
      const plan: TradingPlan = {
        id: data.id,
        title: data.name,
        version: '1.0',
        lastUpdated: new Date(data.updated_at).toLocaleDateString(),
        markets: data.authorized_markets as any || mockTradingPlan.markets,
        sessions: data.trading_sessions as any || mockTradingPlan.sessions,
        timeframes: data.timeframe_hierarchy as any || mockTradingPlan.timeframes,
        riskRules: {
          maxRiskPerTradePercent: Number(data.risk_per_trade),
          dailyLossLimitPercent: 2.5,
          weeklyLossLimitPercent: 5.0,
          maxOpenPositions: 3,
          maxCorrelatedPositions: 1,
          minRiskRewardRatio: 1.8,
        },
        entryRules: data.entry_rules as any || mockTradingPlan.entryRules,
        exitRules: data.exit_rules as any || mockTradingPlan.exitRules,
        tradeManagementRules: mockTradingPlan.tradeManagementRules,
        psychologyRules: data.psychology_rules as any || mockTradingPlan.psychologyRules,
        noTradeConditions: data.no_trade_conditions as any || mockTradingPlan.noTradeConditions,
        dailyLimits: {
          maxDailyTrades: data.max_trades_per_day,
          maxDailyLossUSD: Number(data.daily_loss_limit),
          profitLockTargetUSD: 4000,
        },
        weeklyLimits: {
          maxWeeklyTrades: 16,
          maxWeeklyLossUSD: Number(data.weekly_loss_limit),
        },
      }

      return { plan, error: null }
    } catch (err: any) {
      return { plan: mockTradingPlan, error: err }
    }
  }

  async savePlan(userId: string, plan: Partial<TradingPlan>): Promise<{ success: boolean; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      return { success: true, error: null }
    }

    try {
      const { error } = await supabase.from('trading_plans').insert({
        user_id: userId,
        name: plan.title || 'Master Trading Plan',
        description: 'Primary operational plan',
        authorized_markets: (plan.markets || mockTradingPlan.markets) as any,
        trading_sessions: (plan.sessions || mockTradingPlan.sessions) as any,
        daily_loss_limit: plan.dailyLimits?.maxDailyLossUSD || 1500,
        weekly_loss_limit: plan.weeklyLimits?.maxWeeklyLossUSD || 4500,
        risk_per_trade: plan.riskRules?.maxRiskPerTradePercent || 1.0,
        max_trades_per_day: plan.dailyLimits?.maxDailyTrades || 4,
        timeframe_hierarchy: (plan.timeframes || mockTradingPlan.timeframes) as any,
        entry_rules: (plan.entryRules || mockTradingPlan.entryRules) as any,
        exit_rules: (plan.exitRules || mockTradingPlan.exitRules) as any,
        psychology_rules: (plan.psychologyRules || mockTradingPlan.psychologyRules) as any,
        no_trade_conditions: (plan.noTradeConditions || mockTradingPlan.noTradeConditions) as any,
      })

      if (error) throw error
      return { success: true, error: null }
    } catch (err: any) {
      return { success: false, error: err }
    }
  }
}

export const tradingPlanService = new TradingPlanService()

