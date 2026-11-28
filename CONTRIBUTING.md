# Contributing

Thanks for looking. This repo has a narrow bar, and it is deliberate.

## What gets merged

A skill is a **procedure an agent executes**, not an article about a topic. Most skills in the
wild are blog posts with frontmatter: long on context, short on steps, and they fire at the
wrong moment. Those get closed here, however well written.

Apply this test to every paragraph you write: *would the agent behave differently without this
sentence?* If not, delete it.

The full contract is [`docs/SKILL-RULES.md`](docs/SKILL-RULES.md). The short version:

- **One skill, one job.** If the description says "and also", it is two skills — or one umbrella with two children.
- **The `description` is the whole trigger.** Third person, the literal words a user would
  type, and an explicit "do NOT use for …" whenever it overlaps another skill.
- **Keep `SKILL.md` small.** Depth goes in `references/`, code in `scripts/`, copyable files in
  `assets/`. The exact limits are rule 2 of the contract — read them there, not here.
- **Imperative voice.** No "You are an expert…", no "It's important to note…".
- **Ship something concrete**: an exact command, a template, a checklist, or a before/after.
  Advice alone is not a skill.
- **Anti-patterns section required** — `❌ what the model does by default` →
  `✅ what this skill enforces`.
- **No undeclared machine dependency.** Paths, keys, and MCP requirements go in a
  `Requirements` section or they do not exist.

## Layout

```
skills/<skill-name>/
├── SKILL.md          # required, YAML frontmatter with name + description
├── references/       # optional, loaded on demand
├── scripts/          # optional
└── assets/           # optional
```

Start from [`docs/templates/SKILL.md`](docs/templates/SKILL.md), or
[`docs/templates/UMBRELLA-SKILL.md`](docs/templates/UMBRELLA-SKILL.md) when a theme needs
several children under one entry point.

Everything in this repo is written in **English**.

## Before you open a PR

Run the critique pass of rule 18, then the tests of rule 11, in that order. Record them in
[`docs/JOURNAL.md`](docs/JOURNAL.md), each marked `PASS` or `NOT PROVEN`, and link that entry
from your PR body:

1. **Trigger** — a natural sentence a user would type routes to the skill.
2. **Non-trigger** — a nearby but off-topic sentence does *not*.
3. **Execution** — followed literally, the skill produces the right result on a real case.

A PR without them is not reviewable. `NOT PROVEN` on any of them blocks the merge.

## Commits

English, imperative, scoped to the skill's own name:

```
feat(design-review): add the skill
fix(commit): trigger too broad
docs: sharpen anti-slop rules
```

One skill per commit, version bump included — there is no separate bump commit. Types, scopes and
version files: rule 16 of the contract. No co-author trailers.

## Ideas and bug reports

Open an issue. Useful issue: the sentence you typed, the skill that fired (or didn't), and
what you expected. "Skill X is bad" is not actionable.

## Support

If these skills save you time, sponsorship is welcome — see the Sponsor button on the repo.
It is never expected and never buys a merge.
