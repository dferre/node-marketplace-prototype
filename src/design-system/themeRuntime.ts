import catalog from "./tokens.json" with { type: "json" };

export type ColorMode = "light" | "dark";

export type DesignToken = (typeof catalog.tokens)[number];

const OVERRIDE_KEY = "webstack-theme-overrides";
const MODE_KEY = "webstack-theme-mode";

export function getCatalog() {
  return catalog;
}

export function getTokens(): DesignToken[] {
  return catalog.tokens;
}

export function getColorMode(): ColorMode {
  if (typeof document !== "undefined") {
    const attr = document.documentElement.dataset.theme;
    if (attr === "dark" || attr === "light") return attr;
  }
  if (typeof localStorage === "undefined") return "light";
  const stored = localStorage.getItem(MODE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return "light";
}

export function getOverrides(): Record<string, string> {
  if (typeof localStorage === "undefined") return {};
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(OVERRIDE_KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        (entry): entry is [string, string] => typeof entry[1] === "string",
      ),
    );
  } catch {
    return {};
  }
}

export function getTokenValue(token: DesignToken, mode = getColorMode()): string {
  return getOverrides()[token.cssVar] ?? token.values[mode];
}

function writeOverrides(overrides: Record<string, string>) {
  localStorage.setItem(OVERRIDE_KEY, JSON.stringify(overrides));
  applyOverrideProperties(overrides);
}

function applyOverrideProperties(overrides: Record<string, string>) {
  const root = document.documentElement;
  for (const token of catalog.tokens) {
    if (token.cssVar in overrides) {
      root.style.setProperty(token.cssVar, overrides[token.cssVar]);
    } else {
      root.style.removeProperty(token.cssVar);
    }
  }
}

export function setColorMode(mode: ColorMode) {
  localStorage.setItem(MODE_KEY, mode);
  document.documentElement.dataset.theme = mode;
}

export function setOverride(cssVar: string, value: string) {
  writeOverrides({ ...getOverrides(), [cssVar]: value });
}

export function resetOverrides() {
  writeOverrides({});
  localStorage.removeItem(OVERRIDE_KEY);
}

export function applyTheme() {
  document.documentElement.dataset.theme = getColorMode();
  applyOverrideProperties(getOverrides());
}

export function exportThemeCss(): string {
  const mode = getColorMode();
  const overrides = getOverrides();
  const selector = mode === "dark" ? "[data-theme='dark']" : ":root";
  const lines = catalog.tokens.map((token) => {
    const value = overrides[token.cssVar] ?? token.values[mode];
    return `  ${token.cssVar}: ${value};`;
  });
  return `${selector} {\n${lines.join("\n")}\n}\n`;
}
