# NetsuSkills

Most skills you find online are blog posts in disguise — long on context, short on procedure,
and they trigger at the wrong time. This repo is the opposite: every skill here is a tight,
opinionated procedure, rewritten from scratch or rebuilt from something generic that almost
worked. Nothing lands without passing a trigger test, a non-trigger test, and a real-world run.

Rules that govern the repo: [`docs/SKILL-RULES.md`](docs/SKILL-RULES.md).

---

## Install

### With the `skills` CLI

```bash
npx skills add NetsumaInfo/NetsuSkills
```

Works with Claude Code, Cursor, Copilot, Windsurf, Gemini, Cline and other agents that read
`SKILL.md`. Add `--skill <name>` to install a single one.

### As a Claude Code plugin

```
/plugin marketplace add NetsumaInfo/NetsuSkills
/plugin install netsuskills@netsuskills
```

Updates come through `/plugin` — no manual copying.

### By hand

```bash
git clone https://github.com/NetsumaInfo/NetsuSkills.git
cp -r NetsuSkills/skills/<skill-name> ~/.claude/skills/
```

Per-project instead of global: copy into `<project>/.claude/skills/`.

---

## Skills

No skills published yet — the repo is being bootstrapped. The backlog lives in
[`docs/BACKLOG.md`](docs/BACKLOG.md).

| Skill | What it does | Status |
|---|---|---|
| — | — | — |

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
  templates/SKILL.md  starting point for a new skill
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
