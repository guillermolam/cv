export type CardTreeNode = {
  id: string;
  name?: string;
  title?: string;
  subtitle?: string;
  accentColor?: string;
  imageURL?: string;
  badge?: {
    text: string;
    color?: string;
  };
  options?: Partial<CardTreeOptions>;
  children?: CardTreeNode[];
  hiddenChildren?: CardTreeNode[];
  [key: string]: unknown;
};

export type CardTreeSelectionMode = false | 'single' | 'multi';

export type CardTreeOptions = {
  width: string | number;
  height: 'auto' | number;
  nodeWidth: number;
  nodeHeight: number;
  contentKey: string;
  direction: 'top' | 'bottom' | 'left' | 'right';
  enableAnimation: boolean;
  enableZoomPan: boolean;
  enableToolbar: boolean;
  enableSearch: boolean;
  enableBreadcrumb: boolean;
  enableTooltip: boolean;
  enableSelection: CardTreeSelectionMode;
  theme: 'light' | 'dark';
  containerClassName?: string;
  nodeBGColor?: string;
  nodeShadow?: string;
  nodeStyle?: string;
  borderWidth?: number;
  nodeTemplate?: (node: unknown) => string;
  onNodeClick?: (node: unknown) => void;
};

export const CARD_TREE_DEFAULTS: Partial<CardTreeOptions> = {
  width: '100%',
  height: 'auto',
  nodeWidth: 220,
  nodeHeight: 76,
  contentKey: 'name',
  direction: 'top',
  enableAnimation: true,
  enableZoomPan: true,
  enableToolbar: true,
  enableSearch: true,
  enableBreadcrumb: true,
  enableTooltip: false,
  enableSelection: false,
  theme: 'light',
};

export type CardTreeOptionsInput = Partial<CardTreeOptions>;

export type CardTreeStoreLike<T> = {
  get: () => T;
  subscribe: (listener: (value: T) => void) => () => void;
};
