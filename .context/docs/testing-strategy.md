---
type: doc
name: testing-strategy
description: Test frameworks, patterns, coverage requirements, and quality gates
category: testing
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Testing Strategy

Testing infrastructure is not yet configured for this project. This document outlines the recommended approach and planned quality gates.

## Test Types

### Unit Tests (Planned)
- **Backend (NestJS)**: Jest with `@nestjs/testing` for service and controller tests.
- **Backend (Express)**: Jest with `supertest` for route handler tests.
- **Shared Package**: Jest for type guards and utility function tests.
- **Frontend (Next.js)**: Vitest with React Testing Library for component tests.
- **Frontend (SvelteKit)**: Vitest with `@testing-library/svelte` for component tests.
- **File naming**: `*.test.ts` / `*.test.tsx` co-located alongside source files, or in `__tests__/` directories.

### Integration Tests (Planned)
- **API integration**: Supertest against Express/NestJS endpoints with an in-memory SQLite database.
- **Frontend integration**: Test full page flows (dashboard load, create franchise, edit franchise, delete franchise).

### E2E Tests (Future)
- **Framework**: Playwright or Cypress.
- **Coverage**: Sign-in flow, CRUD operations, search/filter, responsive layout.

## Running Tests

```bash
# Run all tests (once configured)
npm run test

# Watch mode for iterating on failing specs
npm run test -- --watch

# Run tests for a specific workspace
npm run test --workspace=apps/backend-nestjs

# Build + test (mimics CI)
npm run build && npm run test
```

## Quality Gates

- **Minimum coverage target**: 70% line coverage for backend services, 60% for frontend components.
- **Linting**: TypeScript strict mode (`"strict": true` in `tsconfig.base.json`). No `any` types without justification.
- **Formatting**: Consistent code style enforced by editor settings (no Prettier/ESLint configured yet — recommended addition).
- **Pre-merge**: All tests must pass. Shared package must build cleanly.

## Troubleshooting

- **SQLite in tests**: Use `:memory:` databases for test isolation. Avoid sharing database files between test suites.
- **Clerk in tests**: Mock the auth middleware/guard for unit tests. Use test tokens or bypass auth for integration tests.
- **NestJS module initialization**: Use `Test.createTestingModule()` to create isolated module instances with mocked dependencies.
- **Svelte 5 runes in tests**: Ensure test environment supports Svelte 5 compilation. Use `@testing-library/svelte` v5+.

## Related Resources

- [development-workflow.md](./development-workflow.md)
