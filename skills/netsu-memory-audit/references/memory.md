# Level: memory

Audit the files loaded into every session as ground truth. Load `evidence.md` first.

Memory is the worst place for a stale line. A `docs/` page is read when someone goes looking;
a memory file is injected into the context of every request, unasked, and steers answers that
were never about it.

## File set

| Where | What |
|---|---|
| Project | `CLAUDE.md`, `AGENTS.md`, `.cursorrules`, `.github/copilot-instructions.md` |
| Project | `.claude/rules/*.md`, `.claude/memory/**` |
| User | the memory directory named in this session's system prompt: `MEMORY.md` plus one file per fact |

Ask before reading a user-level memory directory outside the project. Report its findings
separately — they are not the project's to fix.

## Procedure

1. **Mechanical pass.**

   ```bash
   python skills/netsu-memory-audit/scripts/mechanical.py --level memory --json
   ```

   For a user memory directory, point it there: `--paths <dir> --root <dir>`.

2. **Index integrity** — memory-specific, and the most common real defect. Check by hand:
   - Every `MEMORY.md` pointer resolves to a file that exists → otherwise **critical**, rung 1.
   - Every memory file is pointed at from `MEMORY.md` → an orphan is never recalled, so it is
     **minor** whatever it says, with "add to the index" as the fix.
   - Every `[[wiki-link]]` in a body resolves to another memory's `name:`. An unresolved link
     is not a defect — it marks a memory worth writing. Report as **minor**, never delete.
   - `name:` in the frontmatter matches the filename. A mismatch breaks every link to it.

3. **Contradiction pass (rung 2).** This is where memory fails hardest: two facts added months
   apart, both true when written, now mutually exclusive. One agent reads the whole set at once
   — a contradiction cannot be found in a batch of one. If the set exceeds what one agent
   holds, batch by `metadata.type` (`user`, `feedback`, `project`, `reference`), because
   conflicts cluster inside a type.

   Quote both sides. A pair where one side is explicitly scoped ("in CI", "for this project")
   is **not** a contradiction — it is two scoped facts. Drop it.

4. **Reality pass (rung 5).** For each `project` and `reference` memory, check the thing it
   describes still works that way: a named flag, a dashboard URL, a ticket, a convention. A
   memory naming a file, function or flag that no longer exists is rung 1, caught in step 1.

5. **Supersession.** A later memory that restates an earlier one with a change is not a
   contradiction — the earlier one is **obsolete**. Propose deleting the earlier, keeping the
   later, and say which sentence changed.

6. Write the report (`evidence.md`), stop, wait for the go.

## Memory-specific verdict notes

- A decision recorded with a condition that has since been met ("defer until the v2 branch
  lands", and it landed) is **critical**, not minor: it instructs against the current state.
- A `user` memory is never auto-fixed. Who someone is and how they want to work is theirs to
  correct; report it and ask.
- A `feedback` memory whose **Why** no longer holds is **obsolete**, even when the rule itself
  still sounds sensible. The why is what makes it applicable.

## Anti-patterns

| ❌ Default behaviour | ✅ What this level enforces |
|---|---|
| Treats a long memory file as a problem | Length is not a defect. A wrong line is |
| Deletes the older of two similar facts | Supersession needs the changed sentence quoted |
| Flags a narrow fact as contradicting a broad one | Scoped facts coexist; quote the scope |
| Rewrites a `user` memory to be more accurate | Report it; the user corrects their own file |
| Leaves an orphaned memory file alone because it reads fine | An unindexed memory is never recalled |
| Deletes a dangling `[[link]]` | It marks a memory worth writing. Keep it |
