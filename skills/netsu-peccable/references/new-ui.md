# New UI: a page, screen or app

Build a surface that does not exist yet. Content comes before layout, and the look comes from
`DESIGN.md` or from a direction the user picked. Script paths are relative to this skill's
directory.

## 1. Read the design file

Read `## Product` and `## Look` in `DESIGN.md` (or the equivalent file the parent names). No
design file: run `references/setup.md` first, then come back. Its message carries every question
this file needs, including the product facts step 3 cannot find in the repository, and, in an
empty project, the stack.

## 2. Explore before inventing

```bash
ls DESIGN.md components.json tailwind.config.* index.html 2>/dev/null
grep -rnE --include='*.css' -e '--[a-z0-9-]+:' -e '@theme' src | head -40
grep -oE '"(tailwindcss|@fontsource[^"]*|lucide-react|react-icons|@heroicons/react|@phosphor-icons/react|@tabler/icons-react|motion|framer-motion|react-native-reanimated|@radix-ui/[^"]*)"' package.json
ls src/components/ui src/components 2>/dev/null | head -40
find . -path ./node_modules -prune -o \( -path '*fixtures*' -o -path '*mocks*' -o -name 'seed*' \) -print | head -20
```

| Found | Do |
|---|---|
| Tokens in `@theme` or CSS variables | Use them. A missing token is added to the same file, never inlined |
| `components.json` or `src/components/ui` | Compose from those components; restyle through their variables |
| A font package or `@font-face` | That is the UI font. Do not add a second without step 4 |
| One icon library | Use it, same stroke and size everywhere. Two libraries: keep the one used most |
| Fixtures, seeds, mocks | Your content source for step 3 |

A new screen inside an app that already has a coherent look inherits that look: no directions,
no new tokens unless a state needs one. Directions are for a new product or a replaced look.

## 3. Content first

Fill this sheet before drawing anything. Show it to the user in the same message as the
direction question (step 4); do not save it as a file.

```text
Screen: <name>
User and moment: <from ## Product: who, where, how often>
Tasks here, most frequent first: 1. <verb + object>  2. ...  3. ...
Data shown: <fields>, with real values from <fixture file>; longest value: <...>
Primary action: <one verb + object>
Secondary actions: <...>
States: <which of empty, loading, error, partial, offline, stale apply> (references/states.md)
Key strings (FR / EN): title, primary button, empty state, main error
```

- Real content only: values from the repo, its fixtures or its docs. No lorem, no "John Doe", no
  "Acme". Nothing real exists: ask for it, or show a visible placeholder such as
  `[Real customer quote needed]`.
- Write the key strings now, before the layout: `references/copy-app.md` for text inside the
  product, `references/copy-pages.md` for a landing page, store listing or presentation page.
  Load `references/words-<lang>.md` for each UI language (`references/words-any.md` when the
  language has no file).
- The longest real value and the French string decide widths. French runs up to 35% longer
  than English (Crowdin; LocaleProof, 2026).

## 4. Direction

| Situation | Do |
|---|---|
| `## Look` has a direction | Use it. No question |
| No `## Look`, but the code has a coherent palette and font | Record them through `references/setup.md`, then use them |
| New screen inside an existing app | Inherit (step 2). No question |
| Nothing decided | Propose directions, below |

Generic instructions such as "make it clean and minimal" move the model to another fixed
palette instead of producing variety. What works is a concrete spec, or proposing distinct
directions and letting the user pick (Claude Sonnet 5 prompting docs, "Design and frontend
defaults", platform.claude.com, read 2026-09-16). The question below is the only one this file
asks, and it comes before any code.

Load `references/ai-look.md`, then propose 3 or 4 directions in this table:

```markdown
| Direction | Background | Accent, used for | Type | Density | Radius | Looks like | Why |
|---|---|---|---|---|---|---|---|
| A. <name from the users' world> | `#......` | `#......`, <primary action, selection> | <UI face>; <second face and its one use, or none> | compact / comfortable | <n> px controls, <n> px panels | <one real product, tool or printed artefact> | <one line tied to ## Product> |
```

Format example for a clip organiser used by video editors. Its values are not candidates for
another product.

| Direction | Background | Accent, used for | Type | Density | Radius | Looks like | Why |
|---|---|---|---|---|---|---|---|
| A. Grading room | `#1E1F22` | `#E3A33B`, export and selection | Barlow; tabular numerals for timecode | compact | 3 px, 6 px | the edit page of a grading suite | Editors judge colour beside a calibrated monitor; a neutral dark keeps that judgement honest |
| B. Shot log | `#F3F5F2` | `#1F6F5C`, primary action and selection | Source Sans 3; Source Serif 4 for take notes only | comfortable | 4 px, 8 px | a printed continuity sheet | Assistants log takes on set, on a laptop, often outdoors |

Before sending, check every row:

- Rows differ on at least two axes: light or dark, accent hue family, type classification
  (grotesque, humanist, serif, mono), density.
- No row matches a line of `references/ai-look.md` unless the product gives the reason.
- The accent passes 4.5:1 against the background when it colours text, 3:1 when it only fills
  a control. Run the contrast snippet from `references/visual.md` and put the numbers under the
  table.
- "Why" names the users or the place of use. A reason that fits any product is not a reason.

Ask once: "Which direction? Or tell me what to change." Build nothing until the answer comes.
When nobody can answer (a report-only request, an agent run), stop here and return the content
sheet and the direction table.
Then write the choice into `## Look`:

```markdown
- Direction: shot log, a printed continuity sheet, not a marketing site
- Density: comfortable. Theme: light
- Fonts: Source Sans 3 for the UI; Source Serif 4 only for take notes. Loaded from @fontsource.
- Colors: tokens in src/styles.css @theme. Accent `--color-accent` (#1F6F5C), only for the
  primary action and the current selection.
- Radius: 4px controls, 8px panels.
```

A whole new page with no layout to follow gets two or three structure sketches in the same
question. A request to plan without building stops here, with the content sheet and the choice.

## 5. Layout

- One primary action per view. Everything else is visibly secondary.
- Hierarchy by position and order first, then grouping and space, then type size and weight,
  then glyph, then grey value. Hue comes last (interface-craft, github.com/deanayoung3-droid,
  checked 2026-09-16).
- More space above a heading than below it. Related items tight, groups apart.
- Product UI uses the pattern users already know:

| Need | Pattern |
|---|---|
| 2 to 5 top-level places | Tabs on web and desktop; bottom tabs on mobile (5 at most) |
| More than 5 places | Sidebar, with the current place marked by more than colour |
| Compare many records | Table with sortable headers, not a grid of cards |
| One record in context | Side panel or detail page |
| Settings | Grouped list, label above or left of each control |
| Destructive action | Confirmation from `references/states.md` |

- Landing pages: list the real material first (screenshots, a demo, prices, quotes with a name
  behind them). One section per item that exists. Hero, three feature cards, testimonials and a
  CTA is not a default; a section with nothing real in it is deleted.
- Dashboards: open with what the user checks first. A row of KPI cards only when that answer is
  a number.
- Filters, the open tab and the selection live in the URL. Back restores the scroll position and
  what was typed. Breadcrumbs from three levels deep. A modal is never a page.
- A component that lives in a side panel, a split view or a resizable window adapts to its
  container (`@container`), not to the viewport; viewport breakpoints are for the page shell.
- Structure: one `h1`, headings in order, landmarks (`header`, `nav`, `main`, `footer`), a title
  per page, and focus moved to the new page's heading after a route change. A meaningful image
  says what it shows in `alt`; a decorative one has `alt=""`.
- Touch targets: 24×24 CSS px at minimum (WCAG 2.2, SC 2.5.8); 44×44 pt on iOS and 48×48 dp on
  Android for React Native.
- No hand-drawn SVG people, scenes or blobs. A labelled grey placeholder until the real asset
  exists.

## 6. Build

1. Tokens: add or complete them with `references/visual.md` (colour, type, spacing, radius,
   themes). Instances use tokens only.
2. The layout shell at 375 px and 1280 px.
3. Components through `references/components.md`, each with its states from
   `references/states.md`.
4. The strings from step 3, then a copy pass on the rest.
5. Motion last, only where `references/motion.md` says it earns its place.

Images: `width` and `height` (or `aspect-ratio`) on every one, so nothing shifts; `srcset` for
large ones; `loading="lazy"` below the fold only, never on the hero; never an empty `src`.

Platform notes:

- Tauri v2: the webview is WebView2 on Windows, WKWebView on macOS, WebKitGTK on Linux. Check
  CSS support against the oldest one you ship. `user-select: none` only on toolbars, tabs and
  drag regions: file names, paths, errors and logs stay selectable (house rule; scan
  `root-no-select`).
- Adobe CEP panels run old Chromium (CEF 88 in CEP 11, 99 in CEP 12). Tailwind v4 needs
  Chromium 111 (tailwindcss.com/docs/compatibility, read 2026-09-16), so a CEP panel uses
  Tailwind v3 or plain CSS with hex values. Follow the host's panel colours.
- Browser extension popups: set the width in CSS (Chrome caps a popup at 800×600 px) and keep
  the primary action visible without scrolling. A popup closes on the first click outside:
  it draws at once and saves every input as it changes. A side panel has no fixed width. UI
  injected into a page lives in a shadow root, with `translate="no"` on its host, and is removed
  on teardown. The toolbar button
  has a title; its badge holds 4 characters at most. An options page saves as it changes.
- React Native: no CSS. Tokens live in one theme object; the rules still apply.
- Native mobile: the platform's navigation bars and back gesture, never blocked; safe areas
  respected; the system text size followed; the platform's own pickers and switches. Check dark
  mode and large text on the simulator: `xcrun simctl ui booted appearance dark`,
  `adb shell settings put system font_scale 1.3`.

Check widths with the French strings. Not written yet: lengthen the English ones by 35% for the
check.

## 7. Check

```bash
node <skill dir>/scripts/scan.mjs ui src/routes/clips.tsx src/components/clip-row.tsx
node <skill dir>/scripts/scan.mjs copy src/routes/clips.tsx src/components/clip-row.tsx --lang fr
```

- Zero `block` findings. Read each `check` in context: fix it, or keep it with one line citing
  `## Look`. The scanner is a regex heuristic; never auto-fix from its output.
- Optional for React: `npx react-doctor@latest design --verbose` (downloads a package; ask first).

Keyboard pass, on the running screen:

- [ ] Tab order follows the visual order; nothing interactive is skipped.
- [ ] Focus is visible on every surface, including the accent button.
- [ ] Enter submits forms; Escape closes overlays and returns focus to the trigger.
- [ ] Every action shown on hover is also reachable by keyboard and touch.
- [ ] No keyboard trap.
- [ ] The browser console of the page is empty: an error there is a finding.

## 8. Show

Screenshot at 375×812 and 1280×800, in both themes when both exist, once entrance animations
have finished. Look at the screenshots before sending them: overflow, truncated French, focus
ring, empty and error states. A page that
shows every state stacked gives one capture per width instead of one per state.

Emulate the viewport; do not shrink a window. Desktop Chrome keeps a minimum window width, so
`chrome --headless --window-size=375,812` lays the page out wider and crops it (observed
2026-09-16). Use the browser tool's mobile size, DevTools device mode, Playwright's `viewport`,
or the DevTools protocol's `Emulation.setDeviceMetricsOverride`.

| Platform | Screenshot |
|---|---|
| Web, Tauri frontend | The browser tool on the dev server |
| Static files, no server | Headless Chrome with an emulated viewport on the `file://` URL |
| iOS simulator | `xcrun simctl io booted screenshot <scratch>/shot.png` |
| Android emulator | `adb exec-out screencap -p > <scratch>/shot.png` |
| CEP panel | The panel inside the host app. A plain browser at panel size proves layout only |

The app cannot run: say so, and list what was not observed ("dark theme and 375 px not seen").

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Opens with a hero, three icon cards, testimonials and a CTA | Sections from the real material list; empty sections deleted |
| Picks a palette and fonts silently, then builds | 3 or 4 directions in the table, one question, then build |
| "Make it clean" as the direction | A row with hex values, faces, density, radius, a reference and a reason |
| Directions that differ only in accent hue | Rows that differ on at least two axes |
| Lorem ipsum, "John Doe", "10,000+ teams" | Fixture values, or a visible `[Real ... needed]` placeholder |
| Layout first, strings pasted in at the end | Key strings written in step 3, widths set by French |
| Cards for records users compare | A table |
| Colour as the only sign of the current tab | Position, weight or a marker, then colour |
| New tokens and a new font for a screen inside an existing app | The app's look, inherited |
| "Looks good" with no screenshot | 375 and 1280 screenshots, or a list of what was not observed |
