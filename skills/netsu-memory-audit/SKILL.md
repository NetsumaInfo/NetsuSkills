---
name: netsu-memory-audit
description: Use when the user asks to audit the memory, audit the documentation, check whether CLAUDE.md, AGENTS.md, MEMORY.md or the docs are still accurate, find out what is out of date or obsolete in the docs, clean up or prune memory files, check the docs against the code, or rate what is stale as critical, moderate or minor. Covers agent memory files, project documentation, and code comments that describe code that moved. Do NOT use for writing a README from scratch, for auditing installed skills, or for editing prose style.
argument-hint: "[memory|docs|comments|everything] [path or scope]"
---

# NetsuMemoryAudit

Find the lines in memory and documentation that are **confidently wrong**, prove each one, rate
it by the strength of that proof, and only then repair.

This is an index. Pick the levels below, load those files, follow them. Do not work from this
page alone — it holds no procedure.

## Pick the levels

| The user wants to audit… | Load |
|---|---|
| memory files: `MEMORY.md`, `memory/*.md`, `CLAUDE.md`, `AGENTS.md`, `.claude/rules/` | `references/memory.md` |
| project documentation: `README`, `docs/`, ADRs, `CHANGELOG`, contributing guides | `references/docs.md` |
| comments and docstrings that describe code that has since moved | `references/comments.md` |

Levels compose. "audit everything" loads all three; "audit my memory" with no other word loads
`memory.md` only. Each level is a full pass with the same verdict scale — only the file set
changes. Run them in the order listed and write one report.

Always loaded, by every level, before its first finding: `references/evidence.md` — the evidence
ladder and the report file. It is not an entry point.

## Requirements

- A git repository. Rungs 1, 3, 4 and 6 read `git ls-files` and `git log`; without them, say so
  and run the reading rungs only.
- `scripts/mechanical.py` (Python 3.9+, stdlib only). Run it before spawning any agent.
- Subagents, for rungs 2 and 5 only. Without them, read in the main thread and say the run was
  sequential.

## Rules that hold across every level

- **Evidence first, always.** Run `scripts/mechanical.py` before reading anything by hand. It
  produces every rung-1, 3, 4 and 6 candidate for free, and it decides which files the reading
  pass even looks at.
- **No rung, no finding.** A line that merely feels outdated is not reported. Drop it.
- **Recency is not evidence.** Rung 6 orders the queue and never becomes a finding alone.
- **Report, then fix on go.** Never edit in the same turn as the report. Netsuma approves per
  line or per verdict bucket; only then rewrite. Deletion is approved separately from editing.
- **Quote the scope before killing a claim.** A fact that is true in a narrow case reads as
  wrong from outside it. Mem0's resolver deletes still-valid preferences for exactly this
  reason (discussion #4787, read 2026-10-29). Quote the claim whole, with its conditions.
- **Cheapest model, batched.** Reading agents run on `haiku` or an `ocx-gpt-5-*-mini` route,
  never Opus, never inherited. One agent per batch of 5–15 files, never one per file. State
  the agent count before spawning.
- **The audit never invents a replacement.** A proposed fix either comes from the code or says
  "delete"; it does not describe what the doc should have said.

## The report

This page owns the output; the loaded level owns the checks. One report per run, whichever
levels ran, on one scale:

| Verdict | Means | Typical rung |
|---|---|---|
| **critical** | Will actively mislead whoever reads it. Mechanically proven wrong | 1–2 |
| **moderate** | Probably wrong; a human has to read the code to settle it | 3–5 |
| **minor** | True, but stale in shape: duplicated, superseded, too vague to act on | 3–6 |
| **obsolete** | The subject no longer exists at all. Proposed for **deletion**, never edited | 1 |

`critical` and `obsolete` are not the same thing. A critical line says something false about
something that exists. An obsolete line is about a thing that is gone — editing it is pointless,
so it is only ever proposed for deletion, and deletion is confirmed on its own.

Every row carries `file:line` and the command or reference that proves it. Rows sort by verdict,
then rung. `critical` and `obsolete` are never capped; `minor` stops at **15 per level**, with
the count dropped stated. A run with four findings reports four — the table is never padded.
`references/evidence.md` holds the rungs and the file layout.
