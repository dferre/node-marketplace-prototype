# Developer Portal Implementation Checklist

Front-end-only prototype. Fixtures + Zustand + React Router. Relume B&W wireframe. No APIs, auth, or real uploads.

## Phase 1 — Foundation

- [x] Developer types (`src/types/developer.ts`)
- [x] Developer / org fixtures + Atlas app phases
- [x] Developer scenarios + portal state in Zustand
- [x] DeveloperShell + WorkspaceSwitcher
- [x] All `/developer/*` routes registered
- [x] Placeholder pages for unfinished sections
- [x] Debugger Developer tab + overrides / scenario jumps
- [x] Lint / production build green

## Phase 2 — Verification and drafting

- [x] Verification page (status + reviewer comments; full form still thin)
- [x] My Apps list with status filters
- [x] Create App entry
- [x] Persistent app-editor navigation + completion checklist
- [x] Save and exit behavior (prototype toast)

## Phase 3 — Listing, media, technical config

- [x] Marketplace listing editor + live card preview (wireframe)
- [x] Media manager (simulated upload / replace / reject states)
- [x] Build upload simulation
- [x] Compatibility editor + fleet preview
- [x] Permissions and privacy
- [x] Benefits and rewards
- [x] Support and legal (app settings step)

## Phase 4 — Testing and submission

- [x] Automated testing dashboard (fixture statuses)
- [x] Public app-detail preview (basic)
- [x] Submission readiness checklist
- [x] Submit confirmation + timeline

## Phase 5 — Review, rejection, resubmission

- [x] Review findings UI + developer responses
- [x] Changes requested flow (debugger / fixtures)
- [x] Revision comparison view
- [x] Resubmit → approve → publish actions (store + UI)

## Phase 6 — Published app management

- [ ] App dashboard polish
- [ ] Public developer profile
- [ ] Analytics / installations / rewards dashboards
- [ ] Unpublish / deprecate / suspension states

## Phase 7 — Releases and updates

- [ ] Create release flow
- [ ] New-permission warning
- [ ] Staged rollout / pause / rollback
- [ ] Version history

## Vertical slice (Atlas Storage Developer Edition)

Verified dashboard → create/edit → listing → media → build → compatibility → permissions → rewards → preview → submit → changes requested → respond/fix → resubmit → approve → publish.
