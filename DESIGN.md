# Design System: Webstack Node Marketplace

Canonical source: [Webstack Design System (Figma)](https://www.figma.com/design/wBO8pB6A3RmgqTh5JAxrUn). Machine-readable catalogs: `src/design-system/tokens.json` and `src/design-system/text-styles.json`. CSS variables: `src/design-system/tokens.css`. Named type styles: `src/design-system/typography.css`.

This pass is **tokens only**. Existing Relume screens are legacy and consume Figma tokens through Tailwind aliases. New primitives go to Untitled UI in a later pass — do not add Relume components or one-off UI.

## Tokens

All color, spacing, radius, font-size, and font-family values are CSS custom properties. Never use raw hex, arbitrary Tailwind values, or ad-hoc type.

Live overrides: Prototype debugger → **Style** tab (persists in `localStorage` until reset).

### Color

Semantic layers from Figma (light / dark):

- Backgrounds: `--color-background-primary-base` (`#f7f7f7` / `#0b0b0d`), secondary, tertiary, plus branding, elements, and states
- Text: `--color-text-primary` (`#000000` / `#ffffff`) through tertiary/quaternary, plus error/success/warning/info/brand
- Borders: `--color-border-primary` (`#ebebeb` / `#18181c`), base, elevated, light
- Brand: `--color-webstack-pink` `#d4167f` (brand fill), plus blue / orange / green
- Primitives: red, green, blue, orange, pink, purple, yellow, mint, teal, cyan, indigo, gray 1–5, white, black

Relume compatibility aliases: `bg-background-primary` → `--color-background-primary-base`, `text-text-secondary` → `--color-text-secondary`, `border-border-primary` → `--color-border-primary`.

### Typography

- **Display:** Archivo Variable (`--font-display`) — `text-display-{2xl|xl|lg|md|sm|xs}-{regular|medium|semibold|bold}`
- **Body:** Inter Variable (`--font-body`) — `text-{xl|lg|md|sm|xs}-{regular|medium|semibold|bold}` plus italic / underlined variants listed in `text-styles.json`

Use those named classes only. Do not use `text-2xl font-bold`.

### Spacing and radius

4px grid: `--spacing-0` through `--spacing-96`. Tailwind `p-4` maps to `--spacing-16` (16px).

Radii: `--radius-0`, `--radius-02` … `--radius-32`, `--radius-999`. Classes: `rounded-none`, `rounded-08`, `rounded-full`.

### Font size

`--font-size-8` through `--font-size-96`. Named text styles already bind to these variables.

## Components

Primitives currently on screen are Relume (legacy). Destination is Untitled UI. Until that install:

- Do not add new Relume primitives
- Do not create one-off buttons, inputs, or cards
- Style only with catalog tokens

## Do

- Read `tokens.json` / `text-styles.json` before adding visual styles
- Prefer semantic tokens (`text-text-primary`, `bg-background-secondary-base`) over primitives
- If a token is missing, add it in Figma then the catalog

## Don't

- Don't hardcode hex, rgb, or arbitrary `[…]` Tailwind values
- Don't invent font sizes, families, or weights outside named text styles
- Don't add a second component library beside the planned Untitled UI migration
