# Accessibility: audit and fix

Check that every task works with a keyboard, a screen reader, zoom and reduced motion, and fix
what fails. Load this only when the user asks for an accessibility check or fix ("a11y",
"accessible", "keyboard", "screen reader", "RGAA", "WCAG"). Colour contrast is measured with
`references/colors.md` §2.

## 0. Frame

| | |
|---|---|
| Changes | Markup, ARIA, focus handling, keyboard handlers and the styles they need, on the screens named |
| Never changes | The look, the wording beyond accessible names, the flows. A redesign is not a fix |
| Asks first | Nothing. The standard is WCAG 2.2 AA unless the user names another (RGAA 4.1.2, §3), also when the project claims no conformance |
| Stops when | Both walks of §2 pass on the named screens, or every failure is reported |
| Returns | The findings table of §5, with the criterion for each, and the proof |

Report only what you checked. "Accessible" is never a verdict on screens nobody walked.

## 1. Mechanical pass

```bash
node <skill dir>/scripts/scan.mjs ui <files>
grep -rnE 'onClick=' <files> | grep -E '<(div|span|li|td|tr|img)\b' | head
grep -rnE 'outline(-none|:\s*(none|0))|:focus[^-]' <files> | head
grep -rnE 'user-scalable=no|maximum-scale=1' index.html src 2>/dev/null
```

The scan reports `icon-button-name`, `static-click`, `positive-tabindex`, `hidden-focusable`,
`img-alt`, `late-live-region`, `outline-none` and `hover-only`; eslint-plugin-jsx-a11y has the same
checks when the project uses it (read 2026-09-17). A scan hit is a lead, not a verdict.

## 2. Two walks, on each named screen

Code-only when the project cannot run: read the components and say so in the report.

**Keyboard walk.** Unplug the mouse in your head and finish the main task:

1. Everything that acts is reachable with Tab, in the visual order; nothing unreachable is
   focusable. Only `tabindex="0"` and `-1`; composite widgets (tabs, menus, grids) use arrow keys
   with one tab stop (WAI-ARIA Authoring Practices, read 2026-09-16).
2. Focus is always visible (`:focus-visible`), 3:1 against what it sits on, never hidden under a
   sticky bar, and still visible in Windows high contrast (`references/components.md` §5).
3. Enter and Space activate; Escape closes the most recent overlay only; dialogs move focus in,
   keep it in, and return it to the trigger; the page behind is `inert`.
4. Every drag, swipe and hover-only action has a keyboard and a touch path (WCAG 2.2 SC 2.5.7).
5. Targets are at least 24×24 CSS px or spaced (SC 2.5.8); enlarged hit areas never overlap, and
   decorative layers on top get `pointer-events: none`.

**Screen-reader walk.** With NVDA or Narrator on Windows, VoiceOver on macOS, or by reading the
code:

1. Native elements first: `<button>` acts, `<a href>` goes somewhere (middle-click and "copy
   link" work). No ARIA where HTML does it; no ARIA is better than wrong ARIA.
2. Every control announces a name, a role and its state. An icon button has `aria-label`; a
   visible label is part of the name (SC 2.5.3). `aria-hidden` never sits on or above something
   focusable.
3. Every input has a label (a placeholder is not one), the right `type`, `autocomplete` token
   (SC 1.3.5) and `inputmode`; paste is never blocked. Errors: `aria-invalid`,
   `aria-describedby`, focus on the first invalid field (`references/states.md`, Error).
4. Changes are announced: a `role="status"` region in the page before its text changes, `alert`
   for urgent errors only (MDN, *ARIA live regions*, read 2026-09-17).
5. Images by purpose: decorative `alt=""`, informative says what it shows, functional says what
   it does ("Search", not "magnifying glass"). Decorative SVGs get `aria-hidden="true"`.
6. One `h1`, headings in order, one `main`, a title per page, focus moved to the new page's
   heading after a route change. `lang` on the root and on passages in another language.

**Zoom and motion.** 200% zoom and a 320 px wide viewport without sideways scroll (SC 1.4.4,
1.4.10); never `user-scalable=no`. `prefers-reduced-motion` keeps feedback and drops travel
(`references/motion.md` §6); anything moving longer than 5 s has a pause (SC 2.2.2). Colour is
never the only signal (SC 1.4.1).

## 3. Severity

| Level | Means | Examples |
|---|---|---|
| P0 | A task cannot be done with a keyboard or a screen reader | Save unreachable by Tab; a dialog that traps focus with no way out |
| P1 | Possible but misleading or very hard | Unnamed icon buttons; errors not announced; focus invisible |
| P2 | A barrier with a workaround | Wrong tab order in a secondary panel; a missing `autocomplete` |
| P3 | Polish | A redundant `role`; a heading level skipped in a footer |

The failures listed in `references/review-ui.md` §6 are never below P1. WCAG 2.2 criteria are
cited by number (w3.org/TR/WCAG22, read 2026-09-17). RGAA 4.1.2, the French
reference, turns WCAG 2.1 AA into 106 criteria (accessibilite.numerique.gouv.fr, read 2026-09-17);
cite its criterion only when the user asks for RGAA.

## 4. Fix

1. Replace the element before adding ARIA: `<div onClick>` becomes `<button type="button">`.
2. Fix shared components once (`references/components.md`), then the screens.
3. Keep the look: a new focus ring uses the `focus` token (`references/colors.md`).
4. Change nothing that is not a finding.

## 5. Report and proof

```markdown
## Accessibility: <scope>

Walked: keyboard, NVDA on Windows 11 | code-only
Standard: WCAG 2.2 AA

| Severity | Where | Problem | Fix | Criterion |
|---|---|---|---|---|
| P0 | `clip-row.tsx:18` | Delete shown on hover only, unreachable by keyboard | `group-focus-within:opacity-100` | SC 2.1.1 |
```

Proof: the keyboard walk written as steps
(where focus went); a screen-reader transcript or "code-only"; the `ui` scan with zero `block`
on the changed files, which is a floor, not the proof. No score, no "100% accessible".

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| `role="button"` and `tabIndex={0}` on a div | A `<button>` |
| `aria-label` on everything | Native labels first; ARIA where HTML falls short |
| `outline: none` with nothing in its place | A visible `:focus-visible` style |
| "The page is accessible" after a scan | The two walks, written down, or "code-only" |
| An announcement region created with its message | The region first, the text after |
| Rewrites the screen while fixing focus | One change per finding |
| `tabIndex={3}` to fix the order | The DOM in the right order |
