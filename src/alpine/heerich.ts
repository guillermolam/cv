type AlpineLike = {
  data: (name: string, callback: () => unknown) => void;
};

/**
 * Alpine.data('heerichScene', ...) — interactive voxel scene.
 *
 * Progressive enhancement: the build-time SVG is already in the DOM (no-JS
 * baseline). On first interaction this lazily imports heerich + presets,
 * rebuilds the scene, and re-renders `toSVG()` as the user drags to rotate the
 * oblique camera. Silent/static under reduced motion.
 */
export function registerHeerichComponents(alpine: AlpineLike) {
  alpine.data('heerichScene', () => ({
    angle: 45,
    dragging: false,
    lastX: 0,
    scene: null as import('heerich').Heerich | null,
    stage: null as HTMLElement | null,
    reduced: false,

    async init(this: any) {
      this.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const el = this.$el as HTMLElement;
      this.stage = el.querySelector<HTMLElement>('[data-heerich-stage]');
      this.angle = Number(el.dataset['angle'] ?? '45');

      if (this.reduced) return; // keep the static build-time SVG

      const preset = el.dataset['heerichScene'] as import('../lib/heerich/presets').HeerichPreset;
      const tile = Number(el.dataset['tile'] ?? '28');
      const { buildScene } = await import('../lib/heerich/presets');
      this.scene = buildScene(preset, { tile, camera: { type: 'oblique', angle: this.angle, distance: 15 } });

      el.addEventListener('pointerdown', (e: PointerEvent) => this.onDown(e));
      window.addEventListener('pointermove', (e: PointerEvent) => this.onMove(e));
      window.addEventListener('pointerup', () => this.onUp());
      el.style.cursor = 'grab';
    },

    onDown(this: any, e: PointerEvent) {
      this.dragging = true;
      this.lastX = e.clientX;
      (this.$el as HTMLElement).style.cursor = 'grabbing';
    },

    onMove(this: any, e: PointerEvent) {
      if (!this.dragging || !this.scene || !this.stage) return;
      const dx = e.clientX - this.lastX;
      this.lastX = e.clientX;
      this.angle = (this.angle + dx * 0.6) % 360;
      this.scene.setCamera({ type: 'oblique', angle: this.angle, distance: 15 });
      this.stage.innerHTML = this.scene.toSVG({ padding: 2 });
    },

    onUp(this: any) {
      this.dragging = false;
      (this.$el as HTMLElement).style.cursor = 'grab';
    },
  }));
}
