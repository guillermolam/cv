# Astro Components and Islands

## Component Strategy
- Default: Astro components (`.astro`) for static UI and composition.
- Keep components small and cohesive; prefer composition over deeply nested monoliths.

## Islands / Client-Side JS
Use islands only when the interaction cannot be done with:
- HTML/CSS
- minimal, non-hydrated progressive enhancement

If an island is required:
- Hydrate the smallest subtree possible.
- Keep essential content readable without JS.
- Document why hydration is necessary and what the fallback is.

## Project Constraint Notes
- This project currently does not include a UI framework integration (React/Svelte/Vue) by default.
- Adding a framework integration is a governance/spec decision, not an implementation default.

## Accessibility Rules for Interactive Components
- Keyboard reachable controls.
- Visible focus states.
- Assume meaningful motion is desired when it improves understanding.
- Provide meaningful alternate behavior under reduced motion and never gate access to content behind animation.
- Ensure screen reader semantics and touch targets remain usable in motion-heavy UI.

## Validation Checklist
- No essential content requires client JS.
- Interactive controls work with keyboard.
- Build and basic route smoke checks pass.
