# Details: the finishing pass

Fix the small things that make a finished screen feel careless. Load this only when the user asks
to polish, refine or "make it feel better" on a screen that already works. It never redesigns:
a wrong concept goes to `references/new-ui.md`, broken behaviour to `references/review-ui.md`.

## 0. Frame

| | |
|---|---|
| Changes | Values inside the named screen or component: radii, alignment, icon size and stroke, transitions, number formatting, truncation |
| Never changes | Structure, colours, fonts, wording, behaviour. No new animation "to show polish" |
| Asks first | Nothing. A choice `## Look` does not record goes in the report as a question |
| Stops when | The checklist of §2 is done once on the named scope |
| Returns | The before/after table of §4 and the proof |

Order, as impeccable's polish step sets it (github.com/pbakaus/impeccable, `reference/polish.md`,
read 2026-09-17): broken tasks and missing states first, then consistency, then these details. If
the first two are not done, say so and stop: details on a broken screen hide the real problem.

## 1. Read

`## Look` (radius, shadows, icons, motion), the shared components the screen uses, and one
neighbouring screen that is considered finished. Then:

```bash
node <skill dir>/scripts/scan.mjs ui <files>
grep -rhoE 'rounded(-[a-z0-9]+)*(-\[[^]]+\])?|size-[0-9]+|h-[0-9]+ w-[0-9]+|stroke-?[wW]idth=\{?"?[0-9.]+' <files> | sort | uniq -c | sort -rn
```

## 2. Checklist

Each item that fails is one finding, with every place it occurs.

1. **Nested corners.** Outer radius = inner radius + padding; past about 24 px of padding, each
   radius is chosen on its own. Radii come from the scale in `## Look`
   (`references/visual.md` §4).
2. **Optical alignment.** An icon beside a label, a play triangle, a chevron: centred by eye, not
   by box. Nudge with padding on the icon side, or fix the icon's own viewBox; never with a
   one-off `translate` per instance.
3. **Icons.** One library, one stroke width, sizes from the scale (16 or 20 px in UI), drawn with
   `currentColor`. An icon beside text matches the text's weight: a hairline icon next to bold
   text is a finding. The selected state shows by more than colour.
4. **Hit areas.** The visible icon stays small; the clickable area reaches the target size with
   padding or a pseudo-element (`references/components.md` §4). Neighbouring hit areas never
   overlap.
5. **Surfaces.** One elevation method per level (`references/visual.md` §4). No hairline under a
   wide shadow; no card inside a card.
6. **Transitions.** Named properties, durations from `## Look` or `references/motion.md` §2
   (repeated actions change at once). Press feedback on buttons only. Hover never lifts cards.
7. **Numbers and text.** `tabular-nums` on values that change; truncated values reachable in
   full; headings balanced; no widow on a two-line description (`references/typography.md`).
8. **States.** Hover, focus-visible, active and disabled look deliberate and consistent with the
   neighbouring screen. A disabled control without its reason is reported for
   `references/states.md`, not added here.
9. **Leftovers.** Debug output and commented-out blocks in the touched files are reported;
   cleaning code is not this file's job.

## 3. Fix

1. A value repeated wrong in several places becomes a token or a shared component fix.
2. One change per finding. Each fix is classified: missing token, shared component not used,
   or local defect.
3. A detail that needs a decision (outline or filled icons, a new radius) is a question in the
   report, not a change.

## 4. Report and proof

```markdown
## Details: <scope>

| Finding | Where | Before | After |
|---|---|---|---|
| Nested radius | `clip-card.tsx:12` | card `rounded-lg`, thumbnail `rounded-lg`, 8 px padding | thumbnail `rounded-sm` |
| Icon weight | `toolbar.tsx:30` | 1 px stroke beside semibold labels | the set's 1.5 px stroke |
```

Proof: the same capture before and after at one size; the `ui` scan with zero `block` on the
touched files. For motion changes, the timing snippet of `references/motion.md` §10.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| "Polish" that changes the layout and the palette | The checklist, inside the current look |
| A new entrance animation to show effort | No new motion unless a finding needs it |
| `-translate-x-px` on twelve icons | The icon's viewBox fixed once |
| Details before the missing error state | States first, then details |
| A second icon library for one nicer glyph | The project's library |
| Rounder corners everywhere | The radius scale, nested correctly |
