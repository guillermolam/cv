/**
 * Lazy + JIT radar hydration.
 *
 * For each [data-lazy-radar], an IntersectionObserver waits until the element
 * scrolls into view, THEN dynamically imports Chart.js (deferred chunk) and
 * builds the radar. The instance is destroyed on pagehide / Astro swap to
 * release the canvas + GPU resources.
 */
import { createChart, createChartCleanup } from '../design-system/charts/chart-lifecycle';
import { createChartDatasetDefaults, getChartTheme } from '../design-system/charts/chart-theme';
import { prefersReducedMotion } from '../design-system/motion/reduced-motion';

const buildOne = async (root: HTMLElement) => {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-lazy-radar-canvas]');
  if (!canvas) return null;

  let labels: string[] = [];
  let scores: Array<number | null> = [];
  try {
    labels = JSON.parse(root.dataset['labels'] ?? '[]');
    scores = JSON.parse(root.dataset['scores'] ?? '[]');
  } catch {
    return null;
  }

  const theme = getChartTheme(document.documentElement);
  const datasetDefaults = createChartDatasetDefaults(document.documentElement);
  const reduced = prefersReducedMotion();

  const data = scores.map((v) => (typeof v === 'number' ? v : 0));

  const built = await createChart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [
        {
          label: 'Operator index',
          data,
          borderColor: theme.series[0],
          backgroundColor: 'rgba(100, 255, 212, 0.16)',
          ...datasetDefaults,
        },
      ],
    },
    options: {
      responsive: true,
      animation: reduced ? false : { duration: 700 },
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0,
          max: 100,
          ticks: { display: false, stepSize: 25 },
          grid: { color: theme.grid },
          angleLines: { color: theme.grid },
          pointLabels: {
            color: theme.axis,
            font: { family: 'var(--ds-font-mono)', size: 9 },
          },
        },
      },
    },
  });

  return built;
};

let bound = false;
export async function initLazyRadars(): Promise<void> {
  if (typeof window === 'undefined' || bound) return;
  bound = true;

  document.querySelectorAll<HTMLElement>('[data-lazy-radar]').forEach((root) => {
    const cleanup = createChartCleanup();
    let inited = false;

    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries.some((e) => e.isIntersecting) || inited) return;
        inited = true;
        io.disconnect();
        const built = await buildOne(root);
        if (!built) return;
        cleanup.add(() => built.cleanup.run());
      },
      { threshold: 0.15 },
    );
    io.observe(root);

    const dispose = () => {
      io.disconnect();
      cleanup.run();
    };
    window.addEventListener('pagehide', dispose, { once: true });
    document.addEventListener('astro:before-swap', dispose, { once: true });
  });
}
