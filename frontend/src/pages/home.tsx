import { motion } from 'framer-motion'
import PageWrapper from '../components/shared/PageWrapper'
import HeroSection from './home/sections/HeroSection'
import CoreEngineSection from './home/sections/CoreEngineSection'
import StepsSection from './home/sections/StepsSection'
import CtaSection from './home/sections/CtaSection'

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
}

const fadeUpItem = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
}

export default function Home() {
  return (
    <motion.div
      className="bg-background text-on-surface"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <PageWrapper className="pt-20 relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -left-10 top-24 h-20 w-20 rounded-full bg-primary/10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute left-24 top-72 h-10 w-10 rounded-full bg-secondary/20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute right-12 top-40 h-14 w-14 rounded-full bg-primary/10"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute right-32 bottom-40 h-24 w-24 rounded-full bg-secondary/15"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative z-10">
        <HeroSection />

        <CoreEngineSection staggerContainer={staggerContainer} fadeUpItem={fadeUpItem} />

        <StepsSection staggerContainer={staggerContainer} fadeUpItem={fadeUpItem} />

        <CtaSection />
        </div>
      </PageWrapper>
    </motion.div>
  )
}
