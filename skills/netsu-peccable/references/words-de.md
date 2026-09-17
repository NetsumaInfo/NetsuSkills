# German: words and typography

Load before writing or reviewing a German string. `scripts/scan.mjs` reads the three
`## Lexicon` tables below, so keep each row to three cells: backticked patterns first, `block` or
`check` last. A pattern matches whole words, ignores case, treats `'` and `’` alike, and a
trailing `*` means "any letters after". `block` is wrong in any UI. `check` means read it in
context. The scan also flags straight quotes in German (`de-quotes`), counts `du` and `Sie` in its
`Note: address` line and flags the rarer form (`address-mixed`, pronouns only). It does not
check Title Case in German, where nouns take a capital: read for it.

## Register

- **Address and market come from `## Voice` in `DESIGN.md`**: the `de` entries of its `Address`
  line (`du | Sie`) and its `Market` line (`de-DE | de-AT | de-CH`). If either is missing, run
  `references/setup.md`. One form for the whole product: screens, emails,
  notifications, store listing. Never pick one yourself, never mix them.
- **What large products do.** `Sie` is prescribed by KERN UX-Standard 2.8.1, the public-sector
  design standard started by Hamburg and Schleswig-Holstein, and used in Microsoft
  products (German localization style guide, updated 2025-01-08, which switches to `du` for
  users under 18 and for Copilot prompts addressed to the AI). Consumer brands use `du`:
  apple.com/de does throughout (read 2026-09-16).
- **Capitals.** `Sie`, `Ihr`, `Ihnen` always take a capital: `sie` means "she" or "they".
  `du`, `dein`, `euch` stay lowercase on screens. Duden allows a capital `Du` only in letters,
  emails and similar texts, and recommends it there (Sprachratgeber, "Groß- oder Kleinschreibung
  von du/Du", read 2026-09-16). Pick one spelling for the product's emails and keep it.
- **Buttons: infinitive, verb last, one line.** `Speichern`, `Datei speichern`,
  `Speichern unter`, `Konto löschen`. Not `Speichere`, not `Speichern Sie`. Microsoft's German
  guide names commands this way (`Datei öffnen`, `Homepage festlegen`, `Abbrechen`); no guide
  found states the rule outright. KERN: short labels, no two-line labels, mixed case.
- **Instructions: imperative, in the product's form.** `Wählen Sie einen Ordner aus.` or
  `Wähle einen Ordner aus.` A separable verb puts its particle at the end: keep that end outside
  a placeholder (Microsoft guide, Copilot prompts).
- **Short, active sentences.** At most 20 words and two subordinate clauses, verbs instead of
  nominal style (KERN, "Sprache und Tonalität"). No subjunctive: indicative or imperative
  (Microsoft guide).
- **Errors.** Microsoft writes `Die Datei kann nicht geöffnet werden.` or
  `… konnte nicht … werden`, never a sentence that starts with `Konnte … nicht`; `nicht genügend`,
  not `nicht ausreichend`; the definite article instead of `Ihr`, unless ownership matters.
- **Everyday words.** The same guide swaps `erfordern` for `benötigen`, `partiell` for
  `teilweise`, `Mobiltelefon` for `Handy`, `im Internet browsen` for `im Internet surfen`, and
  prefers `App` to `Anwendung` or `Programm`.

## Gender

The status, as of 2026-09-16:

- **Rat für deutsche Rechtschreibung, 2023-12-15.** It does not recommend asterisk, underscore,
  colon or any other character inside a word for the official rules. It describes them in a
  supplement on special characters and lists criteria for gender-fair text: correct,
  understandable, readable, pronounceable, legally unambiguous, translatable, focused on what
  matters, no obstacle to learners.
- **Duden** (Sprachratgeber, "Geschlechtergerechter Sprachgebrauch", undated, read 2026-09-16).
  Only the pair form (`Kolleginnen und Kollegen`) and the slash with hyphen
  (`Mitarbeiter/-innen`) follow the official rules. Star, colon, underscore and `Binnen-I` are
  outside core spelling though spreading. There is no norm.
- **Practice differs.** Microsoft's German guide (2025-01-08) moved away from the gender star
  to neutral nouns, plurals, participles and "Person" phrasing. KERN (2.8.1) writes
  `Nutzer:innen`. Bavaria bans word-internal gender characters in state administration and
  schools since 2024-04-01 (Bavarian state portal).

Do this, in order:

1. Address the reader. `Sie` or `du` removes most role nouns: `Ihr Konto`, not
   `das Konto des Nutzers`.
2. A neutral noun or a plural participle: `Team`, `Mitglieder`, `Teilnehmende`, `Lehrkraft`,
   `Kundschaft` (Microsoft).
3. Rephrase: `Alle im Meeting sehen Ihren Bildschirm`.
4. In running text, the pair form: `Nutzerinnen und Nutzer`.
5. A gender character only when `DESIGN.md` names one (the `de` entry of its `Inclusive forms`
   line: `none | pair | colon | star`), then that one everywhere. Never for a Bavarian state client.

## Typography

| Case | Write | Notes |
|---|---|---|
| Quotes | `„Bericht“` | U+201E then U+201C: the closing mark is the English opening one, never U+201D. `»Bericht«` (U+00BB, U+00AB) is common in books. Switzerland uses `«Bericht»` (Wikipedia DE, "Anführungszeichen", edited 2026-09-02). Microsoft favors „…“ and lists straight quotes as the alternate |
| Capitals | `Neues Projekt erstellen` | Nouns take a capital, nothing else does. No English Title Case in titles or strings (Microsoft) |
| Compounds | `Dateiname`, `Homepage-Dateiname`, `Open-Source-Lizenz` | One word up to three parts; a hyphen beyond that, where letters collide, and after a product name, `Skype-Version` (Microsoft). A multiword English stem is hyphenated throughout (Duden, "Bindestrich") |
| Line breaks | `lang="de"` and `hyphens: auto` | Browsers hyphenate only when `lang` is set and a dictionary exists (MDN, "hyphens", updated 2026-07-21). Add `&shy;` (U+00AD) break points in long words on buttons and table headers. Never `word-break: break-all` |
| Money | `1.234,56\u00A0€` (de-DE), `€ 1.234,56` (de-AT), `CHF 1’234.56` (de-CH) | `Intl.NumberFormat` output, Node 22. de-CH groups with U+2019; Microsoft's guide shows a straight apostrophe |
| Percent, units | `50\u00A0%`, `4\u00A0GB` | `Intl` de-DE already puts U+00A0 in both. de-CH prints `50%` |
| Date | `16.09.2026`, `16. September 2026` | `dateStyle: 'medium'` and `'long'`. `Intl` joins the long form with plain spaces: set `white-space: nowrap` |
| Time | `14:30`, `14:30 Uhr` in a sentence | `Intl` prints `14:30`. Adding `Uhr` is a house convention, not checked against a source |
| Ellipsis | `Wird geladen…` | U+2026, no space before it for an ongoing action (Microsoft). Duden sets a space before it when it stands for whole words left out |
| Dashes | `Export fertig – 3 Dateien` | The en dash, with spaces, is the German Gedankenstrich. Microsoft does not use the em dash in German |
| ß | `Straße` (de-DE, de-AT), `Strasse` (de-CH) | Switzerland writes `ss` (Swiss Federal Chancellery, Schreibweisungen, seen through search results). `text-transform: uppercase` and `toUpperCase()` turn `ß` into `SS`; the capital `ẞ` (U+1E9E) is official since 2017-06-29 (Microsoft) |
| Plural | `0 Dateien`, `1 Datei`, `2 Dateien` | `Intl.PluralRules('de')` has `one` and `other`; 0 is `other`. Never `Datei(en)` |

How to type them:

- In a JS, TS or JSON string: `"\u201EBericht\u201C"`, `"50\u00A0%"`,
  `"Kontoein\u00ADstellungen"`, or the characters themselves in a UTF-8 file.
- In JSX text, `\u201E` renders as six characters. Write `&bdquo;Bericht&ldquo;`, `&nbsp;`,
  `&shy;`, `{"\u00AD"}`, or the characters. U+00A0 and U+00AD are invisible in review: say so in
  the diff.

## Length

- German runs 20 to 35% longer than English, as a planning range (LocaleProof, updated July
  2026, which calls its figures ranges, not guarantees). Strings under 10 English characters can
  grow 200 to 300% (IBM figures quoted by W3C, "Text size in translation", read 2026-09-16).
- Word length breaks layouts before sentence length does: "Input processing features" can
  become `Eingabeverarbeitungsfunktionen` (W3C, same article). Test the longest word at the
  narrowest width.
- A button stays on one line (KERN). Shorten the word or rephrase with a preposition, as
  Microsoft advises for complex compounds. Never truncate a button with `…`.

## Choosing between two words

When two words fit, take the one people say more often. The glossary in `DESIGN.md` wins over
this, even when its word is rarer.

Tie-breaker: SUBTLEX-DE, word frequencies from film and TV subtitles (Brysbaert et al.,
Experimental Psychology 58(5), 2011). The data sits on OSF (osf.io/py9ba, updated 2025-07-09)
with the same `license.txt` as SUBTLEX-ESP, CC BY-NC-SA 4.0: non-commercial, so look words up
and never copy the data into the project.

Pairs worth a lookup: `benötigen` / `brauchen`, `erhalten` / `bekommen`, `verwenden` / `nutzen`,
`auswählen` / `wählen`, `durchführen` / `machen`, `aufrufen` / `öffnen`, `beenden` / `schließen`.

## Lexicon: filler and politeness

| Pattern | Write instead | Level |
|---|---|---|
| `zögern sie nicht` `zögere nicht` `zögert nicht` | Delete. Give the action: "Schreiben Sie uns", "Schreib uns" | block |
| `bitte` | Delete in instructions and errors. Keep one when you ask a real favor | check |
| `leider` | Delete in errors. Say what failed and what to do; apologize only for real harm | check |
| `sehr geehrter nutzer` `sehr geehrte nutzerin` `liebe nutzer` `lieber nutzer` `liebe nutzerin` `sehr geehrter kunde` `sehr geehrte kundin` `lieber kunde` `liebe kundin` | The person's name, or nothing | block |
| `wir entschuldigen uns` `entschuldigen sie die unannehmlichkeiten` `wir bitten um ihr verständnis` `wir bitten um dein verständnis` `vielen dank für ihre geduld` `danke für deine geduld` | Say what broke and when it will work again | check |
| `hoppla` `huch` `oje` `upps` `ups!` | Delete. Say what happened | block |
| `erfolgreich` | Delete on a confirmation: "Datei hochgeladen". Fine in a count: "3 erfolgreich, 1 fehlgeschlagen" | check |
| `ein fehler ist aufgetreten` `es ist ein fehler aufgetreten` `unbekannter fehler` `unerwarteter fehler` | Say what failed and what to do: "Speichern nicht möglich. Prüfen Sie die Verbindung." | block |
| `etwas ist schiefgelaufen` `etwas ist schiefgegangen` | Only with the next step and, when known, the cause | check |
| `ungültig*` `gültige*` | Show the expected format: "Datum so eingeben: 16.09.2026". "Gültig bis" is fine | check |
| `sind sie sicher` `bist du sicher` | Name the action and its effect: "3 Dateien löschen?", then "Das lässt sich nicht rückgängig machen." | check |
| `klicken sie hier` `klicke hier` `klick hier` `hier klicken` `tippen sie hier` | Put the link on the words that say where it goes | block |
| `klicken sie` `klicke` `klick` | "wählen", "auswählen"; on touch screens, "tippen". Or name the action | check |
| `absenden` `abschicken` `übermitteln` | Say what happens: "Anfrage senden", "Bezahlen" | check |
| `es ist wichtig zu beachten` `es ist wichtig zu bemerken` `es ist bemerkenswert` `es sei darauf hingewiesen` `bitte beachten sie` | State the fact | block |
| `zusammenfassend` `insgesamt lässt sich` `abschließend lässt sich` | Delete. A screen has no conclusion | check |
| `darüber hinaus` `des weiteren` `ferner` `zudem` `im rahmen von` `im rahmen des` `im rahmen der` | darüber hinaus, des Weiteren, ferner, zudem: "auch", or delete; im Rahmen: "bei", "für" | check |
| `bezüglich` `hinsichtlich` `zwecks` `seitens` `mittels` | bezüglich, hinsichtlich: "zu", "über"; zwecks: "für"; seitens: "von"; mittels: "mit" | check |
| `willkommen an bord` | "Willkommen", then the first action | check |
| `lassen sie mich wissen` `lass mich wissen` `ich hoffe, das hilft` `ich hoffe, diese nachricht` | Delete. A chatbot reply pasted into the product | block |
| `ihre anfrage wird bearbeitet` `deine anfrage wird bearbeitet` `wird verarbeitet` | Say what is happening and for how long: "3 von 12 Clips werden exportiert…" | check |

## Lexicon: hype and AI tells

| Pattern | Write instead | Level |
|---|---|---|
| `tauchen sie ein` `tauch ein` `tauche ein` `taucht ein` `tauchen wir ein` `lassen sie uns eintauchen` `lass uns eintauchen` | Say what the screen contains | block |
| `eintauchen` | Delete, or "ansehen". Fine for water | check |
| `nahtlos*` | Delete, or say what is gone: "ohne Einrichtung" | block |
| `revolutionär*` `revolutionier*` | House rule: delete. Say what is new | block |
| `bahnbrechend*` `wegweisend*` `gamechanger` `game changer` `game-changer` | Delete | block |
| `innovativ*` | House rule: say what it does | block |
| `auf das nächste level` `aufs nächste level` `auf ein neues level` `das nächste level` `next level` `next-level` | Say what improves, with a number. Fine in a game | check |
| `entdecken sie` `entdecke` | House rule: name the thing, "Neuerungen ansehen" | check |
| `leistungsstark*` | House rule: say what it handles, "öffnet 4-GB-Dateien" | check |
| `maßgeschneidert*` `massgeschneidert*` `ganzheitlich*` `mehrwert` `synergie*` `ökosystem*` | Name the parts, what they do and what adapts to what | check |
| `vielfältig*` `facettenreich*` `vielschichtig*` `umfassend*` `atemberaubend*` | Delete, or give the fact: "40 Vorlagen" | check |
| `essenziell*` `essentiell*` `entscheidend*` `unverzichtbar*` | Delete, or say why it matters | check |
| `in der heutigen welt` `in der heutigen zeit` `im digitalen zeitalter` `in einer welt, in der` `in der heutigen landschaft` `in der schnelllebigen` | Delete. Start with what the product does | block |
| `spielt eine wichtige rolle` `spielt eine bedeutende rolle` `spielt eine entscheidende rolle` `unterstreicht die bedeutung` `unterstreicht seine bedeutung` `unterstreicht ihre bedeutung` `dient als zeugnis` `steht als zeugnis` | State the fact | block |
| `mühelos*` `im handumdrehen` `wie von zauberhand` | House rule: give the steps or the time, "in 2 Klicks" | block |
| `ganz einfach` `kinderleicht` `einfach nur` | Delete. In an instruction it blames the reader when it fails | check |
| `intuitiv*` | Show it, do not claim it | check |
| `einzigartig*` `unvergleichlich*` `unschlagbar*` `erstklassig*` `weltklasse` `branchenführend*` | Name the proof: a certification, a number | block |
| `volles potenzial` `potenzial entfalten` `potenzial freisetzen` `ihr potenzial` `dein potenzial` | Say what the person can now do | block |
| `lösung` `lösungen` | Name the thing: "die App", "das Werkzeug", or its name. Fine for a puzzle | check |
| `optimier*` `optimal*` `boost*` | Say what improves, with a number | check |
| `nicht nur` | Say both things plainly, in two sentences if needed | check |
| `ki-gestützt*` `ki-basiert*` `ki-powered` | Name what it does: "schlägt Titel vor" | check |

## Lexicon: jargon and anglicisms

| Pattern | Write instead | Level |
|---|---|---|
| `downloaden` `gedownloadet` `downgeloadet` `uploaden` `geuploadet` `upgeloadet` `updaten` `geupdatet` `upgedatet` | downloaden: "herunterladen"; uploaden: "hochladen"; updaten: "aktualisieren" | check |
| `einloggen` `eingeloggt` `loggen` `logge` `ausloggen` `ausgeloggt` `login` `logout` | einloggen: "anmelden"; ausloggen: "abmelden"; Login: "Anmeldung" | check |
| `checken` `gecheckt` `browsen` | checken: "prüfen"; browsen: "surfen" | check |
| `customiz*` `customis*` `supporten` `gesupportet` `resetten` | customizen: "anpassen"; supporten: "unterstützen"; resetten: "zurücksetzen" | block |
| `erfordern` `erfordert` `partiell` `mobiltelefon*` | erfordern: "benötigen"; partiell: "teilweise"; Mobiltelefon: "Handy" or "Smartphone" | check |
| `durchführen` `durchgeführt` `durchzuführen` `vornehmen` `vorgenommen` | The verb itself: "Änderungen vornehmen" becomes "ändern" | check |
| `erfolgen` `erfolgt` | An active verb: "Die Zahlung erfolgt" becomes "Wir buchen den Betrag ab" | check |
| `nicht ausreichend` | "nicht genügend" | check |
| `ausführen` `ausgeführt` | "starten", "öffnen". Fine for scripts and commands | check |
| `authentifizier*` `authentisier*` `zugangsdaten` `credentials` | authentifizieren: "anmelden", "bestätigen, dass Sie es sind"; Zugangsdaten: name what is asked, "E-Mail-Adresse und Passwort" | check |
| `instanz` `instanzen` `parameter` `funktionalität*` | Instanz: the name users know, "Server", "Arbeitsbereich"; Parameter: "Einstellung", "Option"; Funktionalität: "Funktion" | check |
| `benutzer` `nutzer` `anwender` `user` `users` | "Sie" or "du"; in an admin screen, name the role. The pair form "Nutzerinnen und Nutzer" is fine in running text | check |
| `nutzer:innen` `nutzer*innen` `nutzer_innen` `benutzer:innen` `benutzer*innen` | Address the reader, or "alle", "Ihr Team". A gender character only if DESIGN.md names one | check |
| `zum jetzigen zeitpunkt` `zu einem späteren zeitpunkt` `später erneut` | zum jetzigen Zeitpunkt: "jetzt"; später erneut: say when, or what to do now | check |
| `feedback` `dashboard` `onboarding` | Feedback: "Rückmeldung"; Dashboard: "Übersicht"; Onboarding: "Erste Schritte" | check |
| `template*` `workflow*` `preview` | Template: "Vorlage"; Workflow: "Ablauf"; Preview: "Vorschau" | check |
| `settings` `loading` `password` | Settings: "Einstellungen"; Loading: "Wird geladen…"; Password: "Passwort" | block |
| `timeout` `time-out` `zeitüberschreitung` | Say what did not answer and what to do: "Der Server antwortet nicht. Versuchen Sie es noch einmal." | check |
| `undefined` `NaN` | A bug: the string shows an empty value. Fix the data, or a fallback like "Ohne Titel". Not `null`: in German it means zero | block |

## Patterns

No word list catches these. Read for them.

| Pattern | Rewrite |
|---|---|
| `du` and `Sie` in one flow, or `sie` for the reader | One form from `DESIGN.md`, `Sie` always capitalized |
| English Title Case: "Neues Projekt Erstellen" | "Neues Projekt erstellen" |
| Nominal style: "Die Durchführung der Speicherung erfolgt automatisch" | "Wird automatisch gespeichert" (KERN, against nominal style) |
| An impersonal passive: "Es wird empfohlen, …" | "Wir empfehlen …" (KERN, active voice) |
| "Nicht nur X, sondern auch Y" (mindtwo, ContentConsultants) | Two plain statements, or only the one that matters |
| Three items everywhere, the "Trikolon" (Wikipedia DE) | The number of items there really are |
| A question as a heading: "Warum X wählen?" | A statement: "Was X kann" |
| A four-part compound with no hyphen: "Benutzerkontoeinstellungsseite" | "Kontoeinstellungen", or a preposition: "Einstellungen für Ihr Konto" |
| A sentence that starts "Konnte … nicht" | "Die Datei konnte nicht gespeichert werden." (Microsoft) |
| The subjunctive for politeness: "Möchten Sie vielleicht …", "Sie könnten …" | The indicative or the imperative (Microsoft) |
| A closing formula: "Lassen Sie mich wissen, …", "Viel Spaß beim Bearbeiten!" | Stop after the last useful sentence |
| Dashes as structure: an em dash in every paragraph (Wikipedia DE) | A period or a colon; one spaced en dash at most |

## Examples

The "after" strings use „“ (U+201E, U+201C).

| Before | After, Sie | After, du |
|---|---|---|
| Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut. | Verbindung unterbrochen. Ihre Änderungen sind gespeichert. Versuchen Sie es noch einmal. | Verbindung unterbrochen. Deine Änderungen sind gespeichert. Versuche es noch einmal. |
| Datei erfolgreich hochgeladen! | Datei hochgeladen | Datei hochgeladen |
| Sind Sie sicher, dass Sie fortfahren möchten? | Projekt „Schnitt“ löschen? Sie können es danach nicht wiederherstellen. | Projekt „Schnitt“ löschen? Du kannst es danach nicht wiederherstellen. |
| Hoppla! Keine Ergebnisse gefunden. | Keine Ergebnisse für „Drohne“. Prüfen Sie die Schreibweise oder suchen Sie nach einem anderen Wort. | Keine Ergebnisse für „Drohne“. Prüfe die Schreibweise oder suche nach einem anderen Wort. |
| Entdecken Sie unsere innovative, leistungsstarke Lösung für nahtlose Workflows. | Exportieren Sie alle Clips auf einmal. | Exportiere alle Clips auf einmal. |
| Klicken Sie hier, um Ihre Settings zu checken (button) | Einstellungen prüfen | Einstellungen prüfen |
| Bitte geben Sie eine gültige E-Mail-Adresse ein. | Geben Sie eine vollständige E-Mail-Adresse ein, zum Beispiel name@beispiel.de | Gib eine vollständige E-Mail-Adresse ein, zum Beispiel name@beispiel.de |
| Absenden (quote form) | Anfrage senden | Anfrage senden |
| Speichern Sie (button) | Speichern | Speichern |
| Loggen Sie sich ein, um fortzufahren. | Melden Sie sich an, um fortzufahren. | Melde dich an, um fortzufahren. |
| Liebe Nutzer:innen, alle Teilnehmer sehen Ihren Bildschirm. | Alle im Meeting sehen Ihren Bildschirm. | Alle im Meeting sehen deinen Bildschirm. |
| Neues Projekt Erstellen | Neues Projekt erstellen | Neues Projekt erstellen |

## Sources

- Microsoft German Localization Style Guide, PDF updated 2025-01-08 (linked from
  learn.microsoft.com/globalization).
- KERN UX-Standard 2.8.1, "Sprache und Tonalität" and "Button" (kern-ux.de), read 2026-09-16.
- Rat für deutsche Rechtschreibung, "Geschlechtergerechte Schreibung: Erläuterungen, Begründung
  und Kriterien", 2023-12-15.
- Duden Sprachratgeber: "Geschlechtergerechter Sprachgebrauch" and "Groß- oder Kleinschreibung
  von du/Du", undated, read 2026-09-16; Duden rules "Bindestrich" and "Auslassungspunkte", both
  through search results.
- Bavarian state portal (bayern.de): gender-language ban in the state's rules of procedure, in
  force 2024-04-01.
- Swiss Federal Chancellery, Schreibweisungen: `ss` for `ß`, seen through search results
  2026-09-16. Wikipedia DE, "Anführungszeichen", edited 2026-09-02.
- MDN, "hyphens", updated 2026-07-21. apple.com/de, read 2026-09-16: `du` throughout.
- LocaleProof, "Text Expansion by Language", updated July 2026; W3C, "Text size in
  translation", read 2026-09-16.
- AI tells, observed, not measured. No dated measurement of German AI vocabulary was found on
  2026-09-16. Wikipedia DE, "Wikipedia:Anzeichen für KI-generierte Inhalte", edited 2026-07-05:
  "spielt eine wichtige Rolle", "unterstreicht seine Bedeutung", "Zeugnis", "atemberaubend",
  "es ist wichtig zu bemerken", "zusammenfassend", "Trikolon", letter formulas, dashes; its own
  caveat is that not every text with these signs is AI-made. korrektur.de, 2026-06-05:
  essenziell, vielfältig, nahtlos, maßgeschneidert, "im digitalen Zeitalter", "in der heutigen
  Welt", "Es ist wichtig zu beachten", "Insgesamt lässt sich festhalten". mindtwo, 2024-09-12,
  updated 2026-07-15: "Tauchen wir ein", "Lassen Sie uns eintauchen", "das nächste Level",
  "Gamechanger", "in der heutigen Landschaft", "umfassender Leitfaden", "nicht nur X, sondern
  auch Y". ContentConsultants (Udo Raaf), 2026-08-03: "In einer Welt, in der", eintauchen,
  ganzheitlich, umfassend. Seen only in a search snippet: facettenreich, vielschichtig.
- House rules, no dated source behind them: Entdecken Sie, leistungsstark, revolutionär,
  bahnbrechend, innovativ, mühelos, einzigartig, the English loanwords. They are bad product
  copy, not proven AI tells.
- Not verified: the SUBTLEX-DE corpus size (the paper was not opened); the `Uhr` convention.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Translating the English string word for word, in English word order | The sentence a German user would say, in the product's `du` or `Sie` |
| `du` on the screens, `Sie` in the invoice email | One form, taken from `DESIGN.md` |
| `"Bericht"` or `„Bericht”` | `„Bericht“` |
| `Speichere` or `Speichern Sie` on a button | `Speichern` |
| A 30-letter compound overflowing its button | `lang="de"` with `hyphens: auto`, a `&shy;` break point, or a shorter word |
| `Nutzer*innen` on one screen, `Nutzer:innen` on the next, `Nutzer` in the email | Direct address first, then the one form `DESIGN.md` names |
| `Straße` in a Swiss product | `Strasse` |
| Every `bitte` and `leider` rewritten on sight | Read the string; `check` rows are prompts, not verdicts |
