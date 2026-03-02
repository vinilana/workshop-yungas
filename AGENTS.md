# AGENTS.md -- Franchise Manager MVP

## 1. Project Classification

| Project | Path | Stack | Port | Status |
|---|---|---|---|---|
| Backend NestJS | `apps/backend-nestjs` | NestJS 10.4, better-sqlite3 | 3001 | **ACTIVE** |
| Frontend SvelteKit | `apps/frontend-svelte` | SvelteKit 2.0, Svelte 5, Tailwind CSS | 5173 | **ACTIVE** |
| Shared Package | `packages/shared` | TypeScript (types, DTOs, constants, seed data) | -- | **ACTIVE** |
| Backend Express | `apps/backend-express` | Express.js 4.21 | 3000 | LEGACY |
| Frontend Next.js | `apps/frontend-nextjs` | Next.js 14, React | 3000 | LEGACY |

> **NEVER implement new features in Express.js or Next.js projects. These are LEGACY. All new development targets NestJS + SvelteKit.**

---

## 2. Agent Rules

1. **New features** go to `apps/backend-nestjs` (API) and `apps/frontend-svelte` (UI). No exceptions.
2. **Legacy projects** (`apps/backend-express`, `apps/frontend-nextjs`) receive critical bug fixes only. Do not add routes, pages, or logic.
3. **Always start with shared types.** Before writing backend or frontend code, define or update interfaces and DTOs in `packages/shared/src/types.ts` and re-export from `packages/shared/src/index.ts`.
4. **Rebuild shared after every change:**
   ```bash
   npm run build:shared
   ```
5. **Auth is Clerk-based.** Backend uses `ClerkGuard`; frontend uses `svelte-clerk` components (`ClerkProvider`, `SignedIn`, `UserButton`). Do not introduce alternative auth flows.
6. **Database is SQLite via better-sqlite3.** Accessed through NestJS `DatabaseService`. No ORM -- raw SQL with typed results.
7. **Styling is Tailwind CSS.** Follow the existing utility-class patterns; do not add CSS-in-JS or external component libraries without approval.

---

## 3. Development Workflow

Step-by-step for implementing a new feature:

```
1. Define types      packages/shared/src/types.ts   (interface + DTO)
2. Rebuild shared    npm run build:shared
3. Backend module    apps/backend-nestjs/src/<feature>/
                       - <feature>.module.ts
                       - <feature>.controller.ts
                       - <feature>.service.ts
4. Frontend route    apps/frontend-svelte/src/routes/<feature>/
                       - +page.svelte  (UI)
                       - +page.server.ts  (load function, if needed)
5. API client        apps/frontend-svelte/src/lib/api.ts  (add fetch helpers)
6. Manual test       npm run dev:nestjs  &  npm run dev:svelte
7. Commit            Use conventional commits (see section 7)
```

### Useful scripts

| Command | What it does |
|---|---|
| `npm run dev:nestjs` | Start NestJS dev server (port 3001) |
| `npm run dev:svelte` | Start SvelteKit dev server (port 5173) |
| `npm run build:shared` | Compile shared package |
| `npm run build` | Build all workspaces |
| `npm run seed:nestjs` | Seed NestJS SQLite database |

---

## 4. Key Entry Points

### Backend NestJS (`apps/backend-nestjs/src/`)

| File | Purpose |
|---|---|
| `main.ts` | Bootstrap, CORS, ValidationPipe, port 3001 |
| `app.module.ts` | Root module -- imports DatabaseModule, AuthModule, FranchiseModule |
| `database/database.service.ts` | SQLite connection via better-sqlite3 |
| `auth/clerk.guard.ts` | Clerk JWT verification guard |
| `auth/auth.module.ts` | Auth module exposing ClerkGuard |
| `franchise/franchise.module.ts` | Franchise feature module |
| `franchise/franchise.controller.ts` | REST endpoints for franchises |
| `franchise/franchise.service.ts` | Business logic and DB queries |
| `seed.ts` | Database seeding script |

### Frontend SvelteKit (`apps/frontend-svelte/src/`)

| File | Purpose |
|---|---|
| `routes/+layout.svelte` | Root layout -- ClerkProvider, nav, toast system |
| `routes/+layout.server.ts` | Server-side layout load (auth data) |
| `routes/+page.svelte` | Landing / index page |
| `routes/dashboard/+page.svelte` | Dashboard view |
| `routes/franchises/new/+page.svelte` | Create franchise form |
| `routes/franchises/[id]/+page.svelte` | Franchise detail / edit page |
| `lib/api.ts` | API client (fetch wrappers to backend) |
| `lib/clerk.ts` | Clerk client-side helpers |
| `lib/stores/auth.ts` | Auth state store |
| `lib/stores/toast.ts` | Toast notification store |
| `hooks.server.ts` | Server hooks (auth middleware) |
| `app.d.ts` | SvelteKit type declarations |

### Shared Package (`packages/shared/src/`)

| File | Purpose |
|---|---|
| `index.ts` | Barrel re-export of all shared modules |
| `types.ts` | `Franchise`, `CreateFranchiseDTO`, `UpdateFranchiseDTO`, `ApiResponse`, `ApiErrorResponse` |
| `constants.ts` | Shared constants |
| `seed-data.ts` | Seed data used by both backends |

---

## 5. Architecture Patterns

### NestJS Backend

- **Module pattern:** every feature gets its own module (`@Module`) with a controller and a service.
- **Controllers** handle HTTP (decorators: `@Get`, `@Post`, `@Patch`, `@Delete`). No business logic in controllers.
- **Services** own business logic and database access. Inject `DatabaseService` for queries.
- **Guards** protect routes. Apply `@UseGuards(ClerkGuard)` on controllers or individual routes that require auth.
- **ValidationPipe** is global -- use `class-validator` decorators on DTOs for automatic request validation.
- **CORS** is enabled globally in `main.ts`.

### SvelteKit Frontend

- **File-based routing:** `src/routes/<path>/+page.svelte` maps to URL path.
- **Svelte 5 runes:** use `$state`, `$derived`, `$effect`, `$props` instead of Svelte 4 stores / reactive declarations.
- **`$props()`** for component inputs (replaces `export let`).
- **`{@render children()}`** for slot content (replaces `<slot />`).
- **Stores** (`$lib/stores/`) for cross-component state (auth, toast). Use Svelte's `writable`/`readable` where runes are insufficient.
- **API calls** go through `$lib/api.ts` -- centralized fetch wrapper with auth headers.
- **Layouts** use `+layout.svelte` / `+layout.server.ts` for shared UI and data loading.

---

## 6. Testing

There is no automated test suite yet. This is a planned next step. When tests are introduced:

- Backend: use NestJS built-in testing (`@nestjs/testing`) with Jest.
- Frontend: use Vitest + `@testing-library/svelte`.
- Shared: unit tests with Vitest.
- Run all: `npm test` from root (once configured).

Until tests exist, manually verify changes by running both dev servers and testing in the browser.

---

## 7. PR and Commit Instructions

Follow **Conventional Commits**:

```
feat(franchise): add revenue tracking endpoint
fix(auth): handle expired Clerk tokens gracefully
refactor(database): extract query builder helper
chore(deps): update svelte-clerk to 1.x
docs(agents): update AGENTS.md with new patterns
```

Rules:
- Scope should match the feature or module name (e.g., `franchise`, `auth`, `database`, `dashboard`).
- Keep subject line under 72 characters.
- Reference related issues when applicable (`closes #42`).
- PRs should contain a summary and a test plan.

---

## 8. AI Context References

For deeper context, refer to the `.context/` directory:

### Documentation (``.context/docs/``)
- `README.md` -- Documentation index
- `project-overview.md` -- High-level project description
- `architecture.md` -- System architecture details
- `data-flow.md` -- Data flow between components
- `development-workflow.md` -- Extended development workflow
- `glossary.md` -- Domain terminology
- `security.md` -- Security considerations
- `testing-strategy.md` -- Future testing strategy
- `tooling.md` -- Tooling and infrastructure
- `codebase-map.json` -- Machine-readable codebase structure

### Agent Playbooks (`.context/agents/`)
- `README.md` -- Agent index
- `feature-developer.md` -- How to build new features
- `backend-specialist.md` -- NestJS backend guidance
- `frontend-specialist.md` -- SvelteKit frontend guidance
- `database-specialist.md` -- SQLite / data layer guidance
- `bug-fixer.md` -- Bug investigation and fixing
- `code-reviewer.md` -- Code review checklist
- `architect-specialist.md` -- Architecture decisions
- `security-auditor.md` -- Security review
- `refactoring-specialist.md` -- Refactoring patterns
- `test-writer.md` -- Test authoring guidance
- `documentation-writer.md` -- Documentation standards
- `devops-specialist.md` -- DevOps and deployment
- `performance-optimizer.md` -- Performance tuning

### Skills (`.context/skills/`)
- `api-design/SKILL.md` -- API endpoint design
- `bug-investigation/SKILL.md` -- Bug triage workflow
- `code-review/SKILL.md` -- Review checklist
- `commit-message/SKILL.md` -- Commit message formatting
- `documentation/SKILL.md` -- Documentation generation
- `feature-breakdown/SKILL.md` -- Feature decomposition
- `pr-review/SKILL.md` -- Pull request review
- `refactoring/SKILL.md` -- Safe refactoring steps
- `security-audit/SKILL.md` -- Security audit checklist
- `test-generation/SKILL.md` -- Test generation patterns
