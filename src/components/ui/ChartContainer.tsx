import React from 'react'
import { cn } from '@/utils/cn'

export interface ChartContainerProps {
  title: string
  subtitle?: string
  badge?: React.ReactNode
  timeframes?: string[]
  activeTimeframe?: string
  onTimeframeChange?: (tf: string) => void
  actions?: React.ReactNode
  children: React.ReactNode
  height?: number | string
  className?: string
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  title,
  subtitle,
  badge,
  timeframes,
  activeTimeframe,
  onTimeframeChange,
  actions,
  children,
  height = 300,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-[#111622] rounded-lg border border-[#1d2638] overflow-hidden flex flex-col',
        className
      )}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-4 py-3 border-b border-[#1c2436] bg-[#0f1420]/60">
        <div className="flex items-center gap-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                {title}
              </h3>
              {badge}
            </div>
            {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {timeframes && onTimeframeChange && (
            <div className="flex items-center p-0.5 bg-[#0a0d14] rounded border border-[#1c2436]">
              {timeframes.map((tf) => {
                const isActive = tf === activeTimeframe
                return (
                  <button
                    key={tf}
                    type="button"
                    onClick={() => onTimeframeChange(tf)}
                    className={cn(
                      'px-2 py-0.5 text-[11px] font-mono rounded transition-colors cursor-pointer',
                      isActive
                        ? 'bg-blue-600/30 text-blue-300 font-semibold border border-blue-500/40'
                        : 'text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {tf}
                  </button>
                )
              })}
            </div>
          )}
          {actions}
        </div>
      </div>

      {/* Chart Canvas Area */}
      <div
        className="p-4 w-full relative flex-1 min-h-[220px]"
        style={{ height: typeof height === 'number' ? `${height}px` : height }}
      >
        {children}
      </div>
    </div>
  )
}

