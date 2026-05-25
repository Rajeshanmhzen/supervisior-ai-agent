import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userService, type SubmissionDetail } from '../../services/user';
import { authStorage } from '../../services/authStorage';
import { useSubmissionSocket } from '../../utils/useSubmissionSocket';

// ─── Helpers ────────────────────────────────────────────────────────────────

const severityBadge = (severity: string) => {
  switch (severity) {
    case 'CRITICAL': return 'bg-red-50 text-red-700 border border-red-200';
    case 'MAJOR':    return 'bg-amber-50 text-amber-700 border border-amber-200';
    default:         return 'bg-blue-50 text-blue-700 border border-blue-200';
  }
};

/** Render markdown-like formatting: **bold**, bullet lines, line breaks */
const ChatText = ({ text }: { text: string }) => {
  const lines = text.split('\n');
  return (
    <div className="space-y-1">
      {lines.map((line, i) => {
        if (!line.trim()) return <div key={i} className="h-1" />;
        // Render bullet points
        const isBullet = /^[•\-\*]\s/.test(line.trim());
        // Bold: **text**
        const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        });
        if (isBullet) {
          return (
            <div key={i} className="flex gap-1.5 items-start">
              <span className="mt-0.5 text-blue-400 shrink-0">•</span>
              <span>{parts}</span>
            </div>
          );
        }
        return <div key={i}>{parts}</div>;
      })}
    </div>
  );
};

// ─── Radial Progress ─────────────────────────────────────────────────────────

const RadialProgress = ({ score, size = 120, strokeWidth = 10, primaryColor = 'stroke-blue-600', secondaryColor = 'stroke-slate-100' }: { score: number; size?: number; strokeWidth?: number; primaryColor?: string; secondaryColor?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90 w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle className={secondaryColor} strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
        <motion.circle className={`${primaryColor} transition-all duration-500 ease-out`} strokeWidth={strokeWidth} strokeDasharray={circumference} initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset }} strokeLinecap="round" fill="transparent" r={radius} cx={size / 2} cy={size / 2} />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold text-slate-800 tracking-tight">{score}</span>
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Score</span>
      </div>
    </div>
  );
};

// ─── Review Toast ─────────────────────────────────────────────────────────────

type ReviewToast = { documentName: string; totalScore?: number; issueCount?: number; status: 'COMPLETED' | 'FAILED' };

const ReviewToastBanner = ({ toast, onDismiss }: { toast: ReviewToast; onDismiss: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className={`fixed top-5 right-5 z-50 max-w-sm rounded-2xl shadow-xl border px-5 py-4 flex items-start gap-3 ${
      toast.status === 'COMPLETED' ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'
    }`}
  >
    <span className={`text-2xl mt-0.5 ${toast.status === 'COMPLETED' ? 'text-emerald-500' : 'text-red-500'}`}>
      {toast.status === 'COMPLETED' ? '✅' : '❌'}
    </span>
    <div className="flex-1 min-w-0">
      <p className={`text-sm font-bold ${toast.status === 'COMPLETED' ? 'text-emerald-800' : 'text-red-800'}`}>
        {toast.status === 'COMPLETED' ? 'Review Complete!' : 'Review Failed'}
      </p>
      <p className="text-xs text-slate-600 truncate mt-0.5">{toast.documentName}</p>
      {toast.status === 'COMPLETED' && toast.totalScore !== undefined && (
        <p className="text-xs font-semibold text-emerald-700 mt-1">
          Score: {toast.totalScore}/100 · {toast.issueCount ?? 0} issue(s) found
        </p>
      )}
    </div>
    <button onClick={onDismiss} className="text-slate-400 hover:text-slate-700 text-lg leading-none">×</button>
  </motion.div>
);

// ─── Suggested Questions ──────────────────────────────────────────────────────

const SUGGESTED_QUESTIONS = [
  'What improvements should I make?',
  'How is my score?',
  'Is my structure correct?',
  'Check my references',
  'Explain the formatting requirements',
  'What sections are missing?',
];

// ─── Main Page ────────────────────────────────────────────────────────────────

const ProjectViewPage = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileError, setFileError] = useState(false);
  const blobUrlRef = useRef<string | null>(null);

  const [activeTab, setActiveTab] = useState<'findings' | 'chat'>('findings');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'agent'; text: string }>>([
    { sender: 'agent', text: 'Hello! I am your AI project supervisor. Ask me anything about your report guidelines, formatting, structure, or content issues. You can also ask me to list all improvements needed.' },
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [isChatSending, setIsChatSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  const [reviewToast, setReviewToast] = useState<ReviewToast | null>(null);

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Load submission + file
  useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    setLoading(true);
    setFileError(false);
    setFileUrl(null);
    setSubmission(null);

    const load = async () => {
      try {
        const res = await userService.getSubmission(projectId);
        if (cancelled) return;
        setSubmission(res.submission);

        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
        const token = authStorage.getAccessToken();
        const response = await fetch(`${base}/submissions/file/${projectId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (cancelled) return;
        if (!response.ok) { setFileError(true); return; }
        const blob = await response.blob();
        if (cancelled) return;
        if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setFileUrl(url);
      } catch {
        if (!cancelled) setFileError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => {
      cancelled = true;
      if (blobUrlRef.current) { URL.revokeObjectURL(blobUrlRef.current); blobUrlRef.current = null; }
    };
  }, [projectId]);

  // WebSocket — real-time updates (replaces polling)
  const isProcessing = submission?.status === 'PROCESSING' || submission?.status === 'UPLOADED';

  const handleSocketUpdate = useCallback((event: any) => {
    const { payload } = event;
    if (payload.fileId !== projectId) return;
    setSubmission(prev => prev ? { ...prev, status: payload.status, progress: payload.progress, errorMessage: payload.errorMessage } : prev);
    // Reload full submission when completed
    if (payload.status === 'COMPLETED' || payload.status === 'FAILED') {
      userService.getSubmission(payload.fileId).then(res => setSubmission(res.submission)).catch(() => {});
    }
  }, [projectId]);

  const handleReviewComplete = useCallback((event: any) => {
    const { payload } = event;
    if (payload.fileId !== projectId) return;
    setReviewToast({ documentName: payload.documentName, totalScore: payload.totalScore, issueCount: payload.issueCount, status: payload.status });
    // Auto dismiss after 8 seconds
    setTimeout(() => setReviewToast(null), 8000);
  }, [projectId]);

  useSubmissionSocket({
    enabled: isProcessing,
    onUpdate: handleSocketUpdate,
    onReviewComplete: handleReviewComplete,
  });

  // Send chat message
  const handleSendChatMessage = async (overrideMsg?: string) => {
    const msg = (overrideMsg ?? userMessage).trim();
    if (!msg || !projectId) return;
    setUserMessage('');
    setChatMessages(prev => [...prev, { sender: 'user', text: msg }]);
    setIsChatSending(true);
    try {
      const res = await userService.chatWithSupervisor(projectId, msg);
      setChatMessages(prev => [...prev, { sender: 'agent', text: res.response }]);
    } catch {
      setChatMessages(prev => [...prev, { sender: 'agent', text: "Sorry, I'm having trouble connecting right now. Please try again shortly." }]);
    } finally {
      setIsChatSending(false);
    }
  };

  // Compile all issues
  const allIssues = (() => {
    if (!submission) return [];
    const items: Array<{ category: string; severity: 'CRITICAL' | 'MAJOR' | 'MINOR'; problem: string; reason: string; fix: string }> = [];

    const ruleCheck = submission.ruleCheck as any;
    if (ruleCheck?.issues) {
      ruleCheck.issues.forEach((issue: any) => {
        items.push({ category: 'Structure', severity: issue.severity || 'CRITICAL', problem: issue.message || 'Structural Requirement Missing', reason: `Violates TU structural regulations for ${submission.semester || '4th'} semester.`, fix: issue.fix || 'Ensure this section is correctly written and labeled.' });
      });
    }

    const analysis = submission.analysisResult as any;
    if (analysis?.formatting?.issues) {
      analysis.formatting.issues.forEach((issue: any) => {
        items.push({ category: 'Formatting', severity: issue.severity || 'MINOR', problem: issue.problem || 'Formatting issue', reason: issue.reason || 'Does not align with academic criteria.', fix: issue.fix || 'Correct document typography.' });
      });
    }
    if (analysis?.references?.issues) {
      analysis.references.issues.forEach((issue: any) => {
        items.push({ category: 'References', severity: issue.severity || 'MAJOR', problem: issue.problem || 'References discrepancy', reason: issue.reason || 'Missing proper IEEE indexing.', fix: issue.fix || 'Convert to IEEE format.' });
      });
    }
    if (analysis?.content?.feedback) {
      analysis.content.feedback.forEach((issue: any) => {
        items.push({ category: 'Content', severity: issue.severity || 'MAJOR', problem: issue.problem || 'Content quality warning', reason: issue.reason || 'Clarity has room for improvement.', fix: issue.fix || 'Refine and re-structure paragraphs.' });
      });
    }
    return items;
  })();

  const analysisResult = submission?.analysisResult as any;
  const totalScore = analysisResult?.total ?? 0;
  const formattingScore = analysisResult?.formatting?.normalizedScore ?? 0;
  const structureScore = analysisResult?.structure?.normalizedScore ?? 0;
  const contentScore = analysisResult?.content?.normalizedScore ?? 0;
  const isCompleted = submission?.status === 'COMPLETED';

  const handleRecheck = async () => {
    if (!projectId || isProcessing) return;
    try {
      setSubmission(prev => prev ? { ...prev, status: 'PROCESSING', progress: 0 } : prev);
      await userService.recheckSubmission(projectId);
      
      // Fallback: If FAST_MODE is on, processing might finish before the WebSocket reconnects.
      // We only update if the socket hasn't already marked it as COMPLETED to avoid a race condition.
      setTimeout(() => {
        userService.getSubmission(projectId).then(res => {
          setSubmission(prev => {
            if (prev?.status === 'COMPLETED' || prev?.status === 'FAILED') return prev;
            return res.submission;
          });
        }).catch(() => {});
      }, 2000);
      
    } catch (err) {
      console.error('Recheck failed', err);
    }
  };

  return (
    <>
      {/* Review Complete Toast */}
      <AnimatePresence>
        {reviewToast && (
          <ReviewToastBanner toast={reviewToast} onDismiss={() => setReviewToast(null)} />
        )}
      </AnimatePresence>

      <motion.div
        className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
        {/* Header */}
        <motion.div className="flex items-center justify-between px-6 py-4 border-b border-slate-100" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <div className="flex items-center gap-3 text-sm text-slate-800 font-semibold">
            <span className="material-symbols-outlined text-lg text-blue-600">description</span>
            {loading ? (
              <span className="h-4 w-48 rounded bg-slate-200 animate-pulse inline-block" />
            ) : (
              <div className="flex items-center gap-2">
                <span>{submission?.originalName}</span>
                <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded-full font-medium">{submission?.semester} Sem</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">{submission?.university}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!loading && !isProcessing && (
              <button 
                onClick={handleRecheck}
                className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-semibold bg-indigo-50 hover:bg-indigo-100/60 px-3 py-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined text-base">refresh</span>Recheck
              </button>
            )}
            {fileUrl && (
              <a href={fileUrl} download={submission?.originalName} className="flex items-center gap-1.5 text-xs text-blue-600 hover:underline font-semibold bg-blue-50 hover:bg-blue-100/60 px-3 py-1.5 rounded-full transition-colors">
                <span className="material-symbols-outlined text-base">download</span>Download
              </a>
            )}
          </div>
        </motion.div>

        <div className="grid gap-0 lg:grid-cols-[1fr_420px]">
          {/* Left: Document Previewer */}
          <motion.div className="bg-slate-50 p-4 flex flex-col justify-stretch" style={{ minHeight: 640 }} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }}>
            {loading ? (
              <div className="h-full w-full rounded-2xl bg-white animate-pulse flex-1" style={{ minHeight: 600 }} />
            ) : fileError || !fileUrl ? (
              <div className="flex items-center justify-center rounded-2xl bg-white text-slate-400 text-sm flex-1" style={{ minHeight: 600 }}>File could not be loaded.</div>
            ) : submission?.mimeType === 'application/pdf' ? (
              <iframe src={fileUrl} title={submission.originalName} className="w-full rounded-2xl border border-slate-200/60 shadow-sm flex-1 h-[680px]" />
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-8 text-center flex-1" style={{ minHeight: 600 }}>
                <span className="material-symbols-outlined text-6xl text-blue-400">description</span>
                <p className="text-base font-semibold text-slate-700">{submission?.originalName}</p>
                <p className="text-xs text-slate-500 max-w-sm">DOCX preview is not supported in the browser. Download to review locally.</p>
                <a href={fileUrl} download={submission?.originalName} className="mt-2 rounded-full bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 shadow transition-colors">Download File</a>
              </div>
            )}
          </motion.div>

          {/* Right: Diagnostics Panel */}
          <motion.aside className="border-l border-slate-100 bg-white p-6 flex flex-col max-h-[750px] overflow-y-auto" initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.12 }}>

            {/* Score Block */}
            {isCompleted && (
              <div className="flex items-center gap-6 p-4 rounded-3xl bg-slate-50/50 mb-6 border border-slate-100">
                <RadialProgress score={totalScore} size={110} />
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Breakdown</p>
                  <div className="space-y-1.5">
                    {[
                      { label: 'Formatting', score: formattingScore, max: 30, color: 'bg-blue-600' },
                      { label: 'Structure & Guidelines', score: structureScore, max: 30, color: 'bg-indigo-600' },
                      { label: 'Content Quality', score: contentScore, max: 40, color: 'bg-emerald-600' },
                    ].map(({ label, score, max, color }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs font-semibold text-slate-700">
                          <span>{label}</span><span>{score}/{max}</span>
                        </div>
                        <div className="w-full bg-slate-200/60 rounded-full h-1.5 mt-0.5 overflow-hidden">
                          <div className={`${color} h-full`} style={{ width: `${(score / max) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Processing State */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center p-6 text-center bg-blue-50/30 border border-blue-100 rounded-3xl mb-6">
                <div className="h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-sm font-semibold text-slate-800">Processing Submission...</p>
                <p className="text-xs text-slate-500 mt-1 font-medium">You'll be notified when review is complete</p>
                <div className="w-full bg-slate-200/60 rounded-full h-2 mt-3 overflow-hidden">
                  <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${submission?.progress || 0}%` }} />
                </div>
                <p className="text-xs text-slate-500 mt-2 font-medium">{submission?.progress || 0}% Complete</p>
              </div>
            )}

            {/* Failed State */}
            {submission?.status === 'FAILED' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-3xl text-center mb-6">
                <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error</span>
                <p className="text-sm font-semibold text-red-800">Review Failed</p>
                <p className="text-xs text-red-600 mt-1">{(submission as any)?.errorMessage || 'An error occurred during verification.'}</p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-100 mb-4 p-0.5 bg-slate-100 rounded-2xl">
              <button onClick={() => setActiveTab('findings')} className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === 'findings' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                Review Findings ({allIssues.length})
              </button>
              <button onClick={() => setActiveTab('chat')} className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${activeTab === 'chat' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
                Discuss with Supervisor
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 flex flex-col min-h-0">
              <AnimatePresence mode="wait">
                {activeTab === 'findings' ? (
                  <motion.div key="findings" className="space-y-3 flex-1 overflow-y-auto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    {allIssues.length === 0 ? (
                      <div className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-500 text-xs font-medium">
                        {isProcessing ? 'Analysis in progress...' : 'No discrepancies found. All checks passed!'}
                      </div>
                    ) : (
                      allIssues.map((item, idx) => (
                        <div key={`${item.category}-${idx}`} className="rounded-2xl border border-slate-200/80 p-4 space-y-2 bg-white">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.category}</span>
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${severityBadge(item.severity)}`}>{item.severity}</span>
                          </div>
                          <p className="text-xs font-bold text-slate-800">{item.problem}</p>
                          <p className="text-xs text-slate-500 font-medium"><strong className="text-slate-700">Reason:</strong> {item.reason}</p>
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/60 mt-1">
                            <p className="text-xs text-slate-600 font-medium"><strong className="text-blue-600">Fix:</strong> {item.fix}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div key="chat" className="flex-1 flex flex-col min-h-[400px]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                    {/* Message List */}
                    <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px] mb-3">
                      {chatMessages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[90%] px-4 py-3 text-xs font-medium leading-relaxed ${
                            msg.sender === 'user'
                              ? 'rounded-3xl bg-blue-600 text-white rounded-br-sm'
                              : 'rounded-3xl bg-slate-100 text-slate-700 rounded-bl-sm border border-slate-200/40'
                          }`}>
                            {msg.sender === 'agent' ? <ChatText text={msg.text} /> : msg.text}
                          </div>
                        </div>
                      ))}
                      {isChatSending && (
                        <div className="flex justify-start">
                          <div className="rounded-3xl bg-slate-100 text-slate-700 rounded-bl-sm border border-slate-200/40 px-4 py-3 flex gap-1 items-center">
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce" />
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                            <span className="h-1.5 w-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      )}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Suggested Questions */}
                    {chatMessages.length <= 2 && !isChatSending && (
                      <div className="mb-3 flex flex-wrap gap-1.5">
                        {SUGGESTED_QUESTIONS.map((q) => (
                          <button
                            key={q}
                            onClick={() => handleSendChatMessage(q)}
                            disabled={isChatSending}
                            className="text-[10px] font-semibold px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition-colors disabled:opacity-50"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Input */}
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={userMessage}
                        disabled={isChatSending}
                        onChange={(e) => setUserMessage(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSendChatMessage(); }}
                        placeholder="Ask your supervisor a question..."
                        className="flex-1 h-10 px-4 rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:opacity-50"
                      />
                      <button
                        onClick={() => handleSendChatMessage()}
                        disabled={isChatSending || !userMessage.trim()}
                        className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <span className="material-symbols-outlined text-lg">send</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.aside>
        </div>
      </motion.div>
    </>
  );
};

export default ProjectViewPage;
