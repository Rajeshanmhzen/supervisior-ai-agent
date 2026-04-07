const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_EMBED_MODEL = process.env.OLLAMA_EMBED_MODEL || 'nomic-embed-text';

export const embedText = async (text: string): Promise<number[]> => {
  const res = await fetch(`${OLLAMA_URL}/api/embeddings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: OLLAMA_EMBED_MODEL,
      prompt: text,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(errText || `Embedding error: ${res.status}`);
  }

  const data = (await res.json()) as { embedding?: number[] };
  if (!data?.embedding || data.embedding.length === 0) {
    throw new Error('Embedding response missing vector');
  }
  return data.embedding;
};
