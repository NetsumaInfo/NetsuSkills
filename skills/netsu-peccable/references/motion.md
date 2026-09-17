# Motion: animations and micro-interactions

Add, fix or remove movement in an interface. Read the `Motion:` line of `## Look` first
(`minimal` or `standard`, with its durations). It wins over the defaults below.

## 1. Does it earn its place

Keep an animation only if removing it would lose information.

| Purpose | Example | Keep |
|---|---|---|
| Feedback | A button reacts to the press; a toggle slides | Yes |
| Continuity | A menu grows from its trigger; a row moves to its new sorted place | Yes |
| State change | Loading turns into done; a section expands | Yes |
| Orientation | A mobile screen pushes in from the side it came from | Yes |
| Decoration | Hover lift on cards, floating shapes, every section fading in on scroll | No |

`## Look` says `minimal`: feedback and state change only.

An action repeated many times a minute (typing, row hover, tab switching, arrow keys) changes at
once, or with a colour transition of 100 ms at most. Every animated change leaves a static cue when
it ends: a colour, an icon or a label (Krehel, github.com/jakubkrehel/skills, read 2026-09-17,
`better-ui`).

A moment of delight or an ambitious effect is a request of its own: `references/delight.md`,
`references/effects.md`. A landing page may have one entrance on the first view, 100 to 500 ms.
Content is there without script: never start a section at `opacity: 0` and wait for JavaScript or a
scroll observer.

## 2. Timing

| Use | Duration | Why this range |
|---|---|---|
| Press, toggle, hover colour | 100 to 150 ms | NN/g: simple feedback about 100 ms. Material 3: short2 to short3 |
| State change in place (expand, select, tab indicator) | 150 to 250 ms | Material 3: short3 to medium1 |
| Enter: menu, popover, panel, dialog, list item | 200 to 300 ms | NN/g: 200 to 300 ms for a modal. Material 1: 225 ms to enter |
| Exit | about two thirds of the enter: 100 to 200 ms | NN/g: 300 ms in, 200 to 250 ms out. Material 1: 195 ms to leave |
| Full-screen change on mobile | 300 to 400 ms | Material 1: 300 ms typical, 375 ms for large transitions |

- Desktop takes the low end of each range: Material 1 gives 150 to 200 ms for desktop.
- Longer travel, longer duration. Nothing in product UI goes past 300 ms except a full-screen
  change on mobile.
- Feedback that takes longer than 150 ms reads as lag.

Sources, all read 2026-09-16:

- Material Design 3 motion tokens (github.com/material-components/material-web,
  `tokens/versions/v0_192/_md-sys-motion.scss`): short1 to short4 = 50, 100, 150, 200 ms;
  medium1 to medium4 = 250, 300, 350, 400 ms; long1 to long4 = 450, 500, 550, 600 ms.
- Material Design 1, "Duration & easing" (m1.material.io): mobile 300 ms typical, 375 ms for
  large transitions, 225 ms to enter, 195 ms to leave, desktop 150 to 200 ms.
- Nielsen Norman Group, nngroup.com/articles/animation-duration (2020-02-09): most animations
  100 to 500 ms; simple feedback about 100 ms; a popup 300 ms to appear and 200 to 250 ms to
  disappear; ease-out to enter, ease-in to exit.

Tokens, written once:

```css
:root {
  --dur-feedback: 120ms;
  --dur-state: 200ms;
  --dur-enter: 240ms;
  --dur-exit: 160ms;
  --ease-enter: cubic-bezier(0, 0, 0, 1);   /* Material 3 standard-decelerate */
  --ease-exit: cubic-bezier(0.3, 0, 1, 1);  /* Material 3 standard-accelerate */
  --ease-move: cubic-bezier(0.2, 0, 0, 1);  /* Material 3 standard, for on-screen moves */
  --shift: 8px;                             /* enter distance */
  --press: 0.97;                            /* press scale */
}
```

Tailwind v4: `duration-(--dur-enter) ease-(--ease-enter)`.

## 3. Easing

- Enter: decelerate (ease-out). Exit: accelerate (ease-in). A move on screen: standard.
- No bounce, no elastic, no overshoot in product UI: no cubic-bezier with a y value outside 0
  to 1, no spring with bounce. With Motion: `{ type: "spring", bounce: 0, duration: 0.3 }`.
- Linear only for progress bars and spinners.

## 4. Properties

| Allowed | For |
|---|---|
| `transform` (translate, scale, rotate), `opacity` | Movement, fades, press |
| `color`, `background-color`, `border-color`, `outline-color`, `box-shadow` | Hover and focus on a small control; they repaint, they do not reflow |

Never animate `width`, `height`, `top`, `left`, `right`, `bottom`, `margin`, `padding` or
`font-size`: they reflow the page every frame. Never `transition: all` or `transition-all`: list
the properties.

```tsx
// before
<button className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">Export</button>
// after
<button className="transition-[transform,background-color] duration-100 ease-out hover:bg-accent/90 active:scale-[0.97] motion-reduce:active:scale-100">
  Export
</button>
```

- Height reveal (accordion): fade and shift the content, or use the height variable the
  component library already exposes (Radix: `--radix-accordion-content-height`). Do not write
  a `height` transition.
- `will-change: transform` only while the animation runs, only when the first frame stutters.
- React Native `Animated`: `useNativeDriver: true`, which only accepts transform and opacity.
- Continuity between pages: the View Transitions API where the stack supports it. Without it, the
  instant change is the fallback, never a hand-built page slide.

## 5. Press and hover

- Press: scale 0.96 to 0.98, never below 0.95, 100 ms. Buttons, icon buttons, chips, list
  items that act like buttons.
- No press scale on text links, table rows or large cards: scaling a big surface looks like a
  glitch.
- Hover changes colour or background. It does not lift, slide or grow navigation and cards.
- Icon swap (copy to check, play to pause): cross-fade with a slight scale, 100 to 150 ms, in a
  box of fixed size so the button does not jump.
- Tailwind v4 already limits `hover:` to devices that can hover. In plain CSS, wrap hover rules
  in `@media (hover: hover)`.
- React Native: `Pressable` with
  `style={({ pressed }) => ({ transform: [{ scale: pressed ? 0.97 : 1 }] })}`.

## 6. Reduced motion

Keep the opacity and colour feedback. Drop the movement.

```css
@keyframes enter {
  from { opacity: 0; transform: translateY(var(--shift)); }
}
.menu[data-state="open"] { animation: enter var(--dur-enter) var(--ease-enter); }
.btn:active { transform: scale(var(--press)); }

@media (prefers-reduced-motion: reduce) {
  :root { --shift: 0px; --press: 1; }  /* menus still fade; nothing travels or shrinks */
  .skeleton { animation: none; }
  html { scroll-behavior: auto; }
}
```

- Tailwind: `motion-reduce:` and `motion-safe:` variants.
- Motion for React: `<MotionConfig reducedMotion="user">` at the root. It turns off transform
  and layout animations and keeps opacity and backgroundColor (motion.dev, read 2026-09-16).
- React Native: `AccessibilityInfo.isReduceMotionEnabled()`, or `useReducedMotion()` from
  Reanimated; swap the translate for a fade.
- Autoplaying loops stop when reduced motion is on, and when they leave the screen.

## 7. Stagger

- Only when a list arrives as a list: first load of results, a search response. Never on
  re-render, re-sort, filter, or on every scrolled section.
- At most 5 items staggered, 40 ms apart; the rest arrive with the fifth.

```css
.stagger > * { animation: enter var(--dur-enter) var(--ease-enter) both; }
.stagger > :nth-child(2) { animation-delay: 40ms; }
.stagger > :nth-child(3) { animation-delay: 80ms; }
.stagger > :nth-child(4) { animation-delay: 120ms; }
.stagger > :nth-child(n+5) { animation-delay: 160ms; }
```

- Components that toggle (tabs, accordions, presence) skip their animation on first render.
  Motion: `<AnimatePresence initial={false}>`.

## 8. No idle motion

- No float, bob, pulse, ping or glow loop on buttons, badges, icons or calls to action.
- Anything that moves on its own for more than 5 s (carousel, marquee, video behind text) gets a
  pause control (WCAG 2.2 SC 2.2.2, level A, read 2026-09-17).
- Exceptions: a skeleton placeholder, and a spinner or progress bar tied to real work. The
  skeleton stays subtle and stops when content arrives:

```css
.skeleton { background: var(--color-line); animation: skeleton 1.6s ease-in-out infinite; }
@keyframes skeleton { 50% { opacity: 0.55; } }
```

When a loader appears at all is in `references/states.md`.

## 9. Tools

```bash
grep -oE '"(motion|framer-motion|gsap|react-spring|@react-spring/web|react-native-reanimated|tw-animate-css|tailwindcss-animate)"' package.json
```

- CSS first: transitions for state (they can be interrupted midway), keyframes for one-off
  enters.
- Motion for React (`motion/react`, or `framer-motion` in older projects) only if it is already
  a dependency. Never add a dependency for one effect.
- Exit animations need the element to stay mounted: the library's presence component, Radix
  `data-state="closed"` with an exit keyframe, or `@starting-style` with
  `transition-behavior: allow-discrete` (Chromium 117 and later, so not in Adobe CEP panels).
- Adobe CEP 11 and 12 (Chromium 88 and 99) support `prefers-reduced-motion`; test motion in the
  host app, not only in a desktop browser.

## 10. Proof

Pick the checks that show the change you made. A duration fix needs the scan and one capture, not
the whole list.

- Screenshots of each state: rest, hover, pressed, focus-visible, open. Slow the animation to
  10% in Chrome DevTools (More tools, Animations) to catch the in-between frames.
- Reduced motion emulated (DevTools, Rendering, "Emulate CSS media feature
  prefers-reduced-motion"): the same interaction fades, nothing travels.
- Timing as it runs: paste this in the console right after the interaction. A CSS transition
  carries its easing in `getTiming()`, a CSS animation in its keyframes (checked in Chromium,
  2026-09-17). Durations and easings must match the `## Look` values.

```js
document.getAnimations().map((a) => ({ what: a.transitionProperty ?? a.animationName, ms: a.effect.getTiming().duration, easing: a.effect.getTiming().easing, keyframes: a.effect.getKeyframes().map((k) => k.easing).join(",") }))
```

- Layout shifts: record the interaction in the Performance panel; the Layout shifts track stays
  empty. Or paste this in the console, run the interaction, and expect no line:

```js
new PerformanceObserver((list) => {
  for (const e of list.getEntries()) console.log("layout shift", e.value.toFixed(4), e.hadRecentInput ? "after input" : "");
}).observe({ type: "layout-shift", buffered: true });
```

- In a Playwright check: `await page.emulateMedia({ reducedMotion: "reduce" })` before the
  screenshot.
- `node <skill dir>/scripts/scan.mjs ui <changed files>`: zero `transition-all`; each
  `bounce-pulse` finding is a skeleton, a loader tied to real work, or gets removed.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| `transition-all duration-300` on every element | The properties that change, 100 to 250 ms |
| Every section fades up on scroll | Motion only where it carries feedback, continuity or state |
| Cards lift and grow a shadow on hover | A colour or background change |
| `active:scale-90` | 0.96 to 0.98, never below 0.95 |
| Bouncy spring on a dialog | Decelerate in, accelerate out, no overshoot |
| `animate-pulse` on the call to action | Idle loops only on skeletons |
| `prefers-reduced-motion` sets every duration to 0 | Movement off, fades and colour feedback kept |
| Animating `height` for an accordion | Fade and shift, or the library's measured height |
| Installing an animation library for one fade | CSS, or the library already in `package.json` |
| Exit as slow as enter | Exit at about two thirds of the enter |
| "It feels smooth" | State screenshots, reduced-motion capture, an empty layout-shift log |
