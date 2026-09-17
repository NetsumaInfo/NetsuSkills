# Review UI: critique an existing screen

Judge a screen that already exists, report what is wrong in order of harm, and fix it only when
asked. Script paths are relative to this skill's directory.

## 1. Scope

Write down what is under review: screen names, a URL, files, or a branch. For a branch, the scans
below take `--changed <ref>`. Read `DESIGN.md` in full (and `VOICE.md` when there is one):
`## Look`, `## Components` and `### Words we use` are what drift is measured against. In a file of
another format, the colour, typography, layout and shape sections stand for `## Look`. No design
file: run `references/setup.md` first; a report-only request gets its draft at the end of the
report, nothing written. A design file drafted from this same code only shows how the screen differs
from the rest of the app, not from a decision: say so in the report, and keep those findings at P3
unless another rule applies.

A branch or a pull request is reviewed with `references/review-branch.md`, which resolves the
scope and hands the surfaces back to this file.

## 2. See it

Read `AGENTS.md` and `CLAUDE.md` before launching anything. Some projects forbid agents from
running the app.

| Allowed to run it | Do |
|---|---|
| Yes, web | Screenshot the main task at 375 px and 1280 px, in each colour scheme the product ships. Capture the states from §5 |
| Yes, desktop app (Tauri, Electron) | The window at its smallest supported size and at its default size |
| A static build already on disk | Open the HTML file in the browser tool; nothing to start |
| A browser extension | Loading it unpacked is running the app. A popup opened as a file shows `__MSG_` keys, not text: do not report that as seen |
| No, or it will not start | Read the components and routes. The report opens with "Code-only review: nothing was rendered." |

When the project has Playwright, one capture per size and scheme. `npx playwright` may download
a browser: ask first. `<scratch>` is the session's scratch folder, never the project.

```bash
npx playwright screenshot --viewport-size "375,812" --color-scheme dark --full-page http://localhost:5173/exports <scratch>/review-375-dark.png
npx playwright screenshot --viewport-size "1280,800" --color-scheme light --full-page http://localhost:5173/exports <scratch>/review-1280-light.png
```

Otherwise use the browser tool the session has. Never guess what a screen looks like from its
class names and report it as seen.

## 3. Mechanical pass

Write down the §4 steps 1 and 2 before reading any scan output, so the scan does not decide what
you see.

```bash
node <skill dir>/scripts/scan.mjs ui src/routes/exports.tsx src/components/export-list.tsx
node <skill dir>/scripts/scan.mjs copy src/routes/exports.tsx src/components/export-list.tsx src/locales
npx react-doctor@latest design --verbose              # optional; downloads the package, ask first
```

Besides the AI look, the `ui` scan flags markup that fails keyboard and screen-reader users
(`icon-button-name`, `static-click`, `positive-tabindex`, `hidden-focusable`, `img-alt`,
`late-live-region`), raw palette colours and fixed icon colours, and type settings (`font-tag`,
`justify`, `root-no-select`); the same checks exist in eslint-plugin-jsx-a11y (read 2026-09-17).

A translated app keeps its text in locale files: add the screen's namespace for each language to
the copy scan. The scan is a regex heuristic: it misses strings built at run time and can flag
code. Read each finding in context, keep the true ones, and list the dropped ones with a reason
under "Scan hits dropped". A clean scan says nothing about hierarchy or flow. Copy findings go in
the same table; a full text rewrite belongs to `references/review-copy.md`.

Drift the scan does not look for (hardcoded colors, arbitrary values, font sources, radius and
shadow variety): run the audit greps of `references/visual.md` §2 on the screen's folder, `.ts`
files included. Read every hit in the screen's own files. Across a whole app, group the hits by
value, report the counts, and read one example per group.

## 4. Look pass

Load `references/ai-look.md`.

1. **Five seconds.** Look at the 1280 px capture for five seconds (code-only: the top of the
   route's JSX). Write what the screen is for and where the primary action is. Failing either is
   a finding.
2. **Hierarchy.** One primary action per region. Heading steps visible at a glance. The number or
   state the user came for is the most prominent thing, not a decoration.
3. **AI tells.** Each item of `references/ai-look.md` present on the screen, unless `DESIGN.md`
   chose it. Anything that is neither content, a control nor structure must earn its place: a
   decoration nobody chose is a finding.
4. **Drift from `DESIGN.md`.** Values outside the tokens, a second font, a second icon library,
   radius or shadow outside `## Look`, a word outside `### Words we use`, a component rebuilt
   next to the shared one.

## 5. Use pass

- **Keyboard only**, through the main task: everything reachable, focus always visible and never
  hidden under a sticky bar, order matching the layout, dialogs trapping focus and returning it.
- **States.** Load `references/states.md`. Trigger empty, loading and error: devtools offline or
  throttled, a fixture with `[]`, a mocked 500. Code-only: find the branches (`isLoading`,
  `error`, `.length === 0`, a `catch`); a missing branch is a finding.
- **Stress.** A 100-character name, the French strings (15 to 35% longer than English; Crowdin,
  LocaleProof, 2026), 375 px, `prefers-reduced-motion: reduce`, dark mode, text zoomed to 200%
  and a 320 px wide viewport with no sideways scroll (WCAG 2.2 SC 1.4.4 and 1.4.10, read
  2026-09-17), Windows high contrast
  (`forced-colors: active`). A desktop app skips what it cannot have: no offline test for an app
  that never uses the network.
- **Structure.** Alt text on every meaningful image, a page title per route, and structure that
  code can read (WCAG 2.2 SC 1.1.1, 2.4.2, 1.3.1, read 2026-09-17). One `h1`, headings in
  order and landmarks (`header`, `nav`, `main`) are the usual way to get there, a practice
  rather than a criterion.
- **Tooltips.** Each one adds what the label cannot hold, in the UI language, opens on keyboard
  focus as well as hover, and holds nothing the user needs to finish the task.
- **Heuristics** (a subset of Nielsen's ten, NN/g):

| Heuristic | Ask |
|---|---|
| Visibility of status | After each action, does the screen say what happened within a second? |
| Real-world words | Would a user say each label out loud? Does it match `### Words we use`? |
| Error recovery | Does each error say what went wrong and how to fix it, and keep the input? |
| Consistency | Does the same action look and read the same on every screen? |
| Recognition over recall | Is anything the user must remember from a previous screen shown here? |
| User control | Can every action be cancelled, undone or backed out of? |
| Error prevention | Is a destructive action confirmed or undoable, and a wrong value stopped before submit? |
| Flexibility | In a tool used daily, do frequent actions have shortcuts or bulk versions? |
| Help | Where the task is hard, is the help on the screen, not only in a doc? |

- **Cognitive load.** Anything the user must remember from another screen should be shown here
  instead: working memory holds about four items (Cowan, 2001). That limit is about memory, not
  about what is visible: a long flat list of options calls for grouping or disclosure. Count
  elements in the accent color per region: more than one primary competes.

## 6. Severity

| Level | Meaning | Example |
|---|---|---|
| P0 | The task cannot be completed, data is lost, or the screen shows raw internals or a false claim | Save button unreachable by keyboard; form clears on error; a stack trace on screen |
| P1 | The task is hard or unclear | Error says "Invalid input"; no loading state on a 3 s action |
| P2 | Annoying, with a workaround | Hover-only row actions on desktop; inconsistent button labels |
| P3 | Polish | Radius off by 2 px from `## Look`; numbers not in `tabular-nums` |

Test for the top two: **would a user contact support about this?** Yes means P0 or P1.

Accessibility failures are P0 when they block the main task, P1 otherwise: no visible focus
(WCAG 2.2 SC 2.4.7), text contrast under 4.5:1 or 3:1 for large text (SC 1.4.3), controls and
focus rings under 3:1 (SC 1.4.11), a control with no accessible name (SC 4.1.2), a keyboard trap
(SC 2.1.2), a target under 24×24 CSS px without spacing (SC 2.5.8). Read 2026-09-16. Also P1 at
least: reduced motion ignored, content clipped at 320 px or 200% zoom, a truncated value with no
way to read it, a destructive action with no confirmation or undo, a change shown only by motion.

## 7. Report

Write the whole report, headings included, in the user's language. When the text was reviewed
too, its findings go in the same table with this severity scale, and the "Needs a translator"
and "Dead strings" sections of `references/review-copy.md` follow "Scan hits dropped".

```markdown
## UI review: <screen>

Seen: 375 and 1280 px, light and dark | Code-only review: nothing was rendered.
Design file: <DESIGN.md | drafted from this code, at the end of this report>
Verdict: <one line: the biggest problem, and whether the screen does its job>

### Keep
- <a specific strength, with where it is>
- <another>

### Findings
| Where | Problem | Fix | Rule | Severity |
|---|---|---|---|---|
| `export-list.tsx:42` | Delete icon button has no name | `aria-label="Supprimer l’export"` | WCAG 4.1.2 | P1 |
| `export-list.tsx:18` | Row actions appear on hover only | Also show on `focus-within` and `(hover: none)` | scan `hover-only` | P2 |
| `exports.tsx:7` | Card inside a card around the list | Drop the inner card, keep spacing | `references/components.md` Card | P3 |

### Quick wins
1. <highest impact for the least change>
2. <…>
3. <…>

### Scan hits dropped
- <rule, count, why it is not a finding>

### Not observed
- <states, sizes, modes or devices not seen, and why>
```

Sort findings by severity. One root cause is one finding, with every place it occurs. The Rule
cell names what the finding breaks: a `DESIGN.md` section, a scan rule, a React Doctor rule, a
WCAG criterion, a heuristic, or a checklist in `references/components.md`. No score, no grade,
no "8/10".

## 8. Fix, only when asked

1. Fix P0, then P1, then P2. P3 only when the user asks.
2. Tokens first. A wrong value repeated in twelve places is one token change. Classify each fix:
   missing token, shared component not used, or local defect.
3. One change per finding. No redesign under the name of polish: when the concept is wrong, say
   so and propose `references/new-ui.md`.
4. Report each change in a table, grouped by finding:

| Finding | Before | After |
|---|---|---|
| Hover-only row actions | `opacity-0 group-hover:opacity-100` | `+ group-focus-within:opacity-100 [@media(hover:none)]:opacity-100` |
| Hardcoded accent | `bg-[#6366f1]` in 12 files | `bg-primary`, token set once in `@theme` |
| Layout shift on counter | `<span>{count}</span>` | `<span className="tabular-nums">{count}</span>` |

5. Re-run both scans and give the counts before and after. Screenshot again at the same sizes and
   schemes as §2.
6. Before reporting, read the diff for debug output and stray changes.

Other requests on an existing screen have their own file: extracting shared components
(`references/extract.md`), bolder, calmer or simpler (`references/emphasis.md`), options to
compare (`references/variants.md`), fine details (`references/details.md`), accessibility
(`references/accessibility.md`), speed (`references/performance.md`).

## 9. Do not over-fire

- Taste is not a finding. A finding breaks `DESIGN.md`, a rule of this skill, or a measurable
  standard (WCAG, a platform guideline). "I would have done it differently" stays out.
- A choice recorded in `DESIGN.md` is allowed, even when `references/ai-look.md` lists it.
- A scan hit in a test fixture, a comment, or a log string is not a finding.
- Out-of-scope screens get one line under "Not observed", not a second review.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Launching the dev server in a project whose `AGENTS.md` forbids it | Reading the rules first, and a code-only review that says so |
| A review from class names, written as if the screen was seen | "Code-only review: nothing was rendered" at the top |
| An overall score out of 10 | A one-line verdict and a findings table |
| Forty findings, one per occurrence | One finding per root cause, every place listed |
| "Consider improving the visual hierarchy" | Where, what is wrong, the exact fix, the rule, the severity |
| Only problems | Two or three specific things to keep |
| Every scan hit pasted as a finding | Each hit read in context; false ones dropped with a reason |
| "Too much purple" when purple is the brand in `DESIGN.md` | Nothing: a recorded choice is not a finding |
| Missing focus ring filed as P3 polish | P0 or P1 |
| Asked to review, starts rewriting components | The report, then fixes only when asked |
| A polish pass that swaps the fonts and the layout | One change per finding, tokens first, before/after table |
