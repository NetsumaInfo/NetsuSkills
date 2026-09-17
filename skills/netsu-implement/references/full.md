# Full path

A feature, a migration, or anything whose blast radius is bigger than the file you are editing.

## 1. Contract

Before reading code, write four lines and show them:

- **Objective** — the observable outcome, in the user's own words.
- **Non-goals** — what a reasonable reader might expect and will not get.
- **Acceptance** — how anyone could tell it works. Each item must be checkable by a command, a
  visible result, or a read-back. "It works" is not an acceptance criterion.
- **Risk** — `low` (copy, isolated style), `medium` (bounded feature or fix), `high` (auth,
  secrets or tokens, payments, migrations, concurrency, release, destructive or
  production-touching work).

Then capture the baseline:

```bash
git status --porcelain=v1 --untracked-files=all
git rev-parse --abbrev-ref HEAD --short HEAD
```

Record what is already modified, staged and untracked. **Never assume a clean checkout.** Work
already in the tree belongs to the user: do not stage it, revert it, fold it into your change, or
count it in your diff. Before editing a file that is **already dirty**, copy it aside: your delta
is the byte diff against that copy. Editing tools normalise line endings, and `git diff` hides it.

Read the local authority before choosing any command: `AGENTS.md`, `CLAUDE.md`, nested rule
files, the README, and the package scripts. The package manager and the check commands come from
there, never from what another project usually uses.

## 2. Explore

Answer only what you cannot already answer. For each question, name the artefact that settles it.

| Question | Settled by |
|---|---|
| Does the path work end to end today? | one real run through it — a request, a click, a command — before planning on top of it |
| Where does this behaviour live today? | the symbol, not the folder name |
| What already does something similar? | the nearest existing implementation |
| What will break? | callers, tests, types, generated output |
| What is the shape of the data? | the schema or the type, not an inferred example |

### When to delegate

Explore yourself by default. Delegate to read-only subagents **only when the breadth is real**:
three or more questions that are independent of each other's answers, each needing its own search
across an unfamiliar area — or an area you expect to read more than fifteen files to understand.

A delegated explorer:

- is read-only, and told so explicitly. It returns findings, never edits;
- gets one question, the paths worth starting from, and what a complete answer looks like;
- returns `file:line` for every claim.

Its answer is untrusted until you open the `file:line` yourself. Plan on what you verified, not
on what came back.

Do not delegate a single grep, a question you can answer from a file you have already read, or
anything whose answer you need before you can write the next question.

## 3. Plan

Pick the smallest coherent approach that follows the repo's existing patterns. Prefer additive
and reversible. For anything high-risk, name the way back out before you start.

One task per **independently verifiable unit** — not one per file:

```yaml
id: short-stable-id
objective: the observable outcome of this unit
depends_on: []
read_set: [files this task may read]
write_set: [files this task may write]
validation: [the exact command or check that proves it]
status: pending
```

`write_set` is a commitment. Needing a file outside it means the plan was wrong: record why,
update the task, continue. It never means widening in silence.

Map every acceptance criterion to at least one task. A criterion no task serves is a criterion
you will not meet.

### Settle every decision now

**This is the last moment you may ask anything.** Before showing the plan, sweep the graph for
choices it implies and answer them here: a default value that changes what existing saved state
produces, a name users will read, a behaviour that differs per surface, anything two reasonable
people would do differently. Ask them together, once.

Show the plan. If the sweep left questions, ask them now; if it left none, say so and start —
do not wait for an approval nobody asked for, unless the user asked to see the plan first. From
the first edit onward you do not stop: a decision you failed to anticipate takes the reversible
default and a line in the report.

Under `--plan`, stop here: show the graph, name the first task and the check that would prove it,
and write nothing.

### Persist it when the plan is big

When the graph has **three or more tasks**, or the work will not finish in one sitting, write it
down so the run survives a lost session.

Check the path is ignored before creating it:

```bash
git check-ignore -q .agents/ && echo ignored || echo "add .agents/ to .gitignore first"
```

Write `.agents/netsu/implement/<YYYYMMDDThhmmssZ>-<slug>/run.json`:

```json
{
  "run_id": "20260915T204500Z-invite-flow",
  "started": "2026-09-15T20:45:00Z",
  "revision": "a1b2c3d",
  "branch": "main",
  "objective": "…",
  "acceptance": ["…"],
  "risk": "medium",
  "baseline_dirty": ["src/legacy/parser.ts"],
  "tasks": [],
  "proofs": [],
  "checks": []
}
```

Update `tasks[].status` and append to `checks` as you go. No script, no extra dependency — it is
a file you write. Never put a secret, a token, or raw sensitive output in it.

`--resume <run-id>` continues one: read its `run.json`, re-check the revision and `git status`
against what it recorded, and re-plan from the first task whose evidence the current tree no
longer supports. Do not replay a mutation because the file still says `pending`.

## 4. Execute

Load `code.md` before the first edit — it governs what may go in the diff.

**No questions from here.** Re-plan, record, and keep going; the report carries what you decided.

Take the next unblocked task. Implement it inside its `write_set`. Run its `validation` before
moving on — a task whose check never ran is not done, and an error carried into the next task is
inherited by every task after it.

Re-plan, and say so, when: a dependency changes an interface, a check fails for a reason you did
not predict, a required command or credential turns out to be missing, the repository changed
under you, or the evidence contradicts an assumption.

Implementation stays in this session. Delegation is for exploration breadth (step 2), not for
writing the diff.

## 5. Validate

Load `verify.md`. **Prove each acceptance criterion first**: act on the real surface and capture
what it returned. That proof table is the review's input. Then run the checks the diff hits —
per task as you finish it, then the touched suites once on the final tree — and stop when every
criterion has its proof. Classify every result. Fix what your change introduced; leave
pre-existing failures alone and name them.

## 6. Review

Load `review.md` when the risk is `medium` or `high`, when the diff spans more than one module,
or when the user asked for a careful job; on a `low` single-module diff, re-read it cold as
`fast.md` step 5 does. The reviewer returns a verdict on the proof table first, then only
findings that break correctness, security, data or a requirement, in one pass. Resolve confirmed
findings and re-prove what they invalidated.

## 7. Report

- **The proof table first** (`verify.md` §5): one row per acceptance criterion, what was done,
  what was observed, and whether it is proven — including the rows that are not, with what the
  user must run to finish them.
- The review verdict.
- Files changed, grouped by task.
- The check ledger, compact, including what was unavailable or not run.
- **Decisions you made for the user**: what surfaced after the plan, which reversible default you
  took, and the one edit that flips it. A decision buried in the diff is a decision nobody made.
- Findings that were confirmed and fixed; risks left open, stated precisely.
- Anything in the tree that was already there and is not yours.

Stop there. Do not commit, branch, push or open a pull request.

## Anti-patterns

❌ Plans from memory of the framework → ✅ Plan from the code that is actually in this repo.
❌ Halts mid-graph to ask about a default → ✅ The plan was the moment. Take the safe one, report it.
❌ One task per file → ✅ One task per thing you can independently prove works.
❌ Spawns six explorers for a two-file question → ✅ Breadth is the trigger, not ambition.
❌ Takes a subagent's `file:line` on trust → ✅ Open it. Returned work is untrusted.
❌ Absorbs the user's uncommitted refactor into "the change" → ✅ Baseline, then never touch it.
❌ Writes `run.json` for a two-task plan → ✅ Three tasks or a second sitting, otherwise skip it.
❌ Declares done with the test suite unrun → ✅ Done is a check that ran, on the current tree.
❌ Validates by volume — every suite, four builds, mutant rounds → ✅ One proof per criterion, the touched suites once.
