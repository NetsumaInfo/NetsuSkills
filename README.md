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

### [`netsu-readme`](skills/netsu-readme) · umbrella, five children

Writes the README of a repository or a GitHub profile. Reads the code before asking anything, asks
only what the repo cannot answer, agrees the structure with you, then writes. Audits an existing
README claim by claim rather than editing around it, strips AI slop, and picks badges and images
that carry real information. Nothing goes in the file that is not in the repository.

### [`netsu-implement`](skills/netsu-implement) · umbrella, five children

Takes a request from words to verified code. Weighs the job first and says which route it is
taking — a narrow edit gets one sentence of acceptance and a cold re-read of its own diff, a
feature gets a contract, a task graph and an independent review. Records what was already in
your working tree so it never absorbs work that is not its own, and classifies every check it
runs, so a suite that could not start is never reported as a suite that passed. Refuses to write a package name, symbol or config key it
has not opened, and adds as little code as the change allows. It stops at the working tree and
leaves git alone.

### [`netsu-peccable`](skills/netsu-peccable) · umbrella, thirty-four children

Front-end work and the words in it: new screens, components, fonts and colors, motion, and
every string a user reads, from a button label to a store listing or a release note. Writes a
`DESIGN.md` per project first, with the address form, the product's own words and the look, and
points every agent at it. Proposes visual directions instead of falling back on the model's house
style, builds every state a component can reach, and reviews existing screens and text by
severity. Narrower requests each have their own framed procedure, loaded only when asked:
typography, colours, layout, accessibility, details, bolder or calmer, stress tests, variants,
shared components, other devices, performance, onboarding, delight, effects, branch reviews and
explaining how an interface was built. Lexicons and typography for French, English, Spanish, German, Japanese and Chinese,
and a method for any other language. A zero-dependency scanner pulls the strings out of
components, tooltips and locale files and flags stock phrases, vague buttons, a mixed form of
address, and the generic AI look. Across translations it catches broken placeholders, missing
keys and text left in code.

### [`netsu-icon-motion`](skills/netsu-icon-motion) · atomic, two references

Animates an icon in NetsuIcon, an editor of animated icons driven by an agent, after how the thing
it draws really works. Eight lines are written before any edit: the thing, its parts, where the
moving part is held, what drives it, what it is made of, what it means, the hover, the press. Three
tables turn them into movement: a hinge turns and a rail slides; a hand, gravity, a spring, a motor,
wind or light each start and stop their own way; steel moves little, paper swings past, a cloud
squashes. So a padlock's keyhole turns before its shackle springs, and a gear stops clean where a
lid would swing back. A press is an action (it plays and comes back) or a switch (it goes on and
stays). Two manners: subtle, one small idea; expressive, the same idea as a short scene, loaded
only when asked for. Budget: one read, one edit, one look per icon. Needs the `netsuicon` MCP
server; the skill's source lives in the NetsuIcon repository.

### [`netsu-app-icon`](skills/netsu-app-icon) · atomic, one reference

Designs an application icon in NetsuIcon. A six-line brief, then the category seen in a library of
1,432 real logos and its clichés written down and set aside. Eight concepts in one sentence each,
over several kinds of mark, scored; three built as separate icons and put to `proof`: cut by iOS,
macOS and Android, on a dark screen, without colour, blurred, at 16 pixels, and beside the logos it
looks most like. The user chooses before anything is polished; then an optical pass and the files
of every platform. Needs the `netsuicon` MCP server; the skill's source lives in the NetsuIcon
repository.

### [`netsu-type-design`](skills/netsu-type-design) · atomic, two references

Draws a font in NetsuFont. A brief, then a style sheet in numbers (stems, contrast, widths,
x-height, terminals) that every glyph takes its numbers from. Five control glyphs (H O n o v)
built from shape recipes that were drawn and proofed, then a checkpoint, then the font family by
family, spaced in words, kerned only where it still looks wrong. Languages are counted, not
assumed: 23 of them, accents placed by `compose`, Greek and Cyrillic, Hebrew, and plain words on
what cannot be done yet (Arabic, Indic). Ends with an installable .otf. Needs the `netsufont` MCP
server; the skill's source lives in the NetsuFont repository.

### [`netsu-memory-audit`](skills/netsu-memory-audit) · umbrella, three children

Finds the lines in memory and documentation that are confidently wrong. Three levels — agent
memory (`CLAUDE.md`, `AGENTS.md`, `MEMORY.md`, `.claude/rules/`), project documentation, and
comments that describe code that moved — composable in one run. Every finding sits on an evidence
rung, and the rung caps the verdict: a dead path proven by `git ls-files` can be critical, a
reading of the code cannot. Recency never becomes a finding on its own, which is what the usual
doc-drift tools get wrong. A script runs the mechanical rungs before any agent is spawned, so the
reading pass is small, batched and on the cheapest model. Reports first, repairs only after an
explicit go, and confirms deletions separately. First real run, on a repository that had just
lost 44 668 lines: 48 findings, and the file nobody had touched in 91 days came back almost
clean — which is the whole argument for ranking by evidence instead of by date.

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
