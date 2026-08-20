/**
 * One-shot generator for Webstack DS token files from the Figma dump.
 * Source: https://www.figma.com/design/wBO8pB6A3RmgqTh5JAxrUn
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "src/design-system");

const colors = [
  ["background/backgrounds/primary-base", "#f7f7f7", "#0b0b0d", "background"],
  ["background/backgrounds/primary-hover", "#ffffff", "#18181b", "background"],
  ["background/backgrounds/secondary-base", "#ffffff", "#0b0b0d", "background"],
  ["background/backgrounds/secondary-hover", "#f7f7f7", "#18181b", "background"],
  ["background/backgrounds/tertiary-base", "#f7f7f7", "#18181b", "background"],
  ["background/backgrounds/tertiary-hover", "#f1f1f1", "#37373a", "background"],
  ["background/backgrounds/tsc-background", "#ffffff", "#000018", "background"],
  ["background/branding/brand", "#d4167f", "#d4167f", "branding"],
  ["background/branding/brand-secondary", "#d4167f0f", "#d4167f52", "branding"],
  ["background/branding/brand-hover", "#940f59", "#940f59", "branding"],
  ["background/elements/blur", "#ffffff70", "#14141470", "elements"],
  ["background/elements/blur-hover", "#ffffffe0", "#141414e0", "elements"],
  ["background/elements/clear", "#00000000", "#ffffff00", "elements"],
  ["background/elements/clear-dark", "#ffffff00", "#0f0f1000", "elements"],
  ["background/elements/fill-primary", "#121214", "#f2f2f5", "elements"],
  ["background/elements/fill-secondary", "#45454a", "#c7c7cc", "elements"],
  ["background/elements/fill-tertiary", "#737378", "#8c8c91", "elements"],
  ["background/elements/fill-quaternary", "#99999e", "#66666b", "elements"],
  ["background/states/error", "#e9152d", "#731f1f", "states"],
  ["background/states/error-hover", "#a30f20", "#8c2626", "states"],
  ["background/states/success", "#34c759", "#1a5926", "states"],
  ["background/states/success-hover", "#248b3e", "#216b2e", "states"],
  ["background/states/warning", "#ff8d28", "#664d14", "states"],
  ["background/states/warning-hover", "#b3631c", "#7a5c1a", "states"],
  ["background/states/info", "#1e6ef4", "#1a3366", "states"],
  ["background/states/info-hover", "#144dab", "#21407a", "states"],
  ["text/text-primary", "#000000", "#ffffff", "text"],
  ["text/text-secondary", "#344054", "#d0d5dd", "text"],
  ["text/text-tertiary", "#475467", "#98a2b3", "text"],
  ["text/text-quaternary", "#667085", "#858ea1", "text"],
  ["text/text-error", "#e9152d", "#ff7373", "text"],
  ["text/text-success", "#34c759", "#59d973", "text"],
  ["text/text-warning", "#ff8d28", "#ffbf40", "text"],
  ["text/text-info", "#1e6ef4", "#66b2ff", "text"],
  ["text/text-white", "#ffffff", "#ffffff", "text"],
  ["text/text-brand", "#1d1485", "#ada6f2", "text"],
  ["text/text-brand-secondary", "#5245e3", "#ada6f2", "text"],
  ["text/text-brand-tertiary", "#ada6f2", "#eae9fc", "text"],
  ["text/text-on-dark", "#eaecf0", "#eaecf0", "text"],
  ["text/text-on-dark-secondary", "#d0d5dd", "#d0d5dd", "text"],
  ["text/text-placeholder", "#98a2b3", "#667085", "text"],
  ["borders/border-primary", "#ebebeb", "#18181c", "borders"],
  ["borders/border-base", "#ebebeb", "#18181c", "borders"],
  ["borders/border-elevated", "#cccccc", "#3f3f46", "borders"],
  ["borders/border-light", "#e4e4e7", "#1f1f1f", "borders"],
  ["overlays/modal-overlay", "#000000b8", "#000000b8", "overlays"],
  ["Webstack/webstack-blue", "#349bf6", "#349bf6", "webstack"],
  ["Webstack/webstack-orange", "#ff9f00", "#ff9f00", "webstack"],
  ["Webstack/webstack-green", "#53b509", "#53b509", "webstack"],
  ["Webstack/webstack-pink", "#d4167f", "#d4167f", "webstack"],
  ["primitives/red", "#e9152d", "#e9152d", "primitives"],
  ["primitives/red-secondary", "#e9152d33", "#e9152d33", "primitives"],
  ["primitives/red-secondary-tertiary", "#e9152d0f", "#e9152d0f", "primitives"],
  ["primitives/green", "#34c759", "#30d158", "primitives"],
  ["primitives/green-secondary", "#34c75933", "#30d15833", "primitives"],
  ["primitives/green-secondary-tertiary", "#34c7590f", "#30d1580f", "primitives"],
  ["primitives/blue", "#1e6ef4", "#006efe", "primitives"],
  ["primitives/blue-secondary", "#1e6ef433", "#006efe33", "primitives"],
  ["primitives/blue-secondary-tertiary", "#1e6ef40f", "#006efe0f", "primitives"],
  ["primitives/orange", "#ff8d28", "#ffa056", "primitives"],
  ["primitives/orange-secondary", "#ff8d2833", "#ffa05633", "primitives"],
  ["primitives/orange-secondary-tertiary", "#ff8d280f", "#ffa0560f", "primitives"],
  ["primitives/pink", "#d4167f", "#d4167f", "primitives"],
  ["primitives/pink-secondary", "#d4167f33", "#d4167f33", "primitives"],
  ["primitives/pink-secondary-tertiary", "#d4167f0f", "#d4167f0f", "primitives"],
  ["primitives/purple", "#b02fc2", "#ea8dff", "primitives"],
  ["primitives/purple-secondary", "#b02fc233", "#ea8dff33", "primitives"],
  ["primitives/purple-secondary-tertiary", "#b02fc20f", "#ea8dff0f", "primitives"],
  ["primitives/yellow", "#ffcc00", "#ffd600", "primitives"],
  ["primitives/yellow-secondary", "#ffcc0033", "#ffd60033", "primitives"],
  ["primitives/yellow-secondary-tertiary", "#ffcc000f", "#ffd6000f", "primitives"],
  ["primitives/mint", "#00c8b3", "#00dac3", "primitives"],
  ["primitives/mint-secondary", "#00c8b333", "#00dac333", "primitives"],
  ["primitives/mint-secondary-tertiary", "#00c8b30f", "#00dac30f", "primitives"],
  ["primitives/teal", "#00c3d0", "#00d2e0", "primitives"],
  ["primitives/teal-secondary", "#00c3d033", "#00d2e033", "primitives"],
  ["primitives/teal-secondary-tertiary", "#00c3d00f", "#00d2e00f", "primitives"],
  ["primitives/cyan", "#00c0e8", "#3cd3fe", "primitives"],
  ["primitives/cyan-secondary", "#00c0e833", "#3cd3fe33", "primitives"],
  ["primitives/cyan-secondary-tertiary", "#00c0e80f", "#3cd3fe0f", "primitives"],
  ["primitives/indigo", "#6155f5", "#6d7cff", "primitives"],
  ["primitives/indigo-secondary", "#6155f533", "#6d7cff33", "primitives"],
  ["primitives/indigo-secondary-tertiary", "#6155f50f", "#6d7cff0f", "primitives"],
  ["primitives/gray", "#70707b", "#d1d1d6", "primitives"],
  ["primitives/gray-2", "#a0a0ab", "#a0a0ab", "primitives"],
  ["primitives/gray-3", "#d1d1d6", "#70707b", "primitives"],
  ["primitives/gray-4", "#e4e4e7", "#51525c", "primitives"],
  ["primitives/gray-5", "#f4f4f5", "#3f3f46", "primitives"],
  ["primitives/white", "#ffffff", "#ffffff", "primitives"],
  ["primitives/black", "#0b0b0d", "#0b0b0d", "primitives"],
];

const brands = [
  ["Trusted Smart Chain", "#081cf3", "#081cf3"],
  ["Optio", "#2a5ff6", "#2a5ff6"],
];

const spacingPx = [0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 96];
const radii = [
  ["radius-0", 0],
  ["radius-02", 2],
  ["radius-04", 4],
  ["radius-06", 6],
  ["radius-08", 8],
  ["radius-12", 12],
  ["radius-16", 16],
  ["radius-24", 24],
  ["radius-32", 32],
  ["radius-999", 9999],
];
const fontSizes = [8, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 44, 48, 56, 64, 72, 80, 88, 96];

const textStyles = [
  ["Display 2xl/Regular", "Archivo", 72, 400, "1.1", "0em", false, false],
  ["Display 2xl/Medium", "Archivo", 72, 500, "1.1", "0em", false, false],
  ["Display 2xl/Semibold", "Archivo", 72, 600, "1.1", "0em", false, false],
  ["Display 2xl/Bold", "Archivo", 72, 700, "1.1", "0em", false, false],
  ["Display xl/Regular", "Archivo", 60, 400, "72px", "0em", false, false],
  ["Display xl/Medium", "Archivo", 60, 500, "72px", "0em", false, false],
  ["Display xl/Semibold", "Archivo", 60, 600, "72px", "-0.02em", false, false],
  ["Display xl/Bold", "Archivo", 60, 700, "72px", "0em", false, false],
  ["Display lg/Regular", "Archivo", 48, 400, "60px", "0em", false, false],
  ["Display lg/Medium", "Archivo", 48, 500, "60px", "0em", false, false],
  ["Display lg/Semibold", "Archivo", 48, 600, "60px", "-0.02em", false, false],
  ["Display lg/Bold", "Archivo", 48, 700, "60px", "0em", false, false],
  ["Display md/Regular", "Archivo", 36, 400, "44px", "0em", false, false],
  ["Display md/Medium", "Archivo", 36, 500, "44px", "0em", false, false],
  ["Display md/Semibold", "Archivo", 36, 600, "44px", "-0.02em", false, false],
  ["Display md/Bold", "Archivo", 36, 700, "44px", "0em", false, false],
  ["Display sm/Regular", "Archivo", 30, 400, "38px", "0em", false, false],
  ["Display sm/Medium", "Archivo", 30, 500, "38px", "0em", false, false],
  ["Display sm/Semibold", "Archivo", 30, 600, "1", "0em", false, false],
  ["Display sm/Bold", "Archivo", 30, 700, "38px", "0em", false, false],
  ["Display sm/Medium italic", "Archivo", 30, 500, "44px", "0em", true, false],
  ["Display xs/Regular", "Archivo", 24, 400, "32px", "0em", false, false],
  ["Display xs/Medium", "Archivo", 24, 500, "32px", "0em", false, false],
  ["Display xs/Semibold", "Archivo", 24, 600, "32px", "0em", false, false],
  ["Display xs/Bold", "Archivo", 24, 700, "32px", "0em", false, false],
  ["Display xs/Medium italic", "Archivo", 24, 500, "36px", "0em", true, false],
  ["Text xl/Regular", "Inter", 20, 400, "30px", "0em", false, false],
  ["Text xl/Medium", "Inter", 20, 500, "30px", "0em", false, false],
  ["Text xl/Semibold", "Inter", 20, 600, "30px", "0em", false, false],
  ["Text xl/Bold", "Inter", 20, 700, "30px", "0em", false, false],
  ["Text xl/Regular italic", "Inter", 20, 400, "30px", "0em", true, false],
  ["Text xl/Medium italic", "Inter", 20, 500, "30px", "0em", true, false],
  ["Text xl/Semibold italic", "Inter", 20, 600, "30px", "0em", true, false],
  ["Text xl/Bold italic", "Inter", 20, 700, "30px", "0em", true, false],
  ["Text xl/Regular underlined", "Inter", 20, 400, "30px", "0em", false, true],
  ["Text lg/Regular", "Inter", 18, 400, "28px", "0em", false, false],
  ["Text lg/Medium", "Inter", 18, 500, "28px", "0em", false, false],
  ["Text lg/Semibold", "Inter", 18, 600, "28px", "0em", false, false],
  ["Text lg/Bold", "Inter", 18, 700, "28px", "0em", false, false],
  ["Text lg/Regular italic", "Inter", 18, 400, "28px", "0em", true, false],
  ["Text lg/Medium italic", "Inter", 18, 500, "28px", "0em", true, false],
  ["Text lg/Semibold italic", "Inter", 18, 600, "28px", "0em", true, false],
  ["Text lg/Bold italic", "Inter", 18, 700, "28px", "0em", true, false],
  ["Text lg/Regular underlined", "Inter", 18, 400, "28px", "0em", false, true],
  ["Text lg/Medium underlined", "Inter", 18, 500, "28px", "0em", false, true],
  ["Text md/Regular", "Inter", 16, 400, "24px", "0em", false, false],
  ["Text md/Medium", "Inter", 16, 500, "24px", "0em", false, false],
  ["Text md/Semibold", "Inter", 16, 600, "24px", "0em", false, false],
  ["Text md/Bold", "Inter", 16, 700, "24px", "0em", false, false],
  ["Text md/Regular italic", "Inter", 16, 400, "24px", "0em", true, false],
  ["Text md/Medium italic", "Inter", 16, 500, "24px", "0em", true, false],
  ["Text md/Semibold italic", "Inter", 16, 600, "24px", "0em", true, false],
  ["Text md/Bold italic", "Inter", 16, 700, "24px", "0em", true, false],
  ["Text md/Regular underlined", "Inter", 16, 400, "24px", "0em", false, true],
  ["Text md/Medium underlined", "Inter", 16, 500, "24px", "0em", false, true],
  ["Text sm/Regular", "Inter", 14, 400, "20px", "0em", false, false],
  ["Text sm/Medium", "Inter", 14, 500, "20px", "0em", false, false],
  ["Text sm/Semibold", "Inter", 14, 600, "20px", "0em", false, false],
  ["Text sm/Bold", "Inter", 14, 700, "20px", "0em", false, false],
  ["Text sm/Regular underlined", "Inter", 14, 400, "20px", "0em", false, true],
  ["Text sm/Medium underlined", "Inter", 14, 500, "20px", "0em", false, true],
  ["Text xs/Regular", "Inter", 12, 400, "18px", "0em", false, false],
  ["Text xs/Medium", "Inter", 12, 500, "18px", "0em", false, false],
  ["Text xs/Semibold", "Inter", 12, 600, "18px", "0em", false, false],
  ["Text xs/Bold", "Inter", 12, 700, "18px", "0em", false, false],
];

function colorCssVar(figmaName) {
  const parts = figmaName.split("/");
  const folder = parts[0].toLowerCase();
  const last = parts[parts.length - 1];
  if (folder === "background") {
    const rest = parts.slice(1);
    if (rest[0] === "backgrounds") return `--color-background-${rest.slice(1).join("-")}`;
    if (rest[0] === "branding") return `--color-background-${rest.slice(1).join("-")}`;
    if (rest[0] === "elements") return `--color-background-elements-${rest.slice(1).join("-")}`;
    if (rest[0] === "states") return `--color-background-states-${rest.slice(1).join("-")}`;
  }
  if (folder === "text") return `--color-${last}`;
  if (folder === "borders") return `--color-${last.replace(/^border-/, "border-")}`;
  if (folder === "webstack") return `--color-${last}`;
  if (folder === "primitives") return `--color-primitives-${last}`;
  if (folder === "overlays") return `--color-overlays-${last}`;
  return `--color-${parts.join("-").toLowerCase().replace(/\s+/g, "-")}`;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^\w]+/g, "-")
    .replace(/^-|-$/g, "");
}

function textStyleClass(name) {
  return `text-${slugify(name.replace("/", " "))}`;
}

function tokenId(cssVar) {
  return cssVar.replace(/^--/, "");
}

const tokens = [];

tokens.push({
  id: "font-display",
  figmaName: "font/display",
  cssVar: "--font-display",
  collection: "Fonts",
  type: "fontFamily",
  group: "fonts",
  editorGroup: "Fonts",
  values: {
    light: '"Archivo Variable", "Archivo", sans-serif',
    dark: '"Archivo Variable", "Archivo", sans-serif',
  },
});
tokens.push({
  id: "font-body",
  figmaName: "font/body",
  cssVar: "--font-body",
  collection: "Fonts",
  type: "fontFamily",
  group: "fonts",
  editorGroup: "Fonts",
  values: {
    light: '"Inter Variable", "Inter", sans-serif',
    dark: '"Inter Variable", "Inter", sans-serif',
  },
});

for (const [figmaName, light, dark, group] of colors) {
  const cssVar = colorCssVar(figmaName);
  tokens.push({
    id: tokenId(cssVar),
    figmaName,
    cssVar,
    collection: "Colors",
    type: "color",
    group,
    editorGroup: `Colors / ${group[0].toUpperCase()}${group.slice(1)}`,
    values: { light, dark },
  });
}

for (const [figmaName, light, dark] of brands) {
  const cssVar = `--color-brand-${slugify(figmaName)}`;
  tokens.push({
    id: tokenId(cssVar),
    figmaName,
    cssVar,
    collection: "Brands",
    type: "color",
    group: "brand",
    editorGroup: "Colors / Brand",
    values: { light, dark },
  });
}

for (const px of spacingPx) {
  const cssVar = `--spacing-${px}`;
  tokens.push({
    id: tokenId(cssVar),
    figmaName: `${px}px`,
    cssVar,
    collection: "Spacing",
    type: "spacing",
    group: "spacing",
    editorGroup: "Spacing",
    values: { light: `${px}px`, dark: `${px}px` },
  });
}

for (const [figmaName, px] of radii) {
  const cssVar = `--${figmaName}`;
  tokens.push({
    id: tokenId(cssVar),
    figmaName,
    cssVar,
    collection: "Border Radius",
    type: "radius",
    group: "radius",
    editorGroup: "Radius",
    values: { light: `${px}px`, dark: `${px}px` },
  });
}

for (const px of fontSizes) {
  const cssVar = `--font-size-${px}`;
  tokens.push({
    id: tokenId(cssVar),
    figmaName: `font-${px}px`,
    cssVar,
    collection: "Font Size",
    type: "fontSize",
    group: "fontSize",
    editorGroup: "Font size",
    values: { light: `${px}px`, dark: `${px}px` },
  });
}

const catalog = {
  source: {
    name: "Webstack Design System",
    fileKey: "wBO8pB6A3RmgqTh5JAxrUn",
    url: "https://www.figma.com/design/wBO8pB6A3RmgqTh5JAxrUn",
  },
  tokens,
};

const textStyleCatalog = textStyles.map(
  ([name, family, fontSize, fontWeight, lineHeight, letterSpacing, italic, underline]) => ({
    name,
    className: textStyleClass(name),
    family,
    fontFamilyVar: family === "Archivo" ? "--font-display" : "--font-body",
    fontSize,
    fontSizeVar: `--font-size-${fontSize}`,
    fontWeight,
    lineHeight,
    letterSpacing,
    italic,
    underline,
  }),
);

function cssBlock(selector, mode) {
  const lines = tokens.map((token) => `  ${token.cssVar}: ${token.values[mode]};`);
  return `${selector} {\n${lines.join("\n")}\n}`;
}

const tokensCss = `/* Generated from the Webstack Design System Figma file.
 * Canonical names live in tokens.json. Do not invent values here.
 */
:root {
  color-scheme: light;
}
${cssBlock(":root, [data-theme='light']", "light")}

${cssBlock("[data-theme='dark']", "dark")}
`;

function fontSizeDeclaration(style) {
  if (fontSizes.includes(style.fontSize)) {
    return `var(${style.fontSizeVar})`;
  }
  return `${style.fontSize}px`;
}

const typographyCss = `/* Named Figma text styles. Use these classes — never ad-hoc text-2xl font-bold.
 * Unlayered so unused styles still ship (they are the catalog, not generated utilities).
 */
${textStyleCatalog
  .map((style) => {
    const extras = [];
    if (style.italic) extras.push("  font-style: italic;");
    if (style.underline) extras.push("  text-decoration: underline;");
    const extraBlock = extras.length ? `\n${extras.join("\n")}` : "";
    return `.${style.className} {
  font-family: var(${style.fontFamilyVar});
  font-size: ${fontSizeDeclaration(style)};
  font-weight: ${style.fontWeight};
  line-height: ${style.lineHeight};
  letter-spacing: ${style.letterSpacing};${extraBlock}
}`;
  })
  .join("\n\n")}
`;

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "tokens.json"), JSON.stringify(catalog, null, 2) + "\n");
writeFileSync(join(outDir, "text-styles.json"), JSON.stringify(textStyleCatalog, null, 2) + "\n");
writeFileSync(join(outDir, "tokens.css"), tokensCss);
writeFileSync(join(outDir, "typography.css"), typographyCss);
console.log(
  `Wrote ${tokens.length} tokens and ${textStyleCatalog.length} text styles to ${outDir}`,
);
