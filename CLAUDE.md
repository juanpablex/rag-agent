# Docs Agent: notes for Claude

- Reply to the owner in Spanish. Everything in the repo (code, UI text, documents, README) is in English.
- Hard rules: every document, company, role and figure is fictional; nothing from the owner's employer; never commit or log an API key.
- Honest labeling: the default mode is a scripted search, not a model. The real-model modes (API key / Claude account in an Artifact) must be labeled as such.
- Tools are read-only. Citations use `[doc:ID#SECTION]` and are verified against what was retrieved in the turn (`src/core/citations.ts`).
- When you add or edit documents: ids must match `^[a-z0-9-]+$`, section ids are numbers, and `npm test` must still find every question in the top 3 (add questions for new documents in `scripts/check.ts`).
- Effects must not return a value (`scrollIntoView` can return a Promise in some browsers): use block bodies.
- Before pushing: `npm run typecheck`, `npm test`, `npm run build`.
