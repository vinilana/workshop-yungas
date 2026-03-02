---
type: skill
name: Api Design
description: Design RESTful APIs following best practices
skillSlug: api-design
phases: [P, R]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---

# API Design

## When to Use
Activate this skill when designing new API endpoints or reviewing existing ones. It ensures RESTful conventions, consistent response shapes, and proper HTTP semantics.

## Instructions

1. **Follow existing conventions**:
   - Base path: `/api/` prefix for all endpoints.
   - Resource naming: plural nouns (`/api/franchises`, not `/api/franchise`).
   - Route constants: Define paths in `packages/shared/src/constants.ts` under `API_ROUTES`.
2. **HTTP methods**:
   - `GET` — Read (list or single resource). Never mutate state.
   - `POST` — Create a new resource. Return 201 with created entity.
   - `PUT` — Full update of a resource.
   - `PATCH` — Partial update of a resource.
   - `DELETE` — Remove a resource.
3. **Response envelopes**:
   - Success: `ApiResponse<T>` — `{ data: T, message?: string }`
   - Error: `ApiErrorResponse` — `{ error: string, message?: string }`
4. **Status codes**:
   - `200` — Successful read or update
   - `201` — Successful creation
   - `400` — Validation error (missing required fields, invalid data)
   - `401` — Missing or invalid authentication token
   - `404` — Resource not found
   - `500` — Internal server error
5. **Query parameters**:
   - `?search=term` — Full-text search across relevant fields
   - `?page=1&limit=20` — Pagination (future)
   - `?status=active` — Filtering (future)
6. **Input validation**:
   - NestJS: Use `class-validator` decorators on DTO classes.
   - Express: Manual validation checking required fields before processing.
   - Always validate: `name` (required), `owner_name` (required), `email` (required, format).
7. **Legacy policy**: New API endpoints must be designed for NestJS only. The Express.js API is frozen (legacy) and should not receive new endpoints or features. Only critical bug fixes are permitted in the Express backend. Existing dual-implementation endpoints remain as-is, but new work targets NestJS exclusively.

## Examples

**Endpoint specification:**

```
POST /api/franchises
Authorization: Bearer <token>
Content-Type: application/json

Request:
{
  "name": "Franchise São Paulo",
  "ownerName": "Maria Silva",
  "email": "maria@example.com",
  "phone": "(11) 99999-0000",
  "city": "São Paulo",
  "state": "SP",
  "status": "pending"
}

Response (201):
{
  "data": {
    "id": 11,
    "name": "Franchise São Paulo",
    "ownerName": "Maria Silva",
    "email": "maria@example.com",
    "phone": "(11) 99999-0000",
    "address": null,
    "city": "São Paulo",
    "state": "SP",
    "status": "pending",
    "createdAt": "2026-03-02T12:00:00.000Z",
    "updatedAt": "2026-03-02T12:00:00.000Z"
  }
}

Response (400):
{
  "error": "Validation failed",
  "message": "name, ownerName, and email are required"
}
```
