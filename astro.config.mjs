import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import UnoCSS from 'unocss/astro';

import alpinejs from '@astrojs/alpinejs';
import heerich from './integrations/heerich/index.ts';
import apexcharts from './integrations/apexcharts/index.ts';

export default defineConfig({
  output: 'static',
  integrations: [
    mdx(),
    UnoCSS(),
    alpinejs({ entrypoint: '/src/alpine/index' }),
    heerich(),
    apexcharts(),
  ],
  devToolbar: {
    enabled: false,
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1600,
    },
    // Pre-bundle the heavy libraries that are loaded via dynamic import()
    // (WebGL hero, lazy charts, motion). Without this, adding new deps triggers
    // a mid-session Vite dep re-optimization that ABORTS in-flight dynamic
    // imports → "Failed to fetch dynamically imported module" for three/chart.js.
    optimizeDeps: {
      include: [
        'three',
        'three/addons/controls/OrbitControls.js', // neural network OrbitControls
        'chart.js',
        'chart.js/auto',
        'gsap',
      ],
    },
  },
});
