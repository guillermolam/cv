# Reduced Motion

Reduced motion is mandatory.

## prefers-reduced-motion Handling
- Detect `prefers-reduced-motion: reduce`.
- Default behavior under reduced motion:
  - no continuous ambient motion
  - no camera drift
  - no particle flow animations

## Motion Reduction Strategies
- Replace animated flows with static lines or low-contrast cues.
- Use user-initiated transitions only (optional).
- Cap or disable parallax and pointer-follow motion.

## Disabling Patterns
- Gate all animation updates behind a single boolean.
- Keep rendering minimal; consider rendering one frame and stopping.
