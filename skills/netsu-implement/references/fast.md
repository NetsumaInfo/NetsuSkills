# Fast path

One narrow change, shortest reliable route to verified code. If this run needs a plan document,
it was the wrong path — say so and load `full.md`.

## 1. Baseline, and the one-sentence proof

```bash
git status --porcelain=v1 --untracked-files=all
git rev-parse --abbrev-ref HEAD
```

Write down what was already dirty. Everything you touch from here is measured against that, not
against a clean tree. If the file you will edit is already dirty, copy it aside first: editing
tools normalise line endings, and only a byte diff against the copy shows it.

Then say, in one sentence, **what would prove this worked** — the full path writes acceptance
criteria, and this is the same thing at one twentieth the cost. *"The export button writes a file
to the chosen directory."* If you cannot write that sentence, the request is not as narrow as it
looks: that is your first surprise, and a second one sends you to `full.md`.

## 2. Locate

```bash
rg -n "<the exact string, symbol or label the user named>"
rg --files -g "*<name>*"
```

Start from the literal thing the user said — an error message, a button label, a function name,
a config key. Read the file you will edit plus the two or three nearest examples of the same
pattern. **Two to five files. Stop there.**

Look up documentation only when the API, the version or the current behaviour could have moved
since you last saw it.

## 3. Edit

Load `code.md` first — it governs what may go in the diff, on both paths.

- Edit as soon as the surrounding pattern is clear.
- Keep the diff local to the request.
- Reuse the helpers, scripts and conventions already there.
- Do not rename, reformat, refactor, add comments explaining the obvious, or tidy adjacent code.
  None of that was asked for, and all of it makes the diff unreviewable.

Anything you need to ask, ask **before** this step. From the first edit you finish: an unforeseen
choice takes the option that leaves existing behaviour unchanged, and gets one line in the report.

## 4. Verify

Load `verify.md`. **Prove the sentence from step 1**: do what the user would do, on the real
thing, and paste what it printed or take the screenshot. For a bug, show it failing first. Then
run the table rows your diff actually touched, once. A copy change and a schema change do not get
verified the same way, and running the repo's default script is not a decision.

Fix only failures your change introduced. Leave everything else alone and say it was already
failing.

## 5. Read your own diff

```bash
git diff
```

Read it, not your memory of it. The full path hands the diff to a fresh context; here you re-read
it cold, which is weaker and worth doing anyway — most of what a reviewer catches on a narrow
change is visible in the diff itself. Call it a re-read in the report, never a review.

Five checks, then stop:

- Every new name resolves — in the lockfile, or in a definition you opened.
- Nothing you wrote already existed in the project under another name.
- No leftover logging, no commented-out code, no TODO you have no plan for.
- Only the files you said you would touch.
- The sentence from step 1 is now true, and the proof you captured shows it.

## 6. Report

The proof first — what you did and what you saw. Then files changed, checks run with their
result, anything you decided for the user, anything skipped and why. Nothing else.

## Stop rules

- **Do not expand.** A neighbouring bug you spotted goes in the report as a sentence, not in the
  diff.
- **Two failed attempts, then stop.** Report the blocker, the evidence, and the single next
  option you would take.
- **Second surprise, escalate.** The first unexpected thing is normal. The second means the
  request was not narrow — stop, say the path is changing, and load `full.md`.

## Anti-patterns

❌ Grep returns 40 hits, reads all 40 → ✅ Read the 3 the edit depends on; ask if still ambiguous.
❌ Fixes the bug and reformats the file → ✅ The formatter churn hides the one line that mattered.
❌ Adds a defensive `if (!x) return` nobody asked for → ✅ Make the change requested, nothing more.
❌ Skips the proof because "it's a one-liner" → ✅ One-liners are exactly what silent regressions ride in on.
❌ Reports from memory of what it changed → ✅ Read `git diff`. It is four seconds.
❌ Calls its own re-read a review → ✅ Name it for what it was.
❌ Keeps improvising after the third surprise → ✅ Escalate at the second.
