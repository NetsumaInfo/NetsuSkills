# Components: build, fix or restyle

Build a component, repair one, or change how one looks. The order is fixed: contract, semantics,
style, text, proof. Script paths are relative to this skill's directory.

## 1. Read the design file

Read `## Components` and `## Look` in `DESIGN.md`. No design file: run `references/setup.md`
first. A value this file gives as a fallback never overrides one the design file states.

## 2. Find what exists

```bash
ls components.json src/components/ui 2>/dev/null
grep -rlE "from ['\"](lucide-react|react-icons|@heroicons|@tabler/icons-react|@phosphor-icons|@radix-ui/react-icons)" src | head
grep -rnE "@theme|--color-|--radius" src --include=*.css | head -20
grep -rlE "<(Button|Dialog|Select|Table)\b" src --include=*.tsx | head
```

- A component with the same job exists: add a variant or a prop to it. Never a second `Button`.
- shadcn/ui is set up (`components.json`): add the missing primitive with the project's shadcn
  CLI, then compose. Its `Button` has no `isLoading`; loading is `Spinner` + `aria-disabled`,
  with the click ignored in the handler (a `disabled` button drops keyboard focus, see Button).
- Icons come from the library already imported. Never add a second one (React Doctor
  `no-mixed-icon-libraries`). No emoji as an icon or heading decoration
  (`no-emoji-heading-decoration`).
- Colors, radius and shadows come from the tokens the grep found (Tailwind v4: `@theme`).

## 3. Write the contract before the code

Load `references/states.md`. Fill this in the reply or at the top of the story, then build it:

```md
### <ComponentName>
Does: <what the user gets, one sentence>
Props: <name: type = default>, <…>
Sizes: <sm 32 px, md 36 px, lg 40 px>
States: default, hover, focus-visible, active, disabled (reason shown: <…>), loading, error,
        empty (holds data), success (after an action)
Keys: <Tab reaches it, Enter/Space activates, Escape closes, arrows move>
Extremes: long French label, empty, 1,000 items, 12 345 678,90 €
Out of scope: <what it does not do>
```

| Extreme | Fixture | Must hold |
|---|---|---|
| Long French | "Enregistrer les modifications" for "Save changes". French runs 15 to 35% longer than English (Crowdin, LocaleProof, 2026) | No overflow, no button on two lines, truncated text still readable in full |
| Empty | `""`, `[]`, `null`, no avatar | An empty state, never a blank box |
| Many | 1,000 rows, 50 options | Virtualized or paginated, the total shown, search above ~10 options |
| Large numbers | `1234567.89` through `Intl.NumberFormat` | `tabular-nums`, no clipping, locale separators |
| Unbreakable | A 60-character path, `Donaudampfschifffahrtsgesellschaft` | Wraps or truncates with the full value reachable; `min-w-0` on the flex child |
| Scripts | An emoji, an Arabic name in a French sentence, Vietnamese or Thai marks | No clipped marks; user text in `<bdi>` or `dir="auto"` |
| Width | The component in 320 px and 480 px boxes on the states page | Nothing overflows its box |

## 4. Semantics and keyboard

Native element first. A `div` with `onClick` has no focus, no Enter or Space, and no role.

| Job | Element |
|---|---|
| Do something | `<button type="button">` |
| Go somewhere | `<a href>` |
| One of 2 to 7 visible choices | radio group, or a toggle group |
| One of many | `<select>`, or a combobox when it needs search |
| On/off | checkbox, or `<button role="switch" aria-checked>` |
| Show/hide a section | `<details>`, or a button with `aria-expanded` |
| Modal task | `<dialog>`, or the library's Dialog |

Keys (WAI-ARIA APG patterns, read 2026-09-16):

| Widget | Keys |
|---|---|
| Button | Enter, Space |
| Dialog | Focus moves inside on open; Tab and Shift+Tab stay inside; Escape closes; focus returns to the trigger |
| Menu button | Enter, Space or Down opens on the first item; arrows, Home, End move; Escape closes and returns focus |
| Tabs | Left and Right move between tabs; Tab leaves the tab list for the panel |
| Listbox, combobox | Up and Down move the active option; Enter selects; Escape closes |

- After an item is removed, move focus to the next item or the list heading, never to `body`.
- ARIA only where HTML falls short: `aria-expanded`, `aria-invalid` + `aria-describedby`,
  `aria-busy`, `aria-live`. No `role="button"` where a `<button>` fits.
- **Target size.** WCAG 2.2 SC 2.5.8 (AA): at least 24×24 CSS px, or spaced so a 24 px circle
  on each target touches no other. SC 2.5.5 (AAA): 44×44 CSS px. Apple HIG Buttons: a hit region
  of at least 44×44 pt. Android (Material): 48×48 dp, 8 dp apart. All read 2026-09-16. Web
  desktop floor 24 px; touch (React Native, mobile web) 44 pt iOS, 48 dp Android. Grow the hit
  area with padding or a pseudo-element; the icon stays 16 to 20 px (React Doctor
  `no-undersized-icon-button`).
- **Icon-only buttons** get `aria-label` (React Native: `accessibilityLabel`) in the UI language,
  with the same verb as the tooltip. A tooltip is not a name.
- **Never reveal an action only on hover.** Tailwind v4 applies `hover:` only under
  `@media (hover: hover)` (upgrade guide, read 2026-09-16), so `opacity-0 group-hover:opacity-100`
  is invisible forever on a touch screen (React Doctor `no-hover-only-reveal`):

```tsx
// Before
<div className="opacity-0 group-hover:opacity-100">
// After
<div className="opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
```

- **Every drag has another way.** Reorder, move and resize also work with buttons or the keyboard
  (WCAG 2.2 SC 2.5.7, read 2026-09-17), and a swipe action also sits in a menu.

## 5. Style

- Tokens only: `bg-primary`, `var(--color-accent)`. No hex, no `bg-indigo-500`, no
  `rounded-[20px]` in a component.
- Radius and shadow from `## Look`. Nested surfaces: outer radius = inner radius + padding.
- A focus ring drawn only with `box-shadow` or `ring-*` disappears in Windows high contrast
  (`forced-colors: active`). Keep a transparent outline on focus: Tailwind v4
  `focus-visible:outline-hidden` (its `outline-none` removes the outline for good), Tailwind v3
  `focus-visible:outline-none`, plain CSS `outline: 2px solid transparent` (Tailwind upgrade
  guide, read 2026-09-17).
- Load `references/ai-look.md` before choosing anything visual.
- Name the transitioned properties: `transition-colors`, `transition-[opacity,transform]`.
  Never `transition-all` or `transition: all`.
- `tabular-nums` on every number that changes or lines up: tables, counters, timers, prices
  (React Doctor `prefer-tabular-numeric-data`).
- A loading button keeps its label and its width, and blocks a second click (React Doctor
  `loading-action-preserves-trigger`):

```tsx
<Button
  aria-disabled={pending}
  aria-busy={pending}
  onClick={() => { if (!pending) save(); }}
  className="aria-disabled:cursor-progress aria-disabled:opacity-70"
>
  {pending ? <Spinner data-icon="inline-start" aria-hidden /> : <Save data-icon="inline-start" />}
  Enregistrer
</Button>
```

No icon: reserve the spinner's slot, or overlay the spinner and keep the label in place.

- Menus, selects, popovers and tooltips render in a portal, a `<dialog>`, or the popover API.
  Inside an `overflow: hidden` or `overflow: auto` parent, an absolute dropdown gets clipped.
- Old engines: CEP 11 embeds Chromium 88 and CEP 12 Chromium 99 (Adobe CEP-Resources); the
  `popover` attribute needs Chromium 114 and Tailwind v4 targets Chrome 111+ (tailwindcss.com).
  All read 2026-09-16. In a CEP panel, use a portal. Tauri renders with the OS webview.

When `DESIGN.md` is silent, use these **fallbacks**, and write the value you picked back into
`## Look`. They are a floor for product UI, not a taste:

| Property | Fallback |
|---|---|
| Control height | 32 to 40 px dense, 40 to 48 px comfortable; touch follows the target sizes above |
| Control radius | 8 to 10 px at most; panels and cards 12 px at most |
| Shadow | None on inline surfaces; one level on overlays (menu, popover, dialog, toast) |
| Border | 1 px, a neutral token |
| Spacing | 4, 8, 12, 16, 24, 32 |
| Duration | 120 to 200 ms, on color, opacity and transform |
| Icons | 16 to 20 px, one library, one stroke width |

## 6. Text

Every label, placeholder, error, empty state and toast goes through `references/copy-app.md`.
A button is a verb and an object ("Exporter la timeline"), never "OK", "Valider" or "Submit"
alone (React Doctor `design-no-vague-button-label`).

## 7. Per-component checklists

### Button
- One primary per region. Destructive has its own variant, never the primary color.
- `type="button"` unless it submits: a bare `<button>` inside a form submits it.
- Disable with `disabled` or `aria-disabled`. `pointer-events-none` alone still fires from the
  keyboard (React Doctor `no-pointer-disabled-enabled-control`).
- A disabled button gets no hover or focus, so its reason sits next to it as text.
- A focused button that turns `disabled` loses focus to `body` (HTML focus fixup rule). When
  keyboard focus must stay through the wait, use `aria-disabled` and ignore the click.

### Text field and form
- A visible `<label htmlFor>`. The placeholder is an example, never the label.
- Validate on blur. Once a field shows an error, re-validate on change so it clears as it is fixed.
- On submit: focus the first invalid field. Several errors: a summary at the top linking to each.
- The error sits under its field, linked by `aria-describedby`, with `aria-invalid="true"`.
- Right `type`, `inputMode` and `autoComplete`. Never block paste. Never clear input on error.
- iOS Safari zooms into a focused input under 16 px: mobile inputs use 16 px text.
- Required or optional is said in words beside the label. A group of radios or checkboxes sits in
  a `fieldset` with a `legend`. A password field has a show button. Read-only is not disabled: the
  value stays focusable and copyable.

### Select and combobox
- 2 to 7 options: show them all (radio or toggle group). More: select. Needs search: combobox.
- Native `<select>` when no custom rendering is needed: accessible and fast on old engines.
- Combobox focus stays in the input; `aria-activedescendant` points at the active option.
- No match shows a message, not an empty popover. The chosen value stays readable when truncated.

### Dialog and confirm
- A modal only when the task needs protected focus. Otherwise inline, a popover or a sheet.
- Native `<dialog>` with `showModal()` makes the page behind it inert, but Tab can still leave
  for the browser's own toolbar (seen in Chrome, 2026-09-16). Wrap focus yourself when the
  dialog must hold it, as the library dialogs do.
- A title linked by `aria-labelledby`, hidden visually if needed (shadcn: `DialogTitle`, `sr-only`).
- Destructive confirm: the title names action and object ("Supprimer 3 rushs ?"), the button
  repeats the verb ("Supprimer"), and focus starts on Cancel. Template in `references/states.md`.
- Reversible action: an Undo toast instead of a confirm.
- Closing with unsaved changes asks first, or keeps the draft.

### Toast
- For the outcome of the user's own action. An error that needs a fix stays inline, near its source.
- Never takes focus; announced with `aria-live="polite"` (sonner does this).
- A toast with an action, or an error, does not vanish on a timer; the action also exists elsewhere.
- No toast for what the screen already shows, and never over the primary action or mobile nav.

### Table and list
- Real `<table>` for tabular data. Numbers right-aligned in `tabular-nums`, text left-aligned.
- Skeleton rows keep the final column widths, so nothing jumps when data arrives.
- 1,000 rows: virtualize or paginate, and show the total. Long tables keep a sticky header.
- Row actions reachable by keyboard. Empty, filtered-empty and error are three different states.
- Mobile: priority columns or stacked rows, or a visible horizontal scroll. Never a silent clip.

### Card
- Only for a standalone, repeated item (a project, a file). Not the default wrapper for a section.
- No card inside a card; separate with spacing or a divider (React Doctor `no-nested-card-surface`).
- No shell with a title and nothing else (`no-empty-card-shell`), no grid of identical
  icon-title-text cards (`no-uniform-feature-card-grid`).
- One elevation: a border or a shadow. A 1 px border under a wide soft shadow is the ghost card.
- Whole card clickable: one real link stretched with `after:absolute after:inset-0`; inner
  buttons sit above it with `relative z-10`.

### Tabs
- Tabs switch views of one object. Moving between pages is navigation: links.
- `tablist` / `tab` / `tabpanel` with `aria-selected`. Selected shows by more than color.
- Labels of one or two words; long French labels scroll, never truncate silently.
- Switching tabs keeps what the user typed in a panel.

### Menu and dropdown
- A menu holds actions. Picking a value is a select; a list of pages is navigation.
- Trigger carries `aria-haspopup` and `aria-expanded`. Typeahead jumps to an item.
- Destructive item last, after a separator, in the danger token.
- Portal-rendered, and flips at the viewport edge.

### Sidebar and navigation
- The current page has `aria-current="page"` and a marker beyond color.
- Collapsed to icons: each item keeps its accessible name and gets a tooltip.
- Mobile: a drawer, or a bottom bar of 5 items at most, each with a label.
- Hover never changes its width; the content does not reflow. Provide a skip link to `<main>`.
- Group labels in sentence case, not tracked capitals.

### Tooltip
- Extra information only. Never the only place for an action or a required fact.
- Opens on hover and on focus, closes on Escape, stays open while hovered (WCAG 2.2 SC 1.4.13,
  read 2026-09-16). Touch has no hover: put the fact in the UI instead.
- Never repeats the visible label. Never sits directly on a disabled button: it gets no events.

### Empty state
- Says why it is empty and gives the next action as a button, or says when data will appear.
- First use, no results for a filter (offer "Effacer les filtres") and done are different screens.
- Never flashes while data loads: loading shows first.
- Same footprint as the content. No illustration pushing the action below the fold.

## 8. Proof

1. Render every state from the contract on one page: a fixture page, a story, or a temporary
   route such as `/_states/<component>`. Capture that page at 375 px and at desktop width, with
   the long French label in it. Delete a temporary route afterwards unless the user wants to keep
   it. Emulate the width rather than resizing a window (see `references/new-ui.md` §8).
2. Keyboard only: reach, activate, open, close. Write where focus went after each step.
3. Scan the files you touched. Zero `block` findings. The scan is a regex heuristic: it misses
   strings built at run time and can flag code. Read each finding in context; never auto-fix
   from it.

```bash
node <skill dir>/scripts/scan.mjs ui src/components/export-button.tsx
node <skill dir>/scripts/scan.mjs copy src/components/export-button.tsx
npx react-doctor@latest design --verbose   # optional; downloads the package, ask before the first run
```

When `AGENTS.md` forbids running the app, skip steps 1 and 2 and list which states were not
observed.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| A new `Button` next to the existing one | A variant on the existing one |
| Code first, states added when a reviewer asks | The contract first, every state rendered and captured |
| `<div onClick>` with `cursor-pointer` | `<button type="button">` |
| Row actions at `opacity-0 group-hover:opacity-100` | Also on `focus-within` and on `(hover: none)` |
| An icon button with a tooltip and no name | `aria-label` with the tooltip's verb, hit area to target size |
| "Loading…" replacing the label, the button shrinking | Spinner in the icon slot, same label, same width, `aria-busy` |
| `bg-[#6366f1] rounded-2xl shadow-xl transition-all` | Tokens, radius from `## Look`, named transition properties |
| A dropdown clipped by its scrolling parent | A portal |
| A card inside a card inside a card | One surface, spacing inside it |
| A modal for a task that could stay inline | Inline, a popover or a sheet |
| "Done, looks good" with no render | Screenshots of each state, or a list of what was not observed |
