import { useRef, useState, useSyncExternalStore } from "react";
import Anthropic from "@anthropic-ai/sdk";
import { runScripted, type Turn } from "../core/agent";
import { DOCS } from "../core/data";
import { allDocs, getVersion, subscribeLibrary } from "../core/library";
import { explainError, runLlmTurn, type History } from "../core/llm";
import { explainSampleError, getSample, runSampleTurn, type ChatTurn, type Tier } from "../core/sample";
import { Chat, type Msg } from "./Chat";
import { Library, type OpenDoc } from "./Library";
import { ModelDialog } from "./ModelDialog";
import { clearKey, loadKey, saveKey, type KeyConfig } from "./storage";

const HELLO = `Hi, I'm the document assistant of Harborline Supply Co., a fictional lighting distributor. I can search ${DOCS.length} documents (contracts, regulations, salaries, price lists, catalogs, policies and reports) and I cite the exact passage behind every answer. Click a citation to open it.`;

export function App() {
  const [tab, setTab] = useState<"chat" | "library">("chat");
  const [open, setOpen] = useState<OpenDoc | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([{ id: 0, role: "agent", text: HELLO }]);
  const [busy, setBusy] = useState(false);
  const [dialog, setDialog] = useState(false);
  const initial = useRef(loadKey());
  const [keyCfg, setKeyCfg] = useState<KeyConfig | null>(initial.current.config);
  const [remembered, setRemembered] = useState(initial.current.remembered);
  const [account, setAccount] = useState(false);
  const [tier, setTier] = useState<Tier>("quick");
  const history = useRef<History>([]);
  const turns = useRef<ChatTurn[]>([]);
  const seq = useRef(1);
  useSyncExternalStore(subscribeLibrary, getVersion);
  const mode: "script" | "account" | "key" = account ? "account" : keyCfg ? "key" : "script";

  const [theme, setTheme] = useState<"light" | "dark">(() => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"));
  function toggleTheme() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch { /* storage blocked: the choice lasts for this page only */ }
    setTheme(next);
  }

  function openDoc(docId: string, section: string) {
    setOpen({ docId, section: section || undefined });
    setTab("library");
  }

  function resetMemory() {
    history.current = [];
    turns.current = [];
  }

  async function send(question: string) {
    if (busy) return;
    setBusy(true);
    setMsgs((m) => [...m, { id: seq.current++, role: "user", text: question }]);
    try {
      let turn: Turn;
      if (account) {
        const sample = await getSample();
        if (!sample) throw Object.assign(new Error("no sample"), { code: "capability_disabled" });
        turn = await runSampleTurn(question, turns.current, sample, tier);
      } else if (keyCfg) {
        const llm = new Anthropic({ apiKey: keyCfg.apiKey, dangerouslyAllowBrowser: true });
        turn = await runLlmTurn(question, history.current, llm, keyCfg.model);
      } else {
        turn = runScripted(question);
      }
      setMsgs((m) => [...m, { id: seq.current++, role: "agent", text: turn.reply, turn }]);
    } catch (err) {
      const why = account ? explainSampleError(err) : keyCfg ? explainError(err) : err instanceof Error ? err.message : String(err);
      setMsgs((m) => [...m, { id: seq.current++, role: "agent", text: `The assistant could not answer. ${why}` }]);
    }
    setBusy(false);
  }

  return (
    <div className="app">
      {dialog && (
        <ModelDialog
          keyConfig={keyCfg}
          remembered={remembered}
          accountActive={account}
          tier={tier}
          onUseAccount={(t) => { setTier(t); setAccount(true); resetMemory(); setDialog(false); }}
          onBackToScript={() => { setAccount(false); setKeyCfg(null); resetMemory(); setDialog(false); }}
          onSaveKey={(c, rem) => { saveKey(c, rem); setKeyCfg(c); setRemembered(rem); setAccount(false); resetMemory(); setDialog(false); }}
          onRemoveKey={() => { clearKey(); setKeyCfg(null); setRemembered(false); resetMemory(); setDialog(false); }}
          onClose={() => setDialog(false)}
        />
      )}
      <header>
        <div>
          <h1>Docs Agent</h1>
          <p className="muted">Harborline Supply Co., a fictional lighting distributor</p>
        </div>
        <div className="head-right">
          {mode === "account" ? <span className="badge live">Real model · your Claude account</span>
            : mode === "key" ? <span className="badge live">Real model · {keyCfg!.model} · your key</span>
            : <span className="badge" title="The search is real; the answer is the best matching passages, not a language model.">Scripted search</span>}
          <button className="toggle" onClick={() => setDialog(true)}>{mode === "script" ? "Use a real model" : "Model settings"}</button>
          <button className="toggle theme-btn" onClick={toggleTheme} aria-label={theme === "light" ? "Switch to dark theme" : "Switch to light theme"}>{theme === "light" ? "☾ Dark" : "☀ Light"}</button>
        </div>
      </header>
      <nav className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === "chat"} onClick={() => setTab("chat")}>Chat</button>
        <button role="tab" aria-selected={tab === "library"} onClick={() => setTab("library")}>Library <span className="count">{allDocs().length}</span></button>
      </nav>
      <div className="body">
        {tab === "chat" ? <Chat msgs={msgs} busy={busy} onSend={send} onOpen={openDoc} mode={mode} /> : <Library open={open} onOpen={setOpen} />}
      </div>
    </div>
  );
}
