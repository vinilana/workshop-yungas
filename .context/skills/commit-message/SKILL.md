---
type: skill
name: Commit Message
description: Generate commit messages following conventional commits with scope detection
skillSlug: commit-message
phases: [E, C]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# Commit Message

## When to Use
Activate this skill when staging changes and preparing a git commit. It generates commit messages following Conventional Commits format with automatic scope detection based on the files changed.

## Instructions

1. **Analyze staged changes**: Review `git diff --staged` to understand what was modified.
2. **Detect scope**: Determine the scope from the files changed:
   - Files in `apps/backend-express/` → scope: `backend-express`
   - Files in `apps/backend-nestjs/` → scope: `backend-nestjs`
   - Files in `apps/frontend-nextjs/` → scope: `frontend-nextjs`
   - Files in `apps/frontend-svelte/` → scope: `frontend-svelte`
   - Files in `packages/shared/` → scope: `shared`
   - Files in `.context/` → scope: `docs`
   - Multiple apps → scope: `monorepo` or most relevant app
3. **Determine type**:
   - `feat` — New feature or capability
   - `fix` — Bug fix
   - `refactor` — Code improvement without behavior change
   - `docs` — Documentation changes
   - `test` — Adding or updating tests
   - `chore` — Build, config, or tooling changes
   - `style` — Formatting, whitespace, missing semicolons
4. **Write the message**:
   - Format: `type(scope): short description`
   - Keep the subject line under 72 characters
   - Use imperative mood: "add" not "added", "fix" not "fixed"
   - Add a body if the change needs explanation (separated by blank line)

## Examples

```
feat(backend-nestjs): add pagination to franchise list endpoint
fix(frontend-nextjs): correct status filter on dashboard
refactor(shared): extract franchise row mapper utility
docs(docs): update architecture notes with data flow diagram
chore(monorepo): add Husky pre-commit hooks
test(backend-express): add integration tests for CRUD endpoints
```
