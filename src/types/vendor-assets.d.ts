declare global {
  interface Window {
    __ALPINE_DEVTOOLS?: unknown;
    __NANOSTORES?: unknown;
    __THREE_DEVTOOLS?: unknown;
    __PIXI_DEVTOOLS?: unknown;
    __GSAP_DEVTOOLS?: unknown;
    __DOM_DEVTOOLS?: unknown;
    __DEVTOOLS?: unknown;
    __THREE_RENDER_CORES?: unknown[];
    __PIXI_RENDERERS?: unknown[];
    alpine?: () => unknown;
    stores?: () => unknown;
    three?: () => unknown;
    pixi?: () => unknown;
    gsap?: () => unknown;
    perf?: () => unknown;
    memory?: () => unknown;
    devtools?: () => unknown;
  }
}

export {};
