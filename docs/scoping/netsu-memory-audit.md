# Scoping — `netsu-memory-audit`

Status: **scoped, not written.** Decided 2026-10-29.
Nothing under `skills/netsu-memory-audit/` exists yet and nothing gets written until Netsuma
says go (`AGENTS.md`, "Before writing or editing a skill").

## The moment it fires

"audit my memory", "is my documentation still accurate", "the docs are out of date",
"check CLAUDE.md against the code", "clean up the memory files". A project where memory and
docs have accumulated for months and nobody knows which lines are still true.

## What the agent gets wrong without it

It trusts what it reads. A memory file or a `docs/` page is loaded as context and treated as
ground truth, so an obsolete line silently steers every later decision — the agent recommends
a flag that was removed, a path that moved, a convention the project dropped. Worse, memory
systems only ever append: nothing in the default loop ever deletes a fact that stopped being
true. The failure is not "the docs are thin", it is "the docs are confidently wrong".

## Shape

**Umbrella** (`docs/SKILL-RULES.md` §1). Three levels, picked from the request or named as a
flag; the parent routes and does not teach. One name to remember.

| Level / child | Scans | Load when |
|---|---|---|
| `memory` | `~/.claude/.../memory/*.md` + `MEMORY.md`, `CLAUDE.md`, `AGENTS.md`, `.claude/rules/` | "audit my memory", default when no level is named |
| `docs` | `README`, `docs/`, ADRs, `CHANGELOG`, contributing guides | "are the docs up to date", "audit the documentation" |
| `comments` | docstrings and comments describing code that moved | "the comments lie", asked explicitly only |

Levels compose: `/netsu-memory-audit memory docs`. Each level is a full pass with the same
verdict scale; only the file set changes.

Resource (not an entry point, pulled mid-run by every level): `references/evidence.md` — the
evidence ladder and the verdict scale below, so the three children do not each restate it.

## The core decision: evidence, not vibes

Every finding carries the evidence that produced it. This is the whole skill — an LLM asked
"is this doc stale?" will happily invent staleness, and a timestamp comparison flags every
doc in a busy repo. Ranked, strongest first:

| Rung | Evidence | How it is produced | Verdict ceiling |
|---|---|---|---|
| 1 | Referenced path, file, symbol, command or flag no longer exists | `git ls-files`, `grep`, `rg` — mechanical | **critical**, auto-fixable |
| 2 | Two documents assert contradictory things | cross-read, both quoted side by side | **critical** |
| 3 | A count in prose differs from the count in code (routes, tests, skills, tools) | count both, compare | **moderate** |
| 4 | Broken internal link or dead cross-reference | resolve each link | **moderate** |
| 5 | Doc describes behaviour that reads differently in the code now | model judgement, both excerpts quoted | **moderate**, never auto-fixed |
| 6 | Code touched more recently than the doc describing it | `git log` on both | **minor** — a hint to look, never a finding on its own |

Rung 6 alone never produces a finding. It orders the queue; that is all it is good for.
A finding with no rung is dropped, not downgraded.

### Verdict scale

- **critical** — the line will actively mislead. Mechanically proven wrong (rung 1–2).
- **moderate** — probably wrong, needs a human read (rung 3–5).
- **minor** — true but stale in shape: duplicated, superseded, too vague to act on.
- **obsolete** — subject no longer exists at all. Proposed for deletion, never edited.

## Output

One table, ranked, written to `docs/audit/memory-<date>.md` (project-local, untracked unless
Netsuma says otherwise):

```
| # | File:line | Verdict | Rung | Claim | Reality | Proposed fix |
```

Then: **report, then fix on go.** The skill never edits in the same breath as it reports.
Netsuma approves per line or per verdict bucket, and only then does the skill rewrite.
Rung-1 findings may be applied as a batch once approved; rung 5 is always one by one.

Deleting a memory file is a separate confirmation from editing one.

## Fan-out

Netsuma's call: these are documentation reads, so use **the cheapest model available** —
`haiku`, or the `ocx-gpt-5-4-mini` / `ocx-gpt-5-6-luna` routes. Never Opus, never the default
inherit.

- One agent per **batch of files**, not per file. Batch so each agent reads 5–15 documents.
- Hard cap per run, and the parent states the count before spawning.
- Each agent returns findings in the table shape above, with evidence quoted. It never edits.
- Rung 1, 3, 4 and 6 are produced by **commands, not by agents** — `rg`, `git log`, link
  resolution — before any agent is spawned. Agents only do rungs 2 and 5, the parts that need
  reading. This is what keeps the cost down and the false-positive rate low.

## Prior art read (2026-10-29)

- `awrshift/agent-memory-kit` (MIT) — closest relative. Plain-text memory, user approves every
  entry, a `memory-audit` skill, a `stale-refs` helper that flags paths that no longer exist
  (= rung 1), dated lines, and hard caps (180 lines / 32 KB per `MEMORY.md`) that trigger the
  audit. Take: the caps-as-trigger idea and `stale-refs`. Leave: the "pattern seen on 3+ dates
  → promote" threshold, which is a convention nobody measured.
- `nhadaututtheky/neural-memory` (MIT) — graph memory with decay, consolidation, compression
  tiers and an A–F "brain health" grade. **No published formula for any of it.** Take nothing
  numeric. The idea worth keeping is compression: full → summary → essence, i.e. a stale-but-
  true memory shrinks instead of being deleted.
- Doc-drift tooling (Mintlify, `@whenlabs/stale`, several `doc-drift` skills) — all converge on
  the same four categories: code↔doc drift, cross-doc conflict, stale refs, count drift. One
  separates "confirmed drift" from "inferred gap"; that split is the rung ladder above.
- Mem0 — its LLM conflict resolver can delete a still-valid context-specific preference,
  because the update call reads the fact text and not its metadata. Lesson adopted: **a finding
  must quote the scope of the claim it wants to kill**, and deletion is never automatic.
- Letta/MemGPT — no decay, no confidence score; the agent rewrites memory blocks itself.
  Confirms that there is no validated decay half-life to copy.

Nobody in this list publishes a calibrated severity score. Ours is evidence-rung based for
exactly that reason — a rung is checkable, a score is not.

## Anti-patterns to put in the skill

| ❌ Default behaviour | ✅ What this skill enforces |
|---|---|
| Flags every doc older than its code | Recency orders the queue; it is never a finding |
| "This section seems outdated" | Every finding quotes the claim and the contradicting reality |
| Rewrites docs while reporting | Report first, fix only after an explicit go |
| Deletes a memory that is merely narrow | Quotes the claim's scope before proposing deletion |
| Spawns one expensive agent per file | Cheapest model, batched files, mechanical checks run first |
| Rates severity by feel | Severity is capped by the evidence rung |

## Open questions

1. Does this collide with `skill-audit` (BACKLOG wave 6, #17)? `skill-audit` rates installed
   skills; this rates memory and docs. Different subject, same output shape. Keep separate, or
   make `skill-audit` a fourth level here?
2. Where does the report live — `docs/audit/` in the project, or `.private/`?
3. Should the caps idea travel: does `netsu-memory-audit` fire automatically when `MEMORY.md`
   crosses a line count, or only when asked?
