# Astro SEO and Accessibility

## SEO Defaults
- Every page must have a unique, meaningful title.
- Descriptions should describe the page intent, not a keyword list.
- Do not break crawlability with JS-only rendering of essential content.

## Accessibility Defaults
- Semantic headings in correct order (H1 once per page; H2 sections; H3 subsections).
- Landmarks where appropriate (header/nav/main/footer).
- Keyboard navigation for all interactive UI.
- Visible focus indication.

## Portfolio-Specific Risks
- First-screen content must remain readable without any islands or canvas layers.
- Navigation regressions are high impact for recruiter UX.

## Validation Checklist
- Manual quick scan: headings, landmarks, keyboard tab order, focus visibility.
- No essential content hidden behind toggles that require JS.
- Page titles render correctly in the built output.
