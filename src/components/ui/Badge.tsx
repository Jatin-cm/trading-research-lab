import React from 'react'
import { cn } from '@/utils/cn'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'bullish' | 'bearish' | 'warning' | 'info' | 'outline' | 'neutral'
  size?: 'sm' | 'md'
  dot?: boolean
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'default',
  size = 'sm',
  dot = false,
  children,
  ...props
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 tracking-wide',
    md: 'text-xs px-2.5 py-1',
  }

  const variantStyles = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    bullish: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium',
    bearish: 'bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium',
    warning: 'bg-amber-500/10 text-amber-300 border border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    outline: 'bg-transparent text-slate-300 border border-slate-700',
    neutral: 'bg-[#151c28] text-slate-400 border border-[#212c3f]',
  }

  const dotColors = {
    default: 'bg-slate-400',
    bullish: 'bg-emerald-400 animate-pulse',
    bearish: 'bg-rose-400 animate-pulse',
    warning: 'bg-amber-400',
    info: 'bg-blue-400',
    outline: 'bg-slate-400',
    neutral: 'bg-slate-500',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded font-mono font-medium whitespace-nowrap',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotColors[variant])} />}
      {children}
    </span>
  )
}

