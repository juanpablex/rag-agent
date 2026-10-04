import type Anthropic from "@anthropic-ai/sdk";
import { DOCS } from "../src/core/data";
import { search } from "../src/core/search";
import { TOOLS, retrievedFrom } from "../src/core/tools";
import { parseCitations, unverified } from "../src/core/citations";
import { runScripted } from "../src/core/agent";
import { runLlmTurn, type LlmClient } from "../src/core/llm";
import { runSampleTurn, type SampleFn } from "../src/core/sample";
import { BUILT_IN_CATEGORIES } from "../src/core/types";
import { addUserDoc, allDocs, clearUserDocs, docById } from "../src/core/library";
import { LIMITS, pagesToDoc, textToDoc } from "../src/core/ingest";

/** Data integrity, retrieval quality, citation checks and both model loops (with fakes: no key, no network). */
function assert(cond: unknown, msg: string): asserts cond {
  if (!cond) {
    console.error(`FAIL: ${msg}`);
    process.exit(1);
  }
}

// ---- data
const ids = new Set<string>();
for (const d of DOCS) {
  assert(!ids.has(d.id), `unique document id ${d.id}`);
  ids.add(d.id);
  assert(/^[a-z0-9-]+$/.test(d.id), `document id is citation-safe: ${d.id}`);
  assert(new Set(d.sections.map((s) => s.id)).size === d.sections.length, `unique section ids in ${d.id}`);
  assert(d.sections.every((s) => /^[0-9]+$/.test(s.id) && s.text.length > 0), `valid sections in ${d.id}`);
}
assert(DOCS.length >= 24, "there are at least 24 documents");
assert(BUILT_IN_CATEGORIES.every((c) => DOCS.some((d) => d.category === c)), "every category has documents");

// ---- retrieval: each question must find the expected section in the top 3
const QUESTIONS: [string, string, string][] = [
  ["How many days of remote work are allowed per week?", "remote-work-policy", "2"],
  ["What is the daily meal limit when travelling?", "expense-policy", "2"],
  ["How many vacation days do employees get?", "leave-policy", "1"],
  ["salary range for a software developer", "salary-bands-2025", "4"],
  ["What commission do sales representatives earn?", "bonus-commission-plan", "2"],
  ["wholesale price of the P-200 Fjord pendant", "price-list-wholesale-2025", "1"],
  ["discount for ordering 600 units", "price-list-wholesale-2025", "4"],
  ["How long do customers have to return a product?", "returns-warranty-policy", "1"],
  ["warranty on LED drivers", "returns-warranty-policy", "3"],
  ["payment terms with Meridian Logistics", "msa-meridian-logistics", "3"],
  ["notice period to end the Meridian agreement", "msa-meridian-logistics", "4"],
  ["Which products were best sellers in Q2?", "sales-report-q2-2025", "3"],
  ["What PPE is required on the warehouse floor?", "health-safety-rules", "1"],
  ["how fast must data breaches be reported", "data-privacy-policy", "3"],
  ["gift limit for employees", "code-of-conduct", "2"],
  ["What happened in the forklift near miss?", "incident-report-2025-05", "1"],
  ["Platinum distributor discount", "price-list-distributors", "1"],
  ["installation cost per fixture", "catalog-services-2025", "2"],
];
let found = 0;
for (const [q, doc, sec] of QUESTIONS) {
  const top = search(q, { limit: 3 });
  const ok = top.some((h) => h.docId === doc && h.sectionId === sec);
  if (ok) found++;
  else console.log(`  miss: "${q}" -> ${top.map((h) => `${h.docId}#${h.sectionId}`).join(", ")} (wanted ${doc}#${sec})`);
}
assert(found >= QUESTIONS.length - 1, `retrieval: ${found}/${QUESTIONS.length} questions found their section in the top 3`);
assert(search("zzzzqqq").length === 0, "a query with no matching words returns nothing");
assert(search("refund", { category: "Contracts" }).every((h) => h.category === "Contracts"), "the category filter works");

// ---- tools are read-only and fail clearly
assert(!TOOLS.some((t) => /write|edit|delete|update|create/.test(t.name)), "no tool changes documents");
for (const t of TOOLS) assert(t.description && t.input_schema.type === "object", `${t.name} has a description and schema`);
let msg = "";
try { TOOLS.find((t) => t.name === "read_section")!.run({ docId: "nope", section: "1" }); } catch (e) { msg = (e as Error).message; }
assert(/Unknown document/.test(msg), "reading an unknown document fails clearly");

// ---- citations are checked against what was retrieved
const retrieved = [{ docId: "leave-policy", section: "1" }];
const segs = parseCitations("22 days [doc:leave-policy#1]. Also 5 [doc:leave-policy#2] and [doc:made-up-doc#9].", retrieved);
const cites = segs.filter((s) => s.kind === "cite");
assert(cites.length === 3, "three citations are parsed");
assert(cites[0]!.kind === "cite" && cites[0]!.verified, "a retrieved citation is verified");
assert(cites[1]!.kind === "cite" && cites[1]!.known && !cites[1]!.verified, "a real section that was not retrieved is flagged");
assert(cites[2]!.kind === "cite" && !cites[2]!.known, "an invented document is flagged");
assert(unverified(segs) === 2, "two citations are unverified");
assert(retrievedFrom("search_documents", { results: [{ docId: "a", sectionId: "2" }] })[0]!.section === "2", "retrieved sections are tracked from search results");

// ---- scripted mode
{
  const t = runScripted("how many remote work days per week?");
  assert(/remote-work-policy#2/.test(t.reply) && t.steps[0]?.tool === "search_documents", "scripted mode answers with a citation");
  assert(unverified(parseCitations(t.reply, t.retrieved)) === 0, "scripted citations are all verified");
  assert(/could not find/.test(runScripted("zzzzqqq").reply), "scripted mode says when it finds nothing");
}

// ---- key mode with a fake model
const usage = { input_tokens: 100, output_tokens: 20 };
const m = (stop_reason: string, content: unknown[]) => ({ stop_reason, content, usage }) as unknown as Anthropic.Message;
const fakeLlm = (script: Anthropic.Message[]): LlmClient => ({ messages: { create: async () => { const n = script.shift(); if (!n) throw new Error("script ended"); return n; } } });
{
  const turn = await runLlmTurn("remote days?", [], fakeLlm([
    m("tool_use", [{ type: "tool_use", id: "a", name: "search_documents", input: { query: "remote work days" } }]),
    m("end_turn", [{ type: "text", text: "Up to 3 days [doc:remote-work-policy#2]." }]),
  ]), "m");
  assert(unverified(parseCitations(turn.reply, turn.retrieved)) === 0, "key mode: a citation of a retrieved section is verified");
  assert(turn.usage?.calls === 2 && turn.usage.inputTokens === 200, "key mode: usage is summed");
  const made = await runLlmTurn("x", [], fakeLlm([m("end_turn", [{ type: "text", text: "It is 9 [doc:leave-policy#1]." }])]), "m");
  assert(unverified(parseCitations(made.reply, made.retrieved)) === 1, "key mode: a citation without a search is flagged");
  const bad = await runLlmTurn("x", [], fakeLlm([
    m("tool_use", [{ type: "tool_use", id: "a", name: "delete_document", input: {} }]),
    m("end_turn", [{ type: "text", text: "I cannot do that." }]),
  ]), "m");
  assert(/cannot/.test(bad.reply) && bad.steps[0]?.ok === false, "key mode: an unknown tool is an error result");
  const history: Anthropic.MessageParam[] = [{ role: "user", content: "a" }, { role: "assistant", content: "b" }];
  let threw = false;
  try { await runLlmTurn("x", history, fakeLlm([]), "m"); } catch { threw = true; }
  assert(threw && history.length === 2, "key mode: a failed turn leaves the history as it was");
}

// ---- account mode with a fake sample function
{
  let offered = 0;
  const fakeSample = Object.assign(
    async (_i: unknown, o?: { tools?: { name: string; execute: (x: Record<string, unknown>) => unknown }[] }) => {
      offered = o?.tools?.length ?? 0;
      o!.tools!.find((t) => t.name === "search_documents")!.execute({ query: "leave vacation days" });
      return { text: "22 days [doc:leave-policy#1].", truncated: false };
    },
    { limits: async () => ({ tools: { maxCount: 10 } }) },
  ) as unknown as SampleFn;
  const turns: { role: "user" | "assistant"; content: string }[] = [];
  const t = await runSampleTurn("vacation days?", turns, fakeSample, "quick");
  assert(offered === TOOLS.length && turns.length === 2, "account mode: every tool is offered and the conversation is kept");
  assert(unverified(parseCitations(t.reply, t.retrieved)) === 0, "account mode: citations are verified against retrieved sections");
  const none = Object.assign(async () => ({ text: "x", truncated: false }), { limits: async () => ({}) }) as unknown as SampleFn;
  let code = "";
  try { await runSampleTurn("x", [], none, "quick"); } catch (e) { code = (e as { code: string }).code; }
  assert(code === "tools_unavailable", "account mode: a viewer without page tools gets a clear error");
}

// ---- documents added by the visitor
{
  const md = "# Pet policy\n\nDogs under 10 kg may visit the office on Fridays with prior approval.\n\n# Parking\n\nVisitor parking is limited to 2 hours; the zeppelin dock is closed on Mondays.\n";
  const doc = textToDoc("Office guide", md, allDocs().map((d) => d.id));
  assert(doc.category === "My documents" && doc.id === "my-office-guide" && doc.sections.length === 2, "headings become sections");
  assert(doc.sections[0]!.title === "Pet policy" && doc.sections[1]!.id === "2", "section titles and ids are kept");
  addUserDoc(doc);
  assert(docById("my-office-guide") !== undefined && allDocs().length === DOCS.length + 1, "an added document joins the library");
  const hit = search("zeppelin dock", { limit: 3 })[0];
  assert(hit?.docId === "my-office-guide" && hit.sectionId === "2", "an added document is searchable right away");
  assert(search("dogs office", { category: "My documents" }).every((h) => h.category === "My documents"), "the My documents filter works");
  const segs = parseCitations("Closed on Mondays [doc:my-office-guide#2].", [{ docId: "my-office-guide", section: "2" }]);
  assert(unverified(segs) === 0, "citations to an added document are verified");
  const dup = textToDoc("Office guide", md, allDocs().map((d) => d.id));
  assert(dup.id === "my-office-guide-2", "ids stay unique when the same title is added twice");
  const flat = textToDoc("Notes", "word ".repeat(600), []);
  assert(flat.sections.length >= 2 && flat.sections[0]!.title === "Part 1", "text without headings is split into parts");
  let msg2 = "";
  try { textToDoc("x", "short", []); } catch (e) { msg2 = (e as Error).message; }
  assert(/too short/.test(msg2), "text that is too short is refused");
  try { textToDoc("x", "a".repeat(LIMITS.maxChars + 1), []); msg2 = ""; } catch (e) { msg2 = (e as Error).message; }
  assert(/too long/.test(msg2), "text that is too long is refused");
  const pdf = pagesToDoc("Report", ["First page text with enough words to count as content for the search.", "", "Third page mentions the quarterly bonus pool."], []);
  assert(pdf.sections.map((x) => x.id).join() === "1,3" && pdf.sections[1]!.title === "Page 3", "PDF pages keep their page numbers");
  try { pagesToDoc("Scan", ["", " "], []); msg2 = ""; } catch (e) { msg2 = (e as Error).message; }
  assert(/scan/i.test(msg2), "a PDF without text explains that scans are not supported");
  clearUserDocs();
  assert(allDocs().length === DOCS.length && search("zeppelin").length === 0, "removing the documents also removes them from search");
}

console.log(`OK: ${DOCS.length} documents, retrieval ${found}/${QUESTIONS.length}, citations checked, both model loops (fakes)`);
