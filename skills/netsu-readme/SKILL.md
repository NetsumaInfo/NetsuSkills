---
name: netsu-readme
description: Use when the user asks to write, create, rewrite, redo, generate, set up, fix, clean up, shorten or improve a README or readme file, or a GitHub profile README or profile page (github.com/user/user) — or to strip AI slop out of one, or to add badges, a demo GIF or a section to one. Do NOT use for CONTRIBUTING, CHANGELOG, API reference, a docs site, translating or localizing a README, or removing slop from code.
---

# NetsuReadme

Write a README a stranger can act on, in a voice that reads like a person wrote it.

This is an index. Pick the case, load that file, follow it. No procedure lives on this page.

## Pick the case

| The user wants to… | Load |
|---|---|
| Write or rewrite the README of a repository | `references/project.md` |
| Write the GitHub profile README (`github.com/<user>/<user>`) | `references/profile.md` |
| Strip AI slop out of a README or docs that already exist | `references/voice.md` |
| Add badges, a demo, or other visuals to an existing README | `references/visuals.md` |

Writing a full README starts at `project.md`; it says when to pull the others in.

One child is not an entry point. `references/sections.md` holds the section inventory and the
ordering rules; `project.md` and `profile.md` load it when they reach the planning step. Never
load it on its own — on its own it decides nothing.

If none of the four cases fits, say so and ask. Do not improvise from this page.

## Rules that hold in every case

**Every sentence traces to a file in the repository.** Code, config, lockfile, CI workflow,
LICENSE. A README is derived from the repository. The conversation is not an input — see
`references/voice.md` for the full rule and what it rules out.

**Never invent.** No flag, command, package name, benchmark number, or adoption claim that you
have not read in the repository. An install line that does not work costs every reader time and
costs the project its credibility permanently.

**Never write a real name, email address, employer, client, local file path, or machine name**
unless it is already committed to a file in that repository.

**Explore, ask, plan, then write.** Never produce a finished README in one shot from a cold
start. The order exists so the questions are short and the structure is agreed before 200 lines
are spent on the wrong shape.

**Badges and visuals are opt-in.** Default to none beyond what carries real information. Load
`references/visuals.md` only when the user asks for decoration.
