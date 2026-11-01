# Motion recipes: per-component starting points

Load when the request is about one of the components below. Gate, durations, easing, properties
and reduced motion live in `references/motion.md`; tokens are those of `motion.md` §2. Anything a
finger drives (drag-to-dismiss, hold-to-confirm, swipe) is in `references/gestures.md`. Start from
the recipe, then adapt: never rebuild from nothing.

Every recipe assumes the §1 gate of `motion.md` passed. A modal, a drawer and a toast are
occasional; a command palette is not, and gets none of this.

## 1. Button press

```css
.button { transition: transform var(--dur-feedback) var(--ease-out); }
.button:active { transform: scale(var(--press)); }
```

- `scale()` carries the label and icons, which is why it reads as a press. No hover gate on
  `:active`: it is a real press on touch. Gate `:hover` styling with
  `(hover: hover) and (pointer: fine)`.
- Feedback starts on pointer-down. Never on `click`.

## 2. Dropdown, popover, menu, select

Scales out of its trigger, not out of thin air.

```css
.popover {
  transform-origin: var(--transform-origin);  /* Base UI; Radix: --radix-popover-content-transform-origin */
  transition: opacity var(--dur-state) var(--ease-out), transform var(--dur-state) var(--ease-out);
}
.popover[data-starting-style],
.popover[data-ending-style] { opacity: 0; transform: scale(var(--enter-scale)); }
.popover[data-ending-style] { transition-duration: var(--dur-exit); }
```

- The origin is the whole point. Modals are exempt (§4).
- A menu or select opened from the keyboard many times a day: opacity only, or nothing.

## 3. Tooltip

```css
.tooltip {
  transform-origin: var(--transform-origin);
  transition: opacity 125ms var(--ease-out), transform 125ms var(--ease-out);
}
.tooltip[data-starting-style],
.tooltip[data-ending-style] { opacity: 0; transform: scale(0.97); }

.tooltip[data-instant] { transition-duration: 0ms; }  /* a neighbour is already open */
```

- **Instant on a neighbour.** The first tooltip waits its open delay, which stops accidental
  activation. While one is open or just closed, the next skips both the delay and the animation:
  the whole toolbar feels faster. Base UI's tooltip provider carries this (`delay`, `closeDelay`);
  without one, share a timestamp and set `data-instant` for about 300 ms after the last close.
- Tooltips do not animate on touch: they do not open there.

## 4. Modal and its backdrop

```css
.modal {
  transform-origin: center;  /* exempt: nothing anchors it */
  transition: opacity var(--dur-enter) var(--ease-out), transform var(--dur-enter) var(--ease-out);
}
.modal[data-starting-style],
.modal[data-ending-style] { opacity: 0; transform: scale(var(--enter-scale)); }
.modal[data-ending-style] { transition-duration: var(--dur-exit); }

.backdrop { transition: opacity var(--dur-enter) var(--ease-out); }
.backdrop[data-starting-style],
.backdrop[data-ending-style] { opacity: 0; }
.backdrop[data-ending-style] { transition-duration: var(--dur-exit); }
```

- Same duration and curve on panel and backdrop: they read as one surface.
- Exit about two thirds of the enter, `ease-out`. No `ease-in`, no bounce.
- Never animate `backdrop-filter`: fade the overlay's opacity and keep the blur value fixed.

## 5. Drawer and sheet

```css
.drawer { transition: transform 400ms var(--ease-drawer); }  /* 300 to 500 ms: it travels its own height */
.drawer[data-starting-style],
.drawer[data-ending-style] { transform: translateY(100%); }  /* the element's own height */
```

- Vaul ships 500 ms on this curve (`vaul/src/constants.ts`, read 2026-11-01). A side drawer
  uses `translateX(100%)` or `-100%`.
- Percentages, never pixels: the content decides the height.
- Add drag and it becomes a gesture: `references/gestures.md` §3 to §5.

## 6. Toast

```css
.toast {
  transition: opacity var(--dur-enter) var(--ease-out), transform var(--dur-enter) var(--ease-out);
  @starting-style { opacity: 0; transform: translateY(100%); }
}
.toast[data-removed] { opacity: 0; transform: translateY(100%); transition-duration: var(--dur-exit); }
```

- The translate stays for toasts, as a percentage: the one entrance that is not a scale. Leave by
  the edge it came from (`gestures.md` §6).
- **Transitions, never keyframes.** Toasts stack and fire twice in a second; a transition
  retargets from the live value, a keyframe restarts from zero.
- Without `@starting-style`: set `data-mounted` in an effect after the first paint and style on it.
- When the stack reflows, opacity and height work against each other. No formula: adjust, then
  check again the next day.
- Unmount after the exit ends (Sonner: 200 ms delay, 4 s lifetime, `sonner/src/index.tsx:31,43`).

## 7. Accordion

```css
.panel {
  overflow: hidden;
  height: var(--radix-accordion-content-height);  /* the library's measured variable, first choice */
  transition: height var(--dur-state) var(--ease-out), opacity var(--dur-state) var(--ease-out);
}
.panel[data-state="closed"] { height: 0; opacity: 0; }
```

- The one allowed `height` transition (`motion.md` §4). A pixel value measured in JS also works.
  Never to `auto`: it cannot interpolate.
- Content never measured has no variable: measure, set it, then transition.
- Skip the animation on first render (`motion.md` §7).

## 8. Tab indicator: duplicate and clip

Colour transitions timed one by one across a tab list never land. Clip instead.

1. Duplicate the tab list. Style the copy as the active state: its own background, its own text
   colour.
2. Stack it over the original and clip it to the active tab.
3. On change, animate the clip.

```css
.tabs-active-copy {
  clip-path: inset(0 var(--right) 0 var(--left));  /* set on this element from the active tab's offsets */
  transition: clip-path var(--dur-state) var(--ease-in-out);
}
```

- Text and background change in sync: one element is revealed, two colours are not interpolated.
- Set `--left` and `--right` on the copy itself, not on a parent. Mark the copy `aria-hidden="true"`
  and `inert`.
- Tabs are peers. The indicator moves; the panels never slide.

## 9. Icon swap

```css
.icon-box { position: relative; width: 1.25rem; height: 1.25rem; }  /* fixed size: no jump */
.icon-box > svg {
  position: absolute; inset: 0;
  transition: opacity var(--dur-feedback) var(--ease-out), transform var(--dur-feedback) var(--ease-out);
}
.icon-box > svg[data-hidden] { opacity: 0; transform: scale(0.8); }
```

- Both icons stay mounted; one is visible. If the overlap reads as two objects, add
  `filter: blur(2px)` to the hidden state (§13).
- Copy-to-check settles back after 1.5 to 2 s with the same swap, and the label changes with it.

## 10. Numbers and counters

- **Default: swap the text.** A total, a balance or a metric the user reads never counts up on
  every mount (`motion.md` §1).
- `font-variant-numeric: tabular-nums` always, so the width does not move when digits change.
- Animate only a real change on a user action, one digit column at a time:

```css
.digit { display: inline-block; overflow: hidden; height: 1em; }
.digit > span { display: block; transition: transform var(--dur-state) var(--ease-out); }
/* JS sets translateY(-N * 1em) on the span itself */
```

- A stepper pressed many times a second: swap the text, nothing else.

## 11. Scroll reveal (marketing only)

Content is in the markup and visible with no script. The effect is CSS-only and an enhancement.

```css
@supports (animation-timeline: view()) {
  @media (prefers-reduced-motion: no-preference) {
    .reveal {
      animation: reveal linear both;
      animation-timeline: view();
      animation-range: entry 0% entry 35%;
    }
    @keyframes reveal { from { opacity: 0; transform: translateY(1.5rem); } }
  }
}
```

- No `opacity: 0` in the base rule, no observer, no `.visible` class: a fast scroller, a printed
  page and JS-off all see the content.
- One hero entrance and one or two moments, never every section, never on the product's own
  screens (`motion.md` §1).
- A browser without `animation-timeline` shows everything at rest. That is the fallback.

## 12. Clip-path toolkit

`clip-path: inset(top right bottom left)` animates on the compositor and needs no wrapper.

- **Reveal.** Hide with `inset(0 0 100% 0)`, show with `inset(0)`. The edge with the inset is the
  edge the content grows from. Images and text blocks.
- **Comparison slider.** Two images stacked; the top one is clipped at the handle:

```css
.compare .after { clip-path: inset(0 0 0 var(--split)); }  /* --split set on this element */
```

  The handle is a `button` or `input[type=range]`, operable by keyboard. No transition while it is
  dragged (`gestures.md` §2).
- **Seamless tab colour.** §8. **Hold fill.** `gestures.md` §7.
- `--ease-in-out` for a reveal that crosses the element, `--ease-out` for one that answers a press.

## 13. Masking a crossfade with blur

Last resort, when two overlapping states read as two objects and no tuning of duration or easing
fixes it.

```css
.swap { transition: filter var(--dur-state) var(--ease-out), opacity var(--dur-state) var(--ease-out); }
.swap[data-transitioning] { filter: blur(2px); opacity: 0.7; }
```

- Under 20 px, in practice 2 to 4 px. Heavy blur is expensive, worst in Safari.
- A feel call code cannot settle: play it at 2 to 5× duration before calling it fixed.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Button transitions `all` and scales on hover | `transform` only, on `:active` |
| Tooltip with the same delay and animation every time | Instant once a neighbour is open |
| Modal origin taken from the trigger | Centred; the origin rule is for anchored panels |
| Backdrop blur animated with the fade | Overlay opacity only, fixed blur |
| Drawer at `translateY(480px)` | `translateY(100%)` on `--ease-drawer` |
| Drawer at 150 ms like a menu | 300 to 500 ms: it travels its own height |
| Toast keyframes that restart when two arrive together | Transitions or `@starting-style` |
| Toast enters from the bottom, leaves through the top | Leaves by the edge it came from |
| Accordion animates to `height: auto` | A measured pixel height or the library's variable |
| Tab colours transitioned one by one | One clipped copy, `clip-path` animated |
| Icon swap that resizes the button | Fixed-size box, both icons mounted |
| Counter that counts up on every mount | Text swap; animate only a user-driven change |
| Digits that shift the layout | `tabular-nums` |
| Section at `opacity: 0` until an observer fires | Content visible at rest, CSS scroll timeline as enhancement |
| Scroll reveal on product screens | Marketing only, never on a daily surface |
| `blur(12px)` on a crossfade | 2 to 4 px, under 20 |
