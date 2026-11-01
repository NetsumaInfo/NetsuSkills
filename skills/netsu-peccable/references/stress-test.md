# Stress test: one component against every case it can meet

Render one component in every state and worst-case content it can receive, on one temporary
page, and report what visibly breaks. Load this only when the user asks to stress-test, harden,
or "check every state" of a component or a small screen. Fixing happens only when asked (§9).

## 0. Frame

| | |
|---|---|
| Changes | One temporary page and its fixtures, in the project only when it may run and the request allows changes; otherwise nothing. Nothing in the component unless the user asks for fixes |
| Never changes | The component while testing, production data, the app's layout or styles |
| Asks first | Which component, when the request names a whole screen or several |
| Stops when | The page is built, looked at once, and the report of §8 is written |
| Returns | The page's address, the surface map, the scenarios kept and dropped, the report of §8 |

One component per run: "the settings page" is not one; its name field is. Adapted from Krehel's
`break` (github.com/jakubkrehel/skills, read 2026-09-17), impeccable's `harden`
(github.com/pbakaus/impeccable, read 2026-09-17) and Emil Kowalski's `break-ui`
(read 2026-11-01).

The parent's scale is the only one. Map a break to it: unreadable content, an unreachable
action, wrong data shown or raw internals on screen → `P0`/`P1` as the parent defines them;
visibly wrong but usable → `P2`; cosmetic → `P3`. "Fragile" (no limit found and no fallback,
but nothing broken yet) is not a severity: it goes under "To check, not seen", or becomes a
`P3` finding when the missing limit is in the code you read.

## 1. Read the component

Its props, slots, states, the data it renders and where it is used. Write one sentence: what it
accepts, what it shows, where it lives. Read `AGENTS.md`. A project that forbids running the app,
or a request that changes nothing, gets no page: §2, §3 and the code reading of §6 only.

## 2. Map the surface

Before choosing any value, list every value the component renders:

| Field | Source | Type | Limit | Optional? |
|---|---|---|---|---|
| `name` | `member.name` | string | 255 (`schema.ts:14`) | No |
| `email` | `member.email` | string | unbounded | No |
| `role` | `member.title` | string | 120 | Yes |
| `status` | enum | `active` / `invited` / `expired` | n/a | No |

Include the values people forget: counts in headers, relative timestamps, badge and status
text, button labels that come from data, tooltips, avatar images, and the list's own length.

Find limits in validation schemas (Zod, Yup, Valibot), migrations, API types and form
`maxLength`. Note where front end and back end disagree: a 50-character input saved into a
255-character column means something longer will arrive through an import or the API.

Done when every rendered value has a source and either a limit or "unbounded".

## 3. Keep only the scenarios that can happen

**The plausibility rule.** Every worst-case value is either a realistic example (a real naming
pattern, a real email shape) or the actual limit from the schema, column or API contract.
`aaaaaaaa…` and a 5,000-character name prove nothing: the designer rightly answers "that never
happens" and stops reading. A field with no limit is itself a finding (unbounded); test it with
something long but believable.

A scenario is kept when the component can receive that shape in production. Write the list
before building, one line each, then one line on the axes dropped and why.

| Axis | Values | Keep when |
|---|---|---|
| Length | Empty, one character, the long French string, 100 characters | It shows text |
| Unbreakable | A 60-character path or URL, `Donaudampfschifffahrtsgesellschaft` | It shows names, paths or IDs |
| Scripts | Emoji, an Arabic name in a French sentence, Japanese, Vietnamese or Thai marks | It shows user text or ships those languages |
| Numbers | 0, 1, 2, `1234567.89` through `Intl.NumberFormat`, negative | It shows counts, sizes or prices (plurals: `Intl.PluralRules`) |
| Quantity | 0, 1, 5, 50, 1,000 items | It shows a list, options or tags |
| Time | Now, a future date, a zero timestamp, 3 years ago (§4) | It shows a date, a duration or "x ago" |
| Media | Missing image, broken `src`, very tall, very wide | It shows images |
| State | Loading, empty, error, partial, offline, disabled with its reason, read-only, permission denied | The state exists in `references/states.md` for this kind of component |
| Width | 320 px and 480 px boxes, the component's real container, full width (§6) | Always |
| Environment | Dark theme, reduced motion, 200% text, `dir="rtl"` | The product ships it |

Values that are real for the product beat generic ones: its own long file names, its own
languages (`## Voice`).

## 4. Pick the values

Name the fields from the surface map, then draw from these. Fixtures use `example.com`,
`example.org` or `.test`, never a domain that points at a real inbox.

**People** (each one exists in production):

| Value | Breaks |
|---|---|
| `Aleksandra Wiśniewska-Kowalczyk` | Long, hyphenated, accented; wraps, and the hyphen is a break point |
| `Christopher Alexander Montgomery III` | Suffix; naive first + last initials give `CI` |
| `Jo`, `J` | Short; empty name column, initials `J`, a tiny click target |
| `Đặng Thị Ngọc Hân` | Stacked diacritics, clipped by a tight `line-height` |
| `王秀英` | No spaces; "first + last word" finds one word, CJK breaks anywhere |
| `نور الهدى عبد الرحمن` | RTL; icons and punctuation land on the wrong side without `dir="auto"` |
| `María José de la Cruz y Fernández` | Lowercase particles; initials `Md`, "last name" sorting |
| `🦊 Fox`, `👩🏽‍💻 Priya` | `.charAt(0)` returns half a surrogate pair; use `Intl.Segmenter` |
| `  Sam   Lee ` | Leading, trailing, repeated spaces; initials from empty words |
| missing name | Only an email exists; the UI needs a fallback |

**Identifiers and long strings:**

| Value | Breaks |
|---|---|
| `bartholomew.fitzgerald@northwind-industries-holdings.example.com` | Pushes siblings off the row |
| `a@b.co` | Shortest realistic; a layout built for long emails looks empty |
| `first.last+billing-notifications@example.com` | The meaningful part sits in the middle |
| `https://example.com/workspaces/acme/projects/q3-launch/docs/9f8e7d6c5b4a?tab=comments` | Unbreakable; the end carries the meaning |
| `9f8e7d6c-5b4a-4c3d-8e2f-1a0b9c8d7e6f` | UUID; middle-truncation candidate |
| `Q3 Board Deck — FINAL (revised) v12 [approved by legal].pdf` | End-truncation hides the version and extension |
| `Benachrichtigungseinstellungen`, `Paramètres de confidentialité et de sécurité` | Translated labels run about 30% longer |
| `<b>Q&amp;A</b>`, a newline in a single-line field | Escaping and row height |

**Time**, the axis most often missing:

- "0 seconds ago" where it should say "just now".
- No switch to an absolute date after about a week.
- A future date reading "-3 days ago".
- A zero timestamp shown as 1970.
- `2025-12-31T23:30:00-08:00` landing on another day in UTC.
- A duration of 1,284 hours that never rolls up to days.

Use `Intl.RelativeTimeFormat` and `Intl.DateTimeFormat`, never hand-built strings.

**Cases outside the main dataset** (extra fixtures, one scenario each):

- Zero items, and exactly one, with every count at exactly 1 (plurals).
- Exactly the page size, and page size + 1.
- The realistic upper bound; 1,000+ rows when unpaginated.
- One item ten times the size of the others.
- Items with identical names.
- Every status enum value at once.
- The current user in their own list.
- No permission; partial data (some optional fields filled, others not).

Spread the failures across the first rows (row 1 the long name, row 2 the long email, row 3
the one-letter name), as real data does. Stacking everything in row 1 hides which one broke.

## 5. Build the page

- One throwaway route or story (`/_states/<component>`, a Storybook story, a fixture page) that
  imports the real component. Never a rebuilt lookalike.
- One instance per scenario, in one column, each with a short label above it. Width scenarios sit
  in fixed-width boxes beside a full-width one, so one load shows them all. A dialog or anything
  fixed on screen gets one scenario per URL (`?scenario=long-name`) at emulated widths instead.
- Fixtures as props only. A component that loads its own data gets the stub the project's tests
  already use (a mock client or provider); without one, its data scenarios are listed as not
  rendered. The page never reads production state or live data, and production code never
  imports the page.
- Change the data, never the markup or the CSS, to produce a break: a hand-edited break tests
  your edit, not the component.
- The page adds labels and boxes, nothing else: no styles on the component.

## 6. Look once

Open the page once in the browser tool, if the project may run, and read it top to bottom. Note
what visibly broke: "the name escapes the card's right edge", never "spacing feels tight". A
scenario that shows nothing at all means the harness is broken, not the component: fix the page.

Check the worst-case data at:

- the component's **real container width** (a 280 px sidebar is not a full-page list);
- 320 px, and the widest layout it supports;
- 200% text size, because text grows and boxes do not;
- dark theme, and `dir="rtl"` on a wrapper when the product supports either.

No browser, or running is forbidden: say the look was not done, and read the component for each
scenario instead. What the code suggests goes under "To check, not seen", never in the table of
what was observed.

## 7. Failure signatures

What shows on screen, almost always why, and the exact property that fixes it. Name the
signature in the report, with the property and the `file:line` where it goes.

| What you see | Cause | Fix |
|---|---|---|
| Avatar or icon squished into an oval | Flex child shrinking | `flex-shrink: 0` on the avatar, icon, any fixed-size box |
| Text overflows instead of wrapping or truncating | Flex/grid child has `min-width: auto` | `min-width: 0` on the text column (`minmax(0, 1fr)` in grid) |
| Email or URL runs past the edge | No break opportunities | `overflow-wrap: anywhere` on that element |
| Trailing action (••• menu, button) pushed off or clipped | The middle took all the space | `min-width: 0` on the middle, `flex-shrink: 0` on the action |
| Badge wraps onto two lines | Badge allowed to shrink | `white-space: nowrap; flex-shrink: 0` on the badge; decide what yields instead |
| Avatar centred against a three-line name looks adrift | `align-items: center` on rows of varying height | `align-items: flex-start` once the text can wrap |
| Last row cut mid-glyph at a hard edge | Fixed-height container, no scroll or fade | A visible scrollbar or a fade mask; check `overflow` is intended |
| Long word breaks mid-word in a heading | `word-break: break-all` | `overflow-wrap: anywhere`, which breaks only when it must |
| Wrong initials (`J` for "Jo", `CI` for "… III", `�` for an emoji) | `.split(' ')[0][0]` | Grapheme clusters (`Intl.Segmenter`), first + last word, a fallback icon |
| Orphaned `—` or empty line where an optional field was | Placeholder rendered for a missing value | Omit the line, or reserve its height on purpose |
| "1 members", "0 member" | Hardcoded plural | `Intl.PluralRules`, or one string per count |
| Numbers jitter on update, columns misalign | Proportional figures | `font-variant-numeric: tabular-nums` |
| `1284`, `1,284.000000001`, `NaN`, `undefined` | Raw number rendered | `Intl.NumberFormat` with the user's locale; guard null |
| Translated button label overflows | Fixed-width button | Width from content with `min-width`, never a fixed `width` |
| Vietnamese or Thai marks clipped top or bottom | Tight `line-height` with `overflow: hidden` | A looser `line-height`, or no clipping on text boxes |
| Broken-image icon in the avatar | No `onError` fallback | Fall back to initials; `object-fit: cover` for any aspect ratio |
| Truncated text nobody can read in full | `text-overflow: ellipsis` and nothing else | The full value somewhere real (policy below) |
| Scrolling 1,000 rows stutters | Every row rendered | Virtualize or paginate, and say which |
| Raw `<b>`, `&amp;amp;` or `**text**` shows | Escaped at the wrong layer | Escape once, at render; never `dangerouslySetInnerHTML` on user data |

**Truncate, wrap or clamp, per field, never globally:**

- **Wrap** what identifies something: names, titles in a detail view. Two lines is fine; four
  means the column is too narrow.
- **End-truncate** secondary metadata whose start carries the meaning (role, description,
  message preview). The full value must exist somewhere real, such as a detail view or an
  expandable row. A `title` alone does not count: `references/components.md` forbids a tooltip
  as the only place for a fact.
- **Middle-truncate** when items differ at the end: file names (`Q3-report…v12-final.pdf`),
  URLs, hashes, emails sharing a domain. End-truncation makes them identical.
- **Clamp** (`line-clamp: 2`) card previews so card heights stay predictable.
- **Never truncate** numbers, amounts or dates. Give them the room.

A field with two right answers goes to "Decisions for you" (§8).

## 8. Report

Written in the user's language. Broken scenarios first, in the parent's scale and cap:

```markdown
## Stress test: <component>

Page: http://localhost:5173/_states/clip-card | not opened: <reason>
Kept: <scenarios> · Dropped: <axes and why>

| # | Sev. | Scenario | Observed | Fix in |
|---|---|---|---|---|
| 1 | P1 | 60-character file name | Pushes the ••• menu off the row at 400 px | `min-width: 0` on the text column, `flex-shrink: 0` on the menu (`ClipCard.tsx:42`) |
| 2 | P2 | 0 clips | Blank area, no message | `references/states.md`, Empty |
| 3 | P2 | Error | Raw `Error: 500` text | `references/review-copy.md` |

### Decisions for you
- <field>: truncate or wrap? Recommend <choice>, because <reason>.

### What held up
- <worst cases the component already handles>

### To check, not seen
- <scenario>: <what the code suggests> (`file:line`)
```

- Every fix names `file:line`, or a reference file when the fix is a pattern.
- **Decisions for you** holds breaks with more than one right answer (truncate or wrap, what
  an empty role shows, paginate or virtualize), each with a recommendation. Omit it when empty.
- **What held up** lists the worst cases that passed. It shows the test was real and tells the
  user what not to touch. Never skip it on a report with findings.
- "Nothing broke" is a complete report: list what was rendered.

The page stays while the user looks at it; when the task ends, delete it and its fixtures
unless the user wants to keep them. A worst-case fixture the user keeps is the regression test
for the next change to the component.

## 9. Harden, only when asked

1. Fix in the order of `references/review-ui.md` §6: lost data and blocked tasks, then missing
   states, then overflow and formatting.
2. Each fix follows the file named in "Fix in", and changes the component, not the page.
3. Re-render the failing scenarios on the same page and update the table: Before | After.
4. Re-check the kind-data (demo) case too: a worst-case fix must not regress it.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Every axis against every component | The axes that can happen, and the dropped ones named |
| `aaaa…` or a 5,000-character name | A realistic example or the schema's real limit; "unbounded" is a finding |
| Picking values before listing what the component renders | The surface map first, every value with a source and a limit |
| A copy of the component styled for the test | The real component, imported |
| Hand-editing the markup or CSS to show the break | Changing the data at the props or stub boundary |
| All the failures stacked in row 1 | Spread across the first rows |
| One truncation rule for the whole component | Wrap, end, middle or clamp, chosen per field |
| `title` as the only place the full value lives | The full value in the UI itself |
| Truncating a number, amount or date | Give it the room |
| `real-person@gmail.com` in a fixture | `example.com`, `example.org` or `.test` |
| Broken/Ugly/Fragile as a second severity scale | `P0`–`P3`; "fragile" goes to "To check, not seen" |
| Screenshots of each scenario, a browser debugged for an hour | One page, one look |
| "Probably overflows on mobile" | Rendered and seen, or left out |
| Fixes while testing | The report first; fixes on request |
| A fix checked only on the worst case | Re-check the kind-data case too |
| The test page left in the build | Deleted when the user is done |
