---
type: skill
name: Pr Review
description: Review pull requests against team standards and best practices
skillSlug: pr-review
phases: [R, V]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# PR Review

## When to Use
Activate this skill when reviewing a pull request. It provides a structured checklist to evaluate code quality, consistency, and adherence to project conventions.

## Instructions

1. **Read the full diff** — understand all changes before commenting.
2. **Check type safety**:
   - New types defined in `packages/shared/src/types.ts` (not locally)?
   - TypeScript strict mode compliant (no `any` escapes)?
   - DTOs used correctly at API boundaries?
3. **Check API consistency**:
   - Responses wrapped in `ApiResponse<T>` / `ApiErrorResponse`?
   - Correct HTTP status codes (200, 201, 400, 401, 404, 500)?
   - Both backends (Express + NestJS) updated for API changes?
4. **Check security**:
   - Auth middleware/guard applied to new endpoints?
   - SQL queries use parameterized statements?
   - No hardcoded secrets or credentials?
   - CORS configuration not overly permissive?
5. **Check frontend quality**:
   - Responsive design (mobile cards + desktop table)?
   - Loading, error, and empty states handled?
   - Clerk token retrieved before API calls?
   - Svelte 5 runes used (not legacy `$:` syntax)?
6. **Check conventions**:
   - Conventional Commits format for commit messages?
   - `snake_case` in DB, `camelCase` in TypeScript?
   - Consistent naming across both frontend implementations?
7. **Provide feedback**:
   - Separate blocking issues from suggestions.
   - Include code examples for suggested improvements.
   - Approve, request changes, or leave comments.
8. **Legacy project gate**: If the PR introduces new features or enhancements to legacy projects (`apps/backend-express` or `apps/frontend-nextjs`), flag it as a blocking issue. Only critical bug fixes and security patches are permitted in legacy projects. New development must target NestJS and SvelteKit.

## Examples

**Blocking issue:**
> This endpoint at `POST /api/franchises` doesn't validate required fields (`name`, `owner_name`, `email`). A malicious request could insert incomplete records.

**Suggestion:**
> Consider extracting the row-to-franchise mapping into a shared utility in `packages/shared` since both backends have identical logic.
