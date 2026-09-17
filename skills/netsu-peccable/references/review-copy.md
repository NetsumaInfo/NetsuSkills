# Review existing text

Find and fix product text that reads as generated, stiff, vague or inconsistent. Load this when
the user says "sounds like AI", "too formal", "nobody talks like that", or asks to review, audit
or clean up the copy.

Report first. Change files only when the request asks for changes.

## 1. Scope

| The user said | Scope | Paths |
|---|---|---|
| "the app", "all the text", "the tooltips" | Whole app | `src` (the scan's default), the locale folder, and every folder that writes text a user sees: a core service, setup scripts, installer strings. In a monorepo, each app and shared package |
| "this screen", "the settings page" | One screen | The screen's file, its child components, its keys in every locale file |
| "the landing page", "the store listing" | One page | The page's files and its metadata (`<title>`, meta description, Open Graph). Judge it against `references/copy-pages.md` §2 and §6 |
| "before I merge", "this branch" | Branch diff | Add `--changed <base>` to every scan, e.g. `--changed main` |

Store listings, email templates and release notes in `.md` or `.txt` are scanned only when passed
by path; code fences tagged `text` count as text. Files the scanner cannot read (`.ps1`, `.nsh`,
`.rs`, server templates) are read by hand.

## 2. Load the voice

1. Read `## Voice` in `DESIGN.md` (or `VOICE.md` next to it): languages, source language, address
   form per language, tone, and `### Words we use`. No design file: run `references/setup.md` first.
   It infers the address form and the glossary from the same inventory as step 3. A report-only
   request gets the draft design file at the end of the report, nothing written. A design file with
   no voice section: run setup for the voice only; its report-only rule applies.
2. Load `references/words-<lang>.md` for each language you will rewrite, or
   `references/words-any.md` when it has no file. For a language you only check, the scan applies
   its lexicon; read its Quick reference row in `words-any.md` and send its fixes to a
   translator. Load `references/states.md` before proposing any error, empty or loading message.

## 3. Collect

`scripts/` is this skill's folder, not the project's. Run the script by its full path, from the
project root, on the code and the locale folder together: comparing them is how the scan finds
text left in code and keys nothing uses. `<scratch>` is the session's scratch folder.

```bash
node <skill dir>/scripts/scan.mjs copy <paths> --list
```

Write down the number of strings and the languages. That count heads the report.

The scan reads string literals. It misses text built at run time: template literals, strings
joined in code, server messages shown as they arrive. Find those by hand:

```bash
grep -rnE '`[^`]*\$\{' <paths> --include=*.{js,jsx,ts,tsx,vue,svelte} | grep -iE 'toast|notif|error|message|alert|confirm|title'
grep -rnE '\b(err|error|e|cause|reason|msg|ex)\??\.(message|stack)\b|\.stack\b|as Error\)\??\.message|JSON\.stringify\((err|error|e)\b|String\((e|err|error|res|cause|reason)\)|\$\{(e|err|error|cause)\}' <paths> --include=*.{js,jsx,ts,tsx,vue,svelte}
```

Then find the project's own display helpers, the functions every message goes through
(`showErrorMessage`, `setStatus`, a toast wrapper), and grep their call sites: a raw error object
or a literal passed there reaches the screen even when the variable has another name.

Every hit that reaches the screen is a P0, except on a screen whose job is to show raw text: a
console, a log viewer, a bug report. Never add `-P`: Git Bash on Windows ships a grep whose `-P`
fails or returns nothing.

## 4. Mechanical pass

```bash
node <skill dir>/scripts/scan.mjs copy <paths> --address vous > <scratch>/copy-before.md
```

Pass the `--address` form from `DESIGN.md`. Without one, drop the flag: the scan then takes the
majority form, which its `Note: address` line shows. Drop it too for a product with no French.
Keep this file outside the repository: it is the "before" of step 9.

With several UI languages, the scan compares the locale files. `placeholder-mismatch` is a
string that shows broken text (a `{count}` translated to `{contar}`). `locale-missing` counts
the keys a language lacks. `not-translated` is text left in code. A hint ending in "key not found
in the scanned code" sits on a string the code may never show: list those under "Dead strings"
and fix them last. The scan marks them only when it sees most of the app; on a one-screen scan a
note says so, and nothing is dead.

The output is a table `| where | text | rule | level | hint |`, then counts per rule. It is a
regex heuristic: it misses strings and sometimes flags code. Read each finding in context. Never
apply a fix straight from its output.

## 5. Read in context

Open each screen's strings in the order a user meets them, not in file order. When keys name no
screen (flat keys, sentences used as keys), grep each key back to its component. Ask of every
string:

1. Would a user say this word out loud to a colleague?
2. Is it the word from `### Words we use`?
3. Does the button say what happens when it is pressed? Does the tooltip add what the label
   cannot hold (the target, the shortcut, the limit), in the UI language?
4. Does the error say what happened and what to do next?
5. Is it said once? No title repeating the body, no toast repeating the inline message.
6. Are the register and the address the same as on every other screen?
7. Is it true? Every claim about what the product does matches the code or the project's docs
   (`AGENTS.md`, `PRODUCT.md`). On a page that sells, build the fact sheet of
   `references/copy-pages.md` §1 first.

A string that passes all seven stays as it is, even with a `check` finding on it.

**Glossary drift**: one concept named with different words across files. Test these sets and
every "Never say" word from `DESIGN.md` against the inventory:

| Concept | EN variants | FR variants |
|---|---|---|
| Remove | delete, remove, erase, trash | supprimer, effacer, retirer, enlever |
| Sign in | sign in, log in, login, connect | se connecter, s'identifier, connexion, login |
| Settings | settings, preferences, options, configuration | réglages, paramètres, préférences, options |
| Save | save, apply, update | enregistrer, sauvegarder, appliquer |
| Add | add, create, new | ajouter, créer, nouveau |
| Main object | the product's noun and its rivals: project, workspace, file | projet, espace, dossier |

These sets are a start. Build the real ones from the product's own nouns and verbs: read the
inventory and group the words that name the same thing.

```bash
node <skill dir>/scripts/scan.mjs copy <paths> --list --json > <scratch>/copy-list.json
node -e 'const s=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8")).inventory;for(const w of process.argv.slice(2)){const re=new RegExp("(^|[^\\p{L}])"+w,"iu");const n={};for(const x of s)if(re.test(x.text.replace(/\{[^}]*\}|\$\w+\$/g,"")))n[x.lang]=(n[x.lang]||0)+1;console.log(w,JSON.stringify(n))}' <scratch>/copy-list.json supprim effac retir delete remove
```

It prints the number of strings per language that contain a word starting with each stem. Keep
the glossary word, or the one users say when there is no glossary. Short stems catch other words
("fil" in "filtres"): read the hits before counting.

Drift across languages, one concept translated several ways: this prints, for every key whose
source-language value contains the word, its value in each language.

```bash
node -e 'const [f,w,l]=process.argv.slice(1);const s=JSON.parse(require("fs").readFileSync(f,"utf8")).inventory;const re=new RegExp(w,"iu");const keys=new Set(s.filter(x=>x.key&&x.lang===l&&re.test(x.text)).map(x=>x.key));for(const x of s)if(keys.has(x.key))console.log(x.key,"|",x.lang,"|",x.text)' <scratch>/copy-list.json rush fr
```

## 6. Severity

| Level | Means | Examples |
|---|---|---|
| P0 | Misleading, broken, blaming, or leaking internals | A raw `error.message`, a stack trace or a bare error code on screen; "Saved" shown when the save failed; a claim the product does not keep; a broken placeholder; "You entered it wrong" |
| P1 | Blocks understanding | "OK" on a destructive dialog; an error with no fix; `tu` and `vous` mixed; an English string in the French UI; keys missing in a language; drift on a main concept |
| P2 | Slop, hype, filler, typography | A lexicon `block` hit; "avec succès", "successfully"; missing French non-breaking spaces; Title Case |
| P3 | Polish | A word that could be shorter; a `check` hit that could be plainer; straight and curly apostrophes mixed |

## 7. Report

Group by screen, P0 first inside each group. Write the whole report, headings included, in the
user's language. `<n>` is the scan's string count for the scope; say what it missed (run-time
strings, files it cannot read).

```markdown
## Copy review: <scope>

<n> strings, <languages>. Address: <vous>. Scan before: <b> block, <c> check.
Design file: <DESIGN.md | draft at the end of this report>.

### <Screen>

| Where | Now | Proposed | Why | Severity |
|---|---|---|---|---|
| `src/export/ExportDialog.tsx:42` | Une erreur est survenue | Export impossible : le disque est plein. Libérez de l'espace, puis réessayez. | No cause, no fix | P1 |

### Glossary drift

| Concept | Words found (count) | Keep |
|---|---|---|
| Remove | supprimer (14), effacer (3), retirer (1) | supprimer |

### Scan counts before

<the counts table from step 4>

### Scan hits dropped

<one line per group of false positives: rule, count, why>

### Needs a translator

| Key | Language | Now | Problem |
|---|---|---|---|

### Dead strings

<findings on keys the code never names, with their count>

### Not reviewed

<run-time strings you could not read, languages you cannot judge>
```

When the screens are reviewed as well, these rows go in the `references/review-ui.md` findings
table (Now and Why become Problem, Proposed becomes Fix, the rule stays), and keep the severity
this file gives them. Both scales put raw internals and false claims at P0.

## 8. Apply, only when asked

- Edit the source of truth: the locale file of the source language, then the other locale files.
  A hardcoded string is edited where it is. Do not move it into i18n unless asked.
- Never rename or move a key. Adding the `_one` / `_other` (or ICU) forms a plural fix needs is
  fine. Never touch logic, conditions or props: a fix that needs code (a missing error branch, a
  hardcoded conjunction) goes in the report as a code change for the user.
- Keep every placeholder and plural branch intact: `{count}`, `{{name}}`, `%s`, `<0>…</0>`, ICU
  `plural` cases. The exception is a placeholder that leaks internals (a function name, a path,
  a raw error): drop it from the string and report that the code still passes it.
- A vague error gets its real cause: read the code path that raises it. Several causes: name the
  most common, and the fix that works for all of them.
- Update French and English together when both exist. Any other language: do not rewrite it
  blind. List its keys under "Needs a translator" and leave the old text.
- Legal text (terms, privacy, consent, billing conditions): propose the change, apply it only
  after the user says yes.
- A label that got longer: check it in its component at the narrowest width. French runs longer.

## 9. Proof

```bash
node <skill dir>/scripts/scan.mjs copy <touched files> --address vous --strict
```

Exit code 0 means zero `block` findings on the touched files. Pass locale files by their real
path: the scan recognizes them by folder (`locales/`, `i18n/`, `messages/`…) or by name
(`fr.json`, `locales/fr.ts`); a file passed by name is always read, and one it cannot read is
named in a note. Then show:

- the counts per rule, before and after;
- 3 to 5 before/after pairs, P0 and P1 first;
- a screenshot of one changed screen if the project can run. Otherwise say which screen was not
  observed.

## 10. Do not over-fire

- **Formal is not slop.** A bank can say `vous` and `veuillez`. Judge against `## Voice`, not
  against taste.
- **French typography is not English typography.** A space before `:`, « » and spaced dashes are
  correct French. Never run English checks on French text.
- **Names and quotes are exempt.** A hit inside a proper noun, a brand, a plan name ("Boost"),
  quoted user content or a legal citation is fine.
- **A lexicon hit is a prompt to read, not a verdict.** If the sentence is already the plainest
  way to say it, leave it and say why.
- **Leave passing strings alone.** A review that touches every string hides the ten that
  mattered.
- **Never accuse anyone of using AI.** Report the words and the fix.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Rewrites 300 strings from the scan output | Reads each finding in context, changes the ones that fail a step 5 question |
| Reviews file by file | Groups by screen, in the order a user meets it |
| Switches `vous` to `tu` because it sounds friendlier | Keeps the form from `DESIGN.md` |
| Renames `errors.generic` while fixing its text | Changes the value, never the key |
| Rewrites the German file by guessing | Lists it for a translator |
| Swaps "Une erreur est survenue" for another vague sentence | Reads the code, names what failed |
| Makes the terms of service sound friendlier | Proposes the change and asks |
| "The copy now sounds more human" | Counts before and after, and the pairs |
| A clean scan reported as a clean review | Step 5 anyway: the scan misses run-time strings and vague sentences with no listed word |
