import { useEffect, useState } from "react";
import { LIMITS, pagesToDoc, textToDoc } from "../core/ingest";
import { addUserDoc, allDocs, userDocs } from "../core/library";
import { pdfPages } from "../core/pdf";

/** Adds a document from a file (.txt, .md, or a PDF with text) or from pasted text. Nothing is uploaded anywhere. */
export function AddDocDialog({ onClose, onAdded }: { onClose: () => void; onAdded: (docId: string) => void }) {
  const [mode, setMode] = useState<"file" | "paste">("file");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const full = userDocs().length >= LIMITS.maxDocs;
  const taken = () => allDocs().map((d) => d.id);

  function finish(doc: ReturnType<typeof textToDoc>) {
    addUserDoc(doc);
    onAdded(doc.id);
    onClose();
  }

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    if (file.size > LIMITS.maxFileBytes) return setError(`That file is larger than ${LIMITS.maxFileBytes / 1024 / 1024} MB.`);
    const name = title.trim() || file.name.replace(/\.[^.]+$/, "");
    setBusy(true);
    try {
      if (/\.pdf$/i.test(file.name) || file.type === "application/pdf") finish(pagesToDoc(name, await pdfPages(await file.arrayBuffer()), taken()));
      else if (/\.(txt|md|markdown|csv)$/i.test(file.name) || file.type.startsWith("text/")) finish(textToDoc(name, await file.text(), taken()));
      else setError("Use a .txt, .md or .pdf file, or paste the text.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not read that file.");
    }
    setBusy(false);
  }

  function onPaste() {
    setError(null);
    try {
      finish(textToDoc(title.trim() || "Pasted text", text, taken()));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add that text.");
    }
  }

  return (
    <div className="dialog-back" role="dialog" aria-modal="true" aria-label="Add my document">
      <div className="dialog">
        <h2>Add my document</h2>
        <p className="note">
          The document stays in this browser tab: it is not uploaded to any server and it disappears when you reload the page. In the real-model mode, the passages the agent finds are sent to Claude, like any question. Do not add anything you cannot share.
        </p>
        <div className="tabs mini" role="tablist">
          <button role="tab" aria-selected={mode === "file"} onClick={() => setMode("file")}>Upload a file</button>
          <button role="tab" aria-selected={mode === "paste"} onClick={() => setMode("paste")}>Paste text</button>
        </div>
        <label>
          Title (optional)
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={mode === "file" ? "Defaults to the file name" : "Pasted text"} />
        </label>
        {mode === "file" ? (
          <label className="drop">
            <span>{busy ? "Reading the file..." : "Choose a .txt, .md or .pdf file"}</span>
            <span className="note">Up to {LIMITS.maxFileBytes / 1024 / 1024} MB. PDFs must contain text: scanned PDFs (images) are not supported.</span>
            <input type="file" accept=".txt,.md,.markdown,.csv,.pdf,text/plain,application/pdf" disabled={busy || full} onChange={(e) => void onFile(e.target.files?.[0])} />
          </label>
        ) : (
          <>
            <label>
              Text
              <textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste a policy, a contract, notes, a FAQ..." />
            </label>
            <div className="dialog-actions"><button className="primary" disabled={full || text.trim().length < LIMITS.minChars} onClick={onPaste}>Add document</button></div>
          </>
        )}
        {full && <p className="warn-note">You can add up to {LIMITS.maxDocs} documents. Remove one first.</p>}
        {error && <p className="warn-note" role="alert">{error}</p>}
        <div className="dialog-actions"><button type="button" onClick={onClose}>Close</button></div>
      </div>
    </div>
  );
}
