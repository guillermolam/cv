import { createCleanupStack, listen } from '../motion/cleanup';
import { prefersReducedMotion } from '../motion/reduced-motion';

type AnyChart = {
  destroy: () => void;
  resize: () => void;
  update: () => void;
};

type ChartConfig = Record<string, unknown>;

export const createChartCleanup = () => createCleanupStack();

export const destroyChart = (chart: AnyChart | null | undefined) => {
  try {
    chart?.destroy();
  } catch {
    return;
  }
};

export const bindChartResize = (element: HTMLElement, callback: () => void) => {
  if (typeof ResizeObserver === 'undefined') return () => {};
  const observer = new ResizeObserver(() => callback());
  observer.observe(element);
  return () => observer.disconnect();
};

export const disableAnimationsForReducedMotion = (config: ChartConfig) => {
  const options = (config as any).options ?? {};
  (config as any).options = {
    ...options,
    animation: false,
    transitions: {
      active: { animation: { duration: 0 } },
      resize: { animation: { duration: 0 } },
      show: { animation: { duration: 0 } },
      hide: { animation: { duration: 0 } },
    },
  };
  return config;
};

export const createChart = async (
  canvas: HTMLCanvasElement,
  config: ChartConfig,
  options?: { root?: HTMLElement; enableResize?: boolean },
) => {
  if (typeof window === 'undefined') return null;

  const reduced = prefersReducedMotion();
  const finalConfig = reduced ? disableAnimationsForReducedMotion({ ...(config as any) }) : config;

  const mod = await import('chart.js/auto');
  const Chart = (mod as any).default ?? (mod as any);
  const chart: AnyChart = new Chart(canvas, finalConfig);

  const cleanup = createChartCleanup();
  cleanup.add(() => destroyChart(chart));

  if (options?.enableResize !== false) {
    const root = options?.root ?? canvas.parentElement ?? document.documentElement;
    cleanup.add(bindChartResize(root as HTMLElement, () => chart.resize()));
  }

  cleanup.add(listen(window, 'pagehide', () => cleanup.run(), { once: true }));
  cleanup.add(listen(window, 'beforeunload', () => cleanup.run(), { once: true }));
  cleanup.add(listen(document, 'astro:before-swap', () => cleanup.run()));

  return { chart, cleanup };
};

