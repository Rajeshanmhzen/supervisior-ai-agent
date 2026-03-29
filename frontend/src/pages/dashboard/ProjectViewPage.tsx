const findings = [
  {
    title: "Critical Error",
    severity: "critical",
    badgeClass: "bg-red-100 text-red-700",
    description:
      "Abstract exceeds 300 words. Length is 412 words. Reduce to comply with TU standards.",
  },
  {
    title: "Style Warning",
    severity: "warning",
    badgeClass: "bg-amber-100 text-amber-700",
    description:
      "Inconsistent font in Chapter 2. Detected 'Arial' in sections 2.3–2.5. 'Times New Roman 12' is required.",
  },
  {
    title: "Minor Issue",
    severity: "minor",
    badgeClass: "bg-orange-100 text-orange-700",
    description:
      "Citation missing DOI link. Item 14 in bibliography is missing its digital identifier.",
  },
];

import { motion } from "framer-motion";

const ProjectViewPage = () => {
  return (
    <motion.div
      className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center justify-between px-5 py-3 border-b border-slate-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.25 }}
      >
        <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
          <span className="material-symbols-outlined text-base">description</span>
          Project_Submission_v2.pdf
        </div>
        <div className="flex items-center gap-4 text-slate-500 text-xs">
          <button type="button" className="hover:text-slate-700">100%</button>
          <button type="button" className="hover:text-slate-700">+</button>
          <button type="button" className="hover:text-slate-700">-</button>
          <button type="button" className="hover:text-slate-700">
            <span className="material-symbols-outlined text-base">search</span>
          </button>
        </div>
      </motion.div>

      <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
        <motion.div
          className="bg-slate-100 p-6"
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.3, ease: "easeOut" }}
        >
          <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
            <h1 className="text-lg font-semibold text-slate-900 text-center">
              Exploring the Impact of Artificial Intelligence in Higher Education
            </h1>
            <p className="mt-2 text-xs text-slate-500 text-center">
              Submitted to: Technical University (TU)
            </p>
            <div className="mt-6 rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-xs font-semibold text-slate-700">Abstract</p>
              <p className="mt-2 text-xs text-slate-600">
                This paper investigates the transformative potential of artificial intelligence
                within academic settings, focusing on its role in curriculum development and
                administrative efficiency. The research highlights several key areas where AI can
                supplement existing pedagogical frameworks while identifying potential risks
                associated with algorithmic bias and data privacy...
              </p>
            </div>
            <div className="mt-6 space-y-3 text-xs text-slate-600">
              <p>
                <span className="font-semibold text-slate-700">1. Introduction</span> The landscape
                of higher education is undergoing a seismic shift...
              </p>
              <p>
                <span className="font-semibold text-slate-700">2. Methodology</span> Data collection
                procedures were utilized across multiple cohorts...
              </p>
            </div>
          </div>
        </motion.div>

        <motion.aside
          className="border-l border-slate-200 bg-white p-5"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Review Findings</p>
              <p className="text-xs text-slate-500">3 issues identified in this version</p>
            </div>
            <span className="h-9 w-9 rounded-full border border-slate-200 flex items-center justify-center text-slate-500">
              <span className="material-symbols-outlined text-base">forum</span>
            </span>
          </div>

          <motion.div
            className="mt-4 space-y-3"
            initial="hidden"
            animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          >
            {findings.map((item) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-slate-200 p-4"
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className={`px-2 py-0.5 rounded-full ${item.badgeClass}`}>
                    {item.title}
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-600">{item.description}</p>
                <button
                  type="button"
                  className="mt-3 text-[11px] font-semibold text-blue-600"
                >
                  Highlight in doc
                </button>
              </motion.div>
            ))}
          </motion.div>

          <button
            type="button"
            className="mt-5 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
          >
            Finalize Review
          </button>
        </motion.aside>
      </div>
    </motion.div>
  );
};

export default ProjectViewPage;
