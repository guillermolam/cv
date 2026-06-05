/** Alpine.data('whoamiStats', ...) — expandable evidence rows */
type AlpineLike = {
  data: (name: string, callback: () => unknown) => void;
};

/** Alpine.data('whoamiStats', ...) — expandable evidence rows */
export function registerWhoamiComponents(alpine: AlpineLike) {

  alpine.data('whoamiStats', () => ({
    open: null as string | null,

    toggle(this: { open: string | null }, id: string) {
      this.open = this.open === id ? null : id;
    },

    isOpen(this: { open: string | null }, id: string) {
      return this.open === id;
    },
  }));

  /**
   * Alpine.data('operatorConsole', ...) — the single-component switchable core.
   * The keyboard keys call setActive(id); the core panel shows the matching view
   * (BIO radar by default, then skills/certs/education/languages/experience).
   */
  const SECTION_TITLES: Record<string, string> = {
    bio: 'Operator stats',
    skills: 'Skills',
    certifications: 'Certifications',
    education: 'Education',
    languages: 'Languages',
    experience: 'Experience',
  };

  alpine.data('operatorConsole', () => ({
    active: 'bio' as string,
    setActive(this: { active: string }, id: string) {
      this.active = id;
    },
    is(this: { active: string }, id: string) {
      return this.active === id;
    },
    title(this: { active: string }) {
      return SECTION_TITLES[this.active] ?? 'Operator stats';
    },
  }));
}
