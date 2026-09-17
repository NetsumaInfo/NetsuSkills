---
name: netsu-peccable
description: Use when the user wants to design, build, redesign, restyle, critique or polish a front-end interface (a page, screen, landing page, dashboard, settings page, form, dialog or component), change its fonts, colors, spacing, dark mode or animations, or write, rewrite, translate or review text people read in or about a product, in any language: buttons, labels, error messages, empty and loading states, onboarding, notifications, emails, landing copy, store listings, release notes. Also sets up the project's DESIGN.md (tu or vous, the words to use, the look). Catches AI-sounding or stiff copy and the generic AI look. Do NOT use for a README, a blog post or article, backend-only work, or feature logic that changes nothing a user sees or reads.
---

# NetsuPeccable

Interfaces and interface text that read like a person made them for these users: everyday
words, deliberate visual choices, every state handled.

This is an index. Pick the case, load that file, follow it. No procedure lives on this page.

## Pick the case

| The user wants to… | Load |
|---|---|
| Set up or change the project's voice and look | `references/setup.md` |
| Build a new page, screen or app from scratch | `references/new-ui.md` |
| Build, fix or restyle a component: button, form, dialog, table, menu, card, navigation | `references/components.md` |
| Change fonts, colors, spacing, density or dark mode | `references/visual.md` |
| Add or fix animations and micro-interactions | `references/motion.md` |
| Write or translate text inside the product: buttons, labels, errors, empty states, confirmations, toasts, onboarding, settings, emails, push notifications | `references/copy-app.md` |
| Write a landing page, a presentation page, a store listing or release notes | `references/copy-pages.md` |
| Review or clean up existing text, a landing page or a store listing included: "sounds like AI", "too formal", "nobody talks like that", "check the translations" | `references/review-copy.md` |
| Critique or polish an existing screen: "looks bad", "looks AI-made", "feels off", "make it bolder", "calmer", "simpler" | `references/review-ui.md` |

A request that mixes cases starts with the one that decides the others. A new screen starts at
`new-ui.md`, which says when to pull in the copy files. A review of both the text and the
screens runs `review-ui.md`, which holds the single report, and takes its text findings from
`review-copy.md`.

The other children are resources. They are never loaded on their own; the steps above load them:

- `references/words-<lang>.md` for `fr`, `en`, `es`, `de`, `ja` and `zh`: lexicon and typography
  for that language. `references/words-any.md` for every other language. Load the file of each
  language you write or rewrite before the first string. For the languages you only check, the
  scanner applies the lexicon; their fixes go to a translator.
- `references/states.md`: what each state shows and says (empty, loading, error, success,
  disabled, offline, partial, stale). Load it when building a component or writing its messages.
- `references/ai-look.md`: the dated list of generic AI visual choices, and what to decide
  instead. Load it before choosing or reviewing anything visual.

If none of the cases fits, say so and ask. Do not improvise from this page.

## Requirements

Paths under `scripts/` and `assets/` are relative to this skill's directory. Commands run from
the project root, so call the scanner by its full path: `node <skill dir>/scripts/scan.mjs`.
Commands are POSIX shell (Git Bash on Windows). Scratch output goes to the session's scratch
folder, never into the project.

- `scripts/scan.mjs` needs Node 18 or later and nothing else. Check `node --version` before the
  first scan; without Node, say so and review by reading.
- Screenshots need a way to run the UI (a dev server and a browser tool). Optional.
- `npx react-doctor@latest design --verbose` and `npx playwright` download packages or browsers:
  ask before the first run.

## Rules that hold in every case

**Read the design file first.** `DESIGN.md` at the project root (with `VOICE.md` when setup put the
voice there), or an existing style guide that states the voice and the look
(`.interface-design/system.md`, `STYLEGUIDE.md`, a guide under `docs/`). `PRODUCT.md` describes the
product: read it as well, and treat a voice or look decision it records with a reason as recorded.
If there is no design file, run `references/setup.md` before anything else. Its questions come at
the start, never in the middle of a build. When nobody can answer (a report-only request, an agent
run), the questions go at the end of the report, each with its recommended answer, and nothing
waits.

**Words people say out loud, in every language.** Every string uses the words the product's
users use, the ones in the glossary of `DESIGN.md`, in each UI language. One word per concept,
everywhere. A sentence that would sound odd said to a colleague gets rewritten.

**No default look.** Every visual choice (font, palette, radius, shadow, density) comes from
`DESIGN.md` or from options the user picked. The model's house style is not a choice.

**Never invent.** No user counts, ratings, testimonials, logos, prices or features the project
does not already state.

**Stay in scope.** Change what the request names. Reuse the project's components and tokens
before writing new ones.

**Show it, once.** End with evidence: a screenshot of the real render, or `scripts/scan.mjs`
output before and after. One proof per change, not a campaign. If the project forbids launching
the app, say which part was not observed.
