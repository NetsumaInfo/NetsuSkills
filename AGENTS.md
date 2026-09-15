# AGENTS.md — NetsuSkills

Instructions for any AI agent working in this repository. This file is the single source of
truth; `CLAUDE.md` and any other agent file point here rather than restating rules.

## What this repo is

Hand-written agent skills by **Netsuma**. It ships three ways from one layout:

| Channel | Command |
|---|---|
| `skills` CLI | `npx skills add NetsumaInfo/NetsuSkills` |
| Claude Code plugin | `/plugin marketplace add NetsumaInfo/NetsuSkills` |
| By hand | `cp -r skills/<name> ~/.claude/skills/` |

Do not restructure the repo without checking all three still work.

## Before writing or editing a skill

1. Read `docs/SKILL-RULES.md`. It is the merge contract, not a suggestion.
2. Check `docs/BACKLOG.md` — the skill may already be scoped, or deliberately deferred.
3. Start from `docs/templates/SKILL.md`, or `docs/templates/UMBRELLA-SKILL.md` for a theme with children.

**Do not create a skill unless Netsuma explicitly asks for it.** Scoping, auditing and
documenting are always fine. Writing `skills/<name>/SKILL.md` is not, until he says go.

## Hard rules

### Identity — non-negotiable

- Public files, commits, issues and PRs carry **Netsuma** only. Never a real name, never a
  personal email address. A first name alone still counts as a real name.
- Repo git identity: `Netsuma <125161702+NetsumaInfo@users.noreply.github.com>`.
- Never use `--author`, never add a `Co-Authored-By` trailer or any co-author trailer.

### Language

Everything committed here is **English** — skills, references, scripts, docs, README, commit
messages. Only `.private/` is exempt.

### Skill types

Pick one deliberately; it drives the layout. Defined in `docs/SKILL-RULES.md`.

- **Atomic** — one procedure, one `SKILL.md`. Most skills.
- **Umbrella** — one entry point per theme, children in `references/` loaded on demand. The
  parent stays under 100 lines and routes; it does not teach. Use it so there is one name to
  remember per theme. A skill cannot call another skill, so this is the only shape that makes
  "let the agent pick" actually work.
- **Command-oriented** — a decision table in `SKILL.md`, long operations in `scripts/`,
  external-tool needs declared in `Requirements`.

### Layout

```
skills/<kebab-case-name>/
├── SKILL.md          # required: YAML frontmatter with name + description
├── references/       # optional: depth, loaded on demand
├── scripts/          # optional: executable code
└── assets/           # optional: files to copy
```

Keep `SKILL.md` under ~500 lines. Push depth into `references/`.

### Skill quality

- **One skill, one job.** "and also" in a description means it is two skills.
- **`description` is the entire trigger** — it is the only thing always loaded. Third person,
  the literal words a user would type, and an explicit "do NOT use for …" on any overlap.
- **Never set `disable-model-invocation: true`** unless Netsuma asks. It blocks the agent from
  selecting the skill on its own; 68% of the skills on his machine are dead for this reason.
- **Imperative voice.** No "You are an expert…", no "It's important to note…", no preamble.
- **Ship something concrete**: an exact command, a template, a checklist, or a before/after.
  Advice alone is not a skill.
- **Anti-patterns section required** — `❌ what the model does by default` → `✅ what this
  skill enforces`.
- **No undeclared machine dependency.** Paths, keys and MCP requirements go in a
  `Requirements` section or they do not exist.

### Private content

`.private/` is gitignored. Never commit it, never quote it in a public file, never reference
its contents from a skill. Machine paths, keys and raw notes live there and nowhere else.

## Git

Commit messages in English, imperative, scoped:

```
add(skill): design-review
fix(skill): commit trigger too broad
docs: sharpen anti-slop rules
chore: bump plugin version
```

One skill, or one coherent change, per commit.

## When a skill is added

1. Record its three test results in `docs/JOURNAL.md` — trigger, non-trigger, execution.
2. List it in the `README.md` table.
3. If it replaces a third-party skill, note which one in `docs/BACKLOG.md`.
4. Bump the version in `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`
   together — they must never drift apart.
