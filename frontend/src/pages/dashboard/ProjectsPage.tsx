import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { FiChevronDown, FiEye, FiFileText, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useDashboardConfirm, useUploadProjectModal, useRefresh } from "../dashboard";
import Pagination from "../../components/shared/Pagination";
import { userService, type Submission } from "../../services/user";
import { apiRequest } from "../../services/api";
import { authStorage } from "../../services/authStorage";

const tabs = ["All", "UPLOADED", "PROCESSING", "COMPLETED", "FAILED"];

const statusColors: Record<Submission['status'], string> = {
  UPLOADED: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  FAILED: 'bg-red-100 text-red-700',
};

const ProjectsPage = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('All');
  const confirm = useDashboardConfirm();
  const openUploadModal = useUploadProjectModal();
  const { trigger } = useRefresh();

  const fetchSubmissions = async (page: number) => {
    setLoading(true);
    try {
      const res = await userService.listSubmissions(page, 5);
      setSubmissions(res.data);
      setTotalPages(res.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    if (trigger > 0) {
      fetchSubmissions(1);
      setCurrentPage(1);
    }
  }, [trigger]);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";
    const token = authStorage.getAccessToken();
    if (!token) return;

    const wsUrl = base.replace(/^http/, "ws") + `/submissions/stream?token=${encodeURIComponent(token)}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg?.type === "submission.update") {
          fetchSubmissions(currentPage);
        }
      } catch {
        // ignore
      }
    };

    return () => {
      ws.close();
    };
  }, [currentPage]);

  const handleDelete = async (id: string) => {
    confirm({
      message: 'Are you sure you want to delete this project? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await apiRequest(`/submissions/delete/${id}`, { method: 'DELETE' });
          fetchSubmissions(currentPage);
        } catch {
          // ignore
        }
      },
    });
  };

  const filtered = activeTab === 'All'
    ? submissions
    : submissions.filter((s) => s.status === activeTab);

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
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full ${
                activeTab === tab
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
        {loading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white border border-slate-200 animate-pulse" />
          ))
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl bg-white border border-slate-200 px-5 py-10 text-center text-sm text-slate-500">
            No submissions found.
          </div>
        ) : (
          filtered.map((submission) => (
            <motion.div
              key={submission.id}
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
                    {submission.originalName}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    {submission.semester} &nbsp;·&nbsp; {submission.university}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-semibold ${statusColors[submission.status]}`}>
                  {submission.status}
                </span>
                <div className="relative">
                  <Link
                    to={`/dashboard/projects/${submission.id}`}
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
                    className="group h-9 w-9 rounded-full border border-red-200 bg-red-50 text-red-600 shadow-sm hover:bg-red-100 flex items-center justify-center"
                    onClick={() => handleDelete(submission.id)}
                  >
                    <FiTrash2 size={20} />
                    <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow transition group-hover:opacity-100">
                      Delete
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
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
        onClick={() => { openUploadModal(); }}
      >
        <FiPlus className="text-xl" />
      </button>
    </motion.div>
  );
};

export default ProjectsPage;
