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
import { formatDate } from '@/utils/formatters'

export interface DrawdownChartProps {
  data: EquityPoint[]
  height?: number
}

export const DrawdownChart: React.FC<DrawdownChartProps> = ({ data, height = 180 }) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="drawdownGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.0} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.4} />
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
            orientation="right"
            stroke="#475569"
            tickFormatter={(val) => `${val.toFixed(1)}%`}
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload as EquityPoint
                return (
                  <div className="bg-[#0b0f17] border border-[#232f46] p-2 rounded shadow-xl text-xs font-mono">
                    <p className="text-slate-400 text-[10px]">{formatDate(item.date)}</p>
                    <p className="text-rose-400 font-bold mt-1">
                      Drawdown: {item.drawdown?.toFixed(2)}%
                    </p>
                  </div>
                )
              }
              return null
            }}
          />
          <Area
            type="monotone"
            dataKey="drawdown"
            stroke="#f43f5e"
            strokeWidth={1.5}
            fillOpacity={1}
            fill="url(#drawdownGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

