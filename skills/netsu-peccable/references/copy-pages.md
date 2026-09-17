# Landing pages, store listings, release notes

Pages that present the product: a landing or presentation page, a Chrome Web Store, App Store,
Google Play or Adobe Exchange listing, release notes. The output is copy built only from facts
the repository proves, with a character count wherever a store sets a limit.

Paths to `scripts/scan.mjs` are relative to this skill's folder. French examples use *vous*;
follow `## Voice`.

## 1. Facts before words

Read `## Product`, `## Voice` and `### Words we use` in `DESIGN.md` (or `VOICE.md`). No design file: run
`references/setup.md` first. Then collect facts from the repository, not from the conversation:

| Fact | Where to look |
|---|---|
| Name, version, one-line description | `package.json`, `src-tauri/tauri.conf.json`, the extension's `manifest.json`, Expo `app.json` or `app.config.*` |
| Platforms and requirements | Tauri bundle targets; extension `minimum_chrome_version`; UXP `manifest.json` `host` (app, `minVersion`); CEP `CSXS/manifest.xml`; Expo `ios` / `android` blocks |
| Features | Routes, menus, commands and settings a user can open today. Not the roadmap |
| Numbers | Only with a script, a query or a file behind them |
| Price, trial, account | Pricing or store config, otherwise the user |
| Changes since the last release | `git log --oneline "$(git describe --tags --abbrev=0)"..HEAD`, `CHANGELOG.md` |
| Real questions | Issues, store reviews, support messages the user shares |

Write the fact sheet before any copy:

| Fact | Value | Source |
|---|---|---|
| Platforms | Windows, macOS | `src-tauri/tauri.conf.json`, bundle targets |
| Price | ? | ask |
| Users | ? | ask, or leave out |

Every `?` becomes a question, asked in one message before writing. No fact, no sentence. When
nobody can answer, leave the sentence out and list the question at the end of the reply.

## 2. Hero

1. Line 1: what it is and who it is for, with the noun users say. Not a slogan.
2. Line 2: the concrete outcome, what the user has once it is done.
3. One primary action that names itself: « Télécharger pour Windows », "Add to Chrome". Other
   platforms go in a line of links under it.
4. A real screenshot of the product, next to the text or right under it.
5. The page `<title>`, the meta description and the Open Graph text say the same facts. A claim
   there counts as a claim on the page.

| Before | After |
|---|---|
| Révolutionnez votre workflow vidéo. Ce n'est pas un simple outil, c'est votre copilote créatif. [Commencer] | Triez les rushs d'un tournage avant le montage. / Glissez la carte SD : chaque fichier est renommé par scène et par prise. [Télécharger pour Windows] |
| Unleash your creativity. Whether you're a beginner or a pro, we've got you covered. [Get started] | Sort a shoot's clips before you edit. / Drop in the SD card: every file is renamed by scene and take. [Download for Windows] |

## 3. Sections come from the content

Do not start from the template (hero, three icon cards, testimonials, call to action). List what
the fact sheet holds, then build:

| You have | It becomes |
|---|---|
| The one feature people install it for | Its own section, with a screenshot or a short capture, not a card |
| Several smaller features | A plain list with as many items as exist, each one what the user does |
| A workflow with a real order | Steps, each with its screenshot. No order, no numbers |
| Platforms, requirements, price | One short block in plain words |
| Real questions | An FAQ, each question in the words it was asked |
| Real quotes, attributable, with permission | Testimonials. Otherwise no such section |
| Nothing for a section | No section |

Feature lines name the action and the real noun:

| Before | After |
|---|---|
| Gestion intelligente des médias | Renommez tous les rushs d'une carte en une fois |
| Seamless collaboration | Share a project link. Your editor opens it in the browser |
| Performances ultra-rapides | Ouvrez un projet d'une heure en 3 s (mesuré par `bench/open.mjs`) |

Pricing says what is free, what costs how much per what, and what happens when a trial ends:
« Gratuit pendant <n> jours, puis <prix> par mois. » Fill it from the fact sheet or drop it.

## 4. Store listings

Limits checked on 2026-09-16 on each store's own documentation. Check again before a submission:
in 2024 Chrome replaced a 45-character cap on English names with 75 characters for every locale.

| Store | Field | Limit | Source |
|---|---|---|---|
| Chrome Web Store | Name (manifest `name`) | 75 characters | Chrome manifest reference, `name`; Chromium Extensions PSA, 2024-02-22 |
| Chrome Web Store | Summary (manifest `description`) | 132 characters | Chrome, *Creating a great listing page* (updated 2024-08-02) |
| Chrome Web Store | Description | unverified: no limit published | Chrome, *Complete your listing information* |
| App Store | Name | 2 to 30 characters | App Store Connect Help, *App information* |
| App Store | Subtitle | 30 characters | App Store Connect Help, *App information* |
| App Store | Promotional text | 170 characters | App Store Connect Help, *Platform version information* |
| App Store | Description | 4,000 characters | same page |
| App Store | Keywords | 100 bytes | same page |
| App Store | What's New | 4,000 characters | same page |
| Google Play | App name | 30 characters | Play Console Help, answer 9859152 |
| Google Play | Short description | 80 characters | same page |
| Google Play | Full description | 4,000 characters | same page |
| Google Play | Release notes | 500 characters per language | Play Console Help, answer 9859348 |
| Adobe Exchange | Plugin name, subtitle, description, release notes | unverified | Adobe's Creative Cloud submission docs list the fields, not the limits |

Adobe Exchange: read the counter in the Developer Console submission form and write it in the
fact sheet. An Adobe Tech Blog post on XD plugin listings says the subtitle is cut past 30
characters in the plugin manager and suggests a name of 45 characters or fewer; that page could
not be opened on 2026-09-16, so treat both numbers as unverified.

Where the reader stops:

- **Chrome Web Store**: the summary. It is the manifest `description`, also shown on
  `chrome://extensions`. The description opens with one sentence of what the extension does.
- **App Store**: name and subtitle travel with the icon. The description shows its first lines
  before "more", so the first sentence carries the whole pitch.
- **Google Play**: the short description, "the first text users see" on the details page (Play
  Console Help).
- **Adobe Exchange**: the name and the subtitle on the listing card.

Keywords are counted in bytes, and an accented French letter takes two. Count every field:

```bash
node -e 'for (const s of process.argv.slice(1)) console.log([...s].length, "chars", Buffer.byteLength(s), "bytes |", s)' "Tri de rushs" "rushs,montage,dérushage"
```

Write each field for its own length and position. Pasting one pitch into four stores cuts it
mid-sentence in at least one.

A button or menu named in a listing, or in the notes for the store's reviewers, uses the exact
label the build shows. Image sizes (screenshots, promo tiles) come from the store's own page on
the day you submit: they change, and blog posts copy old ones.

## 5. Release notes

1. Start from `git log --oneline <last-tag>..HEAD` and the merged pull requests. Keep only what a
   user can notice.
2. Group: Nouveautés, Améliorations, Corrections / New, Improved, Fixed. Drop an empty group.
3. One line per change: what the user can now do, or what no longer goes wrong, with the noun
   from `### Words we use`.
4. Write the Google Play version first (500 characters). It forces the order; the App Store and
   website versions add detail after it.
5. "Bug fixes and performance improvements" is allowed only as a last line under named changes.

| Before | After |
|---|---|
| Corrections de bugs et améliorations des performances. | Corrigé : l'export ne s'arrête plus à 99 % sur les timelines de plus d'une heure. |
| Bug fixes and performance improvements. | Fixed: exports no longer stop at 99% on timelines over an hour. |
| Refactored export pipeline, bumped ffmpeg | Nothing. The user cannot notice it |

## 6. Slop shapes to refuse

| Shape | Example | Write instead | Source |
|---|---|---|---|
| Negative parallelism | "Not just an editor, it's a workflow." « Ce n'est pas un outil, c'est un partenaire. » | The one thing it does | Wikipedia, *Signs of AI writing*, "Negative parallelisms" (read 2026-09-16) |
| Two audiences at once | "Whether you're a beginner or a pro…" « Que vous soyez débutant ou expert… » | The one user named in `## Product` | Lists of overused ChatGPT phrases (2026). No corpus measurement found |
| A triad in every list | "Fast. Simple. Powerful." | As many items as exist, each specific | Wikipedia, "Rule of three"; Momentic, *34 types of AI slop* (2026-05-28) |
| Emoji bullets | A rocket before every feature | Text, or icons from the product's own set | Wikipedia, "Emoji as formatting"; Adrian Krebs, study of 1,590 Show HN landing pages (2026-04-20) |
| Fake urgency | "Only 3 spots left!", a countdown that resets | A real deadline with its date, or nothing | FTC, *Bringing Dark Patterns to Light* (2022-09-15), on baseless countdown timers |
| Invented proof | "Loved by 10,000+ creators", a quote nobody said, stars with no source | A number with its source, a real quote with permission, or no section | FTC rule on consumer reviews and testimonials (announced 2024-08-14, in force 2024-10-21), which covers AI-generated reviews |
| Hype verbs | Unleash, Boost, Supercharge; Révolutionnez, Boostez, Libérez | The task's verb: sort, rename, export; trier, renommer, exporter | Wikipedia, "Promotional and advertisement-like language"; Wikipédia FR, *Identifier l'usage d'une IA générative* (2026-08-19) |

The `references/words-<lang>.md` files carry the word-level bans; this table is about shapes the
lexicon cannot catch.

## 7. Proof

```bash
node <skill dir>/scripts/scan.mjs copy landing.md store/chrome-fr.txt store/play-en.txt --lang auto
node <skill dir>/scripts/scan.mjs copy src/routes/index.tsx
```

1. Zero `block` findings. Read each `check` finding in context: the scan is a regex heuristic,
   it can flag code and misses strings built at run time. Never auto-fix from it.
2. Give a count for every store field:

| Store | Field | Text | Count / limit |
|---|---|---|---|
| Google Play | Short description | Triez et renommez les rushs d'un tournage avant le montage. | 59 / 80 |

3. Read aloud the hero, the first line of each listing and the release notes.
4. Put the fact sheet in the report. Every sentence traces to a row; every `?` was answered or
   its sentence removed.
5. If the page runs, screenshot it at desktop and phone width.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Hero: "The future of video editing" | "Sort a shoot's clips before you edit" |
| Hero, three icon cards, testimonials, call to action, whatever the product | Sections from the fact sheet |
| "10,000+ happy users" with no source | A number with its source, or none |
| A testimonial the model wrote | No testimonials section |
| "Get started" as the only action | "Download for Windows" |
| "Powerful export engine" | "Rename every clip on a card at once" |
| A paragraph describing the interface | A real screenshot |
| A store limit copied from a blog | The store's own page, with the date checked, or "unverified" |
| App Store keywords counted in characters | Counted in bytes |
| "Bug fixes and performance improvements." on its own | Named changes, grouped |
| One pitch pasted into four stores | Each field written for its limit and its place |
| « Découvrez », « Boostez », « en toute simplicité » | The task verb and its object |
| Writing first, asking about price and platforms at the end | Fact sheet and questions first |
