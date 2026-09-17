---
name: netsu-peccable
description: Use when the user wants to design, build, redesign, critique or polish a front-end interface (page, screen, landing page, dashboard, settings, form, dialog, component), change its fonts, colors, spacing, dark mode or animations, make it bolder, calmer or simpler, check its accessibility, speed it up or fit it to other devices, stress-test its states, compare variants, extract shared components, add a moment of delight, review a branch's or pull request's UI, or learn how an interface was built; or write, rewrite, translate or review text people read in or about a product, in any language: buttons, labels, tooltips, errors, empty states, onboarding, notifications, emails, landing copy, store listings, release notes. Also sets up the project's DESIGN.md (tu or vous, the words to use, the look). Catches AI-sounding copy and the generic AI look. Do NOT use for a README, a blog post, article or newsletter, backend-only work, or feature logic that changes nothing a user sees or reads.
---

# NetsuPeccable

Interfaces and interface text that read like a person made them for these users: everyday
words, deliberate visual choices, every state handled.

This is an index. Load the one file the request asks for and follow its frame: what it changes,
what it never touches, when it stops, what it returns. No file loads unless its case is asked.

## Pick the case

| The user wants to… | Load |
|---|---|
| Set up or change the project's voice and look (`DESIGN.md`) | `references/setup.md` |
| Build a new page, screen or app | `references/new-ui.md` |
| Build, fix or restyle a component | `references/components.md` |
| Change the look as a whole: tokens, radius, shadows | `references/visual.md` |
| Fonts, text size, wrapping, numbers | `references/typography.md` |
| Colours, contrast, a palette, dark mode | `references/colors.md` |
| Spacing, alignment, grouping, density | `references/layout.md` |
| Animations and micro-interactions | `references/motion.md` |
| Write or translate text in the product: buttons, errors, empty states, tooltips, emails, notifications | `references/copy-app.md` |
| Write a landing page, a store listing or release notes | `references/copy-pages.md` |
| Review existing text: "sounds like AI", "too formal", "check the translations" | `references/review-copy.md` |
| Critique a screen: "looks bad", "looks AI-made", "feels off" | `references/review-ui.md` |
| Review a branch or a pull request | `references/review-branch.md` |
| Check or fix accessibility: keyboard, screen reader, WCAG, RGAA | `references/accessibility.md` |
| Polish the details of a screen that works | `references/details.md` |
| Make something bolder, calmer or simpler | `references/emphasis.md` |
| Stress-test or harden a component against every state and edge case | `references/stress-test.md` |
| See options or variants to compare | `references/variants.md` |
| Extract shared components or tokens | `references/extract.md` |
| Adapt a screen to phone, tablet, desktop, touch or another platform | `references/adapt.md` |
| Make a slow or janky screen faster | `references/performance.md` |
| First launch, onboarding, hints, a tour | `references/onboarding.md` |
| A moment of delight | `references/delight.md` |
| An ambitious visual effect | `references/effects.md` |
| Explain how an interface or an effect was built | `references/explain-ui.md` |

A request that mixes cases starts with the one that decides the others: a new screen at
`new-ui.md`; text and screens together at `review-ui.md`, which holds the single report.

Resources, loaded by the files above, never on their own:

- `references/words-<lang>.md` (`fr`, `en`, `es`, `de`, `ja`, `zh`) and `references/words-any.md`
  for other languages: lexicon and typography. Load the file of each language you write.
- `references/states.md`: what each state shows and says.
- `references/ai-look.md`: the dated list of generic AI visual choices.

If no case fits, say so and ask. Do not improvise from this page.

## Requirements

Paths under `scripts/` and `assets/` are relative to this skill's directory; call the scanner by
its full path from the project root: `node <skill dir>/scripts/scan.mjs`. Commands are POSIX
shell (Git Bash on Windows). Scratch output goes to the session's scratch folder.

- `scripts/scan.mjs` needs Node 18 or later. Check `node --version` first; without Node, say so
  and review by reading.
- Screenshots need a way to run the UI. Optional.
- `npx react-doctor@latest design --verbose` and `npx playwright` download packages or browsers:
  ask before the first run.

## Rules that hold in every case

**Read the design file first.** `DESIGN.md` (and `VOICE.md` when setup put the voice there), or a
style guide that states the voice and the look. `PRODUCT.md` describes the product; a voice or
look decision it records with a reason counts. No design file: run `references/setup.md` first.
Questions come at the start, never mid-build; when nobody can answer, they go at the end of the
report with a recommended answer, and nothing waits.

**Words people say out loud, in every language.** The words of `DESIGN.md`, one per concept,
everywhere. A sentence that would sound odd said to a colleague gets rewritten.

**No default look.** Every visual choice comes from `DESIGN.md` or from options the user picked.

**Never invent.** No user counts, ratings, testimonials, logos, prices or features the project
does not state.

**Stay in the frame.** Change what the request names, reuse the project's components and tokens,
and stop where the loaded file says.

**Show it, once.** A screenshot of the real render or the scan before and after; one proof per
change. If the project forbids running the app, say what was not observed.
