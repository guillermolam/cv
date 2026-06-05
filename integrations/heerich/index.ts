import type { AstroIntegration } from 'astro';

/**
 * heerichIntegration — wires the heerich voxel→SVG library into Astro via the
 * Integration API.
 *
 * heerich is used at BUILD TIME inside `.astro` frontmatter (SSR context during
 * the static build). To guarantee Vite resolves/bundles its ESM in that SSR
 * pass — and pre-bundles it for the dev server — we mark it `ssr.noExternal`
 * and add it to `optimizeDeps`. The integration also emits a short diagnostic so
 * the capability is visible in build logs.
 */
export type HeerichIntegrationOptions = {
  /** log a one-line diagnostic at config:setup (default true) */
  verbose?: boolean;
};

export default function heerichIntegration(
  options: HeerichIntegrationOptions = {},
): AstroIntegration {
  const { verbose = true } = options;

  return {
    name: 'heerich-voxel-svg',
    hooks: {
      'astro:config:setup': ({ updateConfig, logger }) => {
        updateConfig({
          vite: {
            ssr: { noExternal: ['heerich'] },
            optimizeDeps: { include: ['heerich'] },
          },
        });
        if (verbose) {
          logger.info('voxel→SVG rendering enabled (build-time + Alpine interactive)');
        }
      },
    },
  };
}
