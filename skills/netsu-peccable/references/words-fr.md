# French: words and typography

Load before writing or reviewing a French string. `scripts/scan.mjs` reads the three
`## Lexicon` tables below, so keep each row to three cells: backticked patterns first, `block` or
`check` last. A pattern matches whole words, ignores case, treats `'` and `’` alike, and a
trailing `*` means "any letters after". `block` is wrong in any UI. `check` means read it in
context.

## Register

- **Address.** `tu` or `vous` comes from `## Voice` in `DESIGN.md`. One form for the whole
  product: screens, emails, notifications, store listing. If the file is silent, run
  `references/setup.md`. Never pick one yourself, never mix them.
- **Buttons: infinitive, one line.** A verb plus one to four words, about 25 characters:
  `Envoyer`, `Exporter la vidéo`, `S'abonner`. `Précédent` and `Suivant` are the accepted
  exceptions. Source: Québec government design system, "Libellés des boutons", updated
  2026-01-15.
- **No first person, no consent sentence, no imperative on a button.** Not `Je veux m'abonner`,
  `Oui, j'accepte la politique`, `Consultez notre rapport`. Write `S'abonner`,
  `Accepter la politique`, `Consulter le rapport`. Same source. The DSFR (French state design
  system) says the same about "Je" and the infinitive, but its page was only seen as a search
  snippet: treat that as unconfirmed.
- **Instructions: imperative, in the product's form.** `Choisissez un dossier.` or
  `Choisis un dossier.`
- **Short sentences.** 10 to 20 words on average, one idea each (Québec design system, plain
  language guidance).
- A bare `Valider`, `Soumettre`, `Oui`, `Non` or `Cliquez ici` is caught by the scan's
  `vague-action` rule. `Valider la commande` is ordinary French: leave it.

## Typography

Source: OQLF, Banque de dépannage linguistique, "Espacement avant et après les signes de
ponctuation et les symboles" and "Contextes exigeant une espace insécable" (read 2026-09-16).

| Case | Write | Notes |
|---|---|---|
| Before `:` | `Durée\u00A0: 3\u00A0min` | U+00A0, non-breaking space. No space in a clock time: `13:52` |
| Before `;` `?` `!` | `Supprimer\u202F?` | U+202F, narrow non-breaking space. U+00A0 if the UI font renders U+202F badly |
| Guillemets | `«\u00A0Montage\u00A0»` | Non-breaking spaces inside. Never `"Montage"` in French text |
| Money | `1\u202F234,56\u00A0€` | `Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' })` outputs exactly this |
| Percent, units | `50\u00A0%`, `4\u202FGo`, `25\u00A0°C` | Never a breaking space between a number and its unit |
| Date | `16 sept. 2026`, `mercredi 16 septembre` | Months and days in lowercase. `Intl.DateTimeFormat('fr-FR')` joins them with plain spaces: replace them with U+00A0 or set `white-space: nowrap` |
| Time | `14\u00A0h\u00A030` in a sentence, `14:30` in a dense list or a player | |
| Ellipsis | `Chargement…` | U+2026, no space before. Never `...` |
| Capitals | `État`, `Écran`, `Échec`, `Êtes-vous`, `À propos` | Type the accent. `text-transform: uppercase` keeps it |
| Apostrophe | `l’export` or `l'export` | Pick one for the product. A mix is a listed AI tell (Wikipédia FR, below) |
| Case | `Paramètres du compte` | Sentence case. Never `Paramètres Du Compte`. The scan's `title-case` checks French too; a name it does not know may still slip through |
| Scan rules | `fr-nbsp`, `fr-quotes`, `fr-caps`, `fr-apostrophe`, `fr-decimal`, `fr-address`, `paren-plural` | Spacing, « » quotes, accented capitals, one apostrophe form, decimal comma, tu or vous, real plurals |
| Plural | `0 fichier`, `1 fichier`, `2 fichiers` | French treats 0 as singular: `new Intl.PluralRules('fr').select(0)` is `"one"`. Never `fichier(s)` |

How to type the spaces:

- In a JS, TS or JSON string: `"Durée\u00A0: 3\u00A0min"`, `"Supprimer\u202F?"`.
- In JSX text, `\u00A0` renders as six literal characters. Write `&nbsp;`, `{"\u00A0"}`, or the
  character itself. For U+202F in JSX text or HTML: `&#x202F;`.
- Or type the real character in a UTF-8 file. It is invisible in review, so say so in the diff.
- Québec usage sets no space before `; ? !` when a narrow space is not available (OQLF, same
  page). `DESIGN.md` names the market; the scan's `fr-nbsp` finding on `? ! ;` is a `check` for
  this reason.

## Length

- French runs 15 to 35% longer than English (localization vendors Crowdin and LocaleProof,
  2026). Check the French string in the real component, at its narrowest width.
- A button stays on one line. Shorten the words (`Exporter`, not `Lancer l'exportation`). Never
  truncate a button with `…`, never let it wrap.
- Abbreviate only what the reader already reads daily: `min`, `Go`, `sept.`. Never invent one.

## Choosing between two words

When two words fit, take the one people say more often. The glossary in `DESIGN.md` wins over
this, even when its word is rarer: a video editor says `rush`.

Tie-breaker: film-subtitle frequency, the best available proxy for everyday speech. Use
Lexique 3.83, column `freqfilms2` (occurrences per million words of film subtitles, CC BY-SA 4.0,
lexique.org). Subtitle counts predict how fast people read a word better than book counts do
(the SUBTLEX studies, Brysbaert and New 2009 onward). Look words up there. Never copy the data
into the project.

Pairs worth a lookup: `effectuer` / `faire`, `débuter` / `commencer`, `ultérieurement` /
`plus tard`, `sélectionner` / `choisir`, `modifier` / `changer`, `rechercher` / `chercher`.

## Lexicon: filler and politeness

| Pattern | Write instead | Level |
|---|---|---|
| `hésitez pas` `hésite pas` | Delete. Give the action: "Écrivez-nous", "Écris-nous" | block |
| `veuillez` | Start with the verb: "Saisissez…", "Saisis…". "Veuillez patienter" only in a formal product | check |
| `merci de bien vouloir` `nous vous prions` | Start with the verb | block |
| `nous vous remercions` | "Merci", then say what happens next | check |
| `afin de` `afin que` | "pour", "pour que" | check |
| `en effet` `par ailleurs` `en outre` | Delete, or "aussi" | check |
| `en somme` `au final` `en conclusion` | Delete. A screen has no conclusion | check |
| `il est important de` `il convient de` `il est à noter` | State the fact | block |
| `à noter` | Delete, or a "Remarque" label if the design has one | check |
| `cher utilisateur` `chère utilisatrice` `cher client` `chère cliente` | The person's name, or nothing | block |
| `nous sommes ravis` `nous sommes heureux` | Delete. Say what the person gets | check |
| `gêne occasionnée` | Say what broke and when it will work again | check |
| `ultérieurement` | "plus tard" | check |
| `oups` `oops` `aïe` | Delete. Say what happened | block |
| `avec succès` | Delete: "Fichier importé" | block |
| `erreur est survenue` `erreur inconnue` `erreur inattendue` | Say what failed and what to do: "Impossible d'enregistrer. Réessayez." | block |
| `erreur technique` `problème technique` | Same: what failed, what to do | check |
| `invalide` `invalides` `valide` `valides` | Show the expected format: "Saisissez une date comme 16/09/2026". "Valide jusqu'au" is fine | check |
| `je veux` `oui, j'accepte` | On a button, the infinitive: "S'abonner", "Accepter les conditions" | check |
| `êtes-vous sûr*` `êtes-vous certain*` `es-tu sûr*` `es-tu certain*` | Name the action and its effect: "Supprimer le projet", then "Vous ne pourrez pas le récupérer." | check |
| `cliquez ici` `clique ici` `appuyez ici` | Put the link on the words that say where it goes | block |
| `cliquez` `clique` | Name the action; on touch screens, "touchez" | check |
| `soumettre` | Say what happens: "Envoyer la demande", "Payer" | check |
| `bienvenue à bord` | "Bienvenue", then the first action | check |
| `en cours de traitement` | Name it: "Export en cours" | check |

## Lexicon: hype and AI tells

| Pattern | Write instead | Level |
|---|---|---|
| `dans le monde actuel` `dans un monde où` `ère du numérique` | Delete. Start with what the product does | block |
| `en constante évolution` `en perpétuelle évolution` | Delete | block |
| `plongez dans` `plongeons dans` `plonge dans` `explorons ensemble` | Say what the screen contains | block |
| `découvrez` `découvre` | House rule: name the thing, "Voir les nouveautés" | check |
| `boostez` `booste` `booster votre` `booster vos` `booster ton` `booster ta` `booster tes` | House rule: say what gets faster, with the number | block |
| `révolutionn*` | Delete. Say what is new | block |
| `innovant*` | House rule: say what it does | block |
| `en toute simplicité` `sans effort` `en un clin` | House rule: give the steps or the time, "en 2 clics" | block |
| `simplement` `facilement` | Delete. In an instruction, it blames the reader when it fails | check |
| `fluide*` `intuiti*` | Show it, do not claim it | check |
| `puissant*` | Say what it handles: "ouvre des fichiers de 4 Go" | check |
| `ultime` `ultimes` `incontournable*` `inégalé*` `sans égal` `sans pareil` | Delete | block |
| `expérience unique` `expérience inoubliable` `comme par magie` | Say what the person does | block |
| `libérez votre` `libère ton` `libère ta` `sublimez` | Say what the person can now do | block |
| `crucial*` `cruciaux` | Delete, or say why it matters | check |
| `fascinant*` `passionnant*` | Delete. Let the content be interesting | check |
| `transformateur*` `transformatrice*` | Say what changes | check |
| `véritablement` `indéniablement` `profondément` `pleinement` | Delete the adverb | check |
| `optimis*` `optimal*` | Say what improves, with a number | check |
| `solution` `solutions` | Name the thing: "l'application", "l'outil", or its name | check |
| `nouvelle génération` `dernière génération` `de pointe` | Say what is new | check |
| `synergie*` `écosystème*` `au cœur de` `au coeur de` | Name the parts and what they do | check |
| `soulignant` | Split the sentence. A trailing participle is a listed tell | check |
| `non seulement` | Say both things plainly, in two sentences if needed | check |

## Lexicon: jargon and anglicisms

| Pattern | Write instead | Level |
|---|---|---|
| `mettre en œuvre` `mettre en oeuvre` `mise en œuvre` `mise en oeuvre` | "faire", "installer", "appliquer" | block |
| `mettre en place` `mettez en place` `mise en place` | "installer", "créer", "préparer" | check |
| `effectuer` `effectuez` `effectue` `effectué*` | "faire", or the verb itself: "Paiement reçu" | check |
| `procéder à` `procéder au` `procédez à` `procédez au` | The verb itself: "Payer", "Supprimer" | check |
| `permettre de` `permet de` `permettent de` | Say it with the verb: "Exportez en MP4" | check |
| `dans le cadre de` `dans ce cadre` | "pour", "pendant", or delete | check |
| `articule autour` `articulent autour` | "comprend", "a trois parties" | check |
| `impacter` `impacte` `impacté*` | "toucher", "changer" | check |
| `supporté*` | "pris en charge", "compatible" | check |
| `fonctionnalité*` | "fonction", "option", or its name | check |
| `paramétr*` | "régler", "choisir". The "Paramètres" menu is fine | check |
| `générer` `générez` | "créer", "faire", or the glossary verb | check |
| `exécuter` `exécutez` | "lancer" | check |
| `authentifi*` | "se connecter", "confirmer votre identité" | check |
| `upload*` | "importer", "envoyer" ("téléverser" in Québec) | block |
| `download*` | "télécharger" | block |
| `checker` `checkez` `checke` `checké*` | "vérifier" | block |
| `updater` `updatez` `updaté*` | "mettre à jour" | block |
| `customis*` `customiz*` | "personnaliser" | block |
| `setter` `settez` | "régler", "définir" | block |
| `loggez` `loggé*` | "se connecter", "connecté" | block |
| `loading` | "Chargement…" | block |
| `null` `undefined` | A bug: the string shows an empty value. Fix the data, or a fallback like "Sans titre" | block |
| `process` | "étapes", "procédure" | check |
| `asset` `assets` | The concrete word: "fichier", "image", "rush" | check |
| `feature` `features` | "fonction", or its name | check |
| `user` `users` | "vous" or "tu"; "utilisateur" in an admin screen | check |
| `preview` | "aperçu" | check |
| `loader` | "chargement" | check |
| `workflow*` | "étapes", "méthode de travail" | check |
| `dashboard` | "tableau de bord" | check |
| `onboarding` | "prise en main", "premiers pas" | check |
| `feedback` | "avis", "retour" | check |
| `template*` | "modèle" | check |
| `digital*` | "numérique". "Empreinte digitale" is fine | check |
| `instance` `instances` | The name users know: "serveur", "espace" | check |
| `timeout` `time-out` | Say what did not answer and what to do: "Le serveur ne répond pas. Réessayez." | check |

## Patterns

No word list catches these. Read for them.

| Pattern | Rewrite |
|---|---|
| "Ce n'est pas X, c'est Y" (Graffeuil) | Say Y |
| "Non seulement X, mais aussi Y" (Viktorova) | Two plain statements, or only the one that matters |
| Three items in every list (Graffeuil) | The number of items there really are |
| A question as a heading: "Pourquoi choisir X ?" (Wikipédia FR) | A statement: "Ce que fait X" |
| Passive: "Le paiement a été effectué" | "Paiement reçu" or "Vous avez payé 12\u00A0€" |
| A noun where a verb goes: "la réalisation de l'export", "procéder à la suppression" | "exporter", "supprimer" |
| A closing formula: "N'hésitez pas à…", "Bonne navigation !", "En somme…" | Stop after the last useful sentence |
| Stacked adverbs ending in -ment (Graffeuil) | Keep the verb, drop the adverb |
| A trailing participle: "…, soulignant l'importance de" (Graffeuil) | Two sentences, or cut the tail |

## Examples

The "after" strings contain real U+00A0 and U+202F characters.

| Before | After, vous | After, tu |
|---|---|---|
| Une erreur est survenue. Veuillez réessayer. | Connexion perdue. Vos modifications sont gardées : réessayez. | Connexion perdue. Tes modifications sont gardées : réessaie. |
| Fichier uploadé avec succès ! | Fichier importé. | Fichier importé. |
| Êtes-vous sûr de vouloir continuer ? | Supprimer le projet « Montage » ? Vous ne pourrez pas le récupérer. | Supprimer le projet « Montage » ? Tu ne pourras pas le récupérer. |
| Oups ! Aucun résultat trouvé. | Aucun résultat pour « drone ». Vérifiez l'orthographe ou cherchez un autre mot. | Aucun résultat pour « drone ». Vérifie l'orthographe ou cherche un autre mot. |
| Découvrez notre solution innovante pour booster votre productivité. | Exportez toutes vos vidéos en une fois. | Exporte toutes tes vidéos en une fois. |
| Cliquez ici pour checker vos paramètres (button) | Vérifier les réglages | Vérifier les réglages |
| Veuillez saisir une adresse e-mail valide. | Saisissez une adresse e-mail complète, par exemple nom@exemple.fr | Saisis une adresse e-mail complète, par exemple nom@exemple.fr |
| Soumettre (quote form) | Envoyer la demande | Envoyer la demande |
| Je veux m'abonner ! | S'abonner | S'abonner |
| La mise en place de la synchronisation a été effectuée. | Synchronisation activée. | Synchronisation activée. |
| Dans un monde en constante évolution, restez informé grâce à nos notifications. | Recevez une notification quand un export est prêt. | Reçois une notification quand un export est prêt. |
| Paramètres Du Compte | Paramètres du compte | Paramètres du compte |

## Sources

- Wikipédia FR, "Aide:Identifier l'usage d'une IA générative", last edited 2026-08-19:
  promotional tone, stock phrases, question headings, bold and lists everywhere, mixed
  apostrophes. Its own caveat: these are clues, not proof.
- The Conversation, Mercanti-Guérin, 2026-07-07: "dans le monde actuel en constante évolution",
  fascinant, crucial, mettre en œuvre, s'articuler, en outre, par ailleurs, en somme, au final.
- Daria Viktorova, 2025-07-15: révolutionnaire, passionnant, transformateur, mettre en place,
  permettre de, dans ce cadre, "Non seulement X, mais Y".
- Louis Graffeuil, 2026-07-31: "ce n'est pas X, c'est Y", "soulignant l'importance de",
  adverbs in -ment, lists of three.
- House rules, no dated measurement behind them: n'hésitez pas, dans un monde où, plongez dans,
  découvrez, boostez, en toute simplicité, sans effort, solution innovante. They are bad product
  copy, not proven AI tells. "Plongeons dans", "N'hésitez pas à" and "Dans un monde où" were
  also named as AI tells in search snippets that could not be confirmed.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Translating the English string word for word | Writing the sentence a French user would say, in the product's `tu` or `vous` |
| `vous` on the screens, `tu` in the onboarding email | One form, taken from `DESIGN.md` |
| `Supprimer ?` with a regular space, which can wrap alone to the next line | `Supprimer\u202F?` |
| `\u00A0` typed into JSX text, shown on screen as six characters | `&nbsp;` or `{"\u00A0"}` |
| `Etat`, `Ecran` because the keyboard makes capitals awkward | `État`, `Écran` |
| Every `veuillez` and `solution` rewritten on sight | Read the string; `check` rows are prompts, not verdicts |
| `Uploader`, `Checker`, `Updater` because the code says upload | `Importer`, `Vérifier`, `Mettre à jour` |
