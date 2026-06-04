export type SocialKind = 'github' | 'linkedin';

export type SocialLink = {
  kind: SocialKind;
  label: string;
  href: string;
};

export const site: {
  name: string;
  role: string;
  profile: { initials: string; photoPath: string };
  social: SocialLink[];
} = {
  name: 'Guillermo Lam Martín',
  role: 'Senior DevSecOps · Cloud & Platform Engineer',
  profile: {
    initials: 'GL',
    photoPath: '/images/profile/guillermo-portrait.png',
  },
  social: [
    { kind: 'github', label: 'GitHub', href: 'https://github.com/guillermolam' },
    {
      kind: 'linkedin',
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/in/guillermo-lam-28901047',
    },
  ],
};

export function titleFor(pageTitle: string): string {
  return `${pageTitle} · ${site.name}`;
}
