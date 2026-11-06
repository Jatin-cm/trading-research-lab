import React from 'react'
import { MonthlyReturn } from '@/types'
import { cn } from '@/utils/cn'

export interface MonthlyReturnsMatrixProps {
  data: MonthlyReturn[]
  className?: string
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const MonthlyReturnsMatrix: React.FC<MonthlyReturnsMatrixProps> = ({
  data,
  className,
}) => {
  const getCellColor = (val: number | null | undefined) => {
    if (val === null || val === undefined) return 'bg-[#121722] text-slate-600'
    if (val > 5) return 'bg-emerald-500/25 text-emerald-300 font-semibold'
    if (val > 0) return 'bg-emerald-500/15 text-emerald-400'
    if (val === 0) return 'bg-[#151c28] text-slate-400'
    if (val > -3) return 'bg-rose-500/15 text-rose-400'
    return 'bg-rose-500/25 text-rose-300 font-semibold'
  }

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-xs font-mono border-collapse">
        <thead>
          <tr className="border-b border-[#1c2436] text-[11px] text-slate-400">
            <th className="py-2 px-3 text-left font-medium">Year</th>
            {MONTHS.map((m) => (
              <th key={m} className="py-2 px-2 text-center font-medium">
                {m}
              </th>
            ))}
            <th className="py-2 px-3 text-right font-medium">YTD</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#171f2d]">
          {data.map((row) => (
            <tr key={row.year} className="hover:bg-[#151c29]/50 transition-colors">
              <td className="py-2.5 px-3 font-semibold text-slate-200">{row.year}</td>
              {MONTHS.map((m) => {
                const val = row.months[m]
                return (
                  <td key={m} className="py-2 px-1 text-center">
                    <span
                      className={cn(
                        'inline-block w-full py-1 px-1.5 rounded text-[11px] tabular-nums',
                        getCellColor(val)
                      )}
                    >
                      {val !== null && val !== undefined
                        ? `${val > 0 ? '+' : ''}${val.toFixed(1)}%`
                        : '—'}
                    </span>
                  </td>
                )
              })}
              <td className="py-2.5 px-3 text-right font-bold">
                <span
                  className={cn(
                    'inline-block py-1 px-2 rounded text-[11px] tabular-nums',
                    row.total >= 0
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-rose-500/20 text-rose-300'
                  )}
                >
                  {row.total >= 0 ? '+' : ''}
                  {row.total.toFixed(1)}%
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

