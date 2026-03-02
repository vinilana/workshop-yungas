---
type: skill
name: Documentation
description: Generate and update technical documentation
skillSlug: documentation
phases: [P, C]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# Documentation

## When to Use
Activate this skill when creating or updating technical documentation. Use it after implementing features, changing architecture, or when documentation is outdated.

## Instructions

1. **Identify the document type**:
   - Project overview → `project-overview.md`
   - Architecture changes → `architecture.md`
   - New workflows → `development-workflow.md`
   - New domain terms → `glossary.md`
   - Data flow changes → `data-flow.md`
   - Security updates → `security.md`
   - Tool additions → `tooling.md`
   - Test changes → `testing-strategy.md`
2. **Follow the template structure**:
   - Preserve YAML frontmatter (type, name, description, category, status).
   - Update `status` from `unfilled` to `filled` when completing.
   - Fill all section placeholders marked with `_Content to be added._`.
   - Keep the `## Related Resources` section with working relative links.
3. **Writing style**:
   - Use clear, concise language with technical precision.
   - Use Markdown tables for structured data (APIs, types, config).
   - Use code blocks for commands, file paths, and code examples.
   - Use Mermaid diagrams for visual architecture or flow representations.
   - Cross-reference related documents using relative links.
4. **Verify accuracy**:
   - Check file paths and line numbers against current code.
   - Verify commands run correctly before documenting them.
   - Match type definitions to `packages/shared/src/types.ts`.
5. **Legacy vs. active distinction**: Documentation for new features should reference NestJS and SvelteKit. Mark Express/Next.js references as legacy. When documenting APIs or features, clearly indicate whether the content applies to the active stack (NestJS/SvelteKit) or the legacy stack (Express/Next.js).

## Examples

**API endpoint documentation:**

| Method | Path | Description | Auth | Status Codes |
|--------|------|-------------|------|-------------|
| GET | `/api/franchises` | List all franchises | Required | 200, 401 |
| POST | `/api/franchises` | Create a franchise | Required | 201, 400, 401 |

**Command documentation:**
```bash
# Start the NestJS backend in development mode
npm run dev:nestjs

# Seed the database with 10 sample franchises
npm run seed:nestjs
```
