# Research MCP WIKI Tool Contract

## Purpose

Provide a locally verifiable MCP-based research WIKI for shared lab use.

## Inputs

- Local PDF paths.
- Optional PDF page ranges.
- User-authored Markdown edits.
- Client-authored WIKI reflections from Codex or Claude Code.
- Shared HTTP token from configuration.

## Outputs

- Git-managed Markdown WIKI pages.
- Rebuildable database index.
- MCP resources, tools, and prompts.
- Local GUI views and actions.

## Invariants

- Markdown files are canonical.
- The database index is derived and rebuildable.
- The server does not invoke an LLM API in the first milestone.
- AI-authored content begins as `status: draft`.
- `comparison` reflection is optional.
- `claim` and `question` workflows require user input.
- Git history is the first-milestone recovery mechanism.

## Interfaces

- MCP `stdio`.
- MCP `Streamable HTTP` with shared-token authentication.
- Local GUI.
- Git-managed Markdown files.

## Gates

- [x] brief
- [x] clarify
- [x] spec-closed
- [x] structure
- [x] preflight
- [x] task
- [x] project-check
- [x] report

## Non-Goals

- External deployment.
- Remote URL ingestion.
- Shared-folder watching.
- Per-user permissions.
- Automatic backup beyond Git.
- Server-side LLM API invocation.

## Failure Modes

- Invalid PDF path or page range.
- PDF backend unavailable.
- Invalid shared token.
- Malformed Markdown frontmatter.
- Index drift or corruption; recover by rebuilding from Markdown.
- Git command failure or uncommitted conflicting edits.
- MCP client compatibility failure.
