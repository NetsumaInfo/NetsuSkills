# Setup: the project's design file

Create or update the design file that every screen, component and string follows. Load this when
the project has none, or when the user wants to change the voice or the look.

## 1. Find what already exists

Read before asking. Check these, in order:

| Look for | What it gives |
|---|---|
| `DESIGN.md`, `STYLEGUIDE.md`, `BRAND.md`, `VOICE.md`, and `docs/*design*`, `docs/*style*`, `docs/*voice*` when they are about the UI (`code-style.md` is not) | An existing design file. Follow it and add only what it lacks |
| A UI or theming section in `docs/architecture*` | Part of the look, already decided |
| `PRODUCT.md` (anywhere in the repo), `.impeccable.md` | The product and its users. A voice or look decision it records with a reason counts as recorded; the file alone is not a design file |
| `.impeccable/`, `.interface-design/` (its `system.md` included) | Another tool's files. Follow what they decide, never edit them; missing sections go in root files that point to them |
| `GLOSSARY.md`, a glossary next to the locale files, `docs/*glossary*` | The words the product uses, once you have checked it describes this product. A stale glossary is a finding, not a source |
| Locale files (`locales/`, `i18n/`, `messages/`, `_locales/`) and the string inventory | UI languages, source language, address form per language, current terms |
| CSS variables and `@theme`, `tailwind.config.*`, `components.json`, `theme.ts`, `tokens.json` | Colors, radius, fonts, component library |
| `package.json` dependencies | Font packages, icon library, animation library |
| `README.md` first paragraph, `AGENTS.md` | What the product is, who uses it, whether agents may run the app |

Call the scanner by its full path. The greps avoid `-P` on purpose: Git Bash on Windows ships a
grep whose `-P` fails or returns nothing, depending on the locale.

```bash
find . \( -name node_modules -o -name .git -o -name .claude -o -name dist -o -name build \) -prune -o \( -name DESIGN.md -o -name PRODUCT.md -o -name STYLEGUIDE.md -o -name BRAND.md -o -name .impeccable.md -o -ipath './docs/*design*' -o -ipath './docs/*style*' -o -path './.interface-design/system.md' -o -iname '*glossary*' -o -iname '*voice*' \) -print
node <skill dir>/scripts/scan.mjs copy <src> <locale folder> --list | head -60
node <skill dir>/scripts/scan.mjs copy <src> <locale folder> | grep -E '^Note|fr-address|address-mixed'
grep -rnE --include='*.css' -e '--[a-z0-9-]+:' -e '@theme' <src> | head -40
```

The `Note: address` line counts the forms of "you" per language, so the majority form is known
without asking. `fr-address` and `address-mixed` list the strings in the rarer form. The other
notes name the languages with no lexicon file. Text shown to users can live outside `src`: a
core service, installer strings, setup scripts. Add those folders. `--include` goes before the
patterns: after `--`, grep reads it as a file name.

A file covers the voice when it states the address form and the product's words for each UI
language. It covers the look when it names the fonts and the colours; radius and density can wait
for their own requests. If an existing file covers both, stop here. Tell the user which file the
skill will follow, then go to §4.

A `DESIGN.md` in another format (YAML tokens in its front matter, sections from `## Overview` to
`## Do's and Don'ts`, as Stitch and Impeccable write it) covers the look through its colour,
typography, layout, elevation and shape sections. Wherever this skill says `## Look`, read those.

When documents disagree (`PRODUCT.md`, the design file, the code), the newest decision wins.
List every conflict in the report instead of picking one silently.

**Report-only requests** ("just the report", « ne change rien »): nothing is written to the project.
§3 puts its draft at the end of the report, under "Proposed design file", and asks whether to save
it; §4 is skipped. The review then states that it was measured against a draft. Several report-only
requests in one session share one draft: the first report holds it, the others point to it. The §2
questions go under the draft, each with its recommended answer; the review does not wait for them.

## 2. Ask what the code cannot answer

Fill every line you can from §1 first. Then ask the remaining questions together, before writing
anything. Five at most about voice and look, each with a recommended answer taken from §1:

1. Who uses the product, and in what situation? One sentence.
2. For each UI language with a formal and an informal "you" (tu/vous, tú/usted, du/Sie, 你/您,
   です・ます or plain form): which one, and for which market (fr-FR or fr-CA, es-ES or es-MX,
   zh-CN or zh-TW)? Skip what the code already answers. When it is mixed, ask which wins.
3. Three words for the tone, and three words it must never be.
4. What do users call the main things and actions? Any word the product must never use?
5. The look: an existing brand to follow, apps it should resemble, or directions to propose?

The task may need product facts the code cannot give: what an action produces, whether it can be
undone, where the data comes from. Add them to the same message. Nothing is asked later.

Use the question tool when there is one; otherwise send one message with numbered questions.

Question 5 does not choose the look. Without a brand, the choice happens in
`references/new-ui.md` (directions), `references/typography.md` or `references/colors.md`, and the
result is written back
into the file.

## 3. Write the file

Copy `assets/DESIGN.md` to the project root as `DESIGN.md` and fill it from §1 and §2. For a
report-only request, fill the copy inside the report instead.

- Replace every `<placeholder>` or delete its line. No "TBD".
- `### Examples` gets 3 to 5 real strings from the code, rewritten in the chosen voice when they
  need it. Examples steer tone more reliably than adjectives do (Claude prompting best practices,
  platform.claude.com, read 2026-09-16).
- `Script conventions` (Japanese, Chinese) is read from the code, not asked. Where the code is
  silent, write the Default column of `references/words-ja.md` or `references/words-zh.md`.
- `### Words we use` comes from the existing glossary and the inventory. When the code names one
  concept with several words, keep the one users say and list the others under "Never say".
- `## Look` holds what the code already uses and what the user chose, nothing else. A value taken
  from the code keeps its origin: `Fonts: Inter (in use, no recorded reason)`. A review treats
  such a line as the current state, not a decision, and raises it at most as a P3 question.
- `Direction:` stays `not chosen yet` until someone picks one. Never add a palette or fonts that
  the code does not use and nobody picked.
- Stay under about 80 lines.

When §1 found a design file that lacks a section, add the section after its last one. If that file's
own rules fix its list of sections, or it sits in another tool's folder, put the missing voice
sections in `VOICE.md` at the project root, and name both files in the §4 line. Never create a
second file for the look. `PRODUCT.md` is not a design file: create `DESIGN.md` next to it, and let
`## Product` point to it instead of copying it.

## 4. Point every agent at it

Add one line so an agent that writes UI follows the file even when this skill does not load:

```markdown
- UI and UI text follow [`DESIGN.md`](DESIGN.md). Read it before writing a screen, a component or any string a user sees.
```

| Project has | Put the line in |
|---|---|
| `AGENTS.md` | `AGENTS.md`, in its rules or conventions list, in the file's own style |
| Only `CLAUDE.md` | `CLAUDE.md`, or the file it points to when it is only a pointer |
| Neither | A new `AGENTS.md` holding a `# AGENTS.md` heading and the line |
| The line already | Nothing |

Use the real file name when §1 found something other than `DESIGN.md`. If the agent file names
another tool's design check (an Impeccable detector, another design skill), point it out and
propose replacing that line with the scans in `## Checks`; change it only on a yes.

## 5. Show it

Print the design file and the diff of the agent file. Say which lines came from the code and which
came from the answers. This step changes nothing else in the project. Report-only: the draft at
the end of the report is the proof.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Ten questions before reading a single file | The code first, then at most five questions, all at once |
| A tone, a palette and fonts invented to fill the template | Only what exists or what the user chose; the rest waits for the direction step |
| A new `DESIGN.md` next to an existing style guide | The existing file, extended |
| `DESIGN.md` and `AGENTS.md` written during a review the user wanted read-only | The draft at the end of the report, saved only on a yes |
| Adjectives as the whole voice: "friendly, modern, clean" | Three words, three anti-words, and real example strings |
| Asking tu or vous when every string already says vous | Recording vous, and saying where it came from |
| The pointer line copied into every agent file in the repo | One line, in `AGENTS.md` or the file it points to |
