import { motion } from "framer-motion";

const ContactCtaSection = () => {
  return (
    <motion.section
      className="px-6 py-20"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto rounded-[3rem] bg-primary text-on-primary relative overflow-hidden text-center py-24 px-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-6xl font-headline font-extrabold leading-tight mb-8">
            Turn workflow into
            <br />
            <span className="text-white/80">AI agent</span> automations.
          </h2>
          <p className="text-white/70 text-lg mb-12 max-w-2xl mx-auto font-body">
            Powerful and production-ready, our cloud platform has the solutions you need to
            succeed.
          </p>
          <a
            className="inline-flex items-center gap-3 text-on-primary font-bold px-10 py-4 rounded-full hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #004ac6 0%, #2563eb 100%)" }}
            href="#"
          >
            Get started
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M13 7l5 5m0 0l-5 5m5-5H6"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default ContactCtaSection;
