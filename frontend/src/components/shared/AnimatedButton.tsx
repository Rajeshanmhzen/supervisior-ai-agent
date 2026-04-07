import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Ripple = { id: number; x: number; y: number }

type AnimatedButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  rippleColor?: string
}

const AnimatedButton = ({ children, className = '', rippleColor = 'bg-white/30', onClick, ...rest }: AnimatedButtonProps) => {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600)
    onClick?.(e)
  }

  return (
    <motion.button
      {...rest}
      className={`relative overflow-hidden ${className}`}
      onClick={handleClick}
      whileTap={{ scale: 0.93 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <AnimatePresence>
        {ripples.map((r) => (
          <motion.span
            key={r.id}
            className={`absolute rounded-full pointer-events-none ${rippleColor}`}
            style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
            initial={{ width: 0, height: 0, opacity: 0.6 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' as const }}
          />
        ))}
      </AnimatePresence>
      {children}
    </motion.button>
  )
}

export default AnimatedButton
