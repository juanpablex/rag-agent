import { DOCS } from "./data";
import type { Category, Doc, Section } from "./types";

/** Small BM25 search over the sections of all documents. It runs in the browser, with no server or index file. */
export interface Hit {
  docId: string;
  docTitle: string;
  category: Category;
  sectionId: string;
  sectionTitle: string;
  score: number;
  text: string;
}

const STOP = new Set("a an and are as at be by can do does for from has have how i in is it its of on or per that the their there this to was what when where which who will with you your we our if not no than then into any all".split(" "));

export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9.]+/g, " ")
    .split(" ")
    .map((w) => w.replace(/^\.+|\.+$/g, ""))
    .filter((w) => w && !STOP.has(w))
    .map(stem);
}

/** Very light stemming: enough to match "days" with "day" and "refunded" with "refund". */
function stem(w: string): string {
  if (w.length > 5 && w.endsWith("ing")) return w.slice(0, -3);
  if (w.length > 4 && w.endsWith("ed")) return w.slice(0, -2);
  if (w.length > 4 && w.endsWith("es")) return w.slice(0, -2);
  if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
  return w;
}

interface Chunk {
  doc: Doc;
  section: Section;
  tokens: string[];
  tf: Map<string, number>;
}

const chunks: Chunk[] = DOCS.flatMap((doc) =>
  doc.sections.map((section) => {
    // Titles weigh double: a question about "remote work" should find the remote work policy.
    const tokens = [...tokenize(doc.title), ...tokenize(doc.title), ...tokenize(section.title), ...tokenize(section.title), ...tokenize(section.text.join(" "))];
    const tf = new Map<string, number>();
    tokens.forEach((t) => tf.set(t, (tf.get(t) ?? 0) + 1));
    return { doc, section, tokens, tf };
  }),
);

const df = new Map<string, number>();
chunks.forEach((c) => c.tf.forEach((_, t) => df.set(t, (df.get(t) ?? 0) + 1)));
const avgLen = chunks.reduce((a, c) => a + c.tokens.length, 0) / chunks.length;

const excerpt = (s: Section) => s.text.join(" ");

export function search(query: string, opts: { category?: Category; limit?: number } = {}): Hit[] {
  const q = [...new Set(tokenize(query))];
  const k1 = 1.4;
  const b = 0.75;
  return chunks
    .filter((c) => !opts.category || c.doc.category === opts.category)
    .map((c) => {
      let score = 0;
      for (const t of q) {
        const f = c.tf.get(t);
        if (!f) continue;
        const idf = Math.log(1 + (chunks.length - (df.get(t) ?? 0) + 0.5) / ((df.get(t) ?? 0) + 0.5));
        score += (idf * (f * (k1 + 1))) / (f + k1 * (1 - b + (b * c.tokens.length) / avgLen));
      }
      return { c, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b2) => b2.score - a.score)
    .slice(0, opts.limit ?? 5)
    .map(({ c, score }) => ({
      docId: c.doc.id,
      docTitle: c.doc.title,
      category: c.doc.category,
      sectionId: c.section.id,
      sectionTitle: c.section.title,
      score: Math.round(score * 100) / 100,
      text: excerpt(c.section),
    }));
}
