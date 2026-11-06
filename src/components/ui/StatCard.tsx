import React from 'react'
import { cn } from '@/utils/cn'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

export interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  formatChange?: boolean
  prefix?: string
  suffix?: string
  icon?: React.ReactNode
  variant?: 'default' | 'bullish' | 'bearish'
  trendDirection?: 'up' | 'down' | 'neutral'
  subtext?: string
  className?: string
  tooltip?: string
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  changeLabel,
  formatChange = true,
  prefix,
  suffix,
  icon,
  variant = 'default',
  trendDirection,
  subtext,
  className,
}) => {
  const isPositive = change !== undefined ? change > 0 : trendDirection === 'up'
  const isNegative = change !== undefined ? change < 0 : trendDirection === 'down'

  const borderStyles = {
    default: 'border-[#1c2436]',
    bullish: 'border-emerald-500/30',
    bearish: 'border-rose-500/30',
  }

  return (
    <div
      className={cn(
        'bg-[#111622] rounded-lg border p-4 transition-all duration-150 relative overflow-hidden',
        borderStyles[variant],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          {label}
        </span>
        {icon && <div className="text-slate-500 shrink-0">{icon}</div>}
      </div>

      <div className="mt-2 flex items-baseline gap-2">
        <div className="text-xl sm:text-2xl font-bold tracking-tight text-slate-100 font-mono tabular-nums">
          {prefix}
          {value}
          {suffix}
        </div>
      </div>

      {(change !== undefined || subtext) && (
        <div className="mt-2 flex items-center justify-between text-xs">
          {change !== undefined ? (
            <div
              className={cn(
                'inline-flex items-center gap-1 font-mono font-medium',
                isPositive && 'text-emerald-400',
                isNegative && 'text-rose-400',
                !isPositive && !isNegative && 'text-slate-400'
              )}
            >
              {isPositive ? (
                <TrendingUp className="w-3.5 h-3.5" />
              ) : isNegative ? (
                <TrendingDown className="w-3.5 h-3.5" />
              ) : (
                <Minus className="w-3.5 h-3.5" />
              )}
              <span>
                {formatChange && change > 0 ? `+${change.toFixed(2)}%` : `${change?.toFixed(2)}%`}
              </span>
              {changeLabel && <span className="text-slate-500 ml-1">{changeLabel}</span>}
            </div>
          ) : (
            <span className="text-slate-500">{subtext}</span>
          )}

          {subtext && change !== undefined && (
            <span className="text-slate-500 text-[11px] truncate max-w-[120px]">{subtext}</span>
          )}
        </div>
      )}
    </div>
  )
}

