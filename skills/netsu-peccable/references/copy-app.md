# Text inside the product

Buttons, labels, errors, empty states, dialogs, toasts, settings, onboarding, push notifications
and transactional emails. The output is strings in the product's own words, in the right file,
with proof.

Paths to `scripts/scan.mjs` are relative to this skill's folder. French examples use *vous*. If
`## Voice` says *tu*, convert every verb, and never mix the two in one product.

## 1. Load the voice

1. Read `## Voice`, `### Words we use` and `### Examples` in `DESIGN.md` (or `VOICE.md`). No design file: run
   `references/setup.md` first, then come back.
2. Load `references/words-<lang>.md` for each UI language you write, or `references/words-any.md`
   when that language has no file.
3. The string belongs to a state (empty, loading, error, success, disabled, offline, partial,
   stale, confirm): load `references/states.md` as well.

Ask every question now, in the same message as any setup question: the name of the object, the
address form, whether the action can be undone. Once writing starts, an open choice takes the
word the product already uses.

## 2. Find where the string lives

```bash
grep -rnF "<the visible text, or the key>" src
find src \( -name '*.json' -o -name '*.ts' -o -name '*.js' \) | grep -iE "(locales|i18n|lang|translations|messages)/|/(fr|en)([-_][A-Z]{2})?\.(json|ts|js)$"
node <skill dir>/scripts/scan.mjs copy src --list
```

- Text a user sees can also come from a core service, a setup script or an installer: search
  there too.
- The project has i18n: edit or add a key in the locale files, never a literal in the component.
- Reuse a key only when the meaning is the same, not just the wording. EN "Open" on a button and
  "Open" as a status are two keys: « Ouvrir » and « Ouvert ».
- Name keys by place and meaning (`export.dialog.title`), not by their text (`delete_3_clips`).
- Take the noun from `### Words we use`. When the glossary is silent, `--list` shows what the
  product already says: 40 hits for "rush" and 2 for "clip" means the product says "rush".
- Write the source language from `## Voice` first, then translate from it. Add every locale in
  the same change: a missing key ships as the raw key or as the fallback language.

## 3. Write by string type

| Type | Rule | FR | EN |
|---|---|---|---|
| Button | Verb + object, 1 to 4 words, one line (about 25 characters in French). FR: infinitive; never « Je… », « Oui, j'accepte » or the imperative « Consultez ». EN: imperative, sentence case | Exporter la timeline | Export timeline |
| Link | Makes sense read alone, in a list of links | Voir les formats acceptés | See supported formats |
| Label | A noun, always visible, never replaced by the placeholder | Adresse e-mail | Email address |
| Placeholder | An example of a real value, or nothing. Never the label, never an instruction | nom@exemple.fr | name@example.com |
| Helper text | Format and limits before the user types, not after the error | 60 caractères maximum | Up to 60 characters |
| Field error | What is wrong and how to fix it, in the label's words. The input stays as typed | L'adresse e-mail doit contenir un @ | Email address must include an @ |
| Form error | Summary at the top: the count, then one link per field, same text as inline | 2 champs à corriger | 2 fields to fix |
| System error | What failed, why when known, what to do now | Impossible de lire ce fichier. Il est peut-être encore en cours de copie. | Can't read this file. It may still be copying. |
| Empty state | Why it is empty, then the next action | Aucun rush pour l'instant. Glissez un dossier pour commencer. | No clips yet. Drop a folder to start. |
| Confirmation | Title: action + object, as a question. One line of consequence. Buttons repeat the verb. Prefer undo when the action can be undone | Supprimer 3 rushs ? / Supprimer | Delete 3 clips? / Delete |
| Toast | The result, past tense, with Undo when it applies. Never "successfully" or « avec succès ». An error toast stays until dismissed | 3 rushs supprimés. Annuler | 3 clips deleted. Undo |
| Loading | Name the operation and its object | Export de 3 rushs… | Exporting 3 clips… |
| Success | Name the thing, and where it went | Timeline exportée dans Montage/Export | Timeline exported to Editing/Export |
| Onboarding | One step, shown where it happens. The empty state is the first step; no tour of the interface | Glissez un dossier de rushs ici. | Drop a folder of clips here. |
| Setting | Label: what happens when it is on. Description: the consequence | Ouvrir le dernier projet au démarrage / Sinon, l'app s'ouvre sur la liste des projets. | Open last project on startup / Otherwise the app opens on the project list. |
| Tooltip | What the label cannot hold: the target, the shortcut, the limit. Never the label again | Scinder à la tête de lecture (S) | Split at playhead (S) |
| Push notification | What happened, then what to do. Two lines at most. No teaser | Export terminé : Montage_v3.mp4 / Ouvrez le dossier Export pour le récupérer. | Export finished: Edit_v3.mp4 / Open the Export folder to get it. |
| Transactional email | Template below | | |

Sources for the table: button form from the Québec government design system, *Libellés des
boutons* (updated 2026-01-15); verb first, sentence case and no period on titles from the
Microsoft Writing Style Guide, *Top 10 tips* (2026-07-02); one term per concept from Shopify's
app content guidelines (shopify.dev, read 2026-09-16).

**Alt text and accessible names.** Alt text says what the image shows or what the link does, in
the UI language; a decorative image gets `alt=""`. A control with a visible text label has a
name that contains that text (WCAG 2.2 SC 2.5.3, read 2026-09-17), so voice control finds it. An
icon button has no visible label: its name uses the tooltip's verb.

**Tooltips, in every language.** One short phrase that adds what the label cannot hold, in the UI
language, translated like any other string. A fragment takes no final period: no `.` in English
or French, no `。` in Japanese or Chinese; a full sentence keeps it. The scan's `long-tooltip`
flags one over 80 characters, or 40 in Chinese, Japanese or Korean, where each character carries
more. A keyboard shortcut is written the way the platform shows it (`Ctrl+S`, `⌘S`).

### Errors: the words to drop

GOV.UK Design System, *Error message* (read 2026-09-16): no "sorry", "please", "valid",
"invalid", "oops", "you forgot", "forbidden"; reuse the label's words; same text inline and in
the summary. NN/g, *Error-Message Guidelines* (Neusesser and Sunwall, 2023-05-14): show the
error next to its source and keep the original input so the user edits it instead of starting
over. Apple HIG, *Writing* (2025-12-16): clear over cute, no blame, no "oops". Atlassian Design
System, error messages (read 2026-09-16): a title of 3 to 4 words, a body of 1 or 2 sentences.

| Before | After |
|---|---|
| Saisie invalide | L'adresse e-mail doit contenir un @ |
| Invalid ID | Enter an ID like AB-1234 |
| Oups ! Une erreur est survenue. Veuillez réessayer. | Impossible d'enregistrer le projet. Le disque est plein : libérez de la place, puis réessayez. |
| Sorry, you forgot to enter a name | Enter a project name |
| Error 0x80070070 | Can't save the project. The disk is full. (Put the code in a details line for support.) |

Missing or wrong input is not the user's fault in the sentence: « Le nom du projet est vide »
blames nobody, « Vous n'avez pas saisi de nom » does.

### Transactional email

| Part | Rule | FR | EN |
|---|---|---|---|
| Sender | The product's name | Nom de l'app | App name |
| Subject | What happened, with the object | Votre export « Montage_v3 » est prêt | Your export "Edit_v3" is ready |
| Preheader | The next fact, not a repeat of the subject | Lien valable jusqu'au 30 septembre | Link works until September 30 |
| First line | The information itself | Montage_v3.mp4 (2,1 Go) est prêt à télécharger. | Edit_v3.mp4 (2.1 GB) is ready to download. |
| Action | One button, verb + object | Télécharger le fichier | Download file |
| Fallback | The same link, written out | https://… | https://… |
| Why | Why this person gets it, and how to stop | Vous recevez cet e-mail parce que vous avez lancé cet export. Gérer les e-mails | You're getting this because you started this export. Manage emails |

Send a plain-text part that reads the same as the HTML one. No greeting line before the
information, no "We're excited to…", no second call to action.

## 4. i18n

**Whole sentences, never fragments.** Translators reorder words; concatenation freezes the
English order.

```js
// Before
t("deleted") + " " + count + " " + t("clips")
// After
t("clips.deleted", { count })
```

**Plurals through the library.** ICU MessageFormat (FormatJS, react-intl, Lingui) or i18next's
`_one` / `_other` keys. French puts 0 in `one` and English puts it in `other`, so write the zero
case yourself when it deserves its own sentence (`=0` in ICU, `_zero` in i18next).

```json
{
  "clips.deleted": "{count, plural, =0 {Aucun rush supprimé} one {# rush supprimé} other {# rushs supprimés}}"
}
```

Browser extensions: `chrome.i18n.getMessage` has substitutions and no plural rules. Store one
message per form and pick it with `new Intl.PluralRules(locale).select(count)`.

**Numbers, sizes, dates and relative times through `Intl`**, with the UI locale, never by hand:

```js
new Intl.NumberFormat("fr-FR", { style: "unit", unit: "gigabyte", maximumFractionDigits: 1 }).format(2.1) // "2,1 Go"
new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(date)                                     // "30 septembre 2026"
new Intl.RelativeTimeFormat("fr", { numeric: "auto" }).format(-5, "minute")                             // "il y a 5 minutes"
```

In a multilingual app, pass the current language (`i18n.language`), never a fixed `"fr-FR"`: a
fixed locale shows French dates in every language.

French output contains non-breaking spaces (`2,1 Go`, `12 345,5`): never compare it to a
string typed with an ordinary space in a test.

**Leave room for French.** Localization vendors put French at 15 to 35% longer than English for
running text, and labels under 10 characters can double or more (LocaleProof, *Text expansion by
language*, July 2026, which gives 15 to 20% for French and +100 to 200% for short strings). No
fixed width on buttons, tabs or column headers. Look at the screen in French before calling it
done.

**Agreement.** « 1 rush supprimé » but « 1 vidéo supprimée »: an object whose gender varies
needs an ICU `select` or its own key, never a shared participle.

**Translating existing strings.** Load `references/words-<lang>.md` for the target language (or
`references/words-any.md`). Translate from the source language, never from another translation.
Write what a native user of that product would read, not a word-for-word copy: the target
language's address form, button grammar and punctuation. Keep keys, plural branches and
placeholders, whose names are never translated (`{count}`, not `{contar}`). Add the plural forms
the target language needs (`Intl.PluralRules(<lang>)`). List the strings a native speaker should
check before release.

## 5. Proof

```bash
node <skill dir>/scripts/scan.mjs copy <touched files> --address vous
```

Locale files carry their language in their path. For strings inline in components, add
`--lang <code>`, one run per UI language. `--address` applies to French only.

1. Zero `block` findings. Read each `check` finding in context: the scan is a regex heuristic,
   it misses strings built at run time and can flag code. Never auto-fix from its output.
2. Read every changed string aloud, in the order the user meets them. A string you would not say
   to a colleague at the next desk gets rewritten.
3. Report changed strings as a before/after table, and new strings as `Where | Text`:

| Where | Before | After |
|---|---|---|
| `locales/fr.json` `export.error.missing` | Une erreur est survenue | Impossible de trouver 2 rushs. Ils ont été déplacés ou renommés. |
| `locales/en.json` `export.error.missing` | An error occurred | Can't find 2 clips. They were moved or renamed. |

4. If the app can run, screenshot the changed screen in each language, at the narrowest width
   the product supports. If it cannot run, say which strings were not seen rendered.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| "Submit", "OK", « Oui », « Valider » on every button | « Exporter la timeline », "Export timeline" |
| "Export Timeline" | "Export timeline" |
| « Je veux exporter », « Cliquez pour exporter », « Exportez » on a button | « Exporter » |
| The placeholder is the label | A visible label, and an example as placeholder |
| "Invalid input", « Saisie invalide » | "Email address must include an @" |
| "Oops! Something went wrong. Please try again." | What failed, why, what to do now |
| The form is cleared after an error | The input stays; focus goes to the error summary |
| "Successfully saved!", « Enregistré avec succès ! » | "Project saved", « Projet enregistré » |
| « Chargement… » during a 20-second export | « Export de 3 rushs : 45 % » |
| "Are you sure?" with Yes / No | "Delete 3 clips?" with Delete / Cancel |
| A tooltip "Split" on a button labelled Split | "Split at playhead (S)" |
| A seven-step welcome tour | The empty state shows the first action |
| "clip", "media" and "asset" for the same object | The one word in `### Words we use` |
| `t("deleted") + n + t("files")` | One key with an ICU plural |
| `n + " Go"`, `date.toLocaleString()` with no locale | `Intl` with the UI locale |
| Push: "You won't believe what's new" with an emoji | "Export finished: Edit_v3.mp4" |
| English first, French added in a later change | Source language first, every locale in the same change |
