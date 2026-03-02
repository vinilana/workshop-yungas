---
type: skill
name: Bug Investigation
description: Systematic bug investigation and root cause analysis
skillSlug: bug-investigation
phases: [E, V]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# Bug Investigation

## When to Use
Activate this skill when investigating a bug report, error message, or unexpected behavior. It provides a systematic approach to root cause analysis.

## Instructions

1. **Reproduce the bug**:
   - Identify the exact steps to trigger the issue.
   - Note the environment: which backend (Express/NestJS)? Which frontend (Next.js/SvelteKit)?
   - Capture the error message, HTTP status code, or unexpected UI behavior.
2. **Classify the bug**:
   - **API error (4xx/5xx)**: Check backend logs, route handlers, service methods, SQL queries.
   - **Auth error (401)**: Check Clerk token retrieval, Bearer header attachment, guard/middleware config.
   - **UI error**: Check component state, API client response parsing, rendering logic.
   - **Data error**: Check DB schema, column mapping (`snake_case` → `camelCase`), seed data.
3. **Trace the data flow**:
   - Frontend: `page.tsx`/`+page.svelte` → `lib/api.ts` → HTTP request
   - Backend: Middleware → Route/Controller → Service → Database → Response
   - Identify which layer the bug originates from.
4. **Check both implementations**:
   - Does the bug exist in both Express and NestJS?
   - Does the bug exist in both Next.js and SvelteKit?
   - If only one implementation is affected, the bug is in implementation-specific code.
5. **Apply the fix**:
   - Make the smallest possible change to resolve the issue.
   - Fix in all affected implementations.
   - Test the fix end-to-end.
6. **Prevent regression**:
   - Suggest a test case that would catch this bug.
   - Update documentation if the bug revealed a misunderstanding.
7. **Legacy project triage**: For bugs in legacy projects (Express/Next.js), only critical issues warrant fixes. Non-critical bugs should be documented for reference but not fixed, as these projects are in maintenance-only mode. Prioritize investigating and fixing bugs in the active stack (NestJS/SvelteKit).

## Examples

**API 500 error investigation:**
```
Symptom: POST /api/franchises returns 500
Trace: Controller receives request → Service.create() called → SQL INSERT fails
Root cause: Missing NOT NULL column 'owner_name' in INSERT statement
Fix: Add owner_name to the INSERT query in both backends
Test: POST with valid data should return 201; POST without owner_name should return 400
```

**UI state bug investigation:**
```
Symptom: Dashboard shows stale data after creating a franchise
Trace: NewFranchisePage → createFranchise() → redirect to /dashboard → page loads cached data
Root cause: Dashboard page doesn't refetch on navigation (Next.js client-side cache)
Fix: Add cache invalidation or force refetch on dashboard mount
```
