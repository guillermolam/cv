import type { CollectionEntry } from 'astro:content';

export type WhoamiAxisId =
  | 'cloud'
  | 'security'
  | 'devsecops'
  | 'kubernetes'
  | 'architecture'
  | 'leadership'
  | 'automation'
  | 'ai';

export type WhoamiConfidence = 'low' | 'medium' | 'high';

export type WhoamiAxisResult = {
  id: WhoamiAxisId;
  label: string;
  score: number | null;
  confidence: WhoamiConfidence;
  evidenceCount: number;
  evidenceByType: {
    projects: number;
    caseStudies: number;
    experience: number;
    blog: number;
    skills: number;
    tools: number;
    certifications: number;
  };
  needsConfirmationCount: number;
  evidenceSummary: string;
  evidenceSources: string[];
};

type AxisRefs = {
  categoryIds?: string[];
  tagIds?: string[];
  toolIds?: string[];
  skillIds?: string[];
};

type TaxonomyCarrier = {
  categoryIds?: string[] | undefined;
  tagIds?: string[] | undefined;
  toolIds?: string[] | undefined;
  skillIds?: string[] | undefined;
};

const intersect = (a: string[] | undefined, b: string[] | undefined) => {
  if (!a?.length || !b?.length) return false;
  const bSet = new Set(b);
  return a.some((v) => bSet.has(v));
};

const matchesAxis = (carrier: TaxonomyCarrier, refs: AxisRefs) =>
  intersect(carrier.categoryIds, refs.categoryIds) ||
  intersect(carrier.tagIds, refs.tagIds) ||
  intersect(carrier.toolIds, refs.toolIds) ||
  intersect(carrier.skillIds, refs.skillIds);

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const scoreFromEvidenceCount = (evidenceCount: number) => {
  const score = Math.round(20 * Math.log2(1 + evidenceCount));
  return clamp(score, 0, 100);
};

const confidenceFromEvidence = (evidenceCount: number, needsConfirmationCount: number): WhoamiConfidence => {
  if (evidenceCount >= 6 && needsConfirmationCount === 0) return 'high';
  if (evidenceCount >= 3) return 'medium';
  return 'low';
};

const summarizeEvidence = (counts: {
  projects: number;
  caseStudies: number;
  experience: number;
  blog: number;
  skills: number;
  tools: number;
  certifications: number;
}) => {
  const parts: string[] = [];
  if (counts.projects) parts.push(`${counts.projects} project${counts.projects === 1 ? '' : 's'}`);
  if (counts.caseStudies) parts.push(`${counts.caseStudies} case stud${counts.caseStudies === 1 ? 'y' : 'ies'}`);
  if (counts.experience) parts.push(`${counts.experience} role${counts.experience === 1 ? '' : 's'}`);
  if (counts.blog) parts.push(`${counts.blog} tutorial${counts.blog === 1 ? '' : 's'}`);
  const proof = parts.length === 0 ? 'No evidence yet' : parts.join(' · ');

  const supportParts: string[] = [];
  if (counts.skills) supportParts.push(`${counts.skills} skill${counts.skills === 1 ? '' : 's'}`);
  if (counts.tools) supportParts.push(`${counts.tools} tool${counts.tools === 1 ? '' : 's'}`);
  if (counts.certifications)
    supportParts.push(`${counts.certifications} certification${counts.certifications === 1 ? '' : 's'}`);

  if (supportParts.length === 0) return proof;
  return `${proof} · +${supportParts.join(' · +')}`;
};

export const WHOAMI_AXES: Array<{ id: WhoamiAxisId; label: string; refs: AxisRefs; sources: string[] }> = [
  {
    id: 'cloud',
    label: 'Cloud',
    refs: { categoryIds: ['cloud-security', 'hybrid-edge'], toolIds: ['aws', 'azure', 'gcp'] },
    sources: ['categories:cloud-security', 'categories:hybrid-edge', 'tools:aws|azure|gcp'],
  },
  {
    id: 'security',
    label: 'Security',
    refs: {
      categoryIds: [
        'cloud-security',
        'runtime-security',
        'kubernetes-security',
        'supply-chain-security',
        'secops',
        'ai-security',
      ],
      tagIds: ['threat-detection'],
    },
    sources: [
      'categories:cloud-security|runtime-security|kubernetes-security|supply-chain-security|secops|ai-security',
      'tags:threat-detection',
    ],
  },
  {
    id: 'devsecops',
    label: 'DevSecOps',
    refs: { categoryIds: ['devsecops', 'gitops-delivery'], tagIds: ['ci-cd', 'sbom'] },
    sources: ['categories:devsecops|gitops-delivery', 'tags:ci-cd|sbom'],
  },
  {
    id: 'kubernetes',
    label: 'Kubernetes',
    refs: { categoryIds: ['kubernetes-platform', 'kubernetes-security'], tagIds: ['kubernetes'], toolIds: ['kubernetes'] },
    sources: ['categories:kubernetes-platform|kubernetes-security', 'tags:kubernetes', 'tools:kubernetes'],
  },
  {
    id: 'architecture',
    label: 'Architecture',
    refs: { categoryIds: ['platform-engineering'], tagIds: ['wasm'] },
    sources: ['categories:platform-engineering', 'tags:wasm'],
  },
  {
    id: 'leadership',
    label: 'Leadership',
    refs: { tagIds: [] },
    sources: ['No leadership taxonomy modeled yet'],
  },
  {
    id: 'automation',
    label: 'Automation',
    refs: { tagIds: ['ci-cd'], toolIds: ['github-actions', 'terraform'] },
    sources: ['tags:ci-cd', 'tools:github-actions|terraform'],
  },
  {
    id: 'ai',
    label: 'AI',
    refs: { categoryIds: ['ai-security'], tagIds: ['ai'] },
    sources: ['categories:ai-security', 'tags:ai (if modeled)'],
  },
];

export type ComputeWhoamiStatsInput = {
  projects: CollectionEntry<'projects'>[];
  caseStudies: CollectionEntry<'caseStudies'>[];
  experience: CollectionEntry<'experience'>[];
  publishedBlog: CollectionEntry<'blog'>[];
  skills: CollectionEntry<'skills'>[];
  tools: CollectionEntry<'tools'>[];
  certifications: CollectionEntry<'certifications'>[];
};

const countNeedsConfirmation = (data: unknown) => {
  if (!data || typeof data !== 'object') return 0;
  const value = (data as { needsConfirmation?: unknown }).needsConfirmation;
  if (!Array.isArray(value)) return 0;
  return value.filter((v) => typeof v === 'string' && v.trim().length > 0).length;
};

export const computeWhoamiStats = (input: ComputeWhoamiStatsInput): WhoamiAxisResult[] => {
  return WHOAMI_AXES.map((axis) => {
    const projectsMatched = input.projects.filter((e) => matchesAxis(e.data, axis.refs));
    const caseStudiesMatched = input.caseStudies.filter((e) => matchesAxis(e.data, axis.refs));
    const experienceMatched = input.experience.filter((e) => matchesAxis(e.data, axis.refs));
    const blogMatched = input.publishedBlog.filter((e) => matchesAxis(e.data, axis.refs));
    const skillsMatched = input.skills.filter((e) => matchesAxis(e.data, axis.refs));
    const toolsMatched = input.tools.filter((e) => matchesAxis(e.data, axis.refs));
    const certificationsMatched = input.certifications.filter((e) => matchesAxis(e.data, axis.refs));

    const projectMatches = projectsMatched.map((e) => e.data.projectId);
    const caseStudyMatches = caseStudiesMatched.map((e) => e.data.caseStudyId);
    const experienceMatches = experienceMatched.map((e) => e.data.experienceId);
    const blogMatches = blogMatched.map((e) => e.data.blogSlug);
    const skillMatches = skillsMatched.map((e) => e.data.skillId);
    const toolMatches = toolsMatched.map((e) => e.data.toolId);
    const certificationMatches = certificationsMatched.map((e) => e.data.certificationId);

    const counts = {
      projects: new Set(projectMatches).size,
      caseStudies: new Set(caseStudyMatches).size,
      experience: new Set(experienceMatches).size,
      blog: new Set(blogMatches).size,
      skills: new Set(skillMatches).size,
      tools: new Set(toolMatches).size,
      certifications: new Set(certificationMatches).size,
    };

    const evidenceCount = counts.projects + counts.caseStudies + counts.experience + counts.blog;
    const score = evidenceCount === 0 ? null : scoreFromEvidenceCount(evidenceCount);
    const needsConfirmationCount =
      projectsMatched.reduce((acc, e) => acc + countNeedsConfirmation(e.data), 0) +
      caseStudiesMatched.reduce((acc, e) => acc + countNeedsConfirmation(e.data), 0) +
      experienceMatched.reduce((acc, e) => acc + countNeedsConfirmation(e.data), 0) +
      blogMatched.reduce((acc, e) => acc + countNeedsConfirmation(e.data), 0) +
      certificationsMatched.reduce((acc, e) => acc + countNeedsConfirmation(e.data), 0);
    const confidence = confidenceFromEvidence(evidenceCount, needsConfirmationCount);

    return {
      id: axis.id,
      label: axis.label,
      score,
      confidence,
      evidenceCount,
      evidenceByType: counts,
      needsConfirmationCount,
      evidenceSummary: summarizeEvidence(counts),
      evidenceSources: axis.sources,
    };
  });
};
