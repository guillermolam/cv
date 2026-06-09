# Plan — Auditoría SSR, Tamaño, Despliegue (GitHub Pages), Seguridad, Instrumentación y Proveniencia

## **Resumen**
Este plan actualiza y reordena el trabajo para poder **renderizar y desplegar de forma fiable** (GitHub Actions + GitHub Pages), controlando **tamaño/performance**, evaluando con criterio la **madurez/encaje de SSR**, y reforzando **seguridad + instrumentación + proveniencia/canonicalización de datos**.

Este documento está **grounded** en el estado actual del repo:
- Render actual: `output: 'static'` en [astro.config.mjs](file:///Users/guillermolammartin/Git/guillermolam/cv/astro.config.mjs#L9-L38).
- Workflow actual de Pages: [deploy-cv.yaml](file:///Users/guillermolammartin/Git/guillermolam/cv/.github/workflows/deploy-cv.yaml#L1-L54) (apunta a un subdirectorio legacy y usa Bun).
- Validaciones locales existentes: scripts `validate-*` + `content:graph`/`content:validate` en [package.json](file:///Users/guillermolammartin/Git/guillermolam/cv/package.json#L10-L35).
- Gobernanza y límites: [docs/spec.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/spec.md), [docs/checklist.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/checklist.md), [threejs-boundaries.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/architecture/threejs-boundaries.md).
- Plan maestro existente: [master-implementation-plan-hybrid-cloud-control-room.md](file:///Users/guillermolammartin/Git/guillermolam/cv/.trae/documents/master-implementation-plan-hybrid-cloud-control-room.md).

## **Estado Actual (Auditoría)**
### 1) Render y madurez SSR (encaje con hosting)
- El repo hoy está orientado a **estático** (`output: 'static'`).
- GitHub Pages no soporta SSR nativo; SSR implicaría cambiar hosting (p.ej. Vercel/Node/Fermyon SSR…).
- Existe `@astrojs/node` en devDependencies ([package.json](file:///Users/guillermolammartin/Git/guillermolam/cv/package.json#L56-L77)), pero no se usa en `astro.config.mjs` actual → señal de “posible futuro”, no necesidad actual.

**Conclusión preliminar**: SSR se trata como **track opcional**, no como requisito del deliverable GH Pages.

### 2) Tamaño y performance
- Vite tiene `chunkSizeWarningLimit: 1600` ([astro.config.mjs](file:///Users/guillermolammartin/Git/guillermolam/cv/astro.config.mjs#L21-L38)).
- Hay prebundle de libs pesadas (`three`, `chart.js`, `gsap`) para evitar fallos de dynamic import.
- Existen scripts de validación de motion/layout/data display que sirven como “smoke gates”.

**Gaps**:
- No hay auditoría formal de bundle/asset size en CI.
- No hay presupuesto por ruta/por feature (WebGL, charts, etc.) automatizado.

### 3) Deployment (GitHub Actions + Pages)
- `deploy-cv.yaml` usa:
  - `working-directory: ./guillermo-lam-cv` (legacy)
  - Bun (`bun install`, `bun run build`)
  - artifact: `./guillermo-lam-cv/dist`

**Gaps**:
- No usa pnpm (nuestro package manager).
- No compila el Astro root actual.
- No ejecuta `pnpm run check`/scripts de validación.

### 4) Seguridad (supply chain + repositorio)
- Existe workflow de Trunk: [trunk-check.yaml](file:///Users/guillermolammartin/Git/guillermolam/cv/.github/workflows/trunk-check.yaml).

**Gaps**:
- Falta pipeline explícita de security checks (dependencias, secretos, FS scan) en CI (si se decide).
- Falta un modelo de “least privilege” por workflow en Pages + PR.

### 5) Instrumentación
- Ya existe instrumentación DEV (DevTools suite) implementada recientemente, pero no se ha formalizado como “política”.

**Gaps**:
- Falta instrumentación “production-safe” (p.ej. Web Vitals / performance marks) que no sea invasiva ni rompa privacidad.

### 6) Proveniencia y canonicalización de datos
- Hay pipeline de grafo y validación:
  - genera `public/data/content-graph.json`: [generate-content-graph.mjs](file:///Users/guillermolammartin/Git/guillermolam/cv/scripts/generate-content-graph.mjs#L4-L24)
  - valida IDs estables, kebab-case, URLs externas inseguras, consistencia de referencias: [validate-content-graph.mjs](file:///Users/guillermolammartin/Git/guillermolam/cv/scripts/validate-content-graph.mjs#L7-L48)

**Gaps**:
- Falta una capa explícita de “canonical URL + hreflang + base path” verificada para Pages.
- Falta un contrato de proveniencia por colección (qué campos vienen de dónde, y cómo se validan).

---

## **Decisiones (bloqueantes)**
1) **Hosting principal v1**: GitHub Pages con build estático.
2) **SSR**: se evalúa como epic separado; no se mezcla con GH Pages.
3) **Instrumentación**: primero “privacy-safe + sin vendor lock-in”; nada que requiera tokens en PRs.
4) **Datos**: `src/content/**` es fuente de verdad; cualquier ingest externa debe dejar rastro (proveniencia) y pasar validaciones.

---

## **Epics / Fases + Ownership (agentes)**
### EPIC A — Auditoría y decisión SSR (madurez + encaje)
- **Objetivo**: decidir si SSR aporta valor real frente a static-first y, si sí, bajo qué hosting (no Pages).
- **Owner**: portfolio-architect (decisión) + portfolio-delivery-governance (gates).
- **Contribuye**: astro-portfolio-builder (viabilidad técnica), devsecops-ci-builder (impacto CI), fermyon-deploy-agent (si se considera Spin).
- **Entregables**:
  - “Go / No-Go SSR” para v1, con criterios medibles: performance, SEO, complejidad de deploy, seguridad.
  - Matriz “Static vs SSR” con consecuencias para canonicals/hreflang/routing.
- **Validación**:
  - No cambios de código en esta fase, solo decisión aprobada.

### EPIC B — Deploy confiable en GitHub Actions + Pages (pnpm + Astro root)
- **Objetivo**: que Pages publique el **Astro root actual**, usando **pnpm**, ejecutando checks y builds deterministas.
- **Owner**: devsecops-ci-builder.
- **Entregables**:
  - Workflow Pages actualizado: pnpm setup + cache + `pnpm run check` + `pnpm run build` + upload `dist/`.
  - Eliminar/archivar lo legacy que apunta a `./guillermo-lam-cv` (sin romper historia).
  - Permisos mínimos por workflow.
- **Validación**:
  - CI verde en push a main.
  - PR checks sin secretos.
  - `dist/` publicado y accesible en Pages.

### EPIC C — Tamaño y performance (budgets + auditoría)
- **Objetivo**: controlar tamaño (JS/CSS/assets) y performance (LCP/CLS, loops WebGL, lazy loading).
- **Owner**: immersive-performance-governance.
- **Contribuye**: threejs-cloud-control-room-developer (WebGL), astro-portfolio-builder (bundles), qa-performance-validator (mediciones).
- **Entregables**:
  - Presupuesto de bundles (por route y por vendor) + política de “degradación”.
  - Modo de auditoría de bundle en CI (report textual mínimo; visualizer opcional).
  - Política para assets “public vs src/assets” y cuándo usar `astro:assets`.
- **Validación**:
  - `pnpm run build` y `pnpm run check` siguen limpios.
  - Pruebas de no-runaway loops y reduced-motion.

### EPIC D — Seguridad (supply chain + repo hardening)
- **Objetivo**: reforzar seguridad sin añadir fricción excesiva.
- **Owner**: devsecops-ci-builder.
- **Entregables**:
  - Threat model mínimo: trust boundaries (content, public assets, external URLs).
  - Scans en CI (selección mínima): secretos + deps + FS scan (según coste).
  - Reglas de permissions y no uso de patrones inseguros (p.ej. `pull_request_target`).
- **Validación**:
  - CI no requiere secretos.
  - No se exponen tokens ni datos sensibles en logs.

### EPIC E — Instrumentación (dev + prod-safe)
- **Objetivo**: instrumentar sin romper privacidad ni performance.
- **Owner**: portfolio-control-room-implementation (o astro-portfolio-builder si queda en capa web).
- **Contribuye**: qa-performance-validator (verifica), immersive-performance-governance (budgets).
- **Entregables**:
  - Política “DEV-only tools” (ya implementado) y “Prod-only metrics” (sin vendor).
  - Métricas mínimas: Web Vitals local-only (opcional), marks/measures para navegación/motion.
- **Validación**:
  - No `console.log` en producción (salvo opt-in).
  - No bundle bloat innecesario.

### EPIC F — Proveniencia y canonicalización (datos + URLs + SEO)
- **Objetivo**: garantizar que el contenido es trazable (proveniencia) y que las URLs son canónicas (Pages base + hreflang).
- **Owner**: cv-content-architect (proveniencia de contenido) + astro-portfolio-builder (SEO/canonicals).
- **Entregables**:
  - Contrato por colección: campos “fuente”/“needsConfirmation”, y reglas de validación.
  - Canonical URL strategy compatible con Pages base (sin SSR).
  - Endurecer `validate-content-graph` para detectar URLs peligrosas y asegurar consistencia.
- **Validación**:
  - `pnpm run content:validate` pasa.
  - Pages deploy respeta canonicals/hreflang (inspección manual + smoke test).

---

## **Plan de ejecución (orden)**
1) EPIC A (decisión SSR) — corta el riesgo de re-trabajo de deploy.
2) EPIC B (Pages deploy con pnpm) — desbloquea iteración.
3) EPIC F (canonicalización + proveniencia) — evita enlaces rotos y claims opacos.
4) EPIC C (budgets/performance) — controla el crecimiento.
5) EPIC D (seguridad) — endurece CI y supply chain sin frenar.
6) EPIC E (instrumentación) — añade observabilidad sin vendor lock-in.

---

## **Riesgos y mitigaciones**
- **Riesgo (Crítico): mezclar SSR con Pages** → Mitigación: SSR como track separado; Pages permanece estático.
- **Riesgo (Mayor): workflow deploy legacy** → Mitigación: refactor CI con pnpm y paths correctos.
- **Riesgo (Mayor): crecimiento de bundles por WebGL/charts** → Mitigación: budgets + lazy load + auditoría.
- **Riesgo (Mayor): content ingest sin trazabilidad** → Mitigación: contrato de proveniencia + validación estricta.
- **Riesgo (Mayor): external URLs inseguras** → Mitigación: validator ya detecta `javascript:`/`data:`; extender a allowlists si es necesario.
- **Riesgo (Menor): tooling dev filtrándose a prod** → Mitigación: gate `import.meta.env.DEV` + revisar tree shaking en build.

---

## **Verificación (Definition of Done del plan)**
- `pnpm run check` (TypeScript/Astro check) en CI y local.
- `pnpm run build` publica `dist/` en Pages.
- `pnpm run content:validate` y `pnpm run content:graph` pasan.
- Checklist global: [docs/checklist.md](file:///Users/guillermolammartin/Git/guillermolam/cv/docs/checklist.md) sin regresiones (recruiter fast path, reduced motion, fallback WebGL).

