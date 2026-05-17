import React from 'react'

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info'

type BadgeProps = {
  text: string
  leadingIcon?: React.ReactNode
  trailingIcon?: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClass: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700',
  primary: 'bg-primary/10 text-primary',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  error:   'bg-red-100 text-red-700',
  info:    'bg-blue-100 text-blue-700',
}

const Badge = ({
  text,
  leadingIcon,
  trailingIcon,
  variant = 'default',
  className = '',
}: BadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${variantClass[variant]} ${className}`}
  >
    {leadingIcon && <span className="inline-flex items-center text-[14px]">{leadingIcon}</span>}
    {text}
    {trailingIcon && <span className="inline-flex items-center text-[14px]">{trailingIcon}</span>}
  </span>
)

export default Badge
