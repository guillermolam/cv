---
name: recruiter-portfolio-ux
description: "Use this skill when evaluating the portfolio’s recruiter experience (30-second test) and the quality of motion, transitions, and interactions as they affect discoverability and conversion. Owns recruiter UX review criteria, including motion evaluation. Do not use for implementation or narrative copywriting."
compatibility: "Trae SOLO / Claude Code / Claude.ai. Produces UX review reports and acceptance criteria; references docs/spec.md and docs/checklist.md."
metadata:
  version: "1.0.0"
  owner: "ux-review"
  scope: "evaluation"
  evals: "evals/trigger-evals.json, evals/output-evals.json"
---

# Recruiter Portfolio UX

## Activation Scope
Use this skill for:
- 30-second recruiter test evaluation
- Conversion path evaluation (CV/contact)
- Discoverability evaluation (navigation, wayfinding, exploration affordances)
- Motion evaluation:
  - animation quality
  - transition quality
  - interaction quality
  - discoverability impact

Do not use for:
- Implementing UI/components/scenes
- Writing recruiter copy or positioning content
- Architecture governance

## Workflow
1) Identify the recruiter fast path:
   - who/what differentiation
   - CV access
   - contact access
2) Evaluate exploration path:
   - does it reward exploration without hiding basics?
3) Motion evaluation:
   - does motion clarify hierarchy, state, and navigation?
   - does motion add friction (delays, hidden CTAs, forced scrolling)?
   - reduced-motion behavior quality
4) Accessibility and fallback review:
   - keyboard and touch parity
   - screen reader semantics
   - non-WebGL fallback availability
5) Produce an actionable report with acceptance criteria and owner routing.

## Reject Criteria
Reject implementations that are:
- visually static, interaction poor, transitionless, emotionally flat
- inaccessible, motion abusive, performance heavy, recruiter hostile

## Output Contract
Every execution must produce:
- Fast path score (clarity + CV/contact discoverability)
- Exploration score (discoverability + reward vs confusion)
- Motion score (quality + intent + friction)
- Accessibility notes (reduced motion, keyboard, fallback)
- Performance risk notes
- Action list with ownership routing

