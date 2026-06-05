import type { CollectionEntry } from 'astro:content';

/**
 * operator-stats — derive the headline "Operator Stats" numbers strictly from
 * the content graph. No invented figures (honors .trae recruiter-first rule):
 * a stat whose backing collection is empty returns `value: null` → rendered N/A.
 */

export type OperatorStat = {
  id: string;
  label: string;
  /** numeric value, or null when there is no evidence to derive it */
  value: number | null;
  /** optional suffix, e.g. "+" or "yrs" */
  suffix?: string;
  /** Phosphor icon class for the card */
  icon: string;
  /** short human note on how the value is derived */
  derivedFrom: string;
};

export type ComputeOperatorStatsInput = {
  projects: CollectionEntry<'projects'>[];
  caseStudies: CollectionEntry<'caseStudies'>[];
  experience: CollectionEntry<'experience'>[];
  publishedBlog: CollectionEntry<'blog'>[];
  tools: CollectionEntry<'tools'>[];
  certifications: CollectionEntry<'certifications'>[];
  knowledgeResources: CollectionEntry<'knowledgeResources'>[];
};

const nullIfZero = (n: number): number | null => (n > 0 ? n : null);

/** Years of experience derived from the earliest experience startDate. */
const yearsOfExperience = (experience: CollectionEntry<'experience'>[]): number | null => {
  const years = experience
    .map((e) => {
      const raw = e.data.startDate;
      const year = Number(String(raw).slice(0, 4));
      return Number.isFinite(year) ? year : null;
    })
    .filter((y): y is number => y !== null);
  if (years.length === 0) return null;
  const earliest = Math.min(...years);
  const now = new Date().getFullYear();
  return Math.max(0, now - earliest);
};

export const computeOperatorStats = (input: ComputeOperatorStatsInput): OperatorStat[] => {
  const years = yearsOfExperience(input.experience);

  return [
    {
      id: 'experience',
      label: 'Years Experience',
      value: years,
      suffix: years !== null ? '+' : undefined,
      icon: 'i-solar-clock-circle-bold-duotone',
      derivedFrom: 'Earliest modeled experience entry',
    },
    {
      id: 'roles',
      label: 'Roles Delivered',
      value: nullIfZero(input.experience.length),
      icon: 'i-solar-case-minimalistic-bold-duotone',
      derivedFrom: 'experience collection',
    },
    {
      id: 'technologies',
      label: 'Technologies',
      value: nullIfZero(input.tools.length),
      suffix: input.tools.length > 0 ? '+' : undefined,
      icon: 'i-solar-layers-minimalistic-bold-duotone',
      derivedFrom: 'tools collection',
    },
    {
      id: 'projects',
      label: 'Projects',
      value: nullIfZero(input.projects.length),
      icon: 'i-solar-rocket-2-bold-duotone',
      derivedFrom: 'projects collection',
    },
    {
      id: 'case-studies',
      label: 'Case Studies',
      value: nullIfZero(input.caseStudies.length),
      icon: 'i-solar-documents-bold-duotone',
      derivedFrom: 'caseStudies collection',
    },
    {
      id: 'certifications',
      label: 'Certifications',
      value: nullIfZero(input.certifications.length),
      icon: 'i-solar-diploma-verified-bold-duotone',
      derivedFrom: 'certifications collection',
    },
    {
      id: 'tutorials',
      label: 'Tutorials',
      value: nullIfZero(input.publishedBlog.length),
      icon: 'i-solar-notebook-bold-duotone',
      derivedFrom: 'published blog entries',
    },
    {
      id: 'knowledge',
      label: 'Knowledge Refs',
      value: nullIfZero(input.knowledgeResources.length),
      icon: 'i-solar-book-bookmark-bold-duotone',
      derivedFrom: 'knowledgeResources collection',
    },
  ];
};
