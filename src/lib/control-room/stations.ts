export type StationId =
  | 'supply-chain'
  | 'gitops-delivery'
  | 'kubernetes-platform'
  | 'runtime-security'
  | 'security-operations'
  | 'hybrid-edge';

export type StationLink = {
  label: string;
  href: string;
};

export type Station = {
  id: StationId;
  label: string;
  signal: string;
  anchor: `#station-${StationId}`;
  topologyAnchor: `#topology-${StationId}`;
  portfolioHref: string;
  evidenceLinks: StationLink[];
};

export const STATIONS: Station[] = [
  {
    id: 'supply-chain',
    label: 'Supply Chain',
    signal: 'Signal placeholder.',
    anchor: '#station-supply-chain',
    topologyAnchor: '#topology-supply-chain',
    portfolioHref: '/portfolio/security',
    evidenceLinks: [
      { label: 'Portfolio: Security', href: '/portfolio/security' },
      { label: 'CV', href: '/cv' }
    ]
  },
  {
    id: 'gitops-delivery',
    label: 'GitOps & Delivery',
    signal: 'Signal placeholder.',
    anchor: '#station-gitops-delivery',
    topologyAnchor: '#topology-gitops-delivery',
    portfolioHref: '/portfolio/infra',
    evidenceLinks: [
      { label: 'Portfolio: Infrastructure', href: '/portfolio/infra' },
      { label: 'CV', href: '/cv' }
    ]
  },
  {
    id: 'kubernetes-platform',
    label: 'Kubernetes Platform',
    signal: 'Signal placeholder.',
    anchor: '#station-kubernetes-platform',
    topologyAnchor: '#topology-kubernetes-platform',
    portfolioHref: '/portfolio/infra',
    evidenceLinks: [
      { label: 'Portfolio: Infrastructure', href: '/portfolio/infra' },
      { label: 'CV', href: '/cv' }
    ]
  },
  {
    id: 'runtime-security',
    label: 'Runtime Security',
    signal: 'Signal placeholder.',
    anchor: '#station-runtime-security',
    topologyAnchor: '#topology-runtime-security',
    portfolioHref: '/portfolio/security',
    evidenceLinks: [
      { label: 'Portfolio: Security', href: '/portfolio/security' },
      { label: 'CV', href: '/cv' }
    ]
  },
  {
    id: 'security-operations',
    label: 'Security Operations',
    signal: 'Signal placeholder.',
    anchor: '#station-security-operations',
    topologyAnchor: '#topology-security-operations',
    portfolioHref: '/portfolio/security',
    evidenceLinks: [
      { label: 'Portfolio: Security', href: '/portfolio/security' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    id: 'hybrid-edge',
    label: 'Hybrid / Edge',
    signal: 'Signal placeholder.',
    anchor: '#station-hybrid-edge',
    topologyAnchor: '#topology-hybrid-edge',
    portfolioHref: '/portfolio/development',
    evidenceLinks: [
      { label: 'Portfolio: Development', href: '/portfolio/development' },
      { label: 'Blog', href: '/blog' }
    ]
  }
];
