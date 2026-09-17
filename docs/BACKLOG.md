# Backlog

Working list. Nothing here is written yet: decide first, build after.

## Method

For every candidate skill, answer three questions before writing a line:

1. **Which exact moment?** — the sentence that would really be typed to trigger it.
2. **What does the agent get wrong without it?** — if nothing, do not write it.
3. **What does it replace?** — which third-party skill gets uninstalled in exchange.

A candidate that fails any of the three stays in "Ideas", not in "To build".

---

## Starting point

180 skill directories installed on the reference machine. Heavy redundancy:

| Cluster | Installed | Problem |
|---|---|---|
| Design / UI / UX | ~21 | `frontend-design`, `ui-ux-designer`, `ui-ux-pro-max`, `minimalist-ui`, `sleek-design-mobile-apps`, `stitch-design`, `huashu-design`, `make-interfaces-feel-better`, `delight`, `use-style`… all say the same thing, none fires at the right moment |
| Git / workflow / review | ~22 | 3 `commit`, 2 `merge`, 2 `oneshot`, 2 `ultrathink`, 3 overlapping review skills |
| Docs / meta (README, skills, prompts, memory) | ~20 | 3 README generators, 3 prompt creators, 3 skill managers |
| TanStack | 15 | one per library — right granularity, quality unverified |
| Next.js | 5 | **abandoned stack** → uninstall, do not rewrite |
| Convex | 6 | main backend, confirmed → audit then rewrite |

The immediate win is not adding skills. It is **replacing 20 with 1** that fires correctly.

## Reference stack

Every technical skill in this repo targets this stack. Nothing else.

| Area | Target | Ignored |
|---|---|---|
| Web full-stack | **TanStack Start** | Next.js (abandoned) |
| Web SPA | **Vite + React + TypeScript** | — |
| Desktop | **Tauri v2** | Electron |
| Mobile | **React Native** | — |
| Backend / data | **Convex** (main backend) | — |

Direct consequence: the 5 installed `nextjs-*` skills get uninstalled, not rewritten. The 15
`tanstack-*` and 6 `convex-*` get audited — keep what fires well, rewrite the rest.

---

## The finding that reorders everything

Measured on the reference machine, 2026-09-15:

| Measure | Value |
|---|---|
| Directories in `~/.claude/skills` | 180 (170 of them symlinks) |
| Reachable `SKILL.md` | 257 |
| Carrying `disable-model-invocation: true` | **175 (68%)** |
| Actually selectable by the agent | 82 |

`disable-model-invocation: true` forbids the agent from choosing the skill on its own: it only
runs when invoked by hand. That is the real cause of "I never use them" and "I can't remember
their names". Not a relevance problem — a switch left off.

Consequence for priority: an audit that lists the disabled skills and decides case by case
(re-enable / uninstall) is worth more than any new skill. See `skill-audit` in wave 6.

Second finding, on quality: `copy-editing` opens with "You are an expert copy editor
specializing in…". Exactly the filler rule 7 bans. Good case study for an anti-patterns section.

---

## Wave 1 — the core

**Status: `netsu-readme` shipped. `netsu-implement` written and executed twice on the full path;
the fast path and `--resume` still have no real run. `netsu-design-review`,
`netsu-commit` and `netsu-code-review` are scoped, not started.**
Writing begins on explicit request.

| # | Skill | Trigger | Replaces |
|---|---|---|---|
| 1 | `netsu-design-review` | "critique this UI", "this looks bad", "improve the design" | ~10 generic design skills |
| 2 | `netsu-readme` | "write the README", "redo the README" | `create-readme`, `readme-blueprint-generator`, `readme-i18n` |
| 3 | `netsu-commit` | "commit", "commit and push" | `commit`, `aiblueprint-git-commit`, `caveman-commit` |
| 4 | `netsu-code-review` | "review my code", "review the PR" | `requesting-/receiving-code-review`, `thermo-nuclear-…`, `caveman-review` |
| 5 | `netsu-implement` | "implement X", "add a button", "one shot this", "fix this bug" | `apex`, `oneshot` ×2, `epct` ×5, `executing-plans`, `subagent-driven-development` |

Watch out on `code-review`: `/code-review` already exists natively. The skill is only justified
if it encodes criteria the native one does not know. Decide when writing it, not before.

`design-review` is a strong umbrella candidate — critique, tokens and motion are distinct cases
under one theme. See wave 7.

Open question 2 is now answered by the build. `netsu-readme` keeps anti-slop as a child
(`references/voice.md`) that is *also* a routed entry point: "strip the slop out of this README"
loads it directly, without the rest of the skill. Baked in and separately reachable. Apply the
same pattern to `netsu-design-review`, and re-scope wave 5 around code and prose that are not
READMEs.

## Wave 2 — web stack

| # | Skill | Scope |
|---|---|---|
| 5 | `tanstack-start-setup` | starting a TanStack Start project to house conventions |
| 6 | `convex-schema` | Convex modelling + migrations, scoped after auditing the 6 existing skills |
| 7 | `tauri-setup` | Tauri v2 desktop app |
| 8 | `rn-setup` | React Native app |

Shared prerequisite: audit the 15 `tanstack-*` and 6 `convex-*` first. Maybe 3 are good and
there is nothing to redo.

## Wave 3 — creative tools

No installed skill drives these tools, although the MCP servers are connected. Open ground.
Rule: one skill per **precise repeated task**, never "drive Blender" in general.

| # | Tool | MCP | To scope |
|---|---|---|---|
| 9 | DaVinci Resolve | connected (scripting, LUTs, DCTL) | core of NetsuRush — the most justified of the three |
| 10 | After Effects | connected (comps, effects, keyframes, expressions) | NetsuRush already bridges to AE |
| 11 | Blender | connected (bpy, screenshots, API docs) | which recurring use? |

Photoshop: MCP connected, out of scope for now.

These are natural command-oriented skills: a decision table in `SKILL.md`, the long operations
in `scripts/`.

## Wave 4 — NetsuRush

`NetsumaInfo/NetsuRush` — *footage-review hub for DaVinci Resolve Studio: preview rushes, AI
shot detection, lossless cuts, frame-accurate timelines. Bridges to Premiere Pro and After
Effects.* TypeScript, public.

Overlaps wave 3 directly: the Resolve and AE skills serve this project first.

| # | Candidate | Note |
|---|---|---|
| 12 | `netsurush-conventions` | project conventions, to extract from the existing code |
| 13 | `resolve-scripting` | recurring Resolve scripting for NetsuRush |

To decide: public here, or private in `NetsuRush/.claude/skills/`? A project-conventions skill
is useless to anyone else — probably belongs in the project.

## Wave 5 — anti-slop

Stated goal: **strip AI slop**. Too much information for nothing, words nobody uses in real
life, comments that paraphrase the code, bloated READMEs.

Installed prior art to dissect before writing:

| Installed skill | What it does | Provisional verdict |
|---|---|---|
| `deslop` | strips slop from the branch diff | right idea, scope too narrow (code only) |
| `uncodixfy` | avoids generic AI UI patterns | prevention for UI, not cleanup |
| `copy-editing` | edits marketing copy | ironic: it is itself full of slop |
| `writing-shape` | shapes raw material into prose | orthogonal |

| # | Candidate | Trigger | Scope |
|---|---|---|---|
| 14 | `deslop-prose` | "strip the slop", "too verbose", "trim this README" | READMEs, docs, UI copy. Cuts filler, bans vocabulary nobody says out loud |
| 15 | `deslop-code` | "clean up the comments", "too many comments" | comments that paraphrase code, useless defensive guards, pompous names |
| 16 | `no-slop` (preventive) | none — a rule loaded before writing | stops slop appearing instead of removing it afterwards |

Design call to make: **remove after** (14, 15) or **prevent before** (16)? Prevention does not
fire reliably; cleanup needs an explicit pass. Probably both, but 14/15 first because they are
testable.

Material needed before writing: a **vocabulary blocklist** and a set of real before/after
examples. Accumulate in `.private/` over time.

## Wave 6 — meta

| # | Candidate | Role |
|---|---|---|
| 17 | `skill-audit` | list installed skills, flag `disable-model-invocation: true`, duplicates, and descriptions that never fire. Output: a decision table |
| 18 | `cleanup-skills` | bulk uninstall (the 5 `nextjs-*` are the first client) |

`skill-audit` is probably the first skill to write in this repo: it is testable on a real case
immediately (180 directories), and it produces the raw material for every other wave.

## Wave 7 — umbrella skills

One entry point per theme, children loaded on demand, so there is one name to remember per
theme instead of twenty. The shape is defined in [`SKILL-RULES.md`](SKILL-RULES.md#1-skill-types).

**Technical constraint that rules out the obvious alternative**: a skill cannot call another
skill, nor force one to load. A "router" skill dispatching to other installed skills does not
work. The umbrella is the working version of that idea.

| # | Umbrella | Children |
|---|---|---|
| 19 | `design` | critique, tokens, motion, layout |
| 20 | `git` | commit, PR, review, worktrees, branch cleanup |
| 21 | `docs` | README, CONTRIBUTING, changelog, API reference |

Open call: do waves 1 and 7 collide? If `design` ships as an umbrella with a `critique` child,
then `design-review` from wave 1 should not exist as a separate skill. Decide the split before
writing either — see open question 6.

---

## Distribution

Three channels, all covered by the current layout:

| Channel | Command | State |
|---|---|---|
| `skills` CLI | `npx skills add NetsumaInfo/NetsuSkills` | **compatible by construction** |
| Claude Code plugin | `/plugin marketplace add NetsumaInfo/NetsuSkills` | ready |
| Manual copy | `cp -r skills/<name> ~/.claude/skills/` | ready |

[skills.sh](https://www.skills.sh/) (the `vercel-labs/skills` project) walks
`skills/<name>/SKILL.md` up to three levels deep and only requires `name` + `description` in
frontmatter — exactly this layout and rule 4. No extra manifest to write.

**How the site's index works, established 2026-09-15.** skills.sh is not a directory of published
repositories. It is a **leaderboard built from install telemetry**: no submission, no registry, no
review. A repository appears once somebody installs it with `npx skills add`, and its rank is the
install count.

Measured, not inferred: `skills.sh/b/anthropics/skills` renders `Skills: 3.1M` — that badge is an
install counter. The same badge for this repository renders `not found`, and
`skills.sh/NetsumaInfo/NetsuSkills` is a 404, while `npx skills add NetsumaInfo/NetsuSkills
--list` resolves the repository and prints the skill correctly. Publication is fine; the install
count is zero.

Consequence: being listed is downstream of adoption, not of publishing. The skills.sh badge
documented at `skills.sh/docs` should not go in the README until the count is non-zero — it reads
`not found` otherwise, which rule 2 of `visuals.md` forbids.

`vercel-labs/skills` issue 880 asked this and is still unanswered, which is why none of it is
written down anywhere.

Note: `metadata.internal: true` hides a skill from skills.sh discovery — useful if a
project-specific skill lives here without being offered to everyone.

---

## What upstream decided, and why it matters here

`Melvynx/aiblueprint` is where `apex`, `oneshot` and the `aiblueprint-*` duplicates come from.
Checked 2026-09-15; last commit 2026-09-10. Two findings worth keeping.

**The entry file got cut, the depth did not.** Commit `chore(skills): slim catalog to Apex style`
(2026-09-06) took `apex/SKILL.md` from **124 lines to 28**. All seventeen `steps/*.md` are
byte-identical to the installed copy. Nothing was deleted — the parent stopped teaching and went
back to routing. That is rule 2, reached independently by somebody with a large installed base.
The installed copy here dates from 9 August and still carries the fat entry file.

**A skill can change meaning under a stable name.** `oneshot` is gone from the public catalog
(12 skills) and now ships in the paid bundle, redefined as a *fixed* sequence explicitly opposed
to `apex`: adaptive checkpoints on one side, fixed order on the other. The installed copy
predates the split and describes a third thing — a narrow fast edit. Anyone reasoning about
"the oneshot skill" is reasoning about whichever version they happen to have on disk.

Consequence for the audit in wave 6: version drift is invisible. A skill directory carries no
upstream reference, no version, and no date beyond its mtime. `skill-audit` should diff installed
skills against their source repository where one is known, not just read what is on disk.

### Invocation, measured again

The earlier figure was 175 of 257 reachable `SKILL.md` (68%). Narrowed to the top level of
`~/.claude/skills` — about 180 directories — the number is **two**: `impeccable` and
`gpt-image-2-style-library` are the only ones the agent can select on its own. Everything else,
including every skill worth keeping, is switched off.

---

## Ideas (not yet qualified)

- **Nothing owns "prove this works".** Surfaced by the `netsu-implement` routing test: `--proof
  check the upscale output` routes nowhere. Every installed skill that verifies does so as the
  tail of something else — implementing, reviewing, debugging. A standalone "run the real flow and
  show me current evidence", with no change to make, has no home. Qualify it before writing:
  is it a real repeated moment, or just the tail of `netsu-implement` asked out of order?
- `design-system` — tokens, scales, themes
- `debug` — would replace `systematic-debugging`
- `prd` / `tasks` — check whether existing versions are good enough

## Open questions

1. **Where to start?** `skill-audit` (wave 6) pays off faster than wave 1: it is testable on the
   180 installed directories and it produces the material for the rest.
2. **Anti-slop: separate skill or baked-in rule?** Answered for READMEs: baked in, reachable as an
   entry point (`netsu-readme` voice.md).
3. **The 175 disabled skills**: re-enable case by case, or bulk uninstall and keep only what
   gets rewritten here?
4. **Blender**: which precise repeated task? Resolve and AE are justified by NetsuRush,
   Blender is not yet.
5. **NetsuRush skills**: public here, or private in the project repo?
6. **Wave 1 vs wave 7**: atomic skills first, or go straight to umbrellas and make wave 1 the
   children of `design`, `git` and `docs`?
