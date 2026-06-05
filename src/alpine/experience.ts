type AlpineLike = {
  data: (name: string, callback: () => unknown) => void;
};

export function registerExperienceComponents(alpine: AlpineLike) {
  // Reserved for future interactive experience filtering / timeline navigation
  alpine.data('experienceFilter', () => ({
    active: 'all',
    filter(this: any, tag: string) { this.active = tag; },
    matches(this: any, tags: string[]) {
      return this.active === 'all' || tags.includes(this.active);
    },
  }));
}
