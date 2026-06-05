/** Client-side GSAP animation for the Whoami / Operator Profile page. */
export default async function initWhoamiMotion(): Promise<void> {
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const {
    gsap, ScrollTrigger, SplitText, Flip, Observer,
  } = await import('../lib/gsap-plugins');

  // ─── Name SplitText entrance ──────────────────────────────────────────────
  const nameEl = document.querySelector<HTMLElement>('.whoami-name');
  if (nameEl) {
    const split = new SplitText(nameEl, { type: 'chars,words' });
    gsap.from(split.chars, {
      opacity: 0,
      y: 14,
      rotateX: -40,
      transformOrigin: '50% 50% -20px',
      stagger: 0.022,
      duration: 0.55,
      ease: 'ds.cinematicReveal',
      delay: 0.12,
      onComplete: () => split.revert(),
    });
  }

  // ─── Role line TextPlugin scramble-like reveal ───────────────────────────
  const roleEl = document.querySelector<HTMLElement>('.whoami-role');
  if (roleEl) {
    gsap.from(roleEl, {
      opacity: 0,
      y: 6,
      duration: 0.4,
      ease: 'ds.softOut',
      delay: 0.45,
    });
  }

  // ─── CTAs stagger ─────────────────────────────────────────────────────────
  const ctaBtns = document.querySelectorAll<HTMLElement>('.whoami-ctas > *');
  if (ctaBtns.length) {
    gsap.from(ctaBtns, {
      opacity: 0,
      y: 8,
      scale: 0.96,
      stagger: 0.08,
      duration: 0.4,
      ease: 'ds.softOut',
      delay: 0.58,
    });
  }

  // ─── Badge rack items ─────────────────────────────────────────────────────
  const badges = document.querySelectorAll<HTMLElement>('.whoami-badge');
  if (badges.length) {
    gsap.from(badges, {
      opacity: 0,
      scale: 0.88,
      stagger: 0.06,
      duration: 0.32,
      ease: 'back.out(1.4)',
      delay: 0.72,
    });
  }

  // ─── Stat rows (right panel) — scroll-aware entrance ─────────────────────
  const statRows = document.querySelectorAll<HTMLElement>('.stat-row');
  if (statRows.length) {
    gsap.from(statRows, {
      opacity: 0,
      x: 12,
      stagger: 0.06,
      duration: 0.38,
      ease: 'ds.softOut',
      delay: 0.3,
    });
  }

  // ─── Radar chart polygon draw via stroke-dashoffset ───────────────────────
  const polygon = document.querySelector<SVGPolygonElement>('.whoami-radar-polygon');
  if (polygon) {
    const len = (polygon as SVGGeometryElement).getTotalLength?.() ?? 320;
    gsap.fromTo(polygon,
      { strokeDasharray: len, strokeDashoffset: len, opacity: 0.05 },
      { strokeDashoffset: 0, opacity: 1, duration: 1.0, ease: 'power2.inOut', delay: 0.6 },
    );
  }

  // ─── ScrollTrigger reveals for profile subview cards ─────────────────────
  ScrollTrigger.batch('.whoami-item', {
    start: 'top 88%',
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        opacity: 0,
        y: 18,
        scale: 0.98,
        stagger: 0.08,
        duration: 0.42,
        ease: 'ds.softOut',
      });
    },
  });

  // ─── ProfileSubview header reveals ────────────────────────────────────────
  ScrollTrigger.batch('[data-whoami-subview-header]', {
    start: 'top 90%',
    once: true,
    onEnter: (batch) => {
      gsap.from(batch, {
        opacity: 0,
        x: -12,
        duration: 0.36,
        stagger: 0.1,
        ease: 'ds.softOut',
      });
    },
  });

  // ─── Observer: subtle shell parallax on pointer move ─────────────────────
  const shell = document.querySelector<HTMLElement>('.whoami-shell');
  const canUsePointerParallax = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (shell && canUsePointerParallax) {
    Observer.create({
      target: shell,
      type: 'pointer',
      onMove: (self) => {
        const rect = shell.getBoundingClientRect();
        if (typeof self.x !== 'number' || typeof self.y !== 'number') return;
        const nx = ((self.x - rect.left) / rect.width  - 0.5) * 2;
        const ny = ((self.y - rect.top)  / rect.height - 0.5) * 2;
        gsap.to(shell, {
          rotateY:  nx * 1.4,
          rotateX: -ny * 0.9,
          duration: 0.6,
          ease: 'power2.out',
          transformOrigin: 'center center',
          transformPerspective: 1200,
          overwrite: 'auto',
        });
      },
    });

    shell.addEventListener('pointerleave', () => {
      gsap.to(shell, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    });
  }

  // ─── Flip: smooth active key highlight transition ─────────────────────────
  const keyBtns = document.querySelectorAll<HTMLElement>('[data-whoami-key]');
  if (keyBtns.length) {
    keyBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const state = Flip.getState('[data-whoami-key].active');
        keyBtns.forEach((k) => k.classList.remove('active'));
        btn.classList.add('active');
        Flip.from(state, {
          duration: 0.3,
          ease: 'ds.softOut',
          absolute: true,
          prune: true,
        });
      });
    });
  }
}
