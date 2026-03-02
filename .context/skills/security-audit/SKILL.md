---
type: skill
name: Security Audit
description: Security review checklist for code and infrastructure
skillSlug: security-audit
phases: [R, V]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# Security Audit

## When to Use
Activate this skill when performing a security review of code changes or the overall application. Use it for pre-release audits, PR security checks, or periodic security assessments.

## Instructions

### Authentication & Authorization
- [ ] All `/api/*` endpoints require valid Clerk JWT token.
- [ ] Express uses `clerkMiddleware()` from `@clerk/express`.
- [ ] NestJS uses `ClerkAuthGuard` applied globally via `APP_GUARD`.
- [ ] Frontend middleware protects `/dashboard/*` and `/franchises/*` routes.
- [ ] Token is validated for expiration (`exp` claim).
- [ ] **Known issue**: NestJS `ClerkAuthGuard` does not verify JWT signature — uses base64 decode only. Flag for production fix.

### SQL Injection Prevention
- [ ] All SQL queries use parameterized statements (`?` placeholders with `better-sqlite3`).
- [ ] No string concatenation or template literals in SQL queries.
- [ ] User input never inserted directly into SQL strings.

### Secrets Management
- [ ] `.env` files are listed in `.gitignore`.
- [ ] `*.db` database files are excluded from version control.
- [ ] No hardcoded API keys, secrets, or credentials in source code.
- [ ] `.env.example` files contain only placeholder values.

### Input Validation
- [ ] Required fields validated: `name`, `owner_name`, `email` for franchise creation.
- [ ] `status` field accepts only valid values: `active`, `inactive`, `pending`.
- [ ] `state` field accepts only valid Brazilian state codes from `BRAZILIAN_STATES`.
- [ ] NestJS uses `class-validator` for DTO validation.

### CORS & Headers
- [ ] CORS allows only expected origins (localhost for dev, configured domains for prod).
- [ ] No wildcard `*` CORS in production configuration.
- [ ] Error responses don't leak internal implementation details or stack traces.

### Data Protection
- [ ] Franchise data (emails, phones, addresses) not exposed to unauthenticated users.
- [ ] No sensitive data in frontend source code or browser console logs.
- [ ] Database files stored outside the web root.

## Examples

**Finding report format:**

| Severity | Finding | Location | Remediation |
|----------|---------|----------|-------------|
| High | JWT signature not verified | `clerk.guard.ts:10` | Use Clerk SDK's `verifyToken()` instead of manual base64 decode |
| Medium | No rate limiting on API | `index.ts` | Add `express-rate-limit` middleware |
| Low | CORS allows all localhost ports | `index.ts` | Restrict to specific ports in production |
