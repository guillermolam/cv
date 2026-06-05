# Local SVG icons (`i-local-*`)

Any `.svg` dropped in this folder becomes a UnoCSS icon class:

```
src/assets/icons/cloud-shield.svg   →   class="i-local-cloud-shield"
src/assets/icons/work/badge.svg     →   class="i-local-work-badge"   (subfolders flatten)
```

Wired in `uno.config.ts` via `FileSystemIconLoader('./src/assets/icons', recolorLocalSvg)`.

## Theming
`recolorLocalSvg` (in `uno.config.ts`) rewrites common duotone/tritone source
colors so icons follow the design system:
- primary line/stroke colors (#000, #212121, #333…) → `currentColor` (driven by `text-*`)
- secondary fill colors (#fff, #ccc, #9e9e9e…) → `var(--color-cta)` at 0.35 alpha

Adjust the color lists in `recolorLocalSvg` if a collection uses different hex values.

## Sourcing
svgrepo blocks automated download (HTTP 429 to curl/WebFetch/Firecrawl). To add
icons from the chosen collections, download the `.svg` files from svgrepo in a
browser and drop them here (the `<name>.svg` filename is the class suffix), or
swap to a reachable npm duotone set (e.g. `@iconify-json/solar`).

Usage example:
```html
<span class="i-local-chat text-2xl text-accent" />
```
