---
name: "animejs-context7-llms"
description: "Anime.js motion playbook for vanilla DOM in Astro. Invoke when adding timeline-based UI animation, responsive scopes, timers, or reduced-motion safe microinteractions (no React/Tailwind)."
---

# Anime.js (Context7 LLMs) — Astro/Vanilla Motion Playbook

Reference source:
- https://context7.com/websites/animejs/llms.txt?tokens=10000

Project fit:
- Astro-first, progressive enhancement, minimal JS.
- Motion-first, but must not hide primary content.
- Reduced-motion support is mandatory.
- React-free, Tailwind-free.

## When to Invoke

Use this skill when you need:
- A small, controlled animation system for UI microinteractions (hover/press/focus/boot sequences).
- Timeline orchestration (multiple steps, labels, relative offsets).
- Responsive animation definitions (media-query driven).
- Timer-driven UI (range scrubber, play/pause controls).
- Performance governance: pausing/resuming or lowering FPS for ambient motion.

## SSR-Safe + Progressive Enhancement Pattern (Astro)

Run Anime.js only on the client, and only if motion is allowed. Keep server HTML readable without JS.

```astro
---
const { selector = '[data-boot]' } = Astro.props;
---

<div data-boot>
  <slot />
</div>

<script>
  const root = document.currentScript?.previousElementSibling;
  if (!(root instanceof HTMLElement)) throw new Error('Boot root not found');

  const motionOK = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!motionOK) return;

  (async () => {
    const { animate } = await import('animejs');

    animate(root, {
      opacity: [0, 1],
      translateY: ['6px', '0px'],
      duration: 420,
    });
  })();
</script>
```

## Basic Animation + then()

Source: https://animejs.com/documentation/animation/animation-callbacks/then

```js
import { animate, utils } from 'animejs';

const [ $value ] = utils.$('.value');

const animation = animate('.circle', {
  x: '16rem',
  delay: 500,
});

animation.then(() => $value.textContent = 'fulfilled');
```

## Event-Driven Playback (No Autoplay)

Source: https://animejs.com/documentation/animation/animation-methods/play

```js
import { animate, utils, stagger } from 'animejs';

const [ $playButton ] = utils.$('.play');

const animation = animate('.square', {
  x: '17rem',
  ease: 'inOutSine',
  delay: stagger(100),
  autoplay: false,
});

$playButton.addEventListener('click', () => animation.play());
```

## Timeline Orchestration

Source:
- https://animejs.com/documentation/timeline
- https://animejs.com/documentation/timeline/timeline-methods

```js
import { createTimeline } from 'animejs';

const tl = createTimeline({ defaults: { duration: 750 } });

tl.label('start')
  .add('.square', { x: '15rem' }, 500)
  .add('.circle', { x: '15rem' }, 'start')
  .add('.triangle', { x: '15rem', rotate: '1turn' }, '<-=500');
```

## Responsive Motion with createScope + mediaQueries

Source: https://animejs.com/documentation/scope/scope-methods/addonce

Use this to define animations that adapt to layout breakpoints, while keeping “static” animation declarations stable across media query changes.

```js
import { createScope, createTimeline, utils, stagger } from 'animejs';

createScope({
  mediaQueries: {
    isSmall: '(max-width: 200px)',
  },
})
.add((self) => {
  self.addOnce(() => {
    createTimeline().add('.circle', {
      backgroundColor: [
        ($el) => utils.get($el, '--hex-red-1'),
        ($el) => utils.get($el, '--hex-citrus-1'),
      ],
      loop: true,
      alternate: true,
      duration: 2000,
    }, stagger(100));
  });

  self.add(() => {
    createTimeline().add('.circle', {
      x: self.matches.isSmall ? [-30, 30] : [-70, 70],
      scale: [0.5, 1.1],
      loop: true,
      alternate: true,
    }, stagger(100)).init();
  });
});
```

## Engine Controls (Pause/Resume) + FPS Governance

Sources:
- https://animejs.com/documentation/engine/engine-methods/resume
- https://animejs.com/documentation/engine/engine-parameters/fps

Pause/resume:

```js
import { engine } from 'animejs';

engine.pause();
engine.resume();
```

Dynamic FPS tuning (useful for “ambient” effects on low-power devices):

```js
import { engine, utils } from 'animejs';

const [ $range ] = utils.$('.range');

$range.addEventListener('input', function onInput() {
  engine.fps = this.value;
});
```

## Timers (Scrubbable Range + Play/Pause)

Source: https://animejs.com/documentation/timer/timer-methods/seek

```js
import { createTimer, utils } from 'animejs';

const [ $range ] = utils.$('.range');
const [ $playPauseButton ] = utils.$('.play-pause');
const [ $time ] = utils.$('.time');

const updateButtonLabel = (timer) => {
  $playPauseButton.textContent = timer.paused ? 'Play' : 'Pause';
};

const timer = createTimer({
  duration: 2000,
  autoplay: false,
  onUpdate: (self) => {
    $range.value = self.currentTime;
    $time.innerHTML = self.currentTime;
    updateButtonLabel(self);
  },
  onComplete: updateButtonLabel,
});

$range.addEventListener('input', () => timer.seek(+$range.value));
$playPauseButton.addEventListener('click', () => {
  if (timer.paused) timer.play();
  else {
    timer.pause();
    updateButtonLabel(timer);
  }
});
```

## Text: Split Lines for Reveal Animations

Source: https://animejs.com/documentation/text/splittext/textsplitter-settings/lines

Use only for non-critical decorative reveals; content must remain readable without JS.

```js
import { animate, splitText, stagger } from 'animejs';

splitText('p', {
  lines: { wrap: 'clip' },
})
.addEffect(({ lines }) => animate(lines, {
  y: [
    { to: ['100%', '0%'] },
    { to: '-100%', delay: 750, ease: 'in(3)' },
  ],
  duration: 750,
  ease: 'out(3)',
  delay: stagger(200),
  loop: true,
  loopDelay: 500,
}));
```

## Utilities: stagger() + shuffle()

Sources:
- https://animejs.com/documentation/utilities/stagger/stagger-parameters/stagger-from
- https://animejs.com/documentation/utilities/shuffle

```js
import { utils, animate, stagger } from 'animejs';

const squares = utils.$('.square');
const x = stagger('3.2rem');

utils.set(squares, { x });

animate(utils.shuffle(squares), { x });
```

## Project Guardrails

- Prefer CSS for simple hovers/press states; use Anime.js for orchestrated, stateful sequences.
- Gate all non-essential motion behind `prefers-reduced-motion`.
- Lazy-load Anime.js for sections that are offscreen (IntersectionObserver) to keep initial JS small.
