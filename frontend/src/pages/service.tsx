import { motion } from 'framer-motion'
import PageWrapper from '../components/shared/PageWrapper'

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

const Service = () => {
  return (
    <motion.div
      className="bg-background text-on-surface"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <PageWrapper className="pt-24 pb-24 relative overflow-hidden">
        <motion.div
          className="pointer-events-none absolute -left-10 top-28 h-20 w-20 rounded-full bg-primary/10"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute left-24 top-80 h-10 w-10 rounded-full bg-secondary/20"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute right-12 top-36 h-14 w-14 rounded-full bg-primary/10"
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="pointer-events-none absolute right-32 bottom-40 h-24 w-24 rounded-full bg-secondary/15"
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 7.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="px-8 max-w-7xl mx-auto relative z-10">
          <motion.header
            className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          >
          <span className="text-primary font-label font-bold tracking-[0.2em] text-[0.6875rem] uppercase mb-4 block">
            Our Capabilities
          </span>
          <h1 className="text-5xl md:text-7xl font-headline font-extrabold tracking-tight text-on-surface mb-6 max-w-3xl">
            Precision tools for the <span className="text-primary">Academic Mind.</span>
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed font-body">
            We provide a comprehensive suite of automated supervision services designed to elevate
            the quality of academic projects through rigorous analysis and intelligent feedback.
          </p>
          </motion.header>

          <motion.section
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
          <motion.div className="group bg-surface-container-lowest p-10 rounded-xl transition-all duration-500 ease-out hover:bg-white hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1" variants={fadeUpItem}>
            <div className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl">verified_user</span>
            </div>
            <h3 className="text-3xl font-headline font-bold mb-4">Document Validation</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-body">
              Comprehensive checks for structural integrity and regulatory compliance across all
              project phases.
            </p>
          </motion.div>
          <motion.div className="group bg-surface-container-lowest p-10 rounded-xl transition-all duration-500 ease-out hover:bg-white hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1" variants={fadeUpItem}>
            <div className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl">format_shapes</span>
            </div>
            <h3 className="text-3xl font-headline font-bold mb-4">Formatting Analysis</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-body">
              Automated verification of font sizes, margins, and alignment to meet strict
              institutional standards.
            </p>
          </motion.div>
          <motion.div className="group bg-surface-container-lowest p-10 rounded-xl transition-all duration-500 ease-out hover:bg-white hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1" variants={fadeUpItem}>
            <div className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl">psychology_alt</span>
            </div>
            <h3 className="text-3xl font-headline font-bold mb-4">AI Feedback</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-body">
              Leverage neural analysis for deep insights and intelligent suggestions to improve
              content quality.
            </p>
          </motion.div>
          <motion.div className="group bg-surface-container-lowest p-10 rounded-xl transition-all duration-500 ease-out hover:bg-white hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1" variants={fadeUpItem}>
            <div className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center mb-5 group-hover:bg-primary-fixed transition-colors">
              <span className="material-symbols-outlined text-primary text-3xl">error_outline</span>
            </div>
            <h3 className="text-3xl font-headline font-bold mb-4">Error Detection</h3>
            <p className="text-slate-500 leading-relaxed text-sm font-body">
              Instant identification and highlighting of common mistakes in project execution and
              data handling.
            </p>
          </motion.div>
          </motion.section>

          <motion.section
            className="mt-24 bg-secondary-fixed rounded-xl p-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden relative"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
          <div className="relative z-10 max-w-xl">
            <h2 className="text-3xl font-headline font-bold mb-4 text-on-secondary-fixed">
              Ready for a smarter workflow?
            </h2>
            <p className="text-on-secondary-fixed-variant text-lg font-body">
              Join thousands of academic researchers who trust our Supervisor Agent for their
              project management and validation needs.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <button className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:opacity-90 transition-all">
                Get Started Free
              </button>
              <button className="bg-white/30 backdrop-blur-md text-on-secondary-fixed px-8 py-4 rounded-xl font-bold hover:bg-white/50 transition-all">
                View Demo
              </button>
            </div>
          </div>
          <div className="w-full md:w-1/3 aspect-square bg-white rounded-lg p-6 shadow-xl relative z-10">
            <div className="flex flex-col gap-4 h-full">
              <div className="h-4 w-3/4 bg-surface-container-low rounded"></div>
              <div className="h-4 w-1/2 bg-surface-container-low rounded"></div>
              <div className="mt-auto p-4 bg-secondary-container rounded-lg text-white font-medium flex items-center gap-2">
                <span
                  className="material-symbols-outlined text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                AI Improvement Suggested
              </div>
            </div>
          </div>
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-secondary opacity-10 rounded-full blur-3xl"></div>
          </motion.section>
        </div>
      </PageWrapper>
    </motion.div>
  )
}

export default Service
