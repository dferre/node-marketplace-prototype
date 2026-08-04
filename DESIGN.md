---
name: Node Marketplace
description: Relume black-and-white wireframe system for a fleet-ops marketplace prototype.
colors:
  ink: "#000000"
  paper: "#ffffff"
  mist: "#eeeeee"
  graphite: "#4b5563"
  rule: "#000000"
  success: "#027a48"
  success-soft: "#ecfdf3"
  error: "#b42318"
  error-soft: "#fef3f2"
typography:
  headline:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  title:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "normal"
  body:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
rounded:
  none: "0px"
spacing:
  xs: "0.5rem"
  sm: "0.75rem"
  md: "1rem"
  lg: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-primary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "12px 24px"
  button-secondary-sm:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "8px 20px"
  badge-outline:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  badge-secondary:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "2px 8px"
  panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  panel-muted:
    backgroundColor: "{colors.mist}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    height: "44px"
    padding: "8px 12px"
---

# Design System: Node Marketplace

## Overview

**Creative North Star: "The Blueprint Desk"**

This prototype’s visual system is a Relume black-and-white wireframe: crisp ink on paper, hard rules, and gray secondary notes. Structure and state readability outrank decoration. Surfaces read like engineering sheets pinned side by side—panels are bordered, flat, and informationally dense without ornamental chrome.

Personality is operator-facing and austere. Hierarchy comes from type weight, border weight, and Paper vs Mist fills—not color theater, glass, or soft elevation. Status greens and reds appear only when the product must communicate success, failure, or eligibility. Boxicons (outline by default, filled for active nav) are the only icon language.

Confirmed rejection: high-fidelity crypto polish, purple/glow dashboards, soft UI cards with multi-layer shadows, and any parallel component library beside Relume UI.

**Key Characteristics:**
- Flat Paper/Mist panels framed by hard Ink rules
- System sans typography with bold page titles and compact body/meta
- Relume Button/Badge/Input/Table/Dialog/Sheet/Sidebar primitives
- Status color reserved for success/error semantics only
- Coarse-pointer touch targets (~44px) without changing desktop density

## Colors

A strict ink-and-paper palette with Graphite for secondary reading contrast, plus system success/error for state only.

### Primary
- **Ink** (`colors.ink`): Primary text, primary button fills, hard borders, and inverse treatments. The single action/identity color of the wireframe.

### Neutral
- **Paper** (`colors.paper`): Default page and panel background; primary-button text on Ink.
- **Mist** (`colors.mist`): Secondary panels, sticky bars, muted badges, and tonal layering without shadows.
- **Graphite** (`colors.graphite`): Secondary text (project override of Relume `#aaa` for AA contrast on white).
- **Rule** (`colors.rule`): Explicit border token alias of Ink for 1px (and occasional 2px) panel/frame strokes.

### Secondary (status only)
- **Success** (`colors.success`) on **Success Soft** (`colors.success-soft`): Positive status text/fills (compatible, complete, earning).
- **Error** (`colors.error`) on **Error Soft** (`colors.error-soft`): Failure and blocking status text/fills.

**The Ink Economy Rule.** Color that is not Ink, Paper, Mist, or Graphite appears only for success/error semantics—never as decorative accent bands or marketing gradients.

**The Graphite Legibility Rule.** Secondary text uses Graphite (`#4b5563`), not Relume’s default `#aaa`, so meta copy stays AA-capable on Paper.

## Typography

**Display Font:** ui-sans-serif / system-ui (browser default stack)
**Body Font:** same system sans stack
**Label/Mono Font:** same stack (no dedicated mono commitment in the prototype)

**Character:** Utilitarian and unstyled—type carries hierarchy through size and weight only, matching wireframe clarity over brand typography.

### Hierarchy
- **Headline** (700, 1.75rem / `text-3xl` at `md+`, line-height 1.4): Page titles on content screens (`text-2xl` → `md:text-3xl`).
- **Title** (700, 1.5rem / `text-2xl`, line-height 1.4): Stat callouts and dense section emphasis.
- **Body** (400, 1rem / `text-base`, line-height 1.5): Primary reading and control labels in chrome.
- **Label** (400, 0.875rem / `text-sm`, line-height 1.5): Meta, helper text, sidebar subtitle, and secondary chrome (`text-text-secondary` → Graphite).

**The One Family Rule.** Do not introduce display serifs, mono stacks, or marketing typefaces while the Relume wireframe commitment holds.

## Layout

App chrome is a Relume Sidebar + inset main: brand/nav in the sidebar, sticky top bar (`h-16`) with page context, content in `main` with `p-4` / `md:p-6`. Vertical rhythm inside pages is typically `gap-4`; nested stacks use `gap-2`–`gap-3`. Panels pad at `p-4` (and `p-6` for empty/state callouts).

Grids collapse to a single column on small viewports; common patterns are `md:grid-cols-3` for overview stats and `md:grid-cols-[minmax(0,1fr)_12rem]` for list/filter splits. Relume breakpoints in use: `sm` 480px, `md` 768px, `lg` 992px, `xl` 1280px. Sticky selection/action bars sit above the debugger FAB (`mb-20` / `md:mb-16`) and respect safe-area insets.

**The Sheet Stack Rule.** Content is a vertical stack of bordered panels—not card carousels, hero bands, or dashboard widget chrome.

## Elevation & Depth

This system is flat by default. Depth is conveyed by **tonal layering** (Paper on Mist, Mist sticky bars over Paper content) and **border weight** (1px rules; 2px for debugger/toast frames), not ambient shadows. Product UI explicitly prefers `shadow-none` on floating chrome so the debugger and toasts read as wireframe sheets, not elevated material.

Relume’s shadow scale exists in the preset but is not part of the prototype’s visual language for product surfaces.

**The Flat Sheet Rule.** No soft drop shadows on product panels, cards, sticky bars, or prototype chrome. If something must sit above the page, thicken the border and keep the fill Paper or Mist.

## Shapes

Corners are square (`rounded.none` / `0px`). Containers are rectangular panels with a continuous Ink rule. Icon wells are square (`size-12`) bordered boxes on Mist. Avoid pills, soft radii, and clipped media cards—the silhouette is the engineering sheet.

**The Hard Edge Rule.** Do not round product panels, buttons, badges, or inputs for polish. Square geometry is the wireframe signal.

## Components

Primitives come from Relume UI; product patterns compose bordered panels around those primitives. Icons: Boxicons only.

### Buttons
- **Shape:** Square corners (`0px`); 1px Ink border on primary/secondary.
- **Primary:** Ink fill, Paper text, padding ~`px-6 py-3` (sm: `px-5 py-2`).
- **Secondary:** Paper fill, Ink text, Ink border—default for most in-flow actions.
- **Hover / Focus:** Relume focus ring offset; do not add glow or lift. Disabled at 50% opacity.
- **Link / Ghost:** Text-style or ghost variants for low-emphasis actions; keep rare in product flows.

### Chips / Badges
- **Outline:** Ink border, Paper fill—default status/meta chip.
- **Secondary:** Mist fill—muted or warning-adjacent labels.
- **Success variant:** Soft green fill with success text when Relume `success` badge is appropriate.
- **State:** Prefer outline/secondary over filled Ink badges so status does not compete with primary buttons.

### Cards / Containers
- **Corner Style:** Square.
- **Background:** Paper for content panels; Mist for muted/empty/sticky regions.
- **Shadow Strategy:** None (see Elevation).
- **Border:** 1px Rule/Ink (`border-border-primary`).
- **Internal Padding:** `16px` (`p-4`) standard; `24px` (`p-6`) for state panels.

### Inputs / Fields
- **Style:** Full-width field, min-height ~44px (`min-h-11`), Ink border, Paper fill, system sans.
- **Focus:** Outline/ring via Relume—no colored glow.
- **Error / Disabled:** Error text/border tokens when validation fails; disabled opacity per Relume.

### Navigation
- Relume Sidebar with bold product name, Graphite “Prototype” subtitle, and Boxicon + label rows.
- Active item uses filled Boxicon pack; inactive uses basic/outline.
- Top inset header shows Graphite product label + semibold current page title (not an `h1` in chrome—page `h1` lives in content).

### Signature: Marketplace / Node Panel
Bordered Paper article with square Mist icon well (`size-12`), bold title, Graphite meta, and Badge + Button row. Same grammar for node list rows and activity items.

### Signature: State Panel
Mist-filled bordered block (`p-6`) for empty, error, offline, and permission messaging—headline, explanation, and one clear next action.

## Do's and Don'ts

### Do:
- **Do** compose screens from bordered Paper/Mist panels with Ink rules and Relume primitives.
- **Do** use Graphite for secondary text so meta copy stays readable on Paper.
- **Do** reserve Success/Error colors for semantic status only.
- **Do** keep product chrome flat (`shadow-none`) and square-cornered.
- **Do** use Boxicons only; outline by default, filled for active navigation.

### Don't:
- **Don't** introduce a second UI library, soft-UI card language, or decorative gradients.
- **Don't** restore Relume’s default `#aaa` secondary text on white backgrounds.
- **Don't** treat partial success, incompatibility, or offline queueing with vague color-only cues—pair status color with explicit copy.
- **Don't** add ambient shadows, glassmorphism, or rounded-full pills to “polish” the wireframe.
- **Don't** invent a production brand palette here; the binding constraint remains the Relume B&W wireframe until PRODUCT.md changes.
