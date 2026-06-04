# Accessibility

## Keyboard Requirements
- Canvas must not trap focus.
- Overlays and controls must be keyboard reachable.
- Visible focus states are required.

## Fallback Content
- Provide a non-WebGL fallback hero.
- All essential content remains outside canvas (semantic HTML).
- If 3D fails, the page must remain usable without layout breakage.

## Semantic Alternatives
- Any meaning conveyed by 3D must also be conveyed via HTML (headings, labels, links).
- 3D is ambience and emphasis, not the only source of information.

## Non-Canvas Accessibility
- Respect reduced motion.
- Avoid flashing/strobing.
- Avoid relying on color alone to convey meaning.
