# The generic AI look

Checked 2026-09-16, Impeccable rows added 2026-09-17; re-check every six months (next: 2027-03).

A resource. `references/new-ui.md` loads it before proposing directions, and a review loads it
before judging a screen. Use it to recognise a default, never to choose a look.

## Why this list ages

- Models pick the statistically safe choice. Anthropic calls it distributional convergence:
  "safe design choices [...] dominate web training data" (claude.com blog, "Improving frontend
  design through skills", 2025-11-12).
- The fix becomes the next cliché. Tailwind's demos used `bg-indigo-500`, and generated UIs went
  purple (prg.sh, 2025-10-26). Prompts said "avoid purple", and the output moved to cream,
  serif and terracotta, which Anthropic's own frontend-design skill now lists as generic
  (github.com/anthropics/claude-code, `plugins/frontend-design`, updated 2026-09-02).
- Negative instructions move the model to another fixed palette rather than producing variety
  (Claude Sonnet 5 prompting docs, "Design and frontend defaults", platform.claude.com, read
  2026-09-16).
- Even neutrals flip. React Doctor retired a rule against pure black backgrounds, while
  Anthropic flags tinted near-black `#0B0B0B` and `#111` as the default. No value is safe on
  its own; only a recorded reason is.
- Ban lists age; explicit choices do not. React Doctor 0.9.14 retired 12 taste rules, noting
  that visual and writing preferences "belong in an explicit design guide" (npm package, checked
  2026-09-16). Retired: purple page gradient, warm page surface, full-viewport centred hero, hero
  eyebrow chip, icon tile above a heading, italic serif display heading, monotonous page
  spacing, numbered section markers, pure black background, common root font, em dash in JSX
  text, three-period ellipsis. That guide is `DESIGN.md`.

Consequences:

- Never answer a row with its opposite. The opposite of a row is usually the next row.
- A look joins this file when it shows up in two unrelated generated projects with no reason in
  their brief. Add it with a public source and a date, and delete rows no source mentions any
  more at the six-month check.

## Allowed when

A choice from the tables is not slop when `## Look` records it on purpose, with a reason tied to
this product: its brand, its platform, its users.

| Recorded reason | Verdict |
|---|---|
| "Accent #4F46E5: the logo colour since 2019, on every invoice and the sign" | Allowed |
| "System font stack: the panel must match the host app it lives in" | Allowed |
| "Inter, because it is clean and modern" | Not a reason: it fits any product |
| "Inter (in use, no recorded reason)", written by setup from the code | The current state: a P3 question to the user, not a finding |
| Nothing recorded | A default. Answer the question in the last column |

`scripts/scan.mjs ui` reports these as `check`. On a recorded choice, keep the finding with one
line citing `## Look`. Read each finding in context; the scanner is a regex heuristic.

## Sources

| Short name | Source |
|---|---|
| Krebs | Adrian Krebs, "design slop", adriankrebs.ch/blog/design-slop, 2026-04-20. 1,590 Show HN pages scored on 16 patterns: 22% heavy (4 or more), 32% mild (2 or 3), 46% clean |
| Anthropic | frontend-design skill, anthropics/claude-code, updated 2026-09-02 |
| Sonnet 5 docs | platform.claude.com, "Prompting Claude Sonnet 5", read 2026-09-16 |
| React Doctor | react-doctor 0.9.14, retired design rules, checked 2026-09-16 |
| prg.sh | "Why Your AI Keeps Building the Same Purple Gradient Website", 2025-10-26 |
| Impeccable | impeccable skill 4.1.1, github.com/pbakaus/impeccable, read 2026-09-17: detector rules in `scripts/`, and `reference/craft-floor.md` for the offset shadow |

## Type

| Tell | Source, date | `scan ui` | Decide instead |
|---|---|---|---|
| Inter for everything, above all a centred hero headline | Krebs 2026-04-20; Sonnet 5 docs 2026-09-16 | `default-font` | What do users read here: dense data, long text, a small panel? Which face serves that? |
| Space Grotesk, Instrument Serif or Geist as the pairing | Krebs 2026-04-20 | `default-font` | Is this pairing tied to the product, or just the current favourite? |
| One italic serif word inside a sans headline | Krebs 2026-04-20; Anthropic 2026-09-02; React Doctor (`no-italic-serif-display-heading`) | none | Does one word need emphasis? Would order or weight carry it? |
| High-contrast serif display on a warm off-white page | Anthropic 2026-09-02 | none | Is this product read like a publication? |
| Monospace for small data labels, as a "technical" costume | Anthropic 2026-09-02 | none | Is it code, data or a measurement? Otherwise the UI face with tabular numerals |
| A generic root font nobody picked | React Doctor (`no-common-root-font`) | `default-font` | Was it chosen? A native desktop tool may choose the system stack on purpose |

## Colour

| Tell | Source, date | `scan ui` | Decide instead |
|---|---|---|---|
| Purple, violet or indigo accent and gradients ("VibeCode purple") | Krebs 2026-04-20; prg.sh 2025-10-26; React Doctor (`no-default-purple-page-gradient`) | `purple-gradient` | Which hue does this product own, and where does it come from? |
| Gradients on everything, gradient text | Krebs 2026-04-20 | `gradient-text` | Which single element deserves emphasis, and can weight or size give it? |
| Permanent dark mode with medium-grey body text | Krebs 2026-04-20 | none | Where and under what light is it used? Does body text reach 4.5:1? |
| Warm cream near `#F4F1EA`, serif display, terracotta near `#D97757` | Anthropic 2026-09-02; React Doctor (`no-default-warm-page-surface`) | none | What in the product's world is warm, if anything? |
| Near-black with one acid-green or vermilion accent | Anthropic 2026-09-02 | none | Is the dark theme for the users' environment, or for the screenshot? |
| Tinted near-black (`#0B0B0B`, `#111`) standing in for black | Anthropic 2026-09-02 | none | Which dark, derived from which hue, at what lightness? |
| Pure black page | React Doctor (`no-pure-black-background`) | none | OLED or video review is a reason: record it |
| Large coloured glows and coloured shadows | Krebs 2026-04-20 | `glow` | What is the elevation system? |

## Layout

| Tell | Source, date | `scan ui` | Decide instead |
|---|---|---|---|
| Full-viewport centred hero in a generic sans | Krebs 2026-04-20; React Doctor (`no-full-viewport-centered-hero`) | `centered-hero` | What must a visitor see first to decide? |
| Badge or pill above the H1 | Krebs 2026-04-20; React Doctor (`no-hero-eyebrow-chip`) | `eyebrow-label` | Is there real news? Then it belongs in the content |
| Hero over three feature boxes, then testimonials and a CTA | prg.sh 2025-10-26 (purple gradients, three-box layouts) | none | Which sections does the real material support? |
| Identical feature cards with an icon on top | Krebs 2026-04-20; React Doctor (`no-icon-tile-heading-stack`) | none | Are the items parallel? Would a list, a table or one screenshot say more? |
| Numbered 1-2-3 steps | Krebs 2026-04-20; React Doctor (`no-numbered-section-markers`) | none | Is the order real, and does the user follow it? |
| A row of big stat numbers | Krebs 2026-04-20 | none | Are the numbers real, sourced, and the user's question? |
| Broadsheet: hairline rules, zero radius, dense newspaper columns | Anthropic 2026-09-02 | none | Is the product read like a newspaper? |
| One spacing value repeated through the page | React Doctor (`no-monotonous-page-spacing`) | none | Which items belong together? Tight inside, wide between |
| KPI card grid as the first thing in an app; a hero inside a dashboard | netsu-peccable, 2026-09-16 | none | What is the user's first question on this screen? |

## Surfaces

| Tell | Source, date | `scan ui` | Decide instead |
|---|---|---|---|
| Content cut into identical rounded cards, one radius on everything, the same soft grey shadow `rgba(0,0,0,.1)` | Anthropic 2026-09-02 | `big-radius`, `heavy-shadow` | Does this content need a container? Which elevation level is it? |
| Coloured top or left border on cards | Krebs 2026-04-20 | `side-accent-border` | What status does the colour encode, and does text say it too? |
| Glassmorphism: blurred translucent panels | Krebs 2026-04-20 | `glass` | Is there content behind worth seeing? A dialog backdrop is the usual yes |
| A 1 px border under a wide soft shadow | netsu-peccable, 2026-09-16 | `heavy-shadow` | Border or shadow: which one is the level? (`references/visual.md`) |
| Cards inside cards | netsu-peccable, 2026-09-16 | none | Can spacing or a divider do the grouping? |
| Hard offset shadow (`4px 4px 0` in a solid colour) as the house style | Impeccable 2026-09-17 | none | Is the page really in that idiom, or borrowing it? |

## Decoration, icons and labels

| Tell | Source, date | `scan ui` | Decide instead |
|---|---|---|---|
| Emoji as icons in navigation, features or headings | Krebs 2026-04-20 | `emoji-icon` | Which icon library, which size and stroke? |
| Two or more icon libraries | netsu-peccable, 2026-09-16 | `icon-libs` | Which one stays? |
| Tracked ALL-CAPS eyebrow label above every heading | Anthropic 2026-09-02; Krebs 2026-04-20 | `eyebrow-label` | Does the heading need a label at all? |
| Meta strings joined with middle dots (`A · B · C`) | Anthropic 2026-09-02 | none | Separate fields, a table, or fewer facts? |
| Labels built as `WORD — fragment` | Anthropic 2026-09-02 | none | What is the label's one job? Write that |
| `→` appended to link and button text | Anthropic 2026-09-02 | none | Does the verb already say where it goes? |
| Hand-drawn SVG people, scenes or blobs | netsu-peccable, 2026-09-16 | none | The real asset, or a labelled placeholder |
| Idle pulse or bounce on a call to action | netsu-peccable, 2026-09-16 | `bounce-pulse` | What changed that needs attention? (`references/motion.md`) |
| Radial glow or spotlight behind the hero | Impeccable 2026-09-17 | `radial-glow` | What should the eye land on? Size and contrast can do it |
| Grid, dot or stripe pattern as the page background | Impeccable 2026-09-17 | none | Does the pattern mean anything here? |
| A pulsing dot or fake cursor to say "live" | Impeccable 2026-09-17 | `bounce-pulse` | Is it live? Then say what updates, in text |
| A marquee of logos or words | Impeccable 2026-09-17 | none | Are the logos real customers? It needs a pause control (`references/motion.md`) |

## Generic copy inside layouts

The layout tells above usually arrive with filler text. Fix the words with
`references/copy-pages.md`, then decide whether the block survives.

| Block | Typical filler | Keep only if |
|---|---|---|
| Eyebrow | "FEATURES", "HOW IT WORKS", "WHY US" | Never as decoration. The heading says it |
| Stat row | "10,000+ teams", "99.9% uptime", "4.9/5" | The project states the number and its source (`invented-number` in `scripts/scan.mjs copy`) |
| 1-2-3 steps | "Sign up. Connect. Ship." | The real onboarding has exactly those steps |
| Testimonials, logo wall | "Jane D., CEO at Acme" | A real person or company agreed to it (`placeholder-persona`) |
| Section header | "Clarity without the clutter" | It states a fact about the product a user can check |

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Swaps purple for cream and terracotta and calls it fixed | Directions from `## Product`, the pick recorded in `## Look` |
| Treats every row as a ban and removes a brand colour | Checks `## Look` first; a recorded reason stands |
| "Clean, modern, minimal" as the answer to a row | The row's question, answered for this product |
| Uses this file to pick a look | Uses it to reject defaults in proposed directions |
| Silences a scan `check` without reading it | Reads it in context; keeps it only with a `## Look` citation |
| Keeps a row nobody has cited for a year | Re-checks sources every six months, dates the file |
