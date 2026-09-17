# Design

<!-- Written with netsu-peccable. Read this before writing any screen, component or string a
user will see. Keep it short: a rule nobody follows is noise. Replace every <placeholder>;
delete a line rather than leave it vague. -->

## Product

- What it is: <one sentence, in the words a user would use>
- Who uses it, and where: <e.g. video editors, on a second screen, in the middle of a session>
- Platforms: <web | desktop | mobile | browser extension | plugin panel>

## Voice

- UI languages: <fr, en, es>. Source language: <fr>. Translations follow the source, not the
  reverse.
- Address, per language: <fr: tu | vous>, <es: tú | usted | vos>, <de: du | Sie>,
  <ja: です・ます | plain>, <zh: 你 | 您>. One form per language, never mixed.
- Market, per language: <fr: fr-FR | fr-CA>, <es: es-ES | es-MX | es-419 | neutral>,
  <de: de-DE | de-AT | de-CH>, <zh: zh-CN | zh-TW | zh-HK>. Numbers, dates and regional words
  follow it.
- Inclusive forms, per language: <de: none | pair | colon | star>, <fr: none | pair>. Delete the
  line if the product has no rule.
- Script conventions, per language: <ja: buttons noun | verb; space before Latin none | half-width;
  ？！ full-width | half-width; ellipsis … | ...; colon ： | :>,
  <zh: space before Latin typed | text-autospace>.
  Defaults are in `words-ja.md` and `words-zh.md`.
- Tone: <three words, e.g. direct, calm, precise>. Not: <three words, e.g. cute, salesy, formal>.
- Everyday words: a string must be something a user could say out loud to a colleague.
- Sentence case everywhere: buttons, titles, menus, tabs.

### Words we use

One word per concept, in every screen, email and store listing.

One column per UI language.

| Concept | FR | EN | Never say |
|---|---|---|---|
| <main object> | <rush> | <clip> | <asset, média> |
| <main action> | <exporter> | <export> | <générer, process> |

### Words we never use

<Product-specific bans, on top of the lexicon the skill already applies. Delete if none.>

### Examples

This is how the product sounds. New strings copy this register.

| Where | FR | EN |
|---|---|---|
| Primary button | <Exporter la timeline> | <Export timeline> |
| Error | <Impossible de lire ce fichier. Il est peut-être encore en cours de copie.> | <Can't read this file. It may still be copying.> |
| Empty state | <Aucun rush ici. Glisse un dossier pour commencer.> | <No clips yet. Drop a folder to start.> |
| Success | <3 clips exportés dans Montage/Export.> | <3 clips exported to Editing/Export.> |

## Look

- Direction: <one sentence, e.g. "a dense dark editor, like a pro video tool, not a marketing site">
- Looks like: <apps or sites we borrow from>. Does not look like: <looks we refuse>
- Density: <compact | comfortable>. Theme: <dark | light | both, default: …>
- Fonts: <UI font>, <second font and its only use>. Loaded from <file or package>.
- Colors: tokens live in <file, e.g. src/index.css @theme>. Accent <token>, used only for <the
  primary action and the current selection>.
- Radius: <e.g. 6px controls, 8px panels>. Shadows: <none | one level, for overlays only>.
- Spacing scale: <4 8 12 16 24 32>.
- Icons: <library, stroke width>. One library only.
- Motion: <minimal | standard>. Durations <120 to 200 ms>. Reduced motion keeps the feedback and
  drops the movement.

## Components

- Library: <e.g. shadcn/ui in src/components/ui, or the project's own in src/components>
- Every interactive component has: default, hover, focus-visible, active, disabled (with the
  reason shown), loading, error, and empty when it holds data.

## Checks

- The netsu-peccable `copy` scan on `<src and locale folders>`: interface text
- The netsu-peccable `ui` scan on `<src>`: generic AI look, focus, transitions
- <the project's own lint, type-check and i18n commands>
