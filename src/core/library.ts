import { DOCS } from "./data";
import type { Doc } from "./types";

/**
 * The documents the agent can search: the built-in fictional ones plus whatever the visitor adds in this tab.
 * Added documents live only in memory: they are gone when the page is reloaded and are never uploaded anywhere.
 */
let user: Doc[] = [];
let version = 0;
const listeners = new Set<() => void>();

export const allDocs = (): Doc[] => (user.length ? [...DOCS, ...user] : DOCS);
export const docById = (id: string): Doc | undefined => allDocs().find((d) => d.id === id);
export const userDocs = (): Doc[] => user;
export const getVersion = (): number => version;

function changed() {
  version += 1;
  listeners.forEach((l) => l());
}

export function addUserDoc(doc: Doc): void {
  user = [...user, doc];
  changed();
}

export function removeUserDoc(id: string): void {
  user = user.filter((d) => d.id !== id);
  changed();
}

export function clearUserDocs(): void {
  user = [];
  changed();
}

export function subscribeLibrary(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}
