import { useEffect, useMemo, useRef, useState } from "react";
import { DOCS, docById } from "../core/data";
import { search } from "../core/search";
import { CATEGORIES, type Category } from "../core/types";

export interface OpenDoc {
  docId: string;
  section?: string;
}

const CATEGORY_ICON: Record<Category, string> = { Contracts: "📑", Regulations: "⚖️", Salaries: "💼", "Price lists": "🏷️", Catalogs: "📒", Policies: "📋", Reports: "📊" };

function Viewer({ open, onClose }: { open: OpenDoc; onClose: () => void }) {
  const doc = docById(open.docId)!;
  const target = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // A block body on purpose: an effect must return nothing or a cleanup function, and some browsers and
    // extensions make scrollIntoView return a value, which React would then try to call as a cleanup.
    target.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [open.docId, open.section]);

  return (
    <article className="viewer">
      <button className="back" onClick={onClose}>← All documents</button>
      <header>
        <span className="pill-cat">{CATEGORY_ICON[doc.category]} {doc.category}</span>
        <h2>{doc.title}</h2>
        <p className="muted">Version {doc.version} · {doc.date} · Owner: {doc.owner}</p>
      </header>
      {doc.sections.map((s) => (
        <section key={s.id} id={`sec-${s.id}`} className={s.id === open.section ? "sec hl" : "sec"} ref={s.id === open.section ? target : undefined}>
          <h3><span className="sec-no">§{s.id}</span> {s.title}</h3>
          {s.text.map((p, i) => <p key={i}>{p}</p>)}
        </section>
      ))}
    </article>
  );
}

export function Library({ open, onOpen }: { open: OpenDoc | null; onOpen: (o: OpenDoc | null) => void }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");
  const hits = useMemo(() => (query.trim() ? search(query, { category: cat === "All" ? undefined : cat, limit: 8 }) : []), [query, cat]);
  const docs = DOCS.filter((d) => cat === "All" || d.category === cat);

  if (open) return <Viewer open={open} onClose={() => onOpen(null)} />;
  return (
    <div className="library">
      <input className="lib-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search all documents..." aria-label="Search documents" />
      <div className="chips">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button key={c} className={c === cat ? "chip on" : "chip"} onClick={() => setCat(c)} aria-pressed={c === cat}>{c === "All" ? "All" : `${CATEGORY_ICON[c]} ${c}`}</button>
        ))}
      </div>
      {query.trim() ? (
        hits.length === 0 ? <p className="muted">No section matches those words.</p> : (
          <ul className="cards">
            {hits.map((h) => (
              <li key={`${h.docId}#${h.sectionId}`}>
                <button className="card" onClick={() => onOpen({ docId: h.docId, section: h.sectionId })}>
                  <strong>{h.docTitle}</strong>
                  <span className="muted">§{h.sectionId} {h.sectionTitle} · {h.category}</span>
                  <span className="snippet">{h.text.length > 170 ? h.text.slice(0, 170).replace(/\s+\S*$/, "") + "..." : h.text}</span>
                </button>
              </li>
            ))}
          </ul>
        )
      ) : (
        <ul className="cards">
          {docs.map((d) => (
            <li key={d.id}>
              <button className="card" onClick={() => onOpen({ docId: d.id })}>
                <strong>{CATEGORY_ICON[d.category]} {d.title}</strong>
                <span className="muted">{d.category} · v{d.version} · {d.date}</span>
                <span className="snippet">{d.sections.map((s) => s.title).join(" · ")}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
