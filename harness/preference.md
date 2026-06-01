# Research MCP WIKI Tool Preference

## Code Locality

- Keep MCP protocol handling, WIKI storage, PDF extraction, indexing, Git integration, and GUI code in distinct modules.
- Keep model-dependent reasoning in Codex or Claude Code clients for the first milestone.

## Dependencies

- Prefer Python and the official MCP Python SDK.
- Add dependencies only when they serve a defined requirement.
- Keep the derived index simple and rebuildable.

## Reproducibility

- Store canonical WIKI content in Git-managed Markdown.
- Keep shared-token configuration outside Git.
- Document environment setup and commands in `README.md`.

## Validation Order

- Structure and schema checks.
- Unit tests.
- Index rebuild tests.
- MCP stdio smoke test.
- MCP Streamable HTTP authentication smoke test.
- GUI smoke test.

## Style

- Prefer explicit schemas and typed boundaries.
- Keep user-facing terminology aligned with `source`, `concept`, `comparison`, `claim`, and `question`.
- Distinguish planned features from implemented features in documentation.
