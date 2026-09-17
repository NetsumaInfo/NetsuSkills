# Emphasis: bolder, calmer, simpler

Turn one named part of a screen up or down. Load this only when the user asks to make something
bolder, more striking, calmer, quieter, simpler, less busy or less cluttered. It changes emphasis
inside the current look; a new look goes to `references/new-ui.md`.

## 0. Frame

| | |
|---|---|
| Changes | The named target only, through one lever of §2 and the tokens it needs |
| Never changes | Everything outside the target, the content and its claims, the behaviour, the brand. No new colour, font or component unless the user asks |
| Asks first | Which target, when the request says "the page" and the page has several sections |
| Stops when | The one lever has moved and the target still clears §4 |
| Returns | The lever changed, the same capture before and after, the proof |

"Everything else stays" is meant literally (impeccable, `reference/bolder.md`, read 2026-09-17).

## 1. Find why it reads that way

Look at the target next to the parts of the product that already feel right, and write one
sentence: what makes it flat, loud or busy. Name the sources, from this list only:

| Too flat | Too loud | Too busy |
|---|---|---|
| The primary element is the same size and weight as the rest | Several filled or accent elements compete | More than one primary action per region |
| The type scale is not used at full strength here | Saturated colours or glows beyond `## Look` | Repeated information, duplicate labels |
| The key number or action sits below the fold | Heavy shadows, borders on everything | Options that are rarely used, all visible |
| Uniform spacing: no rhythm | Motion that runs without a reason | Decoration nobody chose (`references/ai-look.md`) |

## 2. Move one lever

| Request | Levers, pick one |
|---|---|
| Bolder | Size and contrast of the one primary element; a larger type scale step for the target; more space inside the target |
| Calmer | Fewer accent uses; lower saturation within `## Look`; fewer shadows and borders; less motion (`references/motion.md`) |
| Simpler | Fewer elements per region; secondary actions behind a menu; repeated information removed; rarely used options behind a disclosure |

- Reuse what the system already has, turned up or down: the existing type scale at full strength,
  the accent where `## Look` allows it. A bolder version is the same brand, more sure of itself.
- One decisive move, completed; inside the target, the secondary elements step back so the move
  shows.
- Simpler never removes a feature: it moves it one step away, and says where it went.
- Content stays true. A claim, a number or a label is changed only with `references/copy-app.md`
  or `references/copy-pages.md`, never to make the layout work.

## 3. Check the skeleton

Remove the text in your head and look at the structure: does it still show what matters most,
through size, order and space? If not, the lever is the wrong one.

## 4. The floor

After the change: contrast measured (`references/colors.md` §2), focus visible, targets at size,
nothing clipped at the supported widths, every state still there. A lever that breaks the floor
is undone and reported.

## 5. Report and proof

```markdown
## Emphasis: <target>, <bolder | calmer | simpler>

Why it read that way: <one sentence>
Lever: <one>

| Before | After |
|---|---|
| Title 20 px semibold, same as the cards | Title 31 px (scale step 5), cards unchanged |
```

Proof: the same capture before and after, at the same size and theme; the `ui` scan with zero
`block` on the changed files. For "simpler", list what moved and where it is now.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| "Bolder" adds a gradient, a glow and a new font | One lever, inside the look |
| "Calmer" greys everything out | Fewer accents; the primary action still stands out |
| "Simpler" deletes features | Features moved one step away, and named |
| The whole page restyled for one section | The named target only |
| Five levers at once | One, completed |
| A claim shortened to fit the new layout | The copy files, or the claim unchanged |
