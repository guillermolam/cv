import type { AstroIntegration } from 'astro';

/**
 * apexchartsIntegration — wires ApexCharts + ApexTree into Astro via the
 * Integration API.
 *
 * ApexCharts is client-only (no SSR usage), so we only need Vite's
 * `optimizeDeps` pre-bundling — without it, any dynamic `import('apexcharts')`
 * inside an Alpine component will trigger a mid-session Vite dep
 * re-optimisation that aborts the in-flight request and shows a blank chart.
 *
 * We do NOT mark it `ssr.noExternal` because we never import it from
 * `.astro` frontmatter (build-time SSR context).
 */
export type ApexChartsIntegrationOptions = {
  /** log a one-line diagnostic at config:setup (default true) */
  verbose?: boolean;
};

export default function apexchartsIntegration(
  options: ApexChartsIntegrationOptions = {},
): AstroIntegration {
  const { verbose = true } = options;

  return {
    name: 'apexcharts',
    hooks: {
      'astro:config:setup': ({ updateConfig, logger }) => {
        updateConfig({
          vite: {
            optimizeDeps: {
              include: ['apexcharts'],
            },
          },
        });
        if (verbose) {
          logger.info('ApexCharts + ApexTree pre-bundled for client-side rendering');
        }
      },
    },
  };
}
