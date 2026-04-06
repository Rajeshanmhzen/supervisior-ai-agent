import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Ripple = { id: number; x: number; y: number }

const CtaSection = () => {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600)
  }

  return (
    <motion.section
      className="pb-32 px-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' as const }}
    >
      <div className="max-w-7xl mx-auto rounded-xl bg-gradient-to-br from-primary-fixed-dim to-secondary-fixed p-16 md:p-24 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-on-primary-fixed mb-8">
            Ready for your Pre-Viva?
          </h2>
          <p className="text-on-primary-fixed/70 text-lg mb-12 max-w-xl mx-auto">
            Don&apos;t let formatting errors lower your score. Join 500+ BCA students who validated
            their projects this semester.
          </p>
          <motion.button
            className="relative overflow-hidden px-10 py-5 bg-primary text-white rounded-xl font-headline font-bold text-xl hover:shadow-2xl hover:shadow-primary/40 transition-shadow"
            whileTap={{ scale: 0.93 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            onClick={handleClick}
          >
            <AnimatePresence>
              {ripples.map((r) => (
                <motion.span
                  key={r.id}
                  className="absolute rounded-full bg-white/30 pointer-events-none"
                  style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
                  initial={{ width: 0, height: 0, opacity: 0.6 }}
                  animate={{ width: 300, height: 300, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' as const }}
                />
              ))}
            </AnimatePresence>
            Validate My Project Now
          </motion.button>
        </div>
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
    </motion.section>
  )
}

export default CtaSection
