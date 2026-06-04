# Fermyon Cloud domains (portfolio release considerations)

Sources:
- https://developer.fermyon.com/cloud/custom-fermyon-subdomain
- https://developer.fermyon.com/cloud/custom-domains-tutorial

## Custom Fermyon subdomain (`*.fermyon.app`)

Fermyon Cloud provides a default app URL shaped like:

```text
<appName-random>.fermyon.app
```

The UI supports renaming the subdomain to a stable/custom value (still under `.fermyon.app`).

Verification is documented as a simple HTTP request:

```bash
$ curl quickstart.fermyon.app
```

Portfolio implications:
- Prefer a stable `.fermyon.app` subdomain for production, so links in CV/LinkedIn remain consistent.
- Treat “domain rename” as a release-affecting change; validate routing + assets afterward.

## Custom domains (bring your own)

The custom domain workflow is currently described as a UI process that requires delegating nameservers to Fermyon Cloud.

Important limitation explicitly documented:
- Fermyon Cloud does not support redirects for custom domains at this time; you must add the complete domain (e.g. `www.example.com`) and cannot rely on automatic apex ↔ www redirects.

Portfolio implications:
- Plan canonical URL strategy up front (www vs apex) to avoid needing redirects.
- Validate SEO-sensitive behavior (canonical URLs, sitemap, robots) after cutover.

