# Research MCP WIKI Tool Procedure

## Preconditions

- Read `AGENTS.md`, `TASK.md`, and the last lines of `journal.md`.
- Confirm `specs/plan-closed.md` exists before production-code edits.
- Select exactly one topmost unfinished implementation task.

## Setup

1. Verify Python and Git.
2. Create or activate the project environment after implementation planning closes.
3. Install only dependencies approved by the project spec.
4. Keep local secrets such as the shared HTTP token outside Git.

## Inspect

- Read related requirements, PRD sections, code, and tests.
- Check for existing user edits before changing files.
- Inspect canonical Markdown before rebuilding or debugging the derived index.

## Edit

- Keep Markdown canonical and database state derived.
- Preserve WIKI frontmatter and provenance fields.
- Keep AI-authored pages in `draft` until reviewed.
- Implement only one selected task per loop.

## Validate

- Run the smallest focused check first.
- Run the relevant MCP, index, or GUI smoke test.
- Run broader validation before marking a task complete.

## Report

- Mark the selected `TASK.md` item complete only after validation.
- Append a concise result to `journal.md`.
- Report commands run and any residual risk.

## Recovery

- Stop after three failed attempts with the same approach.
- Rebuild the database index from Markdown if index state drifts.
- Use Git history to inspect or recover WIKI edits.
