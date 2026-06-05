export type ChartA11yIds = {
  titleId: string;
  descriptionId: string;
  summaryId: string;
  tableId: string;
  canvasId: string;
};

export const createChartA11yIds = (baseId: string): ChartA11yIds => {
  const safe = baseId.length > 0 ? baseId : 'ui-chart';
  return {
    titleId: `${safe}-title`,
    descriptionId: `${safe}-description`,
    summaryId: `${safe}-summary`,
    tableId: `${safe}-table`,
    canvasId: `${safe}-canvas`,
  };
};

export const createCanvasA11yAttributes = (args: {
  title: string;
  description?: string;
  summaryId?: string;
  tableId?: string;
}): Record<string, string> => {
  const labelledBy = [args.summaryId].filter(Boolean).join(' ');
  const describedBy = [args.tableId].filter(Boolean).join(' ');

  return {
    role: 'img',
    'aria-label': args.title,
    ...(labelledBy ? { 'aria-labelledby': labelledBy } : {}),
    ...(describedBy ? { 'aria-describedby': describedBy } : {}),
  };
};

export type FallbackRow = {
  label: string;
  values: { datasetLabel: string; value: number }[];
};

export const createFallbackRows = (
  labels: readonly string[],
  datasets: readonly { label: string; data: readonly number[] }[],
): FallbackRow[] => {
  return labels.map((label, index) => ({
    label,
    values: datasets.map((ds) => ({ datasetLabel: ds.label, value: ds.data[index] ?? 0 })),
  }));
};

export const createChartSummary = (args: {
  title: string;
  description?: string;
  labels: readonly string[];
  datasets: readonly { label: string; data: readonly number[] }[];
}): string => {
  const series = args.datasets.map((d) => d.label).filter(Boolean);
  const seriesText = series.length > 0 ? `Series: ${series.join(', ')}.` : '';
  const domainText = args.labels.length > 0 ? `Categories: ${args.labels.length}.` : '';
  const prefix = args.description ? `${args.description} ` : '';
  return `${prefix}${domainText} ${seriesText}`.trim();
};
