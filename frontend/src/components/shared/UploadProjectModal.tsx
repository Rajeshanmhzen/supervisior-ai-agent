import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiFileText, FiImage, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import { userService } from "../../services/user";
import { authStorage } from "../../services/authStorage";
import AnimatedButton from "./AnimatedButton";

type UploadProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

const semesterOptions = ["4th", "6th", "8th", "Internship"];
const universityOptions = [
  "Tribhuvan University",
  "Kathmandu University",
  "Pokhara University",
  "Purbanchal University",
];

const formatFileSize = (size: number) => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

const UploadProjectModal = ({ isOpen, onClose, onSuccess }: UploadProjectModalProps) => {
  const [semester, setSemester] = useState("");
  const [university, setUniversity] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileType, setFileType] = useState<"pdf" | "docx" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileType(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    resetFileInput();
  };

  const closeModal = () => {
    setSemester("");
    setUniversity("");
    setUploadError("");
    clearSelectedFile();
    onClose();
  };

  const handleUpload = async () => {
    const user = authStorage.getUser();
    if (!selectedFile || !semester || !university || !user) {
      setUploadError("Please fill all fields and select a file");
      return;
    }

    setIsUploading(true);
    setUploadError("");

    try {
      await userService.addSubmission(selectedFile, semester, university, user.id);
      onSuccess?.();
      closeModal();
    } catch (err: any) {
      setUploadError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setFileType(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);

    if (!file) return;

    if (file.type === "application/pdf") {
      setFileType("pdf");
      setPreviewUrl(URL.createObjectURL(file));
      return;
    }

    if (
      file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      setFileType("docx");
      return;
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0] ?? null;
    if (!file) return;
    if (fileInputRef.current) {
      fileInputRef.current.files = event.dataTransfer.files;
    }
    handleFileChange({
      target: { files: event.dataTransfer.files },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-5xl sm:w-[80%] max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200 p-6"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-semibold text-slate-900">Upload Document</p>
            <p className="mt-1 text-sm text-slate-600">
              Add semester details and upload a PDF or DOCX file.
            </p>
          </div>
          <div className="relative">
            <AnimatedButton
              type="button"
              onClick={closeModal}
              className="group h-9 w-9 rounded-full border border-red-200 bg-red-50 text-red-600 shadow-sm hover:bg-red-100 flex items-center justify-center"
              rippleColor="bg-red-300/30"
              aria-label="Close upload form"
            >
              <FiX size={18} />
              <span className="pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 rounded-md bg-slate-900 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow transition group-hover:opacity-100">
                Close
              </span>
            </AnimatedButton>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            Semester
            <select
              value={semester}
              onChange={(event) => setSemester(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="" disabled>
                Select semester
              </option>
              {semesterOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700">
            University
            <select
              value={university}
              onChange={(event) => setUniversity(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            >
              <option value="" disabled>
                Select university
              </option>
              {universityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4">
          <p className="text-sm font-semibold text-slate-700">Upload File</p>
          <div
            role="button"
            tabIndex={0}
            onClick={() => {
              resetFileInput();
              fileInputRef.current?.click();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                resetFileInput();
                fileInputRef.current?.click();
              }
            }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`mt-2 rounded-3xl border-2 border-dashed px-6 py-8 text-center transition flex flex-col items-center ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white"
            }`}
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <FiImage className="text-3xl" />
            </div>
            <p className="mt-4 text-sm font-semibold text-slate-700">
              Drop your file here, or{" "}
              <span className="text-blue-600 underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">Supports .PDF, .DOCX</p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div className="mt-6">
          <p className="text-sm font-semibold text-slate-700">Preview</p>
          <div className="mt-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mx-auto w-[80%]">
              {!selectedFile && (
                <p className="text-sm text-slate-500">
                  Select a PDF or DOCX file to see a preview.
                </p>
              )}
              {selectedFile && (
                <div className="mb-3 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <FiFileText className="text-2xl text-blue-600" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <AnimatedButton
                    type="button"
                    onClick={clearSelectedFile}
                    className="h-9 w-9 rounded-full bg-white text-red-600 shadow-md border border-red-100 hover:bg-red-50 flex items-center justify-center"
                    rippleColor="bg-red-300/30"
                    aria-label="Remove file"
                  >
                    <FiTrash2 size={16} />
                  </AnimatedButton>
                </div>
              )}
              {selectedFile && fileType === "pdf" && previewUrl && (
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <iframe
                    title="PDF preview"
                    src={previewUrl}
                    className="h-[420px] w-full"
                  />
                </div>
              )}
              {selectedFile && fileType === "docx" && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                  DOCX preview isn't supported here yet, but the file is ready to
                  upload.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <AnimatedButton
            type="button"
            onClick={closeModal}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50"
            rippleColor="bg-slate-300/30"
          >
            Cancel
          </AnimatedButton>
          <AnimatedButton
            type="button"
            onClick={handleUpload}
            disabled={isUploading || !selectedFile || !semester || !university}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            rippleColor="bg-white/30"
          >
            {isUploading ? (
              <>
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <FiCheck size={16} />
                Save Details
              </>
            )}
          </AnimatedButton>
        </div>
        {uploadError && (
          <p className="mt-3 text-sm text-red-500 text-center">{uploadError}</p>
        )}
      </motion.div>
    </motion.div>
  );
};

export default UploadProjectModal;
