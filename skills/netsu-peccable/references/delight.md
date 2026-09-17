# Delight: a memorable moment, on request

Add one small moment of character where the product has earned it. Load this only when the user
asks for delight, personality, a nicer success moment or "something fun". The rest of this skill
removes decoration nobody chose; this file adds one, deliberately, and records it.

## 0. Frame

| | |
|---|---|
| Changes | One moment the user names or approves (a completion, a first success, an empty state), and its strings |
| Never changes | The primary task, its speed, its accessibility, the brand's look. No sound, no confetti on routine actions |
| Asks first | The moment and how far to go, when `## Voice` and `## Look` do not say it |
| Stops when | The one moment is built, passes §4, and is recorded in `DESIGN.md` |
| Returns | The thesis of §1, the change, the proof |

Principles from impeccable (`reference/delight.md`, read 2026-09-17).

## 1. One thesis

One sentence: what the user should feel at that moment, and why it belongs to this product
("an editor who sorted 400 clips feels the work is done"). No thesis, no delight.

## 2. Where it can go

| Moment | Allowed | Not allowed |
|---|---|---|
| A real milestone (first export, a long job done) | A short, product-specific response; a line of copy in the product's voice | A full-screen celebration on a routine save |
| Waiting | True progress, a useful tip about the product | Fake progress, a delay added for the effect |
| Empty or first use | The next action first, then a touch of voice | An illustration with no action |
| Error or recovery | Warmth after the problem and the fix | A joke about lost work, money or privacy |
| Repeated actions | Nothing new: feedback that stays calm after the hundredth time | Variation that makes the result less predictable |

The treatment comes from the product's own world (its material, its words, its medium), never
from a stock list of effects.

## 3. Build

- Motion through `references/motion.md`: one short sequence, reduced-motion fallback, nothing that
  loops.
- Copy through `references/copy-app.md`: the product's words, no "Woohoo!", no emoji unless
  `## Voice` allows them.
- No new dependency for a moment. No sound without the user's consent and the system's mute.
- It never delays or covers the next action, and it can be turned off if it repeats.

## 4. Check

- The task is as fast as before.
- Keyboard, screen reader and reduced motion all get the result without the flourish.
- It still reads well in every UI language.
- After ten repetitions it is not tiring; otherwise it goes.

## 5. Record and report

Write the moment into `DESIGN.md` (`## Look`, Motion line, or `### Examples`), so reviews treat it
as chosen rather than as decoration.

```markdown
## Delight: <moment>

Thesis: <one sentence>
Change: <what was added>
Recorded in: DESIGN.md, <section>
```

Proof: a capture or a short recording of the moment, and the same moment with reduced motion.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Confetti on every save | One milestone that earned it |
| Bouncy buttons across the app | One moment, one thesis |
| A progress bar slowed down to feel nicer | True progress |
| A joke in an error about lost files | The problem and the fix first |
| A new animation library for one effect | What the project already has |
| Delight added and not recorded | Written into `DESIGN.md` |
