# Stress test: one component against every case it can meet

Render one component in every state and worst-case content it can receive, on one temporary
page, and report what visibly breaks. Load this only when the user asks to stress-test, harden,
or "check every state" of a component or a small screen. Fixing happens only when asked (§6).

## 0. Frame

| | |
|---|---|
| Changes | One temporary page and its fixtures, in the project only when it may run and the request allows changes; otherwise nothing. Nothing in the component unless the user asks for fixes |
| Never changes | The component while testing, production data, the app's layout or styles |
| Asks first | Which component, when the request names a whole screen or several |
| Stops when | The page is built, looked at once, and the table of §5 is written |
| Returns | The page's address, the scenarios kept and dropped, the table of §5 |

One component per run: "the settings page" is not one; its name field is. Adapted from Krehel's
`break` (github.com/jakubkrehel/skills, read 2026-09-17) and impeccable's `harden`
(github.com/pbakaus/impeccable, read 2026-09-17).

## 1. Read the component

Its props, slots, states, the data it renders and where it is used. Write one sentence: what it
accepts, what it shows, where it lives. Read `AGENTS.md`. A project that forbids running the app,
or a request that changes nothing, gets no page: §2 and the code reading of §4 only.

## 2. Keep only the scenarios that can happen

A scenario is kept when the component can receive that shape in production. Write the list before
building, one line each, then one line on the axes dropped and why.

| Axis | Values | Keep when |
|---|---|---|
| Length | Empty, one character, the long French string, 100 characters | It shows text |
| Unbreakable | A 60-character path or URL, `Donaudampfschifffahrtsgesellschaft` | It shows names, paths or IDs |
| Scripts | Emoji, an Arabic name in a French sentence, Japanese, Vietnamese or Thai marks | It shows user text or ships those languages |
| Numbers | 0, 1, 2, `1234567.89` through `Intl.NumberFormat`, negative | It shows counts, sizes or prices (plurals: `Intl.PluralRules`) |
| Quantity | 0, 1, 5, 50, 1,000 items | It shows a list, options or tags |
| Media | Missing image, broken `src`, very tall, very wide | It shows images |
| State | Loading, empty, error, partial, offline, disabled with its reason, read-only, permission denied | The state exists in `references/states.md` for this kind of component |
| Width | 320 px and 480 px boxes, and full width | Always |
| Environment | Dark theme, reduced motion, 200% text | The product ships it |

Values that are real for the product beat generic ones: its own long file names, its own
languages (`## Voice`).

## 3. Build the page

- One throwaway route or story (`/_states/<component>`, a Storybook story, a fixture page) that
  imports the real component. Never a rebuilt lookalike.
- One instance per scenario, in one column, each with a short label above it. Width scenarios sit
  in fixed-width boxes beside a full-width one, so one load shows them all. A dialog or anything
  fixed on screen gets one scenario per URL (`?scenario=long-name`) at emulated widths instead.
- Fixtures as props only. A component that loads its own data gets the stub the project's tests
  already use (a mock client or provider); without one, its data scenarios are listed as not
  rendered. The page never reads production state or live data, and production code never
  imports the page.
- The page adds labels and boxes, nothing else: no styles on the component.

## 4. Look once

Open the page once in the browser tool, if the project may run, and read it top to bottom. Note
what visibly broke: "the name escapes the card's right edge", never "spacing feels tight". A
scenario that shows nothing at all means the harness is broken, not the component: fix the page.

No browser, or running is forbidden: say the look was not done, and read the component for each
scenario instead. What the code suggests goes under "To check, not seen", never in the table of
what was observed.

## 5. Report

Written in the user's language. Broken scenarios first:

```markdown
## Stress test: <component>

Page: http://localhost:5173/_states/clip-card | not opened: <reason>
Kept: <scenarios> · Dropped: <axes and why>

| Scenario | Observed | Fix in |
|---|---|---|
| 60-character file name | Overflows the card, no truncation | `references/typography.md` §2.8 |
| 0 clips | Blank area, no message | `references/states.md`, Empty |
| Error | Raw `Error: 500` text | `references/review-copy.md` |

### To check, not seen
- <scenario>: <what the code suggests> (`file:line`)
```

"Nothing broke" is a complete report: list what was rendered. The page stays while the user looks
at it; when the task ends, delete it and its fixtures unless the user wants to keep them.

## 6. Harden, only when asked

1. Fix in the order of `references/review-ui.md` §6: lost data and blocked tasks, then missing
   states, then overflow and formatting.
2. Each fix follows the file named in "Fix in", and changes the component, not the page.
3. Re-render the failing scenarios on the same page and update the table: Before | After.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Every axis against every component | The axes that can happen, and the dropped ones named |
| A copy of the component styled for the test | The real component, imported |
| Screenshots of each scenario, a browser debugged for an hour | One page, one look |
| "Probably overflows on mobile" | Rendered and seen, or left out |
| Fixes while testing | The report first; fixes on request |
| The test page left in the build | Deleted when the user is done |
