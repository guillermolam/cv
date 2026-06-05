type ChartTheme = {
  grid: string;
  axis: string;
  legendText: string;
  tooltipBg: string;
  tooltipBorder: string;
  series: string[];
};

const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

const resolveColorVar = (root: HTMLElement, name: string, fallback: string) => {
  const probe = document.createElement('span');
  probe.style.color = `var(${name})`;
  probe.style.position = 'absolute';
  probe.style.left = '-9999px';
  root.appendChild(probe);
  const value = getComputedStyle(probe).color?.trim();
  probe.remove();
  return value && value.length > 0 ? value : fallback;
};

const resolveBackgroundVar = (root: HTMLElement, name: string, fallback: string) => {
  const probe = document.createElement('span');
  probe.style.backgroundColor = `var(${name})`;
  probe.style.position = 'absolute';
  probe.style.left = '-9999px';
  root.appendChild(probe);
  const value = getComputedStyle(probe).backgroundColor?.trim();
  probe.remove();
  return value && value.length > 0 ? value : fallback;
};

export const getChartTheme = (root?: HTMLElement): ChartTheme => {
  if (!isBrowser()) {
    return {
      grid: 'rgba(214, 226, 239, 0.12)',
      axis: 'rgba(214, 226, 239, 0.32)',
      legendText: 'rgba(214, 226, 239, 0.92)',
      tooltipBg: 'rgba(9, 14, 18, 0.92)',
      tooltipBorder: 'rgba(214, 226, 239, 0.22)',
      series: ['#64ffd4', '#7aa7ff', '#3ce87a', '#ffb55c'],
    };
  }

  const el = root ?? document.documentElement;
  return {
    grid: resolveColorVar(el, '--ds-chart-grid', 'rgba(214, 226, 239, 0.12)'),
    axis: resolveColorVar(el, '--ds-chart-axis', 'rgba(214, 226, 239, 0.32)'),
    legendText: resolveColorVar(el, '--ds-chart-legend-text', 'rgba(214, 226, 239, 0.92)'),
    tooltipBg: resolveBackgroundVar(el, '--ds-chart-tooltip-bg', 'rgba(9, 14, 18, 0.92)'),
    tooltipBorder: resolveColorVar(el, '--ds-chart-tooltip-border', 'rgba(214, 226, 239, 0.22)'),
    series: [
      resolveColorVar(el, '--ds-chart-series-1', '#64ffd4'),
      resolveColorVar(el, '--ds-chart-series-2', '#7aa7ff'),
      resolveColorVar(el, '--ds-chart-series-3', '#3ce87a'),
      resolveColorVar(el, '--ds-chart-series-4', '#ffb55c'),
    ],
  };
};

export const createChartDatasetDefaults = (root?: HTMLElement) => {
  const theme = getChartTheme(root);
  return {
    borderWidth: 2,
    pointRadius: 2.5,
    pointHoverRadius: 3.5,
    pointBorderWidth: 1,
    pointBackgroundColor: theme.series[0],
    pointBorderColor: theme.axis,
  } as const;
};

export const createChartScalesDefaults = (root?: HTMLElement) => {
  const theme = getChartTheme(root);
  return {
    color: theme.axis,
    grid: { color: theme.grid },
    ticks: {
      color: theme.axis,
      font: { family: 'var(--ds-font-mono)' },
    },
    border: { color: theme.axis },
  } as const;
};
