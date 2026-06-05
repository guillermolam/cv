# Language Dial (Architecture)

A single reusable Flipper-Zero-style directional wheel for i18n selection,
replacing the per-language buttons of the old `AnalogLanguageSelector`.

## Files
- `src/components/i18n/LanguageDial.astro` — the dial (LCD + D-pad + center OK).
- `src/components/i18n/CountryFlag.astro` — inline SVG flags (gb/es/fr/de).
- `src/scripts/language-dial.ts` — client behaviour.
- Wired in `src/layouts/PageLayout.astro`.

## Behaviour
- **LCD** shows the previewed language: flag + code + name. All four items are
  rendered; only the active one is shown (`data-active`), toggled by the script.
- **Preview vs commit**: Up/Down (and Left/Right) **preview-cycle** the language
  without navigating; the center **OK** (or Enter on it) **commits** →
  `window.location.href = previewHref`.
- **No-JS fallback**: every directional control is a real `<a>` pointing at its
  neighbour language; OK points at the current language. So keyboard/no-JS users
  can still reach every language. JS upgrades this to in-place preview.
- **Store**: previewing calls `setLang()` so `$lang` reflects the LCD.
- **Keyboard**: arrows cycle, Enter/Space on OK commits; visible focus rings.
- **SFX**: `emitSfx('key')` on cycle, `emitSfx('click')` on commit (decoupled;
  silent when audio muted).

## Path preservation
`PageLayout` builds `langLinks` from `stripLangPrefix(currentPath)` so switching
language keeps the user on the same page.
