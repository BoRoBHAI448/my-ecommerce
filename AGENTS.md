# AGENTS.md

Welcome to the **my-ecommerce** project! This repository uses **Agent Skills** to guide AI coding agents through senior-grade engineering workflows, rigorous verification, and quality gates.

---

## 1. Skill-Driven Execution Model

Skills are located in `.agents/skills/`. Each skill defines a battle-tested workflow with explicit steps, common anti-rationalizations, and exit verification criteria.

### Golden Rules
1. **Check for and invoke skills first**: Never implement complex features directly without consulting the relevant workflow.
2. **Follow workflows strictly**: Do not skip steps, bypass tests, or rationalize shortcuts ("this is too small for a skill", "I will write tests later").
3. **Verification is non-negotiable**: Code is only complete when verified with passing tests, runtime checks, and lint cleanups.

---

## 2. Intent to Skill Mapping

Identify the development phase and apply the appropriate skill:

```
Task arrives
    │
    ├── Underspecified requirements? ───────────→ interview-me
    ├── Exploring concept options? ─────────────→ idea-refine
    ├── Defining feature or new scope? ─────────→ spec-driven-development
    ├── Defining project quality standards? ────→ constraint-driven-development
    ├── Breaking down spec into tasks? ─────────→ planning-and-task-breakdown
    │
    ├── Implementing code? ─────────────────────→ incremental-implementation
    │   ├── UI / Frontend components? ──────────→ frontend-ui-engineering
    │   ├── API / Contract design? ─────────────→ api-and-interface-design
    │   ├── Complex / high-stakes decisions? ───→ doubt-driven-development
    │   ├── Verifying against official docs? ───→ source-driven-development
    │   └── Managing context & rules? ──────────→ context-engineering
    │
    ├── Testing behavior? ──────────────────────→ test-driven-development
    │   └── Browser runtime / DevTools? ────────→ browser-testing-with-devtools
    ├── Bug, regression, or build break? ───────→ debugging-and-error-recovery
    │
    ├── Code review before commit/merge? ───────→ code-review-and-quality
    │   ├── Simplifying complex code? ──────────→ code-simplification
    │   ├── Security / input validation? ───────→ security-and-hardening
    │   └── Speed / bundle / database query? ───→ performance-optimization
    │
    └── Deploying / Shipping? ──────────────────→ shipping-and-launch
        ├── Committing & git workflow? ─────────→ git-workflow-and-versioning
        ├── CI/CD & automation? ────────────────→ ci-cd-and-automation
        ├── Deprecating old code / APIs? ───────→ deprecation-and-migration
        ├── Architecture docs & ADRs? ──────────→ documentation-and-adrs
        └── Logging & telemetry? ───────────────→ observability-and-instrumentation
```

---

## 3. Core Development Lifecycle

| Phase | Primary Skill | Key Principle |
|---|---|---|
| **Define** | `spec-driven-development` | Spec before code. Establish boundaries and criteria. |
| **Plan** | `planning-and-task-breakdown` | Atomic, verifiable tasks with clear dependency order. |
| **Build** | `incremental-implementation` | Thin vertical slices: implement, test, verify, commit. |
| **Verify** | `test-driven-development` | Red-Green-Refactor. Tests are proof. |
| **Review** | `code-review-and-quality` | 5-axis review: correctness, design, readability, security, performance. |
| **Ship** | `shipping-and-launch` | Production checklists, rollback plans, and observability. |

---

## 4. Specialist Personas (`.agents/agents/`)

When specialized perspectives are required, reference the dedicated personas:
- **`code-reviewer.md`**: Senior Staff Engineer perspective for comprehensive code review.
- **`test-engineer.md`**: QA Specialist focusing on test pyramid (80/15/5), edge cases, and test rigor.
- **`security-auditor.md`**: Security Engineer evaluating OWASP Top 10, auth boundaries, and input safety.
- **`web-performance-auditor.md`**: Web Performance Engineer auditing Core Web Vitals, payload sizes, and rendering.

*Note: Personas do not invoke other personas. The user or the orchestrator manages persona workflows.*

---

## 5. Reference Checklists (`.agents/references/`)

Skills refer back to shared project standards located in `.agents/references/`:
- **`definition-of-done.md`**: Standing project-wide quality bar for every change.
- **`testing-patterns.md`**: Idiomatic testing styles, fixtures, and anti-patterns.
- **`security-checklist.md`**: Hardening gates, sanitization, and OWASP references.
- **`performance-checklist.md`**: Core Web Vitals, caching strategies, and query optimization.
- **`accessibility-checklist.md`**: WCAG 2.1 AA checklist, keyboard navigation, and semantic ARIA.
- **`observability-checklist.md`**: Structured logging, metrics, tracing, and health checks.
- **`orchestration-patterns.md`**: Multi-persona orchestration guidelines.
