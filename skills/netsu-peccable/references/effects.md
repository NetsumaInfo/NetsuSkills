# Effects: an ambitious visual effect, on request

Build one technically ambitious effect (a scroll-driven reveal, a morphing transition, a shader
background, a fluid data view) when the user explicitly asks for it. Load this only on such a
request ("something impressive", "wow effect", "overdrive"). This is the one file that goes past
the calm defaults, so it is the most tightly framed.

## 0. Frame

| | |
|---|---|
| Changes | One named surface, with one effect the user picked in §2 |
| Never changes | Content, accessibility, the rest of the product. Product screens keep their calm defaults unless the user names one |
| Asks first | Always: the directions of §2, before any code. When nobody can answer, stop after §2 |
| Stops when | The chosen effect works, passes §4, and is recorded in `DESIGN.md` |
| Returns | The chosen direction, the effect, the checks of §4, the proof |

Adapted from impeccable's `overdrive` (`reference/overdrive.md`, read 2026-09-17), which also
insists on proposing before building.

## 1. What "impressive" means here

| Surface | The effect serves | Examples |
|---|---|---|
| Landing page, portfolio | Attention and story | A scroll-driven reveal of the real product; a transition between sections |
| Product UI (tables, dialogs) | Continuity | A dialog that grows from its button (View Transitions); a row that moves to its new place |
| Heavy data | Fluidity | Thousands of points drawn on a canvas; smooth transitions between states |
| Tools | Speed you can feel | Filtering 50,000 items without a stutter (`references/performance.md`) |

An effect that makes the task slower, or hides the product, is the wrong effect.

## 2. Propose, then wait

Two or three directions, each with: the technique, what the user sees, its cost (weight,
performance, browser support checked on caniuse on the day), and its fallback. Ask once which
one. No code before the answer.

## 3. Build

- The simplest technique that gives the effect: CSS first (transitions, `@starting-style`,
  scroll-driven animations where supported), then the motion library the project has, then a
  canvas or WebGL only when nothing lighter works.
- Content is visible without the effect: no `opacity: 0` waiting for a script
  (`references/motion.md` §1).
- A fallback for browsers without support, and for CEP panels and older webviews
  (`references/visual.md` §6).
- Check it in the browser tool while building; an ambitious effect rarely works on the first try.

## 4. Checks, all required

- `prefers-reduced-motion: reduce` gets the content without the movement.
- Anything moving longer than 5 s can be paused (WCAG 2.2 SC 2.2.2).
- Frames stay smooth during the effect, and LCP and CLS do not get worse
  (`references/performance.md` §1).
- Keyboard and screen-reader users reach the same content.
- It still works at 375 px and in every UI language.

## 5. Record and report

Write the effect into `## Look` (Motion line or Direction), so reviews treat it as chosen.

```markdown
## Effect: <surface>

Direction chosen: <one of §2>
Technique: <…> · Fallback: <…> · Recorded in: DESIGN.md, ## Look
Checks: reduced motion ✓ · pause ✓ · LCP 2.1 s → 2.2 s · keyboard ✓
```

Proof: a short recording at normal speed and one with reduced motion; the performance numbers.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| A particle background on a settings page | The effect where the user asked, serving the task |
| Code before a direction is chosen | Two or three directions, one question |
| A WebGL scene for a fade | The lightest technique that works |
| Content hidden until the animation runs | Visible without it |
| No reduced-motion path | Content without movement |
| An effect nobody recorded | Written into `## Look` |
