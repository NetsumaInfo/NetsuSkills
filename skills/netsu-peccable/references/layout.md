# Layout: grouping, alignment, spacing, responsive

Fix how a screen is arranged. Load this only when the user asks about spacing, alignment,
grouping, density or reading order, or how a screen holds at the widths it already supports. A
new device or input is `references/adapt.md`; polishing a finished screen is
`references/details.md`; a new screen starts at `references/new-ui.md`, which uses this file.

## 0. Frame

| | |
|---|---|
| Changes | Spacing, alignment, grid, order and breakpoints of the region the request names |
| Never changes | Colours, fonts, wording, component behaviour. Density only when the user asks (§4) |
| Asks first | Nothing. A new structure for a whole screen goes to `references/new-ui.md` step 4 |
| Stops when | Every finding of §2 is fixed or reported, at every width the product supports |
| Returns | The findings table of §6 and the proof |

## 1. Read

1. `## Product` (platforms) and `## Look` (density, spacing scale).
2. The supported widths: the viewport list for web; smallest and default window size for a
   desktop app; the panel widths for an extension side panel or a CEP panel.
3. Arbitrary spacing and physical properties:

```bash
grep -rnoE '\b(p|px|py|pt|pb|pl|pr|m|mx|my|mt|mb|ml|mr|gap|space-[xy])-\[[^]]+\]' src --include='*.tsx' --include='*.jsx' | head -40
grep -rnE '\b(ml|mr|pl|pr|left|right)-[0-9]|margin-(left|right)|padding-(left|right)' src --include='*.tsx' --include='*.jsx' --include='*.css' | head -40
```

## 2. Check, in this order

1. **Groups by space.** Tight inside a group, at least twice as wide between groups (house rule,
   Krehel, github.com/jakubkrehel/skills, `better-layout`, read 2026-09-17), more above a
   heading than below it. Space first, a background second, a line last. One gap repeated
   everywhere flattens the page.
2. **Scale.** A 4/8 scale: 4, 8, 12, 16, 24, 32, 48, 64 (Tailwind v4 `1 2 3 4 6 8 12 16`). No
   `p-[13px]`.
3. **Edges.** Elements share alignment edges; every stray edge is a finding. One indent step per
   level.
4. **Order.** The thing the user came for comes first; DOM order matches visual order (keyboard
   and screen readers follow the DOM).
5. **Controls look like controls.** A static badge shaped like a button, or a button that looks
   like plain text, is a finding.
6. **Hidden content has a cue.** A scroller shows part of the next item or a control; "Show 12
   more" rather than "More".
7. **Direction.** Logical properties (`ms-`, `pe-`, `margin-inline-start`) in any layout that may
   be translated into a right-to-left language (`references/words-any.md`).
8. **Growth.** No fixed width or height on a text container; rows wrap. Check with the French
   strings, or English lengthened by 35% (`references/copy-app.md` §4).
9. **Critical actions stay reachable.** A primary action is never where resizing or scrolling
   clips it: a scrolling dialog keeps its action row; a pane keeps its main button in view.
10. **Sticky and stacked layers.** A sticky bar never hides the focused element
    (`scroll-padding-top`, WCAG 2.2 SC 2.4.11, read 2026-09-17). Full-height layouts use
    `100dvh`; fixed bars add `env(safe-area-inset-*)`. One z-index scale in tokens (base,
    sticky, dropdown, overlay, toast); no `z-[9999]`.
11. **Adapting to size.** Breakpoints come from the content, not from device presets: keep the
    wide layout while it fits. A component in a side panel, a split view or a resizable window
    uses container queries (`@container`); viewport breakpoints are for the page shell. CEP
    panels have none (`references/visual.md` §6).
12. **Reflow.** At 320 px wide and at 200% zoom nothing needs sideways scrolling, except tables
    and canvases (WCAG 2.2 SC 1.4.10, read 2026-09-17).

## 3. Patterns

Product UI uses what users already know; the table is in `references/new-ui.md` §5 (tabs,
sidebar, table, side panel, settings list). A different pattern for an existing screen is a
redesign: `references/new-ui.md`.

## 4. Density, only on request

Density is a `## Look` choice, applied through tokens:

| Token | Compact | Comfortable |
|---|---|---|
| Control height | 28 to 32 px | 36 to 40 px |
| Table row | 32 px | 44 to 48 px |
| Body text | 13 to 14 px | 15 to 16 px |
| Gap inside a group | 4 to 8 px | 8 to 12 px |

Declare them in `@theme` (`--spacing-control: 2rem;` gives `h-control`). Touch screens keep 44 pt
(iOS) or 48 dp (Android) targets at any density.

## 5. Fix

1. Tokens and shared layout components first; then the instances.
2. One change per finding; no new structure under the name of spacing.
3. Everything outside layout goes in the report for its own file.

## 6. Report and proof

```markdown
## Layout: <scope>

Widths checked: 320, 375, 768, 1280 px | window 900×600 and 1440×900 | code-only

| Severity | Where | Now | After | Rule |
|---|---|---|---|---|
| P1 | `export-dialog.tsx:30` | Export button clipped at 375 px | Action row outside the scroll area | §2.9 |
```

Severity follows `references/review-ui.md` §6: an action or content that cannot be reached at a
supported size is P0 or P1; broken order or grouping P2; stray edges and spacing P3. Proof: one
capture per supported width before and after, the same widths, emulated rather than a resized
window (`references/new-ui.md` §8).

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Borders between every row and section | Space first, lines only where space is not enough |
| `gap-4` everywhere | Tight inside a group, twice as wide between groups |
| `ml-2` in a translated app | `ms-2` |
| Breakpoints at 768 and 1024 because they are the defaults | Where the content stops fitting |
| A component that reads the viewport inside a resizable panel | `@container` |
| `w-[120px]` on a button label | Width from the content |
| Save button below the fold of a long dialog | A fixed action row |
| "Improves the layout" by moving every section | One change per finding |
