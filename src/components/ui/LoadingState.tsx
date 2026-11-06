import React from 'react'
import { cn } from '@/utils/cn'

export interface LoadingStateProps {
  message?: string
  subtext?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading workstation data...',
  subtext = 'Fetching metrics & synchronized tick states',
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center rounded-lg border border-[#1b2333] bg-[#0c1018]/50',
        className
      )}
    >
      <div className="relative w-8 h-8 mb-3">
        <div className="w-8 h-8 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
      </div>
      <p className="text-xs font-semibold text-slate-200">{message}</p>
      {subtext && <p className="text-[11px] text-slate-500 mt-1">{subtext}</p>}
    </div>
  )
}

