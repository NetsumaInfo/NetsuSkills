# Any other language: build the rules before writing

Load when a UI language has no `references/words-<code>.md`. Dedicated files exist for `fr`, `en`,
`es`, `de`, `ja` and `zh`: load those instead. This file has no lexicon. It says what already
applies, where the rules for the language come from, and how to record them.

## What already applies

`scripts/scan.mjs copy` runs these rules on every string, whatever its language:

| Rule | Catches | Limit |
|---|---|---|
| `long-button` | A button over 5 words or 32 characters | Scripts without spaces count as one word |
| `all-caps` | A string written in capitals, or a `WARNING:` prefix | Fires only on words it recognises (fr, en, es, de word lists, Cyrillic); the prefix form in every cased language. Skips caseless scripts |
| `exclamation`, `emoji`, `ellipsis` | `!`, emoji, `...` | None |
| `placeholder-persona` | John Doe, Acme, Lorem ipsum | Local fake names are not on the list |
| `invented-number` | `99.9%`, `4.8/5`, "10,000+ users" | The "users" words are English and French |
| `vague-action` | A bare OK, Submit, Yes, Click here | English and French labels only: read every other button yourself |
| `title-case` | Every word capitalised | Latin, Cyrillic and Greek scripts; not German |
| `placeholder-mismatch`, `locale-missing`, `not-translated`, `edge-space` | Broken placeholders, missing keys, text left in code, glued strings | Needs several locale files and the code in one scan |
| `address-mixed`, and the `Note: address` tally | Formal and informal "you" mixed | Pronouns only; de, es, ru, uk, zh |
| `paren-plural`, `pinned-locale`, `long-tooltip` | `fichier(s)` in fr, en, es, de, it, pt; a fixed locale in `Intl`; a tooltip over 80 characters (40 in CJK) | pinned-locale needs two UI languages |
| `cjk-punct` | A half-width `,` `.` `;` next to Chinese or Japanese text | `：` `？` `！` follow `DESIGN.md` |
| `lexicon` | Nothing | Needs `words-<code>.md` |

Run `node <skill dir>/scripts/scan.mjs copy --list` first and read the language column. The code
comes from the locale folder (`locales/it/`, `messages/pt-BR.json`), then `--lang`, then the string:
its script for Japanese, Chinese, Korean, Cyrillic, Arabic, Hebrew and Thai, word lists for French,
English, Spanish and German. One or two words take their file's language. Check the guess before
trusting a finding. The scan's `Note` lines name the languages it found without a lexicon.

The rules in `SKILL.md` hold in every language. In practice:

- Use the words users say, from the glossary in `DESIGN.md`. One word per concept.
- Actions: a verb and its object, in the language's button grammar (table below).
- Errors: what happened, then what to do.
- No invented numbers, names or ratings.
- Never build a sentence from fragments. One message, named placeholders, and an ICU plural with
  every category `Intl.PluralRules` returns for that language.
- Numbers, dates and percentages come from `Intl` with the full locale (`pt-BR`, not `pt`). Never
  type a separator by hand.
- Sentence case, in scripts that have case.

## Build the rules, in this order

### 1. The project's own words

1. List the strings in that language with `node <skill dir>/scripts/scan.mjs copy --list --json`
   and keep the entries whose `lang` is the code.
2. Read the glossary in `DESIGN.md` and any glossary the translators keep (a termbase, a
   `glossary.*` file, a column in the locale spreadsheet).
3. Note which address form the strings use, and count each form (the scan's `Note: address`
   line does it for de, es, ru, uk, zh). A mix is a bug to report, not a vote to win.
4. Words already shipped win over everything below, unless they break a rule above.

### 2. The platform guides

- **Microsoft localization style guides.**
  `https://learn.microsoft.com/en-us/globalization/reference/microsoft-style-guides` lists 102
  guides (page updated 2025-05-02, every link checked 2026-09-16). Each one is a PDF of 0.7 to
  1.8 MB: ask before downloading. Read the "Microsoft voice" sample tables (they show the address
  form in use), "Words and phrases to avoid" (a dated list of stiff words, usable as `check`
  rows), "Pronouns", "Punctuation" and "Error messages". Write down the PDF's date.
- **Apple.** Human Interface Guidelines, "Right to left" (read 2026-09-16): what to flip, numerals.
- **Google.** Material Design, "Bidirectionality" (m1.material.io, read 2026-09-16): which icons to
  mirror. Android pseudolocales `en-XA` (longer accented text) and `ar-XB` (right-to-left) expose
  layout breaks (Android Developers, updated 2026-02-26).
- **Government design systems.** They set register and plain-language rules for public services.
  Each address below answered on 2026-09-16:

| Code | Source |
|---|---|
| it | Designers Italia (designers.italia.it) and its "Guida al linguaggio della Pubblica Amministrazione" |
| pt-BR | Padrão Digital de Governo (gov.br/ds), UX writing principles |
| pt-PT | Mosaico and the Ágora Design System (mosaico.gov.pt) |
| nl | NL Design System (nldesignsystem.nl) |
| pl | Gov UI style guide (aplikacje.gov.pl/app/govpl-front-styleguide) |
| ko | KRDS, Korea Design System (krds.go.kr) |
| ar | UAE Design System (designsystem.gov.ae): every component supports right-to-left |
| hi | UX4G (ux4g.gov.in) |
| sv | Myndigheternas skrivregler (isof.se) |

Not checked for ru, uk, tr, he, id, vi, th. What these sites say on address forms is unverified.

### 3. The quick-reference table, then a native speaker

The table below is a starting point: the project and the guide win over it. Then ask a native
speaker to review the glossary, the address form and ten real strings before release. Never write
a list of AI tells for a language without a dated source: a guessed ban list looks authoritative
and nobody can check it.

### Record the result

Add one row per language under `## Voice` in `DESIGN.md`, and a column for the language in
`### Words we use` and `### Examples`:

```markdown
| Language | Address | Buttons | Words we use | Sources | Native review |
|---|---|---|---|---|---|
| it | tu | Imperative: Salva, Annulla | IT column of the glossary | Microsoft Italian style guide (2025-02-17) | <role>, <date> |
| pl | ty | Imperative: Zapisz, Anuluj | PL column of the glossary | Microsoft Polish style guide (2025-09-12) | <role>, <date> |
```

## Quick reference

MS: that language's Microsoft style guide (dates in `## Sources`). LP: LocaleProof, 2026-07-06,
vendor planning ranges with no dataset behind them. Numbers and plurals: Node 22.16.0 (ICU 77.1,
CLDR 47), run 2026-09-16; U+00A0 is the non-breaking space it outputs. `it`, `pt-PT` and `pl`
leave four-digit numbers ungrouped: `1234`.

| Code | Address: options, usual choice | Buttons | Punctuation, quotes | `Intl.NumberFormat` | Dir | Length vs EN | Plural categories |
|---|---|---|---|---|---|---|---|
| it | tu / Lei; tu in MS samples | Imperative: `Salva`, `Annulla` (MS) | No space before `? ! :`; MS accepts the source's quotes | `1.234.567,89` | ltr | +10–25% LP | one, many, other (one million is `many`) |
| pt-BR | você (MS) | Infinitive: `Salvar`, `Cancelar` (MS) | Quotes follow the source (MS) | `1.234.567,89` | ltr | +20–30% LP | one, many, other; 0 is `one` |
| pt-PT | Verb without pronoun: `Pretende continuar?` (MS) | Infinitive for commands: `Guardar`; imperative in instructions (MS) | `“Abrir”` (MS example) | `1 234 567,89` U+00A0 | ltr | +20–30% LP | one, many, other; 0 is `other` |
| nl | u / je; MS: u historically, je growing, per product | Infinitive: `Opslaan`, `Annuleren` (MS) | MS: `‘ ’` for section names | `1.234.567,89` | ltr | +20–35% LP | one, other |
| pl | ty / Pan, Pani; ty in MS samples (`Nadaj`, `kliknij`) | Imperative: `Zapisz`, `Anuluj` (MS) | `„ ”` (MS) | `1 234 567,89` U+00A0 | ltr | +20–30% LP | one, few, many, other (2 few, 5 many, 22 few) |
| ru | ты / вы; вы in MS samples | Infinitive `Сохранить`, noun `Отмена` (MS) | MS: straight quotes in UI, `« »` in print | `1 234 567,89` U+00A0 | ltr | +15–25% LP | one, few, many, other |
| uk | ти / Ви; MS: avoid ти | Infinitive: `Зберегти`, `Скасувати` (MS) | MS: straight quotes in UI, `« »` in docs | `1 234 567,89` U+00A0 | ltr | +15–25% LP | one, few, many, other |
| tr | sen / siz; siz, sen for young audiences and marketing (MS) | Stem `Kaydet`, noun `İptal` (MS) | Straight quotes (MS). Apostrophe before a suffix on a UI name: `İptal’e` (MS example). Upper case with `toLocaleUpperCase('tr')`: `i` gives `İ` | `1.234.567,89`; percent `%50` | ltr | No figure found | one, other |
| ko | 합니다 statements, 하세요 requests; "you" dropped (MS) | Noun: `확인`, `취소` (MS) | UI names in `[ ]` (MS) | `1,234,567.89` | ltr | −10–15% LP, sign as printed; W3C sample word ×0.8 | other |
| ar | No T–V; "you" is masculine or feminine: ask the reviewer. MS: imperative `افتح`, not `قم بفتح` | Verbal noun: `إلغاء الأمر` (MS) | `،` and mirrored `؟` (MS); 0, 1, 2 not written as digits (MS) | `ar` `1,234,567.89`; `ar-EG` `١٬٢٣٤٬٥٦٧٫٨٩` | rtl | +20–25% LP | zero, one, two, few, many, other |
| he | אתה in MS, softened: `באפשרותך`, `ניתן`, `יש ל…` | Verbal noun: `שמירה בשם`, `ביטול` (MS) | No capitals: quotes mark titles; numbers under 10 in words (MS) | `1,234,567.89` | rtl | ±0–15% LP | one, two, other |
| hi | आप (MS samples) | Polite imperative: `सहेजें`, `हटाएँ` (MS) | Full stop `.`, not `।` (MS) | `12,34,567.89` | ltr | No figure found | one, other; 0 is `one` |
| id | Anda (MS) | Base verb: `Simpan`, `Batal` (MS) | `“ ”`, then `‘ ’` inside (MS) | `1.234.567,89` | ltr | No figure found | other |
| vi | bạn (MS samples) | Verb: `Lưu`, `Hủy` (MS) | No space before `. ? !`; closing quote before `.` and `,` (MS) | `1.234.567,89` | ltr | No figure found | other |
| th | คุณ (MS) | Verb: `ยกเลิก` (MS) | A space where English has a comma; little punctuation (MS) | `1,234,567.89` | ltr | No figure found | other |
| sv | du (MS samples) | Imperative: `Spara`, `Avbryt` (MS) | `” ”`, both closing (MS) | `1 234 567,89` U+00A0; `50 %` | ltr | No figure found | one, other |

Short strings grow most. W3C "Text size in translation" (edited 2016-02-01) quotes IBM, by
English length: up to 10 characters 200–300%, 11–20 180–200%, 21–30 160–180%, 31–50 140–160%,
51–70 151–170%, over 70 130%. Test the real string at the narrowest width.

The plural column, as run:

```
$ node -e "console.log(new Intl.PluralRules('pl').resolvedOptions().pluralCategories)"
[ 'few', 'many', 'one', 'other' ]
$ node -e "for (const l of ['it','pt-BR','pt-PT','nl','pl','ru','uk','tr','ko','ar','he','hi','id','vi','th','sv','fa','ur']) console.log(l.padEnd(6), new Intl.PluralRules(l).resolvedOptions().pluralCategories.join(' '))"
it     many one other
pt-BR  many one other
pt-PT  many one other
nl     one other
pl     few many one other
ru     few many one other
uk     few many one other
tr     one other
ko     other
ar     few many one two zero other
he     one two other
hi     one other
id     other
vi     other
th     other
sv     one other
fa     one other
ur     one other
```

Direction: `((l) => (l.getTextInfo?.() ?? l.textInfo).direction)(new Intl.Locale('ar'))` is `rtl`.

## Right-to-left: Arabic, Hebrew, Persian, Urdu

Sources: W3C, "Structural markup and right-to-left text in HTML" and "Inline markup and
bidirectional text in HTML" (both last substantive update 2021-06-25, edited 2026); Apple HIG
"Right to left"; Material Design "Bidirectionality".

- **Direction in the markup.** `<html lang="ar" dir="rtl">`. Never set the base direction with CSS
  `direction`. Put `dir` on a block only when its direction differs from the page.
- **Logical CSS.** `margin-inline-start`, `padding-inline-end`, `inset-inline-start`,
  `border-inline-start`, `text-align: start`. Tailwind: `ms-*`, `me-*`. Find the physical ones:
  `grep -rnE "(margin|padding)-(left|right)|text-align: *(left|right)|\b(ml|mr|pl|pr)-[0-9]" src`
- **User content.** `dir="auto"` on inputs, textareas and anything that shows user text. `<bdi>`
  around an inserted name or title. `unicode-bidi: isolate` in a component's CSS. In plain text
  with no markup (a notification, `document.title`), wrap the value in U+2068 and U+2069
  (FSI, PDI). Never U+202A to U+202C: they do not isolate.
- **Numbers.** The digits of one number never reverse. Wrap a phone number, code, version or file
  size in `<bdi>` or `<span dir="ltr">`. In a progress bar, slider or rating, reverse the order of
  the numbers with the control (Apple). Digits by locale, from `Intl.NumberFormat` on Node 22:
  `ar` Western `1,234,567.89`; `ar-EG` and `ar-SA` Eastern Arabic `١٬٢٣٤٬٥٦٧٫٨٩`; `fa`
  `۱٬۲۳۴٬۵۶۷٫۸۹`; `he` and `ur` Western. Name the market in `DESIGN.md` and pass that locale.
- **Type.** Arabic and Hebrew have no capitals: next to all-caps Latin they look small, and Apple
  suggests about 2 pt more. Never make emphasis out of uppercase or tracking: `letter-spacing` must
  not break Arabic joins, so browsers drop it or stretch the letters (CSS Text 3).
- **Icons.** Flip only the directional ones, with
  `:dir(rtl) .icon-directional { transform: scaleX(-1); }` (`:dir()`: Baseline since December
  2023, MDN).

| Mirror | Do not mirror |
|---|---|
| Back and forward arrows, next and previous | Logos, even with text in them |
| Progress bars and sliders, with their end labels | The checkmark and other universal marks |
| Icons that draw text: alignment, lists, indent | Clocks, and refresh or progress circles turning clockwise |
| Icons of forward motion: a speaker's sound waves | Media playback buttons and the media progress bar |
| A volume icon with its slider on the right | Physical objects: keyboards, media players |
| The order of a meaningful image sequence (not the images) | Tools held in the right hand; the slash of an "off" icon |
| | Photos and illustrations: make a new version if needed |

Test: set `dir="rtl"` on `<html>` with real Arabic or Hebrew strings, screenshot every changed
screen. On Android, the `ar-XB` pseudolocale.

## Scripts without spaces between words: Thai, Lao, Khmer, Myanmar

Sources: W3C "Approaches to line breaking" (edited 2026-04-09), CSS Text 3 (Candidate
Recommendation Draft, 2026-08-14), CSS Text 4 (Working Draft, 2026-08-14), W3C "Thai Script
Resources" (Group Note Draft, 2026-03-20), MDN `word-break` (2026-04-20).

- **Declare the language.** `lang="th"` (or `lo`, `km`, `my`) on `<html>` or the element. Browsers
  break these scripts with a dictionary; language-specific rules apply only to declared text.
- **Keep `word-break: normal`.** `break-all` treats the letters as ideographs and splits words.
  `keep-all` does not touch these letters (Unicode line-break class SA). `line-break` values only
  change Chinese, Japanese and Korean text. Keep `overflow-wrap: anywhere` for URLs and codes.
- **No new values.** `word-break: auto-phrase` is experimental; `word-break: manual` works nowhere.
- **A wrong break.** Put U+200B (zero width space) or `<wbr>` where the break belongs, with a code
  comment: both are invisible in review. W3C: ZWSP is no longer needed for normal text, and typed
  by hand it lands in the wrong place or twice.
- **Spaces separate phrases, not words.** Never strip or collapse them, never add one between
  words. The Microsoft Thai guide puts a space where English has a comma.
- **Count, cut and highlight by segment**, never by character index:

```js
[...new Intl.Segmenter('th', { granularity: 'word' }).segment('ส่งออกวิดีโอทั้งหมด')]
  .filter((s) => s.isWordLike).map((s) => s.segment)
// Node 22: [ 'ส่ง', 'ออก', 'วิดีโอ', 'ทั้งหมด' ]
```

- **Thai numbers and dates.** `Intl.DateTimeFormat('th')` gives a Buddhist year: `16 ก.ย. 2569`.
  `th-TH-u-ca-gregory` gives `2026`. Thai digits are in common use (W3C) but `th` formats Western
  ones; `th-TH-u-nu-thai` gives `๑,๒๓๔,๕๖๗.๘๙`. Decide both in `DESIGN.md`.
- **Stacked marks.** Thai places vowels and tone marks above and below the letter. Look for
  clipping under a tight `line-height` or `overflow: hidden`.

## Adding a dedicated file later

- **Name.** `references/words-<code>.md`, picked up by `scripts/scan.mjs` on its own. `<code>` is
  the two letters the locale folder starts with: `pt-BR` and `pt-PT` both read `words-pt.md`, so
  split the register inside it. A three-letter code (`fil`, `yue`) is not recognized.
- **Shape.** Copy `references/words-fr.md`: a loading note, then `## Register`, `## Typography`,
  `## Length`, `## Choosing between two words`, two or three lexicon tables (40 to 70 rows in
  total), `## Patterns`, `## Examples` (8 to 12 before and after pairs, one column per address
  form), `## Sources`, `## Anti-patterns`. Under 300 lines.
- **Lexicon tables.** Only under headings that start with `## Lexicon`, exactly three cells:

```
| Pattern | Write instead | Level |
|---|---|---|
| `sumérgete` `sumérjase` | Say what the screen contains | block |
```

- Cell 1: backticked literal patterns, space-separated, matched on word boundaries, any case. A
  trailing `*` means any letters after; `'` and `’` match each other; a space matches a
  non-breaking one. Cell 3: `block` (wrong in any UI) or `check` (context decides).
- **Every row is backed.** A measured AI tell has a dated source in `## Sources`. Anything else is
  listed there as a house rule. No source, no label, no row.
- **Words that change shape.** Korean and Turkish add endings: end the pattern with `*`
  (`솔루션*` also matches `솔루션을`). Arabic and Hebrew add prefixes (`ال`, `و`, `ב`, `ה`, `ל`):
  list the prefixed forms as separate patterns. Thai, Lao, Khmer and Myanmar have no boundary
  between words. `scripts/scan.mjs` matches `ja`, `zh`, `ko` and `th` patterns as plain
  substrings (`NO_WORD_BOUNDARY`); add `lo`, `km` or `my` there in the same change.
- **Prove it.** Run the scan on a folder holding one known bad string. The `Note` line must no
  longer name the language, and the string must be flagged. Then a native speaker reads the
  lexicon.

## Sources

- Microsoft localization style guides, index page updated 2025-05-02, read 2026-09-16. PDF dates
  (Last-Modified, read 2026-09-16): Italian 2025-02-17; Polish 2025-09-12; Ukrainian 2025-09-05;
  Hebrew 2026-05-11; Urdu 2025-02-13; Portuguese (both), Dutch, Russian, Turkish, Korean, Arabic,
  Hindi, Indonesian, Vietnamese, Thai, Swedish, Persian 2025-02-06.
- W3C Internationalization: "Structural markup and right-to-left text in HTML" (edited
  2026-05-10), "Inline markup and bidirectional text in HTML" (edited 2026-04-19), "Approaches to
  line breaking" (edited 2026-04-09), "Text size in translation" (edited 2016-02-01).
- CSS Text Module Level 3, W3C Candidate Recommendation Draft, 2026-08-14. Level 4, Working Draft,
  2026-08-14. Thai Script Resources, W3C Group Note Draft, 2026-03-20.
- Apple HIG, "Right to left", and Material Design, "Bidirectionality" (m1), both read 2026-09-16.
  Android Developers, "Test your app with pseudolocales", updated 2026-02-26.
- MDN, `word-break` (2026-04-20), `:dir()` (2026-04-17). Tailwind CSS, "margin", read 2026-09-16.
- LocaleProof, "Text expansion by language", 2026-07-06. Vendor ranges; another vendor (DTP
  Services Berlin, undated) prints different ones for Hebrew and Korean.
- Not verified: government design system content on address forms; expansion figures for tr, hi,
  id, vi, th, sv; how Arabic products handle the gender of "you".

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Translating the English string word for word | The project's words, then the platform guide, then a native review |
| Picking the address form from a hunch | The form the project uses, recorded under `## Voice` |
| A list of "AI words" for Italian written from memory | No lexicon until each row has a dated source or a house-rule label |
| `"12,345.6"` typed into a Polish string | `Intl.NumberFormat('pl')`: `12 345,6` with U+00A0, and `1234` ungrouped |
| `one` and `other` plural forms for Polish, Russian or Arabic | Every category `Intl.PluralRules` lists for the locale |
| `margin-left` and `left: 0` in a component that ships in Arabic | `margin-inline-start`, `inset-inline-start` |
| Every icon flipped with `scaleX(-1)` in right-to-left | Only directional icons; logos, checkmarks, clocks and media controls stay |
| A user's name inserted raw into Hebrew text | `<bdi>` or `dir="auto"` around it |
| `word-break: break-all` on a Thai layout that overflows | `lang="th"`, `word-break: normal`, a ZWSP where one break is wrong |
| `str.slice(0, 20)` to truncate Thai | `Intl.Segmenter` and a cut at a segment boundary |
| `"i".toUpperCase()` in a Turkish UI | `toLocaleUpperCase('tr')` |
| A clean scan read as "the Italian copy is fine" | The scan has no Italian lexicon: read every string |
