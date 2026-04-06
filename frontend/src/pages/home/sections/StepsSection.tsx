import { motion, type Variants } from "framer-motion";

type Props = {
  staggerContainer: Variants;
  fadeUpItem: Variants;
};

const StepsSection = ({ staggerContainer, fadeUpItem }: Props) => {
  return (
    <motion.section
      className="py-32 bg-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-headline font-extrabold mb-6 tracking-tight">
            Your Path to Excellence
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">
            A simple three-step journey to ensuring your hard work meets the highest academic
            standards.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.2 }}
        >
          <div className="hidden md:block absolute top-12 left-0 w-full h-px bg-surface-container-high -z-10"></div>
          <motion.div className="flex flex-col items-center text-center" variants={fadeUpItem}>
            <div className="w-24 h-24 rounded-full bg-white border-8 border-surface-container-low flex items-center justify-center mb-8 shadow-sm">
              <span className="text-2xl font-black font-headline text-primary">01</span>
            </div>
            <h4 className="text-2xl font-headline font-bold mb-4">Upload DOCX</h4>
            <p className="text-on-surface-variant leading-relaxed px-4">
              Simply drag and drop your final project file. We support all standard Word formats
              used in Nepalese colleges.
            </p>
          </motion.div>
          <motion.div className="flex flex-col items-center text-center" variants={fadeUpItem}>
            <div className="w-24 h-24 rounded-full bg-white border-8 border-surface-container-low flex items-center justify-center mb-8 shadow-sm">
              <span className="text-2xl font-black font-headline text-primary">02</span>
            </div>
            <h4 className="text-2xl font-headline font-bold mb-4">System analyzes</h4>
            <p className="text-on-surface-variant leading-relaxed px-4">
              Our hybrid AI + Rule-based engine parses your document against 50+ validation
              checkpoints simultaneously.
            </p>
          </motion.div>
          <motion.div className="flex flex-col items-center text-center" variants={fadeUpItem}>
            <div className="w-24 h-24 rounded-full bg-white border-8 border-surface-container-low flex items-center justify-center mb-8 shadow-sm">
              <span className="text-2xl font-black font-headline text-primary">03</span>
            </div>
            <h4 className="text-2xl font-headline font-bold mb-4">Get structured report</h4>
            <p className="text-on-surface-variant leading-relaxed px-4">
              Receive an itemized list of improvements. Fix your errors and re-upload for a final
              green checkmark.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default StepsSection;
