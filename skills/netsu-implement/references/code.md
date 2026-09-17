# Code

Loaded at the editing step of both paths. The plan can be right and the diff still bad.

Every line answers one question: **what in the repository or in the request put it here?**

- No answer, and it names something → you invented it.
- No answer, and it names nothing → it is padding.

Those are the only two ways a correct plan produces a bad diff.

> Every figure below was measured on the 2026 model cohort and is dated. Model behaviour moves
> fast enough that a rule calibrated on 2024 numbers is calibrated on a different machine. Check
> the dates before trusting the thresholds.

## 1. Never write an identifier you have not read

Imports, package names, method names, config keys, environment variables, CSS classes, i18n keys,
route names, table columns, event names. Open the thing, read its signature, then call it.

Frontier models hallucinate far less than they used to and have not stopped. Across 199,845 code
generations in April 2026, five frontier models from five vendors named packages that do not
exist at rates of **4.62% to 6.10%** — against roughly 20% for the open-source cohort a year
earlier. The rate fell; the mechanism did not change.

**Asking the model again is not verification.** The fake names converge: 127 identical
non-existent package names appeared in the output of all five models, and 53 were still free to
register — 41 on PyPI, 12 on npm. Attackers register those and wait. Re-prompting returns the
same invention with the same confidence, because the invention is not random. It comes from
shared training data and from the name simply looking right for that ecosystem.

Only these count as verification:

| Claim | What settles it |
|---|---|
| This package exists | It is in the lockfile or the manifest — not that you recognise the name |
| This function exists | `rg` finds its definition, and you read the signature |
| This type has that field | The declaration, not an object literal you saw somewhere |
| This key exists | The config, schema or locale file it belongs to |
| This API behaves this way | Current documentation, whenever the version could have moved |

**A new dependency is a decision, not a detail.** Check the lockfile first. If it is not there,
say you are adding one and why, before writing the import — never as a side effect of a code
block.

## 2. Errors compound along the chain

A per-step error rate of 5% is a **23% chance of a wrong trajectory over five steps**. That is the
whole argument against saving verification for the end: the cheapest place to catch an invented
symbol is the step that wrote it, because every later step builds on it and inherits it.

So check at the boundary of each task, not once at the end. A five-task plan validated only at
the end is the 23% case.

## 3. Say you could not find it

Abstention beats invention. *"I could not find where the retry limit is configured — I looked in
`config/`, the env schema and the client constructor"* is a finished answer.

A plausible placeholder is worse than a gap, because it typechecks, reads naturally and survives
review. What you invented is exactly what nobody looks at twice.

## 4. Use what the project already has

**Search before you write anything new.** Not a component, hook, helper, type, constant or style
until you have looked for the one that exists.

This is the failure that looks like success. Writing the generic version from memory is instant;
finding the local one costs a search. It is a cost asymmetry, not ignorance — which is why it
survives review: the code works, it is just the second implementation of something the project
already had. Measured across 2023–2026, cross-file reuse fell 35% while duplication rose 81%.

| Before writing | Look here first |
|---|---|
| A UI component | The components directory and the design-system package. `rg -i` the role word — button, dialog, modal, toast, field |
| A hook | `rg --files -g "use*"` |
| A formatter, date or currency helper | `lib/`, `utils/`, then `rg "format\|toLocale\|Intl\."` |
| An API call | The project's client. A raw `fetch` in a codebase that has one is a bug |
| A type or interface | `rg "interface <Name>\|type <Name>"` before declaring it |
| A constant or magic value | `rg` the literal itself — the value is often already named |
| A colour, spacing or font | The token file. A hex literal in a themed project is a defect |
| A string a user reads | The design file (`DESIGN.md` or the project's style guide) for the voice and the product's words, then the locale files. A new string goes where the others live, never inline in a translated app |
| An error class, a logger, a validator | The one already wired into the error path |

**The tell:** if what you are about to write would look identical in any other project, you have
not looked yet. Code that fits this project names this project's things.

Do not reach into another feature's internals to avoid duplicating. If two features need the same
thing, it moves to shared — and that is a change worth saying out loud, not one to slip in.

### Duplication you find, versus duplication you add

Two different rules, and conflating them is how a narrow change turns into a refactor.

- **Adding**: you do not get to add a second copy. Search first, reuse, or say why reuse is wrong
  here.
- **Finding**: an existing duplicate is not yours to fix in this diff. Name it in the report, say
  where the copies are, and leave it. The user asked for a change, not a cleanup.

Wait for the **third** occurrence before extracting an abstraction. Two similar blocks are a
coincidence often enough that extracting on the second produces a helper with a boolean parameter
and two call sites — which is worse than the duplication it replaced.

## 5. Add as little as the change allows

The common failure is not wrong code. It is redundant code that works. Across 623 million code
changes from 2023 to mid-2026, as about a quarter of commits came to carry measurable AI
authorship, eight maintainability signals moved the wrong way at once:

| Signal | 2023 → 2026 |
|---|---|
| Refactoring | −70% |
| Duplication | +81% (40.3 → 73.0 per million changed lines) |
| Copy/paste | +41% |
| **Error-masking catch blocks** | **+47%** |
| Cross-file reuse | −35% |
| Touching code older than a year | −74% (1.7% → 0.46%) |

Correlation, not proof of cause — the authors say so. But the shape is unambiguous, and the
counter-move is cheap: **before adding a block, `rg` for the thing that already does it.**

| Default behaviour | Instead |
|---|---|
| A comment restating the line under it | Delete it. Comment *why*, never *what* |
| `try/catch` that logs and rethrows | Let it throw. This is the +47% signal |
| `if (!x) return` for a case the types forbid | Delete it, or make the type carry it |
| A helper with one caller | Inline it |
| An options object with one call site | A positional argument |
| A default for a value that is required | Required means required |
| A wrapper that only forwards | Call the thing |
| Logging added while debugging | Remove it before reporting |
| A test asserting the framework works | Test your behaviour |

Same rule for the words inside the code. A log line, an error message and a comment are read by
someone at their worst moment. Say what happened and what to do. No apology, no restatement of
the obvious, no exclamation mark.

## 6. Look like the code around it

Naming, error handling, file layout, import order, test shape: copy what the neighbours do. A
diff that reads as a different author's work costs a reviewer more than it saves you — and the
repo's convention is evidence, while your preference is not.

## Before you call it written

- Every new import resolves — typecheck, or open the lockfile.
- Every symbol you called, you read the definition of.
- Every line survives *what put it here?*
- Nothing you wrote already existed in the project under another name.
- No leftover logging, no commented-out code, no TODO you have no plan for.
- The diff touches only what you said it would.

## Anti-patterns

❌ Imports a package whose name sounds right → ✅ Not in the lockfile, not written.
❌ Re-prompts to check whether a package is real → ✅ Five vendors return the same fake name.
❌ Invents a plausible config key rather than admitting a gap → ✅ Say where you looked.
❌ Verifies once at the end of a five-task plan → ✅ 5% per step is 23% over five.
❌ Writes a `<Modal>` the project already ships → ✅ Search the components directory first.
❌ Raw `fetch` in a codebase with an API client → ✅ Code that fits names this project's things.
❌ Writes a helper because the block looked repetitive twice → ✅ Third occurrence, or leave it.
❌ Refactors duplication it stumbled on → ✅ Name it in the report. Not this diff.
❌ `// increment the counter` above `counter++` → ✅ Comment why, or say nothing.
❌ Copies a working block and edits two lines → ✅ That is the measured failure, not a shortcut.
❌ Wraps a call in try/catch that only rethrows → ✅ Error-masking is up 47%. Let it throw.
❌ Leaves `console.log` in a diff it reports as done → ✅ Read your own diff before reporting.
