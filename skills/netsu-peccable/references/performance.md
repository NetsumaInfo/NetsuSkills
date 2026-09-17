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
7. **Animation.** Movement uses only `transform` and `opacity`; colour transitions follow
   `references/motion.md` §4; `will-change` only while the
   animation runs (`references/motion.md` §4). No `transition: all`.
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

Proof: the numbers, measured twice under the same conditions; the Performance panel capture
before and after.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| `useMemo` everywhere "for performance" | The measured cause, fixed |
| `loading="lazy"` on the hero image | Lazy below the fold only |
| Numbers from the dev server | A production build, conditions written down |
| A rewrite to another framework | One cause, one fix, measured |
| "It feels faster now" | Before and after, with the target |
| A library removed because it looked heavy | Reported with its size; removed on a yes |
