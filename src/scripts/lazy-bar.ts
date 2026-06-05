/**
 * Lazy + JIT bar-chart hydration (reusable for any data section).
 *
 * Mirrors lazy-radar: an IntersectionObserver waits until the element is
 * visible (works when an Alpine `x-show` section is revealed), THEN dynamically
 * imports Chart.js, builds a bar chart, and destroys it on teardown.
 */
import { createChart, createChartCleanup } from '../design-system/charts/chart-lifecycle';
import { createChartDatasetDefaults, getChartTheme } from '../design-system/charts/chart-theme';
import { prefersReducedMotion } from '../design-system/motion/reduced-motion';

const buildOne = async (root: HTMLElement) => {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-lazy-bar-canvas]');
  if (!canvas) return null;

  let labels: string[] = [];
  let values: number[] = [];
  try {
    labels = JSON.parse(root.dataset['labels'] ?? '[]');
    values = JSON.parse(root.dataset['values'] ?? '[]');
  } catch {
    return null;
  }
  if (labels.length === 0) return null;

  const horizontal = root.dataset['horizontal'] === 'true';
  const maxVal = root.dataset['max'] ? Number(root.dataset['max']) : undefined;
  const theme = getChartTheme(document.documentElement);
  const datasetDefaults = createChartDatasetDefaults(document.documentElement);
  const reduced = prefersReducedMotion();

  const built = await createChart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: root.dataset['series'] ?? 'Value',
          data: values,
          backgroundColor: theme.series.map((c) => c) ?? theme.series[0],
          borderColor: theme.series[0],
          borderRadius: 6,
          ...datasetDefaults,
          borderWidth: 0,
        },
      ],
    },
    options: {
      indexAxis: horizontal ? 'y' : 'x',
      responsive: true,
      maintainAspectRatio: false,
      animation: reduced ? false : { duration: 700 },
      plugins: { legend: { display: false } },
      scales: {
        x: {
          beginAtZero: true,
          max: horizontal ? maxVal : undefined,
          grid: { color: theme.grid },
          ticks: { color: theme.axis, font: { family: 'var(--ds-font-mono)', size: 9 }, precision: 0 },
        },
        y: {
          beginAtZero: true,
          max: horizontal ? undefined : maxVal,
          grid: { color: theme.grid },
          ticks: { color: theme.axis, font: { family: 'var(--ds-font-mono)', size: 10 }, precision: 0 },
        },
      },
    },
  });

  return built;
};

let bound = false;
export async function initLazyBars(): Promise<void> {
  if (typeof window === 'undefined' || bound) return;
  bound = true;

  document.querySelectorAll<HTMLElement>('[data-lazy-bar]').forEach((root) => {
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
