# Skills

On-demand expertise for AI agents. Skills are task-specific procedures that get activated when relevant.

> Project: workshop-yungas

## Project Context

This monorepo contains both **active** and **legacy** projects:

| Project | Stack | Status | Policy |
|---------|-------|--------|--------|
| `apps/backend-nestjs` | NestJS 10.4 | **Active** | All new backend development |
| `apps/frontend-svelte` | SvelteKit 2.0 / Svelte 5 | **Active** | All new frontend development |
| `apps/backend-express` | Express.js 4.21 | **Legacy** | Critical fixes only, no new features |
| `apps/frontend-nextjs` | Next.js 14 | **Legacy** | Critical fixes only, no new features |
| `packages/shared` | TypeScript | **Shared** | Used by all projects |

- **NestJS + SvelteKit** are the active development targets. All new features, enhancements, and non-critical improvements go here.
- **Express + Next.js** are legacy and maintained only for critical bug fixes. No new features, no new endpoints, no refactoring efforts should target these projects.

## How Skills Work

1. **Discovery**: AI agents discover available skills
2. **Matching**: When a task matches a skill's description, it's activated
3. **Execution**: The skill's instructions guide the AI's behavior

## Available Skills

### Built-in Skills

| Skill | Description | Phases |
|-------|-------------|--------|
| [Commit Message](./commit-message/SKILL.md) | Generate commit messages following conventional commits with scope detection | E, C |
| [Pr Review](./pr-review/SKILL.md) | Review pull requests against team standards and best practices | R, V |
| [Code Review](./code-review/SKILL.md) | Review code quality, patterns, and best practices | R, V |
| [Test Generation](./test-generation/SKILL.md) | Generate comprehensive test cases for code | E, V |
| [Documentation](./documentation/SKILL.md) | Generate and update technical documentation | P, C |
| [Refactoring](./refactoring/SKILL.md) | Safe code refactoring with step-by-step approach | E |
| [Bug Investigation](./bug-investigation/SKILL.md) | Systematic bug investigation and root cause analysis | E, V |
| [Feature Breakdown](./feature-breakdown/SKILL.md) | Break down features into implementable tasks | P |
| [Api Design](./api-design/SKILL.md) | Design RESTful APIs following best practices | P, R |
| [Security Audit](./security-audit/SKILL.md) | Security review checklist for code and infrastructure | R, V |

## Creating Custom Skills

Create a new skill by adding a directory with a `SKILL.md` file:

```
.context/skills/
└── my-skill/
    ├── SKILL.md          # Required: skill definition
    └── templates/        # Optional: helper resources
        └── checklist.md
```

### SKILL.md Format

```yaml
---
name: my-skill
description: When to use this skill
phases: [P, E, V]  # Optional: PREVC phases
mode: false        # Optional: mode command?
---

# My Skill

## When to Use
[Description of when this skill applies]

## Instructions
1. Step one
2. Step two

## Examples
[Usage examples]
```

## PREVC Phase Mapping

| Phase | Name | Skills |
|-------|------|--------|
| P | Planning | feature-breakdown, documentation, api-design |
| R | Review | pr-review, code-review, api-design, security-audit |
| E | Execution | commit-message, test-generation, refactoring, bug-investigation |
| V | Validation | pr-review, code-review, test-generation, security-audit |
| C | Confirmation | commit-message, documentation |
