import type { CollectionEntry } from 'astro:content';
import { withBase } from '../base-url';

export type ExperienceBucketId = 'dev' | 'sec' | 'ops' | 'ai';

export type ExperienceStat = {
  label: string;
  value: string;
  icon: string;
  note?: string;
  pending?: boolean;
};

export type ExperienceLinkItem = {
  title: string;
  href: string;
  kind: 'project' | 'case-study' | 'proof-link';
  description?: string;
};

export type ExperienceLogo = {
  src?: string;
  alt: string;
  hasVectorAsset: boolean;
};

export type ExperienceBucketItem = {
  label: string;
  kind: 'tool' | 'category';
};

export type ExperienceBucketGroup = {
  id: ExperienceBucketId;
  label: string;
  icon: string;
  variant:
    | 'accent'
    | 'security'
    | 'cloud'
    | 'infra'
    | 'automation'
    | 'compliance'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'neutral';
  items: ExperienceBucketItem[];
};

export type ExperienceChartSeries = {
  label: string;
  data: number[];
};

export type ExperienceCardViewModel = {
  id: string;
  anchorId: string;
  companyName: string;
  clientName?: string;
  roleTitle: string;
  summary: string;
  location?: string;
  startDate: string;
  endDate?: string;
  dateRangeLabel: string;
  isCurrent: boolean;
  totalTimeLabel: string;
  totalMonths: number;
  ageAtStartLabel?: string;
  stats: ExperienceStat[];
  achievements: string[];
  responsibilities: string[];
  skills: string[];
  projects: ExperienceLinkItem[];
  logo: ExperienceLogo;
  importanceScore: number;
  importanceTier: 'standard' | 'priority' | 'flagship';
  buckets: ExperienceBucketGroup[];
  bucketChart: {
    labels: string[];
    datasets: ExperienceChartSeries[];
  };
};

const LOGO_ASSETS: Record<string, ExperienceLogo> = {
  skyguide: {
    src: withBase('/images/company-logos/skyguide.svg'),
    alt: 'Skyguide logo',
    hasVectorAsset: true,
  },
  ciklum: {
    src: withBase('/images/company-logos/ciklum.svg'),
    alt: 'Ciklum logo',
    hasVectorAsset: true,
  },
};

const CATEGORY_BUCKETS: Record<string, ExperienceBucketId> = {
  'ai-security': 'ai',
  'cloud-security': 'sec',
  'creative-frontend': 'dev',
  devsecops: 'sec',
  'gitops-delivery': 'ops',
  'hybrid-edge': 'ops',
  'kubernetes-platform': 'ops',
  'kubernetes-security': 'sec',
  'platform-engineering': 'ops',
  'runtime-security': 'sec',
  secops: 'sec',
  'supply-chain-security': 'sec',
  'supply-chain': 'ops',
};

const TOOL_BUCKETS: Record<string, ExperienceBucketId> = {
  argocd: 'ops',
  astro: 'dev',
  aws: 'ops',
  azure: 'ops',
  cilium: 'sec',
  cosign: 'sec',
  falco: 'sec',
  fermyon: 'ops',
  gcp: 'ops',
  grafana: 'ops',
  'github-actions': 'dev',
  grype: 'sec',
  helm: 'ops',
  istio: 'ops',
  jenkins: 'dev',
  kubernetes: 'ops',
  nanostores: 'dev',
  opentelemetry: 'ops',
  opa: 'sec',
  prometheus: 'ops',
  pulumi: 'ops',
  snyk: 'sec',
  sonarqube: 'sec',
  spin: 'ops',
  syft: 'sec',
  terraform: 'ops',
  threejs: 'dev',
  trivy: 'sec',
  typescript: 'dev',
};

const BUCKET_META: Record<
  ExperienceBucketId,
  Pick<ExperienceBucketGroup, 'label' | 'icon' | 'variant'>
> = {
  dev: {
    label: 'Dev',
    icon: 'code-window',
    variant: 'accent',
  },
  sec: {
    label: 'Sec',
    icon: 'shield-check',
    variant: 'security',
  },
  ops: {
    label: 'Ops',
    icon: 'cloud-node',
    variant: 'cloud',
  },
  ai: {
    label: 'AI',
    icon: 'chart-radar',
    variant: 'info',
  },
};

const formatDateLabel = (value?: string) => {
  if (!value) return undefined;
  const [yearRaw, monthRaw] = value.split('-');
  const year = Number.parseInt(yearRaw ?? '', 10);
  const month = Number.parseInt(monthRaw ?? '1', 10);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return value;
  return new Intl.DateTimeFormat('en', {
    month: 'short',
    year: 'numeric',
  }).format(new Date(Date.UTC(year, month - 1, 1)));
};

const getMonthIndex = (value: string) => {
  const [yearRaw, monthRaw] = value.split('-');
  const year = Number.parseInt(yearRaw ?? '', 10);
  const month = Number.parseInt(monthRaw ?? '1', 10);
  return year * 12 + (month - 1);
};

const getDurationMonths = (
  startDate: string,
  endDate?: string,
  isCurrent?: boolean,
) => {
  const startMonthIndex = getMonthIndex(startDate);
  const now = new Date();
  const endMonthIndex = isCurrent
    ? now.getUTCFullYear() * 12 + now.getUTCMonth()
    : endDate
      ? getMonthIndex(endDate)
      : startMonthIndex;
  return Math.max(1, endMonthIndex - startMonthIndex + 1);
};

const formatDuration = (
  startDate: string,
  endDate?: string,
  isCurrent?: boolean,
) => {
  const months = getDurationMonths(startDate, endDate, isCurrent);
  const years = Math.floor(months / 12);
  const remainder = months % 12;

  if (years > 0 && remainder > 0) return `${years}y ${remainder}m`;
  if (years > 0) return `${years}y`;
  return `${months}m`;
};

const normalizeHref = (
  kind: ExperienceLinkItem['kind'],
  id: string,
  lang: string,
) => {
  if (kind === 'project') return `/${lang}/portfolio/${id}`;
  if (kind === 'case-study') return `/${lang}/case-studies/${id}`;
  return id;
};

const normalizeCompanyKey = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-');

const getLogoAsset = (companyName: string): ExperienceLogo => {
  const key = normalizeCompanyKey(companyName);
  return (
    LOGO_ASSETS[key] ?? {
      alt: `${companyName} logo`,
      hasVectorAsset: false,
    }
  );
};

const getImportanceTier = (
  totalMonths: number,
  isCurrent: boolean,
): ExperienceCardViewModel['importanceTier'] => {
  if (isCurrent || totalMonths >= 16) return 'flagship';
  if (totalMonths >= 8) return 'priority';
  return 'standard';
};

const getImportanceScore = (totalMonths: number, isCurrent: boolean) => {
  const base = Math.min(5, Math.max(2, Math.round(totalMonths / 6) + 1));
  return Math.min(6, isCurrent ? base + 1 : base);
};

const calculateAgeAtStart = (startDate: string, birthYear?: number) => {
  if (!birthYear) return undefined;
  const [yearRaw, monthRaw] = startDate.split('-');
  const year = Number.parseInt(yearRaw ?? '', 10);
  const month = Number.parseInt(monthRaw ?? '1', 10);
  if (!Number.isFinite(year) || !Number.isFinite(month)) return undefined;
  const age = year - birthYear - (month < 7 ? 1 : 0);
  return age > 0 ? `${age}` : undefined;
};

const inferBucketFromCategory = (
  id: string,
  dimension?: string,
): ExperienceBucketId | undefined => {
  if (CATEGORY_BUCKETS[id]) return CATEGORY_BUCKETS[id];
  if (dimension === 'development') return 'dev';
  if (dimension?.startsWith('security')) return 'sec';
  if (dimension === 'operations' || dimension === 'controlRoomStation') {
    return 'ops';
  }
  if (dimension === 'aiDomain') return 'ai';
  return undefined;
};

const inferBucketFromTool = (
  id: string,
  tool: CollectionEntry<'tools'> | undefined,
  categoriesById: Map<string, CollectionEntry<'categories'>>,
): ExperienceBucketId | undefined => {
  if (TOOL_BUCKETS[id]) return TOOL_BUCKETS[id];
  for (const categoryId of tool?.data.categoryIds ?? []) {
    const category = categoriesById.get(categoryId);
    const bucket = inferBucketFromCategory(
      categoryId,
      category?.data.dimension,
    );
    if (bucket) return bucket;
  }
  return undefined;
};

export const buildExperienceCardModel = (
  entry: CollectionEntry<'experience'>,
  options: {
    lang: string;
    birthYear?: number;
    toolsById: Map<string, CollectionEntry<'tools'>>;
    categoriesById: Map<string, CollectionEntry<'categories'>>;
    relatedProjectsById: Map<string, CollectionEntry<'projects'>>;
    relatedCaseStudiesById: Map<string, CollectionEntry<'caseStudies'>>;
  },
): ExperienceCardViewModel => {
  const projectLinks: ExperienceLinkItem[] =
    entry.data.links
      ?.filter(
        (link) =>
          (link.targetCollection === 'projects' ||
            link.targetCollection === 'caseStudies') &&
          typeof link.targetId === 'string',
      )
      .map((link) => {
        if (link.targetCollection === 'projects') {
          const project = options.relatedProjectsById.get(link.targetId);
          return project
            ? {
                title: project.data.title,
                href: normalizeHref(
                  'project',
                  project.data.projectId,
                  options.lang,
                ),
                kind: 'project' as const,
                description: project.data.summary,
              }
            : null;
        }

        const caseStudy = options.relatedCaseStudiesById.get(link.targetId);
        return caseStudy
          ? {
              title: caseStudy.data.title,
              href: normalizeHref(
                'case-study',
                caseStudy.data.slug,
                options.lang,
              ),
              kind: 'case-study' as const,
              description: caseStudy.data.excerpt,
            }
          : null;
      })
      .filter((value): value is NonNullable<typeof value> => value !== null) ??
    [];

  const bucketMap = new Map<ExperienceBucketId, ExperienceBucketItem[]>(
    Object.keys(BUCKET_META).map((bucketId) => [
      bucketId as ExperienceBucketId,
      [],
    ]),
  );

  const categoryItems = (entry.data.categoryIds ?? []).map((id) => {
    const category = options.categoriesById.get(id);
    const label = category?.data.title ?? id;
    const bucket = inferBucketFromCategory(id, category?.data.dimension);
    return { id, label, bucket };
  });

  const toolItems = (entry.data.toolIds ?? []).map((id) => {
    const tool = options.toolsById.get(id);
    const label = tool?.data.name ?? id;
    const bucket = inferBucketFromTool(id, tool, options.categoriesById);
    return { id, label, bucket };
  });

  for (const item of categoryItems) {
    if (!item.bucket) continue;
    bucketMap.get(item.bucket)?.push({ label: item.label, kind: 'category' });
  }

  for (const item of toolItems) {
    if (!item.bucket) continue;
    bucketMap.get(item.bucket)?.push({ label: item.label, kind: 'tool' });
  }

  const buckets = (
    Object.entries(BUCKET_META) as [
      ExperienceBucketId,
      (typeof BUCKET_META)[ExperienceBucketId],
    ][]
  ).map(([id, meta]) => {
    const deduped = [
      ...new Map(
        (bucketMap.get(id) ?? []).map((item) => [item.label, item]),
      ).values(),
    ];
    return {
      id,
      ...meta,
      items: deduped,
    };
  });

  const skills = buckets.flatMap((bucket) =>
    bucket.items.map((item) => item.label),
  );
  const totalMonths = getDurationMonths(
    entry.data.startDate,
    entry.data.endDate,
    entry.data.isCurrent,
  );
  const totalTimeLabel = formatDuration(
    entry.data.startDate,
    entry.data.endDate,
    entry.data.isCurrent,
  );
  const importanceTier = getImportanceTier(
    totalMonths,
    Boolean(entry.data.isCurrent),
  );
  const importanceScore = getImportanceScore(
    totalMonths,
    Boolean(entry.data.isCurrent),
  );
  const ageAtStart = calculateAgeAtStart(
    entry.data.startDate,
    options.birthYear,
  );

  const stats: ExperienceStat[] = [
    {
      label: 'Total time',
      value: totalTimeLabel,
      icon: 'graph-link',
    },
    {
      label: 'Technologies',
      value: String(skills.length),
      icon: 'code-window',
      note:
        skills.length > 0 ? skills.join(' · ') : 'No technologies modeled yet',
    },
    {
      label: 'Team size',
      value: 'Not modeled',
      icon: 'command-center',
      pending: true,
    },
    {
      label: 'Managed',
      value: 'Not modeled',
      icon: 'shield-check',
      pending: true,
    },
  ];

  return {
    id: entry.data.experienceId,
    anchorId: `experience-${entry.data.experienceId}`,
    companyName: entry.data.companyName,
    clientName: entry.data.clientName,
    roleTitle: entry.data.roleTitle,
    summary: entry.data.summary,
    location: entry.data.location,
    startDate: formatDateLabel(entry.data.startDate) ?? entry.data.startDate,
    endDate: entry.data.isCurrent
      ? undefined
      : (formatDateLabel(entry.data.endDate) ?? entry.data.endDate),
    dateRangeLabel: `${formatDateLabel(entry.data.startDate) ?? entry.data.startDate} - ${entry.data.isCurrent ? 'Present' : (formatDateLabel(entry.data.endDate) ?? entry.data.endDate ?? 'Present')}`,
    isCurrent: Boolean(entry.data.isCurrent),
    totalTimeLabel,
    totalMonths,
    ageAtStartLabel: ageAtStart ? `${ageAtStart} years old` : undefined,
    stats,
    achievements: entry.data.highlights ?? [],
    responsibilities: entry.data.highlights ?? [],
    skills,
    projects: projectLinks,
    logo: getLogoAsset(entry.data.companyName),
    importanceScore,
    importanceTier,
    buckets,
    bucketChart: {
      labels: buckets.map((bucket) => bucket.label),
      datasets: [
        {
          label: 'Signals',
          data: buckets.map((bucket) => bucket.items.length),
        },
      ],
    },
  };
};
