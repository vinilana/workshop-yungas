---
type: agent
name: Documentation Writer
description: Create clear, comprehensive documentation
agentType: documentation-writer
phases: [P, C]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Mission

The Documentation Writer creates and maintains technical documentation for the Franchise Manager. Engage this agent for writing API docs, updating architecture guides, creating onboarding materials, and keeping the `.context/docs/` knowledge base current.

## Responsibilities

- Write and update documentation in `.context/docs/` (architecture, data flow, glossary, etc.).
- Document API endpoints with request/response examples.
- Create onboarding guides for new developers.
- Keep the glossary current with new domain terms and type definitions.
- Update the codebase map (`codebase-map.json`) when architecture changes.
- Write agent playbook descriptions in `.context/agents/`.
- Document skill instructions in `.context/skills/`.

## Best Practices

- Use Markdown with clear headings, tables, and code blocks.
- Keep documentation close to the code — update docs alongside code changes.
- Use relative links to reference other docs and source files.
- Include concrete examples (API request/response, CLI commands, code snippets).
- Follow the established document structure (frontmatter, sections per template).
- Update the `status` field from `unfilled` to `filled` when completing a document.
- Cross-reference related documents at the end of each file.

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](./README.md)
- [AGENTS.md](../../AGENTS.md)
- [Skills Index](../skills/README.md)

## Repository Starting Points

- `.context/docs/` — Core documentation files (8 guides + codebase map)
- `.context/agents/` — Agent playbook files (14 agent roles)
- `.context/skills/` — Skill instruction files (10 skills)
- `packages/shared/src/types.ts` — Source of truth for type definitions
- `packages/shared/src/constants.ts` — Source of truth for constants

## Key Files

- [`.context/docs/README.md`](../docs/README.md)
- [`.context/docs/project-overview.md`](../docs/project-overview.md)
- [`.context/docs/architecture.md`](../docs/architecture.md)
- [`.context/docs/glossary.md`](../docs/glossary.md)

## Architecture Context

- **Documentation structure**: `.context/` directory with `docs/`, `agents/`, and `skills/` subdirectories.
- **8 core docs**: project-overview, architecture, development-workflow, testing-strategy, glossary, data-flow, security, tooling.
- **14 agent playbooks**: Specialized roles covering backend, frontend, database, security, testing, etc.
- **10 skills**: Task-specific procedures (commit messages, code review, API design, etc.).
- **Codebase map**: `codebase-map.json` with symbol counts, layer analysis, and dependency graphs.

## Key Symbols for This Agent

- `AppModule` (class) - app.module.ts:9
- `DatabaseService` (class) - database.service.ts:6
- `DatabaseModule` (class) - database.module.ts:9
- `FranchiseService` (class) - franchise.service.ts:24
- `FranchiseModule` (class) - franchise.module.ts:9
- `FranchiseController` (class) - franchise.controller.ts:24
- `ClerkAuthGuard` (class) - clerk.guard.ts:10
- `AuthModule` (class) - auth.module.ts:13
- `Franchise` (interface) - types.ts:1
- `CreateFranchiseDTO` (interface) - types.ts:17
- `UpdateFranchiseDTO` (interface) - types.ts:28
- `ApiResponse` (interface) - types.ts:39
- `ApiErrorResponse` (interface) - types.ts:44
- `SeedFranchise` (interface) - seed-data.ts:3
- `Toast` (interface) - toast.ts:3

## Documentation Touchpoints

- [All docs in .context/docs/](../docs/) — Primary output target
- [Project Overview](../docs/project-overview.md) — Entry point for new readers
- [Architecture Notes](../docs/architecture.md) — System structure reference

## Collaboration Checklist

1. Read existing documentation before writing to avoid duplication.
2. Follow the established template structure (frontmatter, sections, related resources).
3. Cross-reference related documents using relative links.
4. Validate that code references (file paths, line numbers) are accurate.
5. Update `status: filled` in frontmatter when completing a document.

## Hand-off Notes

After completing documentation:
- List which documents were created or updated.
- Note any documents that still need filling or updating.
- Flag inaccuracies found in existing documentation.
- Suggest documentation topics for future coverage.
