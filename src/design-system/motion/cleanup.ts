export type CleanupFn = () => void;

export const createCleanupStack = () => {
  const fns: CleanupFn[] = [];
  let ran = false;

  const run = () => {
    if (ran) return;
    ran = true;
    while (fns.length > 0) {
      const fn = fns.pop();
      try {
        fn?.();
      } catch {
      }
    }
  };

  const add = (fn: CleanupFn) => {
    if (ran) {
      try {
        fn();
      } catch {
      }
      return;
    }
    fns.push(fn);
  };

  return {
    add,
    run,
    get size() {
      return fns.length;
    },
  };
};

export const listen = (
  target: EventTarget | null | undefined,
  eventName: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions | boolean,
) => {
  if (!target || typeof target.addEventListener !== 'function') return () => {};
  target.addEventListener(eventName, handler, options);
  return () => {
    try {
      target.removeEventListener(eventName, handler, options);
    } catch {
    }
  };
};

export const raf = (callback: FrameRequestCallback) => {
  if (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') return () => {};
  const id = window.requestAnimationFrame(callback);
  return () => {
    try {
      window.cancelAnimationFrame(id);
    } catch {
    }
  };
};
