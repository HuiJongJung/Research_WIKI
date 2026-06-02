# Research MCP WIKI Tool Decisions

Record decisions in chronological order.

## 2026-06-01 - Initialized

- Decision: Harness scaffold created.
- Reason: Make agent work repeatable and auditable.

## 2026-06-01 - Planning Before Implementation

- Decision: Complete explicit decision rounds before writing requirements or production code.
- Reason: The tool is shared research infrastructure, so scope, governance, and operating assumptions must be visible and reviewable.

## 2026-06-01 - Domain Direction

- Decision: The product direction is a lab-wide MCP-based WIKI Tool whose domain is helping research itself.
- Reason: This is the initiating product intent supplied by the user. The exact MVP remains open for discussion.

## 2026-06-01 - Workflow-Integrated Research WIKI

- Decision: Treat the WIKI as a research knowledge pipeline, not only as a document repository.
- Reason: Required capabilities include PDF extraction, structured paper summaries, topic-separated WIKI pages, reusable core-idea extraction, claim creation, claim-fitness checks, and novelty validation.
- Reference: `C:\Users\thffh\Desktop\MonteCarlo-research-WIKI\codex-skills`.

## 2026-06-01 - Open Collaborative Editing

- Decision: Allow every lab member to read, contribute, and edit shared WIKI content.
- Reason: The user selected a lab-wide freely editable collaboration model. Operational administration and recovery policy remain open.

## 2026-06-01 - Reference Artifact Model

- Decision: Use the existing MonteCarlo research WIKI skills and page schema as the starting reference model during planning.
- Reason: The reference already distinguishes `source`, `concept`, `comparison`, `claim`, `question`, `system`, and `skill` pages and separates paper statements from interpretation.

## 2026-06-01 - Paper Ingestion Outputs

- Decision: Persist `source` and `concept` pages by default when ingesting a paper PDF.
- Decision: Generate or update `comparison` pages only when the user selects that option.
- Reason: Paper understanding and reusable idea extraction are baseline ingest behavior, while cross-paper synthesis is an intentional additional operation.

## 2026-06-01 - User-Driven Research Objects

- Decision: Do not model `claim` and `question` pages as automatic outputs of a single-paper ingest.
- Reason: Claims and research questions require additional user context and should begin through separate workflows.

## 2026-06-01 - GUI Paper Status Direction

- Decision: Preserve a GUI direction where paper-list colors communicate reading or WIKI-processing status.
- Provisional interpretation: red means unread or not yet ingested; blue means the WIKI reflects the paper through baseline `source` and `concept` processing.
- Resolution: optional `comparison` processing keeps the blue state and adds a separate badge.

## 2026-06-01 - Markdown WIKI Artifacts

- Decision: Store WIKI knowledge artifacts generally as Markdown files.
- Reason: The shared knowledge should remain inspectable, editable, and portable.
- Decision: Manage canonical Markdown artifacts and their revision history with Git.
- Decision: Permit a derived database index for search and GUI performance.
- Invariant: The database index must be rebuildable from canonical WIKI files.

## 2026-06-01 - User-Selectable PDF Reading Modes

- Decision: Expose separate PDF reading modes selected by the user.
- Mode: text extraction for text-oriented reading.
- Mode: screenshot-based integrated image-plus-text reading when layout, figures, tables, equations, or visual context matter.
- Decision: Let the user select page ranges in screenshot-based reading mode.

## 2026-06-01 - Local PDF Input For First Version

- Decision: Accept local PDF files as the first-version paper-ingestion input.
- Reason: Keep the initial ingestion boundary narrow. DOI, arXiv URL, web URL, and shared-folder ingestion are not required for the first version.

## 2026-06-01 - Provenance And Review States

- Decision: Retain Git history with author and modification time for WIKI edits.
- Decision: Store PDF file paths and page or section evidence anchors in Markdown.
- Decision: Mark AI-generated WIKI content as `status: draft` and allow researcher confirmation to promote it to `status: reviewed`.
- Decision: Permit open editing and use Git recovery when an edit must be reverted.
- Reason: Shared editing needs visible provenance and a lightweight trust signal without blocking collaboration.

## 2026-06-01 - MCP Server Is A Required Deliverable

- Decision: Implement an MCP server as a core product deliverable.
- Reason: The project must expose the research WIKI and research workflows through MCP, not only define Markdown conventions or portable skills.
- Planning note: Official MCP SDK documentation supports server-side `resources`, `tools`, and `prompts`; transport selection remains open.

## 2026-06-01 - Required Project Documents

- Decision: Produce an implementation-ready PRD or project-goal specification.
- Decision: Produce a root `README.md`.
- README contents: project overview, the MCP Tools used or planned, how each MCP Tool works, and project execution instructions.
- Reason: These documents are required working artifacts for implementation and onboarding, not optional polish after coding.

## 2026-06-01 - MCP Primitive Surface And Clients

- Decision: Expose MCP `resources`, `tools`, and `prompts`.
- Decision: Support both WIKI reads and writes through the MCP server.
- Decision: Support Codex and Claude Code as first-version clients.
- Tool scope: search, local PDF ingest, reading-mode and page-range selection, Markdown editing, draft review, optional comparison generation, user-driven claim and question management, claim-fitness assessment, and novelty review.
- Prompt scope: reusable guided workflows for paper ingest, claim refinement, and novelty review.
- Decision: Implement shared `Streamable HTTP` and local `stdio` transports.
- Reason: Shared HTTP serves lab-wide access while stdio supports local development and standalone use.

## 2026-06-01 - First Milestone Runtime And Stack

- Decision: Validate local execution in the first milestone.
- Decision: Require shared-token authentication for Streamable HTTP.
- Decision: Include the GUI in the first milestone.
- Decision: Implement in Python using the official MCP Python SDK.
- Reason: Establish an end-to-end locally verifiable product before moving to shared network deployment.

## 2026-06-01 - First Milestone Boundary

- Decision: Use Git history as the first-milestone recovery mechanism without a separate automatic backup system.
- Decision: Exclude external deployment, DOI or arXiv URL ingest, shared-folder watching, per-user accounts, and fine-grained authorization.
- Decision: Include a detailed research-workflow GUI rather than limiting the milestone to a minimal paper list.
- GUI paper states: red before ingest, blue after `source` and `concept` reflection, and blue with a separate comparison badge after optional comparison generation.
- Reason: Keep infrastructure scope controlled while making the local product useful enough to validate the research workflow.

## 2026-06-01 - Model Execution Boundary Requires Confirmation

- Observation: PDF summarization, concept extraction, claim-fitness assessment, and novelty review require model-dependent reasoning.
- Decision: Connected Codex or Claude Code clients perform model-dependent reasoning through MCP workflows.
- Decision: The first-milestone MCP server does not invoke an LLM API itself.
- Reason: This choice changes server dependencies, GUI behavior, credential handling, and validation scope.

## 2026-06-01 - Korean Default With English Option

- Decision: Use Korean as the default language for research summaries and WIKI reflection.
- Decision: Allow English as an explicit option.
- Invariant: Preserve original PDF text during deterministic extraction; the selected language guides Codex or Claude Code when writing summaries and WIKI pages.

## 2026-06-02 - GUI MCP Capability Management

- Decision: Add a left-navigation `MCP 상태` view for maintainers.
- Decision: Show the current resource, tool, and prompt catalog with descriptions.
- Decision: Store per-capability enable or disable choices in version-managed `mcp-settings.json`.
- Decision: Apply changes when the MCP server next starts instead of force-closing active client connections.
- Reason: Maintainers need visibility and control without destabilizing a Codex or Claude Code session that is already using the server.
