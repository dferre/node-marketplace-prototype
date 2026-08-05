# UI screenshot capture

Captures every prototype page and overlay as **1440 CSS-px wide × auto height PNGs at 2×** (so pixel width is 2880).

## Run

```bash
# Full suite (~174 captures). Spins up Vite on port 4179.
npm run screenshots

# List planned files without capturing
npm run screenshots:list

# Subsets
npm run screenshots -- --only operator,empty
npm run screenshots -- --only developer,scenarios,overlays,onboarding

# Use an already-running server
npm run screenshots -- --no-server --base-url http://localhost:5173
```

Output lands in `screenshots/` with `manifest.json`.

## Groups

| Group | What it covers |
| --- | --- |
| `operator` | Shell routes, all app details, install flow, installed/node detail tabs |
| `empty` | No-nodes / empty installed baselines |
| `scenarios` | Landing route for every operator scenario fixture |
| `onboarding` | Hub + every account / new-node / import-node step |
| `developer` | Shell routes (full + empty), app editor routes, every developer scenario landing |
| `overlays` | Wallet views, uninstall/permissions dialogs, select menus, debugger tabs |

## Notes

- Debugger chrome is hidden on product shots; included under `overlays/debugger-*`.
- Store control bridge: `window.__NM_SCREENSHOT__` (see `src/utils/screenshotBridge.ts`).
- First run needs Chromium: `npx playwright install chromium`.
