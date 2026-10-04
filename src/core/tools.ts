import { DOCS, docById } from "./data";
import { search } from "./search";
import { CATEGORIES, type Category } from "./types";

/**
 * Read-only tools of the document agent. There is no tool that edits or deletes a document.
 * Results are small (a few sections) so a question costs little.
 */
export interface ToolSpec {
  name: string;
  description: string;
  input_schema: { type: "object"; properties: Record<string, unknown>; required: string[] };
  run: (args: Record<string, unknown>) => unknown;
}

const category = (v: unknown): Category | undefined => (CATEGORIES.includes(v as Category) ? (v as Category) : undefined);
const CATEGORY_PROP = { type: "string", enum: [...CATEGORIES], description: "Optional category filter" };

export const TOOLS: ToolSpec[] = [
  {
    name: "search_documents",
    description:
      "Full-text search over all company documents. Returns the best matching sections with their text. Use short keyword queries (not full sentences); search again with different words if the first results do not answer the question.",
    input_schema: {
      type: "object",
      properties: { query: { type: "string" }, category: CATEGORY_PROP, limit: { type: "number", description: "Max sections, default 5, max 8" } },
      required: ["query"],
    },
    run: (a) => {
      const limit = Math.min(Math.max(Number(a.limit) || 5, 1), 8);
      const hits = search(String(a.query ?? ""), { category: category(a.category), limit });
      return { total: hits.length, results: hits };
    },
  },
  {
    name: "read_section",
    description: "Returns the full text of one section of a document, identified by document id and section id (as shown in search results).",
    input_schema: { type: "object", properties: { docId: { type: "string" }, section: { type: "string" } }, required: ["docId", "section"] },
    run: (a) => {
      const doc = docById(String(a.docId));
      if (!doc) throw new Error(`Unknown document: ${a.docId}`);
      const s = doc.sections.find((x) => x.id === String(a.section));
      if (!s) throw new Error(`Unknown section ${a.section} in ${doc.id}. Sections: ${doc.sections.map((x) => x.id).join(", ")}`);
      return { docId: doc.id, docTitle: doc.title, sectionId: s.id, sectionTitle: s.title, text: s.text.join(" ") };
    },
  },
  {
    name: "get_document_outline",
    description: "Returns the metadata and the list of section titles of a document.",
    input_schema: { type: "object", properties: { docId: { type: "string" } }, required: ["docId"] },
    run: (a) => {
      const doc = docById(String(a.docId));
      if (!doc) throw new Error(`Unknown document: ${a.docId}`);
      return { id: doc.id, title: doc.title, category: doc.category, version: doc.version, date: doc.date, owner: doc.owner, sections: doc.sections.map((s) => ({ id: s.id, title: s.title })) };
    },
  },
  {
    name: "list_documents",
    description: "Lists documents (id, title, category, date, version, owner), optionally for one category.",
    input_schema: { type: "object", properties: { category: CATEGORY_PROP }, required: [] },
    run: (a) => {
      const c = category(a.category);
      const rows = DOCS.filter((d) => !c || d.category === c).map((d) => ({ id: d.id, title: d.title, category: d.category, date: d.date, version: d.version, owner: d.owner }));
      return { total: rows.length, rows };
    },
  },
];

export function runTool(name: string, args: Record<string, unknown>): unknown {
  const t = TOOLS.find((x) => x.name === name);
  if (!t) throw new Error(`Unknown tool: ${name}`);
  return t.run(args);
}

/** Which (document, section) pairs a tool result put in front of the model. Citations are checked against these. */
export function retrievedFrom(name: string, result: unknown): { docId: string; section: string }[] {
  const r = result as { results?: { docId: string; sectionId: string }[]; docId?: string; sectionId?: string };
  if (name === "search_documents") return (r.results ?? []).map((x) => ({ docId: x.docId, section: x.sectionId }));
  if (name === "read_section" && r.docId && r.sectionId) return [{ docId: r.docId, section: r.sectionId }];
  return [];
}
