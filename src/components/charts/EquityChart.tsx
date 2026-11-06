import React from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import { EquityPoint } from '@/types'
import { formatCurrency, formatDate } from '@/utils/formatters'

export interface EquityChartProps {
  data: EquityPoint[]
  height?: number
  showDrawdown?: boolean
  color?: string
}

export const EquityChart: React.FC<EquityChartProps> = ({
  data,
  height = 280,
  color = '#3b82f6',
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-xs text-slate-500 font-mono">
        No equity curve data available
      </div>
    )
  }

  const minVal = Math.min(...data.map((d) => d.equity)) * 0.98
  const maxVal = Math.max(...data.map((d) => d.equity)) * 1.02

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.35} />
              <stop offset="95%" stopColor={color} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c2538" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={(str) => formatDate(str)}
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1c2538' }}
          />
          <YAxis
            domain={[minVal, maxVal]}
            orientation="right"
            stroke="#475569"
            tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as EquityPoint
                return (
                  <div className="bg-[#0b0f17] border border-[#232f46] p-2.5 rounded shadow-xl text-xs font-mono">
                    <p className="text-slate-400 text-[10px]">{formatDate(item.date)}</p>
                    <p className="text-slate-100 font-bold mt-1">
                      Equity: <span className="text-emerald-400">{formatCurrency(item.equity)}</span>
                    </p>
                    {item.drawdown !== undefined && (
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Drawdown:{' '}
                        <span className={item.drawdown < 0 ? 'text-rose-400' : 'text-slate-400'}>
                          {item.drawdown.toFixed(2)}%
                        </span>
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke={color}
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#equityGradient)"
            isAnimationActive={true}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

