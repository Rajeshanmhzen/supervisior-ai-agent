export type VectorDoc = {
  id: string;
  text: string;
  embedding: number[];
};

export type VectorSearchResult = {
  id: string;
  text: string;
  score: number;
};

const dot = (a: number[], b: number[]) => a.reduce((sum, v, i) => sum + v * (b[i] || 0), 0);
const norm = (a: number[]) => Math.sqrt(dot(a, a));

export class InMemoryVectorStore {
  private docs: VectorDoc[] = [];

  add(docs: VectorDoc[]) {
    this.docs.push(...docs);
  }

  search(query: number[], topK: number): VectorSearchResult[] {
    const qn = norm(query) || 1;
    const scored = this.docs.map((doc) => {
      const dn = norm(doc.embedding) || 1;
      const score = dot(query, doc.embedding) / (qn * dn);
      return { id: doc.id, text: doc.text, score };
    });
    return scored.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}
