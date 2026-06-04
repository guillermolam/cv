export const SUPPORTED_LANGS = ['en', 'es', 'fr', 'de'] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = 'en';

export function isLang(value: string): value is Lang {
  return (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export function getLangStaticPaths() {
  return SUPPORTED_LANGS.map((lang) => ({ params: { lang } }));
}

