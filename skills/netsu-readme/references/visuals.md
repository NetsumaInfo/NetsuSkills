# Visuals

Badges, demos, diagrams, theme-aware images. Load only when the user asks for decoration —
the default in `SKILL.md` is none.

Endpoint states below were checked on 2026-09-15. Re-check before recommending any hosted
service: this ecosystem rots fast, and that is the main finding of this file.

## 1. Badges

**Cap: 5–8, one row, every one dynamic.** Fixed order: version → build → coverage → licence →
docs/chat.

**Dynamic versus static is the distinction that matters**, not the category.
`img.shields.io/badge/build-passing-green` renders green on a repo with zero tests. A static
badge asserting a quality property is worse than no badge — it looks like evidence and is not.
Only emit a badge whose value is read from somewhere real.

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
| **GitHub Readme Stats** | profile | **Public host down — 503.** Its own README calls the public instance "best-effort and can be unreliable" |
| **GitHub Profile Trophy** | profile | **Host down — 402** |
| **Readme Activity Graph** | profile | **Host down — 402.** Already burned through Heroku, Cyclic and Vercel |
| **Readme Streak Stats** | profile | Alive, ~3.6 s. Its README recommends self-hosting |
| **Profile Summary Cards** | profile | Alive. Use the Action mode, not the endpoint |
| **Readme Typing SVG** | profile | Alive. Animated text is a motion-sensitivity problem |
| **Capsule Render** | profile | Alive. Decoration only, single point of failure |
| **Skill Icons** | profile | Stalled — no commit since February, 1,278 open issues |
| **Snk** (contribution snake) | profile | Alive, Action-based. **No LICENSE file** — legally unclear |
| **Profile 3D Contrib** | profile | Alive, Action-based. Good architecture |
| **Waka Readme Stats** | profile | Alive. Worst privacy in the set — see §6 |
| **Metrics** (lowlighter) | profile | **Frozen since December 2023** |
| **Readme Quotes** | profile | **Abandoned**, Heroku host 404s |
| **Readme Joke** | profile | **Abandoned since 2022.** Its SVG ships `<script>` |
| **Profilinator** | generator | **Archived.** Do not reference |
| **GPRM** | generator | Dormant, 406 open issues — and it generates exactly the three dead widgets above |

**Never emit `github-readme-stats.vercel.app`, `github-profile-trophy.vercel.app`, or
`github-readme-activity-graph.vercel.app`.** They are down and a reader sees a broken image.

**Prefer the Action model over the hosted-endpoint model** whenever a tool offers both. Snk,
Profile 3D Contrib and Profile Summary Cards render an SVG and commit it to the repository,
served from `raw.githubusercontent.com`. No cold start, no rate limit, nothing to 402.

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
| `#gh-dark-mode-only` | `<picture>` with `prefers-color-scheme` |
| An image of a diagram | A ` ```mermaid ` fence |
| A 40-second GIF at the top of the README | A VHS-generated clip under 10 s, or a still |
| Profile widgets in a project README | They belong in `profile.md`, and only by choice |
