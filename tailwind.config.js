import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import relumeTailwindPreset from "@relume_io/relume-tailwind";

const catalog = JSON.parse(
  readFileSync(
    join(dirname(fileURLToPath(import.meta.url)), "src/design-system/tokens.json"),
    "utf8",
  ),
);

function buildColors(tokens) {
  /** @type {Record<string, string | Record<string, string>>} */
  const colors = {};

  for (const token of tokens) {
    if (token.type !== "color") continue;
    const name = token.cssVar.replace(/^--color-/, "");
    const [head, ...rest] = name.split("-");
    const value = `var(${token.cssVar})`;
    if (rest.length === 0) {
      colors[head] = value;
      continue;
    }
    const group = colors[head];
    if (!group || typeof group === "string") {
      colors[head] = { [rest.join("-")]: value };
    } else {
      group[rest.join("-")] = value;
    }
  }

  const background =
    typeof colors.background === "object" && colors.background ? colors.background : {};
  const text = typeof colors.text === "object" && colors.text ? colors.text : {};
  const border = typeof colors.border === "object" && colors.border ? colors.border : {};

  // Relume class aliases → Figma tokens so existing screens pick up the DS palette.
  colors.background = {
    ...background,
    primary: "var(--color-background-primary-base)",
    secondary: "var(--color-background-secondary-base)",
    tertiary: "var(--color-background-tertiary-base)",
    alternative: "var(--color-background-elements-fill-primary)",
    success: "var(--color-background-states-success)",
    error: "var(--color-background-states-error)",
  };
  colors.text = {
    ...text,
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    alternative: "var(--color-text-white)",
    success: "var(--color-text-success)",
    error: "var(--color-text-error)",
  };
  colors.border = {
    ...border,
    primary: "var(--color-border-primary)",
    secondary: "var(--color-border-elevated)",
    tertiary: "var(--color-border-light)",
    alternative: "var(--color-primitives-white)",
    success: "var(--color-text-success)",
    error: "var(--color-text-error)",
  };
  colors.link = {
    primary: "var(--color-text-primary)",
    secondary: "var(--color-text-secondary)",
    alternative: "var(--color-text-white)",
  };

  return colors;
}

const colors = buildColors(catalog.tokens);

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [relumeTailwindPreset],
  theme: {
    extend: {
      colors,
      fontFamily: {
        sans: ["var(--font-body)"],
        body: ["var(--font-body)"],
        display: ["var(--font-display)"],
      },
      spacing: {
        0: "var(--spacing-0)",
        1: "var(--spacing-4)",
        2: "var(--spacing-8)",
        3: "var(--spacing-12)",
        4: "var(--spacing-16)",
        5: "var(--spacing-20)",
        6: "var(--spacing-24)",
        7: "var(--spacing-28)",
        8: "var(--spacing-32)",
        9: "var(--spacing-36)",
        10: "var(--spacing-40)",
        11: "var(--spacing-44)",
        12: "var(--spacing-48)",
        14: "var(--spacing-56)",
        16: "var(--spacing-64)",
        24: "var(--spacing-96)",
      },
      borderRadius: {
        none: "var(--radius-0)",
        0: "var(--radius-0)",
        "02": "var(--radius-02)",
        "04": "var(--radius-04)",
        "06": "var(--radius-06)",
        "08": "var(--radius-08)",
        12: "var(--radius-12)",
        16: "var(--radius-16)",
        24: "var(--radius-24)",
        32: "var(--radius-32)",
        sm: "var(--radius-02)",
        DEFAULT: "var(--radius-04)",
        md: "var(--radius-06)",
        lg: "var(--radius-08)",
        xl: "var(--radius-12)",
        "2xl": "var(--radius-16)",
        "3xl": "var(--radius-24)",
        full: "var(--radius-999)",
      },
    },
  },
};
