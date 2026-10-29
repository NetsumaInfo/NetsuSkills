# Level: comments

Audit comments and docstrings that describe code which has since moved. Load `evidence.md`
first. Run this level only when it is asked for: it is the noisiest of the three and the
easiest to get wrong.

## Scope — narrow on purpose

Audit only comments making a **checkable claim about something outside their own lines**:

- a docstring stating parameters, return type, raised errors or defaults;
- a comment naming another file, function, flag, env var, endpoint or ticket;
- a `TODO` / `FIXME` / `HACK` carrying a condition ("remove once X ships");
- a comment stating a number, limit, timeout or version;
- a comment describing an invariant the code is supposed to hold.

Everything else is prose style, which belongs to a deslop pass. A comment that paraphrases the
line under it is not this skill's business.

## Procedure

1. **Find the candidates.** Comments only, never code.

   ```bash
   rg -n -g '*.{py,js,ts,tsx,jsx,go,rs,rb,java,kt,swift}' -e '(TODO|FIXME|HACK|XXX|DEPRECATED)' -e '^\s*(#|//|\*)\s'
   ```

2. **Order by churn.** A comment in a file that has changed often since it was written is the
   most likely to lie:

   ```bash
   git log --since='12 months ago' --name-only --format= -- . | sort | uniq -c | sort -rn | head -40
   ```

3. **Check the checkable, mechanically.** For every symbol, path, flag or env var named in a
   comment, confirm it still exists (`rg`, `git ls-files`). Gone → **critical**, rung 1. This
   is most of what this level finds, and it needs no agent.

4. **Docstring against signature (rung 5).** Compare each docstring with the signature right
   below it: a parameter renamed or removed, a default that changed, a return type that no
   longer matches. Both excerpts go in the report. 10–15 files per agent, cheapest model.

5. **Conditional TODOs.** A `TODO: remove once the v2 endpoint lands` whose condition is met is
   **obsolete**, proposed for deletion — with the code it guards, if the comment says so. A
   TODO with no condition is never a finding: it is a wish, not a claim.

6. Write the report (`evidence.md`), stop, wait for the go.

## Comments-specific verdict notes

- **Never fix a comment and its code in the same change.** A stale comment is fixed by changing
  the comment. If the code is what is wrong, that is a bug report, not an audit finding — say
  so in the report and leave the code alone.
- A commented-out block is not a stale comment. Report it once, **minor**, one line for the
  whole repository.
- A licence header, a generated-file banner or a linter pragma is never a finding.
- A comment contradicting its own code is **critical** only when it is load-bearing — a
  docstring, a public API, an invariant. Inside a private function it is moderate.

## Anti-patterns

| ❌ Default behaviour | ✅ What this level enforces |
|---|---|
| Audits every comment in the repository | Only comments making a checkable external claim |
| Reports comments that restate their own line | That is prose style, not staleness |
| "Fixes" a stale comment by also changing the code | Comment fixes touch comments. Code is a bug report |
| Flags every `TODO` | Only a TODO whose stated condition is already met |
| Flags a licence header or generated banner | Skipped outright |
| Runs by default alongside the other levels | Asked for explicitly, or not at all |
