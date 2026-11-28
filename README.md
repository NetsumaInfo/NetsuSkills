# NetsuSkills

Agent skills for Claude Code and anything else that reads `SKILL.md`, plus the rules they are
written to. Each skill is a procedure an agent executes, not an article about a topic.

Two things live here, and the second one is the point:

- **The skills.** Rewritten from scratch, or rebuilt from a generic version that almost worked.
  Nothing lands without a trigger test, a non-trigger test and a run on a real case, recorded in
  [`docs/JOURNAL.md`](docs/JOURNAL.md).
- **The contract they are held to** — [`docs/SKILL-RULES.md`](docs/SKILL-RULES.md). Twenty rules
  on how to write a skill that keeps working: what belongs in a `description` and what does not,
  how long a file may get before it starts drowning its own instructions, what to do when a rule
  you add today contradicts one from three months ago. Each rule carries the measurement it comes
  from, with a date. The sources are in [`docs/RESEARCH.md`](docs/RESEARCH.md).

The contract is useful on its own. Most published advice on writing skills covers the first
draft; almost none of it covers the fourth, which is where skills actually fail — rules piled on
rules until two of them disagree and the agent quietly follows the wrong one.

The skills are also small on purpose. A `SKILL.md` is loaded whole when it fires, next to
whatever the user actually asked, so a long one dilutes its own instructions: a skill gets *less*
reliable as it gets longer. Depth goes in `references/`, loaded only when the case calls for it.

## Install

```bash
npx skills add NetsumaInfo/NetsuSkills
```

Add `--skill <name>` for a single one, or `--list` to see what is in here first.

<details>
<summary>As a Claude Code plugin, or by hand</summary>

```
/plugin marketplace add NetsumaInfo/NetsuSkills
/plugin install netsuskills@netsuskills
```

Updates then come through `/plugin`.

```bash
git clone https://github.com/NetsumaInfo/NetsuSkills.git
cp -r NetsuSkills/skills/<skill-name> ~/.claude/skills/
```

Copy into `<project>/.claude/skills/` instead to install for one project rather than globally.

</details>

## What is in here

Open a skill's folder for what it does and when it fires. That lives in its own `description`,
which is the only part an agent always has loaded. It is deliberately not copied here, because
two copies of the same sentence means one of them goes stale.

| Skill | Shape | Area |
|---|---|---|
| [`netsu-readme`](skills/netsu-readme) | umbrella, 5 children | repository and profile READMEs |
| [`netsu-implement`](skills/netsu-implement) | umbrella, 5 children | a request to verified code |
| [`netsu-peccable`](skills/netsu-peccable) | umbrella, 39 children | front-end work and product text |
| [`netsu-memory-audit`](skills/netsu-memory-audit) | umbrella, 4 children, 1 script | stale lines in memory and docs |
| [`netsu-app-icon`](skills/netsu-app-icon) | atomic, 1 reference | application icons |
| [`netsu-taskbar-preview`](skills/netsu-taskbar-preview) | command-oriented, 1 script | an icon in the real Windows taskbar |
| [`netsu-icon-motion`](skills/netsu-icon-motion) | atomic, 3 references | animating interface icons |
| [`netsu-type-design`](skills/netsu-type-design) | atomic, 3 references | drawing a font |

What gets built next, and what it replaces: [`docs/BACKLOG.md`](docs/BACKLOG.md).

> [!NOTE]
> Three of these drive editors that are not in this repository. `netsu-app-icon` and
> `netsu-icon-motion` need the `netsuicon` MCP server, `netsu-type-design` needs `netsufont`.
> Without those servers connected, the three do nothing. `netsu-taskbar-preview` is Windows-only
> and needs Windows PowerShell 5. The remaining four have no dependency beyond Node 18 for the
> two that ship a scanner.

## Writing your own

The rules are in **[`docs/SKILL-RULES.md`](docs/SKILL-RULES.md)**, the merge contract for this
repo and the part worth reading even if you never open a PR here. Start from
[`docs/templates/SKILL.md`](docs/templates/SKILL.md), or
[`docs/templates/UMBRELLA-SKILL.md`](docs/templates/UMBRELLA-SKILL.md) for a theme with children.
Each template carries its own authoring notes.

Two of those rules exist because of how skills fail over time, and they are the ones most
authoring guides leave out:

- **Never two rules in conflict in one file.** You cannot fix a contradiction by putting the
  correction further down. Of two contradictory lines in one file the first wins 72 to 95 % of
  the time, a second line in a system message wins under half the time in every mode tested, and
  no model honoured a declared order of precedence in 95 % of responses
  ([arXiv:2610.33201](https://arxiv.org/abs/2610.33201), October 2026, 1.9M graded responses). So
  the line to edit is the earlier one. This is what a skill grown by accretion gets wrong.
- **Run a critique pass before the tests.** A conflict is invisible when you read your own file.
  The contract gives the prompt to use, and says where the result goes.

Why the rules cite anything at all: [`docs/RESEARCH.md`](docs/RESEARCH.md) holds every source
behind them, with its date, its sample size and what it actually measured — including the sources
that disagree with each other, the ones that changed nothing, and what was searched for and not
found. A rule tuned to a model generation that no longer exists fires on nothing, so a threshold
without a date is not worth keeping.

Agents working in this repo read [`AGENTS.md`](AGENTS.md), which owns identity, workflow and git,
and points at the contract for everything about skill content.

## Repo layout

```
AGENTS.md             instructions for any agent working here
CLAUDE.md             pointer to AGENTS.md
CONTRIBUTING.md       the bar a PR has to clear
.claude-plugin/       plugin and marketplace manifests
skills/               one folder per skill, SKILL.md required
docs/
  SKILL-RULES.md      the authoring rules, in full
  RESEARCH.md         every source behind them, dated
  BACKLOG.md          what gets built next
  JOURNAL.md          per-skill test log and evidence
  templates/          starting points, atomic and umbrella
```

## Maturity

Version 0.9.6, first commit September 2026, no CI. The contract and the skills both still change
shape between versions; pin a copy if that matters to you. Naming here is prefixed `netsu-` as a
local convention — nothing in the rules asks that of a skill you write.

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) first. A skill is a procedure, not an article, and a PR
needs its critique pass and its three test results recorded in `docs/JOURNAL.md` and linked from
the PR body. A skill that is only advice gets closed.

## Support

If these save you time, the Sponsor button on this repo works. Never expected, and it never buys
a merge.

## License

MIT — see [LICENSE](LICENSE).
