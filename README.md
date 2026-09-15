# NetsuSkills

Most skills you find online are blog posts in disguise — long on context, short on procedure,
and they trigger at the wrong time. This repo is the opposite: every skill here is a tight,
opinionated procedure, rewritten from scratch or rebuilt from something generic that almost
worked. Nothing lands without passing a trigger test, a non-trigger test, and a real-world run.

They are also deliberately small and specialised. A skill is loaded whole when it fires, next to
whatever the user actually asked — so a bloated one dilutes its own instructions and the agent
follows the generalities instead of the specifics. Depth lives in `references/`, loaded only
when the case calls for it.

Rules that govern the repo: [`docs/SKILL-RULES.md`](docs/SKILL-RULES.md).

---

## Install

```bash
npx skills add NetsumaInfo/NetsuSkills
```

Works with Claude Code, Cursor, Copilot, Windsurf, Gemini, Cline and anything else that reads
`SKILL.md`. Add `--skill <name>` for a single one, `--list` to see what is in here first.

Also available as a Claude Code plugin, or by copying a folder by hand.

<details>
<summary>Those two</summary>

```
/plugin marketplace add NetsumaInfo/NetsuSkills
/plugin install netsuskills@netsuskills
```

Updates then come through `/plugin`.

```bash
git clone https://github.com/NetsumaInfo/NetsuSkills.git
cp -r NetsuSkills/skills/<skill-name> ~/.claude/skills/
```

Copy into `<project>/.claude/skills/` instead for one project rather than globally.

</details>

---

## Skills

| Skill | What it does | Shape |
|---|---|---|
| [`netsu-readme`](skills/netsu-readme) | Writes the README of a repository or a GitHub profile. Reads the code before asking anything, asks only what the repo cannot answer, agrees the structure with you, then writes. Audits an existing README claim by claim rather than editing around it, strips AI slop, and picks badges and images that carry real information. Nothing goes in the file that is not in the repository. | umbrella, 5 children |

Every skill here is named `netsu-<domain>`, so one of these is identifiable at a glance among the
couple of hundred you already have installed. What gets built next lives in
[`docs/BACKLOG.md`](docs/BACKLOG.md).

---

## Repo layout

```
AGENTS.md             instructions for any AI agent working here (source of truth)
CLAUDE.md             pointer to AGENTS.md
.claude-plugin/       plugin + marketplace manifests
skills/               one folder per skill, SKILL.md required
docs/
  SKILL-RULES.md      authoring rules (merge contract)
  BACKLOG.md          what gets built next, and what it replaces
  JOURNAL.md          per-skill test log
  templates/          starting points: SKILL.md (atomic), UMBRELLA-SKILL.md (parent + children)
CONTRIBUTING.md       the bar a PR has to clear
```

---

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) first. Short version: a skill is a procedure, not an
article, and a PR needs three test results in its body (trigger, non-trigger, execution).
A skill that is only advice gets closed.

## Support

If these skills save you time, you can sponsor the work with the Sponsor button on this repo.
Never expected, and it never buys a merge.

## License

MIT — see [LICENSE](LICENSE).
