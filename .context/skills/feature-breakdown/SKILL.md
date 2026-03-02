---
type: skill
name: Feature Breakdown
description: Break down features into implementable tasks
skillSlug: feature-breakdown
phases: [P]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# Feature Breakdown

## When to Use
Activate this skill when planning a new feature for the Franchise Manager. It breaks down the feature into concrete implementation tasks across the full stack.

## Instructions

1. **Define the feature**: Write a clear 1-2 sentence description of what the feature does from the user's perspective.
2. **Identify affected layers**:
   - Shared types: New interfaces, DTOs, or constants needed?
   - Database: New columns, tables, or indexes?
   - Backend (Express): New route handlers?
   - Backend (NestJS): New controller methods and service logic?
   - Frontend (Next.js): New pages, components, or API client functions?
   - Frontend (SvelteKit): New routes, stores, or API client functions?
3. **Create ordered tasks**:
   - Start with shared types (other tasks depend on these).
   - Then database schema changes.
   - Then backend implementation (can be done in parallel for Express/NestJS).
   - Then frontend implementation (can be done in parallel for Next.js/SvelteKit).
   - Finally, documentation and tests.
4. **Estimate complexity**: Tag each task as S (small, < 30 min), M (medium, 1-2 hours), or L (large, half-day+).
5. **Identify risks**: Note dependencies, unknowns, or decisions needed.

## Examples

**Feature: Add pagination to franchise list**

| # | Task | Layer | Size | Depends On |
|---|------|-------|------|-----------|
| 1 | Add `PaginatedResponse<T>` interface to shared types | Shared | S | — |
| 2 | Add `page` and `limit` query params to Express GET handler | Backend-Express | M | 1 |
| 3 | Add `findAll(page, limit)` with SQL LIMIT/OFFSET to NestJS service | Backend-NestJS | M | 1 |
| 4 | Update NestJS controller to accept pagination query params | Backend-NestJS | S | 3 |
| 5 | Add pagination controls to Next.js dashboard | Frontend-Next | M | 2 or 4 |
| 6 | Add pagination controls to SvelteKit dashboard | Frontend-Svelte | M | 2 or 4 |
| 7 | Update `getFranchises()` in both API clients to pass page/limit | Frontend | S | 5, 6 |
| 8 | Add integration tests for paginated endpoint | Tests | M | 2, 4 |
| 9 | Update API documentation | Docs | S | All |

**Risks**: Need to decide default page size. Client-side filtering may conflict with server-side pagination.
