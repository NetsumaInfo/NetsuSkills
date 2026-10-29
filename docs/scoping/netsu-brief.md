# Scoping — `netsu-brief`

Status: **scoped, not written.** Decided in a grilling session on 2026-10-28.
Nothing under `skills/netsu-brief/` exists yet and nothing gets written until Netsuma says go.

## The moment it fires

Mid-project, when the conversation has outgrown the chat window: "where are we on this
feature", "show me the components", "give me something I can look at and comment on".
A human needs to see the state of the work as a page, not as a wall of chat.

## What the agent gets wrong without it

It reports progress as prose. Prose does not render a component, cannot be pointed at, and
cannot carry a comment anchored to the thing being discussed. The fallback loop today is
screenshots plus long "tell me what to change" paragraphs — which loses the one thing HTML is
good at: interactivity.

## Shape

**Umbrella** (`docs/SKILL-RULES.md` §1). One name to remember, two children, picked from the
request itself — the parent routes and does not teach.

| Child | Lives for | Answers |
|---|---|---|
| `chantier` (work-in-progress brief) | one feature | objective, steps done / in progress / next, decisions taken, files touched, proposals to comment on |
| `inventaire` (project inventory) | the whole project | theme, styles, typography, every component, sorted and browsable |

Invocation: `/netsu-brief <child>`, and the parent also picks the child on its own from a
plain request ("where are we" → `chantier`; "show me all the components" → `inventaire`).

## Decisions taken

### Feedback loop — own implementation, inspired by `lavish-axi`

`lavish-axi` (MIT, ~4.3k stars, active) solves the same loop: a local CLI opens an HTML file in
a browser, the human pins an element or a text range, comments, and the feedback goes back to
the agent. Netsuma's call: **do not depend on it — take the ideas, build our own, improve it
for our needs.** Rejected alternative: `netsu-brief` calling `npx -y lavish-axi` and owning
only the content.

Consequence, stated plainly: the annotation mechanics are ours to write — local server, element
and text-range selection, comment storage, and the agent reading comments back. This is the
bulk of the work and the part that breaks.

MIT means the code may be reused; it also means the notice must travel with anything copied
verbatim. Credit `lavish-axi` in the skill and keep its licence text next to any borrowed file.

Two modes, both required:
- **served** — a local server; comments land in a file the agent reads on the next turn;
- **unserved** — the page opens on its own and still takes comments, exported without a server.

### Not an artifact

A local folder inside the project being worked on, not a published artifact. Untracked by
default; the skill asks, once everything is generated, whether to commit it — because a
committed page is useful for collaboration, and that stays Netsuma's call per project.

### Real components, never an approximation

A comment on a component that is not the real component is worse than no comment. So: iframe
the project's dev server, starting it if needed and asking first. If it will not start, the
gallery says "not rendered" rather than showing a hand-written copy that could lie.

The work-in-progress brief and the inventory are two different objects here: the brief shows
proposals for one feature, the inventory mirrors the real design system.

### Inventory

Per component: name, path, props, variants and states, interaction states
(hover / focus / disabled / loading), accessibility (role, label, keyboard), responsive
breakpoints, where it is used, preview. Project-wide: colors, typography, spacing, radii,
shadows, motion, icons, empty and error states.

Scan everything once, then keep it current incrementally. **The code is always right; the JSON
is a cache that gets rebuilt** — a disagreement between them is a bug in the system, not a
tie to break.

### Staleness — no hook

A hook would run on every commit for a scan that only matters when the page is open. Instead:
on open, compare component file timestamps against the inventory; on divergence, an orange
banner on the page ("3 components changed since the last scan") with a button that asks the
agent to rescan only what changed. Zero cost at rest.

Plus a short rule written into the worked project's own style / agent file, so an agent adding
a component updates the inventory. Short on purpose: it sits in that agent's context for every
request, so it must not pollute it.

### Subagents

The cheapest capable model available for the file sweep, one validation agent. Worded without
naming a vendor, so the skill still works under another harness (Codex included).

### Design rules

`netsu-brief` carries its own compact design rules. It does not depend on `netsu-peccable` —
a skill cannot call another skill — and it does not restate a design system course. Only what
is needed to render the page well.

### Language

Skill, scripts, JSON: English (repo rule). Generated page: the reader's language, with an
EN / FR switch. Matches the `netsu-peccable` multilingual decision.

## Open before writing

1. **Proof.** No real project to test on yet — Netsuma's projects are still moving. The repo
   rule is prove it, then validate. Candidate: prove the `chantier` child on NetsuSkills itself
   (no React components, but the brief renders), and hold `inventaire` until a stable project
   with a running dev server exists.
2. Line count. Two children plus an annotation client, a server and a scanner will not fit the
   rule 2 caps as one skill. Decide the split — `references/` for the children, `scripts/` for
   the server and the scanner — before the first line.
3. Whether the stored brief is a file both sides maintain (survives sessions) or regenerated
   from conversation context each time. Archived briefs must stay easy to reopen.
