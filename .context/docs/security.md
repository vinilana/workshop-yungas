---
type: doc
name: security
description: Security policies, authentication, secrets management, and compliance requirements
category: security
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Security & Compliance Notes

Security in the Franchise Manager relies on Clerk for authentication and standard web security practices (CORS, HTTPS, JWT validation). This document captures the current security posture and areas for improvement.

## Authentication & Authorization

### Identity Provider
- **Clerk** manages all user identity, session creation, and sign-in UI.
- Users authenticate via Clerk's hosted sign-in page or embedded components.

### Token Flow
1. User signs in via Clerk UI → receives a session JWT.
2. Frontend calls `getToken()` to retrieve the current session token.
3. Token is sent as `Authorization: Bearer <token>` header on every API request.
4. Backend validates the token before processing the request.

### Backend Validation

**Express** (`apps/backend-express/src/middleware/auth.ts`):
- Uses `clerkMiddleware()` from `@clerk/express` on all `/api` routes.
- Middleware validates JWT signature and expiration using Clerk's SDK.

**NestJS** (`apps/backend-nestjs/src/auth/clerk.guard.ts`):
- Custom `ClerkAuthGuard` implements `CanActivate`.
- Decodes JWT payload (base64url), checks `exp` claim, extracts `userId` and `sessionId`.
- Applied globally via `APP_GUARD` provider in `AuthModule`.

### Authorization
- **Current state**: No role-based access control. All authenticated users have full CRUD access.
- **Recommended improvement**: Add role claims to Clerk metadata and enforce permissions per endpoint.

## Secrets & Sensitive Data

### Required Secrets

| Secret | Used By | Purpose |
|--------|---------|---------|
| `CLERK_SECRET_KEY` | All backends | Server-side JWT validation |
| `CLERK_PUBLISHABLE_KEY` | All frontends | Client-side Clerk initialization |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Next.js frontend | Public key for Next.js env convention |
| `PUBLIC_CLERK_PUBLISHABLE_KEY` | Svelte frontend | Public key for SvelteKit env convention |

### Storage
- Secrets are stored in `.env` files per app (not committed to git).
- `.env.example` files provide templates without actual values.
- `.gitignore` should exclude all `.env` files and `*.db` database files.

### Data Classification
- **Franchise data**: Business data (names, emails, phones, addresses). Not classified as PII under strict definitions, but should be treated with care.
- **Database files**: `franchises.db` files contain all franchise records. Should not be committed to version control.

## Compliance & Policies

### Web Security Headers
- **CORS**: Configured on both backends to allow requests from localhost origins and environment-configured domains.
- **No CSP**: Content Security Policy headers are not configured. Recommended for production.
- **No rate limiting**: API endpoints have no request throttling. Recommended: add rate limiting middleware.

### Input Validation
- **NestJS**: Uses `class-validator` for DTO validation on incoming requests.
- **Express**: Manual validation in route handlers. Checks for required fields (`name`, `owner_name`, `email`).
- **Frontend**: Form-level validation before submission.
- **SQL injection**: Parameterized queries via better-sqlite3 prepared statements. Not vulnerable to SQL injection.

### Known Security Gaps
1. **No RBAC**: All authenticated users have equal access.
2. **No rate limiting**: API is vulnerable to brute-force or DDoS attempts.
3. **No audit logging**: No record of who modified which franchise and when.
4. **No HTTPS enforcement**: Relies on deployment infrastructure for TLS termination.
5. **NestJS guard is simplified**: The custom `ClerkAuthGuard` does base64 decoding without full signature verification — it should use Clerk's SDK for production.

## Incident Response

- **Current state**: No formal incident response process. MVP-stage project.
- **Recommended**:
  1. Enable Clerk's security event webhooks for suspicious login detection.
  2. Add structured logging with request IDs for traceability.
  3. Set up error alerting (e.g., Sentry) for 500-level responses.
  4. Rotate Clerk secrets if compromised and redeploy all apps.

## Related Resources

- [architecture.md](./architecture.md)
