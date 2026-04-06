import React from 'react'
import AnimatedButton from './AnimatedButton'

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
  'inline-flex items-center justify-center rounded-full px-6 py-3 font-headline text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed'

const variantClass: Record<ButtonVariant, string> = {
  primary: 'text-on-primary shadow-lg hover:opacity-90',
  secondary: 'bg-secondary-container text-on-secondary-container hover:opacity-90',
  ghost: 'bg-transparent text-primary hover:bg-surface-container-high',
}

const gradientStyle = {
  background: 'linear-gradient(135deg, #004ac6 0%, #2563eb 100%)',
}

const rippleColorMap: Record<ButtonVariant, string> = {
  primary: 'bg-white/30',
  secondary: 'bg-white/20',
  ghost: 'bg-primary/10',
}

const Button = ({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  onClick,
  disabled,
}: ButtonProps) => (
  <AnimatedButton
    type={type}
    onClick={onClick ? () => onClick() : undefined}
    disabled={disabled}
    className={`${baseClass} ${variantClass[variant]} ${className}`}
    style={variant === 'primary' ? gradientStyle : undefined}
    rippleColor={rippleColorMap[variant]}
  >
    {children}
  </AnimatedButton>
)

export default Button
