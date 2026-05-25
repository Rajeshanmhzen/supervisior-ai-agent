const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'phi3:mini';

const sanitizeString = (value: string) =>
  value.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, '');

const truncate = (input: string, maxChars: number) => {
  if (input.length <= maxChars) return input;
  return `${input.slice(0, maxChars)}\n\n[Truncated ${input.length - maxChars} chars]`;
};

const buildPrompt = (
  text: string,
  rulesSummary?: string | null,
  contextLabel?: string | null,
  ragContext?: string | null
) => `
You are a university project reviewer. Analyze the document text and return strict JSON.
Focus on: missing required sections, formatting issues (headings, references, tables/figures),
syllabus alignment (if topics seem off), and clarity/consistency.

Return JSON with this exact shape:
{
  "summary": string,
  "content": {
    "score": number,
    "feedback": [
      {
        "severity": "CRITICAL" | "MAJOR" | "MINOR",
        "problem": string,
        "reason": string,
        "fix": string
      }
    ]
  }
}

${rulesSummary ? `Guideline rules summary:\n${rulesSummary}\n` : ''}
${ragContext ? `Relevant guideline excerpts:\n${ragContext}\n` : ''}
${contextLabel ? `Context: ${contextLabel}\n` : ''}

Document text:
"""${truncate(text, 8000)}"""
`;

export const analyzeWithAI = async (
  text: string,
  rulesSummary?: string | null,
  contextLabel?: string | null,
  ragContext?: string | null
) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 300_000);

  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: buildPrompt(text, rulesSummary, contextLabel, ragContext),
        stream: false,
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(errText || `Ollama error: ${res.status}`);
    }

    const data = (await res.json()) as { response?: string };
    const rawOutput = (data?.response || '').trim();
    const output = sanitizeString(rawOutput);

    // Clean markdown code block wrappers
    let cleanOutput = output.trim();
    if (cleanOutput.startsWith('```json')) {
      cleanOutput = cleanOutput.slice(7);
    } else if (cleanOutput.startsWith('```')) {
      cleanOutput = cleanOutput.slice(3);
    }
    if (cleanOutput.endsWith('```')) {
      cleanOutput = cleanOutput.slice(0, -3);
    }
    cleanOutput = cleanOutput.trim();

    try {
      const parsed = JSON.parse(cleanOutput);
      if (parsed && typeof parsed === 'object') {
        const summary = parsed.summary || 'Summary compiled successfully.';

        let score = 75;
        if (parsed.content && typeof parsed.content.score === 'number') {
          score = parsed.content.score;
        } else if (typeof parsed.score === 'number') {
          score = parsed.score;
        } else if (parsed.content && typeof parsed.content.score === 'string') {
          score = Number(parsed.content.score) || 75;
        } else if (typeof parsed.score === 'string') {
          score = Number(parsed.score) || 75;
        }

        let feedback: any[] = [];
        if (parsed.content && Array.isArray(parsed.content.feedback)) {
          feedback = parsed.content.feedback;
        } else if (Array.isArray(parsed.feedback)) {
          feedback = parsed.feedback;
        } else if (Array.isArray(parsed.issues)) {
          feedback = parsed.issues;
        }

        const normalizedFeedback = feedback.map((item: any) => ({
          severity: item.severity || 'MAJOR',
          problem: item.problem || item.message || 'Content improvement suggestion',
          reason: item.reason || 'Report quality should follow academic depth.',
          fix: item.fix || item.suggestion || 'Review the context of this chapter.',
        }));

        return {
          summary,
          content: {
            score,
            feedback: normalizedFeedback,
          },
        };
      }
      return {
        summary: output || 'No summary returned',
        content: {
          score: 70,
          feedback: [],
        },
      };
    } catch {
      let fallbackScore = 75;
      const scoreMatch = cleanOutput.match(/"score"\s*:\s*(\d+)/i);
      if (scoreMatch && scoreMatch[1]) {
        fallbackScore = Number(scoreMatch[1]) || 75;
      }

      return {
        summary: output || 'No summary returned',
        content: {
          score: fallbackScore,
          feedback: [],
        },
      };
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return {
        summary: 'AI analysis timed out. Please try again or use a smaller document.',
        content: {
          score: 0,
          feedback: [],
        },
      };
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
};
