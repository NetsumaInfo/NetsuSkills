# Compose: Kotlin interfaces, Android and iOS

Build or fix an interface written in Compose (Compose Multiplatform, or Jetpack Compose on
Android alone). `references/motion.md` still owns **what** earns motion and **why**; this file
owns how Compose says it. `references/gestures.md` still owns what a gesture must satisfy; the
pointer APIs here replace its web code, not its rules.

What it never touches: the stack decision. If the project has not settled on Compose, say so and
stop — a chapter is not a vote.

## Requirements

- Facts below are dated. Compose Multiplatform moves fast: the latest stable was 1.12.2
  (2026-10-15) and 1.13.0-beta01 was out (2026-10-23) when this was written, 2026-11-01. Check the
  release notes before quoting a version.
- No feel judgement from a debug build or an emulator. A release build on the slowest supported
  device, or the finding is `Not verified`.
- `scripts/scan.mjs` reads `.kt` and `.kts` for the Compose rules only. Everything else it knows is
  web; a clean scan on a Compose screen proves very little.

## 1. The frame does not change

Load `references/motion.md` §1 and apply it unchanged: the frequency tiers, the named purpose, the
rule that data the user reads does not move for style. A keyboard-initiated action gets no
animation in Kotlin either.

What changes below §1: there are no millisecond durations to set, the property rules become phase
rules, and the gesture code is completely different.

## 2. Motion is springs, not durations

Material 3 Expressive motion is a set of **spring** specs with no duration. Read them from the
theme; do not hand-write a `tween` with a number copied from the web table in `motion.md` §2.

```kotlin
// Shape, size, position, offset — may overshoot by design
val spatial = MaterialTheme.motionScheme.defaultSpatialSpec<Float>()
// Colour, alpha — anything that must not pass its bounds
val effects = MaterialTheme.motionScheme.defaultEffectsSpec<Float>()
```

Each comes in `fast`, `default` and `slow`. `MotionScheme.expressive()` is Material's recommended
scheme for prominent elements and hero interactions; `MotionScheme.standard()` is for utilitarian,
recurring UI (doc comments, `MotionScheme.kt`, compose-multiplatform-core `jb-main`, read
2026-11-01). Which one a `MaterialTheme` installs by default is `Not verified`.

**Spatial on a colour or an alpha is the mistake this section exists for.** Spatial springs damp
below 1, so they overshoot; alpha and colour are clamped, so the overshoot shows up as a flash or
a clipped step instead of a bounce. Effects springs are critically damped and cannot do that.

Token values, read from `tokens/ExpressiveMotionTokens.kt` in the JetBrains fork on 2026-11-01 —
source, not published design docs, and the community numbers that circulate (damping 0.9,
stiffness 1400) contradict it:

| Spec | Damping | Stiffness |
|---|---|---|
| spatial, fast / default / slow | 0.6 / 0.8 / 0.8 | 800 / 380 / 200 |
| effects, fast / default / slow | 1.0 / 1.0 / 1.0 | 3800 / 1600 / 800 |

- `spring` is the default spec for `animate*AsState` and `updateTransition`, and the documented
  choice for anything interruptible or user-driven: it keeps its velocity when the target changes
  mid-flight (developer.android.com/develop/ui/compose/animation/customize, read 2026-11-01).
  Defaults are `Spring.DampingRatioNoBouncy` and `Spring.StiffnessMedium`.
- `tween` is for a fixed duration and a named easing, which in product UI means a progress fill or
  a marquee. Reach for it last.
- `LocalMotionScheme` was removed in compose-material3 1.5.0-alpha27. Use
  `MaterialTheme.motionScheme`.

**Which primitive** (developer.android.com/develop/ui/compose/animation/choose-api, read
2026-11-01):

| Case | API |
|---|---|
| One value, a known target | `animate*AsState` |
| A gesture is the source of truth | `Animatable` (`animateTo`, `snapTo`, `animateDecay`) |
| Several properties starting together | `updateTransition` |
| Appear or disappear | `AnimatedVisibility` |
| Swap content | `AnimatedContent`, `Crossfade` |
| Size change | `Modifier.animateContentSize` |
| A list item added, removed or moved | `Modifier.animateItem()` |
| Forever (skeleton only, see `motion.md` §8) | `rememberInfiniteTransition` |

No API here is documented as cheaper than another. Do not claim one is.

## 3. Phases replace the property list

`motion.md` §4 bans animating layout properties because the web reflows. Compose has the same
problem with a different shape: **where you read the animated state decides how much re-runs.**

Composition decides what to show, layout where, draw how. A state read in a phase re-runs that
phase and every later one — read it in composition and the whole screen recomposes, 60 times a
second (developer.android.com/develop/ui/compose/phases, read 2026-11-01).

```kotlin
// ❌ reads in composition: recomposes every frame
Modifier.offset(with(LocalDensity.current) { (state.firstVisibleItemScrollOffset / 2).toDp() })

// ✅ reads in layout: only placement re-runs
Modifier.offset { IntOffset(x = 0, y = state.firstVisibleItemScrollOffset / 2) }

// ✅ reads in draw: nothing re-measures
Modifier.graphicsLayer { translationX = drag.value }
```

- Pixel movement goes in `offset { }` or `graphicsLayer { }`. Never in the non-lambda `offset()`.
- `drawBehind`, `Canvas` and `drawWithContent` read in the draw phase only.
- Rapidly changing derived values go through `derivedStateOf`, so the read does not recompose on
  every intermediate value.
- Writing state from `onSizeChanged` and feeding it back into layout costs a frame — the
  documented "backwards write".

This is also the answer to the recomposition-per-frame worry: it is not a React-style memo
problem, it is a question of which lambda you put the read in.

## 4. Gestures

| API | What it gives |
|---|---|
| `Modifier.pointerInput(keys) { }` | Raw events. **One top-level detector per `pointerInput`** — a second one never runs, and this is documented, not folklore |
| `awaitEachGesture { }` | Restarts when all pointers lift. The docs recommend it "almost always" over a hand-written `while (true)` |
| `detectTapGestures` | Press, tap, long press, double tap |
| `detectDragGestures`, `detectHorizontal…`, `detectVertical…` | Drag with start, end and cancel |
| `detectDragGesturesAfterLongPress` | Long press, then drag |
| `Modifier.draggable(orientation = …)` | One axis, you hold the state |
| `Modifier.draggable2D` | Two axes, no fling |
| `Modifier.anchoredDraggable(state, orientation)` | Snaps to anchors, with `DraggableAnchors` and `AnchoredDraggableState` |

Source: the understand-gestures and drag-swipe-fling pages, read 2026-11-01. The package of
`anchoredDraggable`, its API history, and whether `swipeable` is formally deprecated are
`Not verified` — read the reference before writing one into a review.

How events travel, which is what every gesture bug comes back to:

- **`PointerEventPass.Initial`** runs root to leaf: a parent can intercept first. **`Main`** is the
  default and runs leaf to root, so the innermost composable wins. **`Final`** runs root to leaf and
  lets a parent react to what was consumed.
- **`consume()` marks an event handled; it does not stop propagation.** Every composable has to
  check `isConsumed` itself.
- Hit-testing happens once per pointer. The chain hit at press keeps receiving that pointer's
  events even once it leaves their bounds — Compose's equivalent of `setPointerCapture`, and it is
  free.
- `scrollable` expects you to return how much delta you consumed, or nesting breaks.

`AnchoredDraggableState.requireOffset()` read inside an `offset { }` lambda is the idiomatic drag:
the state is in layout, not composition (§3).

## 5. A scrolling grid whose items also drag

The hard case, and the one worth getting right before the first screen: a grid that scrolls
vertically, where each thumbnail takes its own horizontal drag plus a long press and a double tap.

**No official recipe exists for this.** What follows is built from the pass and consumption rules
in §4, so treat it as a starting point to verify on hardware, not as documentation:

1. Give the thumbnail a horizontal-only claim: `Modifier.draggable(orientation =
   Orientation.Horizontal)`, or an `awaitEachGesture` that calls
   `awaitHorizontalTouchSlopOrCancellation` and only then starts consuming. It takes the pointer
   when horizontal slop is crossed first.
2. Leave vertical movement unconsumed. The leaf wins on `Main`, so a child that consumes too early
   kills the grid's scroll.
3. Put the taps in a **separate** `pointerInput` — one top-level detector each (§4).
4. Where a parent must coordinate rather than compete, `Modifier.nestedScroll` with a
   `NestedScrollConnection` is the seam. Its callback names are `Not verified` here.

The four ways it goes wrong: the child consumes before slop resolves and the grid never scrolls; a
parent intercepts on `Initial` and the child never sees the drag; a `detectDragGestures` that
ignores the axis eats a vertical move; two detectors in one `pointerInput` and the second is dead.

When the dragged value is not a position — scrubbing a sprite sheet by frame index, say — §2 of
`gestures.md` still applies unchanged: follow the finger 1:1, no animation while the finger is
down. What moves is the index, so there is nothing to animate at all, and that is the cheap path.

## 6. Velocity and fling

Deltas, offsets and `translationX` are in **pixels** (drag page, read 2026-11-01).
`Animatable.animateDecay` exists for a throw.

Everything else this file would need — `VelocityTracker`'s package and its unit, `splineBasedDecay`,
`exponentialDecay`, `FlingBehavior`, `ScrollableDefaults.flingBehavior()`, and whether
`calculateTargetValue` projects a landing point — is **`Not verified`**: the pages did not load.
The velocity thresholds in `gestures.md` §3 are read from web libraries and **do not transfer**.
Measure on the device and write down what you measured.

## 7. A native view inside Compose

A video player, a camera preview or a map comes in as a platform view: `AndroidView` on Android,
and on iOS an interop view whose API is `Not verified` here. Two consequences:

- The interop view is not drawn by Compose, so Compose's clipping, rounded corners and
  `graphicsLayer` transforms do not reliably apply to it. Animate its container, not the view.
- One such view at a time. Reusing a single player across a grid is a design constraint, not an
  optimisation — a grid of decoders is how a phone overheats.
- Compose Multiplatform 1.13.0-beta01 added `UIKitInteropSafeAreaInsetsPolicy` and
  `safeAreaInsetsPolicy` for interop views overlapping UIKit safe areas (release notes, read
  2026-11-01).

## 8. Lazy grids and lists

- **`key` is not optional.** Without it, state does not follow an item through a reorder: the wrong
  thumbnail keeps the wrong selection. Keys must be Bundle-compatible for `rememberSaveable`.
- `contentType` lets compositions be reused only between items of the same kind.
- `Modifier.animateItem()` animates add, remove and placement, takes `fadeInSpec`, `fadeOutSpec`
  and `placementSpec`, and **requires a key**. Feed it the scheme specs from §2: effects for the
  fades, spatial for the placement.
- `LazyVerticalGrid(columns = GridCells.Adaptive(minSize = 128.dp))`, or `GridCells.Fixed`.
- A first-appearance entrance in a lazy list has no official guidance, and `motion.md` §7 is
  against it anyway: a grid the user scrolls all day is already there.

Source: developer.android.com/develop/ui/compose/lists, read 2026-11-01.

## 9. Touch targets, semantics, reduced motion

- **48 dp minimum** for anything interactive. Material components enforce it when interactive;
  a custom clickable does not. `Modifier.minimumInteractiveComponentSize()` reserves the space —
  place it **before** `size` — or `sizeIn(minWidth = 48.dp, minHeight = 48.dp)`.
- `clickable` merges descendant semantics. `onClickLabel` is what a screen reader announces
  ("double tap to play this shot"). `Modifier.semantics { onClick(label = …) { true } }` names the
  action without touching the clickable. `triStateToggleable` for a custom tri-state.
- A drag-only control has **no official semantics recipe**, and §1 of `gestures.md` already
  requires a non-gesture path to the same action. Build that path and label it; do not try to make
  the drag itself accessible.
- **Reduced motion has no Compose API for phones.** `LocalReduceMotion` is Wear OS only — do not
  reach for it. The proxy is `Settings.Global.ANIMATOR_DURATION_SCALE`, 0 meaning animations off,
  wrapped in a `try`/`catch` for `SettingNotFoundException` and defaulting to `1f`. Whether Compose
  honours it on its own through `MotionDurationScale` is `Not verified`, as is the iOS side.
  Until it is checked, read the setting yourself and branch, exactly as `motion.md` §6 requires.

Source: developer.android.com/develop/ui/compose/accessibility/api-defaults, read 2026-11-01.

## 10. iOS, when it comes

Compose Multiplatform on iOS is stable, and it renders through Skia rather than UIKit — so
"stable" means the API is reliable, not that the feel is indistinguishable. Nothing here replaces
running it on a device.

From the release notes, read 2026-11-01. Note how much of this is still in a pre-release:

| Fixed | Version |
|---|---|
| Swipe-back no longer fights a horizontal scrollable | 1.12.0 |
| Content jump at the start of swipe-back | 1.12.0 |
| The UIKit back gesture no longer leaks drag input into Compose | 1.12.0-beta02 |
| Overscroll snapping matches the iOS animation | 1.13.0-alpha02 |
| Keyboard animation curves converted correctly | 1.13.0-alpha01 |
| Keyboard insets after a geometry change, field covered after rotation | 1.13.0-alpha02 |
| Crash on swipe-back with the keyboard open | 1.13.0-beta01 |

`CupertinoScrollDecayAnimationSpec` and `CupertinoOverscrollEffect` were **removed from the public
API** (PR #1806, merged 2025-01-29, CMP-6775): Cupertino overscroll is the default and is not
yours to configure.

Fling parity with UIKit is **claimed, not verified**, and no fling-specific change appears in the
notes above. `WindowInsets` and `safeDrawingPadding` behaviour on iOS is `Not verified`. Any iOS
finding written without a device is `Not verified`, naming the device check it needs.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| A `tween` with a duration copied from the web table | `MaterialTheme.motionScheme` specs |
| A spatial spec on a colour or an alpha | An effects spec; spatial overshoots and clamps |
| Hand-written spring numbers in a composable | The scheme, or tokens defined once |
| `Modifier.offset(value.dp)` driven by an animation | `Modifier.offset { }` or `graphicsLayer { }` |
| Animated state read in a composable body | Read it in the lambda that needs it |
| Two detectors in one `pointerInput` | One each; the second never runs |
| A child drag that consumes before slop resolves | Horizontal slop first, vertical left unconsumed |
| `items(list)` with no `key` | A stable key, or state follows the wrong item |
| `animateItem()` with no key | It needs one |
| A clickable smaller than 48 dp | `minimumInteractiveComponentSize()` before `size` |
| `LocalReduceMotion` on a phone | It is Wear OS only; read `ANIMATOR_DURATION_SCALE` |
| A decoder per grid cell | One player, reused; still images otherwise |
| Clipping or rounding applied to an interop view | Animate and clip its container |
| Feel judged in debug or on an emulator | A release build on the slowest device |
| An iOS claim with no Mac in the room | `Not verified`, naming what is missing |
