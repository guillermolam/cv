// src/App.tsx
import { createSignal } from 'solid-js';
import MarkdownIt from 'markdown-it';
import LangSwitcher from './components/LangSwitcher';
import DownloadButtons from './components/DownloadButtons';

// --- Types and helpers ---
type Locale = 'en' | 'es' | 'fr' | 'de';
const FALLBACK: Locale = 'en';
const LOCALES: Locale[] = ['en', 'es', 'fr', 'de'];

function detectLocale(): Locale {
  const p = new URLSearchParams(location.search).get('lang') as Locale;
  if (LOCALES.includes(p)) return p;
  const nav = navigator.language.slice(0, 2) as Locale;
  return LOCALES.includes(nav) ? nav : FALLBACK;
}

// --- Eager import of ALL markdown files in all locales & sections ---
const mdModules = import.meta.glob('./parts/*/*/*.md', { eager: true, as: 'raw' });
const headerModules = import.meta.glob('./parts/*/header_summary.md', { eager: true, as: 'raw' });

// --- Compose Markdown in desired order ---
function getLocaleParts(locale: Locale) {
  // 1. Header
  const header = headerModules[`./parts/${locale}/header_summary.md`] || '';
  // 2. Education
  const education = [
    mdModules[`./parts/${locale}/education/education.md`] || '',
    mdModules[`./parts/${locale}/education/certifications.md`] || ''
  ].join('\n\n');
  // 3. Volunteering
  const volunteering = mdModules[`./parts/${locale}/volunteering/volunteering.md`] || '';
  // 4. Work: all work/experience_*.md files, sorted for stability
  const workKeys = Object.keys(mdModules).filter(
    k => k.startsWith(`./parts/${locale}/work/`) && k.endsWith('.md')
  ).sort();
  const work = workKeys.map(k => mdModules[k]).join('\n\n');
  // --- Stitch together ---
  return [header, education, volunteering, work].filter(Boolean).join('\n\n---\n\n');
}

export default function App() {
  const [locale, setLocale] = createSignal<Locale>(detectLocale());
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

  // Compose and render Markdown whenever locale changes
  const rendered = () => md.render(getLocaleParts(locale()));

  return (
    <>
      <LangSwitcher locale={locale()} onChange={setLocale} />
      <DownloadButtons locale={locale()} />
      <article innerHTML={rendered()} />
    </>
  );
}
