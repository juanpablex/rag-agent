import { useEffect, useRef, useState } from "react";
import type { Turn } from "../core/agent";
import { docById } from "../core/data";
import { parseCitations, unverified, type Segment } from "../core/citations";

export interface Msg {
  id: number;
  role: "user" | "agent";
  text: string;
  turn?: Turn;
}

export const SUGGESTIONS = [
  "How many days of remote work are allowed per week?",
  "What is the wholesale price of the P-200 Fjord pendant, and what discount do I get for 600 units?",
  "What happens if Meridian misses the 99.5% accuracy target?",
  "Can I expense alcohol on a business trip?",
  "What salary range does a Key Account Manager have, and how is commission paid?",
];

function Cite({ s, onOpen }: { s: Extract<Segment, { kind: "cite" }>; onOpen: (docId: string, section: string) => void }) {
  const doc = docById(s.docId);
  if (!s.known) return <span className="cite bad" title="This citation does not match any document, so it cannot be trusted">⚠ unknown source</span>;
  return (
    <button className={s.verified ? "cite" : "cite warn"} onClick={() => onOpen(s.docId, s.section)} title={s.verified ? "Open the cited passage" : "The agent did not retrieve this section in this turn: check it in the document"}>
      {s.verified ? "" : "⚠ "}{doc!.title.replace(/:.*$/, "")} §{s.section}
    </button>
  );
}

function Answer({ msg, onOpen }: { msg: Msg; onOpen: (docId: string, section: string) => void }) {
  const retrieved = msg.turn?.retrieved ?? [];
  const segs = parseCitations(msg.text, retrieved);
  const bad = unverified(segs);
  const used = [...new Set(segs.flatMap((s) => (s.kind === "cite" && s.known ? [s.docId] : [])))];
  // paragraphs: split text segments on blank lines but keep citations inline
  const paras: Segment[][] = [[]];
  for (const s of segs) {
    if (s.kind === "cite") { paras[paras.length - 1]!.push(s); continue; }
    s.text.split(/\n{2,}/).forEach((t, i) => {
      if (i > 0) paras.push([]);
      if (t) paras[paras.length - 1]!.push({ kind: "text", text: t });
    });
  }
  return (
    <>
      {paras.filter((p) => p.length).map((p, i) => (
        <p key={i}>{p.map((s, j) => (s.kind === "text" ? <span key={j}>{s.text}</span> : <Cite key={j} s={s} onOpen={onOpen} />))}</p>
      ))}
      {bad > 0 && <p className="warn-note">{bad} citation{bad > 1 ? "s were" : " was"} not verified against what the agent actually retrieved. Check {bad > 1 ? "them" : "it"} in the document.</p>}
      {used.length > 0 && (
        <p className="sources">Sources: {used.map((id) => <button key={id} className="src" onClick={() => onOpen(id, "")}>{docById(id)!.title}</button>)}</p>
      )}
      {msg.turn && msg.turn.steps.length > 0 && (
        <details className="steps">
          <summary>{msg.turn.steps.length} search step{msg.turn.steps.length > 1 ? "s" : ""}{msg.turn.usage ? ` · ${msg.turn.usage.inputTokens + msg.turn.usage.outputTokens} tokens (from the API)` : ""}</summary>
          <ol>
            {msg.turn.steps.map((s, i) => (
              <li key={i} className={s.ok ? undefined : "failed"}><code>{s.tool}</code> <span className="args">{JSON.stringify(s.args)}</span> <span className="ms">{s.ms} ms</span></li>
            ))}
          </ol>
        </details>
      )}
    </>
  );
}

export function Chat({ msgs, busy, onSend, onOpen, mode }: { msgs: Msg[]; busy: boolean; onSend: (text: string) => void; onOpen: (docId: string, section: string) => void; mode: string }) {
  const [input, setInput] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // Block body on purpose (see Library): never return the scrollIntoView result from an effect.
    end.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, busy]);
  return (
    <div className="chat-col">
      <main className="chat" aria-live="polite">
        {msgs.map((m) => (
          <article key={m.id} className={`msg ${m.role}`}>{m.role === "user" ? <p>{m.text}</p> : <Answer msg={m} onOpen={onOpen} />}</article>
        ))}
        {busy && <article className="msg agent thinking"><p>{mode === "script" ? "Searching..." : "Thinking and searching the documents..."}</p></article>}
        <div ref={end} />
      </main>
      <footer>
        {msgs.length <= 1 && <div className="chips">{SUGGESTIONS.map((s) => <button key={s} className="chip" onClick={() => onSend(s)} disabled={busy}>{s}</button>)}</div>}
        <form onSubmit={(e) => { e.preventDefault(); const t = input.trim(); if (t && !busy) { setInput(""); onSend(t); } }}>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about contracts, policies, salaries, prices, catalogs, reports..." aria-label="Question" />
          <button className="primary" disabled={busy || !input.trim()}>Ask</button>
        </form>
      </footer>
    </div>
  );
}
