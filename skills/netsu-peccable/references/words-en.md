# English: words and typography

Load before writing or reviewing an English string. `scripts/scan.mjs` reads the three
`## Lexicon` tables below, so keep each row to three cells: backticked patterns first, `block` or
`check` last. A pattern matches whole words, ignores case, treats `'` and `’` alike, and a
trailing `*` means "any letters after". `block` is wrong in any UI. `check` means read it in
context.

## Register

- **"You" for the reader.** "We" only when the company does something a person can picture:
  "We'll email your receipt". What the app does on screen needs no subject: "Saved", not
  "We've saved your file".
- **Pick "your" or "my" for the user's things** ("Your projects") and keep it on every screen.
- **Contractions are fine** (it's, you're, don't) unless the tone in `DESIGN.md` says otherwise.
  Microsoft Writing Style Guide, "Use contractions" (updated 2026-07-06, read 2026-09-16)
  recommends them, and adds two rules worth keeping: never mix "can't" and "cannot" in one UI,
  and avoid awkward ones (there'd, it'll, they'd).
- **Buttons: verb plus object.** "Export video", "Send invite". A bare "OK", "Submit", "Yes",
  "Learn more" is caught by the scan's `vague-action` rule.
- **Errors: what happened, then what to do.** No please, sorry, valid, invalid, oops, forbidden,
  illegal or "you forgot" (GOV.UK Design System, error message component, read 2026-09-16).
- **Plain words.** GOV.UK's A to Z style guide (read 2026-09-16) lists the swaps: deliver to
  make, facilitate to the real verb, leverage to use, utilise to use. It lists "in order to"
  among phrases to avoid, and says "select", not "click".
- **One idea per sentence, active voice, the verb itself.** "We couldn't save the file", not
  "The file could not be saved"; "decide", not "make a decision". Passive is fine when the
  actor does not matter: "3 clips were renamed".

## Typography

| Case | Write | Notes |
|---|---|---|
| Capitals | "Account settings", "Export video" | Sentence case for buttons, titles, menus, tabs (Microsoft Style Guide, "Capitalization", updated 2026-07-06). Vercel's Web Interface Guidelines ask for Title Case on headings and buttons (read 2026-09-16): do not adopt that rule |
| Periods | "Export video", "Account settings" | No period on headings, titles, buttons or labels. Full sentences keep theirs |
| Quotes | “Q3 report”, can’t | U+201C, U+201D, U+2019. In JSX text a straight `'` trips `react/no-unescaped-entities`; the curly one does not |
| Ellipsis | "Exporting…", "Rename…" | U+2026, never `...`. On an action label only when it opens a step that asks for more |
| Counts | "8 files" | Numerals, not "eight files" |
| Units | `10\u00A0MB` | Non-breaking space; `&nbsp;` in JSX text or HTML. `Intl.NumberFormat('en-US', { style: 'unit', unit: 'megabyte' })` joins with a plain space (Node 22): replace it |
| Displayed dates | "Sep 16, 2026" | `Intl.DateTimeFormat(locale, { dateStyle: 'medium' })`. Never `09/10/2026`: US and UK readers see two different days |
| Plurals | "1 file", "0 files" | `Intl.PluralRules('en')` or ICU `{count, plural, one {# file} other {# files}}`. Never "file(s)" |
| All caps | "Delete" in the string | Uppercase comes from CSS if the design wants it, never from the string |
| Exclamation marks | None in errors and warnings | At most one, for a real milestone |

## Choosing between two words

When two words fit, take the one people say more often. The glossary in `DESIGN.md` wins over
this: if users say "clip", the product says "clip".

Tie-breaker: SUBTLEX-US, word frequencies from about 51 million words of US film and TV
subtitles (Brysbaert and New, 2009). Subtitle counts predict how fast people read a word better
than book counts do. Look words up on the SUBTLEX-US page (Ghent University) or through the npm
package `subtlex-word-frequencies` (code under ISC, data terms not stated). Never copy the data
into the project.

Pairs worth a lookup: use / utilize, help / assist, start / commence, buy / purchase,
get / obtain, more / additional, before / prior to, about / regarding, end / terminate.

## Lexicon: filler and politeness

| Pattern | Write instead | Level |
|---|---|---|
| `please` | Delete in instructions and errors: it implies a choice. Keep one when you ask a real favor | check |
| `please note` `kindly` | Delete. State the fact | block |
| `very` `really` `basically` `actually` | Delete, or say how much: "3 times faster" | check |
| `sorry` `we apologize` `we apologise` `unfortunately` | Delete in errors. Apologize only when the company caused real harm: an outage, lost data | check |
| `oops` `whoops` `uh-oh` `uh oh` `yikes` | Delete. Say what happened | block |
| `successfully` | Delete: "File uploaded" | block |
| `simply` `easily` `just` `quickly` | Delete. In an instruction it blames the reader when it fails. "Just now" is fine | check |
| `in order to` | "to" | check |
| `in the event that` `prior to` `at this time` | "if", "before", "now" | check |
| `it's important to note` `it is important to note` `it's worth noting` | State the fact | block |
| `additionally` `moreover` `furthermore` | Delete, or "also" | check |
| `an error occurred` `an error has occurred` `unknown error` `an unexpected error` | Say what failed and what to do: "Couldn't save. Check your connection and try again." | block |
| `something went wrong` | Only with the next step and, when known, the cause | check |
| `invalid` `valid` | Show what's expected: "Use 8 or more characters". "Valid until" is fine | check |
| `are you sure` | Name the action and its result: "Delete 3 files?", then "You can't undo this." | check |
| `click here` `tap here` | Put the link on the words that say where it goes | block |
| `click` | "select"; on touch, "tap". Or name the action. A gesture name (Ctrl + click, double-click) is fine | check |
| `submit` | Say what happens: "Send request", "Pay" | check |
| `hang tight` `sit tight` | Say what's happening and for how long: "Exporting 3 of 12…" | block |
| `all set` | Say what's ready: "Your workspace is ready" | check |
| `welcome aboard` | "Welcome", then the first action | check |
| `let's get started` `let's go` | Name the first step: "Import a folder" | check |
| `we're excited` `we are excited` `we're thrilled` `we're delighted` | Delete. Say what changed | block |
| `dear user` `dear customer` `valued customer` | The person's name, or nothing | block |
| `thank you for your patience` | Say when it will be done | check |

## Lexicon: hype and AI tells

| Pattern | Write instead | Level |
|---|---|---|
| `utiliz*` `utilis*` | "use" | block |
| `leverag*` | "use". Fine in finance, where leverage is the product | check |
| `facilitat*` | The real verb: "run", "help" | check |
| `seamless*` | Delete, or say what's gone: "no setup" | block |
| `robust*` | Name what it survives: "keeps your edits offline" | check |
| `empower*` | "lets you" | block |
| `unleash*` `supercharg*` `turbocharg*` | Say what gets faster, with a number | block |
| `elevate` `elevates` `elevating` | Say what improves | block |
| `streamlin*` | Say which step is gone | block |
| `revolutioniz*` `revolutionis*` `revolutionary` | Delete. Say what's new | block |
| `game-changer` `game changer` `game-changing` | Delete | block |
| `next-gen` `cutting-edge` `blazing*` | Say what's new, or give the number | block |
| `next-generation` `state-of-the-art` | Keep only with a benchmark and its method | check |
| `best-in-class` `world-class` `enterprise-grade` `industry-leading` | Name the proof: a certification, a number | block |
| `innovative` `groundbreaking` `transformative` `unparalleled` `full potential` | Delete | block |
| `solution` `solutions` `ai-powered` | Name the thing and what it does: "the app", "suggests titles" | check |
| `effortless*` `hassle-free` | Give the steps or the time: "in 2 clicks" | block |
| `in today's world` `in today's digital` `in today's fast` `ever-evolving` | Delete. Start with what the product does | block |
| `fast-paced` `ever-changing` | Delete, unless it describes a game | check |
| `delve*` | "look at", or delete | block |
| `dive into` `deep dive` `let's dive` | Delete, or "see" | block |
| `tapestry` `testament to` `valuable insights` | Delete, or say what it proves | block |
| `pivotal` `meticulous*` `nestled` `boasts` | Delete | block |
| `crucial` | Delete, or say why it matters | check |
| `vibrant` | Fine for a color setting; otherwise delete | check |
| `foster*` | "help", "encourage". Also a surname | check |
| `showcas*` | "show". Fine as a feature name | check |
| `underscor*` | "shows". Fine for the _ character | check |
| `intuitive` `powerful` | Show it; don't claim it | check |
| `comprehensive` | Say what it covers | check |
| `ensur*` | Name what makes it true | check |
| `enhanc*` | Say what changed | check |
| `unlock*` | Fine for a lock or a paid plan; otherwise say what becomes possible | check |
| `harness*` | "use" | check |
| `journey` `embark*` | Name the steps; "start" | check |
| `magically` `like magic` | Say what happens | block |
| `boost*` | Say what gets faster, with the number. Fine in games | check |
| `not just` `whether you're` | Say the one thing, for the one user this screen serves | check |

## Lexicon: jargon

| Pattern | Write instead | Level |
|---|---|---|
| `execute` `executes` `executing` `execution` | "run" | check |
| `terminat*` | "end", "stop", "close" | check |
| `abort*` | "stop", "cancel" | check |
| `authenticat*` | "sign in", "confirm it's you" | check |
| `credentials` | What's actually asked: "email and password" | check |
| `instance` `instances` | The name users know: "server", "workspace" | check |
| `payload` | Say what: "file", "request" | check |
| `null` `undefined` | A bug: show a fallback such as "Untitled" or "Not set" | check |
| `parameter*` | "setting", "option" | check |
| `configur*` | "set up", "settings" | check |
| `functionality` | "feature", or its name | check |
| `commence*` | "start" | check |
| `purchas*` | "buy". Fine on a receipt | check |
| `obtain*` | "get" | check |
| `additional` | "more", "other" | check |
| `assistance` | "help" | check |
| `regarding` | "about" | check |
| `the user` | "you" | check |
| `login to` | "Log in to": the verb is two words | check |
| `timeout` `timed out` | Say what didn't answer and what to do | check |
| `request failed` `failed to fetch` | Say what failed: "Couldn't load your files. Check your connection." | block |
| `forbidden` `illegal` `prohibited` | Say what isn't allowed and why | check |
| `you forgot` `you failed` | Don't blame: "Enter your email" | block |

## Patterns

No word list catches these. Read for them.

| Pattern | Rewrite |
|---|---|
| "Not just X, it's Y", "It's not X, it's Y" (Wikipedia) | Say Y |
| "Whether you're X or Y" | Write for the one user this screen serves |
| A trailing "-ing" clause: "…, making it easy to share" (Wikipedia) | Two sentences, or cut the tail |
| Three items in every list | The number of items there really are |
| "We're excited to announce…" | Say what changed: "You can now export to MP4." |
| A question as a heading: "Why choose X?" | A statement: "What X does" |
| A closing line: "Happy editing!", "Let us know if you have questions" | Stop after the last useful sentence |
| An emoji at the start of every bullet or toast | No emoji unless `DESIGN.md` asks for them |

## Examples

| Before | After |
|---|---|
| Oops! Something went wrong. | Couldn’t save your changes. Check your connection and try again. |
| File uploaded successfully! | File uploaded |
| Are you sure? | Delete “Q3 report”? You can’t undo this. |
| Please enter a valid email address. | Enter an email address like name@example.com |
| Submit (quote form) | Send request |
| Click here to learn more | How billing works |
| Unlock the full potential of your workflow with our seamless, AI-powered solution. | Rename 200 clips at once from a spreadsheet. |
| Hang tight! We're processing your request... | Exporting 3 of 12 clips… |
| Invalid date | Enter the date as MM/DD/YYYY, for example 09/16/2026 |
| Authentication failed. Please verify your credentials. | That email and password don’t match. Try again or reset your password. |
| Account Settings | Account settings |
| Welcome aboard! Let's get started on your journey. | Welcome. Import a folder to see your clips. |

## Sources

- Wikipedia, "Wikipedia:Signs of AI writing", read 2026-09-16. Its own caveat: these are
  potential signs of a problem, not proof, and hiding them only makes detection harder.
- GOV.UK A to Z style guide and GOV.UK Design System error message component, read 2026-09-16.
- Kobak et al., "Delving into LLM-assisted writing in biomedical publications through excess
  vocabulary", Science Advances 11(27), 2025-07-02: a measured jump in style words across
  15 million PubMed abstracts, 2010 to 2024.
- Microsoft Writing Style Guide, "Use contractions" and "Capitalization", updated 2026-07-06.
- Vercel Web Interface Guidelines, read 2026-09-16: numerals, non-breaking spaces before units,
  the ellipsis character. Its Title Case rule is not followed here.
- House rules, no dated measurement behind them: hang tight, all set, welcome aboard,
  supercharge, next-gen, best-in-class, hassle-free. They are weak product copy, not proven
  AI tells.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| "Oops! Something went wrong. Please try again later." | What failed, and the one thing to do now |
| "Settings Saved Successfully!" | "Settings saved" |
| Title Case because a guideline asked for it | Sentence case everywhere |
| "Utilize", "leverage", "facilitate" in a settings screen | "Use", "run", "help" |
| "We" for everything the app does | No subject for app actions; "we" when the company acts |
| Every `just` and `click` rewritten on sight | Read the string; `check` rows are prompts, not verdicts |
| A frequency list pasted into the project | A lookup when two words tie, nothing shipped |
