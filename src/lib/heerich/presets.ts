import { Heerich, type CameraOptions } from 'heerich';

/**
 * heerich scene presets.
 *
 * heerich renders 3D voxel scenes to SVG strings from pure JS, so these run at
 * BUILD TIME inside Astro frontmatter (zero client JS) and can also be rebuilt
 * client-side by the Alpine `heerichScene` component for interactivity.
 *
 * Fills use CSS custom properties so the voxel art themes with the design
 * system; per-face fills give the 3D shading (top brightest → right darkest).
 */

export type HeerichPreset = 'monolith' | 'stationStack' | 'badgeCube';

/** Per-face shaded style keyed to the design tokens. */
const shaded = (accent = false) => {
  const base = accent ? 'var(--color-cta)' : 'var(--color-surface-2)';
  return {
    default: { fill: base, stroke: 'var(--color-border-strong)', strokeWidth: 0.5 },
    top: { fill: accent ? 'var(--color-link-hover)' : 'var(--color-surface-3)' },
    left: { fill: `color-mix(in oklab, ${base}, black 14%)` },
    right: { fill: `color-mix(in oklab, ${base}, black 30%)` },
    front: { fill: base },
  };
};

const defaultCamera: CameraOptions = { type: 'oblique', angle: 45, distance: 15 };

/** Build a scene by preset name and return the configured Heerich instance. */
export function buildScene(
  preset: HeerichPreset,
  opts: { camera?: CameraOptions; tile?: number } = {},
): Heerich {
  const h = new Heerich({
    tile: opts.tile ?? 28,
    camera: opts.camera ?? defaultCamera,
  });

  switch (preset) {
    case 'monolith': {
      // A control-room obelisk: a tall slab with a carved notch + accent cap.
      h.addGeometry({ type: 'box', position: [0, 0, 0], size: [3, 6, 3], style: shaded() });
      // accent cap
      h.addGeometry({ type: 'box', position: [0, 6, 0], size: [3, 1, 3], style: shaded(true) });
      // carved notch (CSG subtract)
      h.removeGeometry({ type: 'box', position: [1, 2, 1], size: [2, 2, 2] });
      break;
    }
    case 'stationStack': {
      // Stacked platform blocks — a topology tower.
      h.addGeometry({ type: 'box', position: [0, 0, 0], size: [5, 1, 5], style: shaded() });
      h.addGeometry({ type: 'box', position: [1, 1, 1], size: [3, 1, 3], style: shaded() });
      h.addGeometry({ type: 'box', position: [2, 2, 2], size: [1, 1, 1], style: shaded(true) });
      break;
    }
    case 'badgeCube': {
      // A beveled accent cube for badges.
      h.addGeometry({ type: 'box', position: [0, 0, 0], size: [3, 3, 3], style: shaded(true) });
      h.removeGeometry({ type: 'box', position: [0, 0, 0], size: [1, 1, 1] });
      h.removeGeometry({ type: 'box', position: [2, 2, 2], size: [1, 1, 1] });
      break;
    }
  }

  return h;
}

/** Build-time convenience: return an SVG string for a preset. */
export function renderPreset(
  preset: HeerichPreset,
  opts: { camera?: CameraOptions; tile?: number; padding?: number } = {},
): string {
  return buildScene(preset, opts).toSVG({ padding: opts.padding ?? 2 });
}
