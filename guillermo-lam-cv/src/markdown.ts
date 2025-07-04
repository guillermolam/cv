import type { Locale } from "./i18n";

// Eager import of ALL markdown files in all locales & sections
export const mdModules: Record<string, string> = import.meta.glob("./parts/*/*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

export const headerModules: Record<string, string> = import.meta.glob("./parts/*/header_summary.md", {
  eager: true,
  query: "?raw",
  import: "default",
});

// Compose Markdown in desired order for a locale
export function getLocaleParts(locale: Locale): string {
  const header = headerModules[`./parts/${locale}/header_summary.md`] || "";
  const education = [
    mdModules[`./parts/${locale}/education/education.md`] || "",
    mdModules[`./parts/${locale}/education/certifications.md`] || "",
  ].join("\n\n");
  const volunteering = mdModules[`./parts/${locale}/volunteering/volunteering.md`] || "";
  const workKeys = Object.keys(mdModules)
    .filter((k) => k.startsWith(`./parts/${locale}/work/`) && k.endsWith(".md"))
    .sort();
  const work = workKeys.map((k) => mdModules[k]).join("\n\n");
  return [header, education, volunteering, work].filter(Boolean).join("\n\n---\n\n");
}
