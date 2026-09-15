# Contributing

Thanks for looking. This repo has a narrow bar, and it is deliberate.

## What gets merged

A skill is a **procedure an agent executes**, not an article about a topic. Most skills in the
wild are blog posts with frontmatter: long on context, short on steps, and they fire at the
wrong moment. Those get closed here, however well written.

Apply this test to every paragraph you write: *would the agent behave differently without this
sentence?* If not, delete it.

The full contract is [`docs/REGLES-SKILLS.md`](docs/REGLES-SKILLS.md) (French). The short
version:

- **One skill, one job.** If the description says "and also", it is two skills.
- **The `description` is the whole trigger.** Third person, the literal words a user would
  type, and an explicit "do NOT use for …" whenever it overlaps another skill.
- **`SKILL.md` under ~500 lines.** Depth goes in `references/`, code in `scripts/`,
  copyable files in `assets/`.
- **Imperative voice.** No "You are an expert…", no "It's important to note…".
- **Ship something concrete**: an exact command, a template, a checklist, or a before/after.
  Advice alone is not a skill.
- **Anti-patterns section required** — `❌ what the model does by default` →
  `✅ what this skill enforces`.
- **No undeclared machine dependency.** Paths, keys, and MCP requirements go in a
  `Requirements` section or they do not exist.

## Layout

```
skills/<kebab-case-name>/
├── SKILL.md          # required, YAML frontmatter with name + description
├── references/       # optional, loaded on demand
├── scripts/          # optional
└── assets/           # optional
```

Start from [`docs/templates/SKILL.md`](docs/templates/SKILL.md).

Skill content is written in **English**. Working docs under `docs/` are in French.

## Before you open a PR

Run all three and put the results in your PR body:

1. **Trigger** — a natural sentence a user would type fires the skill.
2. **Non-trigger** — a nearby but off-topic sentence does *not* fire it.
3. **Execution** — followed literally, the skill produces the right result on a real case.

A PR without these three is not reviewable.

## Commits

English, imperative, scoped:

```
add(skill): design-review
fix(skill): commit trigger too broad
docs: sharpen anti-slop rules
chore: bump plugin version
```

One skill (or one coherent change) per commit. No co-author trailers.

## Ideas and bug reports

Open an issue. Useful issue: the sentence you typed, the skill that fired (or didn't), and
what you expected. "Skill X is bad" is not actionable.

## Support

If these skills save you time, sponsorship is welcome — see the Sponsor button on the repo.
It is never expected and never buys a merge.
