let initialized = false;

function getReducedMotion(): MediaQueryList {
  return window.matchMedia('(prefers-reduced-motion: reduce)');
}

export default async function initTexturedButtons(): Promise<void> {
  if (initialized) return;
  initialized = true;

  const reducedMotion = getReducedMotion();
  const wrappers = Array.from(document.querySelectorAll<HTMLElement>('[data-tbtn-wrap]'));

  const setTipOpen = (wrap: HTMLElement, open: boolean) => {
    if (open) wrap.dataset.tipOpen = 'true';
    else delete wrap.dataset.tipOpen;
  };

  if (reducedMotion.matches) {
    for (const wrap of wrappers) {
      const button = wrap.querySelector<HTMLElement>('[data-tbtn]');
      if (!button) continue;

      button.addEventListener('pointerenter', () => setTipOpen(wrap, true));
      button.addEventListener('pointerleave', () => setTipOpen(wrap, false));
      button.addEventListener('focusin', () => setTipOpen(wrap, true));
      button.addEventListener('focusout', () => setTipOpen(wrap, false));
    }
    return;
  }

  const gsapModule = await import('gsap');
  const gsap = gsapModule.gsap ?? gsapModule.default ?? gsapModule;

  for (const wrap of wrappers) {
    const button = wrap.querySelector<HTMLElement>('[data-tbtn]');
    if (!button) continue;

    const hoverIn = () => {
      setTipOpen(wrap, true);
      gsap.to(button, {
        y: -1,
        duration: 0.14,
        ease: 'power2.out',
      });
      gsap.to(button, {
        '--tbtn-glow': 1,
        duration: 0.22,
        ease: 'power2.out',
      });
    };

    const hoverOut = () => {
      setTipOpen(wrap, false);
      gsap.to(button, {
        y: 0,
        duration: 0.16,
        ease: 'power2.out',
      });
      gsap.to(button, {
        '--tbtn-glow': 0,
        duration: 0.22,
        ease: 'power2.out',
      });
    };

    const pressIn = () => {
      gsap.to(button, {
        y: 2,
        scale: 0.985,
        duration: 0.08,
        ease: 'power2.out',
      });
    };

    const pressOut = () => {
      gsap.to(button, {
        y: button.matches(':hover') ? -1 : 0,
        scale: 1,
        duration: 0.12,
        ease: 'power2.out',
      });
    };

    button.addEventListener('pointerenter', hoverIn);
    button.addEventListener('pointerleave', hoverOut);
    button.addEventListener('focusin', hoverIn);
    button.addEventListener('focusout', hoverOut);
    button.addEventListener('pointerdown', pressIn);
    button.addEventListener('pointerup', pressOut);
    button.addEventListener('pointercancel', pressOut);
  }
}
