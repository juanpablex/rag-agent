import type Anthropic from "@anthropic-ai/sdk";
import { makeRunner, SYSTEM, type Retrieved, type Step, type Turn } from "./agent";
import { TOOLS } from "./tools";

/** Real-model mode with the visitor's own API key, called straight from the browser. */
export const MODELS = [
  { id: "claude-haiku-4-5-20251001", label: "Claude Haiku 4.5 (cheapest)" },
  { id: "claude-sonnet-5-5", label: "Claude Sonnet 5.5" },
  { id: "claude-opus-5-5", label: "Claude Opus 5.5 (most capable, costs more)" },
] as const;
export const DEFAULT_MODEL: string = MODELS[0].id;

/** The subset of the SDK the loop needs, so tests can pass a fake. */
export interface LlmClient {
  messages: { create(params: Anthropic.MessageCreateParamsNonStreaming): Promise<Anthropic.Message> };
}

export type History = Anthropic.MessageParam[];

const TOOL_PARAMS: Anthropic.Tool[] = TOOLS.map((t) => ({ name: t.name, description: t.description, input_schema: t.input_schema as Anthropic.Tool.InputSchema }));
const MAX_ITERATIONS = 8;

export function explainError(err: unknown): string {
  const status = (err as { status?: number })?.status;
  if (status === 401) return "The API key was rejected. Check that you pasted the whole key.";
  if (status === 403) return "This key is not allowed to use that model.";
  if (status === 404) return "That model was not found for this key. Pick another one.";
  if (status === 429) return "Rate limit reached. Wait a moment and try again.";
  if (status === 400 && /credit|balance/i.test(String((err as Error).message))) return "The account behind this key has no API credit left.";
  if (status === 529 || (status !== undefined && status >= 500)) return "The API is overloaded or unavailable. Try again shortly.";
  if (status === undefined) return `Could not reach the API (${String((err as Error)?.message ?? err).slice(0, 100)}). Check your connection.`;
  return `The API returned an error (${status}).`;
}

export async function runLlmTurn(question: string, history: History, llm: LlmClient, model: string): Promise<Turn> {
  const steps: Step[] = [];
  const retrieved: Retrieved[] = [];
  const run = makeRunner(steps, retrieved);
  const usage = { model, calls: 0, inputTokens: 0, outputTokens: 0 };
  const rollbackTo = history.length;
  let reply = "";
  history.push({ role: "user", content: question });
  try {
    for (let i = 0; i < MAX_ITERATIONS; i++) {
      const res = await llm.messages.create({ model, max_tokens: 2048, system: SYSTEM, tools: TOOL_PARAMS, messages: history });
      usage.calls += 1;
      usage.inputTokens += res.usage.input_tokens;
      usage.outputTokens += res.usage.output_tokens;
      history.push({ role: "assistant", content: res.content });
      const text = res.content.flatMap((b) => (b.type === "text" ? [b.text] : [])).join("\n").trim();
      if (res.stop_reason === "refusal") { reply = "The model declined to answer that request."; break; }
      if (res.stop_reason === "max_tokens") { reply = text || "The answer was cut off. Try a more specific question."; break; }
      if (res.stop_reason !== "tool_use") { reply = text || "I have no answer for that."; break; }
      const results: Anthropic.ToolResultBlockParam[] = [];
      for (const block of res.content) {
        if (block.type !== "tool_use") continue;
        try {
          results.push({ type: "tool_result", tool_use_id: block.id, content: JSON.stringify(run(block.name, (block.input ?? {}) as Record<string, unknown>)) });
        } catch (err) {
          results.push({ type: "tool_result", tool_use_id: block.id, content: err instanceof Error ? err.message : String(err), is_error: true });
        }
      }
      history.push({ role: "user", content: results });
      if (i === MAX_ITERATIONS - 1) reply = "I stopped after too many searches. Try a simpler question.";
    }
  } catch (err) {
    history.length = rollbackTo;
    throw err;
  }
  return { reply, steps, retrieved, usage };
}
