---
name: Node Marketplace
description: Vercel-inspired Operate UI — Geist, soft borders, achromatic canvas, blue focus only.
colors:
  canvas: "#FAFAFA"
  elevated: "#FFFFFF"
  recessed: "#F2F2F2"
  hover: "#EBEBEB"
  border: "#EAEAEA"
  border-strong: "#D4D4D4"
  foreground: "#171717"
  secondary: "#666666"
  muted: "#8F8F8F"
  nav: "#4D4D4D"
  accent: "#0072F5"
  accent-focus: "#005FCC"
  accent-soft: "rgba(0, 114, 245, 0.16)"
  success: "#398E4A"
  success-dot: "#45A557"
  success-soft: "#ECFDF3"
  warning: "#FF990A"
  error: "#E5484D"
  error-soft: "#FEF3F2"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.04em"
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.03em"
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: "normal"
  caption:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: "normal"
  mono:
    fontFamily: "Geist Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.54
    letterSpacing: "normal"
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  full: "9999px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
  xl: "2rem"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.elevated}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "40px"
  button-primary-hover:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.elevated}"
  button-secondary:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
    height: "40px"
  button-secondary-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.foreground}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.nav}"
    rounded: "{rounded.sm}"
    padding: "8px 12px"
  button-ghost-hover:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.foreground}"
  badge:
    backgroundColor: "{colors.recessed}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.full}"
    padding: "2px 8px"
  panel:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "16px"
  panel-muted:
    backgroundColor: "{colors.recessed}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.elevated}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "8px 12px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.nav}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
  nav-item-active:
    backgroundColor: "{colors.hover}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.sm}"
    padding: "8px 10px"
---

# Design System: Node Marketplace

## Overview

**Creative North Star: "Quiet Deploy"**

The Node Marketplace prototype speaks Vercel’s Operate language: an achromatic canvas where hierarchy comes from weight, spacing, and soft edges—not ornament. Geist carries every UI string; Geist Mono is reserved for addresses, hashes, and code-like data. Blue is the only interactive accent. Status greens, ambers, and reds appear as compact indicators or soft-tinted badges, never as decorative fills.

Personality is developer-tool quiet confidence. Screens should feel engineered and scannable—sidebar nav with soft hover fills, elevated white panels edged by shadow-as-border, primary actions in near-black. Density is comfortable (~40px controls) rather than sparse marketing whitespace or cramped wireframe tables.

Confirmed rejection: Relume hard-black square wireframe as the identity, purple/glow crypto dashboards, multi-layer colored soft-UI shadows, and decorative gradients.

**Key Characteristics:**
- Achromatic `#FAFAFA` canvas with elevated white panels
- Geist 400/500/600 only; Geist Mono for data
- Shadow-as-border elevation and double-ring blue focus
- Soft 6–12px radii; pill radius for badges and status dots
- Boxicons outline by default; filled only for active nav

## Colors

The palette is fundamentally achromatic: four grayscale stops for surface and text, one blue for interaction, and compact semantic colors for status.

### Primary
- **Operate Blue** (`#0072F5`): Links, focus rings, and interactive emphasis. Rarity is the point—never a large background band.
- **Accent Focus** (`#005FCC`): Darker blue for pressed/focus outline variants.
- **Accent Soft** (`rgba(0, 114, 245, 0.16)`): Selected-row tint and subtle interactive washes only.

### Secondary
- **Success** (`#398E4A`) / **Success Dot** (`#45A557`) / **Success Soft** (`#ECFDF3`): Compatible/online status at indicator or badge scale.
- **Warning** (`#FF990A`): Caution indicators only.
- **Error** (`#E5484D`) / **Error Soft** (`#FEF3F2`): Failure states and compact error surfaces.

### Neutral
- **Canvas** (`#FAFAFA`): Page and sidebar background.
- **Elevated** (`#FFFFFF`): Cards, sheets, inputs, menus.
- **Recessed** (`#F2F2F2`): Inset wells, muted panels, badge fills.
- **Hover** (`#EBEBEB`): Nav/button hover and active fills.
- **Border** (`#EAEAEA`) / **Border Strong** (`#D4D4D4`): Separators and stronger control edges.
- **Foreground** (`#171717`): Primary text and primary button fill.
- **Secondary** (`#666666`): Supporting copy.
- **Muted** (`#8F8F8F`): Helpers, timestamps, disabled-adjacent meta.
- **Nav** (`#4D4D4D`): Default navigation and secondary control labels.

### Named Rules
**The Blue Economy Rule.** Blue is for links, focus, and interactive emphasis—never large decorative fills. Audit: if blue occupies more than a thin control or text run, remove it.

**The Indicator Scale Rule.** Status color stays at ~10px dots or compact badges; soft tints (`success-soft`, `error-soft`) wrap only small status chips, not full-width banners unless the product state truly requires interruption.

## Typography

**Display / UI Font:** Geist (with `ui-sans-serif, system-ui, sans-serif`)
**Mono Font:** Geist Mono (with `ui-monospace, SFMono-Regular, Menlo, monospace`)

**Character:** Engineered and precise. Tight tracking on display and title sizes creates density without shouting; body and labels stay open and readable.

### Hierarchy
- **Display** (600, 2rem, line-height 1.15, tracking `-0.04em`): Page-level titles in app chrome.
- **Title** (600, 1.25rem, line-height 1.3, tracking `-0.03em`): Section and panel headings.
- **Body** (400, 1rem, line-height 1.5): Primary reading text; keep lines readable (~65–75ch where prose runs long).
- **Label** (400, 0.875rem, line-height 1.43): Form labels, nav items, button labels, chrome meta. Use 500 for active nav emphasis.
- **Caption** (400, 0.75rem, line-height 1.33): Dense helpers and timestamps.
- **Mono** (500, 0.8125rem, line-height 1.54): Wallet addresses, IDs, hashes, code snippets.

### Named Rules
**The Three-Weight Rule.** Use 400, 500, and 600 only. Do not introduce 700 for hierarchy—size and spacing carry emphasis.

**The Mono Reservation Rule.** Geist Mono is for machine-readable strings only, never for marketing headlines or body prose.

## Layout

Operator and developer shells use a persistent left sidebar on canvas with an inset main column. Main content stays on canvas; interactive content lives in elevated panels.

Density is comfortable: ~40px control height, 16–24px section padding, soft 1px separators instead of heavy rules. Prefer one job per panel; avoid nested card stacks. Responsive shells collapse sidebar chrome on smaller viewports while keeping the same tonal language. Coarse-pointer devices may enlarge hit targets (~44px) without changing desktop density.

Spacing rhythm: `xs` 0.5rem, `sm` 0.75rem, `md` 1rem, `lg` 1.5rem, `xl` 2rem.

## Elevation & Depth

Depth is tonal and structural, not decorative. Prefer shadow-as-border over hard black outlines. Surfaces are flat at rest; ambient shadow appears for menus and floating chrome.

### Shadow Vocabulary
- **Border** (`box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08)`): Default elevated panel edge.
- **Border small / medium / large**: Progressive ambient layers for slightly lifted cards (still grayscale, still quiet).
- **Menu** (`0 0 0 1px rgba(0, 0, 0, 0.08), 0 1px 1px rgba(0, 0, 0, 0.02), 0 4px 8px -4px rgba(0, 0, 0, 0.04), 0 16px 24px -8px rgba(0, 0, 0, 0.06)`): Menus, sheets, and floating chrome.
- **Focus** (`0 0 0 2px #ffffff, 0 0 0 4px #0072F5`): Double-ring focus pattern on interactive controls.

Header separators may use a 1px border or a hairline shadow (`0 1px 0 0 rgba(0, 0, 0, 0.1)`).

### Named Rules
**The Soft Edge Rule.** Prefer `#EAEAEA` borders and shadow-as-border over hard black Relume frames.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Ambient shadow appears only for floating layers (menus, sheets) or focus—not as a default card glow.

## Shapes

Corner language is softly rounded, never square-ink wireframe and never pill-everything.

- **6px (`sm`)**: Buttons, inputs, nav items—the default control radius.
- **8px (`md`)**: Compact controls and intermediate chrome.
- **12px (`lg`)**: Cards, elevated panels, sheets.
- **16px (`xl`)**: Larger containers when needed.
- **9999px (`full`)**: Pills, avatars, status dots only.

### Named Rules
**The Control Radius Rule.** Interactive controls default to 6px; content panels default to 12px. Do not mix square Relume geometry into new surfaces.

## Components

Components feel refined and restrained: near-black primary actions, bordered white secondaries, soft nav fills, elevated panels.

### Buttons
- **Shape:** Gently curved (6px)
- **Primary:** Near-black fill (`foreground`) with white label; padding `8px 12px`; height 40px; 1px matching border
- **Secondary:** White fill, soft `#EAEAEA` border, foreground text; hover fills `#EBEBEB`
- **Ghost:** Transparent with nav gray text; hover fills `#EBEBEB` and shifts text to foreground
- **Hover / Focus:** Color transitions ~150ms ease; focus uses the double-ring blue pattern—never a purple glow

### Badges / Chips
- **Style:** Recessed gray pill, or soft status tint (`success-soft` / `error-soft`) with matching status text
- **Shape:** Full pill radius; padding `2px 8px`
- **State:** Outline badges use border token, not hard ink rules

### Cards / Containers
- **Corner Style:** 12px on elevated panels
- **Background:** Elevated white, or recessed for muted wells
- **Shadow Strategy:** Shadow-as-border by default; menu shadow for floating sheets
- **Border:** Soft `#EAEAEA` when a true border is needed; prefer shadow-border
- **Internal Padding:** 16px typical

### Inputs / Fields
- **Style:** Elevated white fill, soft border, 6px radius, 40px height, `8px 12px` padding
- **Focus:** Double-ring (`focus` shadow) or accent-focus outline—never thick black Relume rings
- **Error / Disabled:** Error border/text at control scale; muted text for disabled

### Navigation
- **Style:** Sidebar rows on canvas; label color `#4D4D4D`; 6px radius; padding `8px 10px`
- **Hover:** `#EBEBEB` fill, foreground text
- **Active:** `#EBEBEB` fill, foreground text, weight 500
- **Icons:** Boxicons outline by default; filled only for the active item

### Signature: Wallet sheet / debugger
Same elevated language as panels—white surface, soft edge, mono for addresses. Debugger controls stay quiet chrome, not a second visual system.

## Do's and Don'ts

### Do:
- **Do** compose Operate screens from soft-bordered elevated panels on `#FAFAFA`.
- **Do** use Geist with the three-weight rule (400/500/600) and tight display/title tracking (`-0.03em` to `-0.04em`).
- **Do** keep primary actions near-black and secondary actions bordered white.
- **Do** reserve blue for links, focus, and interactive emphasis.
- **Do** use Boxicons; outline by default, filled for active navigation.

### Don't:
- **Don't** restore Relume square ink-border wireframe as the default look.
- **Don't** paint large purple/blue gradient surfaces or multi-layer colored glow shadows.
- **Don't** use font-weight 700 for “more hierarchy.”
- **Don't** turn status colors into full-width alert banners unless the product state truly requires interruption.
- **Don't** use Geist Mono for UI chrome copy or marketing headlines.
