import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetMini,
  presetTypography,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';
import { icons as phIcons }     from '@iconify-json/ph';
import { icons as tablerIcons } from '@iconify-json/tabler';
import { icons as solarIcons }  from '@iconify-json/solar';

/**
 * Recolor downloaded duotone/tritone SVGs so they theme with the design system.
 * The secondary (lighter/fill) tone → the accent at low alpha; the primary
 * (darker/stroke) tone → currentColor. Tweak the source-color list as needed
 * per collection. `currentColor` lets `text-*` utilities drive the icon color.
 */
const recolorLocalSvg = (svg: string): string =>
  svg
    // common "primary" line/stroke colors → currentColor
    .replace(/(fill|stroke)="#(0{3,6}|1[0-9a-f]{5}|212121|222|333|343a40|374151)"/gi, '$1="currentColor"')
    // common "secondary"/duotone fills → accent, semi-transparent
    .replace(/(fill|stroke)="#(fff(fff)?|f0f0f0|e0e0e0|ccc(ccc)?|9e9e9e|6b7280|888|999)"/gi, '$1="var(--color-cta)" $1-opacity="0.35"')
    // hard-coded width/height → make scalable
    .replace(/\s(width|height)="[^"]*"/g, '');

export default defineConfig({
  content: {
    pipeline: {
      include: ['./src/**/*.{astro,html,md,mdx,js,jsx,ts,tsx,css}'],
      exclude: ['./dist/**/*', './.astro/**/*', './node_modules/**/*', './docs/**/*', './.trae/**/*'],
    },
  },

  // ─── Safelist ────────────────────────────────────────────────────────────────
  // Classes generated dynamically (e.g. via Alpine x-bind or JS string concat)
  // that the content scanner cannot see must be listed here so they survive build.
  safelist: [
    // Neural domain badges — applied via Alpine x-bind dynamically
    'neural-badge-development',
    'neural-badge-infra',
    'neural-badge-network',
    'neural-badge-cicd',
    'neural-badge-security',
    'neural-badge-ai',
    // Neural node kind labels — scanned from NeuralNetworkScene.astro, not listed here
    // Domain icon classes referenced in Alpine templates
    'i-ph-cpu-duotone',
    'i-ph-graph-duotone',
    'i-ph-cloud-duotone',
    'i-ph-shield-check-duotone',
    'i-ph-git-branch-duotone',
    'i-ph-robot-duotone',
    'i-tabler-circuit-cell',
    'i-tabler-brain',
    'i-solar-shield-bold-duotone',
    'i-solar-code-bold-duotone',
    'i-solar-server-bold-duotone',
    'i-solar-wi-fi-router-bold-duotone',
    'i-solar-cpu-bolt-bold-duotone',
    'i-solar-atom-bold-duotone',
  ],

  // ─── Presets ────────────────────────────────────────────────────────────────
  presets: [
    // Core utilities (flex, grid, spacing, etc.) — no Tailwind reset
    presetMini(),

    // Attribute-mode: <div flex items-center gap-4> instead of class="flex items-center gap-4"
    presetAttributify(),

    // Icon system: i-ph-* (Phosphor), i-tabler-* (Tabler), i-solar-* (Solar duotone),
    // i-local-* (local SVGs from src/assets/icons/)
    // Usage: <span class="i-ph-cloud-arrow-up-duotone text-xl text-accent" aria-hidden="true" />
    //        <span class="i-tabler-shield-lock text-lg" aria-hidden="true" />
    //        <span class="i-solar-shield-bold-duotone text-xl text-[var(--neural-neuron-security)]" />
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        display: 'inline-block',
        'vertical-align': 'middle',
      },
      collections: {
        ph: phIcons,
        tabler: tablerIcons,
        solar: solarIcons,
        // Local SVGs dropped into src/assets/icons/ become `i-local-<filename>`.
        // e.g. src/assets/icons/cloud-shield.svg  →  class="i-local-cloud-shield"
        // Subfolders flatten with a dash: icons/work/badge.svg → i-local-work-badge
        local: FileSystemIconLoader('./src/assets/icons', recolorLocalSvg),
      },
    }),

    // Prose: class="prose" on MDX/markdown containers
    presetTypography({
      selectorName: 'prose',
      cssExtend: {
        'p,li': { color: 'var(--color-text)' },
        'h1,h2,h3,h4,h5,h6': {
          color: 'var(--color-text-strong)',
          'letter-spacing': '-0.03em',
          'line-height': '1.2',
          'margin-bottom': '0.6em',
        },
        'a': {
          color: 'var(--color-link)',
          'text-decoration-color': 'color-mix(in oklab, var(--color-link), transparent 55%)',
          'text-underline-offset': '3px',
          'text-decoration': 'underline',
        },
        'a:hover': {
          color: 'var(--color-link-hover)',
          'text-decoration-color': 'var(--color-link-hover)',
        },
        'code': {
          color: 'var(--color-text-strong)',
          background: 'var(--color-surface-2)',
          'border-radius': '6px',
          padding: '0.15em 0.4em',
          'font-size': '0.875em',
          'font-family': 'var(--font-mono)',
        },
        'pre': {
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          'border-radius': 'var(--radius-2)',
        },
        'pre code': {
          background: 'transparent',
          padding: '0',
          'border-radius': '0',
        },
        'blockquote': {
          'border-left-color': 'var(--color-border-strong)',
          color: 'var(--color-text-muted)',
          'font-style': 'normal',
        },
        'hr': { 'border-color': 'var(--color-border)' },
        'strong': { color: 'var(--color-text-strong)' },
        'thead': {
          color: 'var(--color-text-muted)',
          'border-bottom-color': 'var(--color-border-strong)',
          'font-size': '0.8125rem',
          'letter-spacing': '0.06em',
          'text-transform': 'uppercase',
        },
        'tbody tr': { 'border-bottom-color': 'var(--color-border)' },
        'td,th': { padding: '0.75rem 1rem' },
        'ul > li::marker,ol > li::marker': { color: 'var(--color-text-muted)' },
        'kbd': {
          background: 'var(--color-surface-2)',
          border: '1px solid var(--color-border)',
          'border-radius': '6px',
          padding: '0.1em 0.4em',
          'font-family': 'var(--font-mono)',
          'font-size': '0.875em',
        },
      },
    }),

    // Web fonts — Inter (body), Space Grotesk (display), JetBrains Mono (code),
    // Orbitron (badges/control labels), Share Tech Mono (CRT/LCD digital readouts).
    // These complement the --font-* CSS variables defined in tokens.css
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: [
          { name: 'Inter', weights: ['400', '500', '600', '700'], italic: true },
        ],
        display: [
          { name: 'Space Grotesk', weights: ['400', '500', '600', '700'] },
        ],
        mono: [
          { name: 'JetBrains Mono', weights: ['400', '500', '600'], italic: true },
        ],
        // Orbitron — squared techno display for badges, dial labels, section codes
        techno: [
          { name: 'Orbitron', weights: ['400', '500', '600', '700', '800', '900'] },
        ],
        // Share Tech Mono — CRT/LCD digital readouts (radar scores, counters, LCD)
        digital: [
          { name: 'Share Tech Mono', weights: ['400'] },
        ],
      },
    }),
  ],

  // ─── Transformers ────────────────────────────────────────────────────────────
  transformers: [
    // @apply and @screen in CSS/Astro <style> blocks
    // Usage: .my-class { @apply flex items-center gap-4; }
    transformerDirectives(),

    // Grouped variant syntax
    // Usage: class="hover:(bg-surface-2 text-strong) focus:(ring-2 ring-focus)"
    transformerVariantGroup(),
  ],

  // ─── Theme ───────────────────────────────────────────────────────────────────
  // Maps design tokens to UnoCSS utilities.
  // Enables: bg-surface, text-muted, border-border, rounded-md, etc.
  theme: {
    colors: {
      // Page surfaces
      bg:           'var(--color-bg)',
      surface:      'var(--color-surface-1)',
      'surface-2':  'var(--color-surface-2)',
      'surface-3':  'var(--color-surface-3)',
      scrim:        'var(--color-scrim)',
      // Borders
      border:        'var(--color-border)',
      'border-strong': 'var(--color-border-strong)',
      // Text
      text:   'var(--color-text)',
      muted:  'var(--color-text-muted)',
      strong: 'var(--color-text-strong)',
      // Interactive
      accent:       'var(--color-cta)',
      'accent-hover': 'var(--color-cta-hover)',
      'accent-glow':  'var(--accent-glow)',
      link:         'var(--color-link)',
      'link-hover': 'var(--color-link-hover)',
      focus:        'var(--color-focus)',
      // Status
      success: 'var(--color-success)',
      warning: 'var(--color-warning)',
      danger:  'var(--color-danger)',
      // DS semantic domain colors
      'ds-security':   'var(--ds-color-security)',
      'ds-cloud':      'var(--ds-color-cloud)',
      'ds-infra':      'var(--ds-color-infra)',
      'ds-automation': 'var(--ds-color-automation)',
      'ds-compliance': 'var(--ds-color-compliance)',
      // ── Neural domain colors ──────────────────────────────────────────────
      // Used as text-neural-development, border-neural-security, etc.
      'neural-development': 'var(--neural-neuron-development)',
      'neural-infra':       'var(--neural-neuron-infra)',
      'neural-network':     'var(--neural-neuron-network)',
      'neural-cicd':        'var(--neural-neuron-cicd)',
      'neural-security':    'var(--neural-neuron-security)',
      'neural-ai':          'var(--neural-neuron-ai)',
      'neural-axon':        'var(--neural-axon-color)',
      'neural-dendrite':    'var(--neural-dendrite-color)',
      'neural-synapse':     'var(--neural-synapse-color)',
      'neural-bg':          'var(--neural-bg)',
      'neural-panel-bg':    'var(--neural-panel-bg)',
      'neural-panel-border': 'var(--neural-panel-border)',
    },
    spacing: {
      '1':  'var(--space-1)',
      '2':  'var(--space-2)',
      '3':  'var(--space-3)',
      '4':  'var(--space-4)',
      '5':  'var(--space-5)',
      '6':  'var(--space-6)',
      '8':  'var(--space-8)',
      '10': 'var(--space-10)',
      '12': 'var(--space-12)',
      '16': 'var(--space-16)',
    },
    borderRadius: {
      sm:   'var(--radius-1)',
      md:   'var(--radius-2)',
      lg:   'var(--radius-3)',
      pill: '999px',
    },
    fontSize: {
      '00': ['var(--font-size-00)', { lineHeight: '1.4' }],
      '0':  ['var(--font-size-0)',  { lineHeight: '1.5' }],
      '1':  ['var(--font-size-1)',  { lineHeight: '1.6' }],
      '2':  ['var(--font-size-2)',  { lineHeight: '1.55' }],
      '3':  ['var(--font-size-3)',  { lineHeight: '1.4' }],
      '4':  ['var(--font-size-4)',  { lineHeight: '1.3' }],
      '5':  ['var(--font-size-5)',  { lineHeight: '1.2' }],
      '6':  ['var(--font-size-6)',  { lineHeight: '1.1' }],
      '7':  ['var(--font-size-7)',  { lineHeight: '1.05' }],
    },
    zIndex: {
      base:          'var(--z-base)',
      header:        'var(--z-header)',
      overlay:       'var(--z-overlay)',
      popover:       'var(--z-popover)',
      modal:         'var(--z-modal)',
      'hero-canvas': 'var(--z-hero-canvas)',
      'hero-content':'var(--z-hero-content)',
      'hero-overlay':'var(--z-hero-overlay)',
    },
    boxShadow: {
      raised:   '0 4px 12px var(--shadow-1)',
      elevated: '0 8px 24px var(--shadow-1)',
      floating: '0 12px 30px var(--shadow-1)',
      deep:     '0 16px 40px var(--shadow-2)',
    },
    transitionDuration: {
      fast:     'var(--motion-fast)',
      standard: 'var(--motion-standard)',
      emphasis: 'var(--motion-emphasis)',
      scene:    'var(--motion-scene)',
    },
    transitionTimingFunction: {
      standard: 'var(--ease-standard)',
      emphasis:  'var(--ease-emphasis)',
    },
    animation: {
      'neural-spin':  'neural-spin 0.8s linear infinite',
      'neural-pulse': 'neural-pulse 2.4s ease-in-out infinite',
      'neural-glow':  'neural-glow 3s ease-in-out infinite',
    },
    keyframes: {
      'neural-spin':  { to: { transform: 'rotate(360deg)' } },
      'neural-pulse': { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
      'neural-glow':  {
        '0%,100%': { 'box-shadow': '0 0 8px 2px var(--neural-synapse-color)' },
        '50%':     { 'box-shadow': '0 0 20px 6px var(--neural-synapse-pulse)' },
      },
    },
  },

  // ─── Shortcuts ───────────────────────────────────────────────────────────────
  shortcuts: [
    // ── Surfaces ─────────────────────────────────────────────────────────────
    ['ds-surface', 'bg-[var(--ds-color-surface)] text-[var(--ds-color-text)] border border-[var(--ds-color-border)] rounded-lg'],
    ['ds-panel',   'bg-[var(--ds-color-surface-raised)] border border-[var(--ds-color-border)] rounded-lg shadow-floating'],
    ['ds-glass',   'bg-[color-mix(in_oklab,var(--color-surface-2),transparent_var(--glass-alpha))] border border-[var(--color-border)] backdrop-blur-[10px]'],

    // ── Badges & chips ───────────────────────────────────────────────────────
    ['ds-badge',         'inline-flex items-center gap-[var(--ds-space-1)] px-[0.55rem] py-[0.25rem] rounded-pill border border-[var(--ds-color-border)] bg-[var(--ds-color-surface-raised)] text-[var(--ds-color-text)] text-00 leading-[1.25]'],
    ['ds-badge-accent',  'ds-badge border-[color-mix(in_oklab,var(--color-cta),transparent_40%)] bg-[color-mix(in_oklab,var(--color-cta),transparent_86%)] text-strong'],
    ['ds-badge-success', 'ds-badge border-[color-mix(in_oklab,var(--color-success),transparent_55%)] bg-[color-mix(in_oklab,var(--color-success),transparent_88%)] text-[var(--color-success)]'],
    ['ds-badge-warning', 'ds-badge border-[color-mix(in_oklab,var(--color-warning),transparent_55%)] bg-[color-mix(in_oklab,var(--color-warning),transparent_88%)] text-[var(--color-warning)]'],
    ['ds-badge-danger',  'ds-badge border-[color-mix(in_oklab,var(--color-danger),transparent_55%)]  bg-[color-mix(in_oklab,var(--color-danger),transparent_88%)]  text-[var(--color-danger)]'],

    // ── Buttons ──────────────────────────────────────────────────────────────
    ['ds-btn',         'inline-flex items-center justify-center gap-[var(--ds-space-2)] border border-[var(--color-border)] rounded-pill px-[var(--ds-space-4)] h-[2.5rem] text-1 text-[var(--color-text)] bg-[color-mix(in_oklab,var(--color-surface-2),transparent_12%)] no-underline cursor-pointer transition-all duration-fast ease-standard'],
    ['ds-btn-primary', 'ds-btn border-[color-mix(in_oklab,var(--color-cta),transparent_40%)] bg-[var(--color-cta)] text-[var(--color-bg)] font-semibold'],
    ['ds-btn-ghost',   'ds-btn border-transparent bg-transparent hover:bg-[color-mix(in_oklab,var(--color-surface-2),transparent_35%)] hover:border-[var(--color-border)]'],

    // ── Typography helpers ───────────────────────────────────────────────────
    ['ds-label',   'text-00 tracking-[0.06em] uppercase text-[var(--color-text-muted)] leading-[1.4]'],
    ['ds-eyebrow', 'text-00 tracking-[0.08em] uppercase text-[var(--color-text-muted)] mb-[var(--ds-space-2)]'],
    ['ds-heading', 'font-display text-[var(--color-text-strong)] tracking-[-0.03em] leading-[1.15]'],

    // ── Focus ────────────────────────────────────────────────────────────────
    ['ds-focus', 'focus-visible:outline-[var(--focus-ring-width)] focus-visible:outline-solid focus-visible:outline-[var(--color-focus)] focus-visible:outline-offset-[var(--focus-ring-offset)]'],

    // ── Data / telemetry ─────────────────────────────────────────────────────
    ['ds-telemetry', 'flex items-center gap-[var(--ds-space-2)] text-00 text-[var(--ds-color-text-muted)]'],

    // ── Charts ───────────────────────────────────────────────────────────────
    ['ds-chart-shell', 'ds-panel p-[var(--ds-space-6)]'],

    // ── Status ───────────────────────────────────────────────────────────────
    ['ds-status-ok',   'text-[var(--color-success)]'],
    ['ds-status-warn', 'text-[var(--color-warning)]'],
    ['ds-status-err',  'text-[var(--color-danger)]'],

    // ── 3D / spatial ────────────────────────────────────────────────────────
    ['ds-icon-depth', '[transform-style:preserve-3d] [perspective:var(--ds-perspective-md)]'],

    // ── Control room backgrounds ─────────────────────────────────────────────
    ['ds-control-grid',  '[background-image:linear-gradient(to_right,rgba(214,226,239,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(214,226,239,0.05)_1px,transparent_1px)] [background-size:24px_24px]'],
    ['ds-scanlines',     '[background-image:repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(0,0,0,calc(var(--ds-retro-crt-scanline))_2px,rgba(0,0,0,calc(var(--ds-retro-crt-scanline)))_2px)]'],

    // ══════════════════════════════════════════════════════════════════════════
    // ── Neural Knowledge Graph shortcuts ─────────────────────────────────────
    // Semantic shorthand for recurring patterns in NeuralNetworkScene.astro and
    // the neuralPanel Alpine component. All colours reference --neural-* tokens
    // from src/design-system/tokens/neural.css so a single token change cascades.
    // ══════════════════════════════════════════════════════════════════════════

    // Scene wrapper
    ['neural-scene', 'relative w-full h-full overflow-hidden bg-neural-bg'],

    // Canvas fills its parent completely
    ['neural-canvas', 'block w-full h-full'],

    // Status overlays (loading / error)
    ['neural-status',       'absolute inset-0 flex items-center justify-center gap-3 font-mono text-0 text-muted pointer-events-none'],
    ['neural-status-error', 'neural-status text-neural-security'],

    // Spinning loader ring
    ['neural-loader', 'inline-block w-4 h-4 rounded-full border-2 border-[rgba(76,201,240,0.2)] border-t-neural-development animate-[neural-spin_0.8s_linear_infinite]'],

    // Hover tooltip box
    ['neural-tooltip',      'absolute pointer-events-none z-[30] bg-neural-panel-bg border border-neural-panel-border rounded-md px-3 py-2 font-mono text-00 text-strong min-w-[140px] max-w-[220px] leading-[1.55]'],
    ['neural-tooltip-kind', 'block text-[0.65rem] [text-transform:uppercase] tracking-[0.1em] text-muted mb-[2px]'],
    ['neural-tooltip-link', 'block mt-1 text-neural-development text-[0.7rem]'],

    // Side panel container
    ['neural-panel-shell',  'absolute top-0 right-0 bottom-0 w-[var(--neural-panel-width,380px)] bg-neural-panel-bg border-l border-neural-panel-border backdrop-blur-[12px] flex flex-col z-[20] overflow-y-auto [transform:translateX(100%)]'],
    ['neural-panel-header', 'flex items-center justify-between px-5 pt-4 pb-3 border-b border-neural-panel-border flex-shrink-0'],
    ['neural-panel-title',  'flex items-center gap-2 font-mono text-0 font-semibold text-strong'],
    ['neural-panel-dot',    'w-[10px] h-[10px] rounded-full flex-shrink-0 shadow-[0_0_6px_currentColor]'],
    ['neural-panel-close',  'bg-transparent border-0 text-muted cursor-pointer text-base p-1 leading-none transition-colors duration-fast hover:text-strong'],
    ['neural-panel-desc',   'px-5 pt-2 pb-0 font-mono text-00 text-muted leading-relaxed m-0 flex-shrink-0'],
    ['neural-panel-chart',  'flex-1 min-h-[260px] px-2 pt-2'],
    ['neural-panel-footer', 'px-5 py-3 border-t border-neural-panel-border flex-shrink-0'],
    ['neural-panel-back',   'bg-transparent border-0 text-neural-development font-mono text-00 cursor-pointer p-0 hover:underline'],

    // Axon quick-pick nav inside panel
    ['neural-axon-nav',  'px-5 py-3 flex flex-wrap gap-[0.4rem] flex-shrink-0'],
    ['neural-axon-hint', 'w-full font-mono text-[0.7rem] text-muted m-0 mb-[0.4rem]'],
    ['neural-axon-btn',  'bg-[rgba(76,201,240,0.07)] border border-[rgba(76,201,240,0.2)] rounded-sm px-[0.6rem] py-1 font-mono text-00 text-strong cursor-pointer transition-colors duration-fast hover:bg-[rgba(76,201,240,0.18)]'],

    // Keyboard controls hint bar
    ['neural-controls', 'absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[0.7rem] text-[rgba(143,163,184,0.55)] pointer-events-none whitespace-nowrap select-none'],
    ['neural-controls-kbd', 'bg-[rgba(76,201,240,0.1)] border border-[rgba(76,201,240,0.2)] rounded-[3px] px-[5px] py-[1px] font-mono text-[inherit]'],

    // Domain-tinted badges — extend ds-badge with each neuron's accent colour.
    // Build-time scanner misses these (dynamically applied via Alpine x-bind),
    // so they are also listed in `safelist` above.
    ['neural-badge-development', 'ds-badge border-[color-mix(in_oklab,var(--neural-neuron-development),transparent_40%)] bg-[color-mix(in_oklab,var(--neural-neuron-development),transparent_88%)] text-[var(--neural-neuron-development)]'],
    ['neural-badge-infra',       'ds-badge border-[color-mix(in_oklab,var(--neural-neuron-infra),transparent_40%)]       bg-[color-mix(in_oklab,var(--neural-neuron-infra),transparent_88%)]       text-[var(--neural-neuron-infra)]'],
    ['neural-badge-network',     'ds-badge border-[color-mix(in_oklab,var(--neural-neuron-network),transparent_40%)]     bg-[color-mix(in_oklab,var(--neural-neuron-network),transparent_88%)]     text-[var(--neural-neuron-network)]'],
    ['neural-badge-cicd',        'ds-badge border-[color-mix(in_oklab,var(--neural-neuron-cicd),transparent_40%)]        bg-[color-mix(in_oklab,var(--neural-neuron-cicd),transparent_88%)]        text-[var(--neural-neuron-cicd)]'],
    ['neural-badge-security',    'ds-badge border-[color-mix(in_oklab,var(--neural-neuron-security),transparent_40%)]    bg-[color-mix(in_oklab,var(--neural-neuron-security),transparent_88%)]    text-[var(--neural-neuron-security)]'],
    ['neural-badge-ai',          'ds-badge border-[color-mix(in_oklab,var(--neural-neuron-ai),transparent_40%)]          bg-[color-mix(in_oklab,var(--neural-neuron-ai),transparent_88%)]          text-[var(--neural-neuron-ai)]'],

    // Node kind labels inside the tooltip — inlined to avoid nested-shortcut resolution
    ['neural-kind-neuron',   'block text-[0.65rem] [text-transform:uppercase] tracking-[0.1em] mb-[2px] text-neural-development'],
    ['neural-kind-axon',     'block text-[0.65rem] [text-transform:uppercase] tracking-[0.1em] mb-[2px] text-neural-axon'],
    ['neural-kind-dendrite', 'block text-[0.65rem] [text-transform:uppercase] tracking-[0.1em] mb-[2px] text-neural-dendrite'],
  ],
});
