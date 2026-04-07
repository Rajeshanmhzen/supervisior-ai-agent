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
    const output = sanitizeString((data?.response || '').trim());

    try {
      const parsed = JSON.parse(output);
      if (parsed && typeof parsed === 'object' && parsed.content) return parsed;
      return {
        summary: parsed?.summary || output || 'No summary returned',
        content: {
          score: 0,
          feedback: [],
        },
      };
    } catch {
      return {
        summary: output || 'No summary returned',
        content: {
          score: 0,
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
