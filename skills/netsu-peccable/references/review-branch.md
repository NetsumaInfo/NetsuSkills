# Review a branch or a pull request

Review what a change did to the interface and its text, not the whole product. Load this only
when the user asks to review a branch, a pull request, a commit range or "what I changed". The
rules for each finding come from `references/review-ui.md` and `references/review-copy.md`.

## 0. Frame

| | |
|---|---|
| Changes | Nothing in the working tree. A fetched pull request adds one remote-tracking ref; copies for the scans go to the scratch folder |
| Never changes | The working tree: no `gh pr checkout`, `git checkout`, `git switch`, `git stash` |
| Asks first | Only when there is no change to review (§1) |
| Stops when | The resolved scope, its surfaces and the removed lines are reviewed once |
| Returns | The scope block, the findings with a status, the proof of §6 |

Adapted from Krehel's `interface-review` (github.com/jakubkrehel/skills, read 2026-09-17).
Correctness, tests, security and performance belong to the project's code review: name such a
concern once and move on.

## 1. Resolve the scope

A target the user names wins: `pr 482`, a branch, a ref. Set it once and use it in every command
below. Otherwise the target is `HEAD`, and the scope is the first that applies:

1. The branch is ahead of its merge base with the default branch: that range. Uncommitted and
   new files are counted and listed apart, and reviewed only when the user asks.
2. The tree has uncommitted changes: those.
3. Neither: there is nothing to review. Check for an open pull request on this branch and offer
   it first; otherwise offer the last commit (short hash and subject), a target to name, or a
   review of the screens as they are (`references/review-ui.md`). Then wait.

The default branch is `origin/<name>` as last fetched; if the local branch of that name is behind,
say so. Every command is read-only; `GIT_OPTIONAL_LOCKS=0` keeps `git status` from touching the
index.

```bash
export GIT_OPTIONAL_LOCKS=0
default=$(git symbolic-ref --short refs/remotes/origin/HEAD 2>/dev/null || echo origin/main)
target=HEAD                                             # or a branch, a ref, or a pull request:
git fetch origin pull/482/head:refs/remotes/pr/482 && target=refs/remotes/pr/482
base=$(git merge-base "$default" "$target")
git log --oneline "$base".."$target"
git diff --name-only "$base" "$target"                  # the committed change
git status --short 2>/dev/null | wc -l                  # target HEAD only: uncommitted and new files, counted
```

Leave out lockfiles, snapshots, generated files, vendored code and binaries, and name them.

## 2. From files to surfaces

A changed file matters where it renders. Review each changed screen or component, plus its direct
users; for a token, a theme file or a shared primitive, one more level. Five surfaces at most,
closest first; say how many were left out.

```bash
git grep -n -e 'ClipCard' "$target" -- src | head
git grep -n -e '--color-accent' "$target" -- src | head
```

## 3. Read what was removed

Regressions are invisible after the change. Read every removed line in the surfaces of §2; for
the rest of the change, the grep below is enough:

```bash
git diff -U0 "$base" "$target" -- '*.tsx' '*.jsx' '*.vue' '*.svelte' '*.css' | grep -E '^-[^-]' | grep -E 'aria-|role=|alt=|focus|tabindex|prefers-|lang=|dir=|t\(|i18n'
```

A removal with an equivalent replacement is not a finding: `aria-label` to `aria-labelledby`,
`div role="button"` to `<button>`, `ml-2` to `ms-2`, a literal to a translation key.

## 4. Hold the change to its intent

Read the pull request title and body, the linked issue and the commit messages. Then look for
what is missing, not only what is there:

- a new variant or theme applied to some states but not all (hover, focus, disabled, loading);
- a new string without a key in every locale file, or a key the code asks for that no catalog
  has (the `copy` scan reports `not-translated`, `locale-missing`, `placeholder-mismatch`,
  `missing-key`);
- a new component without empty, loading, error or narrow-width states;
- a control added to one screen but not to its siblings.

Scope creep is not a finding here.

## 5. Scans on the change only

`--changed` works from the merge base, so files changed only on the default branch stay out, but
it includes uncommitted files. With uncommitted work in the tree, scan the committed change as
for another target (below).

```bash
node <skill dir>/scripts/scan.mjs ui --changed "$default"
node <skill dir>/scripts/scan.mjs copy <src> <locale folder> --changed "$default"
```

Another target: the scans read files on disk, so copy the changed files of the target to the
scratch folder and scan the copy, without `--changed`. Otherwise say the scans were not run.

```bash
git archive "$target" -- $(git diff --name-only "$base" "$target") | tar -x -C <scratch>/pr-482
node <skill dir>/scripts/scan.mjs ui <scratch>/pr-482
```

Then run the passes of `references/review-ui.md` §4 and §5 on the surfaces of §2, reading
rather than rendering unless the project has a cheap preview or the user asks. Load
`references/ai-look.md` and `references/states.md` only for surfaces whose findings need them.

## 6. Report

```markdown
## Change review: <branch or PR>

Scope: 6 commits + 2 uncommitted files, from 3f2a1c9 · Excluded: pnpm-lock.yaml
Surfaces: ExportDialog, ClipCard (+ 3 users) · 4 users not expanded
Rendered: no

| Status | Severity | Where | Problem | Fix | Rule |
|---|---|---|---|---|---|
| Regression | P1 | `clip-card.tsx:40` | `aria-label` removed from the delete button | Put it back | WCAG 2.2 SC 4.1.2 |
| Introduced | P2 | `fr/export.json` | 3 new keys missing in `de`, `ja` | Add them | `locale-missing` |
```

- Status: **Introduced** (the change created it), **Regression** (it weakened something that
  worked), **Pre-existing** (in touched code, not caused). Check with
  `git blame -L <line>,<line> "$base" -- <file>` when it matters.
- At most three pre-existing findings, listed apart and left out of the verdict.
- Severity from `references/review-ui.md` §6; the verdict is one line. Visual claims are marked
  "not verified" unless something was rendered.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| `gh pr checkout` to look at the branch | `git fetch` into a remote ref |
| One stray uncommitted edit reviewed instead of the branch | Merge base first, both counts stated |
| "Nothing changed, so I reviewed the last commit" | Ask, with the options |
| Thirty findings about old code | The change's findings, three pre-existing at most |
| A removed `aria-label` missed because the new code looks fine | The removed side read |
| A review of the diff lines only | Their surfaces, five at most |
