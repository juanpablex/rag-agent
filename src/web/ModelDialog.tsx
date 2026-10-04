import { useEffect, useState } from "react";
import { MODELS, DEFAULT_MODEL } from "../core/llm";
import { getSample, TIERS, type Tier } from "../core/sample";
import type { KeyConfig } from "./storage";

export function ModelDialog({ keyConfig, remembered, accountActive, tier: initialTier, onUseAccount, onBackToScript, onSaveKey, onRemoveKey, onClose }: {
  keyConfig: KeyConfig | null;
  remembered: boolean;
  accountActive: boolean;
  tier: Tier;
  onUseAccount: (tier: Tier) => void;
  onBackToScript: () => void;
  onSaveKey: (c: KeyConfig, remember: boolean) => void;
  onRemoveKey: () => void;
  onClose: () => void;
}) {
  const [accountOk, setAccountOk] = useState<boolean | null>(null);
  const [tier, setTier] = useState<Tier>(initialTier);
  const [key, setKey] = useState(keyConfig?.apiKey ?? "");
  const [model, setModel] = useState(keyConfig?.model ?? DEFAULT_MODEL);
  const [remember, setRemember] = useState(remembered);
  const valid = key.trim().startsWith("sk-ant-") && key.trim().length > 20;

  useEffect(() => {
    getSample().then((s) => setAccountOk(!!s));
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="dialog-back" role="dialog" aria-modal="true" aria-label="Use a real model">
      <div className="dialog">
        <h2>Use a real model</h2>
        <p>Optional. A Claude model decides what to search, reads the documents through read-only tools and answers with citations. It cannot change any document.</p>

        {accountOk && (
          <section className="option">
            <h3>Use my Claude account</h3>
            <p className="note">No API key needed. Claude answers through your own Claude account and the usage counts against your plan. You will be asked to allow it the first time. Answers can take 30 to 90 seconds.</p>
            <label>
              Speed
              <select value={tier} onChange={(e) => setTier(e.target.value as Tier)}>
                {TIERS.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            </label>
            <div className="dialog-actions">
              {accountActive && <button type="button" onClick={onBackToScript}>Back to the scripted search</button>}
              <button type="button" className="primary" onClick={() => onUseAccount(tier)}>{accountActive ? "Keep using my account" : "Use my Claude account"}</button>
            </div>
          </section>
        )}

        {accountOk === false && (
          <form className="option" onSubmit={(e) => { e.preventDefault(); if (valid) onSaveKey({ apiKey: key.trim(), model }, remember); }}>
            <h3>Use my own API key</h3>
            <p className="note">Requests go <strong>straight from your browser to the Anthropic API</strong> with <strong>your own key</strong>, billed to your account. This site has no server and never sees the key.</p>
            <label>
              Anthropic API key
              <input type="password" autoComplete="off" spellCheck={false} value={key} onChange={(e) => setKey(e.target.value)} placeholder="sk-ant-..." />
            </label>
            <label>
              Model
              <select value={model} onChange={(e) => setModel(e.target.value)}>
                {MODELS.map((m) => <option key={m.id} value={m.id}>{m.label}</option>)}
              </select>
            </label>
            <label className="check">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              Remember the key on this device (otherwise it is forgotten when you close the tab)
            </label>
            <p className="note">Use a key with a low spending limit, and only on a device you trust.</p>
            <div className="dialog-actions">
              {keyConfig && <button type="button" onClick={onRemoveKey}>Remove key</button>}
              <button className="primary" disabled={!valid}>Save and use</button>
            </div>
          </form>
        )}

        <div className="dialog-actions">
          {(accountActive || keyConfig) && !accountOk && <button type="button" onClick={onBackToScript}>Back to the scripted search</button>}
          <button type="button" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
