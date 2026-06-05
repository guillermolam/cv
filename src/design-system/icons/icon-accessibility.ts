import type { IconAccessibilityMode, IconId } from './icon-types';

export type IconA11yInput = {
  iconId: IconId;
  mode: IconAccessibilityMode;
  label?: string;
  title?: string;
  description?: string;
  fallbackLabel: string;
  instanceId?: string;
};

export type IconA11yResult = {
  svgAttrs: Record<string, string>;
  titleId?: string;
  descId?: string;
  title?: string;
  description?: string;
  accessibleName?: string;
};

const safeToken = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, '-');

const deriveAccessibleName = (input: IconA11yInput) => {
  const label = input.label?.trim();
  if (label) return label;
  const title = input.title?.trim();
  if (title) return title;
  return input.fallbackLabel;
};

export const getIconA11y = (input: IconA11yInput): IconA11yResult => {
  if (input.mode === 'decorative') {
    return {
      svgAttrs: {
        'aria-hidden': 'true',
        role: 'presentation',
        focusable: 'false',
      },
    };
  }

  const accessibleName = deriveAccessibleName(input);
  const instanceId = input.instanceId?.trim() ? safeToken(input.instanceId) : undefined;

  const wantsTitleOrDesc = Boolean(input.title?.trim() || input.description?.trim());
  const canReferenceTitleOrDesc = wantsTitleOrDesc && Boolean(instanceId);

  const titleId = canReferenceTitleOrDesc ? `${safeToken(input.iconId)}-${instanceId}-title` : undefined;
  const descId = canReferenceTitleOrDesc ? `${safeToken(input.iconId)}-${instanceId}-desc` : undefined;

  const labelledBy = [titleId, input.description?.trim() ? descId : undefined].filter(Boolean).join(' ');

  return {
    svgAttrs: {
      role: 'img',
      ...(labelledBy ? { 'aria-labelledby': labelledBy } : { 'aria-label': accessibleName }),
      focusable: 'false',
    },
    titleId,
    descId: input.description?.trim() ? descId : undefined,
    title: input.title?.trim(),
    description: input.description?.trim(),
    accessibleName,
  };
};

