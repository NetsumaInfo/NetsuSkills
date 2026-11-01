# Performance: how fast the interface feels

Find what makes a screen slow to appear or slow to respond, fix that, and measure again. Load this
only when the user says a screen is slow, janky, laggy or heavy, or asks for a performance check
of the interface. Server and database speed belong to the project's backend work.

## 0. Frame

| | |
|---|---|
| Changes | The one bottleneck §2 found, in the named screen: images, fonts, rendering, animation, list rendering, bundle split |
| Never changes | The look, the content, the behaviour. No rewrite, no new framework, no caching layer unasked |
| Asks first | Nothing. A fix that needs a new dependency is proposed, not installed |
| Stops when | The measured number has moved past its target, or the cause is reported with its size |
| Returns | The before and after numbers of §5, and what changed |

Measure first. A fix without a number before and after is a guess.

## 1. Measure

| What is slow | Measure with | Good (web.dev, *Web Vitals*, read 2026-09-17) |
|---|---|---|
| The screen appears late | LCP in the Performance panel or Lighthouse | 2.5 s or less |
| A click or keypress answers late | INP; the Performance panel's interactions track | 200 ms or less |
| Things jump while loading | CLS; the Layout shifts track | 0.1 or less |
| Scrolling or an animation stutters | Frames in the Performance panel | No long frames during the interaction |
| The app is heavy to start | Bundle report of the build tool | The biggest chunks named, with sizes |

Web Vitals are measured at the 75th percentile of real page loads (same source); a local run is
a lead. A desktop app (Tauri, Electron) has no LCP from users: measure the time from launch to the
first usable screen, and the interaction timings, on the slowest machine the product supports.
Record the conditions: device, throttling, build (production, never dev).

## 2. Find the cause, in this order

1. **Images.** Width and height on every image (no shift), sizes that match the display,
   `srcset` for large ones, `loading="lazy"` below the fold only and never on the first visible
   image, a modern format where the pipeline supports it.
2. **Fonts.** Only the weights in use, `woff2`, `font-display: swap`, preloaded when a font
   draws the first visible text (`references/typography.md` §4).
3. **Layout shift.** Space reserved for content that arrives later: skeletons with the final
   size (`references/states.md`, Loading), no banner pushing the page down.
4. **Long lists.** More than a few hundred rows render only what is visible (virtualisation).
   Pagination changes what the user sees: it is a proposal in the report.
5. **Work on input.** Filtering, sorting or parsing on each keystroke is debounced or moved off
   the main thread; a click answers first, then works.
6. **Re-renders.** In React, a parent state that re-renders a whole table on each keystroke;
   React DevTools Profiler shows it. React Doctor (`references/review-ui.md` §3) flags common
   cases; it downloads a package, ask first.
7. **Animation.** Movement uses only `transform` and `opacity` (`references/motion.md` §4); no
   `transition: all`. When the symptom is dropped frames, write the inventory of §6.1 first, then
   work down this list, ordered by how often each is the cause. Name the one that explains the
   recording and stop there:
   1. Which properties animate? Layout ones first (`width`, `height`, `padding`, `margin`, `top`,
      `left`), then `box-shadow` and `border-radius`, which do not look like layout and are missed.
   2. Does the jank coincide with a busy page: navigation, a fetch, hydration, a long task? Then
      the driver is the cause (§6.3): move the motion to CSS or WAAPI.
   3. Is React re-rendering every frame from a `requestAnimationFrame`, `pointermove` or `scroll`
      handler (§6.4)?
   4. Does it get worse as content grows? That points at an inherited custom property (§6.4) or
      too many nodes animating at once.
   5. Is a CSS variable animated at all, directly or through a motion library's shorthand? Check
      the installed Motion version before reporting `x`/`y` (§6.3).
   6. Any animated `blur()` over 20 px? Safari pays most.
   7. Only now, `will-change` (`references/motion.md` §4): a 1 px shift at the start or end of a
      composited animation, or a measured paint cost on a large filtered element. It fixes
      neither a wrong property nor a busy thread.
8. **Bundle.** A heavy library loaded for one screen is split to that screen; an unused one is
   reported, not removed silently.

Stop at the first cause that explains the number. Report the others with their size.

## 3. Fix

- One cause at a time, then measure again.
- No change to what the user sees, except the removed jumps and delays.
- A fix that needs a dependency, a build change or a data change is a proposal in the report.

## 4. Old engines and embedded webviews

CEP panels (Chromium 88 or 99) and system webviews are slower than a current browser: measure in
the host (`references/visual.md` §6). A panel that must stay responsive keeps heavy work in the
host script or a worker.

## 5. Report and proof

```markdown
## Performance: <screen>

Conditions: production build, Chrome 140, 4× CPU throttling, 1440×900

| Measure | Before | After | Target |
|---|---|---|---|
| LCP | 4.1 s | 2.2 s | ≤ 2.5 s |
| CLS | 0.24 | 0.02 | ≤ 0.1 |

Cause: the 3.2 MB hero image loaded lazily and without dimensions.
Other causes found, not fixed: <list with sizes>
```

Dropped frames: one block per finding, severity from the scale in `SKILL.md`, ordered by cost:
layout before paint, busy-main-thread before idle.

```markdown
**<Element>**: `path/file.tsx:42`
Cause: <the §2 step 7 cause it addresses, by number and name>
Before: `transition: all 200ms` (animates `padding`, triggers layout)
After: `transition: transform 200ms` with `scale(0.97)`
Verified: from code / needs a device recording
```

Proof: the numbers, measured twice under the same conditions; the Performance panel capture
before and after.

## 6. Motion that drops frames

### 6.1 Inventory first

List every animation in scope before diagnosing. Expand `transition: all` and any library
shorthand into what it really animates.

| Element | Driver | Properties | Plays during |
|---|---|---|---|
| Tab indicator | `motion/react` `layoutId` | layout | route change |
| Drawer | CSS transition | `transform` | user drag |
| Card hover | CSS transition | `all` → `padding`, `box-shadow` | hover |

### 6.2 Budget and cost tiers

A frame is 16.7 ms at 60 fps and about 8 ms on a 120 Hz screen: design against the smaller. A
layout recalculation on a complex page can pass 100 ms, a dozen missed frames, not one.

| Tier | Properties | Cost |
|---|---|---|
| Composite only | `transform`, `opacity`; also `filter`, `clip-path`, `background-color` in current Chrome and Firefox, unevenly (test across browsers) | Cheapest |
| Paint + composite | `box-shadow`, `border-radius`, `color` | A redraw every frame |
| Layout + paint + composite | `width`, `height`, `padding`, `margin`, `top`, `left`, `border-width` | Moves the neighbours too |

Swap down a tier, the look unchanged: grow with `scale()`, move with `translate()`, show and hide
with `opacity`, shadow with `filter: drop-shadow()`. A layout animation on an absolutely
positioned element may show no cost, but only the swap cannot regress on a slower device.

### 6.3 Where it runs

| Driver | Thread |
|---|---|
| `requestAnimationFrame` loop (GSAP, `motion/react` components) | Main thread, always |
| WAAPI (`element.animate()`) and CSS transitions or keyframes | Can be composited |

"JS" and "main thread" are not synonyms: a library that hands off to WAAPI is accelerated, a rAF
loop is not. Acceleration is progressive enhancement; browsers decline it silently, for example
for percentage transforms in some versions. Keep `translateY(100%)` for elements of unknown size:
correctness first, the optimisation second.

The case to look for is motion that plays while the page works hard: a tab indicator during
navigation, anything alongside a fetch or hydration. Move that motion to a CSS animation.

Motion `x`/`y`/`scale` shorthands: accelerated from Motion 14.2.0 (changelog 2026-10-13, read
2026-11-01; see `references/motion.md` §9). Below it, or when the path declines, they are
main-thread and the fix is `animate={{ transform: "translateX(100px)" }}`. Read the version in
`package.json` before reporting a finding.

### 6.4 The two React traps

```tsx
// drops frames: a re-render per frame
setY(nextY);
// smooth: no re-render (or a motion value: y.set(nextY))
ref.current.style.transform = `translateY(${nextY}px)`;
```

```js
// drag slows as the list grows: styles recalculated for every descendant, every frame
style = { "--swipe-amount": `${draggedDistance}px` };
// only this element is touched
style = { transform: `translateY(${draggedDistance}px)` };
```

Both use `transform` and still drop frames. Look for `setState` inside rAF, `pointermove`,
`scroll` and drag handlers. The second is the cause whenever a `transform` animation degrades as
content grows (`references/motion.md` §4, parent custom properties).

### 6.5 Symptom to fix

| Symptom | Fix |
|---|---|
| Stutters on a plain animation | Animate `transform` and `opacity`, not `width`, `height`, `top`, `margin` |
| Shadow animation is choppy | `filter: drop-shadow()` |
| Jank only during navigation or loading | CSS or WAAPI, off the main thread |
| Motion `x`/`y` drops frames | Check the version (§6.3); below 14.2.0, the full `transform` string |
| Hand-rolled animation drops frames in React | Write `ref.current.style`, not state |
| Drag gets slower as the list grows | Stop animating a custom property on the parent; `transform` on the element |
| Blur transition lags, Safari first | Animated `blur()` under 20 px |
| Properties nobody meant animate | Replace `transition: all` with the listed properties |
| Element shifts 1 px as motion starts or ends | `will-change: transform`, once the shift is seen |

### 6.6 Evidence

- Every fix names the cause it addresses. "Added `will-change`, seems smoother" is not a
  diagnosis.
- Never conclude "it's fine" from a fast machine. The bar is a mid-range phone over remote
  debugging; desktop CPU throttling models a slow CPU, not a weak GPU or a small memory budget.
- Say which findings were read from code and which need a device recording. A recording of
  dropped frames and long tasks, not feel, confirms the fix (`references/motion.md` §11).

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| `useMemo` everywhere "for performance" | The measured cause, fixed |
| `loading="lazy"` on the hero image | Lazy below the fold only |
| Numbers from the dev server | A production build, conditions written down |
| A rewrite to another framework | One cause, one fix, measured |
| "It feels faster now" | Before and after, with the target |
| A library removed because it looked heavy | Reported with its size; removed on a yes |
| `will-change` added first, "seems smoother" | The cause named from §2 step 7; `will-change` last |
| "Smooth on my laptop" | A mid-range phone recording, or `Not verified` |
| Animating a shadow with `box-shadow` | `filter: drop-shadow()` |
| `setState` per frame in a drag or scroll handler | A ref write or a motion value |
| Drag distance in a parent custom property | `transform` on the element itself |
| Motion `x`/`y` flagged without a version check | Installed version read first |
