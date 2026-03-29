import { motion } from "framer-motion";
import { useUploadProjectModal } from "../dashboard";

const overviewCards = [
  {
    title: "Total Projects",
    value: "12",
    subtitle: "Active submissions",
    icon: "folder",
  },
  {
    title: "Validations",
    value: "48",
    subtitle: "Runs this month",
    icon: "fact_check",
  },
  {
    title: "Issues Found",
    value: "124",
    subtitle: "Needs review",
    icon: "warning",
  },
  {
    title: "Verified",
    value: "32",
    subtitle: "Approved outputs",
    icon: "verified",
  },
  {
    title: "Reports",
    value: "21",
    subtitle: "Generated PDFs",
    icon: "description",
  },
  {
    title: "Recent Activity",
    value: "5",
    subtitle: "Actions today",
    icon: "timeline",
  },
];

const quickActions = [
  { label: "Upload Project", icon: "upload" },
  { label: "Run Validation", icon: "fact_check" },
  { label: "Generate Report", icon: "description" },
  { label: "Manage Rules", icon: "rule" },
];

const systemOverview = [
  { label: "Engine Status", value: "Active", valueClass: "text-emerald-600" },
  { label: "Ruleset Sync", value: "Synced", valueClass: "text-emerald-600" },
  { label: "Queue", value: "Idle", valueClass: "text-emerald-600" },
  { label: "Version", value: "1.2.0", valueClass: "text-slate-500" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: "easeOut" } },
};

const DashboardHome = () => {
  const openUploadModal = useUploadProjectModal();

  const handleQuickAction = (label: string) => {
    if (label === "Upload Project") {
      openUploadModal();
    }
  };

  return (
    <>
      <motion.div
        className="grid gap-4 md:grid-cols-3"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {overviewCards.map((card) => (
          <motion.div
            key={card.title}
            className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
            variants={fadeUp}
          >
            <div className="flex items-center justify-between text-slate-500">
              <p className="text-sm font-semibold text-slate-700">
                {card.title}
              </p>
              <span className="material-symbols-outlined text-base">
                {card.icon}
              </span>
            </div>
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {card.value}
            </p>
            <p className="text-xs text-slate-500">{card.subtitle}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="grid gap-4 lg:grid-cols-[1fr_1fr]"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
          variants={fadeUp}
        >
          <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
          <div className="mt-4 space-y-3">
            {quickActions.map((action) => (
              <motion.button
                key={action.label}
                type="button"
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-left text-slate-700 hover:bg-slate-50"
                variants={fadeUp}
                onClick={() => handleQuickAction(action.label)}
              >
                <span className="material-symbols-outlined text-base">
                  {action.icon}
                </span>
                {action.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
        <motion.div
          className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm"
          variants={fadeUp}
        >
          <h3 className="text-lg font-semibold text-slate-900">System Overview</h3>
          <div className="mt-4 space-y-4 text-sm">
            {systemOverview.map((row) => (
              <motion.div
                key={row.label}
                className="flex items-center justify-between"
                variants={fadeUp}
              >
                <span className="text-slate-700">{row.label}</span>
                <span className={`font-semibold ${row.valueClass}`}>
                  {row.value}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DashboardHome;
