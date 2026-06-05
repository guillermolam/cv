type ChartInstance = import('chart.js').Chart;

/** Alpine.data('alpineRadar', ...) — Chart.js radar powered by Alpine */
type AlpineLike = {
  data: (name: string, callback: () => unknown) => void;
};

/** Alpine.data('alpineRadar', ...) — Chart.js radar powered by Alpine */
export function registerChartComponents(alpine: AlpineLike) {

  alpine.data('alpineRadar', () => ({
    chart: null as ChartInstance | null,

    async mount(this: any) {
      const el = this.$el as HTMLElement;
      const canvas = this.$refs['canvas'] as HTMLCanvasElement;
      if (!canvas) return;

      const raw = el.dataset;
      const labels: string[]  = JSON.parse(raw['labels']  ?? '[]');
      const scores: number[]  = JSON.parse(raw['scores']  ?? '[]');

      const [
        { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip },
      ] = await Promise.all([import('chart.js')]);

      Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Filler, Tooltip);

      const styles = getComputedStyle(document.documentElement);
      const accent  = styles.getPropertyValue('--color-cta').trim()       || '#4cc9f0';
      const gridCol = styles.getPropertyValue('--color-border').trim()     || 'rgba(214,226,239,0.12)';
      const textCol = styles.getPropertyValue('--color-text-muted').trim() || '#8fa3b8';
      const monoFont = styles.getPropertyValue('--font-mono').trim()       || 'JetBrains Mono, monospace';

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      this.chart?.destroy();
      this.chart = new Chart(canvas, {
        type: 'radar',
        data: {
          labels,
          datasets: [{
            data: scores,
            borderColor: accent,
            backgroundColor: `color-mix(in oklab, ${accent}, transparent 82%)`,
            borderWidth: 1.5,
            pointRadius: 3,
            pointHoverRadius: 5,
            pointBackgroundColor: accent,
          }],
        },
        options: {
          responsive: true,
          animation: prefersReduced ? false : { duration: 900, easing: 'easeOutQuart' },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: true,
              backgroundColor: 'var(--color-surface-2)',
              borderColor: 'var(--color-border)',
              borderWidth: 1,
              titleColor: 'var(--color-text-strong)',
              bodyColor: textCol,
              padding: 10,
              callbacks: { label: (ctx) => `  ${ctx.parsed.r} / 100` },
            },
          },
          scales: {
            r: {
              min: 0,
              max: 100,
              ticks: { display: false, stepSize: 25 },
              grid: { color: gridCol },
              angleLines: { color: gridCol },
              pointLabels: {
                color: textCol,
                font: { family: monoFont, size: 9 },
              },
            },
          },
        },
      });
    },

    destroy(this: any) {
      this.chart?.destroy();
      this.chart = null;
    },
  }));

  /** Alpine.data('alpineBarStat', ...) — single animated stat bar */
  alpine.data('alpineBarStat', () => ({
    visible: false,
    observe(this: any) {
      const io = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) { this.visible = true; io.disconnect(); } },
        { threshold: 0.3 },
      );
      io.observe(this.$el as HTMLElement);
    },
  }));
}
