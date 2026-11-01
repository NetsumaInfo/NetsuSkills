# Gestures: drag, swipe and hold

Motion an input drives while it is still happening. `references/motion.md` owns anything that
animates on its own; load it for timing, easing and reduced motion. This file owns the pointer.

## 1. Does the gesture earn its place

A gesture is a second way to do something, never the only way. Every swipe, drag and hold has a
visible control doing the same job: a close button on the drawer, a dismiss button on the toast, a
menu item for the row action. Gesture-only actions are unreachable by keyboard and invisible to a
screen reader (WCAG 2.2 SC 2.5.1 Pointer Gestures, level A; SC 2.5.7 Dragging Movements, level AA,
read 2026-11-01).

| Gesture | Use for | Never for |
|---|---|---|
| Swipe to dismiss | A toast, a notification, a row the user is done with | A destructive action with no undo |
| Drag a sheet | A bottom sheet, a drawer, a resizable panel | Page scrolling |
| Drag to reorder | A list the user owns | A sorted or filtered list |
| Hold to confirm | One destructive action, instead of a dialog | Anything repeated |
| Pinch, two-finger, long-press menus | Nothing on the web: no discoverable affordance | — |

A destructive swipe ends in an undo that lasts at least 5 s, or it asks.

## 2. Follow the finger

The element tracks the input 1:1 for the whole gesture, with no transition on the dragged
property — every frame of a transition fights the pointer. The transition comes back on release.

Pick the axis first and keep it: `clientX`/`translateX` for a row swiped sideways,
`clientY`/`translateY` for a sheet. The code below is one axis, named `pos`; everything in this
file applies to either.

```js
let drag = null;  // null when idle

el.addEventListener("pointerdown", (e) => {
  if (drag) return;                         // a second finger never takes over a live drag
  el.setPointerCapture(e.pointerId);        // the drag survives leaving the element's bounds
  drag = { from: e.clientX, moved: false, samples: [{ pos: e.clientX, t: e.timeStamp }] };
});

el.addEventListener("pointermove", (e) => {
  if (!drag) return;
  const d = e.clientX - drag.from;
  if (!drag.moved) {
    if (Math.abs(d) < 10) return;           // still possibly a tap
    drag.moved = true;
    drag.from = e.clientX;                  // re-anchor, so the element does not jump by 10 px
    el.classList.add("dragging");           // .dragging { transition: none; user-select: none }
    return;
  }
  drag.samples.push({ pos: e.clientX, t: e.timeStamp });
  if (drag.samples.length > 5) drag.samples.shift();
  el.style.transform = `translateX(${e.clientX - drag.from}px)`;
});
```

`pointercancel` is not optional: the browser fires it when the gesture is taken over (a system
edge swipe, a context menu). Handle it exactly like a release below the threshold.

A drag that ends over a control must not also click it: `pointerdown` on that control stops
propagating, or the click handler ignores an event whose `pointerup` followed a move.

- **Pointer events, not touch events.** One path for finger, pen and mouse.
- **`setPointerCapture`** on press. Without it the drag dies when the pointer leaves the element
  (`sonner/src/index.tsx:321`, `vaul/src/index.tsx:276`, read 2026-11-01).
- **Keep the grab offset.** The element moves by the pointer's delta, not to the pointer's
  position: snapping its centre to the finger on grab breaks the illusion of holding it.
- **Keep a short history** of the last few `pointermove` positions and timestamps — release needs
  the velocity, and the last two frames alone are noise.
- **Movement threshold before committing**, about 10 px: below it the gesture may still become a
  tap. Detect the plausible gestures in parallel and cancel the losers once the direction is clear.
  Recognisers that only report a final state (`swipeleft`-style events) throw away the tracking
  this file is about.
- **Ignore extra pointers.** `if (isDragging) return` at the top of the press handler: switching
  fingers mid-drag otherwise teleports the element to the new one.
- **`touch-action` declares the axis you own**: `pan-y` on a horizontally swiped row, `pan-x` on a
  vertical sheet handle, `none` only where you really handle every axis — users cannot scroll past
  an element that claims them all.
- **Write `transform` on the element**, never a variable on its parent: a custom property change
  on a parent recalculates styles for every child.

```js
el.style.setProperty("--swipe", `${d}px`);  // ❌ recalc on every child
el.style.transform = `translateY(${d}px)`;  // ✅ this element only
```

## 3. Release: distance or velocity

Never distance alone — a flick travels almost nothing and must still dismiss.

Velocity comes from the **last few samples**, not from the whole gesture: a slow drag that ends in
a flick has a near-zero average and a high final speed, and it is the flick the user felt.

```js
const first = drag.samples[0];
const last = drag.samples[drag.samples.length - 1];
const elapsed = Math.max(last.t - first.t, 1);     // ms, never divide by zero
const velocity = (last.pos - first.pos) / elapsed; // px per ms, SIGNED
const distance = last.pos - drag.from;

if (Math.abs(distance) >= THRESHOLD || Math.abs(velocity) > 0.11) {
  dismiss(Math.sign(velocity) || Math.sign(distance));   // the sign is the direction it leaves
} else {
  settleBack();
}
```

`THRESHOLD` is a distance for an element of fixed size (45 px for a toast or a row) and a fraction
of the travel for one the user resizes (0.25 of a drawer's height). Never a pixel count on
something whose height depends on its content.

The **sign of the velocity** decides the direction, and it outranks the position: a row dragged
left but flicked right leaves to the right. With no movement in the last samples, fall back to the
sign of the distance.

Measured thresholds, read from source 2026-11-01:

| What | Value | Where |
|---|---|---|
| Toast swipe distance | 45 px | `sonner/src/index.tsx:40` |
| Toast dismiss velocity | > 0.11 px/ms | `sonner/src/index.tsx:348` |
| Drawer close distance | 0.25 of the drawer's height | `vaul/src/constants.ts` `CLOSE_THRESHOLD` |
| Drawer close velocity | > 0.4 px/ms | `vaul/src/constants.ts` `VELOCITY_THRESHOLD` |
| Drawer settle | 500 ms, `cubic-bezier(0.32, 0.72, 0, 1)` | `vaul/src/constants.ts` `TRANSITIONS` |
| Scroll lock after a scroll | 100 ms | `vaul/src/constants.ts` `SCROLL_LOCK_TIMEOUT` |

Reverse or commit is decided by the **sign of the velocity**, not by where the element sits. A
sheet dragged up but released downwards closes.

A sheet with snap points ignores velocity for skipping: a fast flick must not pass a point the
user aimed at (`vaul` disables velocity swiping when snap points are set).

## 4. Settle with a spring, and hand the velocity over

Release is the one place in this skill where a spring earns its place: it starts from the value and
the velocity the finger had, so a reversed gesture never restarts from zero. Duration-based easing
cannot do that, and neither can `@keyframes`.

```jsx
<motion.div
  drag="y"
  dragConstraints={{ top: 0, bottom: 0 }}
  dragElastic={0.2}
  transition={{ type: "spring", duration: 0.4, bounce: 0.2 }}
/>
```

- **Pass the release velocity** as the spring's initial velocity, or there is a visible seam
  between finger and animation. Motion takes absolute px/s in its `velocity` option.
- **Bounce 0.1 to 0.3, only after a gesture that carried momentum** (a flick, a throw, a drag
  release). This is the one exception to the no-bounce rule in `references/motion.md` §3: a menu
  that merely faded in never overshoots. In Apple's terms, damping 1.0 by default, about 0.8 after
  momentum; response 0.3 to 0.4 s — response is time to target, not a duration.
- **Animate from the live value, not the target.** On an interrupt, read the element's current
  transform and start there. Starting from the target is the jump users see when they grab a
  closing sheet.
- **Decompose 2D motion into independent X and Y springs.** One spring on the 2D distance desyncs
  as soon as the two axes carry different velocities.
- **Never lock input during the settle.** A sheet the user grabs mid-close follows the finger
  again; it does not finish closing and then reopen.
- Without a motion library, the velocity still has somewhere to go — WAAPI takes the release speed
  as a first keyframe offset, which is the cheapest honest handoff:

```js
el.classList.remove("dragging");
const travel = Math.abs(target - current);
const ms = Math.min(500, Math.max(150, travel / Math.max(Math.abs(velocity), 0.3)));
el.animate([{ transform: `translateX(${current}px)` }, { transform: `translateX(${target}px)` }],
  { duration: ms, easing: "cubic-bezier(0.32, 0.72, 0, 1)", fill: "forwards" });
```

  A plain `transition: transform 500ms var(--ease-drawer)` restored on release is the floor: it
  ignores the velocity, so a flick and a slow drag land at the same speed. Acceptable for a sheet,
  not for a gesture the user reverses.
- Reading the live value from a CSS transform means `new DOMMatrix(getComputedStyle(el).transform)`
  and its `.m41` (X) or `.m42` (Y). Read it on press, before removing the transition.

**Momentum projection**, for snap points: snap to the point nearest where the throw would *end*,
not where the finger left.

```js
// decelerationRate 0.998 reads like native scrolling, 0.99 snappier
const project = (v /* px/s */, rate = 0.998) => (v / 1000) * rate / (1 - rate);
const target = nearestSnapPoint(currentPosition + project(releaseVelocity));
```

## 5. Resistance past the edge

Past a natural boundary the element keeps moving, less and less. A hard stop reads as a bug; real
things slow before they stop. Never `return` on the over-drag — an element frozen mid-gesture is
the exact failure this prevents.

Both functions below take the **overshoot as a positive magnitude**, not the raw position: at an
input of 0 the Vaul formula returns about −16, so it is applied past the edge and clamped, never
across the whole drag.

```js
// vaul/src/helpers.ts:90, read 2026-11-01. Applied as Math.min(dampen(overshoot) * -1, 0)
const dampen = (v) => 8 * (Math.log(v + 1) - 2);

// iOS-style rubber band, when the boundary has a known size
const rubberband = (overshoot, dimension, c = 0.55) =>
  (overshoot * dimension * c) / (dimension + c * Math.abs(overshoot));
```

## 6. Exit the way it entered

A toast that slid in from the bottom leaves through the bottom. A row swiped left leaves left. The
entrance is what teaches the gesture, so the paths have to match.

Use percentages, not pixels: `translateY(100%)` is the element's own height whatever its content —
how Sonner places toasts and Vaul hides the drawer.

The exit is a dismissal, so it is quick: 150 to 250 ms, `var(--ease-out)`, not the 500 ms a sheet
takes to settle. Then the row leaves the layout: remove the node on `transitionend` (or
`animationfinish`), and let the list close the gap rather than the row — a `LinearTransition` on
the list, or `transition: height` on nothing at all and an instant reflow. A row that fades but
keeps its space reads as a failed delete.

**Focus does not vanish with the row.** Dismissing from a button inside it leaves focus on
`document.body` and a keyboard user at the top of the page. Move focus to the next row's control,
or to the list itself, before the node goes.

## 7. Hold to confirm

One deliberate action in place of a dialog. Slow where the user decides, fast where the system
answers.

```css
.hold .fill { clip-path: inset(0 100% 0 0); transition: clip-path 200ms ease-out; }  /* release */
.hold:active .fill { clip-path: inset(0 0 0 0); transition: clip-path 2s linear; }   /* press */
.hold:active { transform: scale(0.97); }
```

- 1.5 to 2 s, `linear`: the fill is a progress bar, and progress bars are linear.
- The action fires at the end of the hold, not on release before it.
- A hold has no keyboard form, so the keyboard path is not a fallback but the other half: Enter on
  the focused control opens the confirm dialog.

## 8. Accessibility

- Every gesture has a visible control doing the same thing (§1).
- Touch targets at least 24 × 24 px (SC 2.5.8, AA); 44 × 44 px for a drag handle.
- A drag handle is a `button` with `aria-label`, not a styled `div`.
- Reduced motion keeps the gesture — the finger drives it — and drops the decoration: the spring
  becomes a 150 ms `ease-out`, the stacked peek behind a sheet stops moving.
- A swipe that deletes is destructive and needs the undo of §1. A swipe that only dismisses
  something already seen — a notification, a toast — is not, and needs none.
- While a sheet is open: focus trapped inside it, Escape closes it, the page behind does not
  scroll.

## 9. Proof

- **A real device, not emulation.** Gestures are the case where DevTools touch emulation is not
  evidence: serve the dev server on `0.0.0.0`, open it by LAN IP from a phone, drive it with a
  finger. iOS: Safari, Develop, the device. Android: `chrome://inspect`.
- Drag past every boundary and let go: nothing freezes, nothing jumps.
- Flick with almost no distance: it dismisses.
- Drag out, back, and release: it returns with no visible restart.
- Begin a drag, then add a second finger: nothing teleports.
- Grab the element mid-settle: it follows again.
- Keyboard-only pass: every gesture action reachable without a pointer.

Anything checked only in emulation is reported `Not verified`, naming the device check it needs.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Distance threshold only | Distance **or** velocity over the measured threshold |
| `touchstart` / `touchmove` handlers | Pointer events with `setPointerCapture` |
| Element centre jumps to the finger on grab | Keep the grab offset, move by the delta |
| A transition on the dragged property while dragging | `transition: none` while dragging, restored on release |
| `--swipe-amount` on the parent | `transform` on the element |
| Release animates from the target value | Animate from the live on-screen value |
| Release ignores the finger's velocity | Hand the velocity to the spring |
| Snap to the nearest point to the release | Snap to the projected endpoint |
| Hard stop at the boundary | Damping, movement that never reaches zero |
| Input locked until the settle finishes | Interruptible at every frame |
| Swipe is the only way to dismiss | A visible button does the same thing |
| Destructive swipe with no undo | 5 s undo, or a confirm |
| Bounce 0.6 on a sheet | 0.1 to 0.3, and only after momentum |
| Hold-to-confirm on an ease curve | `linear`, 1.5 to 2 s |
| Velocity averaged over the whole drag | The last few samples, where the flick is |
| `Math.abs(velocity)` deciding the direction | Its magnitude tests the threshold, its sign picks the side |
| No `pointercancel` handler | Treated like a release below the threshold |
| The swipe's `pointerup` also clicks the button under it | The click suppressed after a move |
| Focus left on `body` after the row goes | Moved to the next control first |
| Exit as slow as the settle | 150 to 250 ms for a dismissal |
| "Works in the device toolbar" | A finger on a real phone, or `Not verified` |
