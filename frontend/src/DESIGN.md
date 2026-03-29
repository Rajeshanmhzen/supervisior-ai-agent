```markdown
# Design System Strategy: The Academic Curator

## 1. Overview & Creative North Star
The "Creative North Star" for this design system is **The Academic Curator**. While traditional academic software is often dense, rigid, and utilitarian, this system reimagines the "Supervisor Agent" as a sophisticated, breathable editorial space. It targets a youth-focused demographic by blending the precision of a Swiss grid with the approachability of soft, oversized geometries.

The design breaks the "template" look by eschewing standard borders in favor of **Tonal Topography**. Instead of using lines to separate ideas, we use rhythmic spacing and shifting surface luminances. This creates an environment that feels less like a database and more like a high-end digital workspace—intentional, calm, and intellectually stimulating.

---

## 2. Colors & Surface Philosophy
The palette utilizes a sophisticated Material Design-inspired range, moving from deep, authoritative blues (`primary`) to vibrant, youth-centric purples (`secondary`).

### The "No-Line" Rule
To achieve a premium, custom feel, **1px solid borders are prohibited for sectioning.** Boundaries must be defined solely through background color shifts or tonal transitions. For example, a sidebar should be `surface_container_low` sitting against a `background` main stage. 

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Use the following tiers to define importance:
*   **Base:** `background` (#f8f9fb)
*   **Low Priority/Sections:** `surface_container_low` (#f3f4f6)
*   **Standard Cards/Containers:** `surface_container_lowest` (#ffffff)
*   **Active/Elevated Elements:** `surface_container_high` (#e7e8ea)

### The "Glass & Gradient" Rule
While the core request avoids "flashy" decorations, we use **Glassmorphism** for floating elements (like command palettes or navigation overlays). Use semi-transparent surface colors with a `backdrop-blur` of 20px-30px. 
*   **Signature Polish:** For primary CTAs, use a subtle, nearly imperceptible gradient from `primary` (#004ac6) to `primary_container` (#2563eb). This adds "visual soul" and depth that prevents the button from looking like a flat placeholder.

---

## 3. Typography: Editorial Authority
The system pairs **Manrope** (Display/Headline) with **Inter** (Body/Labels). Manrope provides a modern, geometric flair that feels "youth-focused," while Inter maintains legibility for dense academic content.

*   **Display (Manrope):** Large, bold, and airy. Used for page titles and high-level stats. (e.g., `display-lg`: 3.5rem).
*   **Headline (Manrope):** Sets the tone for sections. Use `headline-sm` (1.5rem) for card titles to create an editorial feel.
*   **Body (Inter):** Optimized for long-form reading. Use `body-md` (0.875rem) for primary content to keep the UI feeling "light."
*   **Labels (Inter):** High-contrast, uppercase metadata using `label-sm` (0.6875rem) with increased letter spacing.

---

## 4. Elevation & Depth
In this design system, depth is a function of light and layering, not structural scaffolding.

*   **The Layering Principle:** Achieve lift by "stacking." A `surface_container_lowest` card placed on a `surface_container_low` background creates a natural, soft lift without a single shadow.
*   **Ambient Shadows:** For floating modals or "Supervisor Agent" chat bubbles, use extra-diffused shadows: `box-shadow: 0 20px 40px rgba(17, 24, 39, 0.06)`. The shadow color must be a tinted version of the `on-surface` color, never pure black.
*   **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` token at 15% opacity. **Never use 100% opaque borders.**
*   **Corner Radii:** Use the **xl** (3rem) for hero containers and **lg** (2rem) for primary cards. This "oversized" radius communicates the youth-focused, approachable nature of the agent.

---

## 5. Components

### Buttons
*   **Primary:** Subtle gradient (`primary` to `primary_container`), `xl` corner radius, white text.
*   **Secondary:** `secondary_container` background with `on_secondary_container` text. No border.
*   **Tertiary:** Ghost style. No background; `primary` text color. On hover, apply `surface_container_high`.

### Input Fields
*   **Surface:** `surface_container_low`.
*   **Focus State:** Shift background to `surface_container_lowest` and add a 2px `surface_tint` "Ghost Border" at 20% opacity.
*   **Structure:** No bottom lines. Use `label-md` floating above the input for a clean, professional look.

### Cards & Lists
*   **Strict Rule:** No divider lines. Separate list items using `spacing-4` (1rem) vertical gaps or alternating tonal shifts (`surface_container_lowest` vs `surface_container_low`).
*   **Interaction:** On hover, a card should transition its background color slightly or increase its "Ambient Shadow" spread.

### The "Agent" Chat Bubble (Context Specific)
*   **Supervisor Output:** Use a `secondary_fixed` background to distinguish the Agent's voice from the user's data.
*   **Shape:** Use asymmetrical radii (e.g., Top-Left: `xl`, Top-Right: `xl`, Bottom-Left: `sm`, Bottom-Right: `xl`) to give the Agent a distinct visual signature.

---

## 6. Do's and Don'ts

### Do:
*   **Use Asymmetry:** Place a large headline on the left with significant white space on the right to create an "Editorial" feel.
*   **Leverage White Space:** Use `spacing-12` or `spacing-16` between major sections to let the academic content breathe.
*   **Focus on Typography Scale:** Let the difference between `display-lg` and `body-sm` do the work of organizing the page.

### Don't:
*   **Don't use 1px dividers.** It makes the app look like a legacy spreadsheet. Use color shifts.
*   **Don't use 100% Black.** Use `on_surface` (#191c1e) for text to maintain a premium, softer contrast.
*   **Don't crowd the edges.** Maintain a minimum of `spacing-8` (2rem) padding inside all containers.
*   **Don't use sharp corners.** Everything should feel "held" and safe, utilizing the `lg` and `xl` radius tokens.