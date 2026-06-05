import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import UnoCSS from 'unocss/astro';

import alpinejs from '@astrojs/alpinejs';
import heerich from './integrations/heerich/index.ts';

export default defineConfig({
  output: 'static',
  integrations: [mdx(), UnoCSS(), alpinejs({ entrypoint: '/src/alpine/index' }), heerich()],
  devToolbar: {
    enabled: false,
  },
  vite: {
    // Pre-bundle the heavy libraries that are loaded via dynamic import()
    // (WebGL hero, lazy charts, motion). Without this, adding new deps triggers
    // a mid-session Vite dep re-optimization that ABORTS in-flight dynamic
    // imports → "Failed to fetch dynamically imported module" for three/chart.js.
    optimizeDeps: {
      include: ['three', 'chart.js', 'chart.js/auto', 'gsap'],
    },
  },
});