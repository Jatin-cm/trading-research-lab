import React from 'react'
import { cn } from '@/utils/cn'
import { AlertCircle } from 'lucide-react'
import { Button } from './Button'

export interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Data Feed Interrupted',
  message,
  onRetry,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-lg border border-rose-500/30 bg-rose-950/10',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-400 mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h4 className="text-sm font-semibold text-rose-300">{title}</h4>
      <p className="text-xs text-rose-200/80 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <div className="mt-4">
          <Button size="sm" variant="danger" onClick={onRetry}>
            Retry Connection
          </Button>
        </div>
      )}
    </div>
  )
}

