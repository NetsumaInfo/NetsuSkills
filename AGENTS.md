# AGENTS.md — NetsuSkills

Instructions for any AI agent working in this repository.

This file owns **identity, workflow and git**. Everything about what a skill contains lives in
[`docs/SKILL-RULES.md`](docs/SKILL-RULES.md) and is **not** restated here — one home per rule
(rule 19). If you need to know how a skill is shaped, sized, triggered or tested, read that file;
nothing here substitutes for it.

## What this repo is

Hand-written agent skills by **Netsuma**. It ships three ways from one layout:

| Channel | Command |
|---|---|
| `skills` CLI | `npx skills add NetsumaInfo/NetsuSkills` |
| Claude Code plugin | `/plugin marketplace add NetsumaInfo/NetsuSkills` |
| By hand | `cp -r skills/<name> ~/.claude/skills/` |

Do not restructure the repo without checking all three still work.

## Before writing or editing a skill

1. Read `docs/SKILL-RULES.md` in full. It is the merge contract, not a suggestion.
2. Check `docs/BACKLOG.md` — the skill may already be scoped, or deliberately deferred.
3. Start from `docs/templates/SKILL.md`, or `docs/templates/UMBRELLA-SKILL.md` for a theme with
   children.

**Do not create a skill unless Netsuma explicitly asks for it.** Scoping, auditing and
documenting are always fine. Writing `skills/<name>/SKILL.md` is not, until he says go.

## Identity — non-negotiable

- Public files, commits, issues and PRs carry **Netsuma** only. Never a real name, never a
  personal email address. A first name alone still counts as a real name.
- Repo git identity: `Netsuma <125161702+NetsumaInfo@users.noreply.github.com>`.
- Never use `--author`, never add a `Co-Authored-By` trailer or any co-author trailer.

## Private content

`.private/` is gitignored. Never commit it, never quote it in a public file, never reference its
contents from a skill. Machine paths, keys and raw notes live there and nowhere else.

## Editing an existing skill

Most work here is adding to a skill that already exists, which is how contradictions get in.
Before you commit a change to a `SKILL.md`:

1. Read the **whole** file, not the section you are changing.
2. Apply rules 17, 18 and 19 of the contract, in that order.

Why those three and not the others: they are the ones a change to an existing file breaks, and
they are the ones you cannot see by reading only your own diff.

## Git

Commit format, scopes and the version bump: `docs/SKILL-RULES.md` rule 16.

## When a skill is added

1. Record its tests in `docs/JOURNAL.md` (rule 11) and its critique pass (rule 18).
2. List it in the `README.md` table.
3. If it replaces a third-party skill, note which one in `docs/BACKLOG.md`.
4. Commit, version files included: rule 16.
