---
type: doc
name: project-overview
description: High-level overview of the project, its purpose, and key components
category: overview
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Project Overview

This is a **Franchise Manager MVP** — a TypeScript monorepo that provides a complete franchise operations management system. It demonstrates multiple backend and frontend implementations sharing common types and business logic through a shared package.

The codebase contains **44 source files** with **56 symbols** across 4 independent applications and 1 shared package.

## Codebase Reference

> **Detailed Analysis**: For complete symbol counts, architecture layers, and dependency graphs, see [`codebase-map.json`](./codebase-map.json).

## Quick Facts

- **Root**: `/Users/viniciuslana/Workspace/workshop-yungas`
- **Languages**: TypeScript, JavaScript
- **Total Files**: 44 source files
- **Total Symbols**: 56
- **Package Manager**: npm (workspaces)
- **Entry Points**: `packages/shared/src/index.ts`, `apps/backend-express/src/index.ts`, `apps/backend-nestjs/src/main.ts`
- **Full analysis**: [`codebase-map.json`](./codebase-map.json)

## Entry Points

- [`packages/shared/src/index.ts`](../../packages/shared/src/index.ts) — Shared types, constants, and seed data
- [`apps/backend-nestjs/src/main.ts`](../../apps/backend-nestjs/src/main.ts) — NestJS backend bootstrap
- [`apps/backend-express/src/index.ts`](../../apps/backend-express/src/index.ts) — Express backend server

## Key Exports

- `Franchise` (interface) — Core data model for franchise entities
- `CreateFranchiseDTO` / `UpdateFranchiseDTO` (interfaces) — Input validation DTOs
- `ApiResponse<T>` / `ApiErrorResponse` (interfaces) — Standardized API response wrappers
- `FranchiseStatus` (type) — `"active" | "inactive" | "pending"`
- `FRANCHISE_STATUSES`, `BRAZILIAN_STATES`, `API_ROUTES` — Shared constants
- `FranchiseService`, `FranchiseController`, `DatabaseService` — NestJS service layer

> See [`codebase-map.json`](./codebase-map.json) for complete list.

## File Structure & Code Organization

- `apps/` — Contains 4 independently deployable applications (2 backends, 2 frontends)
  - `backend-express/` — Express.js 4.21 REST API with SQLite and Clerk auth
  - `backend-nestjs/` — NestJS 10.4 REST API with SQLite, class-validator, and Clerk auth
  - `frontend-nextjs/` — Next.js 14 React frontend with App Router and Clerk auth
  - `frontend-svelte/` — SvelteKit 2 frontend with Svelte 5 runes and Clerk auth
- `packages/` — Shared workspace packages
  - `shared/` — Types, DTOs, constants, and seed data used by all apps
- `package.json` — Root workspace configuration with cross-app scripts
- `tsconfig.base.json` — Base TypeScript configuration (ES2022 target, strict mode)

## Technology Stack Summary

**Primary Language**: TypeScript 5.4 (strict mode)

**Other Languages**: JavaScript (configs)

**Package Manager**: npm with workspaces

## Core Framework Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Backend (Option 1) | Express.js | 4.21 |
| Backend (Option 2) | NestJS | 10.4 |
| Frontend (Option 1) | Next.js (React 18) | 14.2 |
| Frontend (Option 2) | SvelteKit (Svelte 5) | 2.0 |
| Database | SQLite | better-sqlite3 11 |
| Authentication | Clerk | 1.3–5.0 |
| Styling | Tailwind CSS | 3.4 / 4.0 |
| Validation | class-validator | 0.14 |

## UI & Interaction Libraries

- **Tailwind CSS** — Utility-first CSS with custom glassmorphic design tokens (`.surface-card`, `.glass-panel`, `.tag-pill`)
- **React 18** — Next.js frontend with hooks (`useState`, `useCallback`, `useEffect`)
- **Svelte 5 Runes** — SvelteKit frontend with `$state`, `$derived`, `$effect` reactive primitives
- **Clerk UI** — Pre-built sign-in components, `UserButton`, and auth provider wrappers
- **Responsive design** — Mobile-first layout with card views (mobile) and table views (desktop)

## Development Tools Overview

- `npm run dev:express` / `dev:nestjs` — Start backend servers (port 3001)
- `npm run dev:svelte` / `dev:nextjs` — Start frontend dev servers
- `npm run seed:express` / `seed:nestjs` — Populate SQLite with 10 sample franchises
- `npm run build` — Build all workspaces
- See [Tooling guide](./tooling.md) for full reference.

## Getting Started Checklist

1. Clone the repository and run `npm install` at the root.
2. Copy `.env.example` to `.env` in each app and fill in Clerk keys.
3. Start a backend: `npm run dev:express` or `npm run dev:nestjs`.
4. Seed the database: `npm run seed:express` or `npm run seed:nestjs`.
5. Start a frontend: `npm run dev:nextjs` or `npm run dev:svelte`.
6. Open the frontend in a browser and sign in via Clerk.

## Next Steps

- Add unit and integration tests (Jest for backends, Vitest for frontends)
- Implement pagination on the franchise list endpoint
- Add role-based authorization (admin vs. viewer)
- Set up CI/CD pipeline with GitHub Actions
- Add Docker support for containerized deployments

## Related Resources

- [architecture.md](./architecture.md)
- [development-workflow.md](./development-workflow.md)
- [tooling.md](./tooling.md)
- [codebase-map.json](./codebase-map.json)
