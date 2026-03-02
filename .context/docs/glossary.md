---
type: doc
name: glossary
description: Project terminology, type definitions, domain entities, and business rules
category: glossary
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Glossary & Domain Concepts

This project manages franchise operations for a Brazilian franchise network. All business terminology and data models center around the `Franchise` entity and its lifecycle.

## Type Definitions

| Type | Kind | File | Description |
|------|------|------|-------------|
| `Franchise` | interface | `packages/shared/src/types.ts:1` | Core entity: id, name, ownerName, email, phone, address, city, state, status, timestamps |
| `FranchiseStatus` | type | `packages/shared/src/types.ts:15` | Union type: `"active" \| "inactive" \| "pending"` |
| `CreateFranchiseDTO` | interface | `packages/shared/src/types.ts:17` | Input for creating a franchise (name, ownerName, email required; phone, address, city, state, status optional) |
| `UpdateFranchiseDTO` | interface | `packages/shared/src/types.ts:28` | Partial input for updating a franchise (all fields optional) |
| `ApiResponse<T>` | interface | `packages/shared/src/types.ts:39` | Standard success response wrapper: `{ data: T, message?: string }` |
| `ApiErrorResponse` | interface | `packages/shared/src/types.ts:44` | Standard error response: `{ error: string, message?: string }` |
| `SeedFranchise` | interface | `packages/shared/src/seed-data.ts:3` | Shape of seed data entries for database population |
| `FranchiseRow` | interface | `franchise.service.ts:9`, `franchises.ts:14` | Internal DB row representation with snake_case column mapping |
| `Toast` | interface | `apps/frontend-svelte/src/lib/stores/toast.ts:3` | Toast notification shape: id, message, type, duration |

## Enumerations

No formal enums are used. Status values are defined as a type union and a constant array:

- `FranchiseStatus`: `"active" | "inactive" | "pending"` (type alias)
- `FRANCHISE_STATUSES`: `["active", "inactive", "pending"]` (runtime constant)
- `BRAZILIAN_STATES`: Array of 27 Brazilian state codes (`"AC"`, `"AL"`, ..., `"TO"`)

## Core Terms

| Term | Definition | Where It Appears |
|------|-----------|-----------------|
| **Franchise** | A licensed business unit in the network. The primary entity managed by this system. | All apps, shared types, database schema |
| **Owner** | The person responsible for operating a franchise (`owner_name` / `ownerName` field). | `Franchise` interface, create/edit forms, database |
| **Status** | The operational state of a franchise: `active` (operating), `pending` (awaiting approval), or `inactive` (suspended/closed). | Status badges, filters, dashboard metrics |
| **Dashboard** | The main page displaying franchise list, search, and status summary metrics. | `/dashboard` route in both frontends |
| **Seed Data** | 10 pre-configured franchise records for development and testing. | `packages/shared/src/seed-data.ts`, seed scripts |

## Acronyms & Abbreviations

| Abbreviation | Expansion | Context |
|-------------|-----------|---------|
| **DTO** | Data Transfer Object | Input validation shapes for API requests |
| **MVP** | Minimum Viable Product | Project stage — initial feature set |
| **CRUD** | Create, Read, Update, Delete | Core franchise operations |
| **JWT** | JSON Web Token | Clerk authentication token format |
| **WAL** | Write-Ahead Logging | SQLite journal mode for better concurrency |
| **CORS** | Cross-Origin Resource Sharing | Backend middleware allowing frontend requests |
| **SSR** | Server-Side Rendering | Next.js rendering strategy |

## Personas / Actors

| Persona | Goals | Key Workflows |
|---------|-------|---------------|
| **Franchise Manager** | Oversee all franchise units, track status, manage data | View dashboard, search/filter franchises, create new franchises, update status |
| **Admin** | Full CRUD access to franchise records | All manager workflows plus delete franchises, bulk operations |
| **Developer** | Build and extend the system | Local development, seed database, test API endpoints, deploy |

## Domain Rules & Invariants

1. **Required fields**: `name`, `owner_name`, and `email` are mandatory when creating a franchise.
2. **Status lifecycle**: New franchises default to `"pending"` status. They can transition to `"active"` or `"inactive"` via update.
3. **Brazilian states**: The `state` field must be one of the 27 valid Brazilian state codes defined in `BRAZILIAN_STATES`.
4. **Unique identity**: Each franchise has an auto-incrementing integer `id` as its primary key.
5. **Timestamps**: `created_at` and `updated_at` are auto-managed by the database. `updated_at` refreshes on every update.
6. **Authentication required**: All API operations require a valid Clerk JWT token. Unauthenticated requests receive 401.
7. **Search**: The search parameter matches against `name`, `owner_name`, `email`, and `city` fields using SQL `LIKE`.

## Related Resources

- [project-overview.md](./project-overview.md)
