import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiBook, FiDownload, FiFileText } from "react-icons/fi";

type Semester = "4th" | "6th" | "8th";

const semesters: Semester[] = ["4th", "6th", "8th"];

const SyllabusPage = () => {
  const [activeSem, setActiveSem] = useState<Semester>("4th");

  const baseUrl = import.meta.env.BASE_URL || "/";
  const pdfUrl = new URL(
    `syllabuses/bca_${activeSem}.pdf`,
    `${window.location.origin}${baseUrl}`
  ).toString();

  return (
    <motion.div
      className="space-y-6 w-full h-full"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="rounded-3xl bg-white border border-slate-200 p-8 shadow-sm flex flex-col min-h-[750px]">
        <div className="flex items-center justify-between border-b border-slate-100 pb-6 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <FiBook className="text-primary" />
              Syllabus Viewer
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              View and download the BCA syllabus for each semester.
            </p>
          </div>
          <a
            href={pdfUrl}
            download={`BCA_${activeSem}_Semester_Syllabus.pdf`}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-sm"
          >
            <FiDownload className="text-lg" />
            Download PDF
          </a>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 p-1 bg-slate-100/80 rounded-2xl w-fit">
          {semesters.map((sem) => (
            <button
              key={sem}
              onClick={() => setActiveSem(sem)}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeSem === sem
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50"
              }`}
            >
              {sem} Sem
            </button>
          ))}
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200/60 overflow-hidden relative flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.iframe
              key={activeSem}
              src={pdfUrl}
              title={`${activeSem} Semester Syllabus`}
              className="w-full h-full min-h-[600px] border-none"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            />
          </AnimatePresence>
          
          {/* Overlay text shown quickly while iframe is loading/if file is missing */}
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 -z-10">
            <FiFileText className="text-6xl mb-3 text-slate-300" />
            <p className="text-sm font-medium">Looking for {activeSem}_sem.pdf in public/syllabuses/...</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SyllabusPage;
