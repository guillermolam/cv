# Visual QA Report

## Scope

Static Astro portfolio pages:

- /
- /about
- /cv
- /contact

## Test Matrix

Browsers (Playwright engines):

- Chromium (Desktop Chrome)
- Firefox (Desktop Firefox)
- WebKit (Desktop Safari)

Viewports:

- Mobile: 390×844
- Tablet: 768×1024
- Desktop: 1280×720
- Wide: 1920×1080

## Interactive Checks

- Top navigation menu links route correctly across pages.
- Home page CTA links route correctly (View CV, How I work, Contact).
- Pages load without console errors during smoke navigation.

## Results

- Playwright E2E suite: PASS (33/33)
- No visual layout breaks detected by the smoke suite across the tested viewports.
- No unexpected navigation behavior detected during scripted interactions.

## Evidence

- HTML report: playwright-report/index.html
- Screenshots are attached per test run inside the report and under test-results/.

## Notes / Limitations

- WebKit coverage is Playwright’s WebKit engine and is a strong proxy for Safari, but it is not a replacement for manual testing in the installed Safari app.
