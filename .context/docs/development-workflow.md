---
type: doc
name: development-workflow
description: Day-to-day engineering processes, branching, and contribution guidelines
category: workflow
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Development Workflow

This monorepo uses npm workspaces. Each app can be developed independently, but all share the `@franchise/shared` package for types and constants. Always rebuild the shared package after type changes.

## Branching & Releases

- **Main branch**: `main` — represents the latest stable code.
- **Feature branches**: Use `feat/<description>` for new features.
- **Bug fixes**: Use `fix/<description>` for bug fixes.
- **Commit messages**: Follow Conventional Commits format (e.g., `feat(backend): add pagination`, `fix(frontend): correct status filter`).
- **Scope prefixes**: `backend`, `frontend`, `shared`, `docs`, `config`.
- **No formal release cadence** — MVP stage, changes are deployed manually.

## Local Development

### Prerequisites

- Node.js 18+ and npm 10+
- Clerk account with publishable and secret keys

### Setup

```bash
# Clone and install all workspace dependencies
npm install

# Copy environment files for each app
cp apps/backend-express/.env.example apps/backend-express/.env
cp apps/backend-nestjs/.env.example apps/backend-nestjs/.env
cp apps/frontend-nextjs/.env.example apps/frontend-nextjs/.env
cp apps/frontend-svelte/.env.example apps/frontend-svelte/.env
# Fill in CLERK_SECRET_KEY and CLERK_PUBLISHABLE_KEY in each .env
```

### Running Applications

```bash
# Backend (choose one — both run on port 3001)
npm run dev:express    # Express.js backend
npm run dev:nestjs     # NestJS backend

# Frontend (choose one or both)
npm run dev:nextjs     # Next.js on port 3000
npm run dev:svelte     # SvelteKit on port 5173

# Seed the database with sample data
npm run seed:express   # For Express backend
npm run seed:nestjs    # For NestJS backend

# Build all workspaces
npm run build
```

### Typical Development Loop

1. Start a backend (`npm run dev:express` or `npm run dev:nestjs`).
2. Seed the database if empty (`npm run seed:express`).
3. Start a frontend (`npm run dev:nextjs` or `npm run dev:svelte`).
4. Make changes — both frontends support hot reload.
5. If editing `packages/shared`, rebuild it: `cd packages/shared && npm run build`.

## Code Review Expectations

- All changes should be reviewed before merging to `main`.
- **Checklist**:
  1. TypeScript strict mode passes with no errors.
  2. Changes to shared types are reflected in both backends and both frontends.
  3. New API endpoints include proper error handling and auth middleware.
  4. Frontend changes are responsive (test mobile and desktop viewports).
  5. No hardcoded secrets or credentials in source files.
  6. Conventional Commit message format is used.
- See [AGENTS.md](../../AGENTS.md) for agent-specific collaboration tips.

## Onboarding Tasks

1. Read the [Project Overview](./project-overview.md) and [Architecture Notes](./architecture.md).
2. Set up local environment following the steps above.
3. Explore the dashboard UI and create/edit a franchise to understand the data flow.
4. Review `packages/shared/src/types.ts` to understand the core data model.
5. Pick a starter task: add input validation to the Express backend, or add a loading skeleton to a Svelte page.

## Related Resources

- [testing-strategy.md](./testing-strategy.md)
- [tooling.md](./tooling.md)
