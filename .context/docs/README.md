# Documentation Index

## Project Classification

| Application | Directory | Framework | Status |
|---|---|---|---|
| Backend (Express) | `apps/backend-express` | Express.js 4.21 | **Legacy** -- maintenance only |
| Backend (NestJS) | `apps/backend-nestjs` | NestJS 10.4 | **Active** -- all new development |
| Frontend (Next.js) | `apps/frontend-nextjs` | Next.js 14 / React 18 | **Legacy** -- maintenance only |
| Frontend (SvelteKit) | `apps/frontend-svelte` | SvelteKit 2.0 / Svelte 5 | **Active** -- all new development |
| Shared Package | `packages/shared` | TypeScript | **Active** -- shared by all apps |

> **All new development targets NestJS + SvelteKit. Express.js and Next.js are legacy (maintenance only).**

Welcome to the repository knowledge base. Start with the project overview, then dive into specific guides as needed.

## Core Guides
- [Project Overview](./project-overview.md)
- [Architecture Notes](./architecture.md)
- [Development Workflow](./development-workflow.md)
- [Testing Strategy](./testing-strategy.md)
- [Glossary & Domain Concepts](./glossary.md)
- [Data Flow & Integrations](./data-flow.md)
- [Security & Compliance Notes](./security.md)
- [Tooling & Productivity Guide](./tooling.md)

## Repository Snapshot
- `apps/` — 4 applications: `backend-express`, `backend-nestjs`, `frontend-nextjs`, `frontend-svelte`
- `packages/` — Shared workspace packages (`shared/` with types, DTOs, constants, seed data)
- `package.json` — Root workspace manifest with cross-app scripts
- `tsconfig.base.json` — Base TypeScript configuration for all workspaces

## Document Map
| Guide | File | Primary Inputs |
| --- | --- | --- |
| Project Overview | `project-overview.md` | Roadmap, README, stakeholder notes |
| Architecture Notes | `architecture.md` | ADRs, service boundaries, dependency graphs |
| Development Workflow | `development-workflow.md` | Branching rules, CI config, contributing guide |
| Testing Strategy | `testing-strategy.md` | Test configs, CI gates, known flaky suites |
| Glossary & Domain Concepts | `glossary.md` | Business terminology, user personas, domain rules |
| Data Flow & Integrations | `data-flow.md` | System diagrams, integration specs, queue topics |
| Security & Compliance Notes | `security.md` | Auth model, secrets management, compliance requirements |
| Tooling & Productivity Guide | `tooling.md` | CLI scripts, IDE configs, automation workflows |
