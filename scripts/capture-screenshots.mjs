#!/usr/bin/env node
/**
 * Capture every prototype page/view as 1440px-wide @2x PNG (full-page height).
 *
 * Usage:
 *   npm run screenshots
 *   npm run screenshots -- --base-url http://127.0.0.1:5173 --no-server
 *   npm run screenshots -- --only operator,overlays
 *   npm run screenshots -- --list
 */

import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const VIEWPORT_WIDTH = 1440;
const VIEWPORT_HEIGHT = 900;
const DEVICE_SCALE = 2;

const args = parseArgs(process.argv.slice(2));
const OUT_DIR = path.resolve(ROOT, args.out || "screenshots");
const DEFAULT_PORT = args.port || "4179";
let BASE_URL = (
  args["base-url"] || `http://127.0.0.1:${DEFAULT_PORT}`
).replace(/\/$/, "");
const ONLY = new Set(
  (args.only || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
);
const LIST_ONLY = Boolean(args.list);
const NO_SERVER = Boolean(args["no-server"]);
const KEEP = Boolean(args.keep);

const APP_IDS = [
  "app_atlas_storage",
  "app_forge_compute",
  "app_relay_network",
  "app_sentinel_monitor",
  "app_archive_protocol",
  "app_stream_cache",
  "app_ai_worker",
  "app_backup_vault",
  "app_chain_indexer",
  "app_research_grid",
];

const DEV_APP_ID = "dapp_atlas_storage_dev";
const SAMPLE_NODE_ID = "node_denver_01";

const DEVELOPER_APP_ROUTES = [
  "",
  "/edit",
  "/listing",
  "/media",
  "/build",
  "/compatibility",
  "/permissions",
  "/rewards",
  "/testing",
  "/preview",
  "/submit",
  "/submission",
  "/review",
  "/releases",
  "/releases/new",
  "/analytics",
  "/installations",
  "/rewards-dashboard",
  "/settings",
];

const DEVELOPER_SHELL_ROUTES = [
  "/developer",
  "/developer/apps",
  "/developer/apps/new",
  "/developer/submissions",
  "/developer/releases",
  "/developer/analytics",
  "/developer/rewards",
  "/developer/organization",
  "/developer/team",
  "/developer/profile",
  "/developer/verification",
  "/developer/settings",
  "/developer/docs",
  "/developer/support",
];

const OPERATOR_SHELL_ROUTES = [
  "/",
  "/marketplace",
  "/marketplace/search",
  "/installed",
  "/nodes",
  "/rewards",
  "/activity",
  "/settings",
  "/onboarding",
  "/onboarding/developer",
];

const DEBUGGER_TABS = [
  "scenario",
  "data",
  "installation",
  "system",
  "onboarding",
  "developer",
  "debug",
];

function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith("--")) out[key] = true;
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function slug(value) {
  return (
    String(value)
      .replace(/^\//, "")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase() || "root"
  );
}

function shouldRun(group) {
  return ONLY.size === 0 || ONLY.has(group);
}

/** Parse `{ id, startingRoute }` pairs from scenario fixture files. */
async function extractScenarioRoutes(fileRel) {
  const source = await readFile(path.join(ROOT, fileRel), "utf8");
  const blocks = source.split(/\n  \{\n/).slice(1);
  const routes = [];
  for (const block of blocks) {
    const id = block.match(/^\s*id:\s*"([^"]+)"/m)?.[1];
    const startingRoute = block.match(/startingRoute:\s*"([^"]+)"/)?.[1];
    if (id && startingRoute) routes.push({ id, startingRoute });
  }
  return routes;
}

async function extractOnboardingSteps() {
  const source = await readFile(
    path.join(ROOT, "src/data/onboardingFlows.ts"),
    "utf8",
  );
  const flows = [];
  // Steps uniquely have a `title:` immediately after `id:` (fields do not).
  const flowStarts = [
    ...source.matchAll(
      /id:\s*"(account|new-node|import-node)",\n\s*title:/g,
    ),
  ];
  for (let i = 0; i < flowStarts.length; i += 1) {
    const flowId = flowStarts[i][1];
    const from = flowStarts[i].index;
    const to = flowStarts[i + 1]?.index ?? source.length;
    const chunk = source.slice(from, to);
    const stepsBlock = chunk.match(/steps:\s*\[([\s\S]*)\n\s*\],/)?.[1] ?? "";
    const steps = [
      ...stepsBlock.matchAll(
        /\{\s*\n\s*id:\s*"([^"]+)",\s*\n\s*title:/g,
      ),
    ].map((m) => m[1]);
    flows.push({ id: flowId, steps });
  }
  return flows;
}

function buildJobs({ onboardingFlows, operatorScenarios, developerScenarios }) {
  /** @type {Array<Record<string, any>>} */
  const jobs = [];
  const add = (job) => {
    jobs.push({
      hideDebugger: true,
      ...job,
      name: job.name.replace(/\.png$/i, ""),
    });
  };

  if (shouldRun("operator")) {
    for (const route of OPERATOR_SHELL_ROUTES) {
      add({
        group: "operator",
        name: `full/${slug(route) || "overview"}`,
        path: route,
        scenario: "default-marketplace",
      });
    }
    for (const appId of APP_IDS) {
      add({
        group: "operator",
        name: `full/marketplace-app-${slug(appId)}`,
        path: `/marketplace/apps/${appId}`,
        scenario: "default-marketplace",
      });
    }
    add({
      group: "operator",
      name: "full/install-scope",
      path: "/marketplace/apps/app_atlas_storage/install",
      scenario: "mixed-compatibility",
    });
    add({
      group: "operator",
      name: "full/install-review",
      path: "/marketplace/apps/app_atlas_storage/install/review",
      scenario: "mixed-compatibility",
    });
    add({
      group: "operator",
      name: "full/install-progress",
      path: "/marketplace/apps/app_atlas_storage/install/progress",
      scenario: "mixed-compatibility",
      setup: "install-progress",
    });
    add({
      group: "operator",
      name: "full/install-results-success",
      path: "/marketplace/apps/app_atlas_storage/install/results",
      scenario: "complete-installation-success",
    });
    add({
      group: "operator",
      name: "full/install-results-partial",
      path: "/marketplace/apps/app_atlas_storage/install/results",
      scenario: "partial-installation",
    });
    add({
      group: "operator",
      name: "full/install-results-failure",
      path: "/marketplace/apps/app_atlas_storage/install/results",
      scenario: "complete-installation-failure",
    });
    add({
      group: "operator",
      name: "full/install-results-queued",
      path: "/marketplace/apps/app_atlas_storage/install/results",
      scenario: "queued-only-installation",
    });
    add({
      group: "operator",
      name: "full/installed-app-detail",
      path: "/installed/app_atlas_storage",
      scenario: "installed-all-compatible",
    });
    add({
      group: "operator",
      name: "full/installed-node-installation",
      path: `/installed/app_atlas_storage/nodes/${SAMPLE_NODE_ID}`,
      scenario: "installed-all-compatible",
    });
    for (const [tab, scenario] of [
      ["overview", "default-marketplace"],
      ["resources", "default-marketplace"],
      ["apps", "installed-all-compatible"],
      ["activity", "installed-all-compatible"],
    ]) {
      add({
        group: "operator",
        name: `full/node-detail-${tab}`,
        path: `/nodes/${SAMPLE_NODE_ID}`,
        scenario,
        setup: `node-tab-${tab}`,
      });
    }
  }

  if (shouldRun("empty")) {
    for (const route of [
      "/",
      "/marketplace",
      "/marketplace/search",
      "/installed",
      "/nodes",
      "/rewards",
      "/activity",
      "/settings",
    ]) {
      add({
        group: "empty",
        name: `empty/${slug(route) || "overview"}`,
        path: route,
        scenario: "no-nodes",
      });
    }
    add({
      group: "empty",
      name: "empty/marketplace-app-no-compatible",
      path: "/marketplace/apps/app_atlas_storage",
      scenario: "no-compatible-nodes",
    });
    add({
      group: "empty",
      name: "empty/install-scope-no-nodes",
      path: "/marketplace/apps/app_atlas_storage/install",
      scenario: "no-nodes",
    });
    add({
      group: "empty",
      name: "empty/installed-list",
      path: "/installed",
      scenario: "default-marketplace",
    });
  }

  if (shouldRun("scenarios")) {
    for (const { id, startingRoute } of operatorScenarios) {
      add({
        group: "scenarios",
        name: `scenarios/operator-${slug(id)}`,
        path: startingRoute,
        scenario: id,
      });
    }
  }

  if (shouldRun("onboarding")) {
    add({
      group: "onboarding",
      name: "onboarding/hub",
      path: "/onboarding",
      scenario: "default-marketplace",
    });
    add({
      group: "onboarding",
      name: "onboarding/developer-outline",
      path: "/onboarding/developer",
      scenario: "default-marketplace",
    });
    for (const flow of onboardingFlows) {
      for (const stepId of flow.steps) {
        add({
          group: "onboarding",
          name: `onboarding/${flow.id}-${slug(stepId)}`,
          path: `/onboarding/${flow.id}/${stepId}`,
          scenario: "default-marketplace",
        });
      }
    }
  }

  if (shouldRun("developer")) {
    for (const route of DEVELOPER_SHELL_ROUTES) {
      add({
        group: "developer",
        name: `developer/full-${slug(route)}`,
        path: route,
        scenario: "default-marketplace",
        devScenario: "dev-published",
      });
      add({
        group: "developer",
        name: `developer/empty-${slug(route)}`,
        path: route,
        scenario: "default-marketplace",
        devScenario: "dev-verified-empty",
      });
    }
    for (const suffix of DEVELOPER_APP_ROUTES) {
      add({
        group: "developer",
        name: `developer/app-${slug(suffix || "dashboard")}`,
        path: `/developer/apps/${DEV_APP_ID}${suffix}`,
        scenario: "default-marketplace",
        devScenario: "dev-changes-requested",
      });
    }
    for (const { id, startingRoute } of developerScenarios) {
      add({
        group: "developer",
        name: `developer/scenario-${slug(id)}`,
        path: startingRoute,
        scenario: "default-marketplace",
        devScenario: id,
      });
    }
  }

  if (shouldRun("overlays")) {
    add({
      group: "overlays",
      name: "overlays/wallet-home-crypto",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-home",
    });
    add({
      group: "overlays",
      name: "overlays/wallet-home-items",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-items",
    });
    add({
      group: "overlays",
      name: "overlays/wallet-asset-detail",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-asset",
    });
    add({
      group: "overlays",
      name: "overlays/wallet-add-token",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-add-token",
    });
    add({
      group: "overlays",
      name: "overlays/wallet-setup",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-setup",
    });
    add({
      group: "overlays",
      name: "overlays/wallet-create-reveal",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-create-reveal",
    });
    add({
      group: "overlays",
      name: "overlays/wallet-create-confirm",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-create-confirm",
    });
    add({
      group: "overlays",
      name: "overlays/wallet-import",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-import",
    });
    add({
      group: "overlays",
      name: "overlays/wallet-disconnected",
      path: "/",
      scenario: "default-marketplace",
      setup: "wallet-disconnected",
    });
    add({
      group: "overlays",
      name: "overlays/uninstall-dialog",
      path: "/installed/app_atlas_storage",
      scenario: "installed-all-compatible",
      setup: "uninstall-dialog",
    });
    add({
      group: "overlays",
      name: "overlays/permissions-dialog",
      path: "/installed/app_atlas_storage",
      scenario: "new-permissions-on-update",
      setup: "permissions-dialog",
    });
    add({
      group: "overlays",
      name: "overlays/nodes-filter-menu",
      path: "/nodes",
      scenario: "default-marketplace",
      setup: "nodes-filter-open",
    });
    add({
      group: "overlays",
      name: "overlays/create-app-category-menu",
      path: "/developer/apps/new",
      scenario: "default-marketplace",
      devScenario: "dev-published",
      setup: "create-app-category-open",
    });
    add({
      group: "overlays",
      name: "overlays/node-metric-menu",
      path: `/nodes/${SAMPLE_NODE_ID}`,
      scenario: "default-marketplace",
      setup: "node-metric-open",
    });
    for (const tab of DEBUGGER_TABS) {
      add({
        group: "overlays",
        name: `overlays/debugger-${tab}`,
        path: tab === "developer" ? "/developer" : "/",
        scenario: "default-marketplace",
        devScenario: tab === "developer" ? "dev-published" : undefined,
        hideDebugger: false,
        setup: `debugger-${tab}`,
      });
    }
  }

  return jobs;
}

async function waitForServer(url, timeoutMs = 90_000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (res.ok || res.status === 404) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function startDevServer() {
  const port = new URL(BASE_URL).port || DEFAULT_PORT;
  const child = spawn(
    "npm",
    [
      "run",
      "dev",
      "--",
      "--host",
      "127.0.0.1",
      "--port",
      String(port),
      "--strictPort",
    ],
    {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, BROWSER: "none" },
    },
  );
  let output = "";
  const onChunk = (c) => {
    const text = c.toString();
    output += text;
    const local = text.match(/Local:\s+(https?:\/\/\S+)/);
    if (local) {
      BASE_URL = local[1].replace(/\/$/, "");
    }
  };
  child.stdout.on("data", onChunk);
  child.stderr.on("data", onChunk);
  try {
    await waitForServer(BASE_URL);
  } catch (error) {
    child.kill("SIGTERM");
    throw new Error(`${error.message}\nServer output:\n${output}`);
  }
  return child;
}

async function settle(page) {
  await page.waitForLoadState("domcontentloaded");
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(350);
}

async function ensureBridge(page) {
  await page.waitForFunction(() => Boolean(window.__NM_SCREENSHOT__), null, {
    timeout: 30_000,
  });
}

async function applyState(page, job) {
  await ensureBridge(page);
  if (job.scenario) {
    await page.evaluate(
      (id) => window.__NM_SCREENSHOT__.loadScenario(id),
      job.scenario,
    );
  }
  if (job.devScenario) {
    await page.evaluate(
      (id) => window.__NM_SCREENSHOT__.loadDeveloperScenario(id),
      job.devScenario,
    );
  }
  await page.evaluate(() => {
    window.__NM_SCREENSHOT__.clearToast();
    if (true) {
      /* debugger handled separately */
    }
  });
}

async function hideChrome(page, hideDebugger) {
  await page.evaluate((hide) => {
    const bridge = window.__NM_SCREENSHOT__;
    bridge?.clearToast?.();
    if (hide) bridge?.setDebuggerOpen?.(false);
  }, hideDebugger);

  if (hideDebugger) {
    await page.addStyleTag({
      content: `
        [aria-label="Open prototype debugger"],
        [aria-label="Close prototype debugger"],
        #prototype-debugger-panel {
          display: none !important;
        }
      `,
    });
  }
}

async function openWallet(page) {
  const trigger = page
    .locator("header")
    .getByRole("button")
    .filter({ hasText: /Wallet|OPT|\$|4,158|11,716/i })
    .first();
  await trigger.click();
  await page.locator("#wallet-sheet").waitFor({ state: "visible" });
  await page.locator("#wallet-sheet").evaluate((el) => {
    el.scrollTop = el.scrollHeight;
  });
}

async function runSetup(page, setup) {
  if (!setup) return;

  if (setup === "install-progress") {
    await page.evaluate(() => window.__NM_SCREENSHOT__.playInstallation());
    await page.waitForTimeout(900);
    await page.evaluate(() => window.__NM_SCREENSHOT__.pauseInstallation());
    return;
  }

  if (setup.startsWith("node-tab-")) {
    const tab = setup.replace("node-tab-", "");
    const label =
      tab === "overview"
        ? "Overview"
        : tab === "resources"
          ? "Resources"
          : tab === "apps"
            ? "Apps"
            : "Activity";
    await page.getByRole("tab", { name: new RegExp(label, "i") }).click();
    return;
  }

  if (setup === "wallet-home" || setup === "wallet-items") {
    await openWallet(page);
    if (setup === "wallet-items") {
      await page.getByRole("tab", { name: "Items" }).click();
    }
    return;
  }

  if (setup === "wallet-asset") {
    await openWallet(page);
    await page
      .locator("#wallet-sheet button")
      .filter({ hasText: /OPT|ETH|BTC|USDC/i })
      .first()
      .click();
    return;
  }

  if (setup === "wallet-add-token") {
    await openWallet(page);
    await page.getByRole("button", { name: /Add ERC-20 token/i }).click();
    return;
  }

  async function disconnectOpenWallet() {
    await openWallet(page);
    const disconnect = page
      .locator("#wallet-sheet")
      .getByRole("button", { name: /^Disconnect wallet$/i });
    await disconnect.waitFor({ state: "visible", timeout: 10_000 });
    await disconnect.click();
    await page
      .locator("#wallet-sheet")
      .getByRole("button", { name: /^Create wallet$/i })
      .waitFor({ state: "visible", timeout: 10_000 });
  }

  if (setup === "wallet-disconnected") {
    await disconnectOpenWallet();
    return;
  }

  if (setup === "wallet-setup") {
    await disconnectOpenWallet();
    await page
      .locator("#wallet-sheet")
      .getByRole("button", { name: /^Set up wallet$/i })
      .last()
      .click();
    await page
      .locator("#wallet-sheet")
      .getByRole("heading", { name: /Set up a wallet/i })
      .waitFor({ state: "visible" });
    return;
  }

  if (setup === "wallet-create-reveal") {
    await disconnectOpenWallet();
    await page
      .locator("#wallet-sheet")
      .getByRole("button", { name: /^Create wallet$/i })
      .click();
    await page
      .locator("#wallet-sheet")
      .getByRole("heading", { name: /Save your recovery phrase/i })
      .waitFor({ state: "visible" });
    return;
  }

  if (setup === "wallet-create-confirm") {
    await disconnectOpenWallet();
    await page
      .locator("#wallet-sheet")
      .getByRole("button", { name: /^Create wallet$/i })
      .click();
    await page
      .locator("#wallet-sheet")
      .getByRole("heading", { name: /Save your recovery phrase/i })
      .waitFor({ state: "visible" });
    await page
      .locator("#wallet-sheet")
      .getByRole("checkbox", { name: /saved my recovery phrase/i })
      .click();
    await page
      .locator("#wallet-sheet")
      .getByRole("button", { name: /^Continue$/i })
      .click();
    await page
      .locator("#wallet-sheet")
      .getByRole("heading", { name: /Confirm recovery phrase/i })
      .waitFor({ state: "visible" });
    return;
  }

  if (setup === "wallet-import") {
    await disconnectOpenWallet();
    await page
      .locator("#wallet-sheet")
      .getByRole("button", { name: /^Import wallet$/i })
      .click();
    await page
      .locator("#wallet-sheet")
      .getByRole("heading", { name: /^Import wallet$/i })
      .waitFor({ state: "visible" });
    return;
  }

  if (setup === "uninstall-dialog") {
    await page.getByRole("button", { name: /^Select all$/i }).click();
    await page.getByRole("button", { name: /^Uninstall$/i }).click();
    await page.getByRole("dialog").waitFor({ state: "visible" });
    return;
  }

  if (setup === "permissions-dialog") {
    const dialog = page.getByRole("dialog");
    try {
      await dialog.waitFor({ state: "visible", timeout: 3000 });
    } catch {
      await page.getByRole("button", { name: /^Select all$/i }).click();
      await page.getByRole("button", { name: /^Update$/i }).click();
      await dialog.waitFor({ state: "visible", timeout: 10_000 });
    }
    return;
  }

  if (setup === "nodes-filter-open") {
    await page.locator("#nodes-sort-label").click();
    await page.waitForTimeout(250);
    return;
  }

  if (setup === "create-app-category-open") {
    await page.locator("#app-category").click();
    await page.waitForTimeout(250);
    return;
  }

  if (setup === "node-metric-open") {
    await page.locator('[role="combobox"]').first().click();
    await page.waitForTimeout(250);
    return;
  }

  if (setup.startsWith("debugger-")) {
    const tab = setup.replace("debugger-", "");
    await page.evaluate((t) => {
      window.__NM_SCREENSHOT__.setDebuggerOpen(true);
      window.__NM_SCREENSHOT__.setDebuggerTab(t);
    }, tab);
    await page.waitForTimeout(350);
    const labels = {
      scenario: "Scenario",
      data: "Data",
      installation: "Installation",
      system: "System",
      onboarding: "Onboarding",
      developer: "Developer",
      debug: "Debug",
    };
    const btn = page.getByRole("button", { name: labels[tab] || tab });
    if (await btn.count()) await btn.first().click().catch(() => {});
  }
}

async function captureJob(page, job, manifest) {
  const query = new URLSearchParams();
  if (job.scenario) query.set("scenario", job.scenario);
  const url = `${BASE_URL}${job.path}${query.toString() ? `?${query}` : ""}`;

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
  await applyState(page, job);

  // Re-navigate after state load so route matches scenario data (install selection etc.)
  if (page.url().split("?")[0].replace(BASE_URL, "") !== job.path) {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60_000 });
    await applyState(page, job);
  }

  await settle(page);

  // Run interaction setups before hiding debugger chrome so controls stay usable.
  if (job.setup) {
    await runSetup(page, job.setup);
    await settle(page);
  }

  await hideChrome(page, job.hideDebugger !== false);
  await settle(page);

  const fileRel = `${job.name}.png`;
  const fileAbs = path.join(OUT_DIR, fileRel);
  await mkdir(path.dirname(fileAbs), { recursive: true });

  // Grow viewport so fixed sheets/dialogs are not clipped by 900px height.
  const neededHeight = await page.evaluate(() => {
    const bottoms = [
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    ];
    for (const el of document.querySelectorAll(
      '[role="dialog"], [data-state="open"], #wallet-sheet, #prototype-debugger-panel',
    )) {
      const rect = el.getBoundingClientRect();
      bottoms.push(Math.ceil(rect.bottom + window.scrollY + 32));
    }
    return Math.max(...bottoms, 900);
  });
  await page.setViewportSize({
    width: VIEWPORT_WIDTH,
    height: Math.min(Math.max(VIEWPORT_HEIGHT, neededHeight), 16_000),
  });

  await page.screenshot({
    path: fileAbs,
    fullPage: true,
    type: "png",
    animations: "disabled",
  });

  await page.setViewportSize({
    width: VIEWPORT_WIDTH,
    height: VIEWPORT_HEIGHT,
  });

  manifest.push({
    name: job.name,
    group: job.group,
    path: job.path,
    scenario: job.scenario ?? null,
    devScenario: job.devScenario ?? null,
    setup: job.setup ?? null,
    file: fileRel,
    viewportWidth: VIEWPORT_WIDTH,
    deviceScaleFactor: DEVICE_SCALE,
  });
  process.stdout.write(`✓ ${fileRel}\n`);
}

async function main() {
  const [onboardingFlows, operatorScenarios, developerScenarios] =
    await Promise.all([
      extractOnboardingSteps(),
      extractScenarioRoutes("src/data/scenarios.ts"),
      extractScenarioRoutes("src/data/developerScenarios.ts"),
    ]);

  const jobs = buildJobs({
    onboardingFlows,
    operatorScenarios,
    developerScenarios,
  });

  if (LIST_ONLY) {
    console.log(`Planned captures: ${jobs.length}\n`);
    for (const job of jobs) console.log(`${job.group.padEnd(12)} ${job.name}`);
    console.log(
      `\nOnboarding flows parsed: ${onboardingFlows.map((f) => `${f.id}(${f.steps.length})`).join(", ")}`,
    );
    console.log(`Operator scenarios: ${operatorScenarios.length}`);
    console.log(`Developer scenarios: ${developerScenarios.length}`);
    return;
  }

  if (!KEEP) await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  let server = null;
  if (!NO_SERVER) {
    console.log(`Starting Vite at ${BASE_URL} ...`);
    server = await startDevServer();
  } else {
    await waitForServer(BASE_URL);
  }

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage"],
  });
  const context = await browser.newContext({
    viewport: { width: VIEWPORT_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: DEVICE_SCALE,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  page.setDefaultTimeout(20_000);

  const manifest = [];
  const failures = [];

  try {
    console.log(`Capturing ${jobs.length} views @ ${VIEWPORT_WIDTH}px × ${DEVICE_SCALE}x …\n`);
    for (const job of jobs) {
      try {
        await captureJob(page, job, manifest);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        failures.push({ name: job.name, error: message });
        process.stdout.write(`✗ ${job.name} — ${message}\n`);
        await page
          .goto(BASE_URL, { waitUntil: "domcontentloaded" })
          .catch(() => {});
      }
    }
  } finally {
    await browser.close();
    if (server) server.kill("SIGTERM");
  }

  const manifestPath = path.join(OUT_DIR, "manifest.json");
  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        baseUrl: BASE_URL,
        viewportWidth: VIEWPORT_WIDTH,
        deviceScaleFactor: DEVICE_SCALE,
        count: manifest.length,
        failed: failures.length,
        failures,
        captures: manifest,
      },
      null,
      2,
    ),
  );

  console.log(
    `\nDone: ${manifest.length} screenshots → ${OUT_DIR}` +
      (failures.length ? ` (${failures.length} failed)` : ""),
  );
  console.log(`Manifest: ${manifestPath}`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
