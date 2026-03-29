import { motion } from "framer-motion";

const FaqSection = () => {
  return (
    <motion.section
      className="py-24 bg-background"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <span className="text-primary font-label font-bold text-xs">FAQs</span>
            <h2 className="text-5xl font-headline font-extrabold text-on-surface mt-4">
              Frequently
              <br />
              Asked Question
            </h2>
          </div>
          <div className="flex gap-2 bg-surface-container-low p-1 rounded-full">
            <button className="bg-primary text-white text-sm px-6 py-2 rounded-full font-medium">
              General
            </button>
            <button className="text-on-surface-variant text-sm px-6 py-2 rounded-full font-medium hover:bg-surface-container-high transition-all">
              Product
            </button>
            <button className="text-on-surface-variant text-sm px-6 py-2 rounded-full font-medium hover:bg-surface-container-high transition-all">
              Pricing
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <details className="group bg-surface-container-lowest rounded-2xl overflow-hidden transition-all duration-300">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <span className="font-bold text-on-surface">What is an AI workflow agent?</span>
              <svg
                className="w-5 h-5 text-on-surface-variant transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
              An AI workflow agent is an intelligent assistant designed to execute and manage
              sequences of tasks autonomously.
            </div>
          </details>
          <details className="group bg-surface-container-lowest rounded-2xl overflow-hidden" open>
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <span className="font-bold text-on-surface">What types of tasks can I automate?</span>
              <svg
                className="w-5 h-5 text-on-surface-variant transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
              You can automate anything from lead routing, email follow-ups, and HR onboarding to
              IT ticketing or analytics reports. The platform adapts to different industries
              through modular AI agents.
            </div>
          </details>
          <details className="group bg-surface-container-lowest rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <span className="font-bold text-on-surface">
                Can I integrate the platform with my existing tools?
              </span>
              <svg
                className="w-5 h-5 text-on-surface-variant transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
              Yes, our platform features over 100+ native integrations with popular tools like
              Slack, Salesforce, and Google Workspace.
            </div>
          </details>
          <details className="group bg-surface-container-lowest rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <span className="font-bold text-on-surface">Is there a free plan or trial available?</span>
              <svg
                className="w-5 h-5 text-on-surface-variant transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
              We offer a 14-day free trial on all professional plans, plus a forever-free tier for
              small projects.
            </div>
          </details>
          <details className="group bg-surface-container-lowest rounded-2xl overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
              <span className="font-bold text-on-surface">
                What happens if I exceed my workflow limit?
              </span>
              <svg
                className="w-5 h-5 text-on-surface-variant transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </summary>
            <div className="px-6 pb-6 text-on-surface-variant text-sm leading-relaxed">
              We&apos;ll notify you when you&apos;re at 80% and 100% capacity. You can choose to upgrade
              your plan or pay for additional runs on a pro-rata basis.
            </div>
          </details>
        </div>
      </div>
    </motion.section>
  );
};

export default FaqSection;
