import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type Ripple = { id: number; x: number; y: number }

const useRipple = () => {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const trigger = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const id = Date.now()
    setRipples((p) => [...p, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }])
    setTimeout(() => setRipples((p) => p.filter((r) => r.id !== id)), 600)
  }
  return { ripples, trigger }
}

const HeroSection = () => {
  const primary = useRipple()
  const ghost = useRipple()

  return (
    <motion.section
      className="relative overflow-hidden pt-24 pb-32"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: 'easeOut' as const }}
    >
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 z-10">
          <span className="inline-block py-1 px-4 mb-6 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label text-[10px] font-bold tracking-[0.1em] uppercase">
            Nepal&apos;s 1st AI Academic Validator
          </span>
          <h1 className="text-6xl md:text-7xl font-extrabold font-headline leading-[1.1] text-on-surface mb-6 tracking-tight">
            Validate Your BCA Project <span className="text-primary">in Minutes</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-body max-w-xl mb-10 leading-relaxed">
            Precision AI meets local university standards. Instantly audit your final year project
            against BCA Nepal guidelines before your formal submission.
          </p>
          <div className="flex flex-wrap gap-4">
            <motion.button
              className="relative overflow-hidden px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-bold text-lg shadow-xl shadow-primary/20 transition-colors"
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={primary.trigger}
            >
              <AnimatePresence>
                {primary.ripples.map((r) => (
                  <motion.span
                    key={r.id}
                    className="absolute rounded-full bg-white/30 pointer-events-none"
                    style={{ left: r.x, top: r.y, translateX: '-50%', translateY: '-50%' }}
                    initial={{ width: 0, height: 0, opacity: 0.6 }}
                    animate={{ width: 220, height: 220, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' as const }}
                  />
                ))}
              </AnimatePresence>
              Upload Project
            </motion.button>
            <motion.button
              className="relative overflow-hidden px-8 py-4 rounded-xl text-primary font-headline font-bold text-lg hover:bg-surface-container-high transition-colors"
              whileTap={{ scale: 0.93 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              onClick={ghost.trigger}
            >
              <AnimatePresence>
                {ghost.ripples.map((r) => (
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
              Learn More
            </motion.button>
          </div>
        </div>
        <div className="lg:col-span-5 relative">
          <div className="aspect-square rounded-xl overflow-hidden bg-surface-container-low shadow-2xl rotate-3 scale-105 border-[12px] border-white">
            <img
              className="w-full h-full object-cover"
              alt="Modern clean workspace with a laptop displaying code and academic documents, soft natural morning light, minimal professional aesthetic"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDz9q9nuZpeYB0dfcTLJv7WSG4nQ_pIjY8fdYBNp4rH-7kAC1ajVEKnqvRsZPsDYbjgfqL8fS6PLXOmGpnoZtbIwZcC16OQWpdK_YMNJ3ZP6Dcz-vbjcf4VmSmQ0VOAtVJqbPCJGPClsNyIpe7OwlbjHLSk5oMTR8ivVT_4a10XnOZ4-ktZYAUA07h6zOHlKFFLwt3_kWwOskMPhEf8xVm6oAqW3ovQTtx5qLBDc1zFePfPMbMcO4FPKDT9upYjtcTpz2bKc6j4nIQ"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1200"
              height="1200"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-lg shadow-lg max-w-[200px] -rotate-3 border border-surface-container">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-xl">check_circle</span>
              <span className="text-xs font-bold font-label text-on-surface">Compliance Met</span>
            </div>
            <p className="text-[10px] text-on-surface-variant font-body">
              Structure matches TU/PU/KU official BCA documentation format.
            </p>
          </div>
        </div>
      </div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl -z-10"></div>
    </motion.section>
  )
}

export default HeroSection
