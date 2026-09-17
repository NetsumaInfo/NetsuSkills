# Typography: fonts, sizes, wrapping, numbers

Fix or set how text is drawn. Load this only when the user asks about fonts, text size, line
height, wrapping, truncation or numbers. The words themselves belong to `references/copy-app.md`,
and punctuation per language to `references/words-<lang>.md`.

## 0. Frame

| | |
|---|---|
| Changes | Type tokens (families, sizes, weights, line heights) and the classes on the text the request names |
| Never changes | Colours, spacing between elements, layout structure, wording. A new font only when the user asks for one (§3) |
| Asks first | Nothing, unless §3 applies and `## Look` is silent |
| Stops when | Every finding of §2 is fixed or reported, once. No second pass for taste |
| Returns | The findings table of §6 and the proof |

## 1. Read

1. `## Look` in `DESIGN.md`: the `Fonts:` line and its reason.
2. The token file (`@theme`, `tailwind.config.*`, `theme.ts`) and where fonts load:

```bash
grep -rnE "font-family|--font-|font-\[|@fontsource|fonts\.googleapis|@font-face" src index.html package.json 2>/dev/null
grep -rhoE 'text-(xs|sm|base|lg|[2-9]?xl|\[[^]]+\])|font-(thin|extralight|light|normal|medium|semibold|bold)|leading-[a-z0-9[\].]+|tracking-[a-z0-9[\].-]+' src --include='*.tsx' --include='*.jsx' | sort | uniq -c | sort -rn | head -30
node <skill dir>/scripts/scan.mjs ui <files>
```

The `ui` scan reports `default-font`, `font-tag`, `justify` and `root-no-select` here.

## 2. Check, in this order

Each line that fails is one finding, with every place it occurs.

1. **Families.** Two at most; one is often right for product UI. Each comes from `## Look`.
2. **Scale.** A ratio of about 1.2 for dense UI, 1.25 to 1.333 for content pages. Values off the
   scale (`text-[13px]`) are findings.

| Ratio | Steps in px (base in bold) |
|---|---|
| 1.2 from 14 | 12, **14**, 17, 20, 24, 29 |
| 1.25 from 16 | 13, **16**, 20, 25, 31, 39 |

3. **Sizes.** UI body 14 to 16 px (13 to 14 px in a compact tool, `references/layout.md` §4),
   captions not under 12 px, reading text from 16 px. Mobile
   inputs at 16 px (`references/components.md`). Heading sizes descend with the level: a child
   heading never outweighs its parent.
4. **Weights.** Below 18 px, 400 or heavier; thin weights are for large display text only
   (house rule from Krehel, github.com/jakubkrehel/skills, `better-typography`, read
   2026-09-17). Emphasis by weight or size, never by gradient text or one italic serif word.
5. **Line height.** About 1.5 for body, 1.1 to 1.25 for headings, unitless. Text that wraps to
   three lines or more gets at least 1.4, even in a tight row (same source).
6. **Tracking.** Negative only on large headings, never past -0.04em. Tracked small capitals
   above a heading are the eyebrow pattern of `references/ai-look.md`: only if `## Look` says so.
7. **Measure.** 60 to 75 characters for reading text (`max-w-[65ch]`). Tables and dense panels
   may run wider.
8. **Wrapping.** `text-wrap: balance` on headings, `pretty` on descriptions, neither on long
   text. Paths, URLs, IDs and German compounds wrap with `overflow-wrap: anywhere` or truncate
   with the full value reachable; the flex child holding them gets `min-width: 0`. Badges and
   short labels get `white-space: nowrap`.
9. **Truncation.** One line: ellipsis; several: `line-clamp`. The full value stays reachable (a
   tooltip, an expand, a detail view).
10. **Numbers.** Values that change or line up (counters, prices, timecodes, sizes) use
    `font-variant-numeric: tabular-nums`; IDs and codes add `slashed-zero`.
11. **Alignment.** Start-aligned. Never justified: it opens uneven gaps (WCAG 2.2 SC 1.4.8,
    AAA, read 2026-09-17).
12. **Selection.** Text stays selectable. `user-select: none` only on toolbars, tabs and drag
    regions.
13. **Direction.** `lang` on the root and on any passage in another language; `dir` where the
    direction changes; user text in `<bdi>` (`references/words-any.md`, right-to-left).
14. **Zoom.** Sizes in `rem`; never `user-scalable=no` or `maximum-scale=1`. Text zoomed to 200%
    still fits (WCAG 2.2 SC 1.4.4, read 2026-09-17). React Native keeps `allowFontScaling`.

## 3. A new font, only on request

- The user names one: apply it and write it into `## Look`.
- The user asks you to choose: run the direction step of `references/new-ui.md` (step 4) for
  the type row only, and ask once. Never pick silently, never fall back on the model's usual
  faces (`references/ai-look.md`, Type).
- A system stack is a valid choice for a tool that must match its host or work offline; record
  it with its reason.

## 4. Load it properly

- Self-hosted `woff2` (`@fontsource/<name>`, or local `@font-face` files), `font-display: swap`.
- Load every weight and style the tokens use: a missing face is faked by the browser. Set
  `font-synthesis: none` only after checking every bold and italic still shows.
- Properties, not raw tags: `font-weight: 650`, `font-optical-sizing: auto`,
  `font-variant-numeric: tabular-nums` rather than `font-variation-settings` or
  `font-feature-settings` (MDN, *font-feature-settings*, read 2026-09-17). Raw tags only for a
  custom axis or a stylistic set with no property.

## 5. Fix

1. Fix a token before an instance: one wrong size in twelve places is one token change.
2. Replace arbitrary values with scale steps; delete the arbitrary value.
3. Change nothing the request did not name. A colour or spacing problem goes in the report for
   `references/colors.md` or `references/layout.md`.

## 6. Report and proof

Written in the user's language:

```markdown
## Typography: <scope>

| Severity | Where | Now | After | Rule |
|---|---|---|---|---|
| P1 | `export-list.tsx:42` | File name clipped, no way to read it | `truncate` + `title` with the full name | §2.9 |
```

Severity follows `references/review-ui.md` §6: text that cannot be read or content that cannot
be recovered is P1; a broken scale or hierarchy P2; the rest P3.

Proof, proportionate to the change: the `ui` scan with zero `block` on the changed files; one
capture at 375 px and one at desktop width with the French strings; 200% zoom when sizes
changed. Code-only: say so.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Swaps the font because it looks generic | Keeps `## Look`; a new font only on request |
| `text-[13px]`, `text-[15px]`, `text-[17px]` | Three scale steps |
| `font-light` on 13 px table text | 400 or heavier under 18 px |
| `leading-none` on a three-line description | 1.4 or more |
| A long path pushing the panel wider | `overflow-wrap: anywhere` or truncation with `min-w-0` |
| `font-feature-settings: "tnum"` | `font-variant-numeric: tabular-nums` |
| `select-none` on the body of a desktop app | Selectable text; `select-none` on chrome only |
| Fixes the colours while it is there | Reports them for `colors.md` |
