const readMsToken = (value: string): number => {
  const trimmed = value.trim();
  const n = Number.parseFloat(trimmed);
  if (!Number.isFinite(n)) return 0;
  if (trimmed.endsWith('ms')) return n;
  if (trimmed.endsWith('s')) return n * 1000;
  return n;
};

const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
};

const onceVisible = (
  elements: Element[],
  onEnter: (entered: Element[]) => void,
  options?: IntersectionObserverInit
) => {
  const pending = new Set(elements);
  const observer = new IntersectionObserver((entries) => {
    const entered: Element[] = [];
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      if (!pending.has(entry.target)) continue;
      pending.delete(entry.target);
      observer.unobserve(entry.target);
      entered.push(entry.target);
    }
    if (entered.length > 0) onEnter(entered);
    if (pending.size === 0) observer.disconnect();
  }, options);

  for (const el of pending) observer.observe(el);
};

export default async function initHomeMotion(): Promise<void> {
  if (typeof window === 'undefined') return;
  if (prefersReducedMotion()) return;

  const root = document.documentElement;
  const styles = window.getComputedStyle(root);

  const motionFastMs = readMsToken(styles.getPropertyValue('--motion-fast'));
  const motionStandardMs = readMsToken(styles.getPropertyValue('--motion-standard'));
  const motionEmphasisMs = readMsToken(styles.getPropertyValue('--motion-emphasis'));
  const motionStaggerMs = readMsToken(styles.getPropertyValue('--motion-stagger')) || 80;

  const { default: gsap } = await import('gsap');
  const easeStandard = 'power2.out';
  const easeEmphasis = 'power2.out';

  const heroItems = [
    ...Array.from(document.querySelectorAll<HTMLElement>('.hero-eyebrow')),
    ...Array.from(document.querySelectorAll<HTMLElement>('.hero-title')),
    ...Array.from(document.querySelectorAll<HTMLElement>('.hero-subtitle')),
    ...Array.from(document.querySelectorAll<HTMLElement>('[data-operator-id]')),
    ...Array.from(document.querySelectorAll<HTMLElement>('.hero-ctas')),
    ...Array.from(document.querySelectorAll<HTMLElement>('.station-chips')),
  ];

  const rail = document.querySelector<HTMLElement>('.briefing-block');
  const hasHero = heroItems.length > 0;

  if (hasHero) {
    gsap.set(heroItems, { autoAlpha: 0, y: 10 });
  }
  if (rail) {
    gsap.set(rail, { autoAlpha: 0, y: 10 });
  }

  if (hasHero || rail) {
    const tl = gsap.timeline({
      defaults: {
        duration: motionStandardMs / 1000,
        ease: easeEmphasis,
      },
    });

    if (hasHero) {
      tl.to(heroItems, {
        autoAlpha: 1,
        y: 0,
        stagger: motionStaggerMs / 1000,
      });
    }

    if (rail) {
      tl.to(
        rail,
        {
          autoAlpha: 1,
          y: 0,
          duration: motionEmphasisMs / 1000,
          ease: easeStandard,
        },
        hasHero ? '-=0.12' : 0
      );
    }
  }

  const hoverLift = (selector: string, y = -1) => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(selector));
    for (const el of targets) {
      const toY = gsap.quickTo(el, 'y', {
        duration: motionFastMs / 1000,
        ease: easeStandard,
      });

      el.addEventListener('pointerenter', () => toY(y));
      el.addEventListener('pointerleave', () => toY(0));
      el.addEventListener('focusin', () => toY(y));
      el.addEventListener('focusout', () => toY(0));
    }
  };

  hoverLift('.button', -1);
  hoverLift('.nav a', -1);
  hoverLift('.station-chip', -1);
  hoverLift('.station-category', -1);
  hoverLift('.social-link', -1);
  hoverLift('.station-overlay-action', -1);

  const tableRows = Array.from(document.querySelectorAll<HTMLElement>('.topology-table tbody tr'));
  if (tableRows.length > 0) {
    gsap.from(tableRows, {
      autoAlpha: 0,
      y: 8,
      duration: motionStandardMs / 1000,
      ease: easeStandard,
      stagger: Math.min(0.03, motionStaggerMs / 1000),
    });
  }

  const stationCards = Array.from(document.querySelectorAll<HTMLElement>('.station'));
  if (stationCards.length > 0) {
    gsap.set(stationCards, { autoAlpha: 1 });
    onceVisible(
      stationCards,
      (entered) => {
        gsap.from(entered, {
          autoAlpha: 0,
          y: 10,
          duration: motionStandardMs / 1000,
          ease: easeStandard,
          stagger: 0.06,
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.2 }
    );
  }
}
