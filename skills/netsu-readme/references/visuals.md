# Visuals

Badges, demos, diagrams, theme-aware images.

## 0. The minimal default

"No decoration" does not mean a bare wall of text. A small baseline always applies, without
asking, because every item in it is native to GitHub, costs no third party, adapts to the reader's
theme, and takes almost no room:

| Always | Why it is free |
|---|---|
| **Alerts** — `> [!NOTE]`, `> [!TIP]`, `> [!IMPORTANT]`, `> [!WARNING]`, `> [!CAUTION]` | Native GitHub, theme-aware, no image. Use them for the one or two things a reader must not miss, never for ordinary prose |
| **`<details>`** around long optional blocks | Keeps an install matrix or a manual-build section from burying the content under it |
| **Tables** where a list would repeat the same shape | Only when every row shares the columns and every cell is short. See below |
| **Sentence-case headings** | Reads as written by a person |
| **Relative links** to files in the repo | Survives forks and clones |
| **Mermaid** for any diagram | Theme-aware, searchable, diffable, zero third parties |
| **The project's own icon**, if it ships one | It is already in the repo and already committed |

Ask before going past this: banners, animated text, hero art, anything from §2.

### Never put an identifier next to a paragraph in a table

Markdown gives you no control over column widths. A cell holding a paragraph takes the width and
the other columns are crushed to fit. Ordinary words survive that — they wrap at spaces. An
**identifier does not**: a code span, a path, a hyphenated name or a URL has no space to break at,
so the renderer breaks it *inside the word*. A skill named `netsu-readme` comes out as `netsu-`
stacked above `readme`. The one string the reader came for is the first thing the layout destroys.

So the rule is not "no long cells". It is: **a column of identifiers and a column of prose cannot
share a table.** A feature table whose left column is two plain words is fine at any width.

When each item needs a paragraph, drop the table. A short heading per item, then the paragraph —
that shape survives every width, including a phone, and the name stays whole.

And a one-row table is never right. If there is one of something, write the sentence.

Everything below is the opt-in layer.

Endpoint states below were checked on 2026-09-15. Re-check before recommending any hosted
service: this ecosystem rots fast, and that is the main finding of this file.

## 1. Badges

**Cap: 5–8, one row, every one dynamic.** Fixed order: version → build → coverage → licence →
docs/chat.

Badges are part of the default when the project is **published somewhere that reports numbers**:
a package registry, an app store, a CI run. Those badges are read from a live source, so they
inform rather than decorate. A project that publishes nowhere gets none, and that is not an
omission.

### Verify the value, not just the endpoint

A 200 response is not a working badge. Fetch each candidate and read the `<title>` out of the SVG
before committing to it — shields renders a badge either way, and a badge that says the wrong
thing is worse than no badge:

```bash
curl -sL "https://img.shields.io/<path>" | grep -o '<title>[^<]*</title>'
```

Drop any badge whose real value is `not found`, `0`, `unknown`, `invalid`, or `no releases`. Seen
in practice: a store rating badge reading `rating: not found` on an extension with no reviews
yet, and an `amo/rating` badge rendering a confident `0/5`. Both would have shipped as evidence
against the project.

A failing licence badge is a finding, not a badge problem: `license: not identifiable by github`
means GitHub cannot detect the licence, so it is missing from the repository sidebar too. Report
that instead of working around it.

### App-store badges

For a browser extension, a mobile app, or anything else distributed through a store, the store
badges are the most informative ones available — they carry the reviewed version, which is the
number a reader actually wants, and they show drift when one store is slower to approve.

| Source | Shields path |
|---|---|
| Chrome Web Store | `chrome-web-store/v/<id>`, `/users/<id>`, `/rating/<id>` |
| Firefox add-ons | `amo/v/<slug>`, `/users/<slug>`, `/rating/<slug>` |
| Visual Studio Code | `visual-studio-marketplace/v/<publisher>.<name>` |

Add `?logo=googlechrome&logoColor=white` or `?logo=firefoxbrowser&logoColor=white` — those come
from Simple Icons and cost nothing extra. Use the default flat style; never `for-the-badge`.

### A single brand icon, outside a badge

An install table reads better with the browser or platform mark beside each row than with the name
alone. `cdn.simpleicons.org` serves one icon as a small SVG, colour set in the path:

```markdown
| <img src="https://cdn.simpleicons.org/googlechrome/4285F4" width="16"> Chrome | [Web Store](…) |
| <img src="https://cdn.simpleicons.org/firefoxbrowser/FF7139" width="16"> Firefox | [Add-ons](…) |
```

Around 550 bytes each, camo-proxied on GitHub. Two rules: use the exact slug
([simpleicons.org](https://simpleicons.org) — `firefoxbrowser` is the browser, `firefox` is the
brand), and set `width` so it matches the text rather than towering over it. This is for a short
table of destinations, not a wall of technology logos — that is still banned above.

**Dynamic versus static is the distinction that matters**, not the category.
`img.shields.io/badge/build-passing-green` renders green on a repo with zero tests. A static
badge asserting a **quality** property is worse than no badge — it looks like evidence and is not.
Only emit a badge whose value is read from somewhere real.

One exception: a static badge stating **scope** rather than quality — `platform: Windows`,
`requires: Node 22+` — asserts nothing that can rot into a lie, and often has no live source.
Keep those. But check whether a live source exists before settling for static: a licence, a
release, a CI run and a download total usually have one, and a project carrying only static
badges is usually a project that never looked.

| Carries information | Pure decoration — refuse |
|---|---|
| CI / build status | "made with ❤️" |
| Released version (npm, PyPI, crates, Maven) | "PRs welcome" |
| Licence | Visitor / hit counters |
| Test coverage | Follow and social badges |
| Supported language or runtime versions | Tech-stack icon rows (Skill Icons, `for-the-badge` walls) |
| Downloads, bundle size | Anything whose real audience is the maintainer |
| Security scan (OpenSSF Scorecard, Snyk) | |

A tech-stack icon row conveys strictly less than one sentence of prose and costs a network
round-trip per icon.

**Alt text is mandatory, and it must be label-shaped.** On GitHub, badges are proxied through
`camo.githubusercontent.com` and rendered as `<img>`, so a screen reader announces *your* alt
text, not the SVG's internal `aria-label`. Alt text is also static, so it goes stale silently:

```markdown
![CI status](https://github.com/<owner>/<repo>/actions/workflows/ci.yml/badge.svg)
```

Write `![CI status]`, never `![build passing]` — the second one lies the moment CI goes red.

Every badge's information must also exist in text somewhere: the version in the install snippet,
the licence in a Licence section, CI in the Actions tab. A row of fifteen badge images is fifteen
announced items before the first sentence of prose.

**Off GitHub there is no camo proxy.** The same README on npm or PyPI leaks every reader's IP to
the badge host. `standard-readme` recommends hosting static badge images locally for this reason.

## 2. Hosted widgets — what is actually alive

| Tool | Scope | State on 2026-09-15 |
|---|---|---|
| **Shields.io** | project | Alive, active daily. The default |
| **Simple Icons** | project | Alive, CC0, released weekly |
| **Star-History** | project-ish | Alive, but a 65 KB SVG and ~3.5 s to load. Stars are a vanity metric |
| **Devicon** | project | Slowing — no release since July 2025 |
| **Badgen** | project | Commits yes, **no release since 2019**. No reason to pick it over Shields |
| **shieldcn** | project | 5 months old, one maintainer, and it monetises reader analytics. Promising, not a default |

Project-scope tools only. The profile-only widgets — stats cards, streaks, trophies,
contribution snakes and the generators that assemble them — are in `profile.md` §3, the only
page where any of them belongs.

## 3. Theme-aware images

Use `<picture>` with `prefers-color-scheme`. This is GitHub's own documented pattern, and GitHub
wraps it in a `<themed-picture>` custom element on render, so it is first-class:

```html
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/hero-dark.png">
  <source media="(prefers-color-scheme: light)" srcset="docs/hero-light.png">
  <img alt="The timeline view with four tracks loaded" src="docs/hero-light.png">
</picture>
```

- `media` and `srcset` go on `<source>`. The `<img>` goes **last** and carries `alt` plus the
  light/default `src`.
- `alt` describes the content, never the theme.
- **`#gh-dark-mode-only` is legacy.** It appears nowhere in current GitHub documentation and gets
  no special handling. Do not emit it.
- npm and PyPI do not honour `<picture>`. Design the light variant to stand alone.

Also survives GitHub's sanitiser: `<details>`/`<summary>`, `<img align width alt>`,
`<div align="center">`. Stripped: `<iframe>`, `<audio>`.

## 4. Diagrams

**Native Mermaid first.** A ` ```mermaid ` fence renders on GitHub, is theme-aware, stays
searchable and diffable, and involves no third party. This beats every image-based option.

Second choice: a `.drawio.svg` or `.excalidraw.svg` hybrid file, which renders as an image while
staying editable. PlantUML and D2 need an external render step — only worth it if the repo
already has one.

Never ASCII-art a diagram. Misaligned pipes are a documented slop tell.

## 4b. Open every image before you use it

**Never reference an image you have not looked at.** A filename is not evidence. Open each
candidate, and answer four questions before it goes in the file.

**1. Is this the right product?** A forked or templated repository carries the original's
screenshots, and they look plausible. Check the window title, the branding, the URL bar, the shape
of the interface. If the interface in the image is not the one the code builds, the image is a lie
in a form readers trust more than prose.

**2. Is it current?** Compare against what the code renders now. A screenshot taken before a
redesign undersells the project and confuses anyone following along.

**3. Does it leak?** A screenshot captures whatever was on screen. Look at the whole frame, not
the part you meant to capture:

- Browser tabs and their titles, bookmarks bar, open windows behind
- The URL bar: account names, tokens in query strings, internal hosts
- Window title bars and file paths, which carry the machine's username
- Real names, email addresses and real data in what looks like sample data
- Notifications, calendar peeks, anything from a messaging app

An image leak is worse than a prose leak: it is not greppable, and nobody re-reads it before
publishing. Treat anything you find here as a blocker, the same as §1 of `voice.md`.

**4. What does it actually show?** This determines two things. The `alt` text, which describes the
content rather than the filename or the theme. And the placement: an image belongs next to the
feature it demonstrates, not stacked at the top with the others. A repository holding four
screenshots usually holds four different capabilities — find out which, then put each one where it
explains something.

For an animated GIF or a video you will typically see only the first frame. Say so rather than
describing the whole clip from a guess: check the source the clip was made from, or ask.

Also confirm the file is **committed**. An image that exists on disk but is untracked renders as a
broken image for everyone else.

## 5. Demos

**For a 10-second terminal demo:**

1. Generate it with **VHS** (`charmbracelet/vhs`) from a `.tape` script, so it is reproducible in
   CI and re-recordable when the UI changes.
2. Commit the GIF and reference it inside `<picture>`. This is the only option that works on
   github.com, npm, PyPI and crates.io at once.

`<video>` does render in a README — GitHub rewrites `github.com/user-attachments/assets/<uuid>`
into a signed URL, and 18k+ READMEs use it. Two constraints: the URL must be GitHub-hosted (drag
the file into an issue comment to get one; a committed file will not do), and it has no fallback
on any mirror. Use it only as a github.com-only extra.

GIFs autoplay, loop, and offer no pause. Over ~10 seconds that is an accessibility problem, and a
10-second GIF is roughly 5–10× the bytes of the equivalent mp4. Keep them short.

Size limits: 10 MB for images and GIFs, 10 MB video on free plans.

## 6. Privacy

Three separate exposures. Keep them separate when advising:

- **Reader IP.** Mitigated on GitHub by camo, not mitigated anywhere else the README is rendered.
- **The author's own data.** Stats widgets read through a personal access token and can surface
  private-repo aggregates and commit-time-of-day patterns. **Waka Readme Stats is the worst**:
  it publishes language, editor and OS breakdowns plus hours coded, derived from tracking all
  coding, private and client work included.
- **Identity.** Any contributions-graph widget publishes a precise daily activity timeline —
  timezone, working hours, holidays, leave. A deliberate choice on a profile README. Never
  appropriate in a project README.

## 7. Worth adding, missing from most lists

- **OpenSSF Scorecard** badge — a real, dynamic security signal.
- **repostatus.org** — a project lifecycle badge, honest about maturity.
- **all-contributors** — generates a *text* table. Accessible, no third party. Prefer it to
  `contrib.rocks`, which is an image and was timing out at 35 s on the day this was written.
- **lychee** in CI — dead-link checking. Badge and widget rot is the dominant long-term README
  failure, and this whole file is the evidence.
- **GitHub's own social preview** (repo Settings → Social preview, 1280×640). It controls how the
  repo looks when shared anywhere, and almost nobody sets it.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Fifteen badges including a tech-stack icon wall | 5–8, all dynamic, one row |
| `![](https://img.shields.io/...)` with empty alt | `![CI status](...)` — label-shaped, never value-shaped |
| A static `build-passing` badge | The real workflow badge URL, or nothing |
| Emitting a widget without checking it responds | Check, or use the Action-generated variant |
| Shipping a badge because the endpoint returned 200 | Read the SVG `<title>`. Drop `not found`, `0`, `unknown` |
| A bare wall of text because "decoration is opt-in" | The §0 baseline always applies. It costs nothing |
| An emphasis paragraph in bold prose | `> [!IMPORTANT]` — native, theme-aware, and a reader's eye finds it |
| `#gh-dark-mode-only` | `<picture>` with `prefers-color-scheme` |
| An image of a diagram | A ` ```mermaid ` fence |
| A 40-second GIF at the top of the README | A VHS-generated clip under 10 s, or a still |
| Profile widgets in a project README | They belong in `profile.md`, and only by choice |
