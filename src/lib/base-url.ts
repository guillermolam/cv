/**
 * Prefix a public-folder path with Astro's BASE_URL so it resolves
 * correctly whether the site is served from root ("/") or a subpath ("/cv/").
 *
 * Usage:  withBase('/images/foo.png')  →  '/cv/images/foo.png'  (on GitHub Pages)
 *                                      →  '/images/foo.png'     (on root domain)
 */
export const withBase = (path: string): string =>
  import.meta.env.BASE_URL.replace(/\/$/, '') +
  (path.startsWith('/') ? path : `/${path}`);
