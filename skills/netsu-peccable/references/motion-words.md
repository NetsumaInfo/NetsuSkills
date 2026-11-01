# Motion words

What the user asked for, in the terms the other motion files use. Load it when a request names
motion vaguely ("make it pop", "smoother", "more alive", "like Apple") or when a report has to name
what it changed. Not a glossary to recite: each entry ends in a decision or a file.

## Say this instead

| They said | They mean | Go to |
|---|---|---|
| "Make it pop" | An entrance with scale, or a press that answers | `motion.md` §5, `motion-recipes.md` |
| "Smoother" | Interruptible, or composited — two different fixes | `motion.md` §9, `performance.md` §6 |
| "Snappier" | Shorter duration, stronger ease-out | `motion.md` §2, §3 |
| "More alive" | A spring, and only after a gesture | `gestures.md` §4 |
| "Fluid", "buttery" | The release carries the finger's velocity | `gestures.md` §4 |
| "Like Apple" | Origin-aware, interruptible, continuous, no decoration | `motion.md` §1, §5 |
| "Janky", "laggy" | Dropped frames: diagnose before touching anything | `performance.md` §6 |
| "Too much" | The frequency tier is wrong | `motion.md` §1 |

## The terms that settle a decision

**Enter and exit.** An *entrance* starts at `scale(0.96)` and `opacity: 0`. An *exit* is the same
curve, shorter. *Pop in* means overshoot, which product UI does not get.

**Origin-aware.** The element grows out of its trigger rather than its own centre. The difference
between a menu that belongs to its button and one that appears beside it. Modals are not
origin-aware: nothing anchors them.

**Continuity transition.** The same rectangle, bigger or smaller: a row opening into a detail
view. A *shared element transition* is the same idea across two screens. A *morph* changes shape as
well as size (Apple's Dynamic Island) and is a build of its own, not a transition.

**Direction-aware.** Forward slides one way, back slides the other. Without it, a back navigation
reads as a new screen.

**Interruptible.** The animation can be grabbed, reversed or re-fired mid-flight and continues from
where it is. CSS transitions and springs are; `@keyframes` are not. This is a mechanism, not a
preference: name it when rejecting keyframes.

**Perceptual duration.** How long a spring *feels* finished, which is before it stops
micro-settling. Why a spring with no duration can still feel slow.

**Velocity handoff.** The release passes the finger's speed to the animation. Its absence is the
seam people call "cheap" without knowing why.

**Rubber-banding.** Movement past a boundary with rising resistance. Not the same as a bounce: the
finger is still driving.

**Asymmetric timing.** Slow where the user decides, fast where the system answers. A hold-to-confirm
is the clearest case.

**Stagger.** Items arriving one after another. Decorative, so it never blocks interaction and never
replays.

**Composited.** The property animates without layout or paint, so it runs off the main thread:
`transform`, `opacity`. Say "composited", not "GPU-accelerated" — the browser decides, and it can
decline.

**Layout thrashing.** Animating `width`, `height`, `top` or `margin`, which re-measures the page
every frame and moves the element's neighbours too.

**Jank** is a visible stutter. A *dropped frame* is its cause, one frame that missed its 16.7 ms.

**Idle motion.** Anything that moves with no input: float, bob, pulse, glow, marquee. Allowed on a
skeleton and on a loader tied to real work, nowhere else.

**Reveal.** Showing content by clipping rather than fading: `clip-path: inset()`.

**Crossfade.** Two states overlapping. When it refuses to settle, `filter: blur(2px)` reads the two
as one transformation.

**Anticipation** and **follow-through** are animation-film terms: a wind-up before the move, a
settle after it. In product UI both read as overshoot. Name them to refuse them; use them only in
an illustration or a celebration.

## Why the word matters

A request answered in the user's vague word gets re-opened. A request answered in these terms names
what changed and what it cost: "the dropdown is origin-aware now, 180 ms, ease-out" is checkable.
"Smoother" is not.
