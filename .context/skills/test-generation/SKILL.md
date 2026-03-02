---
type: skill
name: Test Generation
description: Generate comprehensive test cases for code
skillSlug: test-generation
phases: [E, V]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# Test Generation

## When to Use
Activate this skill when generating test cases for existing or new code. Use it after implementing a feature, fixing a bug, or when increasing test coverage.

## Instructions

1. **Identify the test target**: Determine what to test (service method, route handler, component, utility).
2. **Choose the test framework**:
   - NestJS backend → Jest with `@nestjs/testing`
   - Express backend → Jest with `supertest`
   - Next.js frontend → Vitest with React Testing Library
   - SvelteKit frontend → Vitest with `@testing-library/svelte`
   - Shared package → Jest
3. **Set up test environment**:
   - Use `:memory:` SQLite database for backend tests.
   - Mock Clerk auth middleware/guard (return a fake userId).
   - Mock API client functions for frontend component tests.
4. **Write test cases** following AAA pattern (Arrange, Act, Assert):
   - **Happy path**: Valid input produces expected output.
   - **Validation errors**: Missing required fields return 400.
   - **Not found**: Invalid IDs return 404.
   - **Auth errors**: Missing/invalid tokens return 401.
   - **Edge cases**: Empty search, special characters, max-length strings.
5. **Name tests descriptively**: `it('should return 404 when franchise does not exist')`.

## Examples

### NestJS Service Test
```typescript
describe('FranchiseService', () => {
  it('should create a franchise with valid data', async () => {
    const dto: CreateFranchiseDTO = {
      name: 'Test Franchise',
      ownerName: 'John Doe',
      email: 'john@example.com',
    };
    const result = await service.create(dto);
    expect(result).toHaveProperty('id');
    expect(result.name).toBe('Test Franchise');
    expect(result.status).toBe('pending');
  });

  it('should return all franchises matching search term', async () => {
    const results = await service.findAll('São Paulo');
    expect(results.every(f => f.city === 'São Paulo')).toBe(true);
  });
});
```

### Express Integration Test
```typescript
describe('GET /api/franchises', () => {
  it('should return 200 with franchise list', async () => {
    const res = await request(app)
      .get('/api/franchises')
      .set('Authorization', 'Bearer test-token');
    expect(res.status).toBe(200);
    expect(res.body.data).toBeInstanceOf(Array);
  });
});
```
