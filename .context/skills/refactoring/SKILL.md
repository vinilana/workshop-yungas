---
type: skill
name: Refactoring
description: Safe code refactoring with step-by-step approach
skillSlug: refactoring
phases: [E]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# Refactoring

## When to Use
Activate this skill when improving code structure without changing external behavior. Use it for extracting utilities, reducing duplication, improving naming, or simplifying complex logic.

## Instructions

1. **Identify the smell**: Name the specific code smell (duplication, long method, feature envy, magic values, etc.).
2. **Plan the refactoring**:
   - List all files that will be affected.
   - Verify no external behavior will change (same API endpoints, same UI rendering).
   - Check if tests exist for the affected code (if not, consider writing tests first).
3. **Execute in small steps**:
   - Make one change at a time.
   - Verify the app still works after each step.
   - Use git to commit each step separately for easy rollback.
4. **Common refactorings for this project**:
   - **Extract row mapper**: Both backends have identical `FranchiseRow` → `Franchise` mapping. Extract to `packages/shared`.
   - **Unify API client**: `lib/api.ts` in Next.js and SvelteKit are nearly identical. Extract shared logic.
   - **Extract validation**: Both backends validate required fields inline. Create a shared validation function.
   - **Constants for SQL**: Move SQL query strings to named constants for readability.
5. **Verify**:
   - Run both backends and test CRUD operations.
   - Run both frontends and verify all pages render correctly.
   - Check TypeScript compilation passes in strict mode.
6. **Legacy project policy**: Focus refactoring efforts on the active stack (NestJS/SvelteKit) only. Do not invest refactoring time in legacy projects (Express/Next.js) as they are in maintenance-only mode. Shared utilities in `packages/shared` may still be refactored since they serve both stacks.

## Examples

**Before (duplicated in both backends):**
```typescript
const franchise = {
  id: row.id,
  name: row.name,
  ownerName: row.owner_name,
  email: row.email,
  phone: row.phone,
  address: row.address,
  city: row.city,
  state: row.state,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
};
```

**After (shared utility):**
```typescript
// packages/shared/src/mappers.ts
export function mapRowToFranchise(row: FranchiseRow): Franchise {
  return {
    id: row.id,
    name: row.name,
    ownerName: row.owner_name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    status: row.status as FranchiseStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
```
