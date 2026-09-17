# Extract: shared components and tokens

Turn repeated UI into shared components and repeated values into tokens, then move every use to
them. Load this only when the user asks to extract, factor, consolidate or clean up components,
styles or a design system.

## 0. Frame

| | |
|---|---|
| Changes | The shared component or token folder, and the uses the plan of §3 lists |
| Never changes | What anything looks like or does. Parity is the rule; a visual change is a separate request |
| Asks first | Where shared UI lives, when the project has no components or token folder yet |
| Stops when | Every listed use is migrated, the old copies are deleted, and parity is shown |
| Returns | The plan, the diff summary, the proof of parity |

Principles from impeccable (`reference/extract.md`, read 2026-09-17).

## 1. Find the system

Where shared components live (`components/ui`, a `packages/ui`), how tokens are declared
(`references/visual.md` §3), naming, and what the component library already gives (shadcn/ui,
Base UI, Radix). A missing primitive comes from that library before it is written by hand
(`references/components.md` §2).

## 2. Find what repeats

```bash
grep -rhoE 'className="[^"]{40,}"' src --include='*.tsx' | sort | uniq -c | sort -rn | head -20
grep -rnE '#[0-9a-fA-F]{6}\b' src --include='*.tsx' --include='*.css' | grep -v -- '--color-' | head -20
node <skill dir>/scripts/scan.mjs ui src
```

A candidate is used three times or more **for the same job**. Two uses, or three uses for
different jobs, stay as they are: the wrong abstraction costs more than the copy.

| Candidate | Uses | Same job? | Becomes |
|---|---|---|---|
| Status pill in 5 files | 5 | yes | `StatusPill` with a `tone` prop |
| `#1F6F5C` in 9 files | 9 | yes, the accent | `--color-accent` (already exists) |

## 3. Plan

For each candidate: the name (the project's naming), the props or token name, the variants the
uses actually need (no more), and every file that will change. Show the plan before migrating when
more than ten files change.

## 4. Extract and migrate

1. Write the shared version with the same appearance and behaviour as the copies. States or
   accessibility the copies lack go in the report as follow-ups (`references/components.md`).
2. Move every listed use to it, one file at a time; keep behaviour and appearance identical.
3. Delete the old copies and any value the token replaced.
4. `grep` for survivors; nothing of the old pattern remains in the listed files.

## 5. Report and proof

```markdown
## Extract: <scope>

| Extracted | Uses migrated | Old code removed |
|---|---|---|
| `StatusPill` | 5 | 5 inline copies |
| `--color-accent` | 9 | 9 hex literals |
```

Proof of parity: the type check and the touched tests pass; captures of two migrated screens before
and after look identical; the `ui` scan shows fewer `palette-color` findings, and the
`references/visual.md` §2 counts drop. Code-only: say so.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| A shared component for something used twice | Three uses for the same job, or leave it |
| Twelve props "for later" | The variants the uses need |
| New component, old copies left in place | Every use migrated, copies deleted |
| A redesign slipped into the extraction | Identical look and behaviour |
| A second `Button` next to the library's | The library's, with a variant |
| Tokens named by colour (`--blue-button`) | Named by role (`--color-accent`) |
