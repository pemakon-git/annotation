---
name: DevFlow
colors:
  surface: '#241820'
  surface-dim: '#1a1015'
  surface-bright: '#42363b'
  surface-container-lowest: '#150b10'
  surface-container-low: '#23191e'
  surface-container: '#271c22'
  surface-container-high: '#32272c'
  surface-container-highest: '#3e3137'
  on-surface: '#f1dde5'
  on-surface-variant: '#c7c5d1'
  inverse-surface: '#f1dde5'
  inverse-on-surface: '#392d33'
  outline: '#918f9b'
  outline-variant: '#464650'
  surface-tint: '#bfc2ff'
  primary: '#bfc2ff'
  on-primary: '#252968'
  primary-container: '#8b8fd4'
  on-primary-container: '#222665'
  inverse-primary: '#545899'
  secondary: '#bbc3ff'
  on-secondary: '#001c95'
  secondary-container: '#2138b9'
  on-secondary-container: '#a9b3ff'
  tertiary: '#e1c562'
  on-tertiary: '#3b2f00'
  tertiary-container: '#c4a94a'
  on-tertiary-container: '#4d3e00'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e0e0ff'
  primary-fixed-dim: '#bfc2ff'
  on-primary-fixed: '#0e1152'
  on-primary-fixed-variant: '#3c4080'
  secondary-fixed: '#dee0ff'
  secondary-fixed-dim: '#bbc3ff'
  on-secondary-fixed: '#000e5e'
  on-secondary-fixed-variant: '#1e35b7'
  tertiary-fixed: '#ffe17b'
  tertiary-fixed-dim: '#e1c562'
  on-tertiary-fixed: '#231b00'
  on-tertiary-fixed-variant: '#564500'
  background: '#1a1015'
  on-background: '#f1dde5'
  surface-variant: '#3e3137'
  elevated: '#2E1F28'
  text-primary: '#FFFFFF'
  text-secondary: '#A89DB0'
  text-tertiary: '#6B5F72'
  border-subtle: rgba(139, 143, 212, 0.15)
  border-accent: rgba(139, 143, 212, 0.35)
  gradient-start: '#6B7FFF'
  gradient-mid: '#9B6FD4'
  gradient-warm: '#E8825A'
  gradient-end: '#F0A830'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
  headline-md-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 200px
  navbar-height: 52px
  gutter: 24px
  stack-sm: 8px
  stack-md: 12px
  stack-lg: 16px
---

## Brand & Style

The design system for this project management platform is rooted in a **Premium Dark SaaS** aesthetic, drawing inspiration from high-performance developer tools like Linear and Vercel. The brand personality is confident, precise, and understated, prioritizing functional clarity and deep focus.

The design style is a refined **Minimalism** with a focus on flat, layered surfaces. It avoids heavy shadows, glows, or background gradients in favor of structural integrity and strategic "accent-only" color usage. Depth is communicated through subtle shifts in tonal values rather than skeuomorphic effects. The "Signature Gradient" serves as the brand's visual fingerprint, appearing only as precise indicators—progress fills, active states, and thin decorative rules—to maintain a sophisticated, technical atmosphere.

- **Focus:** Developer productivity and task management.
- **Vibe:** Dark, high-contrast, airy but organized.
- **Core Principle:** Information density without clutter.

## Colors

The palette is strictly dark-mode, centered around deep maroon-blacks and muted lavender-grays. 

### Key Color Roles
- **Primary Accent:** Lavender (#8B8FD4) is the workhorse for interactive elements, primary buttons, and focus states.
- **Surface Tiers:** Backgrounds are layered from the deepest page color (#1A1015) to the card surface (#241820) and finally the elevated/hover state (#2E1F28).
- **Typography:** Use pure white for high-priority headings and primary text. Muted lavender-gray (#A89DB0) provides excellent legibility for secondary content without competing for attention.

### The Signature Gradient
A linear flow from Blue → Purple → Coral → Amber. This is never used for large background fills. It is reserved for:
- 2px horizontal rules (underlines for active navigation).
- Progress bar fills.
- Left-edge indicators for active sidebar items.
- High-impact data visualizations.

## Typography

The design system uses **Inter** exclusively for a technical, systematic appearance. 

- **Hierarchy:** Use bold weights and slight negative tracking for the logo and display titles to create a "branded" feel.
- **Section Headers:** Use the `label-caps` style (11px, Medium, 0.04em tracking) to define clear boundaries between groups in sidebars or dashboard sections.
- **Interface Text:** Most UI labels and card content should default to `body-sm` (13px) or `body-md` (14px) to balance information density with readability.
- **Numeric Data:** For metric cards, use `display-lg` with the Primary Accent color to emphasize key results.

## Layout & Spacing

The layout follows a **Fixed-Fluid hybrid grid**. The main navigation shell consists of a fixed top bar and a fixed left sidebar, while the content area expands to fill the remaining space up to a 1440px max-width.

- **Grid:** Use a 12-column grid for dashboard layouts with 24px gutters.
- **Navigation:** The top navbar is 52px high. The left sidebar is 200px wide.
- **Padding:** Apply a consistent 24px padding to the main content container.
- **Responsiveness:** On mobile, the sidebar collapses into a hamburger menu. Card grids reflow from 3 columns (desktop) to 2 (tablet) and 1 (mobile). Padding reduces to 16px on mobile devices.

## Elevation & Depth

Depth is achieved through **Tonal Layers** and **Low-Contrast Outlines**.

- **Level 0 (Background):** #1A1015 — Used for the canvas and page background.
- **Level 1 (Surface):** #241820 — Used for cards, modals, and panel surfaces. Elements at this level use a subtle border (`border-subtle`).
- **Level 2 (Elevated):** #2E1F28 — Used for hover states on cards and active input backgrounds.
- **Modals:** Use a high-contrast `border-accent` to define the boundary, paired with a 60% black background blur (`backdrop-filter: blur(8px)`) to obscure the content beneath.

Avoid using drop shadows. If depth feels insufficient, increase the contrast of the border rather than adding a shadow.

## Shapes

The shape language is structured to reflect the "Surface Tier" hierarchy:
- **Cards & Containers:** Use 12px (rounded-lg) to create a soft, modern container.
- **Interactive Elements:** Buttons, text inputs, and select fields use 8px (standard) for a more technical, precise feel.
- **Badges & Tags:** Use 6px for compact metadata.
- **Avatars:** Circular (9999px) to provide a soft contrast to the otherwise geometric UI.

## Components

### Buttons
- **Primary:** Solid lavender (#8B8FD4) with white text. 8px radius.
- **Secondary/Ghost:** Border-only or transparent background. Uses `border-accent` on hover.
- **Add/New CTA:** Often features a "+" icon. Can utilize the signature gradient for high-impact entry points (e.g., "Create Project" in empty states).

### Input Fields
- **Default:** #1A1015 background with `border-subtle`. 8px radius. 36px height.
- **Focus:** Transition border to the primary lavender (#8B8FD4). No outer glow.

### Cards
- **Structure:** 12px radius, #241820 surface.
- **Hover:** Shift background to #2E1F28 and border to `border-accent`. 
- **Progress Bars:** Use a #2E1F28 track with the signature gradient fill.

### Status Indicators
- Use consistent tint colors (low opacity background + high opacity text):
  - **Urgent/Overdue:** Coral-red tint.
  - **In Progress:** Amber/Gold tint.
  - **Complete/Done:** Teal-green tint.
  - **Project Types:** Various blue/lavender/purple tints.

### Kanban Columns
- Column headers include a pill-shaped count badge. Columns should have a fixed width (approx 280px-320px) with 12px spacing between cards within the stack.