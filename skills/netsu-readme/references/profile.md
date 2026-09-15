# Profile README

The README at `github.com/<user>/<user>`, shown on the profile page. A different artefact from a
project README: it has no install step, no API, and no reader trying to decide whether to adopt
something. It answers "who is this and what do they work on".

Everything in `voice.md` still applies. The context-leak rules apply *harder* here, because a
profile is the one page where personal information is plausible and therefore easy to overshare.

## 1. Ask first

The repo cannot answer any of this. Ask, in one batch:

1. **What should a visitor learn in ten seconds?** One line.
2. **Public identity** — the name to display. Pseudonym or real name. Never assume, never
   infer it from `git config`, never carry it over from a conversation.
3. **What to link:** site, portfolio, a specific project, a social account. Exact URLs only.
4. **What to pin and describe** — usually 2–4 projects, each with one line on what it is.
5. **Stack**, if it should be listed at all, and whether as prose or icons.
6. **Activity widgets:** yes or no, and knowing that they publish a daily activity timeline —
   timezone, working hours, holidays. See §4.
7. **Contact:** how, or explicitly not at all.
8. **Language** of the page.

## 2. Shape

Short. The profile page crops, and a visitor scrolls once at most.

| Block | Keep when |
|---|---|
| One-line introduction | Always. Plain prose, no heading above it |
| What you are working on now | Always — this is the only block that is genuinely current |
| Two to four projects, one line each | Always. The whole point of the page |
| Stack | Only if it says something a visitor could not guess from the projects |
| Links | Always, as a short list |
| Contact | If contact is wanted |
| Stats and activity widgets | By explicit choice — see §4 |
| Banner / typing animation | By explicit choice. Decoration, nothing more |

Skip entirely: a visitor counter, a random quote, a random joke, a "thanks for visiting", a
trophy wall, and anything that was true once and will never be updated.

## 3. What is dead

Checked 2026-09-15. Full table in `visuals.md`. The short version for this page:

**Do not emit** — these return errors and render as broken images:

- `github-readme-stats.vercel.app` → 503
- `github-profile-trophy.vercel.app` → 402
- `github-readme-activity-graph.vercel.app` → 402

**Do not use the generators.** Profilinator is archived. GPRM is dormant with 406 open issues and
produces exactly the three dead widgets above. A profile README assembled by either is a page of
broken images.

**Still alive:** Readme Streak Stats, Profile Summary Cards, Readme Typing SVG, Capsule Render,
Snk, Profile 3D Contrib. Shields.io and Simple Icons for anything static.

**Prefer the GitHub Action variants.** Snk and Profile 3D Contrib render an SVG and commit it to
the repository, served from `raw.githubusercontent.com`. No hosted endpoint to go down, no cold
start, no rate limit. Profile Summary Cards and Readme Stats both offer an Action mode too. This
is the single highest-value recommendation on this page — every dead entry above is a hosted
endpoint, and no Action-based tool in the set has failed.

## 4. Before adding any activity widget

State the tradeoff once, plainly, and let the user decide:

- Contribution graphs, streak counters and 3D contribution widgets publish a **precise daily
  activity timeline**. Timezone, working hours, days off, holidays, and a visible gap during
  illness or leave are all inferable.
- **Waka Readme Stats goes furthest**: it publishes language, editor and OS breakdowns plus hours
  coded, derived from tracking all coding — private repositories and client work included.
- Stats widgets read through a personal access token and can surface private-repo aggregates.

None of this is a reason to refuse. It is a reason not to add one silently.

## 5. Identity

- Use exactly the name the user gave. If they use a pseudonym, the pseudonym is the identity —
  the real name does not appear, not in prose, not in an image `alt`, not in a link.
- No email unless the user asks for one by name.
- No employer, no city, no client, no schedule unless explicitly requested.
- Never carry a detail from the conversation onto the page because it seemed relevant.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Three stats cards, a trophy wall and a streak counter by default | Nothing until asked, then the alive ones only |
| Generating the page from GPRM or Profilinator | Write it. Both generators emit dead widgets |
| A hosted endpoint where an Action exists | The Action variant, SVG committed to the repo |
| "Passionate developer who loves building innovative solutions" | One sentence about what they actually make |
| A skill-icon wall of 20 logos | Two to four projects, one line each |
| A real name inferred from `git config` | The public identity the user stated |
| Adding a contribution graph without a word | Name the tradeoff, then let them choose |
| "Thanks for visiting! 😊" and a visitor counter | End on the links |
