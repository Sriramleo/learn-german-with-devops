---
name: DevDeutsch Clean Light
colors:
  surface: '#ffffff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#3d4a42'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#6d7a72'
  outline-variant: '#bccac0'
  surface-tint: '#006c4a'
  primary: '#006948'
  on-primary: '#ffffff'
  primary-container: '#00855d'
  on-primary-container: '#f5fff7'
  inverse-primary: '#68dba9'
  secondary: '#006780'
  on-secondary: '#ffffff'
  secondary-container: '#76dcff'
  on-secondary-container: '#006077'
  tertiary: '#4b41e1'
  on-tertiary: '#ffffff'
  tertiary-container: '#645efb'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#85f8c4'
  primary-fixed-dim: '#68dba9'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#005137'
  secondary-fixed: '#b7eaff'
  secondary-fixed-dim: '#6cd3f7'
  on-secondary-fixed: '#001f28'
  on-secondary-fixed-variant: '#004e61'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
  canvas: '#f8fafc'
  surface-subtle: '#f1f5f9'
  border-subtle: '#e2e8f0'
  border-strong: '#cbd5e1'
  text-primary: '#0f172a'
  text-secondary: '#334155'
  text-muted: '#64748b'
  accent-emerald: '#10b981'
  accent-cyan: '#06b6d4'
  badge-de-bg: '#ecfdf5'
  badge-de-border: '#a7f3d0'
  badge-de-text: '#065f46'
  badge-en-bg: '#eff6ff'
  badge-en-border: '#bfdbfe'
  badge-en-text: '#1e40af'
  terminal-canvas: '#0f172a'
  terminal-text: '#f8fafc'
  terminal-muted: '#64748b'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '700'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: 1.75rem
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
  code-lg:
    fontFamily: JetBrains Mono
    fontSize: 0.9375rem
    fontWeight: '500'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.05em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '500'
    lineHeight: 0.875rem
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

The design system establishes a high-contrast, surgically clean developer console engineered specifically for light mode workflows. It fuses the discipline of IDE ergonomics with modern editorial UI clarity, eliminating dark-on-dark murkiness, muddied borders, and low-contrast accessibility pitfalls.

The aesthetic follows **Technical Minimalism with High-Contrast Precision**:
- Built on a base of crisp off-whites, cool slate tints, and razor-sharp hairline borders.
- Dense technical layouts (syntax streams, terminal traces, and multilingual token dictionaries) remain legible through deliberate typographic contrast rather than heavy visual framing.
- The interface projects confidence, speed, and analytical rigor without feeling clinical or barren.

## Colors

The palette is anchored in a high-contrast light mode specification designed to meet strict WCAG AAA guidelines across core interactive surfaces and telemetry.

- **Primary (`#059669`)**: Core actions, active navigation anchors, affirmative simulator feedback, and validation states.
- **Secondary (`#0891b2`)**: Developer infrastructure hints, protocol indicators, and secondary tech actions.
- **Tertiary (`#4f46e5`)**: Linguistic markers, contextual links, and syntax references.
- **Neutral (`#0f172a`)**: Deep slate for maximum typographical contrast against clean white and slate surfaces.

### Surface Architecture
- **Canvas Base (`#f8fafc`)**: Neutral background base for full-window layouts.
- **Surface Elevation (`#ffffff`)**: Primary panel surfaces, elevated cards, and active editors.
- **Surface Inset (`#f1f5f9`)**: Sub-panels, code gutters, input wells, and simulator container regions.
- **Terminal Container (`#0f172a`)**: Specialized inverted slate container reserved solely for terminal execution views and interactive REPL instances, paired with high-luminance slate text (`#f8fafc`) to resolve dark contrast conflicts.

## Typography

The type system pairs **Inter** for core UI framing, settings, and documentation with **JetBrains Mono** for code strings, terminal logs, and system telemetry.

- **Prose & Layout**: Inter provides neutral geometry and high legibility across dense dashboard modules.
- **Technical & Tabular Data**: JetBrains Mono enforces consistent horizontal tracking for code syntax, line numbers, variable declarations, and state tags. Tabular figures (`tabular-nums`) are enabled globally across monospaced variants.
- **Multilingual Support**: Headings and container layouts must budget for German compound nouns (`word-break: normal; hyphens: auto;`).

## Layout & Spacing

The layout is constructed on an 8pt base grid within a responsive fluid-column framework tailored for multi-pane developer workflows.

- **Mobile (< 768px)**: 4-column layout. Margin of `1rem`, gutter of `1.25rem`. Complex dual-column comparisons stack into segmented switchable views.
- **Tablet (768px - 1199px)**: 8-column layout. Margin of `1.5rem`, gutter of `1.25rem`. Navigation collapses to an icon rail, enabling split source-and-simulator panels.
- **Desktop (1200px+)**: 12-column layout. Margin of `2rem`, gutter of `1.5rem`. Accommodates a fixed 240px console sidebar alongside synchronized side-by-side terminal, editor, and documentation inspector columns.

## Elevation & Depth

Visual hierarchy is maintained through crisp border delineation and surface tonal stacking rather than blurry, heavy drop shadows.

- **Level 0 (Canvas Base)**: `#f8fafc` — the outermost backdrop.
- **Level 1 (Panels & Cards)**: `#ffffff` framed by a hairline `1px solid #e2e8f0` stroke. No box-shadow is applied, preserving a clean technical blueprint aesthetic.
- **Level 2 (Active/Interactive Focus)**: `#ffffff` elevated by `1px solid #cbd5e1` with a subtle offset drop: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05)`.
- **Level 3 (Modals, Overlays, Command Palette)**: `#ffffff` bordered by `1px solid #cbd5e1` with a controlled, tight ambient shadow: `box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system employs a **Soft (Level 1)** geometric standard. This geometry reflects functional engineering tools:
- Buttons, text inputs, badges, and pill tags use `0.25rem` (4px).
- Cards, code viewports, and terminal frames scale to `rounded-lg` (`0.5rem` / 8px).
- Modals, command bars, and global drawer panels use `rounded-xl` (`0.75rem` / 12px).
- Full circular rounding (`9999px`) is reserved exclusively for avatar containers, status pips, and switch knobs.

## Components

### Buttons
- **Primary**: Solid emerald background (`#059669`), crisp white text (`#ffffff`), `font-weight: 600`. Hover state transitions to `#047857`. Focus state adds an emerald ring (`ring-2 ring-emerald-500/20 ring-offset-2`).
- **Secondary**: Crisp white background (`#ffffff`), slate border (`1px solid #cbd5e1`), dark slate text (`#0f172a`). Hover shifts to `#f8fafc` with border `#94a3b8`.
- **Ghost / Console Action**: Transparent background, text in `#334155`, styled with JetBrains Mono brackets (e.g., `[ run_build ]`). Hover fills with `#f1f5f9`.

### Badges & Tech Chips
- **German (`DE`)**: Light emerald background (`#ecfdf5`), border in `#a7f3d0`, text in `#065f46`.
- **English (`EN`)**: Cool indigo/blue background (`#eff6ff`), border in `#bfdbfe`, text in `#1e40af`.
- **Tech / Status**: JetBrains Mono `label-sm`, light slate background (`#f1f5f9`), border `#e2e8f0`, dark slate text (`#1e293b`).

### Terminal & Code Blocks
- **Terminal Console**: Dark slate backdrop (`#0f172a`), high-contrast text (`#f8fafc`), with muted comments and line numbers in `#64748b`. Commands and prompt symbols (`$`, `>`) render in vibrant `#10b981`.
- **Light Code Blocks**: Clean white background (`#ffffff`), `1px solid #e2e8f0`, line numbers in `#94a3b8` inside a `#f8fafc` gutter. Active lines highlight with `#ecfdf5`.

### Input Fields & Controls
- **Input Fields**: `#ffffff` background with `1px solid #cbd5e1`. Focus transitions to `1px solid #059669` accompanied by an emerald-tinted outer glow. Placeholder text in `#94a3b8`.
- **Checkboxes & Radios**: `0.25rem` roundedness for checkboxes, circular for radios. Inactive state: `#ffffff` with `#cbd5e1` border. Active checked state: solid `#059669` fill with a sharp white mark.

### Cards & Panels
- **Structure**: Flat `#ffffff` card surface, `1px solid #e2e8f0`, with a structured header panel separated by a hairline divider line.
- **Header**: Includes title in Inter semi-bold, secondary meta or badges aligned right, and action buttons sized to `0.75rem` padding.