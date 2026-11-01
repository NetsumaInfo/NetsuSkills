# Mobile: the phone platform layer

Make a web app feel native on a phone, and build native motion in React Native and Expo.
`references/adapt.md` owns the layout and responsive decisions; this file owns the platform layer
under them: viewport, touch, scroll, safe areas, then Reanimated. Web motion rules stay in
`references/motion.md`, pointer rules in `references/gestures.md`; both are cited, not restated.

## Requirements

- **A real phone** for anything about feel: tap delay, sticky hover, rubber-banding, safe areas,
  the keyboard, haptics, frame rate. Emulation and the simulator reproduce none of them. Web: serve
  on `0.0.0.0`, open the LAN IP, inspect through Safari (Develop, the device) or `chrome://inspect`.
- **Expo Go and the simulator are not performance environments.** A dev build's JS thread is slow
  enough to hide the problems being checked. Judge feel in a release build on the slowest device
  supported.
- **Packages through `npx expo install <package>`**, never `npm install`: it resolves the version
  matching the SDK. Ask before the first run (rule: any new dependency is asked for first).
- Anything checked without a device is reported `Not verified`, naming the device check.

## 1. Principle

Detect capability, never the device: `(hover)`, `(pointer)`, `env()`, `dvh`. A user-agent or width
test guesses. Touch and mouse are not exclusive (iPad trackpad, touchscreen laptop): write for both.

## 2. Viewport baseline

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content" />
```

- `width=device-width, initial-scale=1`: layout at device width, no double-tap-zoom wait.
- `viewport-fit=cover`: paints under the notch and home bar; without it every
  `env(safe-area-inset-*)` is `0px`.
- `interactive-widget=resizes-content`: the keyboard shrinks the layout viewport on Chromium
  Android, so `dvh` and bottom-pinned inputs react as on iOS.

Never `user-scalable=no` or `maximum-scale=1`: an accessibility failure; fix the input font size
(§5). `interactive-widget` support varies: `Not verified` on iOS Safari until seen on a device.

## 3. Viewport units

`dvh`: the visible height, tracks the URL bar; for the app shell, drawers, bottom-pinned UI.
`svh`: the smallest viewport, never overflows or shifts; for a hero or first screen.
`lvh`/`vh`: the largest viewport; overflows under the URL bar, so almost never.

## 4. Safe areas

```css
.app-header { padding-top: env(safe-area-inset-top, 0px); }
.bottom-bar { padding-bottom: env(safe-area-inset-bottom, 0px); }
.sheet      { padding-bottom: calc(1rem + env(safe-area-inset-bottom, 0px)); }
```

Pad what is pinned to an edge: fixed headers, bottom tab bars, toasts, sheets, floating buttons
(a toast at `bottom: 16px` sits under the home indicator). Landscape adds `inset-left`/`right`.

## 5. Inputs and the keyboard

```css
input, textarea, select { font-size: 16px; }   /* iOS Safari zooms on focus below 16px and does not zoom back */
```

To keep a smaller desktop size, set 16 px under `@media (pointer: coarse)` only.

- Code, PIN: `inputmode="numeric"`, `autocomplete="one-time-code"`. Amount: `inputmode="decimal"`.
- `type="email"`, `type="tel"`; usernames, codes, URLs: `autocapitalize="none"`,
  `autocorrect="off"`, `spellcheck="false"`.
- `enterkeyhint="send"`, `"search"`, `"next"`, `"done"`: the return key says what it does.

## 6. Tap model

- **`-webkit-tap-highlight-color: transparent`** once on `html`. It removes the only feedback the
  browser gave, so every tappable element then needs its own `:active` (`references/motion.md` §5:
  scale 0.97, 100 to 160 ms, `ease-out`).
- **`touch-action: manipulation`** on `button, a, [role="button"]`: it never double-tap-zooms, so
  `click` fires without delay.
- **Highlight on down, commit on up.** Feedback starts at `pointerdown` or `:active`; the action
  runs on release inside the element. Drifting past about 10 px (the gesture threshold of
  `references/gestures.md` §2) is not yet a cancel; dragging out of the element and releasing
  cancels, with the highlight clearing as it leaves.
- Targets 44 pt (iOS), 48 dp (Android); drag handles `references/gestures.md` §8.

## 7. Selection and callout

`user-select: none`, `-webkit-user-select: none` and `-webkit-touch-callout: none` on controls only
(button, tab, chip, drag handle). On `body` they block copying addresses and error messages.

## 8. Scroll, overscroll and touch-action

| Surface | Declaration |
|---|---|
| App page with its own scrollers | `html, body { overscroll-behavior: none }` |
| Inner scroller (sheet body, chat list, sidebar) | `overscroll-behavior: contain`: keeps its own bounce, stops chaining to the page |
| JS carousel `pan-y`; vertical sheet handle `pan-x` | `touch-action` names what the browser may still do |
| Custom gesture owning every axis | `touch-action: none`, and only there: users cannot scroll past it |
| Native scroll carousel | `scroll-snap-type: x mandatory` on the track, `scroll-snap-align: start` on slides; no `touch-action` needed |

Leave the page alone where pull-to-refresh is welcome. Never `touchmove` + `preventDefault()` to stop
overscroll: it blocks scrolling and makes the listener non-passive. Scroll-snap beats a hand-built
spring for a plain carousel.

## 9. Hover on touch

Every `:hover` rule sits in `@media (hover: hover) and (pointer: fine)`: the first excludes touch,
the second styluses and Android devices that claim hover. Touch gets `:active`.

## 10. Status bar

```html
<meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />
<meta name="color-scheme" content="light dark" />
```

The colour at the very top of the page (header background, not brand colour), from `DESIGN.md`.
A theme switched by class: update the tag from script. A PWA repeats it in the manifest.

## 11. Baseline CSS

```css
html {
  -webkit-tap-highlight-color: transparent;
  -webkit-text-size-adjust: 100%;     /* no font inflation in landscape */
  overscroll-behavior: none;          /* drop for a document that wants pull-to-refresh */
}
input, textarea, select { font-size: 16px; }
button, a, [role="button"] {
  touch-action: manipulation;
  -webkit-user-select: none; user-select: none;
}
@media (hover: hover) and (pointer: fine) { /* all :hover rules */ }
```

Ship it with the §2 and §10 tags first.
---

## 12. React Native: the tool ladder

Cheapest that works, top to bottom. Reanimated, not core `Animated`: core `Animated` cannot be
gesture-driven without crossing the bridge, and its native driver takes only transform and opacity.

| Need | Tool |
|---|---|
| State change, no gesture (press, toggle); loop or on-mount | Reanimated CSS transition (`transitionProperty`) or animation (`animationName`) |
| Mount, unmount, list reflow | Layout animations: `entering`, `exiting`, `itemLayoutAnimation` |
| Anything a finger touches, or scroll-derived | `useSharedValue` + `Gesture` + `useAnimatedStyle` |
| Screen to screen | Native stack options in Expo Router; never rebuilt in JS |
| Sheet that is its own screen; tab bar | `presentation: 'formSheet'`; `NativeTabs` (`expo-router/unstable-native-tabs`) |
| Context menu, large title, pull to refresh | `Link.Menu` / `Link.Preview` (iOS), `headerLargeTitleEnabled` (iOS), `RefreshControl` |
| UI that follows the keyboard | `react-native-keyboard-controller` (`KeyboardProvider` at the root) |

A shared value is for a continuous or interruptible value; a press scale is a CSS transition.
Lottie for illustration only, Skia for a huge scene. Tabs never slide: `animation: 'none'`.

## 13. Properties

- **`transform` and `opacity` are free.** `width`, `height`, `margin`, `padding`, `flex`, `top`,
  `left`, `gap` re-run Yoga every frame for the node and its siblings. Exception: an absolutely
  positioned element with no children (tab pill, progress fill): nothing else re-lays-out, and the
  corner radius survives where `scaleX` smears it.
- **`transform` is an array and order matters.** `[{ translateY }, { scale }]` scales after the
  move; reversed, the translate is scaled too. Translate first.
- Never `scale(0)`: `scale(0.95)` + `opacity: 0`.
- **Android shadow is `elevation`; animating it re-renders the shadow every frame.** Fade the
  opacity of a pre-shadowed layer.
- **Never animate `BlurView` intensity** (Android re-renders the blur per frame). Crossfade a
  static `BlurView`.
- Text scales: a height measured at default type size is wrong at 200%. Use `onLayout`.

## 14. Springs and easing

A finger was involved: a spring, because it carries velocity through an interruption. Otherwise
timing. Use Apple's two designer parameters, not mass/stiffness/damping.

Default settle `{ duration: 400, dampingRatio: 1 }`; snap back after a drag
`{ duration: 400, dampingRatio: 0.8, velocity }`; sheet or drawer
`{ duration: 300, dampingRatio: 0.8, velocity }`; add `overshootClamping: true` where it must not
pass a hard edge.

Bounce only when the gesture carried momentum (`references/gestures.md` §4). Pass the release velocity.

```js
import { Easing } from 'react-native-reanimated';
const EASE_OUT    = Easing.bezier(0.23, 1, 0.32, 1);      // enter, exit, press
const EASE_IN_OUT = Easing.bezier(0.77, 0, 0.175, 1);     // moving across the screen
const EASE_SHEET  = Easing.bezier(0.32, 0.72, 0, 1);      // sheets
```

Built-in easings are as weak as CSS's; never `Easing.in(...)` on UI. Durations are
`references/motion.md` §2; a screen transition keeps the platform default.

Momentum projection and rubber-banding are the formulas of `references/gestures.md` §4 and §5
(`project` at `decelerationRate` 0.998, `rubberband` at constant 0.55). In a worklet context each
gets `'worklet';` as its first line and nothing else changes.

## 15. Off the JS thread

- **Never `setState` from a gesture or scroll handler**: a React render per frame is the largest
  single cause of jank. Shared value into `useAnimatedStyle`.
- **`scheduleOnRN(fn, ...args)`** from `react-native-worklets` replaces the deprecated
  `runOnJS(fn)(...args)`. Never in `onUpdate` or a scroll handler (60 to 120 calls a second): in
  `onEnd`, or in `useAnimatedReaction` when a value crosses a threshold, comparing with the previous
  value so it fires once.
- **`.get()` / `.set()`, not `.value`**: the React Compiler cannot see through `.value`. Never read
  or write a shared value during render; only in worklets, handlers and effects.
- A function called from a worklet starts with `'worklet';`, or it throws on device only.
- **Memoise gestures** (`useMemo`): a rebuilt one can drop a drag in flight. Gesture Handler v3
  hooks manage their own identity.
- A gesture in a scroll view declares its axis (`activeOffsetX`/`Y`, about 10), or it steals the
  scroll. `onStart` captures the live value (`context.set(translateY.get())`), never the target.

## 16. Press

- Feedback on `onPressIn`, commit on `onPressOut`. `scale: 0.97`, 100 to 160 ms, as a CSS
  transition on the `Pressable`'s view. `setState` on press in/out is fine: twice per press.
- **`hitSlop`** brings a small icon to 44 pt without growing the visual.
- **`pressRetentionOffset`** (about 16) so slight drift does not cancel the press.
- Ripple only in a Material-styled app; a custom design scales on both platforms.

## 17. Haptics

| Moment | Call |
|---|---|
| A value ticks past a step (picker, slider detent, segmented control) | `Haptics.selectionAsync()` |
| Something snaps home, a detent catches, a drag commits | `impactAsync(ImpactFeedbackStyle.Light)` |
| A heavy object lands, a destructive action fires | `impactAsync(ImpactFeedbackStyle.Medium)` |
| Success or failure | `notificationAsync(NotificationFeedbackType.Success / Error)` |

Same frame as the visual, at the causal moment (the detent catching), not when the animation ends.
One per user action: never on scroll, per frame, or on an entrance the user did not cause. Never the
only feedback: off system-wide for many users, silent on most Android hardware. From a worklet:
`scheduleOnRN(Haptics.selectionAsync)`.

## 18. Reduced motion

`useReducedMotion()`, or `reduceMotion: ReduceMotion.System` in each `withSpring`/`withTiming`
config. Fewer and gentler (`references/motion.md` §6): keep opacity and colour, drop translation,
scale, parallax, overshoot. Screen transitions become `animation: 'fade'`.

## 19. Screens and sheets (Expo Router)

Deeper: `animation: 'default'`. Abandonable task: `presentation: 'modal'`. Short interruption
(picker, filter): `formSheet` with detents. Between tabs: `animation: 'none'`.

`animationMatchesGesture: true` whenever a custom `animation` is set, or the iOS back swipe plays a
different transition than the push. `formSheet` differs by platform (Expo modal docs, read
2026-11-01): Android truncates `sheetAllowedDetents` to three; `sheetGrabberVisible` is iOS only,
so the grabber is never the only "this drags" cue; Android form sheets host no native header or
nested stack (use `modal`); `fitToContents` needs explicitly sized content, a `flex: 1` root has no
height to fit. A custom in-screen sheet is built only when it cannot be its own screen:
`references/gestures.md` §3 and §4 for the release rules.

## 20. Lists and keyboard

- Entrance only for a list the user waits on, 30 to 80 ms a step, 300 ms total, builder memoised
  (`useMemo(() => FadeInDown.duration(250).delay(index * 40), [index])`) or at module scope.
- **Never `entering` on a row of a virtualised list** (`FlatList`, `FlashList`): rows recycle and
  the animation re-fires on every scroll-back. Animate the container once, or `itemLayoutAnimation`.
- Collapsing header: translate content in a fixed-height `overflow: 'hidden'` box, never its height;
  `Extrapolation.CLAMP` on every `interpolate`.
- Keyboard-synced UI: `const { height } = useReanimatedKeyboardAnimation()` into a `translateY`.
  Never `Keyboard.addListener` plus a timing animation: the event reaches JS after the keyboard
  moved, so any duration lags or leads it.

## 21. Setup that fails silently

When "the animation does not run":

- Packages through `npx expo install react-native-reanimated react-native-worklets`. Under
  `babel-preset-expo` the worklets plugin is automatic; a bare RN project adds it by hand, last in
  the list. A missing plugin throws `Failed to create a worklet`.
- `GestureHandlerRootView` and `KeyboardProvider` at the root `_layout`, or gestures and keyboard
  hooks do nothing, no error. Reanimated 4 requires the New Architecture.
- ProMotion iPhones cap third-party animation at 60 fps unless
  `ios.infoPlist.CADisableMinimumFrameDurationOnPhone` is `true`; recent Expo SDKs set it, confirm
  it. The frame budget is then 8 ms.

## Proof

Sources: Emil Kowalski's `mobile-native` and `animate-expo`, read 2026-11-01; not re-checked
against the installed SDK, so check the project's versions before reporting a finding.

Frame rate, velocity handoff, haptics, safe areas, the keyboard and tap feel need a real phone:
flick it, interrupt it mid-flight, reverse it, run it on the slowest Android. Code reading proves
declarations only; the rest is `Not verified`, naming the device check.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| `user-scalable=no` to stop input zoom | 16 px inputs |
| `100vh` on a shell or bottom bar | `100dvh`; `svh` for a hero |
| `env(safe-area-inset-*)` with no `viewport-fit=cover` | Both, or the inset is `0px` |
| Ungated `:hover` | `(hover: hover) and (pointer: fine)` |
| `setState` per frame | Shared value into `useAnimatedStyle` |
| `runOnJS`, or `scheduleOnRN` in `onUpdate` | `scheduleOnRN` in `onEnd` or a threshold reaction |
| Animated `height`, `margin`, `flex` | `transform` and `opacity` |
| Haptic per frame, or as the only cue | One per commit, with a visual |
| "Fine in the simulator" | A release build on a real phone, or `Not verified` |
