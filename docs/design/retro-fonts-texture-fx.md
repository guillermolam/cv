# Retro Fonts & Texture/FX Guidelines (Design)

Extends the design system for the Control Room Console with retro digital
typography and an analog texture vocabulary. Stays within the established
graphite + restrained-cyan art direction — no neon, no cyberpunk parody.

## Typography
| Token | Family | Use |
|-------|--------|-----|
| `--font-sans` | Inter | body copy |
| `--font-display` | Space Grotesk | headings |
| `--font-techno` | Orbitron | badges, dial labels, section codes, console title |
| `--font-digital` | Share Tech Mono | LCD/CRT readouts: radar scores, counters, dial screen, NODE/status |
| `--font-mono` | JetBrains Mono | code |

Rules:
- `--font-digital` is for **short** numeric/label readouts only, never paragraphs.
- `--font-techno` for uppercase, letter-spaced labels (≤ ~14px) — squared techno
  feel; avoid long runs of text.
- Keep body and long-form in Inter for readability (4.5:1 contrast minimum).

## Texture / FX
Use the `--fx-*` tokens and `src/components/fx/*` components (see
[texture-grain-system.md](../architecture/texture-grain-system.md)).

Tone guidance:
- **Grain**: subtle by default (`--fx-grain-opacity` ≈ 0.06). Strong grain only
  on the hero/bezel, never behind body text.
- **Scanlines**: subtle; they read as "CRT", not as a moiré distraction.
- **Glitch**: reserve for deliberate moments (route changes, easter eggs). Never
  on persistent reading surfaces. Disabled under reduced motion.
- **Rust/metal (FxBezel)**: the console housing only. Keep the inner well calm
  and high-contrast for content.

## Accessibility
- All FX are decorative (`aria-hidden`) and reduced-motion-aware (no flicker /
  glitch / phosphor breathing when the user prefers reduced motion).
- Retro fonts must not reduce contrast below WCAG AA for any meaningful text.
