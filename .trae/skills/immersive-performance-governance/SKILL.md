---
name: immersive-performance-governance
description: "Use this skill when working on performance governance for animation-heavy or WebGL-heavy experiences: adaptive quality, frame-rate stability, memory/GPU cleanup, battery impact, and degraded modes (mobile/reduced-motion/no-WebGL). Owns performance acceptance criteria and stop/go decisions. Do not use for copywriting or deployment."
compatibility: "Trae SOLO / Claude Code / Claude.ai. Produces budgets, perf gates, profiling plans, and adaptive-quality rules; may route implementation to Astro/Three.js owner skills."
metadata:
  version: "1.0.0"
  owner: "performance-governance"
  scope: "perf-standards"
  references: "references/*.md"
  evals: "evals/trigger-evals.json, evals/output-evals.json"
---

# Immersive Performance Governance

## Activation Scope
Use this skill for:
- Setting performance budgets for motion/WebGL work (FPS, memory, CPU, battery)
- Defining adaptive-quality strategies (DPR caps, effect toggles, LOD, particle caps)
- Ensuring lifecycle cleanup (RAF control, disposal, event listener cleanup)
- Defining “safe defaults” for mobile and reduced motion
- Go/no-go review when an experience risks usability or recruiter flow

Do not use this skill for:
- Implementing scenes/components directly (route to owners)
- Narrative pacing and storytelling design (route to immersive-storytelling)
- Deployment/CI workflows

## Required Inputs
- Target surface and the intended effect (what motion/WebGL is trying to communicate)
- Device targets (desktop focus vs mobile parity)
- Constraints (reduced motion, non-WebGL fallback, touch/scroll stability)
- Optional: current metrics/symptoms (jank, high CPU, overheating, crashes)

## Workflow
1) Identify perf risk profile (motion-only UI vs WebGL vs mixed).
2) Define budgets and failure thresholds (project-appropriate and explicit).
3) Define adaptive-quality and degradation paths:
   - reduced motion
   - low-end mobile
   - background tab / offscreen
   - no-WebGL
4) Define profiling/validation steps (what to measure and how to verify).
5) Define acceptance criteria and stop conditions.
6) Route implementation tasks to owner skills with explicit constraints.

## Stop Conditions
Stop and escalate if:
- The experience requires continuous animation to read/navigate.
- The design cannot degrade for reduced motion or mobile without losing usability.
- WebGL behavior is uncertain and cannot be verified safely.

## Output Contract
Every execution must produce:
- Performance budgets (what is constrained and why)
- Degradation map (capability → behavior)
- Validation plan (how to verify; what constitutes failure)
- Risk register (what could go wrong and mitigations)
- Owner routing (who implements which parts)

