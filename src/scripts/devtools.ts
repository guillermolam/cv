type AnyRecord = Record<string, unknown>;

type NanostoreLike<T = unknown> = {
  get: () => T;
  set?: (value: T) => void;
  subscribe: (listener: (value: T) => void) => () => void;
};

type ThreeCoreEntry = {
  canvas: HTMLCanvasElement;
  renderer: {
    info?: AnyRecord;
  };
  scene?: {
    children?: unknown[];
    traverse?: (cb: (obj: unknown) => void) => void;
    add?: (obj: unknown) => void;
  };
  camera?: unknown;
  label?: string;
  createdAt?: number;
};

type PixiEntry = {
  canvas?: HTMLCanvasElement;
  host?: HTMLElement;
  renderer?: {
    render?: (stage: unknown) => void;
    resize?: (w: number, h: number) => void;
  };
  stage?: unknown;
  label?: string;
  createdAt?: number;
};

const getGlobalArray = <T>(key: string): T[] => {
  const w = window as unknown as AnyRecord;
  const current = w[key];
  if (Array.isArray(current)) return current as T[];
  const next: T[] = [];
  w[key] = next;
  return next;
};

const setIfAbsent = <T>(key: string, value: T): T => {
  const w = window as unknown as AnyRecord;
  if (w[key] !== undefined) return w[key] as T;
  w[key] = value as unknown as AnyRecord;
  return value;
};

export async function initDevtoolsSuite(): Promise<void> {
  if (!import.meta.env.DEV) return;
  if (typeof window === 'undefined') return;

  const w = window as unknown as AnyRecord;

  setIfAbsent('__ALPINE_DEVTOOLS', {
    getAlpine: () => (w['Alpine'] as AnyRecord | undefined) ?? null,
    status: () => {
      const Alpine = (w['Alpine'] as AnyRecord | undefined) ?? null;
      const version =
        Alpine && typeof Alpine['version'] === 'string'
          ? (Alpine['version'] as string)
          : null;
      const xDataCount = document.querySelectorAll('[x-data]').length;
      return { available: Boolean(Alpine), version, xDataCount };
    },
    findXData: (limit = 10) =>
      Array.from(document.querySelectorAll<HTMLElement>('[x-data]'))
        .slice(0, Math.max(0, limit))
        .map((el) => ({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className || null,
          xData: el.getAttribute('x-data') || null,
        })),
  });

  const stores = await import('../stores/control-room');
  const cardTree = await import('../stores/card-tree');

  const nanostores = {
    $activeSection: stores.$activeSection as NanostoreLike,
    $lang: stores.$lang as NanostoreLike,
    $audioMuted: stores.$audioMuted as NanostoreLike,
    $reducedMotion: stores.$reducedMotion as NanostoreLike,
    $webglSupported: stores.$webglSupported as NanostoreLike,
    $webglEnabled: stores.$webglEnabled as NanostoreLike,
    $cardTreeData: cardTree.$cardTreeData as NanostoreLike,
  } as const;

  setIfAbsent('__NANOSTORES', {
    ...nanostores,
    inspect: () => ({
      activeSection: nanostores.$activeSection.get(),
      lang: nanostores.$lang.get(),
      audioMuted: nanostores.$audioMuted.get(),
      reducedMotion: nanostores.$reducedMotion.get(),
      webglSupported: nanostores.$webglSupported.get(),
      webglEnabled: nanostores.$webglEnabled.get(),
      cardTreeData: nanostores.$cardTreeData.get(),
    }),
    subscribe: (
      storeName: keyof typeof nanostores,
      cb: (value: unknown) => void,
    ) => {
      const store = nanostores[storeName] as NanostoreLike | undefined;
      if (!store) return null;
      return store.subscribe((value) => cb(value));
    },
    set: (storeName: keyof typeof nanostores, value: unknown) => {
      const store = nanostores[storeName] as NanostoreLike | undefined;
      if (!store?.set) return false;
      store.set(value);
      return true;
    },
  });

  setIfAbsent('__DOM_DEVTOOLS', {
    findContainment: (limit = 50) => {
      const matches: Array<{
        tag: string;
        id: string | null;
        className: string | null;
        contain: string;
      }> = [];
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>('*'),
      )) {
        const contain = getComputedStyle(el).contain;
        if (!contain || contain === 'none') continue;
        matches.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className || null,
          contain,
        });
        if (matches.length >= Math.max(0, limit)) break;
      }
      return matches;
    },
    findWillChange: (limit = 50) => {
      const matches: Array<{
        tag: string;
        id: string | null;
        className: string | null;
        willChange: string;
      }> = [];
      for (const el of Array.from(
        document.querySelectorAll<HTMLElement>('*'),
      )) {
        const willChange = getComputedStyle(el).willChange;
        if (!willChange || willChange === 'auto') continue;
        matches.push({
          tag: el.tagName.toLowerCase(),
          id: el.id || null,
          className: el.className || null,
          willChange,
        });
        if (matches.length >= Math.max(0, limit)) break;
      }
      return matches;
    },
    getMemoryEstimate: () => {
      const perf = performance as unknown as {
        memory?: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };
      if (!perf.memory) return null;
      return {
        usedJSHeapSizeMB:
          Math.round((perf.memory.usedJSHeapSize / 1048576) * 100) / 100,
        totalJSHeapSizeMB:
          Math.round((perf.memory.totalJSHeapSize / 1048576) * 100) / 100,
        jsHeapSizeLimitMB:
          Math.round((perf.memory.jsHeapSizeLimit / 1048576) * 100) / 100,
      };
    },
    getPerformanceMarks: () =>
      performance.getEntriesByType('mark').map((m) => ({
        name: m.name,
        time: Math.round(m.startTime * 100) / 100,
      })),
    getPerformanceMeasures: () =>
      performance.getEntriesByType('measure').map((m) => ({
        name: m.name,
        duration: Math.round((m as PerformanceMeasure).duration * 100) / 100,
      })),
  });

  const threeCores = getGlobalArray<ThreeCoreEntry>('__THREE_RENDER_CORES');
  setIfAbsent('__THREE_DEVTOOLS', {
    list: () =>
      threeCores.map((entry, index) => ({
        index,
        label: entry.label ?? null,
        canvas: entry.canvas
          ? {
              w: entry.canvas.width,
              h: entry.canvas.height,
              className: entry.canvas.className || null,
            }
          : null,
        children: Array.isArray(entry.scene?.children)
          ? entry.scene!.children!.length
          : null,
        createdAt: entry.createdAt ?? null,
      })),
    getStats: (index = 0) => {
      const entry = threeCores[index];
      if (!entry) return null;
      const info = entry.renderer?.info as AnyRecord | undefined;
      return info ?? null;
    },
    toggleWireframe: async (index = 0) => {
      const entry = threeCores[index];
      if (!entry?.scene?.traverse) return false;
      const { Mesh } = await import('three');
      entry.scene.traverse((obj: unknown) => {
        if (!(obj instanceof Mesh)) return;
        const mat = (obj as unknown as { material?: unknown }).material;
        if (!mat) return;
        if (Array.isArray(mat)) {
          for (const m of mat) {
            const anyMat = m as AnyRecord;
            if (typeof anyMat['wireframe'] === 'boolean')
              anyMat['wireframe'] = !anyMat['wireframe'];
          }
        } else {
          const anyMat = mat as AnyRecord;
          if (typeof anyMat['wireframe'] === 'boolean')
            anyMat['wireframe'] = !anyMat['wireframe'];
        }
      });
      return true;
    },
    showBoundingBoxes: async (index = 0) => {
      const entry = threeCores[index];
      if (!entry?.scene?.traverse || !entry.scene.add) return false;
      const { Mesh, BoxHelper } = await import('three');
      entry.scene.traverse((obj: unknown) => {
        if (!(obj instanceof Mesh)) return;
        entry.scene?.add?.(new BoxHelper(obj, 0x00ff00));
      });
      return true;
    },
  });

  const pixiEntries = getGlobalArray<PixiEntry>('__PIXI_RENDERERS');
  setIfAbsent('__PIXI_DEVTOOLS', {
    list: () =>
      pixiEntries.map((entry, index) => ({
        index,
        label: entry.label ?? null,
        host: entry.host
          ? {
              tag: entry.host.tagName.toLowerCase(),
              className: entry.host.className || null,
            }
          : null,
        canvas: entry.canvas
          ? {
              w: entry.canvas.width,
              h: entry.canvas.height,
              className: entry.canvas.className || null,
            }
          : null,
        createdAt: entry.createdAt ?? null,
      })),
  });

  const gsapMod = await import('gsap');
  const gsap =
    (gsapMod as unknown as { default?: unknown }).default ??
    (gsapMod as unknown);
  const getGsapTimelines = (): unknown[] => {
    const globalTimeline = (gsap as AnyRecord)['globalTimeline'] as
      | AnyRecord
      | undefined;
    const getChildren = globalTimeline?.['getChildren'];
    if (typeof getChildren !== 'function') return [];
    const children = getChildren.call(globalTimeline, true);
    return Array.isArray(children) ? children : [];
  };

  const getGsapStats = () => {
    const timelines = getGsapTimelines();
    const active = timelines.filter((tl) => {
      const paused = (tl as AnyRecord)['paused'];
      return typeof paused === 'function' ? !paused.call(tl) : true;
    }).length;
    return { totalTimelines: timelines.length, active };
  };

  const pauseAllGsap = () => {
    const timelines = getGsapTimelines();
    for (const tl of timelines) {
      const pause = (tl as AnyRecord)['pause'];
      if (typeof pause === 'function') pause.call(tl);
    }
  };

  const playAllGsap = () => {
    const timelines = getGsapTimelines();
    for (const tl of timelines) {
      const play = (tl as AnyRecord)['play'];
      if (typeof play === 'function') play.call(tl);
    }
  };

  const resetAllGsap = () => {
    const timelines = getGsapTimelines();
    for (const tl of timelines) {
      const seek = (tl as AnyRecord)['seek'];
      if (typeof seek === 'function') seek.call(tl, 0);
    }
  };

  setIfAbsent('__GSAP_DEVTOOLS', {
    getTimelines: getGsapTimelines,
    getStats: getGsapStats,
    pauseAll: pauseAllGsap,
    playAll: playAllGsap,
    resetAll: resetAllGsap,
  });

  const domTools = w['__DOM_DEVTOOLS'] as AnyRecord | undefined;
  const threeTools = w['__THREE_DEVTOOLS'] as AnyRecord | undefined;
  const pixiTools = w['__PIXI_DEVTOOLS'] as AnyRecord | undefined;
  const nanostoresTools = w['__NANOSTORES'] as AnyRecord | undefined;

  setIfAbsent('__DEVTOOLS', {
    alpine: w['__ALPINE_DEVTOOLS'],
    nanostores: w['__NANOSTORES'],
    three: w['__THREE_DEVTOOLS'],
    pixi: w['__PIXI_DEVTOOLS'],
    gsap: w['__GSAP_DEVTOOLS'],
    dom: w['__DOM_DEVTOOLS'],
    getStatus: () => ({
      alpine: Boolean(w['__ALPINE_DEVTOOLS']),
      nanostores: Boolean(w['__NANOSTORES']),
      three: Boolean(w['__THREE_DEVTOOLS']),
      pixi: Boolean(w['__PIXI_DEVTOOLS']),
      gsap: Boolean(w['__GSAP_DEVTOOLS']),
      dom: Boolean(w['__DOM_DEVTOOLS']),
    }),
    snapshot: () => {
      const getMemoryEstimate = domTools?.['getMemoryEstimate'];
      const getMarks = domTools?.['getPerformanceMarks'];
      const getMeasures = domTools?.['getPerformanceMeasures'];
      const getThreeStats = threeTools?.['getStats'];
      const getStoreSnapshot = nanostoresTools?.['inspect'];

      return {
        memory:
          typeof getMemoryEstimate === 'function'
            ? getMemoryEstimate.call(domTools)
            : null,
        performance: {
          marks: typeof getMarks === 'function' ? getMarks.call(domTools) : [],
          measures:
            typeof getMeasures === 'function' ? getMeasures.call(domTools) : [],
        },
        three:
          typeof getThreeStats === 'function'
            ? getThreeStats.call(threeTools)
            : null,
        gsap: getGsapStats(),
        stores:
          typeof getStoreSnapshot === 'function'
            ? getStoreSnapshot.call(nanostoresTools)
            : null,
        pixi:
          typeof pixiTools?.['list'] === 'function'
            ? pixiTools['list'].call(pixiTools)
            : null,
      };
    },
  });

  setIfAbsent('alpine', () => w['__ALPINE_DEVTOOLS']);
  setIfAbsent('stores', () => {
    const fn = nanostoresTools?.['inspect'];
    return typeof fn === 'function' ? fn.call(nanostoresTools) : null;
  });
  setIfAbsent('three', () => {
    const fn = threeTools?.['list'];
    return typeof fn === 'function' ? fn.call(threeTools) : null;
  });
  setIfAbsent('pixi', () => {
    const fn = pixiTools?.['list'];
    return typeof fn === 'function' ? fn.call(pixiTools) : null;
  });
  setIfAbsent('gsap', () => getGsapStats());
  setIfAbsent('perf', () => {
    const fn = domTools?.['getPerformanceMeasures'];
    return typeof fn === 'function' ? fn.call(domTools) : [];
  });
  setIfAbsent('memory', () => {
    const fn = domTools?.['getMemoryEstimate'];
    return typeof fn === 'function' ? fn.call(domTools) : null;
  });
  setIfAbsent('devtools', () => {
    const tools = w['__DEVTOOLS'] as AnyRecord | undefined;
    const fn = tools?.['snapshot'];
    return typeof fn === 'function' ? fn.call(tools) : null;
  });
}
