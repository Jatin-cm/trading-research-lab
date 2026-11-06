import React from 'react'
import { cn } from '@/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'secondary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-blue-500/50 disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.99] cursor-pointer'

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
      md: 'text-sm px-3.5 py-2 rounded-md gap-2',
      lg: 'text-base px-5 py-2.5 rounded-lg gap-2.5',
      icon: 'p-2 rounded-md',
    }

    const variantStyles = {
      primary:
        'bg-blue-600 text-white hover:bg-blue-500 shadow-sm border border-blue-500/30',
      secondary:
        'bg-[#192231] text-slate-200 hover:bg-[#202c40] border border-[#28354c] hover:border-slate-600',
      outline:
        'bg-transparent text-slate-300 hover:bg-[#161d2a] border border-[#232d3f] hover:border-slate-500',
      ghost:
        'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-[#161f2c]',
      danger:
        'bg-red-500/15 text-red-400 hover:bg-red-500/25 border border-red-500/30',
      success:
        'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/30',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        ) : leftIcon ? (
          <span className="inline-flex shrink-0">{leftIcon}</span>
        ) : null}
        {children}
        {!isLoading && rightIcon ? (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        ) : null}
      </button>
    )
  }
)

Button.displayName = 'Button'

