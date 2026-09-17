# Onboarding: first use, empty states, hints

Get a new user to the first moment the product proves itself, as fast as possible. Load this only
when the user asks about onboarding, first launch, a welcome flow, an empty first screen, hints or
a tour. It does not teach the whole product.

## 0. Frame

| | |
|---|---|
| Changes | The first-use path the user names: empty states, a setup step, hints, a sample |
| Never changes | The product's features and data; other screens, except a permission prompt moved to the moment of use (§3). No tour unless asked |
| Asks first | The first result that proves the product works, when the code and `## Product` do not say it |
| Stops when | A new user can reach that result from a fresh install, and the path is written down |
| Returns | The path as steps, the strings, the proof |

Principles from impeccable (`reference/onboard.md`, read 2026-09-17) and GOV.UK-style plain
language (`references/copy-app.md`); the numbers are house rules.

## 1. Name the first result

One sentence: what a new user does first that shows the product working ("the first rushes
sorted by scene", "the first book downloaded"). Everything in this file serves that result.

## 2. Walk the path from zero

From a fresh install or an empty account, write each step the user takes until the result:

| Step | Screen | What the user sees | What they must know | Friction |
|---|---|---|---|---|
| 1 | Home, empty | "No projects yet" | Where to start | No action on the screen |

Code-only: read the first-run branches (empty lists, setup gates, permission requests) and say
so.

## 3. Rules

- **The empty screen is the onboarding.** It says why it is empty and gives the next action, in
  place (`references/states.md`, Empty). A sample or a template sits next to that action when the
  product has one.
- **Ask for nothing early.** Permissions, sign-in and settings are asked at the moment a feature
  needs them, with one line of why (`references/states.md`, Permission denied).
- **Defaults work.** A setting the user must change before the first result is a finding.
- **Hints at the point of use.** One hint, next to what it explains, shown once, dismissed for
  good. Never more than one hint on a screen.
- **A tour only on request, and always skippable.** It never blocks the first screen; it is
  short enough to finish; the product is usable behind it.
- **Progress when there are steps.** "Step 2 of 3", with a way back and a way to skip what can
  be skipped.
- **Returning users** never see first-use content again; a "What's new" goes in release notes
  (`references/copy-pages.md` §5), not in a modal on launch.
- **Words.** The product's own words (`### Words we use`), second person, no "Welcome aboard!",
  no promises the first screen cannot keep.

## 4. Build

1. Fix the empty states and the first action before adding anything.
2. Add a sample or template only if the product can ship one that is real.
3. Add hints last, one per screen, stored as dismissed per user.
4. Strings through `references/copy-app.md`, in every UI language.

## 5. Report and proof

```markdown
## Onboarding: <product>

First result: <one sentence>
Steps before: 7 · after: 3

| Step | Before | After |
|---|---|---|
| 1 | Empty home with no action | "No projects yet. Drop a folder to start." [Import] |
```

Proof: the path walked once from a fresh state (a new profile, cleared storage), with a capture
of each screen; or "code-only" and the branches read.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| A five-screen welcome carousel | The first result, reached from the empty screen |
| Every permission asked at first launch | Asked when the feature needs it |
| A tour that covers the app | Hints at the point of use, on request a skippable tour |
| "You're all set! 🎉" | The next action, in the product's words |
| Hints on every screen, every visit | One, once, dismissed for good |
| A fake demo project | A real sample, or none |
