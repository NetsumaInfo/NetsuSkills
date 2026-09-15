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
- Children are full procedures, same quality bar as an atomic skill.
- The parent's `description` must cover the union of the children's triggers, or the whole
  skill never fires.

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

## 2. One skill, one job

- A single goal, a single moment of triggering.
- If the description says "and also", it is two skills — or one umbrella with two children.
- `kebab-case` name, 64 characters max, no marketing prefix (`super-`, `ultra-`).
- The name states the action or the domain, not the quality: `review-react-perf`, not
  `amazing-react-helper`.

## 3. The `description` is the only thing always loaded

It alone decides whether the skill fires. So:

- **Third person**: "Use when the user…", never "I will help you…".
- Contains the **literal words** a user would actually type. Not a clever synonym when the user
  says "commit" rather than "version control operation".
- States explicitly **when NOT to use it**, whenever it overlaps another skill.
- 1024 characters max. Dense, no atmosphere.
- It must pass this test: read alone, out of context, can you decide yes/no?

## 4. Never disable model invocation

Do not set `disable-model-invocation: true` unless explicitly asked. It forbids the agent from
selecting the skill on its own — the skill only runs when invoked by hand, which defeats the
point of writing it.

This is not theoretical: of 257 reachable `SKILL.md` files measured on one machine, 175 (68%)
carried this flag. Their owner assumed the skills were bad. They were switched off.

## 5. The body is short and progressive

- `SKILL.md` under ~500 lines (under 100 for an umbrella parent). Past that, split.
- Heavy detail → `references/*.md`, loaded only when needed.
- Reusable code → `scripts/`, not pasted into markdown.
- Files to copy → `assets/`.

```
skills/<skill-name>/
├── SKILL.md          # required
├── references/       # optional — detail loaded on demand
├── scripts/          # optional — executable code
└── assets/           # optional — templates, files to copy
```

## 6. Imperative voice, zero filler

- Banned: "You are an expert…", "Certainly!", "It's important to note that…",
  "Best practices include…".
- Allowed: orders. "Run X. If Y, do Z. Never do W."
- No tables of generalities. Actionable checklists or exact commands.

## 7. Concrete beats abstract

Every skill ships at least one of:

- an exact command to run,
- a file template ready to copy,
- a verification checklist,
- a before/after example.

A skill that is only advice is rejected.

## 8. Anti-patterns section required

Stating what to do is not enough — models drift back to their default. Every skill lists the
traps explicitly, as `❌ what happens by default` → `✅ what we want`.

## 9. Portable by default

- No dependency on a machine path, a key, or an MCP server, **unless** declared in a
  `Requirements` section at the top of the skill.
- A skill driving an external tool (Blender, After Effects, DaVinci Resolve, Photoshop) checks
  availability before acting and fails loudly.

## 10. Tested before merge

Before committing a skill, verify all three:

1. **Trigger** — a natural sentence a user would type fires it.
2. **Non-trigger** — a nearby but off-topic sentence does *not* fire it.
3. **Execution** — followed literally, it produces the right result on a real case.

Results go in [`JOURNAL.md`](JOURNAL.md).

## 11. Language

Everything committed to this repo is written in **English** — skills, references, scripts,
docs, README, commit messages. Only `.private/` is exempt.

## 12. Git

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
- [ ] `disable-model-invocation` not set
- [ ] `SKILL.md` under 500 lines (100 for an umbrella parent), detail in `references/`
- [ ] Umbrella only: every child referenced from the parent with a "when to load it" line
- [ ] Imperative voice, zero filler
- [ ] At least one concrete artifact (command / template / checklist / before-after)
- [ ] Anti-patterns section present
- [ ] No undeclared machine dependency
- [ ] Three tests passed and recorded in `JOURNAL.md`
- [ ] English throughout, commit without `Co-Authored-By`
