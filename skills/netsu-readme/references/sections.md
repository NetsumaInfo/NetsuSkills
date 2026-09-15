# Sections

Which sections, in what order, for what kind of project. Used at step 4 of `project.md`.

Frequencies are measured across 24 well-regarded repositories (ripgrep, fzf, zod, vite,
tailwindcss, esbuild, httpie, bat, fd, zustand, biome, uv, ruff, turso, lazygit, hono, svelte,
deno, excalidraw, supabase, zed, sqlite, gum, execa).

## The inventory

| Section | Seen in | Justified when | Bloat when | Where |
|---|---|---|---|---|
| **Name + one-line description** | 24/24 | Always | Never | Line 1. Plain prose, before any heading |
| **Badges** | ~20/24 | Version, build, licence. 2–6, one row | 10+, or any static badge asserting quality | Under the title, never above the description |
| **Logo / banner** | 16/24 | The project has an identity to establish | Solo utility. It pushes the description below the fold | Centred block before the title |
| **Demo — screenshot, GIF, chart** | ~12/24 | Anything visual or interactive: CLI, TUI, app | A pure library where code reads better | First screen. Median across the corpus: line 3 |
| **Install** | 16/24 | Always, if installable | Never — but the *matrix* can be | CLI: below the demo. Library: one line, near the top |
| **Usage / Quick start** | 13/24 | Always | Never | Early. Median first code block: line 48 |
| **Docs link** | 9/24 | A docs site exists | It does not | Right after the intro. This is what lets the README stay short |
| **Why / Background** | 7/24 | Crowded field, or non-obvious category | The category is self-evident | Before the "how". esbuild's entire README is one `## Why?` |
| **Features / Highlights** | 9/24 | Scannable differentiators a competitor lacks. Cut down from the full inventory in `project.md` step 1b, never assembled from memory | Restating the one-liner as bullets | After the description |
| **Comparison to alternatives** | 5/24 | A well-known incumbent exists | No real competitor, or it reads as a hit piece | After Why. ripgrep's "Why shouldn't I use ripgrep?" is the model |
| **Configuration** | 7/24 | Config is the main surface | Dumping every flag instead of `--help` | After Usage — and only if there is no docs site |
| **FAQ / Troubleshooting** | 5/24 | Recurring issues clog the tracker | Invented questions nobody asked | Bottom, above Contributing |
| **Build from source / Development** | 4/24 | Compiled project | Interpreted library where install is one line | Bottom. It is for contributors, not users |
| **Community / Support** | 5/24 | An active channel where questions get answered | A dead Discord link | Near the bottom |
| **Contributing** | 13/24 | Always, as a **link** | Inlining the guide | Near the bottom |
| **License** | 10/24 | Always. One line, SPDX name, link to LICENSE | Pasting the text | Bottom. Name it — readers report this missing far too often |
| **Security** | 2/24 | Any security-relevant tool | Rewriting SECURITY.md | One line pointing at SECURITY.md |
| **Requirements / Prerequisites** | 1/24 | A non-obvious runtime, OS or version floor | Restating what the package manager enforces | A subsection inside Install, not standalone |
| **Table of contents** | 2/24 | Past ~300 lines only | Under 100 lines — GitHub generates an outline already | After the intro |
| **Roadmap / Project status** | 2/24 | Pre-1.0 or experimental | A stable project. This section goes stale fastest of any | Bottom, or a one-line maturity note at the top |
| **Acknowledgements** | 2/24 | Real intellectual debts | Generic thanks | Bottom |
| **Who uses this / Testimonials** | 2/24 | Adoption is genuinely the credibility question | Under ~1k stars it reads as insecurity | Bottom, or not at all |
| **Related projects** | ~4/24 | Genuinely useful neighbours | Link farming | Bottom |

## Never in the README

Each of these has its own file, and GitHub's community-profile checker looks for them by name.
Link, never copy.

| Content | Belongs in |
|---|---|
| Full API reference | A docs site, or generated output |
| Changelog | `CHANGELOG.md` |
| Contributing guide | `CONTRIBUTING.md` |
| Code of conduct | `CODE_OF_CONDUCT.md` |
| Security policy | `SECURITY.md` |
| Licence text | `LICENSE` — but name the licence in the README |
| Codebase architecture | `ARCHITECTURE.md` |

Hard ceiling: GitHub truncates a README past 500 KiB.

## The opening, in order

1. **What it is, with the category named in the first six words.** Not what it is good at.
2. **The constraint or the differentiator.** One sentence.
3. **Who it is for, or what it replaces.**

The documented failure mode is starting with how fast, minimal or modern something is without
ever saying what it is. A one-liner made of stacked adjectives — "a minimal isomorphic
asynchronous worker framework" — could mean anything.

Something concrete inside the first 30 lines: a screenshot, a GIF, a benchmark, or a runnable
snippet.

## By project type

**Library / package.** Usage code very early — zustand shows code at line 23 and only explains
why at line 59, and it works because the code is self-evident. Install is one line. Comparison
table earns its place. A note on types if it ships them.

**CLI tool.** Demo first. The install matrix is usually the single biggest section — fd spends
~200 of 791 lines on package managers — so push it below the demo or collapse it in `<details>`.
Add a `--help` excerpt and a troubleshooting section. Worth automating: a CI step asserting the
real `--help` output still matches the README.

**Web app / platform.** Screenshot at the top. Hosted versus self-host is the reader's first
decision. Then "how it works", deploy button, architecture.

**Desktop app.** Download links per OS *before* any build instructions. Zed's README is 298
words total: badges, one positioning sentence, install, developing, contributing, licensing.

**Template / starter.** Inverts everything. "How to use this template" is step 1, and the README
must say it is meant to be deleted and replaced. List what is included *and* what is
deliberately excluded.

**Monorepo.** The root README is a map, not a manual: what each package is, where the docs are.
The cleanest pattern found in the wild — zod and biome both do it — is to symlink the root
README to the flagship package's README, so the registry page and the repo page cannot diverge.

**Personal / hobby project.** Say so. State maintenance status honestly. Skip badges, sponsors,
TOC, roadmap. Twenty lines can be complete.

**Not accepting contributions.** Say it, and say why. SQLite states in its README that pull
requests are not normally accepted because a contribution's copyright would break its
public-domain status, and redirects to the forum. That is the model: a reason, and somewhere
else to go.

## Two orderings, and when each wins

The specs disagree, so choose deliberately:

- **Install before Usage** — the common order. Right when installing is the reader's next action.
- **Usage before Install** — right when the reader has not yet decided to use it at all. They
  bail long before they would install, so show them what the code looks like first.

Front-door READMEs (a docs site exists) usually want Usage first. Manuals usually want Install
first.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| The same ten sections on every project | Sections picked from what this repo has |
| A table of contents on a 90-line README | GitHub's auto-outline already covers it |
| Requirements as a top-level section listing the obvious | A subsection in Install, only for non-obvious floors |
| Roadmap because the template had one | Only pre-1.0, and only work someone committed to |
| Features bullets that paraphrase the project name | Differentiators, or no Features section |
| Inlining CONTRIBUTING because it makes the README look complete | A link. Length is not completeness |
| A "Conclusion" or "Summary" section | End on License |
