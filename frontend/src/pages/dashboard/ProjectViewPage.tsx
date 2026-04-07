import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { userService, type SubmissionDetail } from '../../services/user'
import { authStorage } from '../../services/authStorage'

const severityBadge = (severity: string) => {
  switch (severity) {
    case 'CRITICAL':
      return 'bg-red-100 text-red-700'
    case 'MAJOR':
      return 'bg-amber-100 text-amber-700'
    default:
      return 'bg-orange-100 text-orange-700'
  }
}

const ProjectViewPage = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [fileUrl, setFileUrl] = useState<string | null>(null)
  const [fileError, setFileError] = useState(false)
  const blobUrlRef = useRef<string | null>(null)

  useEffect(() => {
    if (!projectId) return

    let cancelled = false
    setLoading(true)
    setFileError(false)
    setFileUrl(null)
    setSubmission(null)

    const load = async () => {
      try {
        const res = await userService.getSubmission(projectId)
        if (cancelled) return
        setSubmission(res.submission)

        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1'
        const token = authStorage.getAccessToken()
        const response = await fetch(`${base}/submissions/file/${projectId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        })
        if (cancelled) return

        if (!response.ok) {
          setFileError(true)
          return
        }

        const blob = await response.blob()
        if (cancelled) return

        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current)
        const url = URL.createObjectURL(blob)
        blobUrlRef.current = url
        setFileUrl(url)
      } catch {
        if (!cancelled) setFileError(true)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current)
        blobUrlRef.current = null
      }
    }
  }, [projectId])

  const findings = (() => {
    if (!submission) return []
    const items: Array<{ title: string; badgeClass: string; description: string }> = []

    if (submission.ruleCheck?.issues?.length) {
      for (const issue of submission.ruleCheck.issues) {
        items.push({
          title: issue.severity || 'MAJOR',
          badgeClass: severityBadge(issue.severity || 'MAJOR'),
          description: issue.message,
        })
      }
    }

    const aiFeedback = submission.analysisResult?.aiFeedback || []
    for (const page of aiFeedback) {
      if (page?.issues?.length) {
        for (const issue of page.issues) {
          items.push({
            title: issue.severity || 'MAJOR',
            badgeClass: severityBadge(issue.severity || 'MAJOR'),
            description: `[${page.pageRange}] ${issue.message}`,
          })
        }
      } else if (page?.summary) {
        items.push({
          title: 'AI Summary',
          badgeClass: 'bg-blue-100 text-blue-700',
          description: `[${page.pageRange}] ${page.summary}`,
        })
      }
    }

    return items
  })()

  return (
    <motion.div
      className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      <motion.div
        className="flex items-center justify-between px-5 py-3 border-b border-slate-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.05, duration: 0.25 }}
      >
        <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
          <span className="material-symbols-outlined text-base">description</span>
          {loading ? (
            <span className="h-4 w-48 rounded bg-slate-200 animate-pulse inline-block" />
          ) : (
            submission?.originalName ?? 'Unknown file'
          )}
        </div>
        {fileUrl && (
          <a
            href={fileUrl}
            download={submission?.originalName}
            className="flex items-center gap-1 text-xs text-blue-600 hover:underline font-semibold"
          >
            <span className="material-symbols-outlined text-base">download</span>
            Download
          </a>
        )}
      </motion.div>

      <div className="grid gap-0 lg:grid-cols-[1fr_320px]">
        <motion.div
          className="bg-slate-100 p-4"
          style={{ minHeight: 640 }}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08, duration: 0.3, ease: 'easeOut' }}
        >
          {loading ? (
            <div className="h-full w-full rounded-xl bg-white animate-pulse" style={{ minHeight: 600 }} />
          ) : fileError || !fileUrl ? (
            <div
              className="flex items-center justify-center rounded-xl bg-white text-slate-400 text-sm"
              style={{ minHeight: 600 }}
            >
              File could not be loaded.
            </div>
          ) : submission?.mimeType === 'application/pdf' ? (
            <iframe
              src={fileUrl}
              title={submission.originalName}
              className="w-full rounded-xl border border-slate-200 shadow-sm"
              style={{ height: 640 }}
            />
          ) : (
            <div
              className="flex flex-col items-center justify-center gap-4 rounded-xl bg-white p-8 text-center"
              style={{ minHeight: 600 }}
            >
              <span className="material-symbols-outlined text-5xl text-blue-400">description</span>
              <p className="text-sm font-semibold text-slate-700">{submission?.originalName}</p>
              <p className="text-xs text-slate-500">
                DOCX preview is not supported in-browser. Download the file to view it.
              </p>
              <a
                href={fileUrl}
                download={submission?.originalName}
                className="mt-2 rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Download File
              </a>
            </div>
          )}
        </motion.div>

        <motion.aside
          className="border-l border-slate-200 bg-white p-5"
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.12, duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-900">Review Findings</p>
              <p className="text-xs text-slate-500">{findings.length} issue(s) identified in this version</p>
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
            {findings.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 p-4 text-xs text-slate-500">
                No findings yet. Upload a document to see results.
              </div>
            ) : (
              findings.map((item, idx) => (
                <motion.div
                  key={`${item.title}-${idx}`}
                  className="rounded-2xl border border-slate-200 p-4"
                  variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
                >
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${item.badgeClass}`}>
                    {item.title}
                  </span>
                  <p className="mt-2 text-xs text-slate-600">{item.description}</p>
                  <button type="button" className="mt-3 text-[11px] font-semibold text-blue-600">
                    Highlight in doc
                  </button>
                </motion.div>
              ))
            )}
          </motion.div>

          <button
            type="button"
            className="mt-5 w-full rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            Finalize Review
          </button>
        </motion.aside>
      </div>
    </motion.div>
  )
}

export default ProjectViewPage
