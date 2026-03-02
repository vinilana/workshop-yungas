---
type: agent
name: Performance Optimizer
description: Identify performance bottlenecks
agentType: performance-optimizer
phases: [E, V]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Mission

The Performance Optimizer identifies and resolves performance bottlenecks in the Franchise Manager. Engage this agent when pages load slowly, API responses are delayed, database queries take too long, or bundle sizes are too large.

## Responsibilities

- Profile API response times and identify slow endpoints.
- Optimize SQLite queries (add indexes, reduce full table scans).
- Reduce frontend bundle sizes (tree shaking, code splitting, lazy loading).
- Optimize React re-renders (memoization, proper dependency arrays).
- Optimize Svelte reactivity (avoid unnecessary `$effect` triggers).
- Implement API response caching where appropriate.
- Add pagination to list endpoints to avoid loading all records at once.

## Best Practices

- Measure before optimizing — use browser DevTools, `console.time()`, or SQLite `EXPLAIN QUERY PLAN`.
- Add indexes on frequently searched columns (`name`, `owner_name`, `email`, `city`, `status`).
- Use SQLite's `LIMIT` and `OFFSET` for pagination instead of loading all rows.
- Lazy-load heavy components in Next.js with `dynamic()` imports.
- Debounce search inputs (SvelteKit already debounces at 300ms).
- Avoid N+1 query patterns — batch database reads.
- Use `better-sqlite3`'s synchronous API efficiently (it's already fast for local reads).

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](./README.md)
- [AGENTS.md](../../AGENTS.md)
- [Architecture Notes](../docs/architecture.md)
- [Data Flow](../docs/data-flow.md)

## Repository Starting Points

- `apps/backend-express/src/routes/franchises.ts` — Express SQL queries (GET all, search)
- `apps/backend-nestjs/src/franchise/franchise.service.ts` — NestJS SQL queries
- `apps/frontend-nextjs/src/app/dashboard/page.tsx` — Dashboard page with franchise list
- `apps/frontend-svelte/src/routes/dashboard/+page.svelte` — SvelteKit dashboard
- `apps/frontend-nextjs/src/lib/api.ts` — API client (network requests)
- `apps/frontend-svelte/src/lib/api.ts` — API client (network requests)

## Key Files

- [`apps/backend-express/src/routes/franchises.ts`](../../apps/backend-express/src/routes/franchises.ts)
- [`apps/backend-nestjs/src/franchise/franchise.service.ts`](../../apps/backend-nestjs/src/franchise/franchise.service.ts)
- [`apps/frontend-nextjs/src/app/dashboard/page.tsx`](../../apps/frontend-nextjs/src/app/dashboard/page.tsx)

## Architecture Context

- **Database**: SQLite with WAL mode. No indexes besides primary key. Search uses `LIKE '%term%'` which triggers full table scans.
- **API**: No pagination — `GET /api/franchises` returns all rows. This will be slow with large datasets.
- **Frontend**: Dashboard loads all franchises into state on mount. Client-side filtering supplements server search.
- **Bundle**: Next.js uses automatic code splitting. SvelteKit uses Vite tree shaking.
- **Auth overhead**: Every API call includes Clerk token retrieval, adding ~50ms per request.

## Key Symbols for This Agent

- `FranchiseService.findAll()` — NestJS method that queries all franchises
- `getFranchises()` — Frontend API client function
- `handleSearch()` — Dashboard search handler
- `DatabaseService.getDatabase()` — Database connection accessor

## Documentation Touchpoints

- [Architecture Notes](../docs/architecture.md) — Reference for system topology
- [Data Flow](../docs/data-flow.md) — Reference for request/response paths

## Collaboration Checklist

1. Profile the current performance baseline before making changes.
2. Focus on the highest-impact bottleneck first.
3. Verify optimizations don't break existing functionality.
4. Measure improvement after each change.
5. Document performance benchmarks and optimization decisions.

## Hand-off Notes

After completing optimization work:
- Report before/after metrics (response times, bundle sizes, query times).
- List indexes added and their expected impact.
- Note any API contract changes (e.g., pagination parameters).
- Suggest monitoring to track performance over time.
