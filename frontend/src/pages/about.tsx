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

const About = () => {
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
        <div className="relative z-10">
        <motion.section
          className="max-w-7xl mx-auto px-8 mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="inline-block px-4 py-1.5 bg-primary-fixed text-on-primary-fixed rounded-full text-[0.6875rem] font-label font-bold tracking-widest uppercase">
              The Academic Curator
            </span>
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-on-surface leading-[1.1] tracking-tight">
              Precision-Engineered
              <br />
              <span className="text-primary">Academic Validation.</span>
            </h1>
            <p className="text-lg text-on-surface-variant leading-relaxed max-w-xl font-body">
              Supervisor Agent is an AI-powered system designed specifically for BCA students in
              Nepal to validate their final year project documents according to university
              standards.
            </p>
          </div>
          <div className="relative h-[450px] rounded-xl overflow-hidden" style={{ boxShadow: '0 20px 40px rgba(17, 24, 39, 0.06)' }}>
            <img
              className="absolute inset-0 w-full h-full object-cover"
              alt="Modern minimalist study space with a digital tablet showing architectural wireframes and clean typography on a white desk"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9qaPnfsAen7YagDbQRBWKyXpOmOZIBlRLdhxwyAr4n2xF_hsDAmiE4RwG2Jf4N7aEKTRFxVELsEmR4VT9VmSK4fWleL-0bz2VsR_WpA_ORWnH6OQwerdJfdNmZftePnCPevEe6Yxo5x0GyEVTHp1LomMd_N6XJlkdRV54HqpaCUsw5J5e6whEW8DJZpB4dzbuO9OM-8IDvYCyEdC_snxfPa_wLtod9BkgydhZGkRxmx8zI0M1u4bMUx1hkaUxkiZaYTuEJhoRV0U"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              width="1200"
              height="900"
            />
          </div>
        </div>
        </motion.section>

        <motion.section
          className="max-w-7xl mx-auto px-8 mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
        <motion.div
          className="grid grid-cols-1 md:grid-cols-12 gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.div className="md:col-span-5 bg-surface-container-low p-12 rounded-xl flex flex-col justify-between h-full" variants={fadeUpItem}>
            <div>
              <div className="w-12 h-12 bg-error-container text-on-error-container rounded-lg flex items-center justify-center mb-8">
                <span className="material-symbols-outlined">warning</span>
              </div>
              <h2 className="text-3xl font-headline font-bold mb-4 tracking-tight">The Problem</h2>
              <p className="text-on-surface-variant leading-relaxed font-body">
                Students often face challenges with complex formatting rules and strict university
                guidelines, leading to multiple revisions and delays in project approval.
              </p>
            </div>
            <div className="mt-12 pt-8">
              <ul className="space-y-4 text-sm font-semibold text-on-surface-variant">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error text-lg">close</span>
                  Inconsistent Font &amp; Margin Styles
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error text-lg">close</span>
                  Manual Structural Verification
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error text-lg">close</span>
                  Guideline Non-compliance
                </li>
              </ul>
            </div>
          </motion.div>

          <motion.div className="md:col-span-7 bg-primary-container text-on-primary-container p-12 rounded-xl h-full flex flex-col" variants={fadeUpItem}>
            <div className="flex-grow">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mb-8">
                <span className="material-symbols-outlined text-white">verified</span>
              </div>
              <h2 className="text-4xl font-headline font-bold mb-6 tracking-tight">The Solution</h2>
              <p className="text-xl text-primary-fixed opacity-90 leading-relaxed font-body">
                This system automates the validation process, providing instant feedback on
                formatting, structure, and content compliance.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-headline font-bold text-lg mb-2">Instant Feedback</h3>
                <p className="text-sm opacity-80 font-body">
                  Real-time error highlighting and correction suggestions for all documentation
                  sections.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
                <h3 className="font-headline font-bold text-lg mb-2">BCA Alignment</h3>
                <p className="text-sm opacity-80 font-body">
                  Pre-configured rules strictly adhering to Nepal University BCA project standards.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        </motion.section>

        <motion.section
          className="max-w-7xl mx-auto px-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
        <div className="bg-surface-container-lowest rounded-xl p-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-1/2">
            <h2 className="text-3xl font-headline font-extrabold mb-6 tracking-tight">
              Total Content Compliance
            </h2>
            <p className="text-on-surface-variant leading-relaxed text-lg mb-8 font-body">
              Our algorithm parses through your documentation to ensure every chapter, from
              Introduction to Conclusion, follows the logical flow required by the department.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="px-5 py-3 bg-surface-container-high rounded-full text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Formatting Check
              </div>
              <div className="px-5 py-3 bg-surface-container-high rounded-full text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Citation Verify
              </div>
              <div className="px-5 py-3 bg-surface-container-high rounded-full text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Structure Audit
              </div>
            </div>
          </div>
          <motion.div
            className="md:w-5/12 grid grid-cols-2 gap-4"
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.2 }}
          >
            <motion.div className="aspect-square bg-secondary-container rounded-lg flex items-center justify-center" variants={fadeUpItem}>
              <span className="material-symbols-outlined text-white text-5xl">rule_folder</span>
            </motion.div>
            <motion.div className="aspect-square bg-surface-container rounded-lg flex items-center justify-center" variants={fadeUpItem}>
              <span className="material-symbols-outlined text-primary text-5xl">task_alt</span>
            </motion.div>
            <motion.div className="aspect-square bg-surface-container rounded-lg flex items-center justify-center" variants={fadeUpItem}>
              <span className="material-symbols-outlined text-primary text-5xl">spellcheck</span>
            </motion.div>
            <motion.div className="aspect-square bg-secondary rounded-lg flex items-center justify-center" variants={fadeUpItem}>
              <span className="material-symbols-outlined text-white text-5xl">analytics</span>
            </motion.div>
          </motion.div>
        </div>
        </motion.section>
        </div>
      </PageWrapper>
    </motion.div>
  )
}

export default About
