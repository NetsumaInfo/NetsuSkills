# Adapt: another screen size, input or platform

Make an existing screen work well in a context it was not built for: phone, tablet, desktop
window, touch, keyboard-only, a browser extension panel, a native mobile app. Load this only when
the user asks to adapt, port or "make it work on" another device or platform.

## 0. Frame

| | |
|---|---|
| Changes | The named screen's layout, controls and interactions for the target context |
| Never changes | Its features and look, and its content except the shorter labels of §3. The source context keeps working as before |
| Asks first | The target contexts and their sizes, when the request and `## Product` do not say them |
| Stops when | The main task completes in every target context, checked once each |
| Returns | The context table of §1, the changes of §3, the proof |

Adaptation is rethinking for the context, not scaling pixels (impeccable, `reference/adapt.md`,
read 2026-09-17).

## 1. Name the contexts

| Context | Size | Input | Connection | Use |
|---|---|---|---|---|
| Source: desktop web | 1280 px and up | Mouse, keyboard | Fast | At a desk, long sessions |
| Target: phone | 375 px | Touch, on-screen keyboard | Variable | A quick check between tasks |

## 2. What breaks when the context changes

| From → to | Check |
|---|---|
| Desktop → phone | Multi-column layouts, hover-only actions, small targets, tables, fixed widths, modals taller than the screen, inputs under 16 px (iOS zoom) |
| Mouse → touch | Hover states, right-click menus, drag without an alternative (`references/components.md` §4), targets under 44 pt or 48 dp |
| Phone → desktop | Stretched single columns, oversized controls, bottom sheets where a menu fits, missing keyboard shortcuts |
| Web → extension popup or side panel | A fixed 800×600 popup limit, a panel of variable width, state lost when the popup closes (`references/new-ui.md` §6) |
| Web → desktop app (Tauri, Electron) | Window resizing from a small minimum, native title bar or drag region, text selection, offline use |
| Web → native mobile | Platform navigation and back gesture, safe areas, system text size, platform pickers (`references/new-ui.md` §6) |

## 3. Adapt

- **Layout** through `references/layout.md`: breakpoints where the content stops fitting,
  container queries for panels, single column with the main action in reach on phones.
- **Controls**: hover actions become visible or move into a menu; right-click has a visible
  alternative; targets meet the platform size.
- **Tables** on a phone: the key columns, the rest in a detail view; never sideways scrolling for
  the main task.
- **Navigation**: the pattern users expect on that platform (`references/new-ui.md` §5); the
  destinations stay the same.
- **Input**: the right keyboard (`type`, `inputmode`), no required keyboard shortcut on touch,
  shortcuts kept on desktop.
- **Text**: the same strings in every context. A shorter label for a small screen is a new
  string, written through `references/copy-app.md` in every language.

## 4. Check each context once

Emulated size and touch in the browser tool (`references/new-ui.md` §8), the desktop app window
at its minimum and default sizes, a simulator for native. The main task, start to end, in each.

## 5. Report and proof

```markdown
## Adapt: <screen> to <contexts>

| Context | Main task | Changes |
|---|---|---|
| Phone, 375 px | Completes | Row actions in a menu; table → list with detail view |
| Touch tablet | Completes | Targets 44 pt; drag reorder gets move buttons |
```

Proof: one capture per context of the main task's key step; the `ui` scan with zero `block`;
`hover-only` findings at zero on the screen.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| The desktop layout shrunk to 375 px | Rethought for the phone task |
| Features cut on mobile to make it fit | The same features, one step away |
| A separate mobile copy of the screen | One screen that adapts |
| Hover menus on a tablet | Visible actions or a menu button |
| Breakpoints at device widths | Where the content stops fitting |
| A shorter English label only | A new string in every language |
