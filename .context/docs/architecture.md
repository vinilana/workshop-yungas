---
type: doc
name: architecture
description: System architecture, layers, patterns, and design decisions
category: architecture
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Architecture Notes

The Franchise Manager MVP is organized as a **monorepo with npm workspaces**. It contains two interchangeable backend implementations (Express and NestJS) and two interchangeable frontend implementations (Next.js and SvelteKit), all sharing a common types package. This architecture demonstrates framework comparison while maintaining consistent API contracts.

> **Project Classification**
>
> | App | Status |
> |---|---|
> | `apps/backend-express` (Express.js 4.21) | **Legacy** -- maintenance only, no new features |
> | `apps/frontend-nextjs` (Next.js 14) | **Legacy** -- maintenance only, no new features |
> | `apps/backend-nestjs` (NestJS 10.4) | **Active** -- all new backend development |
> | `apps/frontend-svelte` (SvelteKit 2.0 / Svelte 5) | **Active** -- all new frontend development |
> | `packages/shared` | **Active** -- shared types and constants |
>
> All new features, enhancements, and non-critical improvements target the **Active** stack only.

## System Architecture Overview

The system follows a **client-server REST architecture** with a shared types layer:

```
┌───────────────────────────────────────────────────────────┐
│                        Clients                             │
│  ┌───────────────────────┐   ┌──────────────────────────┐ │
│  │  Next.js (React)       │   │  SvelteKit (Svelte5)     │ │
│  │  Port: 3000            │   │  Port: 5173              │ │
│  │  (Legacy)              │   │  (Active)                │ │
│  └──────────┬────────────┘   └────────────┬─────────────┘ │
│             │     Bearer Token (Clerk)     │               │
└─────────────┼──────────────────────────────┼───────────────┘
              │                              │
              ▼                              ▼
┌───────────────────────────────────────────────────────────┐
│                  REST API (Port 3001)                       │
│  ┌───────────────────────┐   ┌──────────────────────────┐ │
│  │  Express.js            │ OR│  NestJS                  │ │
│  │  Routes + MW           │   │  Controller+Service      │ │
│  │  (Legacy)              │   │  (Active)                │ │
│  └──────────┬────────────┘   └────────────┬─────────────┘ │
│             │                              │               │
│             ▼                              ▼               │
│  ┌───────────────────────────────────────────────────┐     │
│  │            SQLite (better-sqlite3)                 │     │
│  │            WAL mode, foreign keys                  │     │
│  └───────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────┘
              │
              ▼
┌───────────────────────────────────────────────────────────┐
│           Shared Package (@franchise/shared)                │
│  Types, DTOs, Constants, Seed Data                         │
└───────────────────────────────────────────────────────────┘
```

Requests flow: **Browser → Clerk Auth → Frontend → REST API → Auth Middleware → Route/Controller → Database → Response**.

## Architectural Layers

- **Utils** (11 symbols): Shared utilities and helpers
  - `packages/shared/src` — Types, DTOs, constants, seed data
  - `apps/frontend-svelte/src/lib` — API client, Clerk config
  - `apps/frontend-svelte/src/lib/stores` — Toast and auth stores
- **Repositories** (2 symbols): Data access and persistence
  - `apps/backend-express/src` — Direct SQLite queries in route handlers
  - `apps/backend-nestjs/src/database` — `DatabaseService` wrapping better-sqlite3
- **Controllers** (17 symbols): Request handling and routing
  - `apps/backend-nestjs/src/franchise` — `FranchiseController` with decorators
  - `apps/backend-express/src/routes` — Express router with handler functions
  - `apps/frontend-*/src/lib` — API client functions (`getFranchises`, `createFranchise`, etc.)
- **Services** (3 symbols): Business logic and orchestration
  - `apps/backend-nestjs/src/franchise` — `FranchiseService` with CRUD operations
  - `apps/backend-nestjs/src/database` — `DatabaseService` lifecycle management
- **Components** (15 symbols): UI components and views
  - `apps/frontend-nextjs/src/components` — `FranchiseTable`, `FranchiseForm`, `StatusBadge`, `DeleteConfirmDialog`
  - `apps/frontend-nextjs/src/app` — Pages (dashboard, create, edit, sign-in)
  - `apps/frontend-svelte/src/routes` — SvelteKit route pages

> See [`codebase-map.json`](./codebase-map.json) for complete symbol counts and dependency graphs.

## Detected Design Patterns

| Pattern | Confidence | Locations | Description |
|---------|------------|-----------|-------------|
| Service Layer | 85% | `FranchiseService`, `DatabaseService` | Encapsulates business logic in injectable service classes |
| Controller | 90% | `FranchiseController` | Handles HTTP requests, delegates to services |
| DTO | 90% | `CreateFranchiseDTO`, `UpdateFranchiseDTO` | Validates and shapes input data at API boundaries |
| Guard | 85% | `ClerkAuthGuard` | NestJS route protection with JWT validation |
| Module | 90% | `AppModule`, `FranchiseModule`, `DatabaseModule`, `AuthModule` | NestJS dependency injection containers |
| API Client | 80% | `api.ts` (Next.js, Svelte) | Centralized HTTP client with auth token injection |
| Store | 75% | `toast.ts`, `auth.ts` | Svelte reactive state management |

## Entry Points

- [`packages/shared/src/index.ts`](../../packages/shared/src/index.ts) — Re-exports all shared types and constants
- [`apps/backend-nestjs/src/main.ts`](../../apps/backend-nestjs/src/main.ts) — NestJS bootstrap with CORS config
- [`apps/backend-express/src/index.ts`](../../apps/backend-express/src/index.ts) — Express server with middleware chain

## Public API

| Symbol | Type | Location |
|--------|------|----------|
| `Franchise` | interface | types.ts:1 |
| `FranchiseStatus` | type | types.ts:15 |
| `CreateFranchiseDTO` | interface | types.ts:17 |
| `UpdateFranchiseDTO` | interface | types.ts:28 |
| `ApiResponse` | interface | types.ts:39 |
| `ApiErrorResponse` | interface | types.ts:44 |
| `FranchiseController` | class | franchise.controller.ts:24 |
| `FranchiseService` | class | franchise.service.ts:24 |
| `DatabaseService` | class | database.service.ts:6 |
| `ClerkAuthGuard` | class | clerk.guard.ts:10 |

## Internal System Boundaries

- **Shared ↔ Apps**: The `@franchise/shared` package defines the contract. All apps import types and constants from it. Changes to shared types require rebuilding the package.
- **Backend ↔ Frontend**: REST API contract defined by `API_ROUTES` constants and DTO interfaces. Frontends communicate exclusively via HTTP with Bearer token auth.
- **Auth Boundary**: Clerk handles identity externally. Backends validate JWT tokens at the middleware/guard layer before any route handler executes.
- **Database Boundary**: SQLite is embedded within each backend process. No shared database between Express and NestJS — each has its own `franchises.db` file.

## External Service Dependencies

| Service | Purpose | Auth Method | Notes |
|---------|---------|-------------|-------|
| Clerk | Identity and authentication | API keys (`CLERK_SECRET_KEY`, `CLERK_PUBLISHABLE_KEY`) | JWT-based session tokens, handles sign-in UI |

## Key Decisions & Trade-offs

1. **Monorepo with npm workspaces** — Chosen for simplicity over Turborepo/Nx. Trade-off: no incremental build caching.
2. **SQLite over PostgreSQL** — Zero-config embedded database for MVP. Trade-off: single-writer, no concurrent multi-process access.
3. **Dual backends (Express + NestJS)** — Educational comparison of framework approaches. Trade-off: duplicated business logic.
4. **Dual frontends (Next.js + SvelteKit)** — Framework comparison. Trade-off: maintenance of two UI implementations.
5. **Clerk for auth** — Managed auth service reduces security surface. Trade-off: vendor lock-in for identity.
6. **No ORM** — Direct SQL via better-sqlite3 for simplicity. Trade-off: manual query construction.
7. **Legacy classification for Express + Next.js** — After the initial comparison phase, NestJS and SvelteKit were chosen as the primary stack going forward. Express.js and Next.js apps are now maintained only for critical bug fixes and security patches. All new feature development targets NestJS + SvelteKit exclusively.

## Diagrams

```mermaid
graph TD
    subgraph Frontends
        A[Next.js 14 / React 18<br/>Legacy] -->|REST + Bearer| API
        B[SvelteKit 2 / Svelte 5<br/>Active] -->|REST + Bearer| API
    end

    subgraph API[Backend API :3001]
        C[Express.js<br/>Legacy] --> DB[(SQLite)]
        D[NestJS<br/>Active] --> DB
    end

    subgraph Shared[@franchise/shared]
        E[Types & DTOs]
        F[Constants]
        G[Seed Data]
    end

    A -.->|imports| Shared
    B -.->|imports| Shared
    C -.->|imports| Shared
    D -.->|imports| Shared

    Clerk[Clerk Auth] -->|JWT validation| API
    Clerk -->|Sign-in UI| Frontends
```

## Risks & Constraints

- **No test suite**: No unit or integration tests exist yet. Regressions are undetected.
- **Single database file**: SQLite limits concurrent write throughput and is not suitable for horizontal scaling.
- **No CI/CD**: No automated build, test, or deployment pipeline configured.
- **Duplicated logic**: Business logic exists in both Express routes and NestJS services — changes must be synchronized manually.
- **No rate limiting**: API endpoints have no request throttling.
- **Legacy projects frozen for new features**: `apps/backend-express` and `apps/frontend-nextjs` are legacy and receive only critical bug fixes and security patches. No new features, enhancements, or refactors should be applied to them. Any drift between the legacy and active stacks is expected and accepted.

## Top Directories Snapshot

- `apps/` — Four independent applications: 2 backends (Express, NestJS) and 2 frontends (Next.js, SvelteKit)
- `packages/` — Shared workspace packages; currently contains `shared/` with types, DTOs, constants, and seed data
- `package.json` — Root workspace manifest defining npm workspaces and cross-app scripts
- `tsconfig.base.json` — Base TypeScript config (ES2022 target, strict mode, bundler module resolution)

## Related Resources

- [project-overview.md](./project-overview.md)
- [data-flow.md](./data-flow.md)
- [codebase-map.json](./codebase-map.json)
