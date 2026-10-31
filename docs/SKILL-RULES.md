# Skill rules

What a skill must satisfy to enter this repo. A rule broken is a skill not merged — no
"we'll fix it later".

---

## 0. The principle

> A skill is not documentation. It is a **procedure** an agent executes.

Most skills found online fail because they are blog posts with frontmatter: context,
generalities, "you are an expert in X". The model already knows that. What it does not know is
*your* way of doing the thing, *your* constraints, *your* exact steps.

Apply this to every paragraph you write: *would the agent behave differently without this
sentence?* If not, delete it.

---

## 1. Skill types

Three shapes are allowed. Pick one deliberately — the choice drives the layout.

### Atomic

One procedure, one file. Most skills are this.

```
skills/commit/
└── SKILL.md
```

### Umbrella (parent + children)

One entry point covering a theme, with children loaded on demand. Use it when a theme has
several distinct cases and you do not want to remember a separate name for each.

```
skills/design/
├── SKILL.md              # short index: which case, and when
└── references/
    ├── critique.md       # child: review an existing interface
    ├── tokens.md         # child: build a design system
    └── motion.md         # child: animation and micro-interactions
```

Rules specific to this shape:

- The parent `SKILL.md` stays **under 100 lines**. It routes; it does not teach.
- Every child is named in the parent with one line saying **when** to load it. A child that is
  never referenced does not exist.
- Children come in two kinds, and the parent has to say which. An **entry point** is a case the
  user can arrive at directly — it goes in the routing table. A **resource** is shared detail
  that a procedure pulls in mid-run — it is named outside the table, with the step that loads it,
  and is never loaded on its own. Both still count as children, and both must appear.
- Children are full procedures, same quality bar as an atomic skill.
- The parent's `description` must cover the union of the children's triggers, or the whole
  skill never fires.
- **The parent owns the output contract** — severity scale, ranking, how many findings, report
  format. Children own principles and checks, nothing else. Two children that each define a
  severity scale disagree the moment both load. Keep the contract in the parent's body, not in a
  `references/format.md` the parent has to go read: a format the parent does not hold is a
  format the parent cannot enforce.

Why this shape matters: a skill cannot call another skill, and cannot force one to load. A
"router" skill that dispatches to other installed skills does not work. The umbrella is the
working version of that idea — one name to remember per theme, and the agent picks the child.

### Command-oriented

A skill wrapping a set of concrete commands or operations on a tool. The `SKILL.md` holds the
decision table; `scripts/` holds anything longer than a few lines.

```
skills/resolve-scripting/
├── SKILL.md              # which operation, which script, which guard
├── references/
│   └── api-notes.md
└── scripts/
    └── export-timeline.py
```

Requirements on external tools (an app running, an MCP server connected, a binary on PATH) go
in a `Requirements` section at the top, and the skill checks them before acting.

**Any shape**, not only this one: declare `argument-hint` in the frontmatter whenever the skill
takes an operation, a flag or a target:

```yaml
argument-hint: "[install|remove|update|list] [skill name or link]"
```

It shows the shape of the call at the prompt. It is not a trigger — rule 4 still decides what
goes in the `description`.

## 2. Do not pollute the context

Everything loaded into the model sits alongside the user's actual request and competes with it
for attention. A skill that loads too much does not merely take up room — it makes the agent
worse at the thing it was called for.

Three levels, loaded very differently:

| Level | Loaded |
|---|---|
| `name` + `description` | **always**, for every installed skill |
| `SKILL.md` body | when the skill fires |
| `references/*.md`, `scripts/` | when the skill decides to read them |

Two consequences drive every rule below.

**Twenty descriptions are always in front of the model.** Nineteen of them are irrelevant to
what is being asked right now, and each one is a candidate the agent has to rule out. Past a
certain number, near-duplicate descriptions stop being noise and start causing wrong picks —
the agent fires the vaguely-related skill instead of the right one. One umbrella covering a
theme presents one clear choice instead of twenty blurry ones.

**A fat `SKILL.md` drowns its own instructions.** There is no partial read: when the skill
fires, all of it lands. The five lines that actually change behaviour are diluted among three
hundred that restate what the model already knew, and the agent follows the generalities
instead of the specifics. A skill gets *less* reliable as it gets longer.

Specialised and small is the point. The agent should see the procedure for the case at hand,
and nothing else.

### Limits

| Piece | Aim for | Never exceed |
|---|---|---|
| `description` | 300–500 characters | 1024 |
| Atomic `SKILL.md` | 200 lines | 500 |
| Umbrella parent | 60 lines | 100 |
| Child in `references/` | 200 lines | 300 |

Hitting the limit is a signal to split or cut, not a licence to fill it.

### What counts as pollution

- Restating what the model already knows — language syntax, what REST is, why tests matter.
- Background, motivation, history. The agent needs the procedure, not the reasoning behind it.
- Exhaustive option tables where one recommended default and one fallback would do.
- A child loaded "just in case" rather than because the case requires it.
- One more skill for something an existing skill already covers.

The test from rule 0 applies to every paragraph: *would the agent behave differently without
it?* If not, it is not harmless — it is crowding out what matters.

## 3. One skill, one job

- A single goal, a single moment of triggering.
- If the description says "and also", it is two skills — or one umbrella with two children.
- The name states the action or the domain, not the quality: `netsu-review-react-perf`, not
  `amazing-react-helper`. No quality prefix (`super-`, `ultra-`, `pro-`).

### Naming

Every skill in this repo is named `netsu-<domain>`, in `kebab-case`, 64 characters max.

```
netsu-readme          ✅
NetsuReadme           ❌  no skill in the wild uses uppercase; risks validation
netsu_readme          ❌  underscores likewise
readme                ❌  collides with the three README generators already installed
```

Write it as **NetsuReadme** in the `# H1`, in prose and in the README. Lowercase everywhere a
machine reads it: the directory name, the `name:` field, and any cross-reference between skills.
The two must always point at the same skill.

The prefix is a namespace, not decoration. It exists because name collisions are real — one
reference machine carries three skills called `commit` and three README generators — and because
a skill you wrote should be identifiable at a glance among two hundred you did not. It costs
nothing at trigger time: the `description` decides whether a skill fires, never the name.

## 4. The `description` is the only thing always loaded

It alone decides whether the skill fires. So:

- **Third person**: "Use when the user…", never "I will help you…".
- Contains the **literal words** a user would actually type. Not a clever synonym when the user
  says "commit" rather than "version control operation".
- States explicitly **when NOT to use it**, whenever it overlaps another skill.
- 1024 characters max. Dense, no atmosphere.
- It must pass this test: read alone, out of context, can you decide yes/no?
- **A flag or keyword belongs here only if it can carry a request on its own.** If the skill takes
  flags, most of them modify a request that already fires on its own words — listing those buys a
  token match and nothing else, and it can contradict the exclusion clause four lines above it.
  `netsu-implement` listed `--review` as a trigger while excluding review work, so
  `--review this branch before I merge` matched it. Put a flag in the `description` only when
  removing it would leave the sentence matching nothing.

Test the description against the descriptions it competes with, not on its own. Show a fresh
context **only** the descriptions — no bodies — and have it route real sentences. Both defects
found this way so far were invisible to reading.

## 5. Never disable model invocation

Do not set `disable-model-invocation: true` unless explicitly asked. It forbids the agent from
selecting the skill on its own — the skill only runs when invoked by hand, which defeats the
point of writing it.

This is not theoretical: of 257 reachable `SKILL.md` files measured on one machine, 175 (68%)
carried this flag. Their owner assumed the skills were bad. They were switched off.

## 6. Progressive disclosure

Limits are in rule 2. The layout that makes them reachable:

- Heavy detail → `references/*.md`, loaded only when the case needs it.
- Reusable code → `scripts/`, never pasted into markdown.
- Files to copy → `assets/`.

```
skills/<skill-name>/
├── SKILL.md          # required
├── references/       # optional — detail loaded on demand
├── scripts/          # optional — executable code
└── assets/           # optional — templates, files to copy
```

Splitting is not filing away the excess: a child nobody loads is the same pollution, moved.
If a section is not needed for any real case, delete it instead.

## 7. Imperative voice, zero filler

- Banned: "You are an expert…", "Certainly!", "It's important to note that…",
  "Best practices include…".
- Allowed: orders. "Run X. If Y, do Z. Never do W."
- No tables of generalities. Actionable checklists or exact commands.

## 8. Concrete beats abstract

Every skill ships at least one of:

- an exact command to run,
- a file template ready to copy,
- a verification checklist,
- a before/after example.

A skill that is only advice is rejected.

**Date any claim about model behaviour.** A rule tuned to how models failed in 2024 is tuned to a
machine that no longer exists: package-hallucination rates fell from roughly 20% to between 4.6%
and 6.1% in about a year, and a threshold calibrated on the old figure fires on nothing. Write the
measurement date and the cohort next to the number, so the next reader can tell a live threshold
from a fossil. The underlying mechanism usually outlives the rate — say which is which.

## 9. Anti-patterns section required

Stating what to do is not enough — models drift back to their default. Every skill lists the
traps explicitly, as `❌ what happens by default` → `✅ what we want`.

## 10. Portable by default

- No dependency on a machine path, a key, or an MCP server, **unless** declared in a
  `Requirements` section at the top of the skill.
- A skill driving an external tool (Blender, After Effects, DaVinci Resolve, Photoshop) checks
  availability before acting and fails loudly.

## 11. Tested before merge

Before committing a skill, verify all three:

1. **Trigger** — a natural sentence a user would type fires it.
2. **Non-trigger** — a nearby but off-topic sentence does *not* fire it.
3. **Execution** — followed literally, it produces the right result on a real case.

Results go in [`JOURNAL.md`](JOURNAL.md).

### Proof layers

"It works" is a claim with a layer attached. Keep the layers distinct, and never let a cheap one
stand in for an expensive one:

| Layer | What it proves |
|---|---|
| Static / local | typecheck, lint, build, unit tests pass |
| Read-back | the external system actually holds the state — query the API, DB or provider back |
| Deployed artifact | the thing exists where users reach it: public URL, installed location |
| Live authenticated | a real signed-in path works end to end |

Static checks **support** runtime proof; they never replace it. A green build is not a working
feature, and reading the code is not reading the system.

For a skill in this repo the four layers are: frontmatter parses → the agent lists the skill →
the trigger sentence fires it → it produces the right result. That is rule 11's three tests with
the install step in front of them.

Mark each criterion `PASS` or `NOT PROVEN`. If anything is `NOT PROVEN`, the verdict is
`BLOCKED: NOT PROVEN` plus the exact blocker — never a summary verdict that averages the two,
and never `PASS` on a criterion checked at a lower layer than it needs.

## 12. Output discipline

A skill that produces findings, a report or a review states its own limits, or the agent fills
whatever space it was given.

- **Cap the output, and name the number in the skill.** 15 findings is a workable default for a
  review. No cap means the agent keeps going until it runs out of ideas, and the last third is
  invented to look thorough.
- **Never pad to reach the cap.** Three real findings is a three-finding report. Say so.
- **Rank, then cut.** Highest severity first, cut from the bottom. Never the first 15 it
  happened to notice.
- **One severity scale, defined in the skill**, with the literal conditions that make something
  HIGH. An undefined scale gets reinvented every run, and two runs stop being comparable.

## 13. Evidence, or `Not verified`

Every claim a skill makes about the user's code or system carries its source, or it is marked
unproven. Models do not draw that line on their own.

- **Cite the location**: `path/to/file:line`. A finding without one cannot be checked — and that
  is exactly the shape a hallucinated finding takes.
- **Never report what the skill did not observe.** If the check needs a running app, a
  screenshot or a provider call the skill never made, output `Not verified` and name what is
  missing. Do not infer it from the code and present it as seen.
- **Keep observed and inferred on separate lines.** Blended into one paragraph, the reader
  cannot tell which is which, so both get trusted.

## 14. One mutation path for destructive work

A skill that deletes, moves, overwrites or installs does it through `scripts/`, never by telling
the agent which ad-hoc command to type.

- One script owns the operation. `SKILL.md` says which script and which guard, not which `rm`.
  An ad-hoc command differs every run; a script is identical every run and can be read before it
  is trusted.
- **Make it reversible.** "Remove" means move to a recoverable location
  (`~/.cache/<thing>-removed/`), not delete. "Overwrite" means back up first.
- The script checks its `Requirements` (rule 10) and fails loudly before touching anything.
- Confirm with the user before the first destructive run, stating exactly what will change.

## 15. Language

Everything committed to this repo is written in **English** — skills, references, scripts,
docs, README, commit messages. Only `.private/` is exempt.

## 16. Git

- Commit messages in English, imperative, scoped:
  `add(skill): design-critique`, `fix(skill): commit trigger too broad`, `docs: rules v2`.
- **Never** a `Co-Authored-By` trailer or any co-author trailer.
- One commit per skill, or per coherent change. No catch-all commits.
- `.private/` is never committed. Check before every push.
- Bump `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json` together — they must
  never drift apart.

---

## Merge checklist

- [ ] Type chosen deliberately: atomic, umbrella, or command-oriented
- [ ] One job, clear `kebab-case` name
- [ ] Description in third person, real trigger words, "do NOT use for" present
- [ ] Description close to 300–500 characters, never past 1024
- [ ] `disable-model-invocation` not set
- [ ] `SKILL.md` within the rule 2 limits, detail in `references/`
- [ ] Nothing restating what the model already knows; every paragraph changes behaviour
- [ ] Umbrella only: every child referenced from the parent with a "when to load it" line
- [ ] Umbrella only: output contract (severity, ranking, cap, format) held in the parent
- [ ] Takes an operation, a flag or a target: `argument-hint` set
- [ ] Imperative voice, zero filler
- [ ] At least one concrete artifact (command / template / checklist / before-after)
- [ ] Anti-patterns section present
- [ ] Reporting skills: output capped, ranked, one defined severity scale
- [ ] Claims cite `path:line`; anything unobserved marked `Not verified`
- [ ] Destructive work goes through `scripts/`, reversible, confirmed before the first run
- [ ] No undeclared machine dependency
- [ ] Three tests passed and recorded in `JOURNAL.md`, no static check standing in for runtime proof
- [ ] English throughout, commit without `Co-Authored-By`
