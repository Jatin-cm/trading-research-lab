import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from 'recharts'
import { formatCurrency } from '@/utils/formatters'

export interface BarDataPoint {
  [key: string]: string | number
}

export interface PerformanceBarChartProps {
  data: BarDataPoint[]
  xKey: string
  yKey: string
  height?: number
  isCurrency?: boolean
}

export const PerformanceBarChart: React.FC<PerformanceBarChartProps> = ({
  data,
  xKey,
  yKey,
  height = 220,
  isCurrency = true,
}) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1c2538" vertical={false} />
          <XAxis
            dataKey={xKey}
            stroke="#475569"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={{ stroke: '#1c2538' }}
          />
          <YAxis
            orientation="right"
            stroke="#475569"
            tickFormatter={(val) => (isCurrency ? `$${val}` : `${val}%`)}
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as BarDataPoint
                const val = Number(item[yKey])
                return (
                  <div className="bg-[#0b0f17] border border-[#232f46] p-2.5 rounded shadow-xl text-xs font-mono">
                    <p className="text-slate-400 text-[10px]">{String(item[xKey])}</p>
                    <p className="font-bold mt-1">
                      <span className={val >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                        {isCurrency ? formatCurrency(val) : `${val}%`}
                      </span>
                    </p>
                    {item.winRate !== undefined && (
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        Win Rate: {item.winRate}%
                      </p>
                    )}
                    {item.trades !== undefined && (
                      <p className="text-slate-400 text-[11px]">
                        Trades: {item.trades}
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }}
          />
          <Bar dataKey={yKey} radius={[2, 2, 0, 0]}>
            {data.map((entry, index) => {
              const val = Number(entry[yKey])
              return (
                <Cell
                  key={`cell-${index}`}
                  fill={val >= 0 ? '#10b981' : '#f43f5e'}
                  opacity={0.85}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

