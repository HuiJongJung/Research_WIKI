# Research MCP WIKI Tool Requirements

## Goal

Build a locally verifiable, lab-shared research WIKI system with an MCP server and GUI. It must help Codex and Claude Code read, preserve, connect, review, and reuse research knowledge through Git-managed Markdown artifacts.

## Users Or Consumers

- Lab researchers who freely read, edit, and review WIKI content.
- Codex and Claude Code clients that perform model-dependent research reasoning through MCP.
- Maintainers who run the server, rebuild the index, and recover changes through Git.

## Functional Requirements

### Canonical WIKI

- Store canonical WIKI pages as Markdown files with structured frontmatter.
- Record WIKI page language as `ko` or `en`; default to Korean.
- Manage Markdown revision history with Git.
- Support `source`, `concept`, `comparison`, `claim`, `question`, `system`, and `skill` page types.
- Record author, modification time, evidence source, and PDF page or section anchors where applicable.
- Mark AI-authored content as `status: draft`; allow researcher promotion to `status: reviewed`.

### Paper Ingestion

- Accept local PDF file paths only in the first milestone.
- Preserve original extracted PDF text and attach a requested reflection language.
- Default the reflection language to Korean and allow English as an option.
- Offer a text-extraction reading mode.
- Offer a screenshot-based integrated image-plus-text reading mode.
- Allow page-range selection for screenshot-based reading.
- Allow selected PDF screenshots to be published as Git-managed WIKI image attachments and embedded in Markdown source pages.
- Create or update `source` and `concept` pages as the baseline paper-ingestion workflow.
- Create or update `comparison` pages only when explicitly selected.
- Keep `claim` and `question` creation as separate user-driven workflows.

### MCP Server

- Implement the MCP server in Python using the official MCP Python SDK.
- Support local `stdio` and local-verification `Streamable HTTP` transports.
- Require a shared token for Streamable HTTP access.
- Expose MCP `resources`, `tools`, and `prompts`.
- Support WIKI read and write operations.
- Support Codex and Claude Code clients.

### MCP Resources

- Expose WIKI page content and metadata.
- Expose paper metadata and ingest status.
- Expose index views for page types, tags, status, and linked pages.

### MCP Tools

- Search the WIKI.
- Read, create, and edit Markdown WIKI pages.
- Ingest a local PDF using a selected reading mode and optional page range.
- Publish selected PDF screenshots as canonical WIKI image attachments with Markdown snippets.
- Rebuild the derived database index from Markdown files.
- Promote a page from `draft` to `reviewed`.
- Request optional comparison-page generation workflows.
- Create and maintain user-driven claim and question pages.
- Support client-driven claim-fitness and novelty-review workflows.

### MCP Prompts

- Provide reusable guided prompts for paper ingest and WIKI reflection.
- Provide guided prompts for claim refinement and fitness assessment.
- Provide guided prompts for novelty review.

### Model Execution Boundary

- Let connected Codex or Claude Code clients perform summarization, extraction, assessment, and novelty reasoning.
- Do not require the first-milestone server to call an LLM API.

### Derived Index

- Allow a database index for search and GUI performance.
- Make the index rebuildable from canonical Markdown files.
- Never treat the database as the source of truth.

### GUI

- Include a detailed local GUI in the first milestone.
- Show papers not yet ingested in red.
- Show papers reflected into `source` and `concept` pages in blue.
- Keep reflected papers blue and add a separate badge after optional comparison generation.
- Support WIKI search, page browsing, Markdown viewing and editing, ingest configuration, draft review, and index rebuild actions.
- Render canonical WIKI image attachments inline while browsing Markdown pages.
- Add an `MCP 상태` navigation view that lists current MCP resources, tools, and prompts.
- Allow maintainers to enable or disable individual MCP capabilities through a version-managed startup settings file.
- Apply capability changes on the next MCP server start without force-closing active client connections.

## Non-Functional Requirements

- Keep canonical knowledge human-readable and portable.
- Keep all first-milestone flows locally runnable.
- Preserve recoverability through Git history.
- Keep server operations deterministic where model reasoning is not required.
- Avoid server-side LLM credentials in the first milestone.
- Document planned and implemented MCP Tools separately in `README.md`.

## Out Of Scope

- External server deployment.
- DOI, arXiv URL, and web URL ingestion.
- Shared-folder watching and automatic ingestion.
- Per-user accounts and fine-grained authorization.
- Automatic backup beyond Git history.
- Server-side LLM API invocation.
