# Test journal

One entry per merged skill. Evidence that the three tests in rule 11 passed.

| Date | Skill | Trigger | Non-trigger | Execution | Notes |
|---|---|---|---|---|---|
| 2026-09-15 | `netsu-readme` | 9/9 | 10/10 | slop audit over 15 real repositories | two defects found by the tests and fixed before merge |

---

## `netsu-readme` — 2026-09-15

### Trigger and non-trigger

Method: a subagent was shown **only** the descriptions of six installed skills — `netsu-readme`,
`readme-i18n`, `deslop`, `copy-editing`, `writing-shape`, `find-docs` — with no skill body, and
asked which fires for each sentence. It was told to mark a pick MARGINAL when it was reachable
only by inference rather than by matching the description's own words.

First run, against the original description: 7/7 trigger, 8/8 non-trigger, but two real defects.

- `set up my github profile page` fired only by inference. The description said "for a GitHub
  profile", grammatically subordinate to "README", and the sentence contained neither the word
  README nor any listed verb.
- Translation was absent from the exclusion list, leaving `netsu-readme` and `readme-i18n`
  contending for "update the localized README variants".
- The description also spent budget on procedure — "Explores the repository first, asks only what
  it cannot read, agrees a plan, then writes" — which contributes nothing to selection. Rule 4:
  the description exists to decide yes or no. Moved to the body.

Second run, after rewriting the description: **9/9 trigger, 10/10 non-trigger, 0 undecidable.**
Four cases marked marginal, none of them a wrong pick:

| Case | Why marginal |
|---|---|
| `j'ai besoin d'un README pour ce repo` | Fires on semantics; only "README" matches literally. Non-English phrasing is an untested assumption, not designed behaviour |
| `document the API endpoints` | Correctly excluded, but `find-docs` retrieves documentation rather than authoring it — a near-miss, not a match |
| `write a blog post about the project` | `writing-shape`'s description is too terse to arbitrate cleanly |
| `remove the AI slop from my repo` | Names neither code nor README. `deslop` wins on default scope, but a greedy dispatcher could co-fire |

Verb list widened afterwards to cover "clean up", "shorten" and "add a section", which the second
run showed were reachable only through "improve".

### Execution

Run against 15 real repositories on the reference machine, French and English, exercising
`voice.md` end to end. Two defects surfaced that no amount of review had caught:

**1. The spaced em-dash check fired on every French README.** NetsuRush 12 occurrences in 1,350
words, Netsuspeech 18 in 1,461 — all above the threshold, all correct French typography, which
sets dashes spaced by rule. The marker was measured on English text and the skill applied it
blind. Fixed: the rule is now scoped to English, and §5 requires checking the document language
before running any typographic check.

**2. Every `grep -P` in the skill failed silently.** Git Bash on Windows ships a grep built
without PCRE. `-P` returns nothing and exits clean, so the check *looks* like it passed. Every
pattern was rewritten without `-P`, using `LC_ALL=C` with `[^ -~]` to catch non-ASCII, and
verified to produce the same counts as a reference implementation. Rule 10, portability.

**3. A true positive, and the reason the skill exists.** The context-leak grep found a third
party's full name, Twitter handle and Gmail address in the README of a **public** repository —
left over from a copied template and never replaced, alongside two further template remnants.
Neither the author nor any reviewer had noticed it. Filed as separate work.

Detection results across the corpus, for reference:

| Signal | Result |
|---|---|
| Emoji-led headings | 2 of 15 READMEs, at 15/28 and 17/39 headings — the clearest generated-output signature in the set |
| Tier-A vocabulary | Near zero. 0 or 1 hit in 13 of 15 files |
| Context leak | 1 true positive, 1 false positive (a French sentence containing a path-like string) |

The near-zero vocabulary score against a strong emoji-heading score is worth recording: on this
corpus the structural markers carried the signal and the word list did not. Consistent with the
finding in `voice.md` that lexical tells decay while structure persists.

### Merge checklist

Passed, after one fix: `references/sections.md` was referenced from `project.md` but not from the
parent, which rule 1 forbids. The parent now names it as a resource rather than an entry point,
and rule 1 was extended to define that distinction — umbrella children come in two kinds and the
parent must say which.
