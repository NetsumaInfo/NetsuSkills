# Verify

Loaded at the validation step of both paths. The goal is **one proof per acceptance criterion**:
the behaviour, observed, with its real output attached. Not the largest pile of green checks. A
thousand passing tests can sit on an assumption that one real request would have broken.

> Why a green suite is weak proof on its own. The figures below are dated and measured on the
> 2025–2026 cohort:
>
> - Strengthened tests rejected **19.71%** of the patches that passed SWE-bench Verified, and the
>   top system fell from 78.8% to 62.2% (SWE-ABS, February 2026).
> - Every frontier agent saturated the tests it could see. The gap to held-out tests grew by
>   **28 points for every tenfold increase in code size**, and one "compiler" that passed was a hash
>   table of the test inputs (SpecBench, May 2026).
> - Given tests that contradicted the spec, agents modified the tests or overloaded operators to
>   pass them. How often depended on the prompt, on test access and on the feedback loop
>   (ImpossibleBench, October 2025).
>
> These rates will move, but the mechanism will not. A test the agent wrote checks the agent's own
> reading of the task, so it cannot catch that reading being wrong.

## 1. Prove the behaviour

Make three moves for each acceptance criterion, in order:

1. **Known state.** Say what is true before you act: the service is up on port N, the file is
   absent, the setting is at its default.
2. **Act as the user or caller would.** Send the request, click, run the command, against the
   real thing and not a mock of it.
3. **Observe and capture.** Paste the real output or response, or take the screenshot. Never
   paraphrase it and never type it by hand.

For a bug fix, make the same three moves **before** the fix too. The reproduced failure is half the
proof, and the only part that shows you fixed the right thing.

| The criterion is about | The proof | Captured as |
|---|---|---|
| Something a user sees | Open it in a browser tool and do the action | A screenshot of the current build |
| An endpoint or a service | One real request, with and without the change's key ingredient | The command, the status, the body |
| A CLI or a script | Run it on a realistic input | The command and what it printed |
| Stored or persisted state | Write, reload or restart, then read back | The read-back |
| A setting or a flag | Both states | One observation per state |
| An external system | Read it from the system itself | Its answer, never your own config |
| Performance | Measure before and after, on the same input | Both numbers, and how they were taken |

**Use the running system before you write `UNAVAILABLE`.** A dev server, a local service or a
database that is already up gives a real observation in seconds, so use it. When the real surface
is out of reach (a host application, a device, a paid account), prove the closest boundary you
*can* reach. Hand the user the exact steps for the rest, and say which part is proven and which is
not.

A proof must be re-runnable: someone else pastes the command and gets the same answer. A proof
taken before a later edit is stale, so take it again. Mask secrets in what you paste: a token
becomes `$TK`, never its value.

A proof reads a live system; it does not change state its owner cares about. If proving a
criterion needs a write — a setting, a record, a file outside the repo — plan it in the
contract, before the first edit, or prove it on a copy.

Name each row after what was actually observed. A request the panel depends on is not the panel
showing thumbnails; when the gap is real, the row is **partial** and says what the user checks.

`--proof` makes a criterion without an observed proof a failed run rather than a note.
`--no-proof` skips this section, the checks below become the ceiling, and the report names the
skipped control.

## 2. Pick the checks that protect it

The proof shows the change works now, and the checks keep it working. Learn the repo's own
commands from its package scripts and CI workflow. **Never invent a command because another
ecosystem has one.** Then take the rows the diff actually hits:

| The diff touches | What protects it | What looks like protection and is not |
|---|---|---|
| Pure logic, a function | A test of the new branch **and** of the branch it replaced | A test of its happy path |
| A type or an interface | A typecheck of the whole package, every caller included | A typecheck of the edited file |
| A UI component | Mounting it and rendering it | A test asserting on props without mounting |
| A route or handler | A call asserting the status **and** the body shape | A unit test with a fabricated request object |
| A query | A run on realistically shaped data, checking the row count | The ORM compiling |
| A schema or migration | Applying it forward on a copy, then rolling back | Reading the migration file |
| Config, bundler, build | The production build | `dev` starting without errors |
| Locale or copy strings | The repo's key-parity check, plus a grep showing the old string is gone | The app rendering in one language |
| A fix to a race or a flaky failure | Twenty runs of the case that used to fail | One green run |
| A packaged or native app | The packaged artefact | The development build |
| A dependency version | The call sites that use it | The install succeeding |
| Deleted code | The build, plus a grep for surviving callers | The suite still passing |
| Permissions or auth | The **denied** path, not only the allowed one | Signing in successfully |
| Anything behind a flag | Both states of the flag | The default state |

## 3. Run what the diff needs, then stop

- Run the suites of the modules you touched, and of their direct callers, **once, on the final
  tree**. Run the whole repository only when the diff touches something the whole codebase
  depends on: a build config, a global type or setting, a dependency version.
- A test you add must **fail when your change is reverted.** See it fail once, then pass: point
  it at a pre-edit copy of the file, never at a stash of a tree that holds someone else's work.
  No mutation campaigns.
- A check re-run after an edit that cannot affect it is noise.
- **Stop when every criterion has its proof** and the touched suites are green.

## 4. Classify every result

| Status | Meaning |
|---|---|
| `PASS` | Ran on the current tree, and passed |
| `FAIL_INTRODUCED` | Your change caused it |
| `FAIL_PREEXISTING` | Reproduces without your change, or predates it |
| `FAIL_UNRELATED` | Belongs to work already in the tree, or to an area you did not touch |
| `UNAVAILABLE` | A service, credential, binary or environment it needs is absent |
| `NOT_RUN` | Deliberately skipped, with a stated reason |

**Never turn `UNAVAILABLE`, `NOT_RUN`, or an unproven guess into `PASS`.** When a broad check
fails and the cause is unclear, reproduce it against the pre-change revision before you blame
yourself, or clear yourself. Fix `FAIL_INTRODUCED`, then re-run what the fix invalidated. Name
`FAIL_PREEXISTING` and `FAIL_UNRELATED`, and leave them alone.

## 5. Report the proof first

The report opens with one row per acceptance criterion. A row may say **not proven**, and that is
a result too:

| Criterion | Before | Action | Observed | Proven |
|---|---|---|---|---|
| The core serves the panel's thumbnail request | `GET /media` without token → `403` | the same request with `tk=$TK` | `200 image/webp` | yes |
| Thumbnails show in the Premiere panel | — | — (the host cannot be driven here) | — | **partial**: open the panel, the grid shows images |
| Grid media leave the busy host, without added latency | — | `curl -w %{time_connect}` on both host names | `211 ms` against `1 ms` | **no**: the alias costs more than it frees |

Then comes the check ledger, one line per check: the command, its result, its classification.

```
npm run typecheck          exit 0    PASS
node --test test/invite    exit 0    PASS
npm run test:e2e           —         UNAVAILABLE   (no display server)
npm run lint               exit 1    FAIL_PREEXISTING (12 errors before the change)
```

## Anti-patterns

❌ Reports 1,167 green tests and not one real request → ✅ One observed proof per criterion, then the touched suites.
❌ Writes `UNAVAILABLE` while the service runs on the machine → ✅ Call it. Two requests take one second.
❌ Proves a UI change with a unit test → ✅ Open the UI and look.
❌ Types the expected output into the report → ✅ Paste what the command printed.
❌ Adds a test that still passes with the change reverted → ✅ That test proves nothing. See it fail once.
❌ Runs the whole repository for a three-module diff → ✅ The touched suites, once, on the final tree.
❌ Reports `PASS` for a suite that errored on a missing binary → ✅ That is `UNAVAILABLE`.
❌ Trusts one green run of a race condition → ✅ Run it twenty times; one pass proves nothing.
❌ Fixes twelve lint errors that were already there → ✅ Name them. They are not in scope.
❌ Keeps screenshots taken before the last three edits → ✅ Stale evidence is not evidence.
