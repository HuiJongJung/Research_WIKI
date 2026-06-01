# Research MCP WIKI Tool Clarifications

Resolve every `blocking` item before writing `specs/requirements.md`.

## Open Questions

| # | Question | Status | Resolution | Source |
|---|---|---|---|---|
| Q1 | What is the primary job of the first usable version: shared research memory, research workflow tools, or a balanced combination? | resolved | Build a workflow-integrated shared research WIKI: extract paper PDFs, organize knowledge by topic, extract reusable ideas and claims, assess claim fitness, and validate novelty for suitable claims. | User response, Round 1 |
| Q2 | Who may read, contribute, curate, and administer content in the first version? | resolved | All lab members may freely read, contribute, and edit shared content. Operational administration remains part of Q10. | User response, Round 1 |
| Q3 | When a member adds one paper PDF, which durable WIKI pages should the first version create or update: only a paper source page; source plus topic/concept pages; or source plus topic/concept, comparison, and claim-candidate pages? Should claim candidates require human confirmation before becoming shared claims? | resolved | Persist `source` and `concept` pages by default. Generate or update `comparison` pages only when the user selects the option. Do not treat `claim` and `question` pages as automatic outputs of a single-paper ingest; they require additional user input and a separate workflow. | User response, Round 1 follow-up |
| Q4 | What should be the canonical storage model: Markdown files in Git, a database, or a hybrid? | resolved | Keep Markdown files in Git as the canonical WIKI store and revision history. Allow a derived database index for search and GUI performance. The index must be rebuildable from canonical files. | User response, Round 2 follow-up |
| Q5 | How should knowledge enter the system: manual authoring, MCP tools, paper ingestion, repository ingestion, web capture, or selected combinations? | resolved | Support local PDF files as the paper-ingestion entry point in the first version. Do not require DOI, arXiv URL, web URL, or shared-folder ingestion. | User response, Round 2 follow-up |
| Q6 | What provenance and review rules are required before shared knowledge is treated as trusted? | resolved | Retain Git history with author and modification time, record PDF paths and page or section evidence in Markdown, label AI-generated content as `status: draft`, allow promotion to `status: reviewed` after researcher confirmation, permit open editing, and recover through Git when needed. | User response, Round 2 final |
| Q7 | Which MCP capabilities define the MVP beyond search and retrieval? | resolved | Expose all three MCP primitives: `resources`, `tools`, and `prompts`. The MCP surface must support both reading and writing. Resources provide WIKI and paper views; tools cover search, local PDF ingest, editing, review, optional comparison, claim and question management, claim-fitness assessment, and novelty review; prompts provide reusable guided workflows. | User response, Round 3 |
| Q8 | Which MCP clients and AI-agent environments must the first version support? | resolved | Support both Codex and Claude Code. | User response, Round 3 |
| Q9 | Should the system expose only WIKI operations, or also extensible research tools such as literature comparison, novelty analysis, and experiment-context handoff? | resolved | Expose extensible research tools. Required examples include PDF extraction and organization, reusable idea extraction, claim creation, claim-fitness checks, and novelty validation. | User response, Round 1 |
| Q10 | Where will the shared service run, and what authentication, authorization, backup, and recovery constraints apply? | resolved | Validate local execution in the first milestone, require shared-token authentication for Streamable HTTP, and use Git history for recovery. Do not require a separate automatic backup mechanism in the first milestone. | User response, Round 4 final |
| Q11 | What is explicitly outside the MVP so that the first implementation remains small enough to validate? | resolved | Exclude external server deployment, DOI or arXiv URL ingest, shared-folder watching, per-user accounts and fine-grained authorization, and automatic backup beyond Git. Include a reasonably detailed research-workflow GUI; advanced GUI features may be prioritized when they support the core workflow. | User response, Round 4 final |
| Q12 | Which implementation stack constraints or preferences should guide architecture choices? | resolved | Use Python and the official MCP Python SDK. | User response, Round 4 |
| Q13 | If a GUI is implemented, what exact paper-list status transition should the colors represent? The current interpretation is red for unread or not-yet-ingested papers and blue once `source` and `concept` processing is reflected. Does optional `comparison` processing need a separate visual state? | resolved | Use red for papers not yet ingested, blue after `source` and `concept` reflection, and retain blue with a separate badge after optional `comparison` generation. | User response, Round 4 final |
| Q14 | Which PDF reading modes must paper ingestion expose? | resolved | Let the user choose between a text-extraction mode and a screenshot-based integrated image-plus-text reading mode. | User response, Round 2 |
| Q15 | For screenshot-based image-plus-text reading, should the system render and inspect every PDF page or let the user select page ranges, with full-document processing as an option? | resolved | Support user-selected page ranges in screenshot-based reading mode. | User response, Round 2 follow-up |
| Q16 | Is an MCP server implementation itself a required project deliverable? | resolved | Yes. Implement the MCP server as a core project deliverable, not as a future integration note. | User response, Round 3 opening |
| Q17 | Which MCP transports should the first version support: shared Streamable HTTP, local stdio, or both? | resolved | Support both shared `Streamable HTTP` and local `stdio`. | User response, Round 3 final |
| Q18 | Which project documents are required deliverables before implementation work is considered ready? | resolved | Produce an implementation-ready PRD or project-goal specification and a `README.md`. The README must explain the project, enumerate the MCP Tools used or planned, explain how they work, and include project execution instructions. | User response, documentation deliverables |
| Q19 | Must the MCP surface support both WIKI reads and writes? | resolved | Yes. Read and write operations are both required. | User response, Round 3 |
| Q20 | Who performs model-dependent work such as PDF summarization, concept extraction, claim-fitness assessment, and novelty review: the connected Codex or Claude Code client, an LLM API called by the MCP server, or both? | resolved | Connected Codex or Claude Code clients perform model-dependent reasoning through MCP resources, tools, and prompts. The first-milestone MCP server does not call an LLM API itself. | User response, architecture follow-up |
| Q21 | Which language should research extraction and WIKI reflection use? | resolved | Use Korean as the default output language and allow English as an explicit option. Preserve original PDF text; the selected language guides client-side summaries and WIKI reflection. | User response, PDF implementation follow-up |

**Status values:** `blocking` — must resolve before requirements. `deferred` — allowed with a written reason. `resolved` — complete.

## Resolution Log

<!-- Append resolved items here as they are closed. -->
<!-- Format: YYYY-MM-DD  Q<n> resolved: <answer> — <source> -->

- 2026-06-01 Q1 resolved: Build a workflow-integrated shared research WIKI with paper ingestion, topic organization, reusable idea and claim extraction, claim-fitness checks, and novelty validation. — User response, Round 1
- 2026-06-01 Q2 resolved: All lab members may freely read, contribute, and edit shared content; service administration is handled separately in Q10. — User response, Round 1
- 2026-06-01 Q9 resolved: The MCP surface must include extensible research workflow tools, not WIKI CRUD alone. — User response, Round 1
- 2026-06-01 Q3 resolved: Persist `source` and `concept` pages by default for each ingested paper; create or update `comparison` pages only when selected by the user; route `claim` and `question` pages through separate user-driven workflows. — User response, Round 1 follow-up
- 2026-06-01 Q14 resolved: Expose two user-selectable PDF reading modes: text extraction and screenshot-based integrated image-plus-text reading. — User response, Round 2
- 2026-06-01 Q4 resolved: Keep Markdown files in Git as canonical WIKI artifacts and revision history; permit a rebuildable derived database index for search and GUI performance. — User response, Round 2 follow-up
- 2026-06-01 Q5 resolved: Support local PDF files as the first-version paper-ingestion entry point. — User response, Round 2 follow-up
- 2026-06-01 Q15 resolved: Support user-selected page ranges in screenshot-based PDF reading mode. — User response, Round 2 follow-up
- 2026-06-01 Q6 resolved: Preserve author, timestamp, PDF evidence anchors, `draft` and `reviewed` states, open editing, and Git recovery. — User response, Round 2 final
- 2026-06-01 Q16 resolved: Implement the MCP server as a core project deliverable. — User response, Round 3 opening
- 2026-06-01 Q18 resolved: Produce an implementation-ready PRD or goal specification and a README covering project purpose, MCP Tool behavior, and execution instructions. — User response, documentation deliverables
- 2026-06-01 Q7 resolved: Expose `resources`, `tools`, and `prompts`; include both read and write operations and the agreed research workflows. — User response, Round 3
- 2026-06-01 Q8 resolved: Support Codex and Claude Code. — User response, Round 3
- 2026-06-01 Q19 resolved: MCP must support WIKI reads and writes. — User response, Round 3
- 2026-06-01 Q17 resolved: Support shared `Streamable HTTP` and local `stdio`. — User response, Round 3 final
- 2026-06-01 Q12 resolved: Use Python and the official MCP Python SDK. — User response, Round 4
- 2026-06-01 Q10 resolved: Validate locally, require shared-token Streamable HTTP authentication, use Git recovery, and omit separate automatic backup in the first milestone. — User response, Round 4 final
- 2026-06-01 Q11 resolved: Exclude external deployment, remote URL ingest, shared-folder watching, per-user accounts, fine-grained authorization, and non-Git automatic backup; include a detailed workflow GUI. — User response, Round 4 final
- 2026-06-01 Q13 resolved: GUI paper status is red before ingest, blue after source and concept reflection, and blue with a separate badge after optional comparison generation. — User response, Round 4 final
- 2026-06-01 Q20 resolved: Connected Codex or Claude Code clients perform model-dependent work through MCP. The first-milestone server does not invoke an LLM API. — User response, architecture follow-up
- 2026-06-01 Q21 resolved: Use Korean by default and allow English as an option for client-side summaries and WIKI reflection while preserving original PDF text. — User response, PDF implementation follow-up
