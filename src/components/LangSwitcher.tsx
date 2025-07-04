import type { Locale } from "../i18n";

export default function LangSwitcher(props: {
  locale: Locale;
  onChange: (l: Locale) => void;
}) {
  // Nice display names for your locales
  const langNames: Record<Locale, string> = {
    en: "English",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
  };

  return (
    <div style="margin-bottom:1.5rem;">
      <label for="lang" style="font-weight:500;margin-right:0.7em;">
        🌐 Language:
      </label>
      <select
        id="lang"
        value={props.locale}
        onInput={(e) => props.onChange(e.currentTarget.value as Locale)}
        style="font-size:1rem;padding:0.25em 0.7em;border-radius:0.5em;"
      >
        {Object.entries(langNames).map(([code, name]) => (
          <option key={code} value={code} selected={props.locale === code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}
