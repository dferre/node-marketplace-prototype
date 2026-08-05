# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are **blockchain node owners** (single-node and multi-node operators) who discover apps, judge node fit, install across a fleet, and manage running installations.

Secondary audience for this repository: **product/design stakeholders** evaluating flows via the clickable prototype and scenario debugger.

## Product Purpose

A **front-end-only, low-fidelity clickable prototype** of a node application marketplace. It exists so teams can walk complete product flows—discovery, compatibility, multi-node installation, progress/results, and installed-app management—with realistic edge cases, without a backend or live chain.

Success means reviewers can complete the primary vertical slice and exercise seeded scenarios (partial success, offline queueing, permissions, suspended apps, updates, large fleets) from the Prototype debugger.

## Positioning

Unlike a production marketplace or a generic admin dashboard, this product’s mechanism is **scenario-driven local simulation**: typed fixtures, compatibility evaluation, and a shareable debugger that can force states (offline, unavailable services, updates, permission changes). The visual system follows a Vercel-inspired Operate language (Geist, soft borders, achromatic canvas).

## Operating Context

- Operators browse Marketplace and Installed Apps as the core product surfaces; Overview, Nodes, Rewards, Activity, and Settings support the same fleet/app state.
- Installation is a multi-step flow: scope → review → progress → results, with per-node stages.
- Product source PDFs live under `../_assets/Documents` (brief, terminology, data model, compatibility, installation rules/flow, sample apps).
- Local run: `npm install` then `npm run dev` (Vite). Static build via `npm run build`.

## Capabilities and Constraints

**Capabilities (confirmed in prototype):**

- Discover/browse/search apps; app detail with benefits, rewards, permissions, requirements, compatibility.
- Install on one / selected / all compatible nodes; monitor per-node progress; handle queued, failed, and partial success.
- Manage installed apps across nodes (stop, restart, update, setup, uninstall with affected-node confirmation).
- Node fleet views, rewards eligibility summaries, activity derived from install/deployment state.
- Prototype debugger: scenarios, user/app/fleet, overrides, installation playback, shareable URL params.

**Constraints:**

- No backend, database, auth provider, wallet/RPC, or real node connections; all behavior is local Zustand + fixtures.
- Do not invent production pricing, customers, or live reward guarantees; rewards are estimates with eligibility caveats.
- Do not hide incompatible or already-installed nodes; do not treat partial success as total failure.
- Visual system for this prototype is **Vercel-inspired Operate UI** (Geist, `#FAFAFA` canvas, soft borders, blue focus accent) built on Relume primitives with Boxicons—see `DESIGN.md`.
- Undecided: eventual production brand identity, real backend/API contracts, and native apps.

## Brand Commitments

- Product name in UI: **Node Marketplace** (prototype).
- Voice: clear, operator-facing, benefits before deep infrastructure jargon; explain failures with cause and next step.
- Iconography: Boxicons (basic outline pack by default).
- Binding visual constraint for current work: Quiet Deploy / Vercel Operate tokens in `DESIGN.md`; Relume UI remains the component primitive layer; Boxicons only; no parallel UI library.

## Evidence on Hand

- Product PDFs: `../_assets/Documents/*.pdf`
- App fixtures: `src/data/apps.ts` (10 sample apps including Atlas Storage)
- Node fleets/scenarios: `src/data/nodes.ts`, `src/data/scenarios.ts`
- Compatibility logic: `src/utils/compatibility.ts`
- No real customer testimonials, press, or production metrics—do not fabricate them.

## Product Principles

1. **Explainability first** — Compatibility and failures always show requirement vs node value and a next action.
2. **Fleet reality** — Multi-node selection, offline queueing, and partial outcomes are first-class, not edge footnotes.
3. **Scenario honesty** — Visible UI derives from fixtures/store/overrides; screens do not hardcode separate demo scripts.
4. **Operate clarity over ornament** — Prefer complete, testable flows in the Quiet Deploy system over decorative chrome.
5. **Rewards without misleading claims** — Estimates and eligibility stay separate from technical compatibility.

## Accessibility & Inclusion

Prototype bar: semantic HTML, visible labels, keyboard-accessible controls, skip-to-main, and AA-capable text contrast on the wireframe palette. Not a formal WCAG certification target unless later specified.
