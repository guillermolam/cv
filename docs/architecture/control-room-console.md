# Control Room Console (Architecture)

The homepage is a single immersive **Hybrid Cloud Control Room console**. One
top-level component orchestrates many small islands that share state through
`nanostores`.

## Component tree
```
ControlRoomConsole.astro            (orchestrator, single component)
├── FxBezel.astro                   rusty metallic housing + screws + well
│   ├── console-topbar              title · NODE · ONLINE · AudioToggle
│   ├── console-hero
│   │   ├── HeroParticleField.astro WebGL particles (gated/lazy) + SVG fallback
│   │   ├── FxScanlines.astro       CRT scanline overlay
│   │   └── FxGrain.astro           film grain overlay
│   ├── console-body
│   │   └── WhoamiOperatorProfile   bio · badges · OperatorStatsPanel
│   │       └── OperatorStatsPanel
│   │           └── LazyRadarChart  Chart.js, lazy + JIT on scroll
│   └── FxGrain.astro               console-wide grain
└── (header, owned by PageLayout)
    ├── SectionNavRail.astro        animated-SVG glyph nav
    └── LanguageDial.astro          Flipper-style i18n wheel
```

## State (nanostores) — `src/stores/control-room.ts`
| Atom | Purpose | Notes |
|------|---------|-------|
| `$activeSection` | current console subview | bio…terminal (Phase B drives it) |
| `$lang` | previewed/active language | initialised from URL prefix |
| `$audioMuted` | audio mute | **persisted**, default `true` |
| `$reducedMotion` | prefers-reduced-motion | set by `initCapabilities()` |
| `$webglSupported` / `$webglEnabled` | WebGL gating | `enabled = supported && !reduced` |

`persistentAtom` (`src/stores/persistent.ts`) backs `$audioMuted` with
SSR-safe localStorage + cross-tab sync.

## Principles
- **Single component, many islands** — interactive parts self-initialise via
  their own `<script>` and subscribe to the store; no cross-island props.
- **Progressive enhancement** — every panel is meaningful static HTML; WebGL,
  audio and motion are gated enhancements. Recruiter fast path never gated.
- **Strict cleanup** — Three.js disposes on `astro:before-swap`/`pagehide`;
  Chart.js `destroy()` on teardown.

## Related
- [webgl-hero.md](./webgl-hero.md) · [language-dial.md](./language-dial.md)
- [texture-grain-system.md](./texture-grain-system.md) · [audio-sfx.md](./audio-sfx.md)
- [heerich-voxel-svg.md](./heerich-voxel-svg.md) (voxel→SVG art in the hero)
- Spec: `.trae/specs/control-room-console-v1/`
