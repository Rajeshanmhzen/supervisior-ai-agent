import { motion } from "framer-motion";
import { useUploadProjectModal } from "../dashboard";
import { FiFolder, FiCheckSquare, FiAlertTriangle, FiShield, FiFileText, FiActivity, FiUpload, FiList } from "react-icons/fi";
import type { IconType } from "react-icons";

const overviewCards: { title: string; value: string; subtitle: string; icon: IconType }[] = [
  { title: "Total Projects", value: "12", subtitle: "Active submissions", icon: FiFolder },
  { title: "Validations", value: "48", subtitle: "Runs this month", icon: FiCheckSquare },
  { title: "Issues Found", value: "124", subtitle: "Needs review", icon: FiAlertTriangle },
  { title: "Verified", value: "32", subtitle: "Approved outputs", icon: FiShield },
  { title: "Reports", value: "21", subtitle: "Generated PDFs", icon: FiFileText },
  { title: "Recent Activity", value: "5", subtitle: "Actions today", icon: FiActivity },
];

const quickActions: { label: string; icon: IconType }[] = [
  { label: "Upload Project", icon: FiUpload },
  { label: "Run Validation", icon: FiCheckSquare },
  { label: "Generate Report", icon: FiFileText },
  { label: "Manage Rules", icon: FiList },
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
              <card.icon className="text-base" />
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
                <action.icon className="text-base" />
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
