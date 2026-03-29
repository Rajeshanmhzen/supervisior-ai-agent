import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiChevronDown, FiEdit2, FiEye, FiFileText, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDashboardConfirm, useUploadProjectModal } from "../dashboard";
import Pagination from "../../components/shared/Pagination";

const tabs = ["All Projects", "Completed", "Drafts", "In Review"];

const projects = [
  {
    id: "p1",
    title: "Neural Network Efficiency in Low-Power Devices",
    subtitle: "Applied AI Research  -  Updated 2h ago",
    status: "Completed",
    statusClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "p2",
    title: "Longitudinal Study on Urban Biodiversity Patterns",
    subtitle: "Environmental Science  -  Updated 1d ago",
    status: "In Review",
    statusClass: "bg-violet-100 text-violet-700",
  },
  {
    id: "p3",
    title: "Comparative Analysis of Post-Structuralist Literature",
    subtitle: "Humanities  -  Updated 1d ago",
    status: "Draft",
    statusClass: "bg-slate-200 text-slate-700",
  },
  {
    id: "p4",
    title: "Optimizing Graphene Production for Semiconductors",
    subtitle: "Material Science  -  Updated 2d ago",
    status: "Completed",
    statusClass: "bg-emerald-100 text-emerald-700",
  },
  {
    id: "p5",
    title: "Socio-Economic Impacts of Remote Learning in Rural Areas",
    subtitle: "Sociology  -  Updated 3d ago",
    status: "In Review",
    statusClass: "bg-violet-100 text-violet-700",
  },
];

const PAGE_SIZE = 5;

const ProjectsPage = () => {
  const [items, setItems] = useState(projects);
  const [currentPage, setCurrentPage] = useState(1);
  const confirm = useDashboardConfirm();
  const openUploadModal = useUploadProjectModal();
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
  const pagedItems = items.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <motion.div
        className="flex flex-wrap items-center justify-between gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.5, ease: "easeOut" }}
      >
        <div className="flex flex-wrap items-center gap-2 rounded-full bg-white p-1 shadow-sm border border-slate-200">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`px-4 py-1.5 text-xs font-semibold rounded-full ${
                index === 0
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-600 border border-slate-200 shadow-sm"
        >
          Sort by: Recent
          <FiChevronDown className="text-sm" />
        </button>
      </motion.div>

      <motion.div
        className="space-y-3"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.12 } },
        }}
      >
        {pagedItems.map((project) => (
          <motion.div
            key={project.id}
            className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white border border-slate-200 px-5 py-4 shadow-sm"
            variants={{
              hidden: { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
            }}
          >
            <div className="flex items-center gap-4 min-w-0">
              <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center">
                <FiFileText className="text-slate-500" size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">
                  {project.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  {project.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-3 py-1 rounded-full text-[10px] font-semibold ${project.statusClass}`}
              >
                {project.status}
              </span>
              <div className="relative">
                <Link
                  to={`/dashboard/projects/${project.id}`}
                  className="group h-9 w-9 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
                  aria-label="View project"
                >
                  <FiEye size={20} />
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow transition group-hover:opacity-100">
                    View
                  </span>
                </Link>
              </div>
              <div className="relative">
                <button
                  type="button"
                  className="group h-9 w-9 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 flex items-center justify-center"
                >
                  <FiEdit2 size={20} />
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow transition group-hover:opacity-100">
                    Edit
                  </span>
                </button>
              </div>
              <div className="relative">
                <button
                  type="button"
                  className="group h-9 w-9 rounded-full border border-red-200 bg-red-50 text-red-600 shadow-sm hover:bg-red-100 flex items-center justify-center"
                  onClick={() =>
                    confirm({
                      message:
                        "Are you sure you want to delete this project? This action cannot be undone.",
                      onConfirm: () => {
                        setItems((prev) => prev.filter((item) => item.id !== project.id));
                      },
                    })
                  }
                >
                  <FiTrash2 size={20} />
                  <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow transition group-hover:opacity-100">
                    Delete
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.45, ease: "easeOut" }}
      >
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </motion.div>

      <button
        type="button"
        className="fixed bottom-8 right-8 h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center"
        aria-label="Add project"
        onClick={openUploadModal}
      >
        <FiPlus className="text-xl" />
      </button>
    </motion.div>
  );
};

export default ProjectsPage;
