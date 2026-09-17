# Variants: options to compare, on request

Build two to five versions of one piece of UI on the real page, behind a switcher, so the user
can flip between them and choose. Load this only when the user asks to see options, variants or
alternatives ("show me a few versions", "je veux comparer"). It produces candidates; the user
decides.

## 0. Frame

| | |
|---|---|
| Changes | One piece of UI (a card, a toolbar, a dialog), its variants and a temporary switcher |
| Never changes | The rest of the page, the shared tokens (a variant uses local values until chosen), the data. No variant ships until the user picks one |
| Asks first | Which piece, when the request names a whole screen; the axis, when the request gives none and `## Look` does not settle it |
| Stops when | The variants are built, checked against the floor of §3, and the table of §5 is written |
| Returns | The links (`?variant=…`), the table of §5, and after the choice the cleaned-up code |

Adapted from Krehel's `variant` (github.com/jakubkrehel/skills, read 2026-09-17) and impeccable's
`live` mode (github.com/pbakaus/impeccable, read 2026-09-17).

## 1. One piece, one axis

Write the brief in one sentence: what the piece is, where it renders, what it must do. Then pick
one axis and give each variant a different position on it:

| Axis | What varies | Rules from |
|---|---|---|
| Structure | Grouping, order, columns, what collapses | `references/layout.md` |
| Density | Spacing, control height, how much fits | `references/layout.md` §4 |
| Emphasis | Where the accent goes, what recedes | `references/emphasis.md` |
| Type | Scale steps, weight contrast, measure | `references/typography.md` |
| Wording | Labels, tone, how much text | `references/copy-app.md` |

Three variants by default, five at most. Name each by its direction ("Compact", "Editorial",
"Quiet"), never "Option A". Variants that differ only by accent colour teach nothing: change the
axis.

## 2. Build on the real page

- Read the tokens, the component library and the neighbours first: every variant must look like
  it could ship tomorrow, inside `## Look`. A variant that needs a new font or palette says so and
  waits for `references/typography.md` or `references/colors.md`.
- Host them where the piece will live, with real content: product-shaped text, plausible names,
  the real number of items.
- Select with a URL parameter (`?variant=compact`), one variant at a time, full size.
- The switcher is plain and temporary: outside the design system, fixed in a corner, arrow keys
  to move, `aria-current` on the active one, instant switching. A page that cannot host it gets
  one self-contained HTML file with the same switcher.

## 3. The floor every variant clears

Every variant has accessible names, full keyboard access, visible focus, the contrast of
`references/colors.md` §2, no clipping at the supported widths, and the states of
`references/states.md`. A direction that only works by breaking this floor is dropped, and the
report says why.

## 4. Look once

Open each link once in the browser tool, if the project may run, at one mobile and one desktop
width. Code-only: hand over the links and say they were not opened.

## 5. Report

```markdown
## Variants: <piece>

Axis: density · Page: http://localhost:5173/exports?variant=compact

| Variant | Right when | Costs |
|---|---|---|
| Compact | Editors scanning 200 clips a day | Smaller targets; 13 px text |
| Comfortable | Occasional use, touch screens | 40% fewer rows per screen |
| Split | Details needed while scrolling | Needs 1,100 px or more |
```

No favourite, no score. The user picks.

## 6. After the choice

1. Build the chosen variant properly, through the file that owns its axis.
2. Delete the other variants, the switcher and the URL parameter handling.
3. Record the decision in `## Look` when it changes the look (density, emphasis).
4. Show the final capture and the diff that removed the rest.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Three variants in three accent colours | Three positions on one axis |
| Variants varying on everything at once | One axis, so the choice teaches something |
| Thumbnails side by side | One full-size variant at a time, on the real page |
| Lorem ipsum and three rows | Real content, real quantities |
| "I recommend B" | The table; the user decides |
| Variants left in the code after the choice | Deleted, with the switcher |
| Variants built unasked, on every task | Only when the user asks to compare |
