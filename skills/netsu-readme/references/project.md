# Repository README

The procedure for the README of a codebase. Six steps, in order.

## 1. Read the repository before asking anything

Every question you ask that the repo already answers makes the user do your job. Read first:

| Read | To learn |
|---|---|
| `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `composer.json` | name, current version, declared description, entry points |
| The lockfile | **which package manager actually ships this.** One lockfile, one install line |
| `bin` / `main` / `src/index.*` / `src/main.*` | is it a library, a CLI, an app |
| `scripts` / `Makefile` / `justfile` | the real commands, verbatim |
| `.github/workflows/*.yml` | whether CI exists, its name, its badge URL |
| `LICENSE` | the SPDX identifier. Never guess it |
| `docs/`, `mkdocs.yml`, `docusaurus.config.*`, `.vitepress/`, `book.toml` | **is there a docs site** — step 2 |
| `CONTRIBUTING.md`, `SECURITY.md`, `CHANGELOG.md`, `CODE_OF_CONDUCT.md` | each one that exists gets a link, never a copy |
| The CLI's argument parser, or run `--help` | the real flags |
| Routes / pages / exported API surface | what the thing actually does |
| `git log --oneline -20`, first commit date | maturity, activity, whether it is a hobby project |
| The existing README | what is hand-written and worth keeping |

Note what you could not determine. That list becomes step 3.

## 2. The question that sets the size

**Does a docs site exist?** This decides more than project type does.

| Answer | The README is | Target | What it must NOT contain |
|---|---|---|---|
| Yes | a front door | 100–400 words | API reference, configuration dump, troubleshooting — all of it lives on the site |
| No | the manual | 900–2500 words | still not the changelog, the contributing guide, or the licence text |

Measured median across 29 well-regarded repositories: 914 words, ~330 lines, 4 badges.
Almost nothing sits between the two clusters. A 2,500-word README next to a docs site is a
symptom, not a style.

## 3. Ask what the repo cannot answer

One batch, one interruption. Skip every question step 1 already answered. Never ask more than
eight. Ask in the user's language; write the README in the language decided below.

1. **In one sentence, what is it?** Name the category in the first six words. Reject an answer
   made of adjectives — "fast", "modern", "lightweight" describe nothing.
2. **Who is it for, and who should not use it?** The second half is what readers trust.
3. **Why does it exist?** What it replaces, or what was wrong with the alternatives.
4. **What does it deliberately not do?** A stated limit is worth more than any feature list.
5. **Maturity:** experimental, usable, stable, maintenance-only, abandoned? Say it plainly.
6. **Contributions:** open, closed, or "open an issue first"? If closed, why.
7. **Demo material:** is there a screenshot, GIF or recording, or should one be made? (If yes
   and decoration is wanted, load `visuals.md`.)
8. **Anything that must not appear** — a real name, an employer, a client, an internal codename,
   a previous project name. Ask this even when you think you know.

Two more, only if relevant: a feature checklist with checkboxes (a status board — justified for
a pre-1.0 project, bloat for a stable one), and the README's language if the repo is ambiguous.
Public repository defaults to English.

## 4. Propose the plan, get it approved

Before writing a line, show:

- the one-line description you will use, verbatim;
- the section list in order, one line each on what goes inside;
- the target length;
- what you are deliberately leaving out, and where it goes instead;
- every fact you could not verify in the repo, listed for the user to confirm or drop.

Section choice and ordering: `sections.md`. Wait for approval. Fix the structure here, not after.

## 5. Write

Load `voice.md` first — it is not optional, it is the half of this skill that matters.

Order that survives a reader who bails after ten seconds: name, one plain sentence, something
concrete within the first 30 lines, then everything else. Median first code block across the
measured corpus sits at line 48; median first image at line 3.

Unverified facts do not go in. A gap the user must fill is written as an explicit question to
them, never as a plausible-looking sentence and never as an unfilled `[placeholder]`.

## 6. Verify before handing it over

- [ ] Pick three claims at random and check them against the repo. Does the flag exist? Does the
      install command match the lockfile? Does the LICENSE file say what the README says?
- [ ] Run the greps in `voice.md`. Any context-leak hit is a blocker.
- [ ] Delete every adjective and re-read. If nothing was lost, they were slop — leave them out.
- [ ] Is there one opinion, one tradeoff, or one "do not use this if" in the file? If not,
      nobody wrote it.
- [ ] Every sibling file that exists (CONTRIBUTING, SECURITY, CHANGELOG, LICENSE) is linked,
      not copied.
- [ ] Nothing from the conversation that is not in the repository.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Fixed ten-section skeleton whatever the project is | Sections chosen in step 4 from what the repo has |
| Opening with adjectives — "A fast, modern, lightweight X" | The category in the first six words, then the constraint that makes it different |
| Install section listing pip, pipx, uv, docker and source | One install line per way the project actually ships. The lockfile decides |
| Inlining the contributing guide, the licence text, the changelog | One link each. GitHub looks for those files by name |
| A roadmap of work nobody committed to | Delete it, or a one-line maturity note |
| Writing the whole README then asking what the user thinks | Plan approved at step 4, before the prose exists |
| Filling a gap with a plausible sentence | Ask. An unverified claim is worse than a missing section |
| Features section that restates the project name in bullets | Cut it, or make each bullet a differentiator a competitor lacks |
| `[Your Name]`, `<your-repo>`, `example.com` left in the output | Never ship a placeholder. Ask for the value |

## References

- `voice.md` — anti-slop and the context-leak rules. Required for step 5.
- `sections.md` — section inventory, ordering, and how the shape changes by project type.
- `visuals.md` — badges, demos, theme-aware images. Only when decoration is asked for.
