import type { IconDefinition, IconId } from './icon-types';

/*
Production icon assets are expected to be sourced locally under the approved license/workflow.
This starter registry uses original simplified SVG geometry only (no proprietary paid icon files).
*/

export const iconRegistry = {
  'command-center': {
    id: 'command-center',
    label: 'Command center',
    category: 'interface',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<rect x="3" y="4" width="18" height="16" rx="3" opacity="0.5" />`,
      primary: `<rect x="3" y="4" width="18" height="16" rx="3" />
<path d="M3 9h18" />
<path d="M7 7h.01" />
<path d="M10 7h.01" />
<path d="M13 7h.01" />
<path d="M7 13h4" />
<path d="M7 16h10" />`,
    },
    defaultAccessibility: 'semantic',
  },
  'cloud-node': {
    id: 'cloud-node',
    label: 'Cloud node',
    category: 'cloud',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<path d="M8.2 18.5h9.2a3.6 3.6 0 0 0 .7-7.1A5.3 5.3 0 0 0 7.1 9.9a3.8 3.8 0 0 0 1.1 8.6Z" opacity="0.55" />`,
      primary: `<path d="M8 18.5h9.4a3.6 3.6 0 0 0 .7-7.1A5.3 5.3 0 0 0 7.1 9.9a3.8 3.8 0 0 0 .9 8.6Z" />
<circle cx="12" cy="14.5" r="1.3" />
<path d="M12 12.6V11" />
<path d="M12 16.4V18" />`,
    },
    defaultAccessibility: 'semantic',
  },
  'shield-check': {
    id: 'shield-check',
    label: 'Shield check',
    category: 'security',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<path d="M12 3l7 3v6c0 5.2-3 8.6-7 9.9C8 20.6 5 17.2 5 12V6l7-3Z" opacity="0.45" />`,
      primary: `<path d="M12 3l7 3v6c0 5.2-3 8.6-7 9.9C8 20.6 5 17.2 5 12V6l7-3Z" />
<path d="M8.4 12.3l2.1 2.2 5.1-5.2" />`,
    },
    defaultAccessibility: 'semantic',
  },
  'code-window': {
    id: 'code-window',
    label: 'Code window',
    category: 'dev',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<rect x="3" y="4" width="18" height="16" rx="3" opacity="0.5" />`,
      primary: `<rect x="3" y="4" width="18" height="16" rx="3" />
<path d="M3 9h18" />
<path d="M9.5 12.5L7 15l2.5 2.5" />
<path d="M14.5 12.5L17 15l-2.5 2.5" />
<path d="M12.2 12l-0.9 6" />`,
    },
    defaultAccessibility: 'semantic',
  },
  'graph-link': {
    id: 'graph-link',
    label: 'Graph link',
    category: 'data',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<circle cx="6.5" cy="16.5" r="3" opacity="0.45" />
<circle cx="12" cy="6.5" r="3" opacity="0.45" />
<circle cx="17.5" cy="16.5" r="3" opacity="0.45" />`,
      primary: `<circle cx="6.5" cy="16.5" r="3" />
<circle cx="12" cy="6.5" r="3" />
<circle cx="17.5" cy="16.5" r="3" />
<path d="M8.7 14.6l1.8-2.6" />
<path d="M13.5 9.1l1.8 5.6" />
<path d="M9.6 16.5h4.8" />`,
    },
    defaultAccessibility: 'semantic',
  },
  terminal: {
    id: 'terminal',
    label: 'Terminal',
    category: 'dev',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<rect x="3" y="5" width="18" height="14" rx="3" opacity="0.5" />`,
      primary: `<rect x="3" y="5" width="18" height="14" rx="3" />
<path d="M7 10l2.5 2.5L7 15" />
<path d="M11.5 15h5.5" />`,
    },
    defaultAccessibility: 'semantic',
  },
  'external-link': {
    id: 'external-link',
    label: 'External link',
    category: 'navigation',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<rect x="4" y="8" width="12" height="12" rx="3" opacity="0.5" />`,
      primary: `<path d="M14 4h6v6" />
<path d="M20 4l-8 8" />
<rect x="4" y="8" width="12" height="12" rx="3" />`,
    },
    defaultAccessibility: 'semantic',
  },
  document: {
    id: 'document',
    label: 'Document',
    category: 'docs',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<path d="M7 3h7l3 3v15H7V3Z" opacity="0.45" />`,
      primary: `<path d="M7 3h7l3 3v15H7V3Z" />
<path d="M14 3v3h3" />
<path d="M9 11h6" />
<path d="M9 14h6" />
<path d="M9 17h4" />`,
    },
    defaultAccessibility: 'semantic',
  },
  'chart-radar': {
    id: 'chart-radar',
    label: 'Radar chart',
    category: 'data',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<circle cx="12" cy="12" r="8" opacity="0.25" />
<path d="M12 4v16" opacity="0.35" />
<path d="M4 12h16" opacity="0.35" />`,
      primary: `<circle cx="12" cy="12" r="8" />
<path d="M12 4v16" />
<path d="M4 12h16" />
<path d="M12 12l4-2" />
<path d="M12 12l-3 5" />
<path d="M12 12l-4-1" />`,
    },
    defaultAccessibility: 'semantic',
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    category: 'system',
    viewBox: '0 0 24 24',
    variant: 'duotone',
    layers: {
      secondary: `<circle cx="12" cy="12" r="7" opacity="0.25" />`,
      primary: `<circle cx="12" cy="12" r="3" />
<path d="M12 3v3" />
<path d="M12 18v3" />
<path d="M3 12h3" />
<path d="M18 12h3" />
<path d="M5.4 5.4l2.1 2.1" />
<path d="M16.5 16.5l2.1 2.1" />
<path d="M18.6 5.4l-2.1 2.1" />
<path d="M7.5 16.5l-2.1 2.1" />`,
    },
    defaultAccessibility: 'semantic',
  },
} satisfies Record<string, IconDefinition>;

export type KnownIconId = keyof typeof iconRegistry;

export const FALLBACK_ICON_ID: KnownIconId = 'settings';

export const getIconDefinition = (iconId: IconId) => {
  const known = iconRegistry[iconId as KnownIconId];
  return known ?? iconRegistry[FALLBACK_ICON_ID];
};

export const listIconDefinitions = () => Object.values(iconRegistry);

