# Motion: animations and micro-interactions

Add, fix or remove movement in an interface. Read the `Motion:` line of `## Look` first
(`minimal` or `standard`, with its durations). It wins over the defaults below.

Four files carry the rest: `references/motion-recipes.md` for the per-component implementations,
`references/gestures.md` for anything a finger drives, `references/mobile.md` for phones and
React Native, `references/motion-words.md` when the request names motion vaguely ("make it pop",
"smoother", "more alive"). Load one only when the request is about it.

## 1. Does it earn its place

Two questions, in this order. Both can end in zero lines of code, which is a result, not a dodge.

**How often does the user see it?**

| Frequency | Verdict |
|---|---|
| 100+ times a day: keyboard shortcuts, command palette, tab switches, in-app route changes, list rows | No animation. Ever |
| Tens of times a day: hover, list navigation, frequent toggles | Near-imperceptible, or nothing |
| Occasional: modals, drawers, toasts, settings | Standard animation |
| Rare or first-time: onboarding, empty state, success, celebration | The delight budget lives here |

A keyboard-initiated action is a disqualifier, not a judgment call. Raycast has no open or close
animation, which is correct for something opened hundreds of times a day. Tabs are peers: they
never slide, because sliding implies depth.

**What is it for?** Name one word before building: feedback, continuity (spatial consistency),
state change, orientation, explanation (marketing and onboarding only), delight (rare tier only).
Cannot name it? Do not build it. "It looks cool" on a frequent surface is a reason to stop.

Then one check: **data the user reads or acts on does not move for style.** A chart, a table, a
total. Motion is allowed only when it shows a real change in value on a user action — never on
every mount or refresh. A mouse-tracking effect belongs on a landing page, not on a balance.

`## Look` says `minimal`: feedback and state change only.

Every animated change leaves a static cue when it ends: a colour, an icon or a label.

**Reducing instead of deleting**, when the purpose holds but the tier is too frequent:

| Today | Reduced to |
|---|---|
| Hover with scale, lift or shadow growth | Colour or opacity only, 150 ms at most, `ease` |
| Slide or scale entrance on a frequent surface | Opacity only, 150 ms |
| Over 300 ms on product UI | 200 to 250 ms, same curve |
| Stagger over 300 ms in total | 30 ms a step, or fade the group as one |
| Infinite loop on a persistent element | Run once, keep the static end state |

If reducing leaves too little to carry the purpose, delete it.

A moment of delight or an ambitious effect is a request of its own: `references/delight.md`,
`references/effects.md`. A landing page may have one entrance on the first view, 100 to 500 ms.
Content is there without script: never start a section at `opacity: 0` and wait for JavaScript or
a scroll observer.

## 2. Timing

| Use | Duration |
|---|---|
| Press, toggle, hover colour | 100 to 160 ms |
| Tooltip, small popover | 125 to 200 ms |
| Dropdown, select, state change in place | 150 to 250 ms |
| Modal | 200 to 300 ms |
| Exit | about two thirds of the enter |
| Drawer or sheet travelling its own height | 300 to 500 ms |
| Full-screen change on mobile | 300 to 400 ms |
| Hold-to-confirm fill | 1.5 to 2 s, `linear` |

Product UI stays under 300 ms; the last three rows are the whole list of exceptions. A 180 ms
dropdown feels more responsive than a 400 ms one. Longer travel, longer duration; desktop takes
the low end. Feedback over 160 ms reads as lag.

Perceived speed is part of real speed: a faster spinner makes the same load feel shorter, and a
tooltip that opens instantly after the first one makes a whole toolbar feel faster.

Sources, read 2026-09-16: NN/g, nngroup.com/articles/animation-duration (2020-02-09), 100 to
500 ms overall and ~100 ms for simple feedback; Material Design 3 motion tokens, short1–4 = 50 to
200 ms, medium1–4 = 250 to 400 ms.

```css
:root {
  --dur-feedback: 120ms;
  --dur-state: 200ms;
  --dur-enter: 240ms;
  --dur-exit: 160ms;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);      /* UI: enter, exit, press */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);  /* moving across the screen */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);   /* sheets, drawers (Vaul's shipped curve) */
  --enter-scale: 0.96;                             /* entrance scale, never 0 */
  --press: 0.97;
  --shift: 8px;
}
```

Extend the project's tokens; never add a parallel set. Tailwind v4:
`duration-(--dur-enter) ease-(--ease-out)`.

## 3. Easing

- **Entering or exiting: `ease-out`.** Moving or morphing on screen: `ease-in-out`. Hover or
  colour: `ease`. Constant motion (marquee, progress, a hold fill): `linear`. Default: `ease-out`.
- **Never `ease-in` on UI.** It starts slow and delays the exact moment the user is watching:
  `ease-out` at 200 ms *feels* faster than `ease-in` at 200 ms. An exit reads as leaving because
  it is **shorter**, not because it accelerates. NN/g notes the same risk for accelerating curves
  ("can feel unresponsive", read 2026-11-01); Material's accelerate token is the other school and
  is not what this skill uses.
- **The built-in CSS curves are too weak** to read as deliberate. Use the tokens above, or take a
  curve from easing.dev or easings.co. Never hand-roll one, and never invent
  `cubic-bezier(0.4, 0, 0.2, 1)` from memory.
- No overshoot in product UI: no cubic-bezier with a y outside 0 to 1. Spring bounce is allowed in
  one place only, after a gesture with momentum: `references/gestures.md` §4.

## 4. Properties

| Allowed | For |
|---|---|
| `transform` (translate, scale, rotate), `opacity` | Movement, fades, press. Composited, off the main thread |
| `clip-path: inset(…)` | Reveals, hold fills, seamless tab colour changes, comparison sliders |
| `filter: blur()` under 20 px | Masking a crossfade that two overlapping states spoil |
| `color`, `background-color`, `border-color`, `outline-color` | Hover and focus on a small control: they repaint, they do not reflow |

- Never `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding`, `gap` or
  `font-size`: they re-lay out the page every frame, and they move the element's neighbours too.
  Grow with `scale()`, move with `translate()`, show and hide with `opacity`.
- `box-shadow` repaints every frame: for a shadow that animates, `filter: drop-shadow()`.
- Accordion: the component library's measured height variable first (Radix:
  `--radix-accordion-content-height`). A pixel height measured in JS may be transitioned, 200 ms.
  Never to `auto`.
- Percentages in `translate()` are the element's own size: `translateY(100%)` is its height
  whatever the content. Prefer them to hard-coded pixels.
- Never drive a child's transform from a custom property on the parent: changing a variable on a
  parent recalculates styles for every descendant, every frame. Set `transform` on the element.
- `will-change: transform` only on a measured cost, on the animating element, never on `*` or a
  large container. Every promoted layer costs GPU memory.
- Continuity between pages: the View Transitions API where the stack supports it. Without it, the
  instant change is the fallback, never a hand-built page slide.

## 5. Press and hover

- Press: `scale(0.96)` to `0.98`, never below 0.95, 100 to 160 ms. `scale()` carries the label and
  icons with it, which is why it reads as a press. Buttons, icon buttons, chips, list items that
  act like buttons.
- **Feedback starts on pointer-down, not on `click` or release.** Waiting for the release reads as
  lag. `:active` is a real press on touch, so it needs no gating.
- No press scale on text links, table rows or large cards: scaling a big surface looks like a
  glitch.
- Hover changes colour or background. It does not lift, slide or grow navigation and cards, and
  every hover rule sits in `@media (hover: hover) and (pointer: fine)` — `pointer: fine` is what
  excludes a stylus and the Android devices that claim hover and then stick it on after a tap.
  Tailwind v4 compiles `hover:` to that query already; v3 needs
  `future.hoverOnlyWhenSupported`.
- A popover, dropdown, menu or tooltip scales out of its trigger:
  `transform-origin: var(--transform-origin)` (Base UI; Radix exposes
  `--radix-popover-content-transform-origin`). **Modals are exempt** — nothing anchors them, so
  they stay centred.
- Icon swaps, counters, tab indicators and every other per-component recipe:
  `references/motion-recipes.md`.

## 6. Reduced motion

Fewer and gentler, not none. Keep the opacity and colour feedback that explains a state change;
drop travel, scale, parallax and overshoot.

```css
@keyframes enter { from { opacity: 0; transform: scale(var(--enter-scale)); } }
.menu[data-state="open"] { animation: enter var(--dur-enter) var(--ease-out); }
.btn:active { transform: scale(var(--press)); }

@media (prefers-reduced-motion: reduce) {
  :root { --enter-scale: 1; --shift: 0px; --press: 1; }  /* menus still fade; nothing travels */
  .skeleton { animation: none; }
  html { scroll-behavior: auto; }
}
```

- Tailwind: `motion-reduce:` and `motion-safe:`. Motion for React:
  `<MotionConfig reducedMotion="user">` at the root, which disables transform and layout
  animations and keeps opacity and backgroundColor (motion.dev, read 2026-09-16).
- Large moving surfaces fade out while they travel and back in once settled. No full-viewport
  moving background, no slow loop near 0.2 Hz.
- `prefers-reduced-transparency: reduce`: translucent surfaces go solid, `backdrop-filter: none`.
  Autoplaying loops stop, and stop when they leave the screen. React Native: `mobile.md`.

## 7. Stagger

- Only when a list arrives as a list: a first load, a search response, content the user is waiting
  on. Never on re-render, re-sort, filter, or on every scrolled section. A list scrolled past all
  day is already there.
- 30 to 80 ms a step, **300 ms for the whole group** at most. Past that, the items left over
  arrive with the last staggered one, or the group fades as one.
- Stagger is decorative: it never blocks interaction while it plays.
- Components that toggle (tabs, accordions, presence) skip their animation on first render:
  `<AnimatePresence initial={false}>`.

## 8. No idle motion

- No float, bob, pulse, ping or glow loop on buttons, badges, icons or calls to action. Anything
  moving on its own past 5 s (carousel, marquee, video behind text) gets a pause control (WCAG 2.2
  SC 2.2.2, level A, read 2026-09-17).
- Exceptions: a skeleton, and a spinner or bar tied to real work. Neither appears for work
  finishing under 300 ms — the flash reads as a glitch.

```css
.skeleton { background: var(--color-line); animation: skeleton 1.6s ease-in-out infinite; }
@keyframes skeleton { 50% { opacity: 0.55; } }
```

When a loader appears at all is in `references/states.md`.

## 9. Tools and interruptibility

```bash
grep -oE '"(motion|framer-motion|gsap|react-spring|@react-spring/web|react-native-reanimated|tw-animate-css|tailwindcss-animate)"' package.json
```

Cheapest that works, in order: CSS transition (state you control with a class or attribute) →
`@starting-style` (entry with no JS) → CSS animation (predetermined motion that must survive a
busy page: it runs off the main thread) → WAAPI `element.animate()` (JS control, CSS performance,
no dependency) → Motion (springs, layout animations, exit animations, gestures). Never add a
dependency for one fade.

- **Transitions retarget from the current value. Keyframes restart from zero.** Anything that can
  fire twice in a second — a stacking toast, a toggle, an expand — uses transitions or a spring.
  Keyframes are for genuinely one-off motion.
- Exit animations need the element mounted: the library's presence component, Radix
  `data-state="closed"` with an exit transition, or `@starting-style` with
  `transition-behavior: allow-discrete` (Chromium 117+, so not in Adobe CEP panels).
- An interrupted animation restarts from the **live on-screen value**, never from the target.
- Motion `x`/`y`/`scale` shorthands: hardware-accelerated from Motion 14.2.0 (changelog
  2026-10-13, read 2026-11-01). Below that version they run on the main thread and drop frames on
  a busy page — then animate the full `transform` string. Check the installed version before
  reporting it.
- Adobe CEP 11 and 12 (Chromium 88 and 99) support `prefers-reduced-motion`; test in the host app.

## 10. Order of fixes

Prefer the earliest that solves it: delete it → reduce it → fix the easing → fix the origin and
the entrance scale → make it interruptible → move it off the main thread → asymmetric timing (slow
where the user decides, snappy where the system answers) → polish (blur mask, stagger,
`@starting-style`) → accessibility and cohesion.

Cohesion is last and it is real: a playful product may be slower and softer, a dashboard stays
crisp, and five near-identical hand-typed curves in one codebase is a consolidation finding.

## 11. Proof

Pick the checks that show the change you made. A duration fix needs the scan and one capture.

- Screenshots of each state: rest, hover, pressed, focus-visible, open. Slow playback to 10% in
  Chrome DevTools (More tools, Animations) to catch the in-between frames, and step coordinated
  properties frame by frame.
- Reduced motion emulated (Rendering, "Emulate CSS media feature prefers-reduced-motion"): the
  same interaction fades, nothing travels.
- Timing as it runs, pasted in the console right after the interaction. A CSS transition carries
  its easing in `getTiming()`, a CSS animation in its keyframes (checked in Chromium, 2026-09-17):

```js
document.getAnimations().map((a) => ({ what: a.transitionProperty ?? a.animationName, ms: a.effect.getTiming().duration, easing: a.effect.getTiming().easing, keyframes: a.effect.getKeyframes().map((k) => k.easing).join(",") }))
```

- Layout shift: record the interaction in the Performance panel and expect an empty Layout shifts
  track, or run this and expect no line:

```js
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) console.log("layout shift", e.value.toFixed(4), e.hadRecentInput ? "after input" : "");
}).observe({ type: "layout-shift", buffered: true });
```

- `node <skill dir>/scripts/scan.mjs ui <changed files>`: zero `transition-all`; each
  `bounce-pulse` finding is a skeleton or a loader tied to real work, or it goes. In Playwright,
  `await page.emulateMedia({ reducedMotion: "reduce" })` before the screenshot.
- Frame rate is judged on a mid-range phone, never on the development machine. Anything that needs
  a device and did not get one is reported `Not verified`.
- Feel that code cannot settle — a crossfade, a spring's bounce, opacity against height in an
  entering list — is named as such: play it at 2 to 5× duration, then look again the next day.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| `transition-all duration-300` everywhere | The properties that change, 100 to 250 ms |
| `ease-in` on an exit | `ease-out`, and a shorter duration |
| Built-in `ease-out` on deliberate motion | `cubic-bezier(0.23, 1, 0.32, 1)` |
| `scale(0)` entrance | `scale(0.96)` with `opacity: 0` |
| `transform-origin: center` on a popover | The trigger's origin (modals exempt) |
| Animation on a command palette or shortcut | None, at any duration |
| Every section fades up on scroll | Motion only where it carries feedback, continuity or state |
| Cards lift and grow a shadow on hover | A colour or background change, behind `(pointer: fine)` |
| `active:scale-90` | 0.96 to 0.98 |
| Feedback on `click` instead of pointer-down | Pointer-down |
| Bouncy spring on a dialog | No overshoot outside a momentum gesture |
| `animate-pulse` on the call to action | Idle loops only on skeletons |
| `prefers-reduced-motion` sets every duration to 0 | Movement off, fades and colour kept |
| Animating `height`, `width` or `padding` | `scale()`, or a measured height for an accordion only |
| Keyframes on a toast or a toggle | Transitions, which retarget mid-flight |
| Installing a motion library for one fade | CSS, or what is already in `package.json` |
| Exit as slow as the enter | About two thirds |
| Spinner on a 100 ms request | No loader under 300 ms |
| "It feels smooth" | State screenshots, a reduced-motion capture, an empty layout-shift log |
