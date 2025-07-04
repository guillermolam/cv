// src/App.tsx
import { createSignal } from "solid-js";
import MarkdownIt from "markdown-it";
import LangSwitcher from "./components/LangSwitcher";
import DownloadButtons from "./components/DownloadButtons";
import { getLocaleParts } from "./markdown";

// --- Types and helpers ---
type Locale = "en" | "es" | "fr" | "de";
const FALLBACK: Locale = "en";
const LOCALES: Locale[] = ["en", "es", "fr", "de"];

function detectLocale(): Locale {
  const p = new URLSearchParams(location.search).get("lang") as Locale;
  if (LOCALES.includes(p)) return p;
  const nav = navigator.language.slice(0, 2) as Locale;
  return LOCALES.includes(nav) ? nav : FALLBACK;
}


export default function App() {
  const [locale, setLocale] = createSignal<Locale>(detectLocale());
  const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

  // Compose and render Markdown whenever locale changes
  const rendered = () => md.render(getLocaleParts(locale()));

  return (
    <>
      <div class="button-bar">
        <LangSwitcher locale={locale()} onChange={setLocale} />
        <DownloadButtons locale={locale()} />
      </div>
      <article innerHTML={rendered()}>
        <p>
          If you see this, content is loading. If the page remains blank, there
          might be an issue with markdown rendering.
        </p>
      </article>
    </>
  );
}
