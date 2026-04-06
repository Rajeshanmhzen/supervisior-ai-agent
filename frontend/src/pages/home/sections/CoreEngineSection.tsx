import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'

type Ripple = { id: number; x: number; y: number }

type Props = {
  staggerContainer: Variants
  fadeUpItem: Variants
}

const CoreEngineSection = ({ staggerContainer, fadeUpItem }: Props) => {
  const [ripples, setRipples] = useState<Ripple[]>([])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600)
  }

  return (
    <motion.section
      className="py-24 bg-surface-container-low"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' as const }}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-16">
          <h2 className="text-4xl font-headline font-extrabold text-on-surface mb-4">
            Core Validation Engine
          </h2>
          <p className="text-on-surface-variant font-body">
            Four pillars of automated academic integrity for your BCA thesis.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.div
            className="md:col-span-2 bg-surface-container-lowest p-10 rounded-lg transition-all duration-500 ease-out hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 group h-full"
            variants={fadeUpItem}
          >
            <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-primary text-3xl">format_paint</span>
            </div>
            <h3 className="text-2xl font-headline font-bold mb-2">Format Checking</h3>
            <p className="text-on-surface-variant font-body leading-relaxed">
              Automatic detection of margins, font consistency, indentation, and page numbering
              according to academic standards.
            </p>
          </motion.div>
          <motion.div
            className="bg-surface-container-lowest p-10 rounded-lg border border-transparent transition-all duration-500 ease-out hover:bg-white hover:border-primary/10 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 group h-full"
            variants={fadeUpItem}
          >
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-secondary text-2xl">psychology</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-2">AI Feedback</h3>
            <p className="text-sm text-on-surface-variant font-body">
              Semantic analysis of your abstract and conclusion for logical flow.
            </p>
          </motion.div>
          <motion.div
            className="bg-surface-container-lowest p-10 rounded-lg border border-transparent transition-all duration-500 ease-out hover:bg-white hover:border-primary/10 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 group h-full"
            variants={fadeUpItem}
          >
            <div className="w-12 h-12 rounded-xl bg-tertiary-fixed flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-tertiary text-2xl">gavel</span>
            </div>
            <h3 className="text-xl font-headline font-bold mb-2">University Guidelines</h3>
            <p className="text-sm text-on-surface-variant font-body">
              Hardcoded rules matching TU, PU, and KU specific report structures.
            </p>
          </motion.div>
          <motion.div
            className="md:col-span-4 bg-primary text-on-primary p-12 rounded-lg flex flex-col md:flex-row items-center gap-12 overflow-hidden relative"
            variants={fadeUpItem}
          >
            <div className="flex-1">
              <h3 className="text-3xl font-headline font-bold mb-4">Error Reports</h3>
              <p className="text-on-primary/80 font-body text-lg leading-relaxed max-w-2xl">
                Download a detailed PDF breakdown of every missing citation, broken link, or
                formatting anomaly found in your document.
              </p>
              <motion.button
                className="relative overflow-hidden mt-8 px-6 py-3 bg-white text-primary font-bold rounded-xl transition-shadow hover:shadow-lg"
                whileTap={{ scale: 0.93 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                onClick={handleClick}
              >
                <AnimatePresence>
                  {ripples.map((r) => (
                    <motion.span
                      key={r.id}
                      className="absolute rounded-full bg-primary/10 pointer-events-none"
                      style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
                      initial={{ width: 0, height: 0, opacity: 0.6 }}
                      animate={{ width: 220, height: 220, opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.6, ease: 'easeOut' as const }}
                    />
                  ))}
                </AnimatePresence>
                View Sample Report
              </motion.button>
            </div>
            <div className="flex-shrink-0 w-64 h-48 bg-white/10 rounded-lg backdrop-blur-md border border-white/20 p-4">
              <div className="space-y-3">
                <div className="h-2 w-full bg-white/20 rounded"></div>
                <div className="h-2 w-3/4 bg-white/20 rounded"></div>
                <div className="h-2 w-1/2 bg-error rounded"></div>
                <div className="h-2 w-full bg-white/20 rounded"></div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default CoreEngineSection
