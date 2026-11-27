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
skills/netsu-commit/
└── SKILL.md
```

### Umbrella (parent + children)

One entry point covering a theme, with children loaded on demand. Use it when a theme has
several distinct cases and you do not want to remember a separate name for each.

```
skills/netsu-design/
├── SKILL.md              # short index: which case, and when
└── references/
    ├── critique.md       # child: review an existing interface
    ├── tokens.md         # child: build a design system
    └── motion.md         # child: animation and micro-interactions
```

Rules specific to this shape:

- The parent `SKILL.md` stays at **100 lines or fewer**. It routes; it does not teach.
- Every child is named in the parent with one line saying **when** to load it. A child that is
  never referenced does not exist.
- Children come in two kinds, and the parent has to say which. An **entry point** is a case the
  user can arrive at directly — it goes in the routing table. A **resource** is shared detail
  that a procedure pulls in mid-run — it is named outside the table, with the step that loads it,
  and is never loaded on its own. Both still count as children, and both must appear.
- **Entry-point** children are full procedures — steps, anti-patterns, one concrete artifact —
  at the same quality bar as an atomic skill. **Resource** children hold detail only: no steps,
  no anti-patterns section. Both inherit the parent's output contract and define no severity
  scale, cap or report format of their own.
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
decision table; `scripts/` holds anything longer than 10 lines (rule 6).

```
skills/netsu-resolve-scripting/
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

Past "Never exceed": FAIL, the skill does not merge. Past "Aim for": allowed, and the
`JOURNAL.md` entry says why. Hitting either is a signal to split or cut, not a licence to fill.

### What counts as pollution

- Restating what the model already knows — language syntax, what REST is, why tests matter.
- Background, motivation, history. The agent needs the procedure, not the reasoning behind it.
- Exhaustive option tables where one recommended default and one fallback would do.
- A child loaded "just in case" rather than because the case requires it.
- One more skill for something an existing skill already covers.

Rule 0's test decides each of these. What it costs when the answer is no: not a harmless extra
line, but attention taken from the lines that do change behaviour.

## 3. One skill, one job

- A single goal. If the description needs two unrelated "Use when" clauses, it is two skills.
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
- **Names every sibling skill whose triggers overlap it**, under "Do NOT use for". Checked
  against the installed set, not from memory. When nothing overlaps, the `JOURNAL.md` entry says
  which skills it was checked against.
- Length: rule 2's table.
- It must pass this test: read alone, out of context, can you decide yes/no?
- **A flag or keyword belongs here only if it can carry a request on its own.** If the skill takes
  flags, most of them modify a request that already fires on its own words — listing those buys a
  token match and nothing else, and it can contradict the exclusion clause four lines above it.
  `netsu-implement` listed `--review` as a trigger while excluding review work, so
  `--review this branch before I merge` matched it. Put a flag in the `description` only when
  removing it would leave the sentence matching nothing.

Test the description against the descriptions it competes with, not on its own. Show a fresh
context **only** the descriptions — no bodies — and have it route real sentences. Every routing
defect found in this repo so far was invisible to reading and showed up only this way.

## 5. Never disable model invocation

Do not set `disable-model-invocation: true` unless explicitly asked. It forbids the agent from
selecting the skill on its own — the skill only runs when invoked by hand, which defeats the
point of writing it.

This is not theoretical: of 257 reachable `SKILL.md` files, measured on one machine on
2025-10-18, 175 (68%) carried this flag. Their owner assumed the skills were bad. They were
switched off.

## 6. Progressive disclosure

Limits are in rule 2. The layout that makes them reachable:

- Heavy detail → `references/*.md`, loaded only when the case needs it.
- Code → `scripts/` past **10 lines**; below that it may stay inline, except anything
  destructive, which always goes through `scripts/` whatever its length (rule 14).
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
- Every table either routes to a file or lists exact values. A table of advice is prose in a grid: cut it.

## 8. Concrete beats abstract

Every skill ships at least one of:

- an exact command to run,
- a file template ready to copy,
- a verification checklist,
- a before/after example.

A skill that is only advice is rejected.

**Date any claim about model behaviour.** A rule tuned to an earlier generation is tuned to a
machine that no longer exists, and a threshold calibrated on an old figure fires on nothing.
Write the measurement date and the cohort next to every number you cite, so the next reader can
tell a live threshold from a fossil. The underlying mechanism usually outlives the rate — say
which is which, and if you cannot date a number, drop it.

## 9. Anti-patterns section required

Stating what to do is not enough — models drift back to their default. Every skill lists the
traps explicitly, as `❌ what happens by default` → `✅ what we want`.

## 10. Portable by default

- No dependency on a machine path, a key, or an MCP server, **unless** declared in a
  `Requirements` section at the top of the skill.
- A skill driving an external tool (Blender, After Effects, DaVinci Resolve, Photoshop) checks
  availability before acting and fails loudly.

## 11. Tested before merge

Run these **after** the critique pass of rule 18 and **before** the commit of rule 16, on the
final text of the skill. Any edit made after they pass — including one that closes a critique
issue — restarts them. Verify all three:

1. **Trigger** — a natural sentence a user would type routes to this skill from the installed
   descriptions alone (the method in rule 4).
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

Mapped onto a skill in this repo: **Static** = the frontmatter parses (`claude plugin validate`).
**Read-back** = the agent lists the skill. **Deployed artifact** = a sentence routes correctly
from the installed descriptions alone. **Live** = the skill runs on a real case and the result is
right. Tests 1 and 2 above need Deployed; test 3 needs Live.

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

- Commit messages in English, imperative, with the scope as the skill's own name:
  `feat(netsu-type-design): contextual forms`, `fix(netsu-readme): trigger too broad`,
  `docs: rules v3`. Types: `feat`, `fix`, `docs`, `refactor`. A change to the repo itself takes
  no scope.
- One commit per skill touched. A commit that touches two skills needs a reason in its body.
- `.private/` rules, including never committing it: `AGENTS.md`.
- Every commit that adds, removes or changes a skill sets the same new version in
  `.claude-plugin/plugin.json` and `.claude-plugin/marketplace.json`, **in that same commit** —
  they must never drift apart, and there is no separate bump commit.
- That commit holds the skill, its `JOURNAL.md` entry (rules 11 and 18) and the two version
  files. Nothing else.

## 17. Never two rules in conflict in one file

Writing a skill is mostly adding to one. Each addition can contradict something already there,
and the contradiction does not announce itself: both lines look fine on their own.

**You cannot fix a conflict by ordering it.** Measured on 1 887 356 graded responses across 14
models (arXiv:2610.33201, 2026-10-23): of two contradictory lines in the same message, the
**first** wins 72.4–94.7 % of the time; a second line in a system message wins only 10.8–36.2 %,
under half in all 26 model × thinking modes tested; and no model honoured a declared order of
precedence in 95 % of responses.

Three consequences, and they are not style preferences:

- **The rule you add last is the rule that loses.** Appending a correction under an older rule
  does not correct it. Edit the older line instead.
- **"Unless stated otherwise below" does nothing.** Neither does "this overrides the above",
  except where one file overrides another file that was loaded separately — which works because
  the loading order is yours to control, not the model's to weigh.
- **One order of precedence per skill, stated once, in the first place it matters.** Every later
  mention points back to it rather than restating it in its own words.

Where a conflict is real and both sides are needed, the condition goes in the *first* line:
`No file loads unless its case is asked — except setup.md, which runs first when no design file
exists`, not a bare `No file loads unless asked` with the exception 60 lines down.

Attention is finite in the same way. At 500 simultaneous instructions, the best frontier models
hold 68 % accuracy (IFScale, arXiv:2507.11538, 2025-07-15); degradation starts at 50K tokens of
context even on a 1M window, and a single distractor measurably hurts — worst when it is close
in topic to the real instruction (Chroma, 18 models, 194 480 calls, 2025-07-14). Two near-
identical rules in one skill are exactly that distractor.

One repetition is allowed, and only this one: the skill's hardest prohibition — the single rule
whose breach wrecks the run — may appear both near the top and near the end, in the **same
words**. The sources disagree on whether first or last position wins (OpenAI's guide says closest
to the end, IFScale finds a bias to the earliest), so covering both ends is the only portable
answer. Same words, or it is two rules again. This is the one exception to rule 19.

## 18. Critique pass, before the tests

Rule 17 describes defects that are invisible when you read your own file. Run the critique
explicitly, on the skill as a whole, before the three tests of rule 11 — fixing an issue it finds
changes the text the tests would have run on. Paste the issues it found plus what you did about
them into `JOURNAL.md`. A pass that found nothing is recorded as such.

Use this prompt (xAI prompting guide, read 2026-11-27), unchanged — the two `Do NOT` clauses are
what keep it from inventing problems to look thorough:

```
## Role & Objective
You are a Prompt-Critique Expert.
Examine the supplied system prompt and surface weaknesses.
## Instructions
Identify:
- Ambiguity
- Missing definitions
- Conflicting, incomplete, or vague instructions
- Unstated assumptions
Do NOT invent new tools or external information.
Do NOT list issues you are unsure about.
## Output Format
# Issues
- Numbered list with brief quote snippets
# Improvements
- Numbered list of concrete revised lines
# Revised Prompt
- Surgically edited version of the original prompt
```

Run it in a context that has not seen the skill being written, or it will defend the choices it
just made.

## 19. One home per rule

A rule written in two places is two rules that will disagree. They always drift; the copies are
never updated together.

- `docs/SKILL-RULES.md` owns everything about what a skill contains.
- `AGENTS.md` owns identity, workflow and git. It **points** at this file and restates nothing
  from it.
- A skill owns its own procedure. It never restates a rule from this file.

This is not only tidiness. Repository context files generated on top of existing documentation
measured −0.5 % on SWE-bench and −2 % on CTXbench, for about +20 % cost; with the repository's own
docs removed, the same files gained +2.7 % — they were paying for content already present
elsewhere (ETH Zurich, arXiv:2602.11988, 2026-02-12).

When two files must mention the same thing, one states it and the other links to it by name.

**One documented exception.** `CLAUDE.md` repeats the identity rule, because that breach cannot
be undone: a real name in a public commit stays in the history and on GitHub, while any other
rule here is fixable in the next commit. `CONTRIBUTING.md` and `README.md` are written for people
who will not read this file; they may summarise it, but they state no number and no threshold —
those drift. They link here instead. Any further exception is argued in `JOURNAL.md` or it is a
bug.

## 20. Every rule is PASS/FAIL

The opening of this file says a broken rule means a skill does not merge, and rule 11's
`NOT PROVEN` counts as a FAIL for merge. That is empty for any rule two readers
can settle differently, and those rules get skipped in practice.

- A rule names a number, a file, a literal string or an observable artifact.
- `aim for`, `keep it short`, `avoid generalities`, `be specific` are not rules. Either give the
  threshold, or move the sentence out of the rule list and into the prose that explains why.
- Each box in the merge checklist maps to exactly one rule and is settled by reading the files.

A measured rule also carries its date and what it was measured on (rule 8), so the next reader
can tell a live threshold from a fossil.

---

## Merge checklist

Every box is a yes/no a reader can settle from the files. No box is a judgement call, and each
box names the rule it comes from.

- [ ] Type chosen deliberately: atomic, umbrella, or command-oriented (rule 1)
- [ ] One goal; name is `netsu-<domain>` in `kebab-case`, within rule 3's length limit
- [ ] Description in third person, real trigger words, and "Do NOT use for" naming every
      overlapping sibling — or `JOURNAL.md` says which siblings it was checked against (rule 4)
- [ ] No flag or keyword in the description that cannot carry a request on its own (rule 4)
- [ ] Description within rule 2's "Never exceed"; past "Aim for" justified in `JOURNAL.md`
- [ ] `disable-model-invocation` not set (rule 5)
- [ ] `SKILL.md` within rule 2's "Never exceed"; past "Aim for" justified in `JOURNAL.md`
- [ ] Each child in `references/` within rule 2's "Never exceed" (rule 2)
- [ ] No heading titled Background, Motivation, History or Why (rule 2)
- [ ] No two instructions in one file contradict each other (rule 17)
- [ ] One order of precedence, stated once; at most the one repetition rule 17 allows
- [ ] Nothing in the skill restates a rule from this file (rule 19)
- [ ] Critique pass run before the tests, its issues closed, pasted in `JOURNAL.md` (rule 18)
- [ ] Umbrella only: every child referenced from the parent with a "when to load it" line, and
      marked entry point or resource (rule 1)
- [ ] Umbrella only: output contract — severity, ranking, cap, format — held in the parent (rule 1)
- [ ] Takes an operation, a flag or a target: `argument-hint` set (rule 1)
- [ ] Imperative voice: none of the phrases banned in rule 7 appears
- [ ] Every table either routes to a file or lists exact values (rule 7)
- [ ] At least one concrete artifact: command, template, checklist or before/after (rule 8)
- [ ] Every claim about model behaviour carries its measurement date and cohort (rule 8)
- [ ] Anti-patterns section present — in the parent and in each entry-point child (rule 9)
- [ ] No undeclared machine dependency; external tools in `Requirements` (rule 10)
- [ ] Code past rule 6's threshold lives in `scripts/`
- [ ] Reporting skills only: output capped with the number named, ranked, one defined severity
      scale (rule 12)
- [ ] Reporting skills only: every claim cites `path:line` or is marked `Not verified` (rule 13)
- [ ] Destructive work goes through `scripts/`, reversible, confirmed before the first run (rule 14)
- [ ] English throughout (rule 15)
- [ ] Three tests passed and recorded in `JOURNAL.md`, each `PASS` or `NOT PROVEN`; any
      `NOT PROVEN` blocks the merge, and no static check stands in for runtime proof (rule 11)
- [ ] Commit message and scope follow rule 16, one skill per commit, version set to the same
      value in `plugin.json` and `marketplace.json` in that commit
