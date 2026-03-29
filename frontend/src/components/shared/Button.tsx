import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = {
  children: React.ReactNode
  variant?: ButtonVariant
  className?: string
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  disabled?: boolean
}

const baseClass =
  'inline-flex items-center justify-center rounded-full px-6 py-3 font-headline text-sm font-bold transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed'

const variantClass: Record<ButtonVariant, string> = {
  primary:
    'text-on-primary shadow-lg hover:opacity-90',
  secondary:
    'bg-secondary-container text-on-secondary-container hover:opacity-90',
  ghost:
    'bg-transparent text-primary hover:bg-surface-container-high',
}

const gradientStyle = {
  background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
}

const Button = ({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  onClick,
  disabled,
}: ButtonProps) => {
  const style = variant === 'primary' ? gradientStyle : undefined

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClass} ${variantClass[variant]} ${className}`}
      style={style}
    >
      {children}
    </button>
  )
}

export default Button
