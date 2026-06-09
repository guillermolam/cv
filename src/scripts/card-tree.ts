import {
  CARD_TREE_DEFAULTS,
  type CardTreeNode,
  type CardTreeOptionsInput,
} from '../lib/card-tree';

type CardTreeInstance = {
  render: (data: CardTreeNode) => CardTreeGraph;
  destroy?: () => void;
};

type CardTreeGraph = {
  fitScreen?: () => void;
};

type CardTreeConstructor = new (
  el: HTMLElement,
  options?: CardTreeOptionsInput,
) => CardTreeInstance;

type ToolchainNodeKind = 'root' | 'category' | 'tool';

type ToolchainGraphNode = {
  nodeId: string;
  kind: ToolchainNodeKind;
  name: string;
  title?: string;
  bucket?: string;
  website?: string;
  logoUrl?: string;
  categoryLabels?: string[];
  tags?: string[];
  metrics?: {
    jobs: number;
    years: number;
    activeProjects: number;
  };
  jobs?: Array<Record<string, unknown>>;
  projects?: Array<Record<string, unknown>>;
  resources?: {
    direct: Array<Record<string, unknown>>;
    indirect: Array<Record<string, unknown>>;
  };
  strongParentIds: string[];
  strongChildIds: string[];
  weakRelationIds: string[];
  locked?: boolean;
  isLanguage?: boolean;
};

type ToolchainGraphState = {
  rootId: string;
  nodes: ToolchainGraphNode[];
};

const cloneToolchainGraphState = (
  state: ToolchainGraphState,
): ToolchainGraphState => ({
  rootId: state.rootId,
  nodes: state.nodes.map((node) => ({
    ...node,
    categoryLabels: [...(node.categoryLabels ?? [])],
    tags: [...(node.tags ?? [])],
    strongParentIds: [...node.strongParentIds],
    strongChildIds: [...node.strongChildIds],
    weakRelationIds: [...node.weakRelationIds],
    jobs: [...(node.jobs ?? [])],
    projects: [...(node.projects ?? [])],
    resources: node.resources
      ? {
          direct: [...node.resources.direct],
          indirect: [...node.resources.indirect],
        }
      : undefined,
  })),
});

const getToolchainNode = (
  state: ToolchainGraphState,
  nodeId: string,
): ToolchainGraphNode | null =>
  state.nodes.find((node) => node.nodeId === nodeId) ?? null;

const getToolchainChildren = (
  state: ToolchainGraphState,
  nodeId: string,
): ToolchainGraphNode[] =>
  state.nodes.filter((node) => node.strongParentIds[0] === nodeId);

const hasStrongPath = (
  state: ToolchainGraphState,
  sourceId: string,
  targetId: string,
  seen = new Set<string>(),
): boolean => {
  if (sourceId === targetId) return true;
  if (seen.has(sourceId)) return false;
  seen.add(sourceId);

  for (const child of getToolchainChildren(state, sourceId)) {
    if (hasStrongPath(state, child.nodeId, targetId, seen)) return true;
  }
  return false;
};

const wouldCreateStrongCycle = (
  state: ToolchainGraphState,
  parentId: string,
  childId: string,
): boolean => {
  if (parentId === childId) return true;
  return hasStrongPath(state, childId, parentId);
};

const syncStrongChildLists = (state: ToolchainGraphState) => {
  for (const node of state.nodes) {
    node.strongChildIds = [];
  }
  for (const node of state.nodes) {
    for (const parentId of node.strongParentIds) {
      const parent = getToolchainNode(state, parentId);
      if (!parent) continue;
      if (!parent.strongChildIds.includes(node.nodeId)) {
        parent.strongChildIds.push(node.nodeId);
      }
    }
  }
};

const buildToolchainTreeFromState = (
  state: ToolchainGraphState,
  nodeId: string,
): CardTreeNode => {
  const node = getToolchainNode(state, nodeId);
  if (!node) {
    return { id: nodeId, name: nodeId, content: nodeId, children: [] };
  }

  const children = getToolchainChildren(state, nodeId).map((child) =>
    buildToolchainTreeFromState(state, child.nodeId),
  );

  return {
    id: node.nodeId,
    name: node.name,
    content: {
      ...node,
      parentCount: node.strongParentIds.length,
      childCount: node.strongChildIds.length,
      weakCount: node.weakRelationIds.length,
    },
    children,
    options:
      node.kind === 'tool'
        ? {
            nodeWidth: 360,
            nodeHeight: 220,
            nodeBGColor: 'transparent',
            borderWidth: 0,
            nodeShadow: 'none',
            nodeStyle: 'padding:0;background:transparent;border:0;',
          }
        : node.kind === 'category'
          ? {
              nodeWidth: 300,
              nodeHeight: 140,
              nodeBGColor: 'transparent',
              borderWidth: 0,
              nodeShadow: 'none',
              nodeStyle: 'padding:0;background:transparent;border:0;',
            }
          : {
              nodeWidth: 240,
              nodeHeight: 110,
              nodeBGColor: 'transparent',
              borderWidth: 0,
              nodeShadow: 'none',
              nodeStyle: 'padding:0;background:transparent;border:0;',
            },
  };
};

const upsertUnique = (items: string[], value: string) => {
  if (!items.includes(value)) items.push(value);
};

const removeValue = (items: string[], value: string) => {
  const index = items.indexOf(value);
  if (index >= 0) items.splice(index, 1);
};

const parseJson = <T>(raw: string | undefined, fallback: T): T => {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

const escapeHtml = (value: unknown): string =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === 'string' ? item : String(item ?? '')))
    .filter((item) => item.length > 0);
};

const makeToolchainNodeTemplate = (content: unknown): string => {
  if (!content || typeof content !== 'object') {
    return `<div style="display:flex;align-items:center;justify-content:center;height:100%;font-weight:600;">${escapeHtml(content)}</div>`;
  }

  const tool = content as Record<string, unknown>;
  const kind = typeof tool['kind'] === 'string' ? tool['kind'] : '';
  if (kind === 'root') {
    return `
      <div style="height:100%;padding:8px;box-sizing:border-box;">
        <div style="height:100%;border:1px solid color-mix(in oklab, var(--color-cta), transparent 55%);border-radius:18px;background:linear-gradient(135deg, color-mix(in oklab, var(--color-cta), transparent 90%), transparent 60%), var(--ds-color-surface-raised);display:grid;place-items:center;padding:12px;box-shadow:0 12px 28px var(--shadow-1);">
          <div style="display:grid;gap:4px;text-align:center;">
            <div style="font-family:var(--font-mono);font-size:1.35rem;font-weight:700;color:var(--color-text-strong);">${escapeHtml(tool['name'])}</div>
            <div style="font-size:0.8rem;color:var(--color-text-muted);">${escapeHtml(tool['title'] ?? '')}</div>
          </div>
        </div>
      </div>
    `;
  }

  if (kind === 'category') {
    const bucket = escapeHtml(tool['bucket'] ?? 'CAT');
    const parentCount = escapeHtml(tool['parentCount'] ?? 0);
    const childCount = escapeHtml(tool['childCount'] ?? 0);
    const weakCount = escapeHtml(tool['weakCount'] ?? 0);
    return `
      <div style="height:100%;padding:8px;box-sizing:border-box;overflow:visible;">
        <div style="height:100%;border:1px solid var(--ds-color-border);border-radius:16px;background:var(--ds-color-surface-raised);padding:14px 16px;display:flex;flex-direction:column;gap:10px;box-shadow:0 10px 24px var(--shadow-1);">
          <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:10px;">
            <div>
              <div style="font-family:var(--font-mono);font-size:1rem;font-weight:700;color:var(--color-text-strong);">${escapeHtml(tool['name'])}</div>
              <div style="font-size:0.78rem;color:var(--color-text-muted);">Hierarchy category</div>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;">
            <span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;background:color-mix(in oklab, var(--color-cta), transparent 78%);color:var(--color-cta);font-size:11px;font-weight:700;letter-spacing:0.04em;">${bucket}</span>
            <span style="font-size:11px;color:var(--color-text-muted);">Parents ${parentCount}</span>
            <span style="font-size:11px;color:var(--color-text-muted);">Children ${childCount}</span>
            <span style="font-size:11px;color:var(--color-text-muted);">Weak ${weakCount}</span>
          </div>
        </div>
      </div>
    `;
  }

  if (kind !== 'tool') {
    const label = escapeHtml(tool['name'] ?? content);
    return `<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:8px 10px;font-weight:700;font-size:20px;">${label}</div>`;
  }

  const name = escapeHtml(tool['name']);
  const vendor = escapeHtml(tool['title']);
  const bucket = escapeHtml(tool['bucket'] ?? 'OPS');
  const metrics =
    tool['metrics'] && typeof tool['metrics'] === 'object'
      ? (tool['metrics'] as Record<string, unknown>)
      : {};
  const jobsMetric = escapeHtml(metrics['jobs'] ?? 0);
  const yearsMetric = escapeHtml(metrics['years'] ?? 0);
  const activeProjectsMetric = escapeHtml(metrics['activeProjects'] ?? 0);
  const categories = toStringArray(tool['categoryLabels']).slice(0, 2);
  const tags = toStringArray(tool['tags']).slice(0, 3);
  const website =
    typeof tool['website'] === 'string' && tool['website'].length > 0
      ? escapeHtml(tool['website'])
      : '';
  const logoUrl =
    typeof tool['logoUrl'] === 'string' && tool['logoUrl'].length > 0
      ? escapeHtml(tool['logoUrl'])
      : '';
  const logoInitialRaw =
    typeof tool['name'] === 'string' ? tool['name'].trim().charAt(0) : '';
  const logoInitial = escapeHtml((logoInitialRaw || '•').toUpperCase());
  const isLanguage = Boolean(tool['isLanguage']);

  const categoryHtml = categories
    .map(
      (category) =>
        `<span style="display:inline-flex;align-items:center;padding:2px 10px;border:1px solid color-mix(in oklab, var(--color-cta), transparent 60%);border-radius:999px;font-size:11px;line-height:1.2;color:var(--color-text);">${escapeHtml(category)}</span>`,
    )
    .join('');

  const tagHtml = tags
    .map(
      (tag) =>
        `<span style="display:inline-flex;align-items:center;font-size:12px;line-height:1.2;color:var(--color-text-muted);">${escapeHtml(tag)}</span>`,
    )
    .join('');

  const footerHtml = website
    ? `<div style="margin-top:auto;padding-top:10px;border-top:1px solid var(--ds-color-border);font-size:12px;color:var(--color-cta);font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">↗ Website</div>`
    : '<div style="margin-top:auto;"></div>';

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block;"/>`
    : `<span style="display:grid;place-items:center;width:100%;height:100%;font-family:var(--font-mono);font-size:14px;font-weight:700;color:var(--color-text-strong);">${logoInitial}</span>`;

  return `
    <div style="height:100%;padding:12px 10px 8px;box-sizing:border-box;overflow:visible;">
      <div style="position:relative;height:100%;border:1px solid var(--ds-color-border);border-radius:16px;background:var(--ds-color-surface-raised);box-shadow:0 12px 30px var(--shadow-1);padding:14px 16px;display:flex;flex-direction:column;gap:8px;overflow:visible;">
        <div style="position:absolute;left:-16px;top:-16px;width:40px;height:40px;border-radius:999px;border:1.5px solid var(--fx-metal-bronze, #6b4f2e);background:var(--color-surface-2);box-shadow:0 6px 14px color-mix(in oklab, var(--fx-metal-bronze, #6b4f2e), transparent 70%);overflow:hidden;z-index:2;">${logoHtml}</div>
      <div style="display:flex;align-items:baseline;justify-content:space-between;gap:8px;">
        <div style="font-family:var(--font-mono);font-size:20px;font-weight:600;line-height:1.2;color:var(--color-text-strong);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${name}</div>
        <div style="font-family:var(--font-mono);font-size:12px;line-height:1.2;text-transform:uppercase;letter-spacing:0.04em;color:var(--color-text-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${vendor}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
        <span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;background:color-mix(in oklab, var(--color-cta), transparent 78%);color:var(--color-cta);font-size:11px;font-weight:700;letter-spacing:0.04em;">${bucket}</span>
        ${isLanguage ? '<span style="display:inline-flex;align-items:center;padding:2px 8px;border-radius:999px;background:color-mix(in oklab, #ff8a00, transparent 76%);color:#ff8a00;font-size:11px;font-weight:700;letter-spacing:0.04em;">LANG</span>' : ''}
        <span style="font-size:11px;color:var(--color-text-muted);">Jobs ${jobsMetric}</span>
        <span style="font-size:11px;color:var(--color-text-muted);">Years ${yearsMetric}</span>
        <span style="font-size:11px;color:var(--color-text-muted);">Personal ${activeProjectsMetric}</span>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:6px;">${categoryHtml}</div>
      <div style="display:flex;flex-wrap:wrap;gap:8px;min-height:16px;">${tagHtml}</div>
      ${footerHtml}
      </div>
    </div>
  `;
};

const createToolModal = (root: HTMLElement) => {
  const existing = root.querySelector<HTMLDialogElement>(
    '[data-card-tree-modal]',
  );
  if (existing) return existing;

  const dialog = document.createElement('dialog');
  dialog.className = 'card-tree-modal';
  dialog.setAttribute('data-card-tree-modal', 'true');
  dialog.innerHTML = `
    <form method="dialog" class="card-tree-modal__frame">
      <header class="card-tree-modal__header">
        <div>
          <h3 class="card-tree-modal__title" data-modal-title>Tool details</h3>
          <p class="card-tree-modal__subtitle" data-modal-subtitle></p>
        </div>
        <button class="card-tree-modal__close" value="cancel" aria-label="Close">✕</button>
      </header>
      <section class="card-tree-modal__section card-tree-modal__section--editor" data-modal-editor>
        <h4>Hierarchy editor</h4>
        <div class="card-tree-modal__editor-grid">
          <section class="card-tree-modal__editor-panel">
            <h5>Parents</h5>
            <div class="card-tree-modal__chips" data-modal-parent-chips></div>
            <div class="card-tree-modal__input-row">
              <input class="card-tree-modal__input" list="card-tree-parent-options" data-modal-parent-input placeholder="Add parent" />
              <datalist id="card-tree-parent-options"></datalist>
              <button type="button" class="card-tree-modal__action" data-modal-parent-add>Add</button>
            </div>
          </section>
          <section class="card-tree-modal__editor-panel">
            <h5>Children</h5>
            <div class="card-tree-modal__chips" data-modal-child-chips></div>
            <div class="card-tree-modal__input-row">
              <input class="card-tree-modal__input" list="card-tree-child-options" data-modal-child-input placeholder="Add child" />
              <datalist id="card-tree-child-options"></datalist>
              <button type="button" class="card-tree-modal__action" data-modal-child-add>Add</button>
            </div>
          </section>
          <section class="card-tree-modal__editor-panel">
            <h5>Weak relations</h5>
            <div class="card-tree-modal__chips" data-modal-weak-chips></div>
            <div class="card-tree-modal__input-row">
              <input class="card-tree-modal__input" list="card-tree-weak-options" data-modal-weak-input placeholder="Add weak relation" />
              <datalist id="card-tree-weak-options"></datalist>
              <button type="button" class="card-tree-modal__action" data-modal-weak-add>Add</button>
            </div>
          </section>
          <section class="card-tree-modal__editor-panel" data-modal-language-panel>
            <h5>Technology flags</h5>
            <label class="card-tree-modal__checkbox-row">
              <input type="checkbox" data-modal-language-toggle />
              <span>Language technology</span>
            </label>
          </section>
        </div>
        <p class="card-tree-modal__validation" data-modal-validation></p>
      </section>
      <section class="card-tree-modal__section">
        <h4>Jobs</h4>
        <div class="card-tree-modal__table-wrap">
          <table class="card-tree-modal__table" data-modal-jobs>
            <thead><tr><th>Company</th><th>Role</th><th>Period</th><th>Location</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </section>
      <section class="card-tree-modal__section">
        <h4>GitHub projects</h4>
        <div class="card-tree-modal__table-wrap">
          <table class="card-tree-modal__table" data-modal-projects>
            <thead><tr><th>Project</th><th>Status</th><th>Repo</th><th>Demo</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
      </section>
      <section class="card-tree-modal__section">
        <h4>Knowledge Center references</h4>
        <div class="card-tree-modal__resource-groups">
          <article class="card-tree-modal__resource-group card-tree-modal__resource-group--direct">
            <h5 class="card-tree-modal__resource-title">Direct references</h5>
            <p class="card-tree-modal__resource-subtitle">Explicitly linked to this tool.</p>
            <ul class="card-tree-modal__resources" data-modal-resources-direct></ul>
          </article>
          <article class="card-tree-modal__resource-group card-tree-modal__resource-group--indirect">
            <h5 class="card-tree-modal__resource-title">Indirect references</h5>
            <p class="card-tree-modal__resource-subtitle">Matched by shared categories and tags.</p>
            <ul class="card-tree-modal__resources" data-modal-resources-indirect></ul>
          </article>
        </div>
      </section>
    </form>
  `;
  root.append(dialog);
  return dialog;
};

const fillTableRows = (
  tbody: HTMLTableSectionElement,
  rows: string[][],
  emptyText: string,
) => {
  tbody.innerHTML = '';
  if (rows.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.textContent = emptyText;
    tr.append(td);
    tbody.append(tr);
    return;
  }

  for (const cells of rows) {
    const tr = document.createElement('tr');
    for (const cell of cells) {
      const td = document.createElement('td');
      td.innerHTML = cell;
      tr.append(td);
    }
    tbody.append(tr);
  }
};

const drawToolchainWeakEdges = (
  root: HTMLElement,
  state: ToolchainGraphState,
) => {
  const svg = root.querySelector<SVGSVGElement>('svg');
  if (!svg) return;

  svg
    .querySelectorAll('[data-toolchain-weak-edge-group]')
    .forEach((node) => node.remove());
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.setAttribute('data-toolchain-weak-edge-group', 'true');
  group.setAttribute('pointer-events', 'none');

  const makePath = (fromId: string, toId: string) => {
    const fromNode = root.querySelector<SVGGElement>(
      `[role="treeitem"][data-self="${fromId}"]`,
    );
    const toNode = root.querySelector<SVGGElement>(
      `[role="treeitem"][data-self="${toId}"]`,
    );
    if (!fromNode || !toNode) return null;
    const a = fromNode.getBBox();
    const b = toNode.getBBox();
    const ax = a.x + a.width / 2;
    const ay = a.y + a.height / 2;
    const bx = b.x + b.width / 2;
    const by = b.y + b.height / 2;
    const midX = (ax + bx) / 2;
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute(
      'd',
      `M ${ax} ${ay} L ${midX} ${ay} L ${midX} ${by} L ${bx} ${by}`,
    );
    path.setAttribute('fill', 'none');
    path.setAttribute(
      'stroke',
      'color-mix(in oklab, var(--fx-metal-bronze, #6b4f2e), transparent 15%)',
    );
    path.setAttribute('stroke-width', '1.5');
    path.setAttribute('stroke-dasharray', '6 5');
    path.setAttribute('opacity', '0.9');
    return path;
  };

  const seen = new Set<string>();
  for (const node of state.nodes) {
    for (const parentId of node.strongParentIds.slice(1)) {
      const key = [parentId, node.nodeId].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      const path = makePath(parentId, node.nodeId);
      if (path) group.append(path);
    }
    for (const weakId of node.weakRelationIds) {
      const key = [node.nodeId, weakId].sort().join('::');
      if (seen.has(key)) continue;
      seen.add(key);
      const path = makePath(node.nodeId, weakId);
      if (path) group.append(path);
    }
  }

  const defs = svg.querySelector('defs');
  if (defs?.nextSibling) {
    svg.insertBefore(group, defs.nextSibling);
  } else {
    svg.append(group);
  }
};

type ToolchainModalContext = {
  graphState: ToolchainGraphState;
  renderFromState: () => void;
};

const renderTagChips = (
  container: HTMLElement,
  state: ToolchainGraphState,
  ids: string[],
  removable: boolean,
  relationKind: 'parent' | 'child' | 'weak',
  onRemove: (id: string) => void,
) => {
  container.innerHTML = '';
  if (ids.length === 0) {
    const empty = document.createElement('span');
    empty.className = 'card-tree-modal__chip-empty';
    empty.textContent = 'No tags yet.';
    container.append(empty);
    return;
  }

  for (const id of ids) {
    const node = getToolchainNode(state, id);
    const chip = document.createElement('span');
    chip.className = 'card-tree-modal__chip';
    chip.innerHTML = `<span>${escapeHtml(node?.name ?? id)}</span>`;
    if (removable) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'card-tree-modal__chip-remove';
      button.textContent = '×';
      button.setAttribute(
        'aria-label',
        `Remove ${relationKind} ${node?.name ?? id}`,
      );
      button.addEventListener('click', () => onRemove(id));
      chip.append(button);
    }
    container.append(chip);
  }
};

const resolveNodeFromInput = (
  state: ToolchainGraphState,
  raw: string,
): ToolchainGraphNode | null => {
  const normalized = raw.trim().toLowerCase();
  if (!normalized) return null;
  return (
    state.nodes.find((node) => node.name.trim().toLowerCase() === normalized) ??
    null
  );
};

const populateDatalist = (
  list: HTMLDataListElement,
  nodes: ToolchainGraphNode[],
) => {
  list.innerHTML = '';
  for (const node of nodes) {
    const option = document.createElement('option');
    option.value = node.name;
    list.append(option);
  }
};

const openToolModal = (
  root: HTMLElement,
  payload: Record<string, unknown>,
  context: ToolchainModalContext,
) => {
  const dialog = createToolModal(root);
  const titleEl = dialog.querySelector<HTMLElement>('[data-modal-title]');
  const subtitleEl = dialog.querySelector<HTMLElement>('[data-modal-subtitle]');
  const editorSection = dialog.querySelector<HTMLElement>(
    '[data-modal-editor]',
  );
  const parentChips = dialog.querySelector<HTMLElement>(
    '[data-modal-parent-chips]',
  );
  const childChips = dialog.querySelector<HTMLElement>(
    '[data-modal-child-chips]',
  );
  const weakChips = dialog.querySelector<HTMLElement>(
    '[data-modal-weak-chips]',
  );
  const validationEl = dialog.querySelector<HTMLElement>(
    '[data-modal-validation]',
  );
  const parentInput = dialog.querySelector<HTMLInputElement>(
    '[data-modal-parent-input]',
  );
  const childInput = dialog.querySelector<HTMLInputElement>(
    '[data-modal-child-input]',
  );
  const weakInput = dialog.querySelector<HTMLInputElement>(
    '[data-modal-weak-input]',
  );
  const parentList = dialog.querySelector<HTMLDataListElement>(
    '#card-tree-parent-options',
  );
  const childList = dialog.querySelector<HTMLDataListElement>(
    '#card-tree-child-options',
  );
  const weakList = dialog.querySelector<HTMLDataListElement>(
    '#card-tree-weak-options',
  );
  const parentAddBtn = dialog.querySelector<HTMLButtonElement>(
    '[data-modal-parent-add]',
  );
  const childAddBtn = dialog.querySelector<HTMLButtonElement>(
    '[data-modal-child-add]',
  );
  const weakAddBtn = dialog.querySelector<HTMLButtonElement>(
    '[data-modal-weak-add]',
  );
  const languagePanel = dialog.querySelector<HTMLElement>(
    '[data-modal-language-panel]',
  );
  const languageToggle = dialog.querySelector<HTMLInputElement>(
    '[data-modal-language-toggle]',
  );
  const jobsBody = dialog.querySelector<HTMLTableSectionElement>(
    '[data-modal-jobs] tbody',
  );
  const projectsBody = dialog.querySelector<HTMLTableSectionElement>(
    '[data-modal-projects] tbody',
  );
  const directResourcesEl = dialog.querySelector<HTMLElement>(
    '[data-modal-resources-direct]',
  );
  const indirectResourcesEl = dialog.querySelector<HTMLElement>(
    '[data-modal-resources-indirect]',
  );
  if (
    !titleEl ||
    !subtitleEl ||
    !editorSection ||
    !parentChips ||
    !childChips ||
    !weakChips ||
    !validationEl ||
    !parentInput ||
    !childInput ||
    !weakInput ||
    !parentList ||
    !childList ||
    !weakList ||
    !parentAddBtn ||
    !childAddBtn ||
    !weakAddBtn ||
    !languagePanel ||
    !languageToggle ||
    !jobsBody ||
    !projectsBody ||
    !directResourcesEl ||
    !indirectResourcesEl
  )
    return;

  const nodeId = String(payload['nodeId'] ?? '');
  const refreshNode = () => getToolchainNode(context.graphState, nodeId);
  const jobsSection = jobsBody.closest<HTMLElement>(
    '.card-tree-modal__section',
  );
  const projectsSection = projectsBody.closest<HTMLElement>(
    '.card-tree-modal__section',
  );
  const resourcesSection = directResourcesEl.closest<HTMLElement>(
    '.card-tree-modal__section',
  );

  const setValidation = (
    message: string,
    tone: 'muted' | 'error' = 'muted',
  ) => {
    validationEl.textContent = message;
    validationEl.dataset['tone'] = tone;
  };

  const rerenderAll = () => {
    const currentNode = refreshNode();
    if (!currentNode) return;

    titleEl.textContent = currentNode.name;
    subtitleEl.textContent = `Type ${currentNode.kind.toUpperCase()} · Bucket ${String(currentNode.bucket ?? 'n/a')}${currentNode.title ? ` · ${currentNode.title}` : ''}`;
    editorSection.hidden = false;
    languagePanel.hidden = currentNode.kind !== 'tool';
    languageToggle.checked = Boolean(currentNode.isLanguage);

    const readOnly = Boolean(currentNode.locked) || currentNode.kind === 'root';
    parentInput.disabled = readOnly || currentNode.kind === 'root';
    parentAddBtn.disabled = readOnly || currentNode.kind === 'root';
    childInput.disabled = readOnly || currentNode.kind === 'tool';
    childAddBtn.disabled = readOnly || currentNode.kind === 'tool';
    weakInput.disabled = readOnly;
    weakAddBtn.disabled = readOnly;
    languageToggle.disabled = readOnly || currentNode.kind !== 'tool';

    const parentCandidates = context.graphState.nodes.filter((node) => {
      if (node.nodeId === currentNode.nodeId) return false;
      if (node.kind === 'tool') return false;
      if (currentNode.strongParentIds.includes(node.nodeId)) return false;
      if (
        wouldCreateStrongCycle(
          context.graphState,
          node.nodeId,
          currentNode.nodeId,
        )
      )
        return false;
      return true;
    });
    const childCandidates = context.graphState.nodes.filter((node) => {
      if (node.nodeId === currentNode.nodeId) return false;
      if (node.kind === 'root') return false;
      if (currentNode.kind === 'tool') return false;
      if (currentNode.strongChildIds.includes(node.nodeId)) return false;
      if (
        wouldCreateStrongCycle(
          context.graphState,
          currentNode.nodeId,
          node.nodeId,
        )
      )
        return false;
      return true;
    });
    const weakCandidates = context.graphState.nodes.filter((node) => {
      if (node.nodeId === currentNode.nodeId) return false;
      if (currentNode.weakRelationIds.includes(node.nodeId)) return false;
      return true;
    });

    populateDatalist(parentList, parentCandidates);
    populateDatalist(childList, childCandidates);
    populateDatalist(weakList, weakCandidates);

    renderTagChips(
      parentChips,
      context.graphState,
      currentNode.strongParentIds,
      !readOnly && currentNode.kind !== 'root',
      'parent',
      (targetId) => {
        const liveNode = refreshNode();
        if (!liveNode) return;
        if (liveNode.strongParentIds.length <= 1) {
          setValidation(
            'Every non-L0 node needs at least one parent.',
            'error',
          );
          return;
        }
        removeValue(liveNode.strongParentIds, targetId);
        syncStrongChildLists(context.graphState);
        context.renderFromState();
        setValidation('Parent removed.');
        rerenderAll();
      },
    );

    renderTagChips(
      childChips,
      context.graphState,
      currentNode.strongChildIds,
      !readOnly && currentNode.kind === 'category',
      'child',
      (targetId) => {
        const liveNode = refreshNode();
        if (!liveNode) return;
        if (liveNode.kind === 'tool') {
          setValidation('Technology nodes cannot have children.', 'error');
          return;
        }
        if (
          !liveNode.locked &&
          liveNode.kind === 'category' &&
          liveNode.strongChildIds.length <= 1
        ) {
          setValidation(
            'Every editable category needs at least one child.',
            'error',
          );
          return;
        }
        const targetNode = getToolchainNode(context.graphState, targetId);
        if (!targetNode) return;
        removeValue(targetNode.strongParentIds, liveNode.nodeId);
        syncStrongChildLists(context.graphState);
        context.renderFromState();
        setValidation('Child removed.');
        rerenderAll();
      },
    );

    renderTagChips(
      weakChips,
      context.graphState,
      currentNode.weakRelationIds,
      !readOnly,
      'weak',
      (targetId) => {
        const liveNode = refreshNode();
        const targetNode = getToolchainNode(context.graphState, targetId);
        if (!liveNode || !targetNode) return;
        removeValue(liveNode.weakRelationIds, targetId);
        removeValue(targetNode.weakRelationIds, liveNode.nodeId);
        context.renderFromState();
        setValidation('Weak relation removed.');
        rerenderAll();
      },
    );

    const jobs = currentNode.jobs ?? [];
    const projects = currentNode.projects ?? [];
    const directResources = currentNode.resources?.direct ?? [];
    const indirectResources = currentNode.resources?.indirect ?? [];
    const showEvidence = currentNode.kind === 'tool';
    if (jobsSection) jobsSection.hidden = !showEvidence;
    if (projectsSection) projectsSection.hidden = !showEvidence;
    if (resourcesSection) resourcesSection.hidden = !showEvidence;

    fillTableRows(
      jobsBody,
      jobs.map((job) => [
        escapeHtml(job['company']),
        escapeHtml(job['role']),
        escapeHtml(job['period']),
        escapeHtml(job['location']),
      ]),
      'No linked jobs found.',
    );

    fillTableRows(
      projectsBody,
      projects.map((project) => {
        const repo =
          typeof project['repoUrl'] === 'string' &&
          project['repoUrl'].length > 0
            ? `<a href="${escapeHtml(project['repoUrl'])}" target="_blank" rel="noopener noreferrer">repo</a>`
            : '—';
        const demo =
          typeof project['demoUrl'] === 'string' &&
          project['demoUrl'].length > 0
            ? `<a href="${escapeHtml(project['demoUrl'])}" target="_blank" rel="noopener noreferrer">demo</a>`
            : '—';
        return [
          escapeHtml(project['title']),
          escapeHtml(project['status']),
          repo,
          demo,
        ];
      }),
      'No linked personal projects found.',
    );

    directResourcesEl.innerHTML = '';
    if (directResources.length === 0) {
      const li = document.createElement('li');
      li.className =
        'card-tree-modal__resource-item card-tree-modal__resource-item--empty';
      li.textContent = 'No direct references found.';
      directResourcesEl.append(li);
    } else {
      for (const resource of directResources) {
        const type = String(resource['type'] ?? 'resource');
        const title = String(resource['title'] ?? 'Untitled');
        const item = document.createElement('li');
        item.className =
          'card-tree-modal__resource-item card-tree-modal__resource-item--direct';
        const externalUrl =
          typeof resource['url'] === 'string' ? resource['url'] : '';
        const internalUrl =
          typeof resource['resourceId'] === 'string'
            ? `/en/knowledge/${resource['resourceId']}`
            : '';
        const href = externalUrl || internalUrl;
        item.innerHTML = href
          ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a> <span class="card-tree-modal__resource-type">${escapeHtml(type)}</span>`
          : `${escapeHtml(title)} (${escapeHtml(type)})`;
        directResourcesEl.append(item);
      }
    }

    indirectResourcesEl.innerHTML = '';
    if (indirectResources.length === 0) {
      const li = document.createElement('li');
      li.className =
        'card-tree-modal__resource-item card-tree-modal__resource-item--empty';
      li.textContent = 'No indirect references found.';
      indirectResourcesEl.append(li);
    } else {
      for (const resource of indirectResources) {
        const type = String(resource['type'] ?? 'resource');
        const title = String(resource['title'] ?? 'Untitled');
        const relevancePct = Math.round(
          Number(resource['relevance'] ?? 0) * 100,
        );
        const item = document.createElement('li');
        item.className =
          'card-tree-modal__resource-item card-tree-modal__resource-item--indirect';
        const externalUrl =
          typeof resource['url'] === 'string' ? resource['url'] : '';
        const internalUrl =
          typeof resource['resourceId'] === 'string'
            ? `/en/knowledge/${resource['resourceId']}`
            : '';
        const href = externalUrl || internalUrl;
        const titleHtml = href
          ? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a>`
          : escapeHtml(title);
        item.innerHTML = `${titleHtml} <span class="card-tree-modal__resource-type">${escapeHtml(type)}</span> <span class="card-tree-modal__relevance">R${relevancePct}</span>`;
        indirectResourcesEl.append(item);
      }
    }
  };

  parentAddBtn.onclick = () => {
    const currentNode = refreshNode();
    const candidate = resolveNodeFromInput(
      context.graphState,
      parentInput.value,
    );
    if (!currentNode || !candidate) {
      setValidation('Choose a valid parent tag.', 'error');
      return;
    }
    if (candidate.kind === 'tool') {
      setValidation('A parent cannot be a technology.', 'error');
      return;
    }
    if (
      wouldCreateStrongCycle(
        context.graphState,
        candidate.nodeId,
        currentNode.nodeId,
      )
    ) {
      setValidation('That parent would create a cyclic dependency.', 'error');
      return;
    }
    upsertUnique(currentNode.strongParentIds, candidate.nodeId);
    syncStrongChildLists(context.graphState);
    context.renderFromState();
    parentInput.value = '';
    setValidation('Parent added.');
    rerenderAll();
  };

  childAddBtn.onclick = () => {
    const currentNode = refreshNode();
    const candidate = resolveNodeFromInput(
      context.graphState,
      childInput.value,
    );
    if (!currentNode || !candidate) {
      setValidation('Choose a valid child tag.', 'error');
      return;
    }
    if (currentNode.kind === 'tool') {
      setValidation('Technology nodes cannot have children.', 'error');
      return;
    }
    if (candidate.kind === 'root') {
      setValidation('Root cannot be a child.', 'error');
      return;
    }
    if (
      wouldCreateStrongCycle(
        context.graphState,
        currentNode.nodeId,
        candidate.nodeId,
      )
    ) {
      setValidation('That child would create a cyclic dependency.', 'error');
      return;
    }
    upsertUnique(candidate.strongParentIds, currentNode.nodeId);
    syncStrongChildLists(context.graphState);
    context.renderFromState();
    childInput.value = '';
    setValidation('Child added.');
    rerenderAll();
  };

  weakAddBtn.onclick = () => {
    const currentNode = refreshNode();
    const candidate = resolveNodeFromInput(context.graphState, weakInput.value);
    if (!currentNode || !candidate) {
      setValidation('Choose a valid weak relation tag.', 'error');
      return;
    }
    if (candidate.nodeId === currentNode.nodeId) {
      setValidation('A node cannot weak-link to itself.', 'error');
      return;
    }
    upsertUnique(currentNode.weakRelationIds, candidate.nodeId);
    upsertUnique(candidate.weakRelationIds, currentNode.nodeId);
    context.renderFromState();
    weakInput.value = '';
    setValidation('Weak relation added.');
    rerenderAll();
  };

  languageToggle.onchange = () => {
    const currentNode = refreshNode();
    if (!currentNode || currentNode.kind !== 'tool') return;
    currentNode.isLanguage = languageToggle.checked;
    context.renderFromState();
    setValidation('Language flag updated.');
    rerenderAll();
  };

  rerenderAll();

  if (!dialog.open) dialog.showModal();
};

const cloneForDepth = (
  node: CardTreeNode,
  depth: number,
  maxDepth: number,
): CardTreeNode => {
  const sourceChildren = [
    ...(node.children ?? []),
    ...(node.hiddenChildren ?? []),
  ];

  const cloned: CardTreeNode = {
    ...node,
    children: [],
    hiddenChildren: undefined,
  };

  if (sourceChildren.length === 0) return cloned;

  if (depth + 1 >= maxDepth) {
    cloned.children = [];
    cloned.hiddenChildren = sourceChildren.map((child) => ({ ...child }));
    return cloned;
  }

  cloned.children = sourceChildren.map((child) =>
    cloneForDepth(child, depth + 1, maxDepth),
  );
  cloned.hiddenChildren = [];
  return cloned;
};

const toggleNodeExpansionById = (
  node: CardTreeNode,
  nodeId: string,
): boolean => {
  if (node.id === nodeId) {
    const currentChildren = node.children ?? [];
    const currentHidden = node.hiddenChildren ?? [];
    if (currentHidden.length > 0) {
      node.children = [...currentChildren, ...currentHidden];
      node.hiddenChildren = [];
      return true;
    }
    if (currentChildren.length > 0) {
      node.hiddenChildren = [...currentChildren];
      node.children = [];
      return true;
    }
    return false;
  }

  for (const child of node.children ?? []) {
    if (toggleNodeExpansionById(child, nodeId)) return true;
  }
  for (const hiddenChild of node.hiddenChildren ?? []) {
    if (toggleNodeExpansionById(hiddenChild, nodeId)) return true;
  }
  return false;
};

const attachControls = (
  root: HTMLElement,
  getGraph: () => CardTreeGraph | null,
  renderAtLevel: (level: number) => void,
): { dispose: () => void; ensureAttached: () => void } => {
  const container = document.createElement('div');
  container.className = 'card-tree-controls';

  const centerBtn = document.createElement('button');
  centerBtn.type = 'button';
  centerBtn.textContent = 'Center';
  centerBtn.className = 'card-tree-controls__btn';
  centerBtn.addEventListener('click', () => {
    getGraph()?.fitScreen?.();
  });

  const levels: Array<{ level: number; label: string }> = [
    { level: 1, label: 'L1' },
    { level: 2, label: 'L2' },
    { level: 3, label: 'L3' },
  ];

  const levelButtons = levels.map(({ level, label }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = label;
    btn.className = 'card-tree-controls__btn';
    btn.dataset['level'] = String(level);
    btn.addEventListener('click', () => {
      renderAtLevel(level);
      levelButtons.forEach((item) => item.removeAttribute('data-active'));
      btn.setAttribute('data-active', 'true');
    });
    return btn;
  });

  container.append(centerBtn, ...levelButtons);
  const ensureAttached = () => {
    if (!root.contains(container)) {
      root.append(container);
    }
  };
  ensureAttached();
  levelButtons[1]?.setAttribute('data-active', 'true');

  return {
    dispose: () => {
      container.remove();
    },
    ensureAttached,
  };
};

const attachToolchainDoubleClick = (
  root: HTMLElement,
  onToggle: (nodeId: string) => void,
  onCancelModal: () => void,
): { dispose: () => void } => {
  const handler = (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const treeItem = target.closest<HTMLElement>(
      '[role="treeitem"][data-self]',
    );
    if (!treeItem) return;
    const nodeId = treeItem.dataset['self'];
    if (!nodeId) return;
    onCancelModal();
    onToggle(nodeId);
  };

  root.addEventListener('dblclick', handler, true);
  return {
    dispose: () => root.removeEventListener('dblclick', handler, true),
  };
};

let runtimePromise: Promise<CardTreeConstructor> | null = null;
const loadRuntime = async (): Promise<CardTreeConstructor> => {
  if (runtimePromise) return runtimePromise;

  runtimePromise = (async () => {
    await new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-card-tree-treemap="true"]',
      );
      if (existing) {
        if (existing.dataset['loaded'] === 'true') resolve();
        else existing.addEventListener('load', () => resolve(), { once: true });
        return;
      }

      const baseUrl = import.meta.env.BASE_URL ?? '/';
      const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const runtimeUrl = new URL(
        `${normalizedBaseUrl}vendor/treemap.js`,
        window.location.origin,
      ).toString();
      const script = document.createElement('script');
      script.dataset['cardTreeTreemap'] = 'true';
      script.src = runtimeUrl;
      script.async = true;
      script.addEventListener(
        'load',
        () => {
          script.dataset['loaded'] = 'true';
          resolve();
        },
        { once: true },
      );
      script.addEventListener(
        'error',
        () => reject(new Error('Failed to load CardTree runtime')),
        { once: true },
      );
      document.head.appendChild(script);
    });
    const ctor = (globalThis as Record<string, unknown>).CardTree;

    if (typeof ctor !== 'function') {
      throw new Error('CardTree runtime not found after loading treemap.js');
    }

    return ctor as CardTreeConstructor;
  })();

  return runtimePromise;
};

export async function initCardTrees(): Promise<void> {
  if (typeof window === 'undefined') return;

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>('[data-card-tree]'),
  );
  for (const root of roots) {
    if (root.dataset['cardTreeReady'] === 'true') continue;
    root.dataset['cardTreeReady'] = 'true';
    root.dataset['cardTreeStatus'] = 'loading';

    const data = parseJson<CardTreeNode | null>(root.dataset['treeData'], null);
    const options = parseJson<CardTreeOptionsInput>(
      root.dataset['treeOptions'],
      {},
    );
    const bindStore = root.dataset['bindStore'] === 'true';
    const toolchainGraph = parseJson<ToolchainGraphState | null>(
      root.dataset['toolchainGraph'],
      null,
    );

    let instance: CardTreeInstance | null = null;
    let graph: CardTreeGraph | null = null;
    const preset = root.dataset['cardTreePreset'];
    let toggleNodeByIdHandler: ((nodeId: string) => void) | null = null;
    let detachDoubleClick: (() => void) | null = null;
    let pendingModalNodeId = '';
    let pendingModalTimer: number | null = null;
    let currentToolchainState = toolchainGraph
      ? cloneToolchainGraphState(toolchainGraph)
      : null;
    if (currentToolchainState) syncStrongChildLists(currentToolchainState);
    let currentLevel = 2;
    let currentData: CardTreeNode | null = null;
    let ensureControlsAttached: (() => void) | null = null;
    let renderData: ((next: CardTreeNode) => void) | null = null;

    let templateOptions: CardTreeOptionsInput = options;
    if (preset === 'toolchain') {
      templateOptions = {
        ...templateOptions,
        nodeTemplate: makeToolchainNodeTemplate,
        onNodeClick: (node: unknown) => {
          if (!node || typeof node !== 'object') return;
          const nodeRecord = node as Record<string, unknown>;
          const content = nodeRecord['content'];
          if (!content || typeof content !== 'object') return;
          const payload = content as Record<string, unknown>;
          const nodeId =
            typeof payload['nodeId'] === 'string'
              ? payload['nodeId']
              : typeof nodeRecord['id'] === 'string'
                ? nodeRecord['id']
                : '';
          if (!currentToolchainState) return;
          if (pendingModalTimer) {
            window.clearTimeout(pendingModalTimer);
            pendingModalTimer = null;
          }
          pendingModalNodeId = nodeId;
          pendingModalTimer = window.setTimeout(() => {
            if (!currentToolchainState || pendingModalNodeId !== nodeId) return;
            openToolModal(root, payload, {
              graphState: currentToolchainState,
              renderFromState: () => {
                if (!currentToolchainState) return;
                const baseTree = buildToolchainTreeFromState(
                  currentToolchainState,
                  currentToolchainState.rootId,
                );
                currentData = cloneForDepth(baseTree, 0, currentLevel);
                renderData?.(currentData);
                ensureControlsAttached?.();
                requestAnimationFrame(() => {
                  drawToolchainWeakEdges(root, currentToolchainState!);
                });
              },
            });
            pendingModalTimer = null;
            pendingModalNodeId = '';
          }, 220);
        },
      } as CardTreeOptionsInput;
    }

    let unbindStore: (() => void) | null = null;
    let detachControls: (() => void) | null = null;
    try {
      const CardTree = await loadRuntime();
      instance = new CardTree(root, {
        ...CARD_TREE_DEFAULTS,
        ...templateOptions,
      });

      renderData = (next: CardTreeNode) => {
        if (!instance) return;
        graph = instance.render(next);
      };

      if (data) {
        renderData?.(data);

        if (preset === 'toolchain') {
          const renderToolchainFromState = () => {
            if (!currentToolchainState) return;
            const baseTree = buildToolchainTreeFromState(
              currentToolchainState,
              currentToolchainState.rootId,
            );
            currentData = cloneForDepth(baseTree, 0, currentLevel);
            renderData?.(currentData);
            ensureControlsAttached?.();
            requestAnimationFrame(() => {
              drawToolchainWeakEdges(root, currentToolchainState!);
              graph?.fitScreen?.();
            });
          };

          const renderAtLevel = (level: number) => {
            currentLevel = level;
            renderToolchainFromState();
          };

          toggleNodeByIdHandler = (nodeId: string) => {
            if (!currentData) return;
            const changed = toggleNodeExpansionById(currentData, nodeId);
            if (!changed) return;
            renderData?.(currentData);
            ensureControlsAttached?.();
            requestAnimationFrame(() => {
              if (currentToolchainState)
                drawToolchainWeakEdges(root, currentToolchainState);
              graph?.fitScreen?.();
            });
          };

          const controls = attachControls(root, () => graph, renderAtLevel);
          ensureControlsAttached = controls.ensureAttached;
          detachControls = controls.dispose;
          const dbl = attachToolchainDoubleClick(
            root,
            (nodeId) => toggleNodeByIdHandler?.(nodeId),
            () => {
              pendingModalNodeId = '';
              if (pendingModalTimer) {
                window.clearTimeout(pendingModalTimer);
                pendingModalTimer = null;
              }
            },
          );
          detachDoubleClick = dbl.dispose;
          renderAtLevel(2);
        }
      }

      if (bindStore) {
        const mod = await import('../stores/card-tree');
        const current = mod.$cardTreeData.get();
        if (current) {
          renderData?.(current);
        }
        unbindStore = mod.$cardTreeData.subscribe((next) => {
          if (next) renderData?.(next);
        });
      }

      if (!data && !bindStore) {
        root.insertAdjacentHTML(
          'beforeend',
          '<div data-card-tree-hint>No data provided for CardTree.</div>',
        );
      }

      root.dataset['cardTreeStatus'] = 'ready';
    } catch (error) {
      console.error('[CardTree] failed to initialize', error);
      root.dataset['cardTreeStatus'] = 'error';
      root.innerHTML =
        '<div data-card-tree-error>CardTree failed to load. Check browser console for details.</div>';
    }

    const dispose = () => {
      if (unbindStore) {
        unbindStore();
        unbindStore = null;
      }
      if (detachControls) {
        detachControls();
        detachControls = null;
      }
      if (detachDoubleClick) {
        detachDoubleClick();
        detachDoubleClick = null;
      }
      if (pendingModalTimer) {
        window.clearTimeout(pendingModalTimer);
        pendingModalTimer = null;
      }
      toggleNodeByIdHandler = null;
      instance?.destroy?.();
      instance = null;
      graph = null;
      root.dataset['cardTreeReady'] = 'false';
      root.dataset['cardTreeStatus'] = 'idle';
    };

    window.addEventListener('pagehide', dispose, { once: true });
    document.addEventListener('astro:before-swap', dispose, { once: true });
  }
}
