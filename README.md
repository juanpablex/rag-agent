# Docs Agent

An AI agent that answers questions about company documents and **cites the exact passage** behind each answer. Click a citation and the document opens at that passage, highlighted.

**Try it:** https://juanpablex.github.io/rag-agent/

All content is fictional: the company (Harborline Supply Co., a lighting distributor), its 25 documents, the figures and the roles are invented for this project.

## What is in it

- **Chat** with citations. Every fact is followed by a chip such as `Remote Work Policy §2`.
- **Library** of 25 documents in 7 categories: contracts, regulations, salaries, price lists, catalogs, policies and reports. Search, filter by category and read each document.
- **Citation check.** The agent must cite with `[doc:ID#SECTION]`. The app verifies each citation against what the agent actually retrieved in that turn. A made-up document shows "unknown source", and a real section the agent never retrieved shows a warning.

## What is real and what is not

| Part | Status |
|---|---|
| Search (BM25 over document sections, in the browser) | **Real.** Tested with 18 questions that must find their section in the top 3. |
| Tools (`search_documents`, `read_section`, `get_document_outline`, `list_documents`) | **Real, read-only.** No tool can change a document. |
| Default mode ("Scripted search") | **Not a model.** It runs the same search and shows the best matching passages with citations. |
| Real-model mode (optional) | **Real, two ways.** Inside a Claude Artifact copy: **your own Claude account** (no key; usage counts against your plan; tokens are not reported). On the Pages site: **your own API key**, called straight from your browser. |

## Your API key

Optional, and only for the real-model mode on the Pages site. There is no server: requests go from your browser to the Anthropic API and are billed to your account. The key stays in sessionStorage (forgotten when the tab closes) unless you choose to remember it. Use a key with a low spending limit.

## Run it

```bash
npm install
npm run dev
npm run typecheck
npm test                          # data, retrieval, citations and both model loops, with fakes (no key, no network)
npm run build                     # static build in dist/
VITE_BASE=./ npm run build        # build for a claude.ai Artifact (relative paths)
```

## Layout

- `src/core/data`: the fictional documents. `search.ts`, `tools.ts`, `citations.ts`: retrieval, tools and the citation check.
- `src/core/agent.ts` (scripted), `llm.ts` (API key), `sample.ts` (Claude account in an Artifact).
- `src/web`: the interface.

## License

MIT
