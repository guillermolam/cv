/**
 * Central GSAP plugin registry.
 *
 * Import this module (client-side only) before calling any plugin API.
 * All FREE plugins bundled in the gsap npm package are registered here.
 *
 * Club plugins (DrawSVGPlugin, MorphSVGPlugin, ScrambleTextPlugin,
 * ScrollSmoother, Physics2DPlugin, PhysicsPropsPlugin, PixiPlugin,
 * InertiaPlugin, MotionPathHelper, GSDevTools, EaselPlugin) require a
 * GSAP Club license from https://gsap.com/pricing — drop their files into
 * this project and add them to the registerPlugin() call below.
 */

import gsap from 'gsap';
import { CSSRulePlugin }   from 'gsap/CSSRulePlugin';
import { CustomBounce }    from 'gsap/CustomBounce';
import { CustomEase }      from 'gsap/CustomEase';
import { CustomWiggle }    from 'gsap/CustomWiggle';
import { Draggable }       from 'gsap/Draggable';
import { EasePack }        from 'gsap/EasePack';
import { Flip }            from 'gsap/Flip';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Observer }        from 'gsap/Observer';
import { ScrollToPlugin }  from 'gsap/ScrollToPlugin';
import { ScrollTrigger }   from 'gsap/ScrollTrigger';
import { SplitText }       from 'gsap/SplitText';
import { TextPlugin }      from 'gsap/TextPlugin';

gsap.registerPlugin(
  CSSRulePlugin,
  CustomBounce,
  CustomEase,
  CustomWiggle,
  Draggable,
  EasePack,
  Flip,
  MotionPathPlugin,
  Observer,
  ScrollToPlugin,
  ScrollTrigger,
  SplitText,
  TextPlugin,
);

// ─── Project eases ─────────────────────────────────────────────────────────
// Register named eases so every script can use them by name.
CustomEase.create('ds.softOut',        '0.2, 0.8, 0.2, 1');
CustomEase.create('ds.emphasis',       '0.16, 1, 0.3, 1');
CustomEase.create('ds.pressIn',        '0.4, 0, 0.8, 0.6');
CustomEase.create('ds.cinematicReveal','0.1, 0.95, 0.2, 1');

export {
  gsap,
  CSSRulePlugin,
  CustomBounce,
  CustomEase,
  CustomWiggle,
  Draggable,
  EasePack,
  Flip,
  MotionPathPlugin,
  Observer,
  ScrollToPlugin,
  ScrollTrigger,
  SplitText,
  TextPlugin,
};
