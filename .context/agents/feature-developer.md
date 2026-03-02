---
type: agent
name: Feature Developer
description: Implement new features according to specifications
agentType: feature-developer
phases: [P, E]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Mission

The Feature Developer implements new features across the Franchise Manager monorepo. Engage this agent for building new endpoints, UI pages, components, or cross-cutting functionality. The agent works full-stack: shared types, backend logic, and frontend UI.

## Responsibilities

- Break down feature requirements into implementation steps.
- Add new types and DTOs to `packages/shared` when features require new data shapes.
- Implement backend endpoints in both Express and NestJS backends.
- Build frontend pages and components in both Next.js and SvelteKit.
- Wire up API client functions in both frontend `lib/api.ts` files.
- Ensure new features follow existing patterns and conventions.
- Handle error states, loading states, and edge cases in UI.

## Best Practices

- Start by defining types in `packages/shared/src/types.ts` before implementing.
- Implement the backend first (API endpoint + database), then the frontend (UI + API client).
- Keep both backends functionally equivalent with the same API contract.
- Follow existing UI patterns: responsive tables/cards, status badges, form components.
- Use Clerk auth in both frontend and backend for protected features.
- Add entries to `API_ROUTES` constant for new endpoints.
- Use `BRAZILIAN_STATES` and `FRANCHISE_STATUSES` constants for dropdowns.

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](./README.md)
- [AGENTS.md](../../AGENTS.md)
- [Architecture Notes](../docs/architecture.md)
- [Data Flow](../docs/data-flow.md)

## Repository Starting Points

- `packages/shared/src/types.ts` — Define new interfaces and DTOs here first
- `apps/backend-express/src/routes/franchises.ts` — Add Express route handlers
- `apps/backend-nestjs/src/franchise/` — Add NestJS controller methods and service logic
- `apps/frontend-nextjs/src/app/` — Add new Next.js pages
- `apps/frontend-nextjs/src/components/` — Add new React components
- `apps/frontend-svelte/src/routes/` — Add new SvelteKit pages
- `apps/frontend-*/src/lib/api.ts` — Add API client functions

## Key Files

- [`packages/shared/src/index.ts`](../../packages/shared/src/index.ts)
- [`apps/backend-express/src/index.ts`](../../apps/backend-express/src/index.ts)
- [`apps/backend-nestjs/src/database/database.service.ts`](../../apps/backend-nestjs/src/database/database.service.ts)
- [`apps/backend-nestjs/src/franchise/franchise.service.ts`](../../apps/backend-nestjs/src/franchise/franchise.service.ts)
- [`apps/backend-nestjs/src/franchise/franchise.controller.ts`](../../apps/backend-nestjs/src/franchise/franchise.controller.ts)

## Architecture Context

- **Full-stack feature flow**: Shared types → Backend endpoint → Frontend API client → UI page/component.
- **Dual implementations**: Features must work in both Express + NestJS backends and both Next.js + SvelteKit frontends.
- **Database**: Add new columns to the `franchises` CREATE TABLE statement in both backends' database init.
- **Styling**: Use existing Tailwind CSS classes (`.surface-card`, `.primary-btn`, `.soft-input`, `.tag-pill`).
- **Auth**: All new API endpoints must be behind Clerk auth middleware/guard.

## Key Symbols for This Agent

- `AppModule` (class) - app.module.ts:9
- `DatabaseService` (class) - database.service.ts:6
- `DatabaseModule` (class) - database.module.ts:9
- `FranchiseService` (class) - franchise.service.ts:24
- `FranchiseModule` (class) - franchise.module.ts:9
- `Franchise` (interface) - types.ts:1
- `CreateFranchiseDTO` (interface) - types.ts:17
- `UpdateFranchiseDTO` (interface) - types.ts:28
- `ApiResponse` (interface) - types.ts:39
- `ApiErrorResponse` (interface) - types.ts:44

## Documentation Touchpoints

- [Architecture Notes](../docs/architecture.md) — Reference for existing patterns
- [Glossary](../docs/glossary.md) — Update when adding new domain concepts
- [Data Flow](../docs/data-flow.md) — Update when adding new data paths

## Collaboration Checklist

1. Define types in shared package before coding.
2. Implement and test backend endpoints first.
3. Build frontend UI after API is confirmed working.
4. Verify feature works in all 4 apps.
5. Rebuild shared package if types changed: `npm run build -w packages/shared`.

## Hand-off Notes

After implementing a feature:
- List all files created or modified.
- Document new API endpoints (method, path, request/response shapes).
- Note UI changes with screenshots or descriptions.
- Suggest test cases for the test writer agent.
