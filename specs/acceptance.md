# Research MCP WIKI Tool Acceptance Criteria

## Planning Checks

- [x] User reviews and approves the requirements, PRD, and README plan.
- [x] `specs/plan-closed.md` exists after explicit user sign-off.
- [x] Structure check passes.

## Product Checks

- [x] Python MCP server starts through `stdio`.
- [x] Python MCP server starts through local `Streamable HTTP`.
- [x] Streamable HTTP rejects a missing or invalid shared token.
- [x] Codex and Claude Code connection instructions are documented.
- [x] MCP exposes `resources`, `tools`, and `prompts`.
- [x] MCP supports WIKI reads and writes.
- [x] MCP exposes a proactive client-invoked discussion capture tool that creates or appends draft WIKI knowledge without duplicating identical entries.
- [x] Local PDF ingest supports text extraction.
- [x] Local PDF ingest supports screenshot-based image-plus-text reading with page-range selection.
- [x] Selected PDF screenshots can be published into Git-managed `wiki/assets/`, embedded in source Markdown, and rendered inline in the GUI.
- [x] Baseline paper ingest can reflect `source` and `concept` pages.
- [x] Comparison reflection is optional and produces a visible GUI badge.
- [x] Claim and question workflows require user-driven input.
- [x] AI-authored pages begin as `status: draft`.
- [x] A researcher can promote a page to `status: reviewed`.
- [x] Git history records WIKI changes and can recover an earlier revision.
- [x] The derived index can be rebuilt from Markdown files.
- [x] The GUI shows red un-ingested papers and blue reflected papers.
- [x] The GUI supports search, browsing, editing, ingest configuration, draft review, and index rebuild.
- [x] The GUI filters WIKI pages by object type and linked paper and expands the page list in the dedicated WIKI view.
- [x] The GUI `MCP 상태` view lists resources, tools, and prompts and saves startup-time enable or disable settings.
- [x] A restarted MCP server omits capabilities disabled through `mcp-settings.json`.

## Documentation Checks

- [x] `PRD.md` describes the implementation target, architecture, milestones, and acceptance gates.
- [x] `README.md` explains the project, planned or implemented MCP Tools, how they work, and how to run the project.
- [x] Planned behavior is not described as implemented before validation passes.

## Done Means

The first milestone is done when a local user can run the MCP server and GUI, connect Codex or Claude Code, ingest a local PDF through either reading mode, persist and edit Git-managed Markdown WIKI pages, search through a rebuildable index, review draft content, and observe the required GUI paper states.
