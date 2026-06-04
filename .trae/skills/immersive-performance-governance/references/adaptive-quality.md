# Adaptive Quality (Baseline)

Principle: preserve smooth interaction over visual complexity.

## Capability Signals
- reduced motion preference
- viewport size (mobile vs desktop)
- device memory / low-end heuristic (when available)
- WebGL availability
- page visibility (hidden/offscreen)

## Degradation Defaults
- Reduced motion:
  - disable continuous loops
  - replace long transitions with instant or short crossfades
- Mobile/low-end:
  - cap DPR
  - reduce particles/lines density
  - reduce post-processing
  - pause rendering when offscreen
- Background/hidden:
  - pause RAF
  - stop expensive timers

