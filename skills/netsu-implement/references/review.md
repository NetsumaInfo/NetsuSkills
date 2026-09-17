# Review

Loaded by the full path after validation, before the report. The point is a context that did not
write the code: the author's blind spot is structural, not a matter of effort. In order: **what
gets reviewed**, **who reviews it**, **is the proof real**, **what else they look for**.

## 1. What gets reviewed

The **actual uncommitted diff for this task**. Not `HEAD~1`, not the whole branch, not the files
as they now stand. Reviewing the final state instead of the change is how a reviewer ends up
filing findings against code that was already there.

The packet opens with the **proof table** (`verify.md` §5), then the diff, the original request,
the acceptance criteria, the project rules governing the touched area, the check ledger including
what was already failing, and every assumption still open.

## 2. Who reviews it

| Situation | Reviewer |
|---|---|
| Fast path, or a `low` risk diff | A cold re-read of the diff against the acceptance criteria, by you. Call it a re-read in the report — it is not an independent review |
| `medium` risk, one module | One fresh context, one packet, the lenses the diff earns |
| `high` risk, or two genuinely distinct lenses | Two fresh contexts at most, lenses split between them, non-overlapping packets |

`--review` forces a fresh context whatever the risk. `--no-review` drops to the cold re-read and
the report names the control that was skipped.

Reviewers are read-only. Merging two near-identical lenses is fine; it only duplicates the packet
to separate them.

**One pass.** A fix to a confirmed finding is **re-proved** — its proof rows and the checks it
invalidated run again — not re-reviewed. The one exception is a fix to a security or data-safety
finding: it gets one more look, at its own lines only, because a fix in that area is where a new
hole most often comes from.

## 3. Validate the proof first

The reviewer's first answer is a verdict on the proof table, before any finding:

- **VALIDATED** — every criterion has an observed proof, taken on the current tree, that shows
  what the row claims.
- **NOT VALIDATED** — name the criterion, and say what its evidence fails to show: output typed
  rather than captured, a test that would pass with the change reverted, a proof taken before a
  later edit, a mock standing in for the real surface.

A row marked **not proven** with its reason is honest, not a failure of validation. A row that
claims more than its evidence shows is. **NOT VALIDATED blocks the report** like a confirmed
finding: capture the missing proof, or downgrade the row to not proven and say why.

## 4. What else they look for

Pick the lenses the diff earns. A lens nothing in the diff touches produces noise, not coverage.

| Lens | Use it when the diff touches | Hunt for |
|---|---|---|
| **Correctness** | Branching, parsing, boundaries, error paths | An error path that swallows; a boundary off by one; a state reachable out of the order the code assumes; a partial write left behind when something throws; an ordering the data never guaranteed |
| **Contract** | An exported signature, a return type, a thrown error | A caller left on the old shape; a widened return nobody narrowed; an error now thrown where none was; a default that changed meaning |
| **Security** | Auth, tenancy, secrets, user input, anything leaving the process | An id from the request used to fetch without an ownership check; a permission enforced in the UI but not the handler; user input reaching a query, a shell or a path; a secret in a log or an error message; an origin or scope widened |
| **Data safety** | Schema, migrations, backfills, deletes | A migration that is not idempotent; a backfill with no batching; a column dropped in the same deploy as the code that stopped writing it; no way back |
| **Lifecycle** | Effects, listeners, timers, caches, concurrency | A listener never removed; a promise never awaited; state written after teardown; two writers racing; a cache nothing invalidates |
| **Maintainability** | New abstractions, cross-cutting edits, large diffs | An abstraction with exactly one implementation; a boolean parameter that selects behaviour; logic duplicated and already drifting |

## 5. Hold findings to a bar

A reviewer asked for problems reports some even when the work is sound, and chasing all of them
produces extra layers, defensive code and tests for cases that cannot happen (Claude Code
documentation, 2026). So a finding must break **correctness, security, data, or a stated
requirement** — the project's written rules count as requirements. Anything else is a note in
the report, never a fix.

Every finding carries `file:line`, a concrete failure scenario — the inputs or state, and what
goes wrong — evidence that **this diff** introduced or exposed it, and the smallest safe fix.

Reject on sight: style preference, "consider extracting this", speculative breakage with no path
to it, duplicates, and anything wholly outside the changed surface.

## 6. Dispose of each one yourself

Open the `file:line` before believing it. Then classify:

`CONFIRMED` · `NOISE` · `PREEXISTING` · `OUT_OF_SCOPE` · `UNCERTAIN` (name the exact missing
evidence).

Only `CONFIRMED` blocks the report. A high-severity `UNCERTAIN` gets investigated before you
decide, never waved through. Fix confirmed findings, then re-run every check and every piece of
proof the fix invalidated — including the proof rows in `verify.md`.

## Anti-patterns

❌ Reviews `HEAD~1` on a branch with four commits → ✅ Review the diff you actually made.
❌ Hunts for findings while no criterion was ever shown working → ✅ Verdict on the proof first.
❌ Three review rounds on one diff → ✅ One pass; re-prove the fixes, re-review only security ones.
❌ Runs every lens on every diff → ✅ A lens the diff never touches returns noise.
❌ Five reviewers on a two-file change → ✅ Lenses follow the diff, not the ambition.
❌ Files "this could be more idiomatic" → ✅ No failure scenario, no finding.
❌ Calls its own re-read an independent review → ✅ Name it for what it was.
❌ Fixes a reported issue without opening the line → ✅ Reviewers are wrong often enough to check.
❌ Fixes everything noticed, including pre-existing debt → ✅ Classify first, fix `CONFIRMED`.
❌ Fixes a finding and reports the old results → ✅ A fix invalidates the checks it touched.
