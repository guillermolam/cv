/** Client-side GSAP animation for the Whoami / Operator Profile page. */
export default async function initWhoamiMotion(): Promise<void> {
  if (typeof window === 'undefined') return;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const {
    gsap, ScrollTrigger, SplitText, Flip, Observer,
  } = await import('../lib/gsap-plugins');

  if (!prefersReduced) {
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

    // ─── Badge gallery: CSS 3D stage + GSAP multi-step reveal ───────────────
    const badgeGalleries = document.querySelectorAll<HTMLElement>('[data-badge-gallery]');
    badgeGalleries.forEach((gallery) => {
      const animateActiveBadge = () => {
        const slide = gallery.querySelector<HTMLElement>('[data-badge-slide].is-active');
        if (!slide) return;

        const orbit = slide.querySelector<HTMLElement>('.whoami-badge-orbit');
        const badgeArt = slide.querySelector<HTMLElement>('.whoami-badge-art');
        const badgeImage = slide.querySelector<HTMLElement>('.whoami-badge-image');
        const copy = slide.querySelector<HTMLElement>('.whoami-badge-copy');
        const kicker = slide.querySelector<HTMLElement>('.whoami-badge-kicker');
        const title = slide.querySelector<HTMLElement>('.whoami-badge-copy h3');
        const detail = slide.querySelector<HTMLElement>('[data-badge-detail]');
        const detailText = detail?.dataset.text ?? detail?.textContent ?? '';

        if (detail) detail.textContent = '';

        gsap.killTweensOf([orbit, badgeArt, badgeImage, copy, kicker, title, detail].filter(Boolean));
        gsap.timeline({ defaults: { ease: 'ds.cinematicReveal' } })
          .fromTo(orbit, { opacity: 0, rotateX: 72, scale: 0.72 }, { opacity: 1, rotateX: 62, scale: 1, duration: 0.42 }, 0)
          .fromTo(badgeArt, { opacity: 0, y: 16, rotateY: -18, rotateX: 12, scale: 0.82 }, {
            opacity: 1,
            y: 0,
            rotateY: 0,
            rotateX: 0,
            scale: 1,
            duration: 0.66,
          }, 0.06)
          .fromTo(badgeImage, { filter: 'brightness(1.25) saturate(1.25)' }, {
            filter: 'brightness(1) saturate(1)',
            duration: 0.5,
          }, 0.28)
          .fromTo(copy, { opacity: 0, y: 12, filter: 'blur(8px)' }, {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 0.28,
          }, 0.5)
          .fromTo([kicker, title].filter(Boolean), { opacity: 0, y: 8 }, {
            opacity: 1,
            y: 0,
            duration: 0.22,
            stagger: 0.055,
          }, 0.58);

        if (detail && detailText) {
          gsap.to(detail, {
            text: { value: detailText },
            duration: Math.min(1.7, Math.max(0.65, detailText.length * 0.014)),
            ease: 'none',
            delay: 0.72,
          });
        }
      };

      animateActiveBadge();
      gallery.addEventListener('badge-gallery:change', animateActiveBadge);
    });

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
    const keyBtns = document.querySelectorAll<HTMLElement>('[data-whoami-keys] [data-whoami-key]');
    if (keyBtns.length) {
      keyBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const state = Flip.getState('[data-whoami-keys] [data-whoami-key].active');
          requestAnimationFrame(() => {
            Flip.from(state, {
              duration: 0.3,
              ease: 'ds.softOut',
              absolute: true,
              prune: true,
            });
          });
        });
      });
    }
  }
}
