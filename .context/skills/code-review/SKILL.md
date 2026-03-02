---
type: skill
name: Code Review
description: Review code quality, patterns, and best practices
skillSlug: code-review
phases: [R, V]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# Code Review

## When to Use
Activate this skill when reviewing code changes (not necessarily a PR) for quality, patterns, and adherence to project conventions. This is a broader review than PR review — it can apply to any code segment.

## Instructions

1. **Type safety**: Verify TypeScript strict mode compliance. Check for implicit `any`, missing return types on public methods, and proper null handling.
2. **Pattern adherence**:
   - NestJS: Modules, injectable services, controllers with decorators, guards for auth.
   - Express: Middleware chain, router handlers, inline SQL with prepared statements.
   - Next.js: App Router conventions, `"use client"` directives, React hooks.
   - Svelte: Runes (`$state`, `$derived`, `$effect`), SvelteKit file routing.
3. **Error handling**: All async operations wrapped in try/catch. API errors return proper status codes and `ApiErrorResponse` shape.
4. **Database access**: Parameterized queries only. No string concatenation in SQL. WAL mode enabled.
5. **Code smells**:
   - Functions longer than 50 lines → suggest extraction.
   - Duplicated logic between backends → suggest shared utility.
   - Magic numbers or strings → suggest constants in `packages/shared`.
   - Deep nesting (>3 levels) → suggest early returns or extraction.
6. **Security**: No SQL injection, no XSS vectors, no exposed secrets, auth on all endpoints.

## Examples

**Good pattern:**
```typescript
// NestJS service with proper error handling
async findOne(id: number): Promise<Franchise> {
  const row = this.db.prepare('SELECT * FROM franchises WHERE id = ?').get(id);
  if (!row) throw new NotFoundException(`Franchise #${id} not found`);
  return this.mapRow(row);
}
```

**Code smell:**
```typescript
// Duplicated row mapping — should be in shared package
const franchise = {
  id: row.id,
  name: row.name,
  ownerName: row.owner_name,  // exists in both Express and NestJS
  // ...
};
```
