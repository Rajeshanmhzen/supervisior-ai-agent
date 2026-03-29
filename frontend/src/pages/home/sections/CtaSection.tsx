import { motion } from "framer-motion";

const CtaSection = () => {
  return (
    <motion.section
      className="pb-32 px-8"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
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
          <button className="px-10 py-5 bg-primary text-white rounded-xl font-headline font-bold text-xl hover:shadow-2xl hover:shadow-primary/40 active:scale-95 transition-all">
            Validate My Project Now
          </button>
        </div>
        <div className="absolute -top-12 -left-12 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>
    </motion.section>
  );
};

export default CtaSection;
