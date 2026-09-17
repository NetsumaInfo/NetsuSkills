# Test journal

One entry per merged skill. Evidence that the three tests in rule 11 passed.

| Date | Skill | Trigger | Non-trigger | Execution | Notes |
|---|---|---|---|---|---|
| 2026-09-15 | `netsu-readme` | 9/9 | 10/10 | slop audit over 15 real repositories | two defects found by the tests and fixed before merge |
| 2026-09-16 | `netsu-implement` | 9/9 | 10/10 | NetsuRush, upscale target resolution | the run exposed a real defect: it stopped mid-implementation to ask |
| 2026-09-16 | `netsu-implement` | — | — | NetsuRush, preview optimisation in the Adobe panel | questions stayed up front; review found a pre-existing blocker, then a flaw in its own fix |

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

---

## `netsu-implement` — 2026-09-15

Merged from two installed skills the author uses by hand: `apex` (adaptive, 17 steps, 909 lines)
and `oneshot` (narrow, 40 lines). Both carry `disable-model-invocation: true`, so neither can
ever fire on its own — which is the whole reason a replacement was worth writing.

### What upstream had already decided

`Melvynx/aiblueprint`, checked at commit of 2026-09-10. On 2026-09-06 it landed
`chore(skills): slim catalog to Apex style`: `apex/SKILL.md` went from **124 lines to 28**, and
all seventeen files under `steps/` are byte-identical to the copy installed here. Only the entry
file was cut. Independent arrival at rule 2 — the parent routes, the depth lives below.

`oneshot` is no longer in the public catalog at all. It moved to the paid bundle and was
redefined there as a *fixed* sequence, positioned by its own documentation as the alternative to
`apex` rather than its companion: adaptive checkpoints on one side, a fixed order on the other.
The copy installed here predates that and describes something else again.

So the two skills being merged were never designed to compose. The merge is a gate, not a union:
step 0 classifies the request and picks a path.

### Trigger and non-trigger

Method as for `netsu-readme`: a subagent was shown **only** the descriptions of eleven skills —
`netsu-implement`, `netsu-readme`, `systematic-debugging`, `requesting-code-review`,
`test-driven-development`, `writing-plans`, `executing-plans`, `commit`, `refactor`, `deslop`,
`improve` — with no bodies, and asked to route nineteen sentences. A pick reachable only by
inference had to be marked MARGINAL.

**9/9 trigger, 10/10 non-trigger, 0 marginal** on this skill's own picks. The single MARGINAL in
the run went to `writing-plans`, whose description never contains the word "plan".

Four genuine two-way contentions, all resolved by description wording rather than by luck:

| Sentence | Contender | What decided it |
|---|---|---|
| `fix the bug where the trim handle jumps back to zero` | `systematic-debugging` | A direct order to fix, not a request to investigate. The exclusion clause "without changing code" carries this |
| `can you make the export button actually export?` | `systematic-debugging` | The literal phrase "just make it work" is in the description |
| `here is the plan in plans/invite.md, execute it` | `executing-plans` | "hands over a plan, an issue or a task file to execute", almost verbatim |
| `one shot this: rename the upscale engine label` | `refactor` | "rename" is refactor's word, but "one shot this" is an exact string match |

Two exclusions were load-bearing: `review my code before I merge` and `open a PR for this branch`
both routed away, and the second to `NONE` rather than to a wrong pick.

Worth recording: `test-driven-development` describes itself as *"Use when implementing any
feature or bugfix, before writing implementation code"* — near-total lexical overlap with this
skill — and it was **never picked once**. Specificity beat generality on every sentence.

### Second pass — flags, and deciding the kind of check

Three gaps closed on review by the author.

**Flags.** The gate decides well, but there was no way to overrule it, and no way to say "plan
only". APEX's answer was twelve flag pairs, twenty-two tokens; nobody retains that. This skill
takes five concepts — `--fast` / `--full`, `--plan`, `--review` / `--no-review`, `--proof` /
`--no-proof`, `--resume <run-id>` — and says what happens without them. The two negative flags
are obeyed on high-risk work and named in the report as a skipped control, rather than being
quietly refused or quietly dropped.

**Validation did not choose anything.** The first draft said to read the package scripts and run
the relevant checks — which is what a model does anyway, so by rule 0 it earned no space.
Rewritten around two decisions it can actually get wrong: the **level** the acceptance criterion
demands (static, unit, integration, real run, read-back — and a weaker one never substitutes for
a stronger one required), and the **kind** keyed to what the diff touched. Fourteen rows, each
naming the check that proves it *and* the check that looks like proof and is not: a UI component
against a test that asserts on props without mounting; a race against one green run; a packaged
app against the development build; deleted code against a suite that still passes.

**Review did not choose either.** Now three ordered questions — what gets reviewed (the
uncommitted diff for this task, never `HEAD~1`), who reviews it (a cold re-read by the author on
low risk, named as such and not passed off as independent; one fresh context on medium; one per
lens on high), and what each lens hunts for, in failure classes rather than themes: an id from
the request used to fetch with no ownership check, a permission enforced in the UI but not the
handler, a column dropped in the same deploy as the code that stopped writing it, a listener
never removed.

### The flags broke the description, and the routing test caught it

Putting the flag tokens in the `description` so a bare `--fast` would fire looked free. It was
not. Re-running the blind routing test on the flag forms returned one severe bad pull:

> `--review this branch before I merge` → **netsu-implement**

The description listed `--review` as a trigger and, one sentence later, excluded *"reviewing or
debugging without changing code"*. A token match walked straight into the case the exclusion
clause exists to prevent — and the sentence is near-identical to `review my code before I merge`,
which routes correctly to `requesting-code-review`. A self-contradiction inside a single
description, not an edge case. `--proof check the upscale output` had a milder version of it.

The fix is a distinction worth keeping: **a flag belongs in the description only if it can carry
a request on its own.** `--resume <run-id>` and `--plan the notification system` have no other
words to fire on — without the token, the first matches nothing and the second goes to
`writing-plans`. `--review` and `--proof` never appear alone; they modify an implementation
request that already fires on `add`, `fix`, `implement`. So they stay in the flags table and come
out of the description, with the reason written next to them so nobody helpfully adds them back.

Re-run after the fix: **4/4 clean.** `--review this branch before I merge` routes to
`requesting-code-review`, `--resume <run-id>` and `--plan the notification system` to this skill,
both on literal token matches rather than inference.

Two residues, examined and left alone.

`--proof check the upscale output` now has no home at all — it routes to `systematic-debugging`
by inference, marked marginal. That is the correct outcome: a request to prove existing behaviour
is not a request to change code, and no installed skill owns it. The gap is in the skill set, not
in this description.

`--plan` overlaps `writing-plans` by name. No contradiction — nothing here excludes planning, and
a user typing `--plan` wants this skill's contract and task graph, which is what they get. On the
reference machine `writing-plans` carries `disable-model-invocation: true` and cannot fire at
all, so the contention is theoretical today. Kept, and recorded rather than quietly ignored.

One clarification the re-run produced. A token match fires the skill, but this description says
nothing about what resuming *means* — `20260915T204500Z-invite-flow` carries no signal of its
own. That is rule 4 working as intended: the description decides yes or no, and the body teaches
the mechanic. A description that explained resume would be spending always-loaded budget on
something only the body needs.

Worth noting what the test is actually good for. Both defects it has found on this skill were
invisible to reading: the first time a description that fired only by inference, this time a
description that contradicted itself four lines apart. Neither survives contact with a dispatcher
that sees nothing but descriptions.

Sizes after the pass: parent 79 of 100; children 69 / 168 / 72 / 109 of 300. Description 523
characters.

### Third pass — the diff itself, on 2026 numbers

The first two passes governed the plan and the checks. Neither governed what lands in the file,
and a correct plan produces a bad diff in exactly two ways: code naming things that do not exist,
and code that exists but should not. Both are the same test — *what in the repository or in the
request put this line here?* — so they are one child, `code.md`, loaded before the first edit on
both paths.

**Invention.** Across 199,845 code generations in April 2026, five frontier models from five
vendors named non-existent packages at 4.62% to 6.10%, against roughly 20% for the open-source
cohort a year earlier. The rate fell; the mechanism did not. The finding that sets the rule is
convergence: 127 identical fake names appeared across all five models, and 53 were still free to
register — 41 on PyPI, 12 on npm. **Re-prompting is therefore not a check.** The same invention
comes back with the same confidence, from five different vendors. Only the lockfile, the
definition, the declaration or current documentation settle it.

**Compounding.** 5% error per step is 23% over five steps. That is the argument for validating at
each task boundary rather than once at the end, and it is now written where the execution step
can see it — a five-task plan checked only at the end *is* the 23% case.

**Padding.** GitClear, June 2026, 623 million changes across 2023–2026: refactoring −70%,
duplication +81%, copy/paste +41%, cross-file reuse −35%, code older than a year touched −74%.
And the one that earned its own table row: **error-masking catch blocks +47%**, which turns
"delete the try/catch that only rethrows" from taste into a measured regression. Correlational,
and the report says so — but the counter-move costs one `rg` before adding a block.

### The measurements are dated on purpose

Raised by the author mid-pass: instructions calibrated on how models failed in 2024 are calibrated
on a machine that no longer exists. The first draft of this child cited 2025 figures as current
and was wrong to. Every number in `code.md` now carries its cohort and date, with a note at the
top saying why, and rule 8 of `SKILL-RULES.md` was extended to require it of any skill making a
claim about model behaviour — plus the distinction that matters when re-reading an old skill: the
rate goes stale, the mechanism usually does not.

**Reuse, promoted from a table row to a section.** Named by the author as the thing that goes
wrong most: the agent writes a component, a client or a helper the project already ships. The
GitClear signal for it is cross-file reuse, down 35% while duplication rose 81%, and one row in a
"do less" table was not going to carry it.

The reason it survives review is worth stating in the skill, because it explains why the fix has
to be a pre-edit step and not a review step: writing the generic version from memory is instant,
finding the local one costs a search. A cost asymmetry, not ignorance. By review time the code
works — it is merely the second implementation of something that existed. So `code.md` now ships
a lookup table of where to search per artefact kind, and one test that needs no search at all:
*if what you are about to write would look identical in any other project, you have not looked.*

The section also separates two rules that get conflated, which is how a narrow change becomes a
refactor: duplication you **add** is forbidden, duplication you **find** is reported and left
alone. The rule of three keeps the third occurrence as the threshold for extracting, on the
grounds that extracting on the second tends to produce a helper with a boolean parameter and two
call sites — worse than what it replaced.

**The fast path was too bare.** It loaded `code.md`, so it inherited the rules about what may go
in a diff, but it had nothing of the full path's discipline around the edit. Two borrows, both
compressed to the point where they cost almost nothing:

*Acceptance, at one twentieth the cost.* The full path writes objective, non-goals, acceptance and
risk. The fast path writes one sentence — what would prove this worked. It doubles as triage: a
change whose proof you cannot state in a sentence is not as narrow as it looked, and that counts
as the first surprise.

*Read your own diff.* `git diff`, read rather than recalled, against five checks drawn from
`code.md` and `review.md`. The full path hands the diff to a fresh context; here the author
re-reads it cold, which is weaker and still catches most of what a reviewer would find on a narrow
change. `review.md` already required calling that a re-read and not a review; `fast.md` now says
the same thing at the point where it happens.

`fast.md` went 71 → 96 lines against `full.md` at 171 — still visibly the light path, which was
the constraint.

Sizes after the pass: parent 82 of 100; children 165 / 96 / 171 / 72 / 109 of 300.

### Execution — NetsuRush, replacing an upscale factor with a target resolution

The first real run. Full path, `--plan`, on a repository with **276 already-modified files** from
the author's own in-progress work. Landed: a pure decision function plus its test, both engines
taking an explicit target, the IPC contract, the UI bar, six locales. 85/85 Node, 143/143 Python,
`check:core`, `build` and `check:i18n` green; runtime reported `NOT_RUN` because `AGENTS.md`
forbids launching the app.

What the skill earned on this run, that reading the code would not have found:

- `UpscaleSources.tsx:75` **renders** each clip's resolution and line 216 throws it away. "Know the
  source size" was not a feature to build, it was a line to stop deleting. Step 1b-style inventory
  of the actual controls found it; a plan written from the framework would have added a probe.
- Three of the five surfaces mounting the settings component edit an **export profile**, not a run
  — there is no source to measure. That killed the source-aware design mid-flight.
- The baseline rule did its job twice: nothing of the 276 files was staged, and `git diff --stat`
  reporting 201 lines on one file was correctly reported as **9 mine**.

### The defect the run exposed: it stopped in the middle

Called by the author, and correct: *"il s'arrête en plein milieu d'une implémentation… je veux que
s'il pose des questions, c'est au début."*

The skill licensed it in writing. `full.md` said to *"ask again only for a newly discovered choice
that changes product behaviour"* — an open permission to halt at any point, which is exactly what
happened at roughly 60% done, with the feature unusable and two questions on the table.

Both questions had an obvious reversible default. The saved-profile default was `0` — opt-in,
nothing existing changes. The second was purely additive and inert while the first is `0`. Neither
needed a human.

The rule now: **questions happen before the first edit, or not at all.** `full.md` gained a
*"settle every decision now"* sweep before the plan is shown — enumerate the choices the graph
implies rather than meeting them one at a time — and the execution step opens with *"no questions
from here"*. A decision that surfaces late takes the **reversible default**, defined as the option
that leaves existing behaviour unchanged, and gets a line in a new report section: *Decisions you
made for the user*, with the one edit that flips each. The only surviving mid-run stop is an
**action** outside the granted scope — authority, not design.

Worth separating, because the author's complaint was not "stop asking": the four questions asked
*before* any edit were answered readily, and one of them corrected the skill's own framing. The
cost is not the question. It is the position.

Sizes after the fix: parent 90 of 100; children 165 / 97 / 182 / 72 / 109 of 300.

### Second run — NetsuRush, the preview optimisation in the Adobe panel

Full path, on the rule just added. It held: **one** batch of two questions before the first
edit, answered at once, and no stop afterwards across three review passes and two re-plans.

The request was "carry the app's thumbnail work to the Premiere/After Effects extension, and do
not touch the app's". Exploration found the panel already runs the same React code, and that two
things do not reach it: the transport (Tauri's socket-less asset protocol falls back to HTTP/1.1,
sharing six sockets with RPC and two event streams) and the settings (per-origin `localStorage`,
so the panel re-encoded what the app had produced). Both were fixed, tested, and killed by mutants.

What the run taught the skill, in order of cost:

- **The review found that the feature could not work at all.** The panel's iframe never received
  the core token, so every `/media` request was refused — before and after the change. Exploration
  asked *what will break* and never *does the path work today*. With the real run `UNAVAILABLE`
  (no host application), nothing but a reviewer tracing the request end to end could see it. When
  the strongest check is out of reach, tracing one request from the surface to the response is the
  substitute, and it belongs in exploration, not in review.
- **A fix for a finding introduced a worse finding.** Passing the token to the iframe handed it to
  whatever answers on the Vite template port — any project in development. The second review pass
  caught it. `review.md` says to re-run the checks a fix invalidates; it does not say to re-review
  the fix, and here that was the pass that mattered.
- **The edit tool rewrote bytes the author owned.** One stray CRLF in a file already carrying the
  author's work was normalised to LF, twice, invisibly in `git diff`. Only a byte diff against a
  pre-edit copy showed it. The baseline rule protects files from being staged or reverted; it does
  not yet say to compare bytes on files that were dirty before the run.
- **A test harness default swallowed a sentinel.** `networkMs: undefined` triggered the parameter
  default and the "no timing entry" case silently tested the other branch. The mutant run is what
  exposed it — a green test that cannot fail is the case `verify.md` warns about, met in the test
  file itself.

Left for the author to decide, not applied: `full.md` still says *"show the plan and ask what is
left"*, which reads as a mandatory checkpoint even when nothing is left to ask.

Checks: `tsc` and `build` green; 1167/1167 Node tests on 123 files; the 124th never exits (open
handle in the author's in-progress agent module), classified `FAIL_UNRELATED`. Runtime in the
hosts: `UNAVAILABLE`.

### Fourth pass — proof over volume

The author's verdict on that run: *"il a fait beaucoup trop de tests pour rien"*, and what they
wanted instead was proof that it works, then a review that validates it.

The run's own numbers agree. Two full suites (1,167 tests, one run of 25 minutes), four builds,
five rounds of mutants, three review passes — and not one real request. After the run, two
`curl` calls against the core already running on the machine took under a second and showed:

- `GET /media` without the token → `403`: the blocker the review had found by reading, confirmed.
- `localhost` costs **211 ms** per new connection against **1 ms** for `127.0.0.1` on that
  machine (global IPv6, so `::1` is tried first). The alias the whole transport fix rests on
  would be rejected by its own probe there. No unit test could have shown it.

What the sources say, read at the source on 2026-09-16:

| Source | Date | What it adds |
|---|---|---|
| Simon Willison, *Your job is to deliver code you have proven to work* | 2025-12-18 | See it work yourself; paste the commands and their output; a test that fails if the implementation is reverted |
| Simon Willison, *Showboat and Rodney* | 2026-02-10 | Proof documents built from executed commands, re-runnable; agents can still cheat by editing the document |
| Claude Code best practices | 2026 | Show evidence rather than assert success; a reviewer asked for gaps finds some in sound work, and chasing all of them over-engineers |
| SWE-ABS (arXiv 2603.00520) | 2026-02-28 | Strengthened tests reject 19.71% of patches that passed SWE-bench Verified; top system 78.8% → 62.2% |
| SpecBench (arXiv 2605.21384) | 2026-05-20 | Visible tests saturated by every agent; held-out gap +28 points per tenfold code size |
| ImpossibleBench (arXiv 2510.20270) | 2025-10-23 | Agents modify tests or overload operators to pass contradictory tests |
| Cursor cloud agents, Replit App Testing | 2026 | Vendors ship screenshots, videos and replayable test sessions as the proof artefact |

Changes: `verify.md` now opens with **prove the behaviour** — known state, act on the real
surface, capture the real output, before and after for a bug — with a per-surface proof table and
the rule to use a running system before writing `UNAVAILABLE`. Volume is bounded: touched suites
and their callers once on the final tree, a new test seen failing once against a pre-edit copy,
no mutation campaigns, stop when every criterion has its proof. The report opens with the proof
table. `review.md` returns a **VALIDATED / NOT VALIDATED** verdict on that table before any
finding, in one pass; fixes are re-proved, and only security or data-safety fixes are re-reviewed.

Execution test of the change, blind: a fresh agent given only the four files and the NetsuRush
situation planned the two `curl` proofs first, the touched suites only, no whole-repository run,
no mutants, and a verdict-first review. It also listed eight ambiguities; six were fixed (an
example row that overclaimed, secrets in pasted output, reverting without a stash, what "the
whole codebase depends on" means, when twenty runs apply, proofs that would write to a live
system).

Sizes: parent 93 of 100; children 165 / 98 / 188 / 99 / 148 of 300. Description unchanged, so
the routing results stand.

### Fifth pass — closing the lessons the runs left open

A full re-read against the rules, before finalising:

- The two lessons the journal recorded but the skill did not carry are now in it. Exploration
  asks **does the path work end to end today**, settled by one real run — the question that would
  have found the missing token before any plan. And a file that was already dirty is copied aside
  before editing, so the author's bytes are checked by a byte diff, not by `git diff`.
- *"Show the plan and ask what is left"* no longer reads as a mandatory checkpoint: with nothing
  left to ask, the run says so and starts, unless the user asked to see the plan.
- Secrets and tokens are `high` risk by name; a `low` full-path diff still gets a cold re-read;
  a `high` diff gets two reviewers at most; `run.json` carries `proofs`.
- The parent lost its paragraph explaining why some flags are absent from the description. It was
  maintainer rationale, not agent behaviour, and rule 4 already holds it.

Sizes: parent 88 of 100; children 165 / 99 / 195 / 99 / 148 of 300.

Still without a real run: the fast path, and `--resume`.

### Merge checklist

Everything except the execution test. Sizes on 2026-09-18, after the runs above: parent 88 lines
against a 100 ceiling, children 99 (fast), 195 (full), 166 (code), 148 (verify) and 99 (review)
against 300. Description 571 characters, since it gained the exclusion for interface design and
text. `fast.md` and `full.md` are entry points and sit in the routing table; `code.md`,
`verify.md` and `review.md` are resources, named outside it with the step that loads them, per
rule 1.
