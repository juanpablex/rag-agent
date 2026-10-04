import type { Doc, Section } from "./types";

/** Turns text the visitor provides (a file, or pasted text) into a document the agent can search. */
export const LIMITS = { maxChars: 300_000, maxFileBytes: 5 * 1024 * 1024, maxPages: 150, maxDocs: 5, minChars: 40 };

export const slug = (s: string): string =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "document";

function uniqueId(title: string, taken: string[]): string {
  const base = `my-${slug(title)}`;
  let id = base;
  for (let n = 2; taken.includes(id); n++) id = `${base}-${n}`;
  return id;
}

const HEADING = /^(#{1,3}\s+.+|(\d+(\.\d+)*[.)]?|[A-Z]\.)\s+[A-Z][^.!?]{2,70}|[A-Z0-9][A-Z0-9 ,&'/-]{3,60})$/;

function isHeading(line: string): boolean {
  const t = line.trim();
  if (t.length < 3 || t.length > 80) return false;
  if (/^#{1,3}\s+/.test(t)) return true;
  // ALL CAPS lines and numbered short lines without a final full stop
  return HEADING.test(t) && !/[a-z]{4,}.*\.$/.test(t);
}

/** Splits long text into paragraphs of a readable size. */
function paragraphs(text: string): string[] {
  const out: string[] = [];
  for (const block of text.split(/\n{2,}/)) {
    const flat = block.replace(/\s*\n\s*/g, " ").trim();
    if (!flat) continue;
    if (flat.length <= 700) out.push(flat);
    else {
      let cur = "";
      // Split at sentences; a stretch with no punctuation at all is split at words.
      const pieces = flat.split(/(?<=[.!?])\s+/).flatMap((sentence) => (sentence.length > 700 ? sentence.match(/\S.{0,590}(?:\s+|$)/g) ?? [sentence] : [sentence]));
      for (const piece of pieces.map((x) => x.trim())) {
        if (cur && cur.length + piece.length > 600) { out.push(cur); cur = ""; }
        cur += (cur ? " " : "") + piece;
      }
      if (cur) out.push(cur);
    }
  }
  return out;
}

function makeDoc(title: string, sections: Section[], taken: string[], version: string): Doc {
  return { id: uniqueId(title, taken), title, category: "My documents", date: new Date().toISOString().slice(0, 10), version, owner: "You", sections };
}

function check(text: string): string {
  const t = text.replace(/\r\n?/g, "\n").trim();
  if (t.length < LIMITS.minChars) throw new Error("That text is too short to search. Add a longer text.");
  if (t.length > LIMITS.maxChars) throw new Error(`That text is too long (limit ${LIMITS.maxChars.toLocaleString("en-US")} characters).`);
  return t;
}

/** Plain text or Markdown: sections follow the headings if there are at least two, otherwise parts of about 900 characters. */
export function textToDoc(title: string, text: string, taken: string[]): Doc {
  const t = check(text);
  const lines = t.split("\n");
  const headingIdx = lines.map((l, i) => (isHeading(l) ? i : -1)).filter((i) => i >= 0);
  const sections: Section[] = [];
  const add = (name: string, body: string) => {
    const text2 = paragraphs(body);
    if (text2.length) sections.push({ id: String(sections.length + 1), title: name, text: text2 });
  };
  if (headingIdx.length >= 2) {
    if (headingIdx[0]! > 0) add("Introduction", lines.slice(0, headingIdx[0]).join("\n"));
    headingIdx.forEach((start, k) => {
      const end = headingIdx[k + 1] ?? lines.length;
      add(lines[start]!.replace(/^#{1,3}\s+/, "").trim(), lines.slice(start + 1, end).join("\n"));
    });
  } else {
    let part: string[] = [];
    let size = 0;
    const flush = () => { if (part.length) { sections.push({ id: String(sections.length + 1), title: `Part ${sections.length + 1}`, text: part }); part = []; size = 0; } };
    for (const p of paragraphs(t)) {
      part.push(p);
      size += p.length;
      if (size >= 900) flush();
    }
    flush();
  }
  if (!sections.length) throw new Error("No readable text was found.");
  return makeDoc(title.trim() || "Pasted text", sections, taken, "pasted");
}

/** One section per page; empty pages are skipped but keep their page number. */
export function pagesToDoc(title: string, pages: string[], taken: string[]): Doc {
  const total = pages.reduce((a, p) => a + p.length, 0);
  if (total < LIMITS.minChars) throw new Error("This PDF has no text I can read. It may be a scan (an image), and reading scans is not supported. Paste the text instead.");
  if (total > LIMITS.maxChars) throw new Error(`This PDF has too much text (limit ${LIMITS.maxChars.toLocaleString("en-US")} characters).`);
  const sections: Section[] = [];
  pages.forEach((p, i) => {
    const text = paragraphs(p.replace(/\r\n?/g, "\n"));
    if (text.length) sections.push({ id: String(i + 1), title: `Page ${i + 1}`, text });
  });
  return makeDoc(title.trim() || "PDF", sections, taken, "pdf");
}
