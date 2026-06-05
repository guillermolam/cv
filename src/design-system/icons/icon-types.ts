export type IconId = string;

export type IconCategory =
  | 'interface'
  | 'cloud'
  | 'security'
  | 'dev'
  | 'data'
  | 'navigation'
  | 'docs'
  | 'system';

export type IconVariant = 'duotone';

export type IconTone =
  | 'neutral'
  | 'accent'
  | 'security'
  | 'cloud'
  | 'infra'
  | 'automation'
  | 'compliance';

export type IconDepth = 'flat' | 'raised' | 'elevated' | 'floating';

export type IconMotion = 'none' | 'hover-lift';

export type IconAccessibilityMode = 'decorative' | 'semantic';

export type IconLayers = {
  primary: string;
  secondary?: string;
};

export type IconDefinition = {
  id: IconId;
  label: string;
  category: IconCategory;
  viewBox: string;
  variant: IconVariant;
  layers: IconLayers;
  defaultAccessibility: IconAccessibilityMode;
};

