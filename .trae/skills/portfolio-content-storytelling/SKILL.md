---
name: "portfolio-content-storytelling"
description: "Use this skill when improving recruiter-first portfolio storytelling and IA (30-second recruiter test, About, achievements, case studies, positioning audits). Do not use for UI/code/deploy implementation."
compatibility:
  platforms:
    - "Trae SOLO"
    - "Claude Code"
    - "Claude.ai"
  project_types:
    - "Astro portfolio sites"
    - "Content-first, progressively enhanced experiences"
  languages:
    - "English"
metadata:
  version: "1.0.0"
  owner: "portfolio"
  intent: "content-storytelling"
  primary_audience:
    - "Recruiters"
    - "Hiring managers"
    - "Security leaders"
    - "Platform engineering leaders"
    - "CTOs"
    - "CISOs"
  persona:
    name: "Guillermo Lam"
    seniority: "Senior"
    domains:
      - "DevSecOps"
      - "Cloud Security"
      - "Platform Engineering"
      - "Kubernetes"
      - "AI Security"
      - "Internal Developer Platforms"
  authoritative_refs:
    - "references/ia.md"
    - "references/content-model.md"
    - "references/control-room-blueprint.md"
  tags:
    - "recruiter-ux"
    - "information-architecture"
    - "case-studies"
    - "achievements"
    - "technical-storytelling"
    - "credibility"
    - "clarity"
  guardrails:
    - "No buzzword stuffing"
    - "No tool dumping"
    - "No certification dumping"
    - "No resume-style lists as the primary format"
    - "No vendor marketing language"
---

# Portfolio Content Storytelling

## Purpose
Guide agents to create, review, and evolve portfolio content so it passes the 30-second recruiter test and stays consistent across pages, sections, and IA—without devolving into buzzwords or tool lists.

This skill may collaborate with:
- `immersive-storytelling` (interaction/reveal strategy and narrative pacing)
- `motion-design-system` (motion patterns that support comprehension)

This skill does not design motion systems or implement UI/animation.

This skill is recruiter-outcome driven:
- Increase comprehension, credibility, and conversion (contact path).
- Make seniority and specialization obvious.
- Translate technical work into business impact with evidence.
- Keep narrative consistent with IA and content model.

## Audience
Primary audience:
- Recruiters
- Hiring managers
- Security leaders
- Platform engineering leaders
- CTOs
- CISOs

Secondary audience:
- Technical peers validating depth and correctness.

## When To Use
Use this skill when the user asks to:
- Improve recruiter messaging, positioning, or “what I do” clarity
- Write or revise: About, homepage hero copy, project descriptions, achievements, case studies, or role summaries
- Normalize content across pages (tone, structure, claims, terminology)
- Restructure information architecture, navigation labels, or page taxonomy
- Extract achievements from raw notes and translate them into outcomes
- Create or audit: portfolio headline/tagline, role identity, specialization framing, and value proposition

### Trigger Examples (at least 5)
- “Rewrite my About page so recruiters understand me in 30 seconds.”
- “Turn this project into a case study with outcomes and evidence.”
- “Make my portfolio less like a résumé and more like a narrative.”
- “Review these achievement bullets for credibility and impact.”
- “Restructure the portfolio IA: categories, page names, and navigation.”
- “Help me explain Kubernetes work as business outcomes for security leaders.”

## Triggering (Precision Rules)
Use this skill when the request is about portfolio content and recruiter outcomes, especially:
- “30-second recruiter test”, “recruiter readability”, “positioning”, “value proposition”, “career narrative”
- “case study”, “project story”, “achievement bullets”, “impact”, “proof”, “evidence”, “scope”, “ownership”
- “information architecture”, “navigation labels”, “what goes on About vs CV vs Portfolio”

Do not use this skill when the request is primarily implementation, deployment, or automation:
- “Astro component”, “TypeScript refactor”, “CSS/layout bug”, “Three.js scene”, “Spin/Fermyon deploy”, “CI workflow”

Over-trigger guardrail:
- If the user’s primary goal is code changes, route away even if they mention “copy” in passing.

Under-trigger guardrail:
- If the user asks for “make this portfolio stronger”, “sound more senior”, or “improve recruiter conversion”, trigger this skill even if they do not name a page.

## When NOT To Use
Do NOT use this skill when the user asks to:
- Implement UI/components/routes, build pipelines, or Three.js features
- Add frameworks, refactor TypeScript, or change Astro architecture
- Automate LinkedIn actions (posting, editing profile, scraping)
- Invent employers, dates, certifications, metrics, clients, or claims
- Produce vendor-copy (product marketing), “thought leadership” fluff, or generic motivational content

### Non-Trigger Examples (at least 3)
- “Add a new Astro route and wire it into the header.”
- “Optimize the Three.js scene and fix the render loop.”
- “Deploy this site to Fermyon Cloud with Spin.”

## Required Inputs
Ask for only what’s needed.

Minimum inputs:
- Target page/section (homepage, About, CV summary, portfolio category, case study, contact)
- Intended audience subset (recruiter vs hiring manager vs security leader)
- Source material (current text, notes, bullets, repo links, diagrams, tickets, incident summaries)
- Constraints (tone, length, must-keep claims, geographic preferences, language)

For claims and evidence:
- Role titles, companies, dates (if relevant)
- Technologies used (as inputs, not as outputs)
- Outcomes/impact (time saved, risk reduced, cost avoided, reliability improved)
- Evidence sources (PRs, diagrams, runbooks, dashboards, public links) when available

## Decision Tree (Routing)
If the user requests:
- Homepage content → run Content Workflow with emphasis on Phase 0, 4, 5, 6; output must include a 2–3 line above-the-fold summary + CTA.
- About page content → run Content Workflow end-to-end; ensure identity + specialization + proof + narrative continuity with IA.
- Case study creation → run Content Workflow with emphasis on Phase 2, 3, 4; output must include Problem→Approach→Result and evidence hooks.
- Achievement extraction → run Content Workflow with emphasis on Phase 3, 4; output must include ownership level and Claims Table.
- IA review/changes → mandatory: consult references/ia.md first; then run Content Workflow with emphasis on Phase 2 and IA Consistency gate.
- Recruiter optimization pass → run Content Workflow with emphasis on Phase 5 and Recruiter/Hiring Manager validation.
- Content audit (site-wide) → mandatory: consult references/control-room-blueprint.md first; then run Content Review + Narrative Mapping across all affected pages and produce a consistency report.

## Reference Usage Rules (Mandatory Consult)
Treat these references as authoritative and consult them before the corresponding changes:
- Before IA changes (pages, navigation, taxonomy): references/ia.md
- Before structural changes to content fields/types: references/content-model.md
- Before portfolio-wide narrative/positioning changes (identity, themes, control-room metaphor): references/control-room-blueprint.md

Stop condition:
- If requested content conflicts with any reference, stop and propose the minimum change to restore alignment (do not silently diverge).

## Content Workflow
Follow the phases in order; stop early if inputs are missing.

### Phase 0 — Audience Identification
- Pick the primary reader for this artifact:
  - Recruiter: fast clarity + contact path
  - Hiring manager: scope, ownership, problem complexity
  - Security leader/CISO: risk, control posture, governance, assurance
  - Platform leader: platform capability, dev velocity, reliability
- Define the “30-second question” the reader should answer.

### Phase 0.5 — Safety & Fact Boundaries
- List all major claims implied by the request.
- Classify each claim confidence: high / medium / needs confirmation.
- If the request requires inventing achievements/employers/dates/metrics, stop and ask for source material.

### Phase 1 — Content Review (Current State)
- Extract explicit claims (who/what/scope/outcomes).
- Flag vague claims (“improved”, “optimized”, “worked on”) without evidence.
- Flag tool dumps and certification dumps.
- Identify missing recruiter-critical info: seniority, specialization, impact, contact path.

### Phase 2 — Narrative Mapping
- Map content to the portfolio narrative system (see authoritative refs):
  - Where does it live in IA?
  - What job-to-be-done does this page serve?
  - What story does it support (security, platform, delivery, reliability)?
- Ensure consistent terminology and naming across pages.

### Phase 3 — Achievement Extraction
- Convert raw inputs (notes, bullet lists, tickets) into:
  - Problem → Approach → Result
  - Constraints (scale, compliance, incident pressure, migration risk)
  - Ownership level (led / owned / contributed / supported)
- Mark anything uncertain as “needs confirmation”.

### Phase 4 — Business Impact Translation
Convert:
Technology → Capability → Business Outcome

Rules:
- Technology is never the headline; it is supporting evidence.
- Capability is what the reader can hire Guillermo to do.
- Business outcome is the value to the organization.

Examples:
- “Kubernetes” → “Platform Engineering” → “Reduced operational overhead”
- “OpenBao” → “Secrets Management” → “Improved security posture”

### Phase 5 — Recruiter Optimization
- Make the first 2–3 lines answer: who + seniority + specialization + outcome.
- Use plain language first; add technical depth as evidence later.
- Replace generic verbs with specific outcomes and constraints.
- Ensure contact path is obvious (CTA, email, links) where applicable.

### Phase 5.5 — Iteration Loop (Reliability)
- Produce Draft A (clarity-first) and Draft B (depth-first) if the audience is mixed.
- Run Validation Gates; address failures; then produce a final merged draft.

### Phase 6 — Final Validation
- Run Validation Gates (below).
- Verify IA alignment and no contradictions across pages.
- Produce Output Contract deliverables.

## Narrative Framework (30-Second Recruiter Test)
Within 30 seconds, a recruiter must understand:
- Who Guillermo is (name + role identity)
- Seniority level (Senior)
- Specialization areas (DevSecOps, Cloud Security, Platform Engineering, Kubernetes, AI Security, IDPs)
- Major achievements (2–3 high-signal outcomes)
- Business impact (risk reduction, delivery speed, reliability, cost/overhead)
- Contact path (what to click, how to reach out)

Framework to structure any page:
1) Identity line: “Senior <role> focused on <specialization>”
2) Proof line: “Known for <capability> leading to <outcome>”
3) Evidence block: 2–4 bullets with specifics (scope, constraints, measurable impact)
4) Depth section: architecture, security controls, tradeoffs, tooling as evidence
5) CTA: contact + next step

## Validation Gates
Content must pass all gates before “done”.

### Clarity
- First screen communicates role identity + specialization
- Headings are scannable; sentences are short and specific
- No unexplained acronyms without context (unless standard for audience)

### Credibility
- Claims are specific and consistent with the rest of the site
- Ownership is explicit (led/owned/contributed)
- No inflated language (“world-class”, “best-in-class”) without evidence

### Evidence
- Each major claim has at least one supporting detail (scope, constraint, artifact, metric, or example)
- Uncertain facts are marked “needs confirmation”

### Business Impact
- Outcomes are expressed in organizational terms (risk, speed, cost, reliability)
- Technology appears as support, not as the main value proposition

### Technical Depth
- Technical readers can verify competence from details (controls, tradeoffs, architecture decisions)
- No shallow “tool list” substituted for reasoning

### Recruiter Readability
- Avoid dense paragraphs; prefer structured sections
- Avoid vendor language and keyword stuffing
- Contact path is explicit

### Audience Fit (Multi-Reader Validation)
Recruiter validation:
- First screen answers: seniority + specialization + proof + contact path
- No jargon-heavy paragraphs above the fold

Hiring manager validation:
- Ownership and scope are unambiguous (led/owned/contributed + what area)
- Problem complexity and constraints are visible (scale, risk, compliance, timelines)

Security leader/CISO validation:
- Security outcomes are explicit (risk reduced, controls, assurance, incident readiness)
- No security theater; claims remain verifiable

Platform engineering leader validation:
- Platform capability is explicit (IDP, self-service, reliability, developer experience)
- Outcomes connect to delivery speed and operational overhead

### IA Consistency
- Content fits the page’s purpose in IA
- Terminology matches global navigation and content model
- No duplicate pages saying the same thing differently

## Severity Classification
Critical issues (must fix before any output is used):
- Invented achievements, employers, clients, dates, certifications, or metrics
- Contradictory dates/titles across pages
- Unverifiable claims stated as facts

Major issues (must fix before “done”):
- Unclear role identity or seniority on first screen
- Weak business impact (tools listed, outcomes missing)
- Recruiter confusion (too technical above the fold, no CTA/contact path)
- Inconsistent narrative/terminology across pages

Minor issues (fix if time allows; do not block release unless compounding):
- Readability and flow tweaks
- Terminology consistency polishing
- Reducing repetition and improving scannability

## Output Contract
Every run must produce:
- The final content (or revised content) for the requested section(s)
- A “30-second summary” (2–3 sentences) that would appear above the fold
- A Claims Table:
  - Claim
  - Evidence / supporting detail
  - Confidence (high/medium/needs confirmation)
- A Tech→Capability→Outcome mapping list (at least 3 items when relevant)
- A validation checklist result (pass/fail per gate)
- A list of follow-ups (missing inputs to confirm, evidence to gather)

## Definition of Done
Content work is complete only when all are true:
- No Critical issues remain.
- The 30-second summary exists and includes: seniority + specialization + proof + next step/contact.
- Every major claim has evidence or is explicitly marked “needs confirmation”.
- Tech→Capability→Outcome mappings exist (≥ 3 when tech is mentioned).
- All Validation Gates pass (including Audience Fit).
- IA alignment is explicitly confirmed against references/ia.md and references/content-model.md where applicable.

## Examples
### Content Generation Examples (at least 5)
1) Homepage opener
- “Write a 2-line hero summary that makes my role and impact obvious to recruiters.”

2) Case study skeleton
- “Turn these notes into a case study: context, problem, constraints, approach, results, lessons.”

3) Project description rewrite
- “Rewrite this project page to lead with capability and outcome, then add tools as evidence.”

4) Achievement extraction
- “Extract 6 achievements from these tickets and convert them into credible outcomes.”

5) About page narrative
- “Draft an About page that connects DevSecOps + Cloud Security + Platform Engineering into one story.”

### Content Review Examples (at least 5)
1) Buzzword audit
- “Review this About section and remove buzzwords while keeping it strong.”

2) Credibility audit
- “Flag any claims that sound inflated or unprovable; propose safer wording.”

3) IA alignment review
- “Check whether these sections belong on About vs CV vs Portfolio; recommend moves.”

4) Outcome translation
- “Convert these tool-heavy bullets into Tech→Capability→Outcome statements.”

5) Consistency review
- “Ensure terminology is consistent across homepage, About, and portfolio category pages.”

## Troubleshooting
- Output reads like a résumé:
  - Replace lists with Problem→Approach→Result narratives and add evidence.
- Output is tool-dumpy:
  - Move tools into an “Implementation Evidence” section; lead with capability/outcome.
- Output sounds like vendor marketing:
  - Remove superlatives; add constraints, tradeoffs, and concrete results.
- Content lacks impact:
  - Ask for baseline, delta, timeframe, scale; if missing, write as qualitative outcome + “needs confirmation”.
- Too technical for recruiters:
  - Put plain-language summary first; move depth into expandable sections or later headings.

## Common Mistakes
- Buzzword stuffing and keyword padding to “sound senior”
- Tool dumping (“Kubernetes, Terraform, X, Y, Z”) with no capability/outcome
- Certification dumping without connecting to real work or impact
- Resume-style lists as the primary structure for portfolio pages
- Claims without ownership level or evidence
- Inconsistent narrative across pages (different role identity per page)
- Over-indexing on tech depth and failing the 30-second recruiter test

## Failure Mode Analysis (at least 10)
For each failure: symptom → likely cause → corrective action.

| # | Symptom | Likely Cause | Corrective Action |
|---:|---|---|---|
| 1 | Claims sound inflated or absolute | Missing constraints/ownership, marketing tone | Downgrade language, add ownership level, add evidence hook |
| 2 | Recruiter can’t tell “who Guillermo is” fast | Weak opener, missing specialization framing | Rewrite first 2–3 lines: identity + specialization + proof + CTA |
| 3 | Content reads like a résumé | List-first structure, no narrative | Reformat to Problem→Approach→Result; add evidence and outcomes |
| 4 | Tool dumping dominates | Confusing inputs (tools) with value | Convert to Tech→Capability→Outcome; move tools to evidence section |
| 5 | Business impact is vague | No baseline/delta, no stakeholder framing | Ask for baseline/delta; write qualitative impact + “needs confirmation” |
| 6 | Contradictions across pages | No canonical wording | Define canonical identity line; propagate terminology consistently |
| 7 | Too technical above the fold | Audience mismatch | Move depth below summary; add short glossary line for acronyms |
| 8 | Security claims feel like theater | Control names without outcomes | Tie controls to risk/outcome; remove unsupported claims |
| 9 | Case study feels generic | Missing constraints, tradeoffs, scale | Add constraints/tradeoffs; include one concrete decision and why |
| 10 | Missing contact path / weak CTA | Recruiter conversion not considered | Add explicit CTA; ensure contact info is visible and consistent |
| 11 | Unverifiable metrics appear | Hallucinated numbers or implied precision | Remove numbers; request sources; mark “needs confirmation” |
| 12 | IA changes create duplication/confusion | Changed taxonomy without IA check | Consult references/ia.md; propose page moves/merges; update nav labels |

## Reference Use (Progressive Disclosure)
- Consult references per Reference Usage Rules; do not duplicate architecture docs inside this skill.
