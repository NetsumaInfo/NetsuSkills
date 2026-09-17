# Test journal

One entry per merged skill. Evidence that the three tests in rule 11 passed.

| Date | Skill | Trigger | Non-trigger | Execution | Notes |
|---|---|---|---|---|---|
| 2026-09-15 | `netsu-readme` | 9/9 | 10/10 | slop audit over 15 real repositories | two defects found by the tests and fixed before merge |
| 2026-09-16 | `netsu-implement` | 9/9 | 10/10 | NetsuRush, upscale target resolution | the run exposed a real defect: it stopped mid-implementation to ask |
| 2026-09-16 | `netsu-implement` | — | — | NetsuRush, preview optimisation in the Adobe panel | questions stayed up front; review found a pre-existing blocker, then a flaw in its own fix |
| 2026-09-16 | `netsu-peccable` | 13/13 (rerun: 22/22 routed) | 12/12 | NetsuRush copy and UI reviews (read-only), a new screen built and rendered | three blind runs found 10 scanner bugs and 12 instruction defects, all fixed; lexicons for six languages |
| 2026-09-17 | `netsu-peccable` | — | — | report-only reviews of five real projects in up to six languages | coverage audit of 20 design skills; catalog checks added; two reviews said not validated, all findings fixed |
| 2026-09-17 | `netsu-peccable` | 17/17 (re-test 10/10) | 7/7 | not run yet on a project | sixteen framed children for impeccable's and Krehel's requests; one review said not validated, all fixed |
| 2026-09-17 | `netsu-peccable` | — | — | NetsuRush, five framed requests, report-only and code-only | the frames held; the run found raw i18n keys on screen that the scan missed; 12 defects fixed, three scanner checks added |

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

Everything except the execution test. Sizes on 2026-09-17, after the runs above: parent 88 lines
against a 100 ceiling, children 99 (fast), 195 (full), 166 (code), 148 (verify) and 99 (review)
against 300. Description 571 characters, since it gained the exclusion for interface design and
text. `fast.md` and `full.md` are entry points and sit in the routing table; `code.md`,
`verify.md` and `review.md` are resources, named outside it with the step that loads them, per
rule 1.

---

## `netsu-peccable` — 2026-09-16

Asked by Netsuma: one front-end skill, complete and well separated, for interface text in the
words people actually say and against the generic AI look, in copy and in components. Asked
mid-build: every language the products ship, not only French and English. The name is his, a nod
to `impeccable`.

### Research before writing

Three parallel surveys (the five reference skills he named, twenty other installed design and
copy skills, public skills and style guides) plus a direct search. What changed the design:

| Finding | Consequence |
|---|---|
| Claude Sonnet 5 prompting docs (read 2026-09-16): "don't use that color" moves the model to another fixed palette; a concrete spec or a choice between proposed directions works | No ban-list aesthetics. `new-ui.md` proposes 3 or 4 directions and asks once |
| Antislop, arXiv 2510.15061 (2025-10-16): token banning becomes unusable at 2,000 patterns | Short lexicons plus a scanner run after writing, not a giant list in the prompt |
| React Doctor 0.9.14 retired 12 taste rules: preferences "belong in an explicit design guide" | A per-project `DESIGN.md`, and one pointer line in `AGENTS.md` so every agent follows it |
| Anthropic's frontend-design skill (updated 2026-09-02) now flags cream, serif and terracotta: the fix for purple became the next cliché | `ai-look.md` is dated, re-checked every six months, and asks a question instead of naming a replacement |
| Subtitle frequencies predict word processing better than book counts (SUBTLEX; Lexique 3 `freqfilms2`) | "Everyday word" has a measurable tie-breaker in each lexicon |
| No public French microcopy skill; every installed design skill but `impeccable` carries `disable-model-invocation: true` | The French lexicon and typography were written from sources, not mined |

Shape: an umbrella with nine entry points and nine resources (six lexicons, `words-any.md`,
`states.md`, `ai-look.md`), a zero-dependency scanner and a `DESIGN.md` template.

### Trigger and non-trigger

Method as for the other skills: a fresh context saw only the descriptions.

First run, 25 sentences. Against the target set (`netsu-peccable`, `netsu-implement`,
`netsu-readme`, `react-doctor`, `copy-editing`, `deslop`): **13/13 trigger, 12/12 non-trigger**,
three picks only inferred (animations, tu or vous, dark mode). Against everything installed, it
lost six sentences to `impeccable`, `ui-ux-pro-max`, `make-interfaces-feel-better` and
`frontend-design`, whose descriptions carry those exact words. Adopting the skill means removing
them; the list is in `BACKLOG.md`.

Checked on disk on 2026-09-17: that run showed every description, but on this machine all of
them except `impeccable` carry `disable-model-invocation: true`, so the agent never picks them on
its own. In practice only `impeccable` competes; the others load only when typed.

Fixes: the description gained fonts, colors, dark mode, animations, settings pages, release
notes, translation, "in any language" and the design-file setup. `netsu-implement` gained the
matching exclusion ("designing, restyling or critiquing an interface or writing its text").

Second run, 22 sentences including Spanish, German and Japanese requests: **22/22** (15
`netsu-peccable`, 4 `netsu-implement`, 3 none). One pick marked marginal, and it belongs to
`netsu-implement`: a refactor reaches it only through "change something in the code".

### Execution

Three blind runs in fresh contexts, each told to follow the skill literally and to report where
it could not.

**Copy review, NetsuRush's Adobe panel, read-only.** 876 strings in six languages. The report is
usable as is: six raw errors shown on screen (P0), "Core", "Hôte" and "CEP" in front of editors,
tu and vous mixed, a glossary drift table. It also exposed the scanner:

- `locales/fr/ae.json` was read as the language "ae": the file name beat the folder;
- about 70 strings per language in `panel.js` were invisible, being a plain message table;
- JSX ternaries (`{busy ?`) were read as text and flagged;
- tu and vous were counted by pronoun only, so "Faites un clic droit" passed;
- "Oui" in a diagnostic line and Spanish "No" were flagged as vague buttons;
- the setup grep put `--include` after `--`, so grep read it as a file;
- a report-only request still led setup to write `DESIGN.md` and `AGENTS.md`.

**UI review, NetsuRush's collections screen, code-only** (its `AGENTS.md` forbids launching the
app). 22 findings by severity, among them no error state (a failed load spins forever), a
collection called « dossier » in its own editor, and amber text near 2:1 in the light themes.
Defects: `PRODUCT.md` was listed as a design file although it has no voice or look section; the
drift grep skipped `.ts`; locale files were never scanned; a design file drafted from the same
code minutes earlier turned drift into circular findings; the hover-only rule went quiet once
`group-focus-within` was present, though touch screens still never showed the action.

**New screen from scratch.** A fictional shot-logging app in static files: nine states, keyboard
order, dialog focus and flows checked in headless Chrome, scans at zero after fixing ten real
spacing findings. Defects: an HTML entity inside JSX text hid the whole string from the scan;
`--lang fr` did not force French; the confirmation example confirmed a reversible action, against
the rule above it; the stale-data example used the middle-dot join that `ai-look.md` lists; the
proof sections were too heavy for one screen; setup left no room for product questions.

Every defect above is fixed. After the fixes, the scanner on the same NetsuRush files: `panel.js`
0 → 148 strings, `fr/ae.json` read as French, three vouvoiement strings found with
`--address tu`, ternaries no longer reported.

**Proof by render.** Screenshots at 1280 px and 375 px. The first 375 px captures looked
broken: `chrome --headless --window-size=375,812` lays the page out wider and crops it, because
desktop Chrome keeps a minimum window width. The same states through viewport emulation (DevTools
protocol) showed a clean layout and no horizontal scroll. `new-ui.md` §8 now says to emulate.

### Multilingual

Lexicons for Spanish, German, Japanese and Chinese, written from Microsoft's localization style
guides, RAE and Fundéu, Duden and the Rat für deutsche Rechtschreibung, W3C JLReq and CLReq and
the national punctuation standards. No measured AI-vocabulary study was found for any of the four
(searched 2026-09-16), so each row says whether it comes from a dated practitioner list or is a
house rule. `words-any.md` covers every other language: the order to build rules in, a table for
15 more languages, right-to-left, scripts without spaces, and `Intl.PluralRules` output pasted
from Node 22.

The scanner now guesses the language from the script (Japanese, Korean, Chinese, Cyrillic,
Arabic, Hebrew, Thai) or from word lists, loads `words-<code>.md` whenever it exists, matches
Japanese, Chinese, Korean and Thai patterns as substrings, checks ¿ and ¡, German quotes and
full-width punctuation next to CJK text, and names every language it found without a lexicon.

Proof: one stock phrase per language flagged (« Sumérgete… », « Tauchen Sie ein… », シームレス,
赋能), one ordinary string per language left alone, Italian routed to `words-any.md`. The six
lexicons hold 418 rows; all parse.

### Sizes

Parent 75 of 100. Entry children 121 to 273, resources 146 to 293, all under 300. Scanner 750
lines. Description 747 characters: above the 300 to 500 aim and under the 1,024 cap. It covers
nine cases in any language, and the routing runs above are what justify the length.

### Independent review

One cold reviewer, one pass, verdict first: **not validated**, seven findings. It had run every
prescribed command, the scanner on both fixtures, and all 1,068 lexicon patterns.

- A loading button used `disabled`, which drops keyboard focus, against `states.md`.
- Japanese needed five recorded choices, but `DESIGN.md` had a slot for one, so setup could not
  finish without guessing.
- Chinese read its market from the wrong section.
- "Etat du projet" was tagged English, because `du` is French and German, so `fr-caps` never
  fired.
- `Requirements` sat at the bottom of the parent.
- Two files disagreed on whether an Undo toast times out.
- Three French `block` rows had neither a source nor a house-rule label.

All fixed. The reviewer re-checked only those seven: **validated**. One side effect noted, not a
defect: in a file that mixes both languages, English words the scanner does not know now take the
file's French; "Submit" is still caught by `vague-action`.

### Real projects — 2026-09-17

Asked by Netsuma: check that the skill covers what the design skills it replaces did, and test it
on his projects. Every run was read-only and report-only; no app was built or started.

**Coverage audit.** Two cold readers went through `impeccable` (about 150 files) and nineteen other
installed design and copy skills, capability by capability. Gaps added: error states beyond the
basic ones (session expired, not found, rate limited, edit conflict, optimistic rollback),
first-use hints, forms, drag alternatives, forced-colors focus, zoom and reflow, sticky bars,
colour blindness, page structure, images, browser extensions, native mobile, plan-only requests,
"bolder, calmer, simpler", and four dated rows in `ai-look.md`. Dropped on purpose: impeccable's
own tooling (live mode, hooks, scores). The audit also found claims in those skills that
contradict current sources (3:1 body text in dark mode, `transition` read as `all`, 44 px called
the WCAG minimum).

**Five projects.** A Tauri app in six languages, a browser extension in four, a monorepo with a
Stitch-format `DESIGN.md` and a TypeScript catalog, a marketing site, and a scoring app in six
languages. The reports found what the owner had asked about: raw errors on screen in every
project, translated placeholders (`{contar}`, `{タイムコード}`) breaking 149 strings in one app,
mistranslated key terms, claims on the site that the product does not keep. The runs also found what was wrong with the skill:

| Area | Found | Fixed |
|---|---|---|
| Language detection | `é` missing from the French letters; one-word English strings escaped the French lexicon; Spanish read as French | Accent classes, short strings take their file's language, Spanish marks weigh more |
| Extraction | TypeScript catalogs gave 0 strings; `__MSG_` keys, concatenated HTML and CSS values read as text; ternaries, `setError`, `textContent`, manifests and tooltip components missed | Key paths for TS catalogs, code filters that need code syntax, the missing call and attribute forms |
| Missing checks | No placeholder parity, missing keys, text left in code, dead keys, `(s)` plurals, decimal comma, apostrophe mix, glued strings, pinned locales, address outside French | `placeholder-mismatch` (ICU-aware, source language first), `locale-missing`, `not-translated`, dead-key marks on whole-app scans, and six smaller rules |
| False positives | Title Case on names, all caps on acronyms, `outline-none` on popups, German `null`, `(e)` gender forms | Names learned from the project, word checks, element-level context |
| Instructions | Which file owns a mixed review; questions in report-only runs; other-format design files; screenshots written into the project | One report owned by `review-ui.md`; questions at the end with a recommended answer; `VOICE.md`; `<scratch>` |

**Tooltips.** Added on Netsuma's request, in every language: tooltip attributes and components
are read, `long-tooltip` counts 80 characters, 40 in Chinese, Japanese and Korean.

**Validation.** A verification run on two projects and an independent review both said **not
validated** after the first fix pass: the new code filter dropped plain English sentences, ICU
branch bodies counted as placeholders, and the unused-key marks were wrong on one-screen scans,
among others. All fixed. The final reviewer confirmed every earlier item fixed except minor
ones, measured 0 false positives in about 45 sampled `placeholder-mismatch` findings and in about 60
`fr-nbsp` findings, and blocked on one defect: a JS string such as `"C:\Users"` crashed the scan.
That guard and the minor items were fixed and checked on the same probe inputs; the scan no
longer stops, and all 1,072 lexicon patterns still fire. Validated on that evidence, without a
further agent run, at Netsuma's request to keep the number of agents down.

Known limits, left as they are: a word the project writes in lower case somewhere can still make
a proper name look like Title Case; `outline-none` cannot see a `focus-within` wrapper more than
eight lines up; the German and Spanish address counts use pronouns only.

Sizes after this pass: parent 84 of 100, children 137 to 298, scanner 1,260 lines, description
747 characters.

### Compared with jakubkrehel/skills — 2026-09-17

Netsuma asked what the `better-*` skills of github.com/jakubkrehel/skills (MIT, commit 267330e1,
2026-08-29) could add. One cold reader compared all 48 files with this skill; nothing was
installed. Most of it was already covered, and most of its exact values are taste presets
(motion numbers, shadow-as-border, icon stroke table, APCA as the default) that the "no default
look" rule leaves out. Taken:

- A scanner bug: `--changed <ref>` diffed against the ref itself, so files changed only on the
  base branch were scanned. It now diffs from the merge base; checked in a throwaway repository.
- Dark-theme text tokens: white on the example danger, warning and success fills measured 2.72,
  2.25 and 2.22:1. Each fill now has its ink token, and a focus token, all measured.
- Ten `ui` checks, mirroring eslint-plugin-jsx-a11y and MDN where they exist: `static-click`,
  `positive-tabindex`, `hidden-focusable`, `img-alt`, `late-live-region`, `palette-color`
  (one finding per file), `svg-fixed-color` (single-colour icons only), `root-no-select`,
  `font-tag`, `justify`. On the five projects they add 0 to 105 findings each; the first
  run's false positives (lucide's `<Image>` icon, logos and flags, a scraper selector) are
  excluded.
- Branch and pull-request review without checking anything out, removed lines read, a status
  per finding; options built on request with a variant switcher; theme switches without a burst
  of transitions; `prefers-contrast`; container queries; `translate="no"`; more stress cases;
  a console snippet for animation timing, checked in Chromium (a transition keeps its easing in
  `getTiming()`, an animation in its keyframes).

Sources were read on 2026-09-17 before being cited (next-themes, MDN on `font-feature-settings`,
`translate`, live regions and `prefers-contrast`, eslint-plugin-jsx-a11y). All 1,072 lexicon
patterns still fire and the earlier fixtures give the same results.

### Framed children — 2026-09-17

Netsuma asked for a child per request, loaded only when asked, and framed, because a model left
free on design tends to do too much. Sixteen entry points were added, each opening with a frame
(what it changes, what it never changes, what it asks, when it stops, what it returns):
`typography`, `colors`, `layout` (split out of `visual`), `accessibility`, `details`, `emphasis`,
`stress-test`, `variants`, `review-branch` (the last two moved out of `review-ui`), `extract`,
`adapt`, `performance`, `onboarding`, `delight`, `effects` and `explain-ui`. They cover the
commands of impeccable (polish, bolder, quieter, distill, harden, onboard, delight, overdrive,
adapt, optimize, extract, audit, live) and the skills of jakubkrehel/skills (`break`, `variant`,
`interface-review`, `explain-interface`, the `better-*` family), rewritten in this skill's
stance and cited where a rule is theirs.

Trigger and non-trigger, one fresh context with only the six competing descriptions: 24
sentences, 0 wrong picks, 6 marginal and 1 tie with `copy-editing` (a newsletter). The
description then gained the missing words (bolder, calmer, simpler, speed it up, extract,
delight, pull request) and excluded newsletters. Re-test on the ten sentences at risk:
10 of 10 right, 1 marginal ("the export dialog feels off, fix
it" reads as a look problem or a bug; `netsu-implement` excluding restyling tips it). The 17 in-skill routes all matched the routing table; two ties (layout against
adapt, layout against details) were resolved in the files' opening lines.

Review, same context: **not validated**. A named pull request was reviewed against the working
tree; source dates read "2026-09-18" on 2026-09-17 (also in the previous commit); four files had
steps that broke their own frame (emphasis, extract, performance, details); four contradictions
(density values, animated properties, the stress-test page's lifetime, accessibility
severities). All fixed: `review-branch` sets one target and scans a copy of it; the dates are
corrected everywhere; the frames and steps agree; one density table in `layout` §4.

### NetsuRush, the framed children — 2026-09-17

One agent, one project, five requests that each name a child: `review-branch` on
`development`, `accessibility` on the Sharing panel and the Collaborate dialog, `colors` on the
whole app, `typography` on the Sharing panel, `stress-test` on the Collaborate dialog. The
project's `AGENTS.md` forbids running the app, so all five are code-only, and each report says
so.

The frames held: five reports, no project file changed, no fix applied, nothing rendered. The
stress-test page was written outside the project. Two slips, both harmless: one `git status`
ran without `GIT_OPTIONAL_LOCKS=0`, which may refresh the index's stat cache, and a temporary
file was written to `/tmp`, then deleted.

What the run found in NetsuRush:

- P0: `SharingSettings.tsx` calls `t("collab.projects.confirmDelete")` inside the `collab`
  namespace, so the confirmation and the button, including its accessible name, show the raw
  key. The `copy` scan did not see it.
- Colours: 18 pairs in each of the 11 themes, 198 in all; 38 fail. White on the `#4f86f7` accent
  gives 3.45:1 (`#0a0a0c` gives 5.73:1); input and checkbox borders reach 1.24 to 1.61:1; red text
  on its 20% red fill is below 4.5:1 in eight themes.
- Icon-only buttons without a name; names cut by `truncate` with no way to read them in full;
  selection disabled app-wide by a selector list split over lines (`index.css:1021`);
  `font-family: "Inter"` while the package declares `Inter Variable`.

Defects in the skill, all fixed:

| Seen in the run | Fix |
|---|---|
| The P0 key was not flagged | `missing-key`: a key the code asks for (`t()`, `i18nKey=`, `getMessage()`, both branches of a ternary) that no catalog has; a key starting with its file's name gets its own hint |
| The agent wrote its own contrast script for `oklch()` and translucent fills | `scan.mjs contrast`: hex, `rgb()`, `hsl()`, `oklch()`, alpha composited; `colors` §2 lists the pairs to measure |
| Unnamed icon buttons went unflagged | `icon-button-name` in the `ui` scan |
| The split selector list was missed | `root-no-select` reads a selector spread over several lines |
| Overlapping paths scanned a file twice | Files deduplicated |
| A plural « vous » counted as the formal address | Plural forms ignored (`vous êtes tous`, `ensemble`) |
| The branch review mixed 14 commits with 241 uncommitted files, and the local `main` was behind | Committed range only, uncommitted work counted apart, base `origin/<name>`, quiet `git status`, `--changed` avoided on a dirty tree |
| The dialog loads its own data and sits in a portal | Stress-test uses the project's test stub, one scenario per URL, and a "To check, not seen" list; no page in a project that forbids running |
| No conformance claim in the project | Accessibility still measures WCAG 2.2 AA; the scan is a floor, not the proof |
| `Inter` against `Inter Variable`; a desktop app captured at phone width | `typography` §1 and its proof |
| Five report-only requests, five draft DESIGN.md files | One draft per session; fonts and colours are enough to cover the look |

Checks after the fixes: the earlier fixtures give the same findings, plus the four
`missing-key` they contain; lexicons 1,072 of 1,072; the five projects of the first round scan
without error. NetsuRush again: 33,222 strings, 8 `missing-key`, all real; 678 UI files, 76
`icon-button-name`, a sample all real.

Netsuma decided to keep `impeccable` installed next to this skill (`docs/BACKLOG.md`).

### Merge checklist

Passed. Umbrella: 25 entry points in the routing table, each opening with its frame, and nine
resources named outside it with the step that loads them. Parent 88 of 100, children 77 to 298
of 300. Description 993 characters, under the 1,024 cap and well above the 300 to 500 aim: it
has to name 25 cases in any language, and the routing runs above are what justify it. `disable-model-invocation` not set. Every child has an anti-patterns
table, dated claims, and runnable commands. The scanner needs only Node, declared under
`Requirements`. English throughout, with French, Spanish, German, Japanese and Chinese strings
only as examples and lexicon data.

The two plugin manifests went to 0.4.0 with the framed children; the fixes since keep it.
