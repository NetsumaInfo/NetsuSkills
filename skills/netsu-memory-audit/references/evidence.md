# Evidence ladder, verdicts, report

Loaded by every level before its first finding. Nothing here is level-specific.

## The ladder

A finding exists only if it sits on a rung. The rung **caps** the verdict: no amount of
confidence promotes a rung-5 reading into a critical.

| Rung | Evidence | Produced by | Verdict ceiling |
|---|---|---|---|
| 1 | A referenced path, file, symbol, command, flag or env var no longer exists | `mechanical.py` (`git ls-files`, `rg`) | **critical** |
| 2 | Two documents assert contradictory things | reading agent, both sides quoted | **critical** |
| 3 | A count stated in prose differs from the count in code | `mechanical.py`, then confirmed by hand | **moderate** |
| 4 | A broken internal link or dead cross-reference | `mechanical.py` | **moderate** |
| 5 | The described behaviour reads differently in the code now | reading agent, both excerpts quoted | **moderate** |
| 6 | The code was touched more recently than the doc describing it | `mechanical.py` (`git log`) | **minor** |

Rung 6 reads the document's **last commit**, while the reading pass reads the **working tree**.
A file rewritten but not committed reports as ancient. Check `git status` before trusting an
age, and say so in the report when the tree is dirty.

**Rung 6 never produces a finding on its own.** In an active repository nearly every doc is
older than some code it mentions; a tool that reports this reports noise. Use it to sort which
files the reading pass opens first, and nothing else.

A candidate with no rung is dropped. Not downgraded, not "noted for later" — dropped. The
value of this audit is that every line in the report is checkable; one unprovable line in the
table costs more trust than ten real findings buy.

## Verdicts

| Verdict | Means | Typical rung |
|---|---|---|
| **critical** | Will actively mislead whoever reads it. Mechanically proven wrong | 1–2 |
| **moderate** | Probably wrong; a human has to read the code to settle it | 3–5 |
| **minor** | True, but stale in shape: duplicated, superseded, too vague to act on | 3–6 |
| **obsolete** | The subject no longer exists at all. Proposed for **deletion**, never edited | 1 |

`critical` and `obsolete` are not the same thing. A critical line says something false about
something that exists. An obsolete line is about a thing that is gone — editing it is pointless,
so it is only ever proposed for deletion, and deletion is confirmed on its own.

## Report format

One file, `docs/audit/memory-<YYYY-MM-DD>.md` in the audited project. Untracked unless Netsuma
says otherwise.

```markdown
# Memory & docs audit — 2026-10-29

Levels run: memory, docs. Files read: 34. Agents: 3 (haiku).
Findings: 4 critical · 7 moderate · 5 minor · 2 obsolete.

| # | File:line | Verdict | Rung | Claim | Reality | Proposed fix |
|---|---|---|---|---|---|---|
| 1 | CLAUDE.md:22 | critical | 1 | "run `scripts/build.sh`" | no such file; `git ls-files` has `scripts/build.mjs` | replace the path |
| 2 | docs/setup.md:8 | critical | 2 | "Node 18 minimum" | `AGENTS.md:14` says Node 22 | reconcile; code says 22 (`package.json` engines) |
| 3 | README.md:41 | moderate | 3 | "12 skills" | `skills/` holds 8 | recount |
| 4 | memory/api-keys.md | obsolete | 1 | describes `legacy-api/` | directory deleted in 4f2a9c1 | delete the file |
```

Rules for the table:

- **Claim** is quoted from the document, not paraphrased. With its conditions. A claim scoped
  to one case ("in CI, …") keeps that scope in the quote or the finding is invalid.
- **Reality** names the command or file that proves it: `git ls-files`, a commit sha, a line
  reference. "The code does X" with no pointer is a rung-5 finding at best, and needs the code
  excerpt.
- **Proposed fix** either copies the correct value out of the code, or says `delete`. It never
  invents replacement prose.
- Rows sort by verdict, then rung.
- A brief handed to a reading agent carries the four verdict words verbatim, not just the
  rungs. An agent without the vocabulary invents a word, and the rows come back needing a
  manual re-grade.

## The fix pass

Only after an explicit go.

1. Netsuma approves per line, or per bucket ("apply all the rung-1 ones").
2. Rung-1 fixes may be applied as one batch — each is a mechanical substitution.
3. Rung-5 fixes go one at a time, each shown before it is written.
4. Deletions are confirmed separately from edits, even inside an approved bucket.
5. A memory line that is still true but too narrow is **shrunk, not deleted**: keep the fact,
   drop the detail that went stale. (Compression over deletion, the one idea worth taking from
   `neural-memory`, read 2026-10-29.)
6. After the pass, append a `## Applied` section to the report with what was changed and what
   was skipped. The report is the record; do not delete it.

## Anti-patterns

| ❌ Default behaviour | ✅ What this skill enforces |
|---|---|
| Flags every doc older than the code it mentions | Rung 6 orders the queue; it is never a finding |
| "This section appears outdated" | Claim quoted, reality proven by a command or a sha |
| A severity rated by how bad it sounds | Severity capped by the evidence rung |
| Reports and rewrites in one turn | Report, go, then fix |
| Deletes a memory that is merely narrow | Quote its scope; shrink it instead |
| Rewrites a stale paragraph into plausible new prose | Copy the value from the code, or delete |
