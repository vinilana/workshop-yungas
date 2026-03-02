---
type: doc
name: tooling
description: Scripts, IDE settings, automation, and developer productivity tips
category: tooling
generated: 2026-03-02
status: filled
scaffoldVersion: "2.0.0"
---
## Tooling & Productivity Guide

The project uses npm workspaces for monorepo management. Each app has its own build tooling: TSC for backends, Next.js compiler for the Next.js frontend, and Vite for the SvelteKit frontend.

## Required Tooling

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Runtime for all applications |
| npm | 10+ | Package manager with workspace support |
| TypeScript | 5.4 | Type-checked compilation (strict mode) |
| better-sqlite3 | 11 | SQLite database driver (requires native build) |

## Available Scripts

### Root-level (`package.json`)

| Script | Command | Description |
|--------|---------|-------------|
| `dev:express` | `npm run dev -w apps/backend-express` | Start Express backend in dev mode |
| `dev:nestjs` | `npm run dev -w apps/backend-nestjs` | Start NestJS backend in dev mode |
| `dev:svelte` | `npm run dev -w apps/frontend-svelte` | Start SvelteKit frontend in dev mode |
| `dev:nextjs` | `npm run dev -w apps/frontend-nextjs` | Start Next.js frontend in dev mode |
| `build` | `npm run build --workspaces` | Build all workspaces |
| `seed:express` | `npm run seed -w apps/backend-express` | Seed Express database with sample data |
| `seed:nestjs` | `npm run seed -w apps/backend-nestjs` | Seed NestJS database with sample data |

### Build Tools by App

| App | Build Tool | Dev Server | Config File |
|-----|-----------|------------|-------------|
| `backend-express` | TypeScript compiler (`tsc`) | `ts-node` / `tsx` | `tsconfig.json` |
| `backend-nestjs` | NestJS CLI (`nest build`) | `nest start --watch` | `nest-cli.json`, `tsconfig.json` |
| `frontend-nextjs` | Next.js compiler | `next dev` (port 3000) | `next.config.js`, `tailwind.config.ts` |
| `frontend-svelte` | Vite | `vite dev` (port 5173) | `vite.config.ts`, `svelte.config.js` |

## Recommended Automation

- **Pre-commit hooks**: Set up Husky + lint-staged to run TypeScript checks on staged files.
- **Formatting**: Add Prettier with a shared `.prettierrc` config. Recommended settings: single quotes, trailing commas, 2-space indent.
- **Linting**: Add ESLint with TypeScript plugin for consistent code quality.
- **Shared package rebuild**: After editing `packages/shared/src/*`, run `npm run build -w packages/shared` before testing frontend/backend consumers.

## IDE / Editor Setup

### VS Code Recommended Extensions
- **TypeScript**: Built-in TypeScript language service
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **Svelte for VS Code**: Svelte 5 syntax highlighting and language features
- **SQLite Viewer**: Browse `.db` files directly in the editor
- **REST Client**: Test API endpoints without leaving the editor

### Workspace Settings
```json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/*.db": true
  }
}
```

## Productivity Tips

- **Parallel development**: Run backend and frontend simultaneously in separate terminal tabs.
- **SQLite inspection**: Use `sqlite3 apps/backend-express/franchises.db` CLI or the SQLite Viewer extension to inspect data.
- **API testing**: Use the health endpoint `curl http://localhost:3001/health` to verify backend is running.
- **Hot reload**: Both frontends support HMR. NestJS uses `--watch` mode. Express requires manual restart (consider `nodemon`).
- **Workspace commands**: Run commands in specific workspaces with `npm run <script> -w <workspace>`.

## Related Resources

- [development-workflow.md](./development-workflow.md)
