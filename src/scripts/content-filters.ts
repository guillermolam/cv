const tokenize = (value: string | undefined): Set<string> => {
  if (!value) return new Set();
  return new Set(value.split(/\s+/).map((v) => v.trim()).filter(Boolean));
};

const setHidden = (element: HTMLElement, hidden: boolean) => {
  if (hidden) {
    element.hidden = true;
    element.setAttribute('aria-hidden', 'true');
  } else {
    element.hidden = false;
    element.removeAttribute('aria-hidden');
  }
};

const setEnhanced = (root: HTMLElement) => {
  root.setAttribute('data-filter-enhanced', 'true');
};

type SelectMap = Record<string, HTMLSelectElement | null>;

const getSelectValue = (select: HTMLSelectElement | null) => (select ? select.value : '');

const enhanceFilter = (root: HTMLElement, options: { onApply: () => void; onReset: () => void }) => {
  if (root.getAttribute('data-filter-enhanced') === 'true') return;
  setEnhanced(root);

  const form = root.querySelector('form');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });
  }

  const resetButton = root.querySelector<HTMLButtonElement>('[data-filter-reset]');
  if (resetButton) {
    resetButton.addEventListener('click', (event) => {
      event.preventDefault();
      options.onReset();
      options.onApply();
    });
  }

  const selects = Array.from(root.querySelectorAll('select'));
  for (const select of selects) {
    select.addEventListener('change', () => {
      options.onApply();
    });
  }

  options.onApply();
};

export const initToolchainFilters = () => {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-toolchain-filter]'));
  for (const root of roots) {
    const targetSelector = root.getAttribute('data-target');
    if (!targetSelector) continue;

    const container = document.querySelector<HTMLElement>(targetSelector);
    if (!container) continue;

    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-tool-item]'));
    const total = items.length;

    const selects: SelectMap = {
      type: root.querySelector<HTMLSelectElement>('[data-filter-type]'),
      tag: root.querySelector<HTMLSelectElement>('[data-filter-tag]'),
      category: root.querySelector<HTMLSelectElement>('[data-filter-category]'),
    };

    const countEl = root.querySelector<HTMLElement>('[data-filter-count]');

    const apply = () => {
      const selectedType = getSelectValue(selects.type);
      const selectedTag = getSelectValue(selects.tag);
      const selectedCategory = getSelectValue(selects.category);

      let shown = 0;
      for (const item of items) {
        const typeIds = tokenize(item.dataset.typeIds);
        const tagIds = tokenize(item.dataset.tagIds);
        const categoryIds = tokenize(item.dataset.categoryIds);

        const matchesType =
          !selectedType ||
          (selectedType === '__none__' ? typeIds.size === 0 : typeIds.has(selectedType));
        const matchesTag = !selectedTag || tagIds.has(selectedTag);
        const matchesCategory = !selectedCategory || categoryIds.has(selectedCategory);

        const matches = matchesType && matchesTag && matchesCategory;
        setHidden(item, !matches);
        if (matches) shown += 1;
      }

      if (countEl) {
        countEl.textContent = `Showing ${shown} of ${total}`;
      }
    };

    const reset = () => {
      for (const select of Object.values(selects)) {
        if (select) select.value = '';
      }
    };

    enhanceFilter(root, { onApply: apply, onReset: reset });
  }
};

export const initKnowledgeFilters = () => {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-knowledge-filter]'));
  for (const root of roots) {
    const targetSelector = root.getAttribute('data-target');
    if (!targetSelector) continue;

    const container = document.querySelector<HTMLElement>(targetSelector);
    if (!container) continue;

    const groups = Array.from(container.querySelectorAll<HTMLElement>('[data-knowledge-group]'));
    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-knowledge-item]'));
    const total = items.length;

    const selects: SelectMap = {
      type: root.querySelector<HTMLSelectElement>('[data-filter-type]'),
      level: root.querySelector<HTMLSelectElement>('[data-filter-level]'),
      status: root.querySelector<HTMLSelectElement>('[data-filter-status]'),
      tag: root.querySelector<HTMLSelectElement>('[data-filter-tag]'),
      tool: root.querySelector<HTMLSelectElement>('[data-filter-tool]'),
      category: root.querySelector<HTMLSelectElement>('[data-filter-category]'),
    };

    const countEl = root.querySelector<HTMLElement>('[data-filter-count]');

    const apply = () => {
      const selectedType = getSelectValue(selects.type);
      const selectedLevel = getSelectValue(selects.level);
      const selectedStatus = getSelectValue(selects.status);
      const selectedTag = getSelectValue(selects.tag);
      const selectedTool = getSelectValue(selects.tool);
      const selectedCategory = getSelectValue(selects.category);

      let shown = 0;
      for (const item of items) {
        const type = item.dataset.type ?? '';
        const level = item.dataset.level ?? '';
        const status = item.dataset.status ?? '';
        const tagIds = tokenize(item.dataset.tagIds);
        const toolIds = tokenize(item.dataset.toolIds);
        const categoryIds = tokenize(item.dataset.categoryIds);

        const matchesType = !selectedType || type === selectedType;
        const matchesLevel = !selectedLevel || level === selectedLevel;
        const matchesStatus = !selectedStatus || status === selectedStatus;
        const matchesTag = !selectedTag || tagIds.has(selectedTag);
        const matchesTool = !selectedTool || toolIds.has(selectedTool);
        const matchesCategory = !selectedCategory || categoryIds.has(selectedCategory);

        const matches = matchesType && matchesLevel && matchesStatus && matchesTag && matchesTool && matchesCategory;
        setHidden(item, !matches);
        if (matches) shown += 1;
      }

      for (const group of groups) {
        const visible = Array.from(group.querySelectorAll<HTMLElement>('[data-knowledge-item]')).some((el) => !el.hidden);
        setHidden(group, !visible);
      }

      if (countEl) {
        countEl.textContent = `Showing ${shown} of ${total}`;
      }
    };

    const reset = () => {
      for (const select of Object.values(selects)) {
        if (select) select.value = '';
      }
    };

    enhanceFilter(root, { onApply: apply, onReset: reset });
  }
};

export const initPortfolioFilters = () => {
  const roots = Array.from(document.querySelectorAll<HTMLElement>('[data-portfolio-filter]'));
  for (const root of roots) {
    const targetSelector = root.getAttribute('data-target');
    if (!targetSelector) continue;

    const container = document.querySelector<HTMLElement>(targetSelector);
    if (!container) continue;

    const items = Array.from(container.querySelectorAll<HTMLElement>('[data-project-item]'));
    const total = items.length;

    const selects: SelectMap = {
      status: root.querySelector<HTMLSelectElement>('[data-filter-status]'),
      tool: root.querySelector<HTMLSelectElement>('[data-filter-tool]'),
      skill: root.querySelector<HTMLSelectElement>('[data-filter-skill]'),
      category: root.querySelector<HTMLSelectElement>('[data-filter-category]'),
      tag: root.querySelector<HTMLSelectElement>('[data-filter-tag]'),
    };

    const countEl = root.querySelector<HTMLElement>('[data-filter-count]');

    const apply = () => {
      const selectedStatus = getSelectValue(selects.status);
      const selectedTool = getSelectValue(selects.tool);
      const selectedSkill = getSelectValue(selects.skill);
      const selectedCategory = getSelectValue(selects.category);
      const selectedTag = getSelectValue(selects.tag);

      let shown = 0;
      for (const item of items) {
        const status = item.dataset.status ?? '';
        const toolIds = tokenize(item.dataset.toolIds);
        const skillIds = tokenize(item.dataset.skillIds);
        const categoryIds = tokenize(item.dataset.categoryIds);
        const tagIds = tokenize(item.dataset.tagIds);

        const matchesStatus = !selectedStatus || status === selectedStatus;
        const matchesTool = !selectedTool || toolIds.has(selectedTool);
        const matchesSkill = !selectedSkill || skillIds.has(selectedSkill);
        const matchesCategory = !selectedCategory || categoryIds.has(selectedCategory);
        const matchesTag = !selectedTag || tagIds.has(selectedTag);

        const matches = matchesStatus && matchesTool && matchesSkill && matchesCategory && matchesTag;
        setHidden(item, !matches);
        if (matches) shown += 1;
      }

      if (countEl) {
        countEl.textContent = `Showing ${shown} of ${total}`;
      }
    };

    const reset = () => {
      for (const select of Object.values(selects)) {
        if (select) select.value = '';
      }
    };

    enhanceFilter(root, { onApply: apply, onReset: reset });
  }
};
