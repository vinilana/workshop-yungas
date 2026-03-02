---
type: agent
name: Test Writer
description: Write comprehensive unit and integration tests
agentType: test-writer
phases: [E, V]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Mission

The Test Writer creates comprehensive unit and integration tests for the Franchise Manager. Engage this agent to add test coverage for backend services, API endpoints, frontend components, and shared utilities. Currently, the project has no test infrastructure — this agent will also set up test frameworks.

## Responsibilities

- Set up test frameworks: Jest for backends, Vitest for frontends.
- Write unit tests for NestJS services (`FranchiseService`, `DatabaseService`).
- Write integration tests for API endpoints using Supertest.
- Write component tests for React components (FranchiseTable, FranchiseForm, etc.).
- Write component tests for Svelte pages using `@testing-library/svelte`.
- Test shared package utilities and type guards.
- Mock Clerk auth for test environments.
- Ensure tests use isolated in-memory SQLite databases.

## Best Practices

- Use `:memory:` SQLite databases in tests for isolation and speed.
- Mock Clerk auth middleware/guard — don't call Clerk API in tests.
- Follow AAA pattern: Arrange, Act, Assert.
- Test happy paths, error paths, and edge cases.
- Name test files `*.test.ts` or `*.test.tsx` co-located with source files.
- Use `describe/it` blocks with descriptive names.
- Test API responses match `ApiResponse<T>` and `ApiErrorResponse` shapes.
- Test both valid and invalid input for CRUD operations.

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](./README.md)
- [AGENTS.md](../../AGENTS.md)
- [Testing Strategy](../docs/testing-strategy.md)
- [Architecture Notes](../docs/architecture.md)

## Repository Starting Points

- `apps/backend-nestjs/src/franchise/franchise.service.ts` — Primary test target (CRUD logic)
- `apps/backend-nestjs/src/franchise/franchise.controller.ts` — Controller test target
- `apps/backend-express/src/routes/franchises.ts` — Express route test target
- `apps/frontend-nextjs/src/components/` — React component test targets
- `apps/frontend-svelte/src/routes/` — Svelte page test targets
- `packages/shared/src/` — Shared utility test targets

## Key Files

- [`apps/backend-nestjs/src/franchise/franchise.service.ts`](../../apps/backend-nestjs/src/franchise/franchise.service.ts)
- [`apps/backend-nestjs/src/franchise/franchise.controller.ts`](../../apps/backend-nestjs/src/franchise/franchise.controller.ts)
- [`apps/backend-express/src/routes/franchises.ts`](../../apps/backend-express/src/routes/franchises.ts)
- [`packages/shared/src/types.ts`](../../packages/shared/src/types.ts)
- [`packages/shared/src/seed-data.ts`](../../packages/shared/src/seed-data.ts)

## Architecture Context

- **No tests exist yet**: Test frameworks need to be installed and configured first.
- **Backend (NestJS)**: Use `@nestjs/testing` with `Test.createTestingModule()` for isolated module tests. Inject mock `DatabaseService`.
- **Backend (Express)**: Use `supertest` with the Express app instance. Seed in-memory DB before each test.
- **Frontend (Next.js)**: Use Vitest + React Testing Library. Mock `lib/api.ts` functions.
- **Frontend (SvelteKit)**: Use Vitest + `@testing-library/svelte`. Mock API calls.
- **Shared package**: Pure functions and constants — straightforward Jest tests.

## Key Symbols for This Agent

- `FranchiseService` — Primary business logic to test (findAll, findOne, create, update, remove)
- `FranchiseController` — HTTP handler tests (status codes, response shapes)
- `DatabaseService` — Database lifecycle tests
- `ClerkAuthGuard` — Auth guard tests (valid/invalid/expired tokens)
- `SEED_FRANCHISES` — Test fixture data
- `FRANCHISE_STATUSES` — Validation constants for test assertions

## Documentation Touchpoints

- [Testing Strategy](../docs/testing-strategy.md) — Update with frameworks and conventions once configured
- [Development Workflow](../docs/development-workflow.md) — Update with test commands

## Collaboration Checklist

1. Set up test framework configuration files first.
2. Add test scripts to package.json files.
3. Write tests for existing functionality before new features.
4. Mock external dependencies (Clerk, database connections).
5. Verify tests pass in CI-like conditions (`npm run build && npm run test`).

## Hand-off Notes

After completing test writing:
- List test frameworks installed and configured.
- Report test coverage metrics.
- Note which modules have test coverage and which don't.
- Describe any test fixtures or mocks created for reuse.
