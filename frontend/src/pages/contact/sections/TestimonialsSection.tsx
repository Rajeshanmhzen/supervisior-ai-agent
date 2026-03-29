import { motion } from "framer-motion";

type MotionVariants = {
  hidden: Record<string, unknown>;
  show: Record<string, unknown>;
};

type Props = {
  staggerContainer: MotionVariants;
  fadeUpItem: MotionVariants;
};

const TestimonialsSection = ({ staggerContainer, fadeUpItem }: Props) => {
  return (
    <motion.section
      className="py-24 bg-surface-container-low"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-label font-bold text-xs uppercase tracking-widest">
            Testimonial
          </span>
          <h2 className="text-4xl font-headline font-extrabold text-on-surface mt-4">
            Trusted by company driving
            <br />
            change with AI
          </h2>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
        >
          <motion.div
            className="lg:row-span-2 bg-surface-container-lowest p-8 rounded-3xl flex flex-col justify-between"
            variants={fadeUpItem}
          >
            <div>
              <img alt="Forter Logo" className="h-8 mb-12" src="https://placeholder.pics/svg/300" />
              <p className="text-lg text-on-surface font-body leading-relaxed mb-8">
                &quot;Before using Moniveo, our operations team spent hours every week juggling
                spreadsheets, exporting data, and sending manual updates.&quot;
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-low overflow-hidden" />
              <div>
                <p className="font-bold text-sm text-on-surface">Jamerson Silva</p>
                <p className="text-xs text-on-surface-variant">Product Manager at Forter</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-surface-container-lowest p-6 rounded-2xl" variants={fadeUpItem}>
            <p className="text-sm text-on-surface-variant mb-6 italic leading-relaxed">
              &quot;Routine system checks, report generation, even forecasting - all handled
              automatically. It&apos;s like having an extra teammate that never sleeps.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-low" />
              <div className="text-xs">
                <p className="font-bold text-on-surface">Samuel</p>
                <p className="text-on-surface-variant">System Architect at Slack</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-surface-container-lowest p-6 rounded-2xl" variants={fadeUpItem}>
            <p className="text-sm text-on-surface-variant mb-6 italic leading-relaxed">
              &quot;We automated our ticket triaging process and saved over 2,000+ hours per quarter.
              That&apos;s more time for innovation and growth.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-low" />
              <div className="text-xs">
                <p className="font-bold text-on-surface">Alex R</p>
                <p className="text-on-surface-variant">IT Manager at HubSpot</p>
              </div>
            </div>
          </motion.div>
          <motion.div className="bg-surface-container-lowest p-6 rounded-2xl" variants={fadeUpItem}>
            <p className="text-sm text-on-surface-variant mb-6 italic leading-relaxed">
              &quot;We connected over 15+ apps in less than a day - no coding, no downtime. The setup
              experience was refreshingly simple. Thanks to faster response times and reliable
              uptime&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-low" />
              <div className="text-xs">
                <p className="font-bold text-on-surface">Daniel</p>
                <p className="text-on-surface-variant">Cloud Engineer at Google</p>
              </div>
            </div>
          </motion.div>
          <motion.div
            className="bg-primary text-white p-8 rounded-3xl flex flex-col justify-between"
            variants={fadeUpItem}
          >
            <div className="h-8 w-28 bg-white/20 rounded mb-8" />
            <p className="text-lg font-medium leading-relaxed mb-8">
              &quot;Integrating this AI automation platform transformed how our team works. Tasks that
              used to take hours now run automatically in minutes - giving us more time to focus
              on strategy and innovation.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20" />
              <div className="text-xs">
                <p className="font-bold">Sarah Tan</p>
                <p className="text-white/70">Operations Lead at HubSpot</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default TestimonialsSection;
