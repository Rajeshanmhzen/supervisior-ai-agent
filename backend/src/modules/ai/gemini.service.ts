const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = 'gemini-2.0-flash';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: { message?: string };
}

/**
 * Chat with Gemini AI for supervisor-style responses.
 * Builds a rich prompt with document context, analysis results, and the user question.
 */
export const chatWithGemini = async (
  userMessage: string,
  documentContext: {
    documentName: string;
    semester: string;
    university: string;
    analysisResult?: any;
    ruleCheck?: any;
    docTextExcerpt?: string;
  }
): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const { documentName, semester, university, analysisResult, ruleCheck, docTextExcerpt } = documentContext;

  // Build analysis summary for context
  let analysisSummary = '';
  if (analysisResult) {
    const total = analysisResult.total ?? 'N/A';
    const fmtScore = analysisResult.formatting?.normalizedScore ?? 'N/A';
    const structScore = analysisResult.structure?.normalizedScore ?? 'N/A';
    const contentScore = analysisResult.content?.normalizedScore ?? 'N/A';

    analysisSummary += `\nAnalysis Scores: Total=${total}/100, Formatting=${fmtScore}/30, Structure=${structScore}/30, Content Quality=${contentScore}/40\n`;

    // Formatting issues
    if (analysisResult.formatting?.issues?.length > 0) {
      analysisSummary += '\nFormatting Issues Found:\n';
      for (const issue of analysisResult.formatting.issues) {
        analysisSummary += `- [${issue.severity}] ${issue.problem}: ${issue.reason}. Fix: ${issue.fix}\n`;
      }
    }

    // Reference issues
    if (analysisResult.references?.issues?.length > 0) {
      analysisSummary += '\nReference Issues Found:\n';
      for (const issue of analysisResult.references.issues) {
        analysisSummary += `- [${issue.severity}] ${issue.problem}: ${issue.reason}. Fix: ${issue.fix}\n`;
      }
    }

    // Content feedback
    if (analysisResult.content?.feedback?.length > 0) {
      analysisSummary += '\nContent Quality Feedback:\n';
      for (const fb of analysisResult.content.feedback) {
        analysisSummary += `- [${fb.severity}] ${fb.problem}: ${fb.reason}. Fix: ${fb.fix}\n`;
      }
    }

    // AI summary
    if (analysisResult.aiFeedback?.length > 0) {
      for (const entry of analysisResult.aiFeedback) {
        if (entry.summary && entry.summary !== 'AI analysis skipped to speed up processing.') {
          analysisSummary += `\nAI Summary (${entry.pageRange}): ${entry.summary}\n`;
        }
      }
    }
  }

  // Structure/rule check issues
  let ruleCheckSummary = '';
  if (ruleCheck?.issues?.length > 0) {
    ruleCheckSummary = '\nStructure & Guideline Issues:\n';
    for (const issue of ruleCheck.issues) {
      ruleCheckSummary += `- [${issue.severity}] ${issue.message}${issue.fix ? `. Fix: ${issue.fix}` : ''}\n`;
    }
  }

  const systemPrompt = `You are an expert university project supervisor for ${university}, specifically reviewing BCA ${semester} semester project reports.

Your role:
- You are a friendly but rigorous academic supervisor
- Help students improve their project reports to meet university guidelines
- Give specific, actionable advice based on the document analysis
- When asked about improvements, reference the specific issues found in the analysis
- Support project-related discussions (architecture, methodology, design decisions)
- If asked a general question about the project, answer helpfully based on the document context
- Keep responses concise but thorough (2-4 paragraphs max)
- Use bullet points for lists of improvements
- Always be encouraging while pointing out areas for improvement

Document: "${documentName}"
Semester: ${semester}
University: ${university}
${analysisSummary}
${ruleCheckSummary}
${docTextExcerpt ? `\nDocument Excerpt (first ~2000 chars):\n"""${docTextExcerpt.slice(0, 2000)}"""\n` : ''}

Student's question: "${userMessage}"

Respond as their supervisor. Be specific and helpful. If they ask about improvements, list the actual issues found. If they ask about their project topic, discuss it knowledgeably.`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: systemPrompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
          topP: 0.9,
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini API error (${res.status}): ${errText}`);
    }

    const data = (await res.json()) as GeminiResponse;

    if (data.error) {
      throw new Error(data.error.message || 'Gemini returned an error');
    }

    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!responseText) {
      throw new Error('No response text from Gemini');
    }

    return responseText.trim();
  } finally {
    clearTimeout(timeout);
  }
};

/**
 * Generate improvement suggestions from analysis results using Gemini.
 */
export const generateImprovementSummary = async (
  documentContext: {
    documentName: string;
    semester: string;
    university: string;
    analysisResult?: any;
    ruleCheck?: any;
  }
): Promise<string> => {
  const prompt = `Based on the analysis, list the top improvements needed for this ${documentContext.semester} semester report. Be specific and actionable.`;
  return chatWithGemini(prompt, documentContext);
};
