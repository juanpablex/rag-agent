import { docById } from "./data";

/** The model cites with markers like [doc:remote-work-policy#2]. The app turns them into chips and checks them. */
export type Segment =
  | { kind: "text"; text: string }
  | { kind: "cite"; docId: string; section: string; verified: boolean; known: boolean };

const CITE = /\[doc:([a-z0-9-]+)#([0-9.]+)\]/gi;

export function parseCitations(text: string, retrieved: { docId: string; section: string }[]): Segment[] {
  const seen = new Set(retrieved.map((r) => `${r.docId}#${r.section}`));
  const out: Segment[] = [];
  let last = 0;
  for (const m of text.matchAll(CITE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push({ kind: "text", text: text.slice(last, idx) });
    const docId = m[1]!.toLowerCase();
    const section = m[2]!;
    const doc = docById(docId);
    const known = !!doc?.sections.some((s) => s.id === section);
    out.push({ kind: "cite", docId, section, known, verified: known && seen.has(`${docId}#${section}`) });
    last = idx + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", text: text.slice(last) });
  return out;
}

/** Citations that are made up (unknown) or that point to text the agent never retrieved in this turn. */
export function unverified(segments: Segment[]): number {
  return segments.filter((s) => s.kind === "cite" && !s.verified).length;
}
