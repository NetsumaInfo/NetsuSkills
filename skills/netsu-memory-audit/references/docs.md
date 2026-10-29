# Level: docs

Audit the documentation committed to the repository. Load `evidence.md` first.

## File set

`README.md`, `CONTRIBUTING.md`, `CHANGELOG.md`, everything under `docs/`, `doc/`, `adr/`.
Skip generated output (an API reference built from source, coverage reports) — fix the
generator, not its product. Skip `docs/audit/`: that is this skill's own output.

## Procedure

1. **Mechanical pass.**

   ```bash
   python skills/netsu-memory-audit/scripts/mechanical.py --level docs --json
   ```

   Rung-1 and rung-4 hits are findings as they stand. Rung-3 hits are *claims to verify*, not
   findings: count the real thing before reporting one.

2. **Order the queue by rung 6.** The script says which documents describe code that has moved
   since. Read those first. Nothing in that list is a finding yet.

3. **Batch and spawn (rungs 2 and 5).** 5–15 documents per agent, cheapest model. Each agent
   gets the documents, the evidence ladder, the report format, and one instruction: *report
   only what you can prove with a quote from the document and a quote from the code.* Agents
   never edit and never propose prose.

   **Spell the four verdict words out in every brief** — `critical / moderate / minor /
   obsolete`. An agent given the rungs but not the vocabulary invents its own word for the
   bucket, and the rows then have to be re-graded by hand (measured 2026-10-29: one brief of
   three omitted the list, and that agent returned 22 rows labelled `stale`).

   Batch by subject, not by size. A contradiction between two setup guides is only visible to
   an agent holding both.

4. **Install and setup first.** The costliest staleness in any repository is a setup
   instruction that fails: a command, a version floor, an env var, an install step. Check these
   against `package.json`, `pyproject.toml`, `Cargo.toml`, lockfiles, CI workflow files and
   `Dockerfile` before anything narrative. A wrong setup line is **critical** even at rung 5.

5. **Count drift (rung 3).** Count the real thing with a command, and put the command in the
   report. Counts inside a dated journal, changelog or release-note entry are a **record of a
   past state** — never a finding. Only counts written in the present tense are claims.

6. **Cross-doc conflict (rung 2).** README against `docs/`, `CONTRIBUTING` against the real
   workflow, two guides describing the same step. Settle it against the code, and name which
   document should change.

7. Write the report (`evidence.md`), stop, wait for the go.

## Deleted code is not an abandoned plan

A PRD, a roadmap or a spec describes intent. When the code it describes has been **deleted**,
the default reading is that the feature is dead — and that reading is wrong as often as it is
right. A deletion says the first implementation was dropped; it says nothing about whether the
plan survives, changed tooling, or moved to another repository.

So: a section describing deleted code is reported as **moderate, rung 5**, phrased as *"this
describes an implementation that no longer exists — is the plan still live?"* — never as
`obsolete` with a delete, unless a document in the repository states the abandonment. Ask
before cutting. Measured 2026-10-29: a run deleted a PRD's whole game section after a 44 668-line
removal; the engine had in fact moved to two sibling applications, and the section needed
rewriting, not deleting.

The inverse rule still holds: a section describing something **not yet built** is a plan, not
drift. Both rules say the same thing — only the code's absence is evidence, never its meaning.

## Docs-specific verdict notes

- A broken external URL is **minor**, unless it sits in a setup step, where it is critical. Do
  not fetch every link in a large repository; check the ones a reader must follow to proceed.
- An ADR describing a decision that was later reversed is **not** stale — an ADR is a record.
  The defect is the missing superseding ADR. Report as **moderate** against the index, not
  against the ADR.
- A `CHANGELOG` entry is never obsolete. It is history.
- A documented feature that no longer exists is **obsolete**; a documented feature that works
  differently is **critical**.

## Anti-patterns

| ❌ Default behaviour | ✅ What this level enforces |
|---|---|
| Reports every document older than the code | Rung 6 sorts the reading order, nothing else |
| Flags an ADR for describing a reversed decision | An ADR is a record; the missing successor is the defect |
| Flags counts in a changelog or journal entry | Past-tense records are not claims about now |
| Reads narrative docs before setup instructions | Setup fails loudest; audit it first |
| One agent per document | 5–15 per agent, batched by subject so conflicts are visible |
| Rewrites a stale section into plausible new prose | The fix copies the value from the code, or deletes |
