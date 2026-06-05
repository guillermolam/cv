type AlpineLike = {
  data: (name: string, callback: () => unknown) => void;
};

export function registerExperienceComponents(alpine: AlpineLike) {
  alpine.data('experienceCard', () => ({
    active: 'achievements' as 'achievements' | 'projects' | 'skills',
    flash: 'achievements' as 'achievements' | 'projects' | 'skills',
    modalOpen: false,
    timeoutId: null as number | null,

    setActive(
      this: { active: string; flash: string; timeoutId: number | null },
      id: 'achievements' | 'projects' | 'skills',
    ) {
      if (this.active === id) return;
      this.active = id;
      this.flash = id;
      if (this.timeoutId !== null) window.clearTimeout(this.timeoutId);
      this.timeoutId = window.setTimeout(() => {
        this.flash = '';
        this.timeoutId = null;
      }, 520);
    },

    is(this: { active: string }, id: string) {
      return this.active === id;
    },

    isFlashing(this: { flash: string }, id: string) {
      return this.flash === id;
    },

    openModal(this: { modalOpen: boolean }, event?: Event) {
      if (event) event.stopPropagation();
      this.modalOpen = true;
    },

    closeModal(this: { modalOpen: boolean }, event?: Event) {
      if (event) event.stopPropagation();
      this.modalOpen = false;
    },

    handleSurfaceClick(
      this: { modalOpen: boolean },
      event: MouseEvent,
    ) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (
        target.closest(
          'a, button, dialog, [data-experience-ignore-click], input, select, textarea',
        )
      ) {
        return;
      }
      this.modalOpen = true;
    },
  }));
}
