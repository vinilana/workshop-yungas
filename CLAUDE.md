# CLAUDE.md - Franchise Manager MVP

## Project Classification

> **CRITICAL: Read this before making ANY changes.**
>
> All new features, enhancements, and active development MUST target the NestJS backend + SvelteKit frontend.
> Express.js and Next.js projects are LEGACY -- only critical bug fixes allowed.

| Project | Path | Status | Rule |
|---------|------|--------|------|
| **backend-nestjs** | `apps/backend-nestjs` | **ACTIVE** | All new backend work goes here |
| **frontend-svelte** | `apps/frontend-svelte` | **ACTIVE** | All new frontend work goes here |
| backend-express | `apps/backend-express` | LEGACY | Critical bug fixes only. No new features. |
| frontend-nextjs | `apps/frontend-nextjs` | LEGACY | Critical bug fixes only. No new features. |
| shared | `packages/shared` | **ACTIVE** | Shared types, DTOs, constants, seed data |

---

## Repository Structure

```
franchise-manager/
├── apps/
│   ├── backend-nestjs/          # ACTIVE - NestJS 10.4 REST API
│   │   ├── src/
│   │   │   ├── main.ts              # App entrypoint (port 3001)
│   │   │   ├── app.module.ts        # Root module
│   │   │   ├── seed.ts              # Database seeder
│   │   │   ├── auth/
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── clerk.guard.ts   # Clerk auth guard
│   │   │   ├── database/
│   │   │   │   ├── database.module.ts
│   │   │   │   └── database.service.ts  # SQLite via better-sqlite3
│   │   │   └── franchise/
│   │   │       ├── franchise.module.ts
│   │   │       ├── franchise.controller.ts
│   │   │       └── franchise.service.ts
│   │   ├── nest-cli.json
│   │   ├── tsconfig.json
│   │   └── .env
│   │
│   ├── frontend-svelte/         # ACTIVE - SvelteKit 2.0 / Svelte 5
│   │   ├── src/
│   │   │   ├── app.html
│   │   │   ├── app.css
│   │   │   ├── app.d.ts
│   │   │   ├── hooks.server.ts
│   │   │   ├── lib/
│   │   │   │   ├── clerk.ts
│   │   │   │   └── stores/
│   │   │   │       ├── auth.ts
│   │   │   │       └── toast.ts
│   │   │   └── routes/
│   │   │       ├── +layout.server.ts
│   │   │       ├── +layout.svelte
│   │   │       ├── +page.svelte
│   │   │       ├── dashboard/+page.svelte
│   │   │       └── franchises/
│   │   │           ├── new/+page.svelte
│   │   │           └── [id]/+page.svelte
│   │   ├── svelte.config.js
│   │   ├── vite.config.ts
│   │   ├── tsconfig.json
│   │   └── .env
│   │
│   ├── backend-express/         # LEGACY - Express.js 4.21 REST API
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   ├── database.ts
│   │   │   ├── seed.ts
│   │   │   ├── middleware/auth.ts
│   │   │   └── routes/franchises.ts
│   │   ├── tsconfig.json
│   │   └── .env
│   │
│   └── frontend-nextjs/         # LEGACY - Next.js 14 React frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── layout.tsx
│       │   │   ├── page.tsx
│       │   │   ├── globals.css
│       │   │   ├── dashboard/page.tsx
│       │   │   ├── franchises/new/page.tsx
│       │   │   ├── franchises/[id]/page.tsx
│       │   │   └── sign-in/[[...sign-in]]/page.tsx
│       │   ├── components/
│       │   │   ├── DeleteConfirmDialog.tsx
│       │   │   ├── FranchiseForm.tsx
│       │   │   ├── FranchiseTable.tsx
│       │   │   └── StatusBadge.tsx
│       │   ├── lib/api.ts
│       │   └── middleware.ts
│       ├── next.config.js
│       ├── tailwind.config.ts
│       ├── postcss.config.js
│       └── tsconfig.json
│
├── packages/
│   └── shared/                  # Shared types, DTOs, constants
│       ├── src/
│       │   ├── index.ts             # Re-exports all modules
│       │   ├── types.ts             # Franchise, DTOs, ApiResponse interfaces
│       │   ├── constants.ts         # API_ROUTES, FRANCHISE_STATUSES, BRAZILIAN_STATES
│       │   └── seed-data.ts         # Sample franchise data for seeding
│       ├── dist/                    # Built output (do not edit)
│       ├── tsconfig.json
│       └── package.json
│
├── .context/                    # AI context files
│   ├── docs/                    # Project documentation
│   ├── agents/                  # Agent playbooks
│   └── skills/                  # Skill definitions
│
├── package.json                 # Root workspace manifest
├── package-lock.json            # Lockfile (auto-generated, do not edit)
├── tsconfig.base.json           # Base TS config (ES2022, strict, bundler)
├── CLAUDE.md                    # This file
└── AGENTS.md                    # Agent instructions
```

---

## Dev Environment

### Prerequisites

- Node.js (LTS)
- npm

### Setup

```bash
npm install                # Install all workspace dependencies
npm run build:shared       # Build shared package first (required before running apps)
npm run seed:nestjs        # Seed the NestJS database with sample data
```

### Dev Scripts (run from repo root)

| Script | Command | Description |
|--------|---------|-------------|
| NestJS backend | `npm run dev:nestjs` | Start NestJS dev server (port 3001) |
| SvelteKit frontend | `npm run dev:svelte` | Start SvelteKit dev server (port 5173) |
| Express backend | `npm run dev:express` | Start Express dev server (port 3001) |
| Next.js frontend | `npm run dev:nextjs` | Start Next.js dev server (port 3000) |
| Build all | `npm run build` | Build all workspaces |
| Build shared | `npm run build:shared` | Build shared package only |
| Seed NestJS DB | `npm run seed:nestjs` | Seed NestJS SQLite database |
| Seed Express DB | `npm run seed:express` | Seed Express SQLite database |

**Note:** The NestJS and Express backends both default to port 3001. Do not run them simultaneously without changing the PORT env var for one of them.

### Environment Variables

Each app has a `.env` file (and `.env.example` for reference). Key variables:

- `CLERK_SECRET_KEY` / `CLERK_PUBLISHABLE_KEY` -- Clerk authentication keys
- `PORT` -- Backend server port (default: 3001)
- `VITE_API_URL` -- SvelteKit API target (default: `http://localhost:3001`)
- `NEXT_PUBLIC_API_URL` -- Next.js API target (default: `http://localhost:3001`)

---

## Development Rules

1. **New features and enhancements** -- Always implement in `apps/backend-nestjs` and `apps/frontend-svelte`. Never in the legacy projects.
2. **Legacy projects (Express/Next.js)** -- Only touch these for critical bug fixes that affect production. No refactoring, no new endpoints, no new pages.
3. **Shared types and DTOs** -- Define in `packages/shared/src/types.ts`. After changes, run `npm run build:shared` and verify both active and legacy apps still compile.
4. **Shared constants** -- Add to `packages/shared/src/constants.ts`. Rebuild after changes.
5. **Database** -- SQLite via better-sqlite3. Each backend has its own `franchises.db` file. Schema changes must be applied to both backends if they affect shared types.
6. **Authentication** -- All protected routes use Clerk. Backend uses `@clerk/express`, SvelteKit uses `svelte-clerk`, Next.js uses `@clerk/nextjs`.
7. **Styling** -- Tailwind CSS for all frontends. SvelteKit uses Tailwind v4 with `@tailwindcss/vite`. Next.js uses Tailwind v3 with PostCSS.
8. **API routes** -- Follow the pattern defined in `packages/shared/src/constants.ts` (`/api/franchises`, `/api/franchises/:id`).
9. **TypeScript** -- Strict mode enabled. Base config in `tsconfig.base.json` (ES2022 target, bundler module resolution).

---

## Tech Stack

| Layer | Active Stack | Version | Legacy Stack | Version |
|-------|-------------|---------|-------------|---------|
| Backend framework | NestJS | 10.4 | Express.js | 4.21 |
| Frontend framework | SvelteKit / Svelte | 2.0 / 5.0 | Next.js / React | 14.2 / 18.3 |
| Language | TypeScript | 5.4+ | TypeScript | 5.4+ |
| Database | SQLite (better-sqlite3) | 11.x | SQLite (better-sqlite3) | 11.x |
| Auth | Clerk (`@clerk/express`, `svelte-clerk`) | -- | Clerk (`@clerk/nextjs`) | -- |
| CSS | Tailwind CSS | 4.0 | Tailwind CSS | 3.4 |
| Build tool (frontend) | Vite | 6.0 | Next.js built-in | -- |
| Backend port | 3001 | -- | 3001 | -- |
| Frontend port | 5173 | -- | 3000 | -- |

---

## Shared Package

The `@franchise/shared` package (`packages/shared`) provides common types and utilities used by all apps.

### Exports

- **Types**: `Franchise`, `FranchiseStatus`, `CreateFranchiseDTO`, `UpdateFranchiseDTO`, `ApiResponse<T>`, `ApiErrorResponse`
- **Constants**: `API_ROUTES`, `FRANCHISE_STATUSES`, `BRAZILIAN_STATES`
- **Seed data**: Sample franchise records for database seeding

### Usage

Import in any workspace app:

```typescript
import { Franchise, CreateFranchiseDTO, API_ROUTES, BRAZILIAN_STATES } from "@franchise/shared";
```

### After Changes

Always rebuild after editing shared package source files:

```bash
npm run build:shared
```

This compiles TypeScript to `packages/shared/dist/` which all apps resolve via the `exports` field in `package.json`.

---

## AI Context References

For deeper project context, consult these files:

| Resource | Path | Description |
|----------|------|-------------|
| Documentation index | `.context/docs/README.md` | Architecture, data flow, security, testing docs |
| Agent playbooks | `.context/agents/README.md` | Specialist agent definitions (backend, frontend, DB, etc.) |
| Skill definitions | `.context/skills/README.md` | Reusable skill templates (API design, code review, etc.) |
