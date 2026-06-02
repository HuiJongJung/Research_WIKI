---
type: "system"
slug: "page-schema"
title: "WIKI Page Schema"
status: "reviewed"
modified_at: "2026-06-02T04:44:40.405831+00:00"
author: "system"
language: "en"
confidence: "high"
sources:
  - "specs/requirements.md"
tags:
  - "schema"
  - "system"
---

# WIKI Page Schema

Canonical WIKI pages are Markdown files with YAML frontmatter.

## Required Frontmatter

```yaml
---
type: source | concept | comparison | claim | question | system | skill
slug: stable-page-slug
title: Human-readable title
status: draft | reviewed
modified_at: ISO-8601 datetime
author: Human-readable author name
language: ko | en
confidence: low | medium | high
sources:
  - raw/papers/example.pdf
tags:
  - example
---
```

PDF-grounded pages should record page or section evidence anchors in their body.

Selected PDF screenshots may be published under `wiki/assets/<source-slug>/` and embedded from one-level-deep WIKI page directories:

```markdown
![PDF page 3](../assets/example-paper/page-0003-dpi-144.png)
```

Use `language: ko` by default. Set `language: en` when the user explicitly requests English reflection.
