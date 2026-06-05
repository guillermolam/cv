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

    document.querySelectorAll<HTMLElement>('[data-badge-carousel]').forEach((carousel) => {
      const items = Array.from(carousel.querySelectorAll<HTMLElement>('[data-badge-card]'));
      if (items.length < 3) return;

      carousel.classList.add('badge-rack__grid--carousel');
      carousel.setAttribute('tabindex', '0');

      let radius = 220;
      let rotation = 0;
      let isDragging = false;
      let startX = 0;
      let startRotation = 0;
      let lastX = 0;
      let lastT = 0;
      let v = 0;
      let rafId = 0;
      let inertiaRaf = 0;

      const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

      const render = () => {
        rafId = 0;
        const step = 360 / items.length;
        for (let i = 0; i < items.length; i += 1) {
          const angle = rotation + step * i;
          const rad = (angle * Math.PI) / 180;
          const x = Math.sin(rad) * radius;
          const z = Math.cos(rad) * radius;
          const depth = clamp01((z + radius) / (radius * 2));
          const scale = 0.72 + depth * 0.42;
          const opacity = 0.18 + depth * 0.82;
          items[i].style.setProperty('--depth', depth.toFixed(3));
          items[i].style.transform = `translate3d(-50%, -50%, 0) translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${-angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          items[i].style.opacity = opacity.toFixed(3);
          items[i].style.filter = `brightness(${(0.72 + depth * 0.42).toFixed(3)}) saturate(${(0.9 + depth * 0.18).toFixed(3)})`;
          items[i].style.zIndex = String(Math.round(depth * 1000));
          items[i].style.pointerEvents = depth > 0.56 ? 'auto' : 'none';
        }
      };

      const requestRender = () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(render);
      };

      const updateRadius = () => {
        const cardW = items[0]?.getBoundingClientRect().width ?? 180;
        const w = carousel.clientWidth;
        const peek = Math.min(44, cardW * 0.25);
        radius = Math.max(190, Math.round((w + cardW) / 2 - peek));
        requestRender();
      };

      window.addEventListener('resize', updateRadius, { passive: true });
      updateRadius();

      const stopInertia = () => {
        if (inertiaRaf) cancelAnimationFrame(inertiaRaf);
        inertiaRaf = 0;
      };

      const snapToNearest = () => {
        const step = 360 / items.length;
        const target = Math.round(rotation / step) * step;
        const state = { v: rotation };
        gsap.to(state, {
          v: target,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: true,
          onUpdate: () => {
            rotation = state.v;
            requestRender();
          },
        });
      };

      const startInertia = () => {
        stopInertia();
        const friction = 0.92;
        const minV = 0.002;
        const tick = () => {
          rotation += v * 16;
          v *= friction;
          requestRender();
          if (Math.abs(v) < minV) {
            stopInertia();
            snapToNearest();
            return;
          }
          inertiaRaf = window.requestAnimationFrame(tick);
        };
        inertiaRaf = window.requestAnimationFrame(tick);
      };

      carousel.addEventListener('pointerdown', (e) => {
        if (!(e instanceof PointerEvent)) return;
        stopInertia();
        isDragging = true;
        startX = e.clientX;
        startRotation = rotation;
        lastX = e.clientX;
        lastT = performance.now();
        v = 0;
        carousel.setPointerCapture(e.pointerId);
      });

      carousel.addEventListener('pointermove', (e) => {
        if (!isDragging || !(e instanceof PointerEvent)) return;
        const dx = e.clientX - startX;
        const now = performance.now();
        const dt = Math.max(16, now - lastT);
        const sensitivity = 190 / Math.max(320, carousel.clientWidth);
        v = ((e.clientX - lastX) / dt) * sensitivity;
        lastX = e.clientX;
        lastT = now;
        rotation = startRotation + dx * sensitivity;
        requestRender();
      });

      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        startInertia();
      };

      carousel.addEventListener('pointerup', endDrag);
      carousel.addEventListener('pointercancel', endDrag);
      carousel.addEventListener('lostpointercapture', endDrag);

      carousel.addEventListener('keydown', (e) => {
        if (!(e instanceof KeyboardEvent)) return;
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        e.preventDefault();
        stopInertia();
        const step = 360 / items.length;
        rotation += e.key === 'ArrowLeft' ? step : -step;
        snapToNearest();
      });
    });
  }

  if (!prefersReduced) {
    const badgeCarousel = document.querySelector<HTMLElement>('ul.whoami-badge-row');
    if (badgeCarousel) {
      const items = Array.from(badgeCarousel.querySelectorAll<HTMLElement>('li.whoami-badge-item'));
      if (items.length >= 3) {
        badgeCarousel.classList.add('whoami-badge-carousel--3d');
        badgeCarousel.setAttribute('tabindex', '0');
        badgeCarousel.style.setProperty('--badge-count', String(items.length));
        let radius = Math.max(220, Math.round(items[0]?.getBoundingClientRect().width * 1.35));
        badgeCarousel.style.setProperty('--carousel-radius', `${radius}px`);

      let rotation = 0;
      let isDragging = false;
      let startX = 0;
      let startRotation = 0;
      let lastX = 0;
      let lastT = 0;
      let velocity = 0;
      let rafId = 0;

      const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

      const render = () => {
        rafId = 0;
        const step = 360 / items.length;
        for (let i = 0; i < items.length; i += 1) {
          const angle = rotation + step * i;
          const rad = (angle * Math.PI) / 180;
          const x = Math.sin(rad) * radius;
          const z = Math.cos(rad) * radius;
          const depth = clamp01((z + radius) / (radius * 2));
          const scale = 0.82 + depth * 0.26;
          const opacity = 0.2 + depth * 0.8;
          items[i].style.transform = `translate3d(-50%, -50%, 0) translate3d(${x.toFixed(2)}px, 0, ${z.toFixed(2)}px) rotateY(${-angle.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
          items[i].style.opacity = opacity.toFixed(3);
          items[i].style.filter = `brightness(${(0.78 + depth * 0.34).toFixed(3)}) saturate(${(0.9 + depth * 0.18).toFixed(3)})`;
          items[i].style.zIndex = String(Math.round(depth * 1000));
          items[i].style.pointerEvents = depth > 0.48 ? 'auto' : 'none';
        }
      };

      const requestRender = () => {
        if (rafId) return;
        rafId = window.requestAnimationFrame(render);
      };

      render();

      const updateRadius = () => {
        radius = Math.max(220, Math.round(items[0]?.getBoundingClientRect().width * 1.35));
        badgeCarousel.style.setProperty('--carousel-radius', `${radius}px`);
        requestRender();
      };

      window.addEventListener('resize', updateRadius, { passive: true });

      const snapToNearest = () => {
        const step = 360 / items.length;
        const target = Math.round(rotation / step) * step;
        if (prefersReduced) {
          rotation = target;
          requestRender();
          return;
        }
        const state = { v: rotation };
        gsap.to(state, {
          v: target,
          duration: 0.6,
          ease: 'power3.out',
          overwrite: true,
          onUpdate: () => {
            rotation = state.v;
            requestRender();
          },
        });
      };

      badgeCarousel.addEventListener('pointerdown', (e) => {
        if (!(e instanceof PointerEvent)) return;
        isDragging = true;
        startX = e.clientX;
        startRotation = rotation;
        lastX = e.clientX;
        lastT = performance.now();
        velocity = 0;
        badgeCarousel.setPointerCapture(e.pointerId);
      });

      badgeCarousel.addEventListener('pointermove', (e) => {
        if (!isDragging || !(e instanceof PointerEvent)) return;
        const dx = e.clientX - startX;
        const now = performance.now();
        const dt = Math.max(16, now - lastT);
        velocity = (e.clientX - lastX) / dt;
        lastX = e.clientX;
        lastT = now;
        const sensitivity = 180 / Math.max(320, badgeCarousel.clientWidth);
        rotation = startRotation + dx * sensitivity;
        requestRender();
      });

      const endDrag = () => {
        if (!isDragging) return;
        isDragging = false;
        if (!prefersReduced) {
          rotation += velocity * 240;
        }
        snapToNearest();
      };

      badgeCarousel.addEventListener('pointerup', endDrag);
      badgeCarousel.addEventListener('pointercancel', endDrag);
      badgeCarousel.addEventListener('lostpointercapture', endDrag);

        badgeCarousel.addEventListener('keydown', (e) => {
          if (!(e instanceof KeyboardEvent)) return;
          if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
          e.preventDefault();
          const step = 360 / items.length;
          rotation += e.key === 'ArrowLeft' ? step : -step;
          snapToNearest();
        });
      }
    }
  }
}
