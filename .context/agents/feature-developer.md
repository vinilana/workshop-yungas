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

The Feature Developer implements new features in the **active** projects of the Franchise Manager monorepo: **NestJS backend** and **SvelteKit frontend**. Engage this agent for building new endpoints, UI pages, components, or cross-cutting functionality. The agent works full-stack: shared types, NestJS backend logic, and SvelteKit frontend UI.

> **Legacy notice:** `apps/backend-express` (Express.js) and `apps/frontend-nextjs` (Next.js) are legacy projects in maintenance mode. Do NOT implement new features in these apps. They may be read as reference for existing patterns, but all new code goes to NestJS and SvelteKit only.

## Responsibilities

- Break down feature requirements into implementation steps.
- Add new types and DTOs to `packages/shared` when features require new data shapes.
- Implement backend endpoints in the **NestJS** backend (`apps/backend-nestjs`).
- Build frontend pages and components in **SvelteKit** (`apps/frontend-svelte`).
- Wire up API client functions in `apps/frontend-svelte/src/lib/api.ts`.
- Ensure new features follow existing patterns and conventions in the active projects.
- Handle error states, loading states, and edge cases in the SvelteKit UI.

## Best Practices

- Start by defining types in `packages/shared/src/types.ts` before implementing.
- Implement the NestJS backend first (API endpoint + database), then the SvelteKit frontend (UI + API client).
- Follow existing UI patterns in SvelteKit: responsive tables/cards, status badges, form components.
- Use Clerk auth in both NestJS backend and SvelteKit frontend for protected features.
- Add entries to `API_ROUTES` constant for new endpoints.
- Use `BRAZILIAN_STATES` and `FRANCHISE_STATUSES` constants for dropdowns.
- Do NOT add new features to the legacy Express or Next.js apps.

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](./README.md)
- [AGENTS.md](../../AGENTS.md)
- [Architecture Notes](../docs/architecture.md)
- [Data Flow](../docs/data-flow.md)

## Repository Starting Points

- `packages/shared/src/types.ts` — Define new interfaces and DTOs here first
- `apps/backend-nestjs/src/franchise/` — Add NestJS controller methods and service logic (primary backend)
- `apps/frontend-svelte/src/routes/` — Add new SvelteKit pages (primary frontend)
- `apps/frontend-svelte/src/lib/api.ts` — Add API client functions
- `apps/frontend-svelte/src/lib/stores/` — Add Svelte stores as needed
- `apps/backend-express/src/routes/franchises.ts` — Legacy, read-only reference
- `apps/frontend-nextjs/src/` — Legacy, read-only reference

## Key Files

- [`packages/shared/src/index.ts`](../../packages/shared/src/index.ts)
- [`apps/backend-express/src/index.ts`](../../apps/backend-express/src/index.ts)
- [`apps/backend-nestjs/src/database/database.service.ts`](../../apps/backend-nestjs/src/database/database.service.ts)
- [`apps/backend-nestjs/src/franchise/franchise.service.ts`](../../apps/backend-nestjs/src/franchise/franchise.service.ts)
- [`apps/backend-nestjs/src/franchise/franchise.controller.ts`](../../apps/backend-nestjs/src/franchise/franchise.controller.ts)

## Architecture Context

- **Full-stack feature flow**: Shared types --> NestJS endpoint --> SvelteKit API client --> Svelte UI page/component.
- **Active stack only**: New features are implemented in NestJS + SvelteKit. Express and Next.js are legacy and receive no new features.
- **Database**: Add new columns to the `franchises` CREATE TABLE statement in the NestJS backend's `DatabaseService`.
- **Styling**: Use existing Tailwind CSS classes (`.surface-card`, `.primary-btn`, `.soft-input`, `.tag-pill`) in SvelteKit.
- **Auth**: All new API endpoints must be behind the NestJS `ClerkAuthGuard`.

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
2. Implement and test NestJS backend endpoints first.
3. Build SvelteKit frontend UI after API is confirmed working.
4. Verify feature works end-to-end in NestJS + SvelteKit.
5. Rebuild shared package if types changed: `npm run build -w packages/shared`.

## Hand-off Notes

After implementing a feature:
- List all files created or modified.
- Document new API endpoints (method, path, request/response shapes).
- Note UI changes with screenshots or descriptions.
- Suggest test cases for the test writer agent.
