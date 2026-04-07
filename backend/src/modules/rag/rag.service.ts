import crypto from 'crypto';
import { embedText } from './embeddings.service';
import { InMemoryVectorStore } from './vector.store';

const chunkText = (text: string, chunkSize = 900, overlap = 150) => {
  const chunks: string[] = [];
  let idx = 0;
  while (idx < text.length) {
    const slice = text.slice(idx, idx + chunkSize);
    if (slice.trim()) chunks.push(slice.trim());
    idx += chunkSize - overlap;
  }
  return chunks;
};

const storeCache = new Map<string, InMemoryVectorStore>();

export const buildGuidelineIndex = async (guidelineText: string) => {
  const key = crypto.createHash('md5').update(guidelineText).digest('hex');
  if (storeCache.has(key)) return storeCache.get(key)!;

  const store = new InMemoryVectorStore();
  const chunks = chunkText(guidelineText);

  const docs = await Promise.all(
    chunks.map(async (chunk) => ({
      id: crypto.createHash('md5').update(chunk).digest('hex'),
      text: chunk,
      embedding: await embedText(chunk),
    }))
  );

  store.add(docs);
  storeCache.set(key, store);
  return store;
};

export const retrieveGuidelineContext = async (
  query: string,
  guidelineText: string,
  topK = 4
) => {
  const store = await buildGuidelineIndex(guidelineText);
  const queryEmbedding = await embedText(query);
  const results = store.search(queryEmbedding, topK);
  return results.map((r) => r.text).join('\n\n');
};
