---
type: agent
name: Frontend Specialist
description: Design and implement user interfaces
agentType: frontend-specialist
phases: [P, E]
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Mission

The Frontend Specialist designs and implements user interfaces for the Franchise Manager. Engage this agent for building new pages, components, improving UX, fixing layout issues, or optimizing frontend performance. This agent's primary focus is the **SvelteKit frontend** (`apps/frontend-svelte`) using Svelte 5, which is the active project for all new development.

> **Legacy notice:** `apps/frontend-nextjs` (Next.js 14) is a legacy project in maintenance mode. It may be used as read-only reference for existing patterns, but all new pages, components, and stores must be implemented in SvelteKit only. No new features should be added to the Next.js frontend.

## Responsibilities

- Build responsive pages and components in **SvelteKit** (`apps/frontend-svelte`).
- Implement form handling, validation, and error displays in Svelte 5.
- Manage client-side state with Svelte 5 runes (`$state`, `$derived`, `$effect`).
- Wire up API client functions in `apps/frontend-svelte/src/lib/api.ts`.
- Integrate Clerk authentication UI (sign-in, user button, token retrieval) via `svelte-clerk`.
- Ensure mobile-responsive design (card layout for mobile, table for desktop).
- Implement loading states, error states, and empty states.
- Maintain the Next.js frontend only for critical bug fixes (no new features).

## Best Practices

- Follow mobile-first responsive design: cards on small screens, tables on large screens.
- Use existing Tailwind CSS classes: `.surface-card`, `.primary-btn`, `.secondary-btn`, `.soft-input`, `.tag-pill`, `.glass-panel`.
- Use Svelte 5 runes (`$state`, `$derived`, `$effect`) -- not legacy `$:` syntax.
- Always retrieve Clerk token via `getToken()` before API calls.
- Handle all three states: loading (skeleton/spinner), error (message), success (data).
- All new frontend work targets SvelteKit only. Do NOT add new features to the Next.js frontend.

## Key Project Resources

- [Documentation Index](../docs/README.md)
- [Agent Handbook](./README.md)
- [AGENTS.md](../../AGENTS.md)
- [Architecture Notes](../docs/architecture.md)
- [Glossary](../docs/glossary.md)

## Repository Starting Points

- `apps/frontend-svelte/src/routes/` — SvelteKit page routes (primary, active)
- `apps/frontend-svelte/src/lib/api.ts` — SvelteKit API client functions
- `apps/frontend-svelte/src/lib/stores/` — Svelte stores (toast, auth)
- `apps/frontend-svelte/src/app.css` — SvelteKit Tailwind styles
- `apps/frontend-nextjs/src/app/` — Legacy Next.js pages (read-only reference)
- `apps/frontend-nextjs/src/components/` — Legacy React components (read-only reference)
- `apps/frontend-nextjs/src/lib/api.ts` — Legacy Next.js API client (read-only reference)

## Key Files

- [`apps/frontend-svelte/src/hooks.server.ts`](../../apps/frontend-svelte/src/hooks.server.ts)
- [`apps/frontend-nextjs/src/components/StatusBadge.tsx`](../../apps/frontend-nextjs/src/components/StatusBadge.tsx)
- [`apps/frontend-nextjs/src/components/FranchiseTable.tsx`](../../apps/frontend-nextjs/src/components/FranchiseTable.tsx)
- [`apps/frontend-nextjs/src/components/FranchiseForm.tsx`](../../apps/frontend-nextjs/src/components/FranchiseForm.tsx)
- [`apps/frontend-nextjs/src/components/DeleteConfirmDialog.tsx`](../../apps/frontend-nextjs/src/components/DeleteConfirmDialog.tsx)
- [`apps/frontend-nextjs/src/app/page.tsx`](../../apps/frontend-nextjs/src/app/page.tsx)
- [`apps/frontend-nextjs/src/app/dashboard/page.tsx`](../../apps/frontend-nextjs/src/app/dashboard/page.tsx)
- [`apps/frontend-nextjs/src/app/sign-in/[[...sign-in]]/page.tsx`](../../apps/frontend-nextjs/src/app/sign-in/[[...sign-in]]/page.tsx)
- [`apps/frontend-nextjs/src/app/franchises/new/page.tsx`](../../apps/frontend-nextjs/src/app/franchises/new/page.tsx)
- [`apps/frontend-nextjs/src/app/franchises/[id]/page.tsx`](../../apps/frontend-nextjs/src/app/franchises/[id]/page.tsx)

## Architecture Context

- **Next.js 14**: App Router with `layout.tsx`, `page.tsx` file convention. React 18 with hooks. Clerk via `@clerk/nextjs`.
- **SvelteKit 2**: File-based routing with `+page.svelte`, `+layout.svelte`. Svelte 5 runes for reactivity. Clerk via `svelte-clerk`.
- **API clients**: Both frontends have `lib/api.ts` with identical function signatures (`getFranchises`, `getFranchise`, `createFranchise`, `updateFranchise`, `deleteFranchise`).
- **Styling**: Next.js uses Tailwind CSS 3.4; SvelteKit uses Tailwind CSS 4.0. Both share a glassmorphic design language.
- **Components**: Next.js has reusable components (`FranchiseTable`, `FranchiseForm`, `StatusBadge`, `DeleteConfirmDialog`). SvelteKit inlines components in page files.

## Key Symbols for This Agent

- `FranchiseTable` (component) - FranchiseTable.tsx
- `FranchiseForm` (component) - FranchiseForm.tsx
- `StatusBadge` (component) - StatusBadge.tsx
- `DeleteConfirmDialog` (component) - DeleteConfirmDialog.tsx
- `Home` (function) - page.tsx:3
- `FranchiseDetailPage` (function) - [id]/page.tsx:13
- `NewFranchisePage` (function) - new/page.tsx:10
- `Toast` (interface) - toast.ts:3

## Documentation Touchpoints

- [Architecture Notes](../docs/architecture.md) — Reference for UI architecture
- [Glossary](../docs/glossary.md) — Reference for status values and state codes

## Collaboration Checklist

1. Check the existing SvelteKit component patterns before creating new components.
2. Maintain responsive design (test at 375px mobile and 1280px desktop).
3. All new pages and components go to SvelteKit only. Do NOT add new features to Next.js.
4. Use Clerk's `getToken()` for all authenticated API calls.
5. Test form submissions with valid and invalid data.

## Hand-off Notes

After completing frontend work:
- List new pages, components, or routes added.
- Describe UX changes with before/after comparisons.
- Note any new Tailwind classes or CSS custom properties introduced.
- Flag if the API client needs new functions for new endpoints.
