/**
 * The visitor's own API key, kept only in this browser: sessionStorage by default (forgotten when the tab
 * closes), localStorage if they ask to remember it. Nothing here is sent anywhere except to the Anthropic API.
 */
import { DEFAULT_MODEL } from "../core/llm";

const KEY = "docs-agent.apiKey";
const MODEL = "docs-agent.model";

export interface KeyConfig {
  apiKey: string;
  model: string;
}

export function loadKey(): { config: KeyConfig | null; remembered: boolean } {
  try {
    const remembered = localStorage.getItem(KEY);
    const apiKey = remembered ?? sessionStorage.getItem(KEY);
    return { config: apiKey ? { apiKey, model: localStorage.getItem(MODEL) ?? DEFAULT_MODEL } : null, remembered: !!remembered };
  } catch {
    return { config: null, remembered: false };
  }
}

export function saveKey(c: KeyConfig, remember: boolean): void {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    (remember ? localStorage : sessionStorage).setItem(KEY, c.apiKey);
    localStorage.setItem(MODEL, c.model);
  } catch { /* storage blocked: nothing is kept */ }
}

export function clearKey(): void {
  try {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
  } catch { /* nothing to clear */ }
}
