# Texture / Grain / FX System (Architecture)

The analog/vintage vocabulary — grain, scanlines, glitch, rust — is a token
layer plus a small set of reusable, reduced-motion-aware components.

## Tokens — `src/design-system/tokens/texture.css` (`--fx-*`)
- Grain: `--fx-grain-opacity[-strong]`, `--fx-grain-blend`.
- Scanlines: `--fx-scanline-alpha` (reuses `--ds-retro-crt-scanline`), `-gap`.
- Glow: `--fx-glow-accent`, `--fx-glow-radius[-strong]`.
- Glitch: `--fx-glitch-offset[-strong]`, `--fx-glitch-r/-b`.
- Rust/metal: `--fx-rust-*`, `--fx-metal-*`, `--fx-screw`, `--fx-vignette`.

Imported via `src/design-system/tokens/index.css`.

## Components — `src/components/fx/`
| Component | Effect | Reduced motion |
|-----------|--------|----------------|
| `FxGrain` | SVG `feTurbulence` grain overlay | static (no flicker) |
| `FxScanlines` | CRT scanline + phosphor breathing | static lines |
| `FxGlitch` | RGB-split / clip-path glitch wrapper | disabled |
| `FxBezel` | rusty brushed-metal housing + corner screws + inset well | n/a |

All accept an `intensity` prop and are decorative (`aria-hidden`). `FxBezel`
provides the console housing; the slotted content carries semantics.

## Usage
Overlays are absolutely positioned and fill their **positioned** parent. Place
them inside a `position: relative` container (e.g. the console hero) above the
content but below interactive z-layers.
