import { makeRunner, SYSTEM, type Retrieved, type Step, type Turn } from "./agent";
import { TOOLS } from "./tools";

/**
 * Real-model mode for the claude.ai Artifact: the page asks Claude through the viewer's own Claude account
 * (the `sample` capability), so there is no API key and the viewer's own usage pays. Same read-only tools.
 * Outside an Artifact `window.claude` does not exist and this mode is unavailable.
 */
export type Tier = "quick" | "default" | "complex";
export const TIERS: { id: Tier; label: string }[] = [
  { id: "quick", label: "Quick (fastest)" },
  { id: "default", label: "Balanced" },
  { id: "complex", label: "Thorough (slowest)" },
];

export interface SampleTool {
  name: string;
  description: string;
  inputSchema?: Record<string, unknown>;
  execute(input: Record<string, unknown>): unknown;
}
export type ChatTurn = { role: "user" | "assistant"; content: string };
export interface SampleFn {
  (input: string | ChatTurn[], options?: { tools?: SampleTool[]; modelTier?: Tier; cache?: boolean }): Promise<{ text: string; truncated: boolean }>;
  limits?: () => Promise<{ tools?: { maxCount: number } }>;
}

let cached: Promise<SampleFn | null> | undefined;

export function getSample(): Promise<SampleFn | null> {
  cached ??= (async () => {
    const c = (globalThis as unknown as { claude?: { use?: (name: string) => Promise<unknown> } }).claude;
    if (!c?.use) return null;
    try {
      return ((await c.use("sample")) as SampleFn | null) ?? null;
    } catch {
      return null;
    }
  })();
  return cached;
}

export function explainSampleError(err: unknown): string {
  const code = (err as { code?: string })?.code;
  switch (code) {
    case "not_granted": return "Claude was not allowed for this page. Allow it when the permission window appears to use the real model.";
    case "sampling_disabled": return "Claude is not available for this account or organization.";
    case "session_expired": return "Your Claude session expired. Sign in again and retry.";
    case "rate_limited": return "Claude usage limit reached. Wait a while and try again.";
    case "refused": return "The model declined to answer that request.";
    case "empty_completion": return "The model gave no answer. Try asking in a different way.";
    case "tools_unavailable": return "This viewer cannot run the page's tools, so the real model cannot read the documents here.";
    case "prompt_too_large": return "The conversation got too long. Reload the page to start again.";
    default: return `Claude could not answer (${code ?? "unknown error"}). Try again.`;
  }
}

const MAX_TURNS = 8;

export async function runSampleTurn(question: string, turns: ChatTurn[], sample: SampleFn, tier: Tier): Promise<Turn> {
  const limits = await sample.limits?.().catch(() => undefined);
  if (!limits?.tools) throw Object.assign(new Error("tools unavailable"), { code: "tools_unavailable" });
  const steps: Step[] = [];
  const retrieved: Retrieved[] = [];
  const run = makeRunner(steps, retrieved);
  const tools: SampleTool[] = TOOLS.slice(0, limits.tools.maxCount).map((t) => ({
    name: t.name,
    description: t.description,
    inputSchema: t.input_schema as Record<string, unknown>,
    execute: (input) => run(t.name, input),
  }));
  const user: ChatTurn = { role: "user", content: question };
  const next: ChatTurn[] = [...turns, user].slice(-MAX_TURNS);
  const { text } = await sample([{ role: "user", content: SYSTEM }, ...next], { tools, modelTier: tier, cache: false });
  turns.splice(0, turns.length, ...next, { role: "assistant", content: text });
  return { reply: text, steps, retrieved };
}
