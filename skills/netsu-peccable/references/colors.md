# Colours: palette, tokens, contrast, dark mode

Fix or set the colours. Load this only when the user asks about colours, contrast, a palette,
dark mode or high contrast. The token file itself and how to change it are in
`references/visual.md` §3.

## 0. Frame

| | |
|---|---|
| Changes | Colour tokens, the theme switch, and the colour classes of the elements the request names |
| Never changes | Fonts, spacing, layout, wording. The accent hue only when the user asks for a new one |
| Asks first | Only when the request needs a new palette and `## Look` has none (§3) |
| Stops when | Every pair of §2 passes or is reported, in every theme the product ships |
| Returns | The pairs table of §2, the findings table of §6 and the proof |

Colours have exact answers: never report a contrast you did not compute, never estimate a value
you can measure.

## 1. Read

1. `## Look`: the `Colors:` line, what the accent is for, and the themes.
2. The tokens, and the colours written outside them (`references/visual.md` §2 greps).
3. `node <skill dir>/scripts/scan.mjs ui <files>`: `palette-color`, `svg-fixed-color`, `glow`,
   `purple-gradient`, `gradient-text`.

## 2. Measure every pair

Pairs as `text background`, zero dependencies, Git Bash and PowerShell 7:

```bash
node -e 'const L=h=>{h=h.replace("#","");if(h.length<6)h=[...h].map(c=>c+c).join("");return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[0.2126,0.7152,0.0722][i],0)};const a=process.argv.slice(1);for(let i=0;i<a.length;i+=2){const[x,y]=[L(a[i]),L(a[i+1])];console.log(a[i],"on",a[i+1],((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2))}' '#000' '#fff' '#777' '#fff'
```

```text
#000 on #fff 21.00
#777 on #fff 4.48
```

`#777` on white fails body text by 0.02. Thresholds, WCAG 2.2 (w3.org/TR/WCAG22, read
2026-09-16):

- text and placeholder 4.5:1 (SC 1.4.3); large text 3:1, from 24 px regular or 18.66 px bold;
- control boundaries that identify a control, focus rings and meaningful icons 3:1 against
  what they sit on (SC 1.4.11). An input whose only outline is its border needs `line-strong`;
- disabled controls are exempt, and still show a reason (`references/states.md`).

Measure each text token on each surface it sits on, in each theme, and each fill with its ink
token: white on a light status colour passes in light mode and fails in dark mode. Text over an
image or a translucent surface is measured on its worst region, or gets a scrim. RGAA 4.1.2 and
EN 301 549 both check WCAG 2.1 AA (accessibilite.numerique.gouv.fr, read 2026-09-17); APCA is not
a W3C standard, so it is not the pass line here.

## 3. A new palette, only on request

- The user names colours: apply them and write them into `## Look`.
- The user asks you to choose: the direction step of `references/new-ui.md` (step 4), the colour
  row only, asked once. Never the model's usual palettes (`references/ai-look.md`, Colour).
- One neutral ramp, one accent, and only the status colours the product renders.
- OKLCH is an option for ramps: keep the hue, step the lightness, and lower the chroma toward
  both ends so every step stays inside sRGB (`oklch(0.52 0.08 170)`, hover
  `oklch(0.47 0.08 170)`). Check the gamut, then the contrast of each step (Krehel,
  github.com/jakubkrehel/skills, `palette-generation.md`, read 2026-09-17). A project that
  writes hex stays in hex; CEP panels need hex (`references/visual.md` §6).

## 4. Rules

- **Roles only in components.** page, surface, raised, ink, ink-muted, line, line-strong,
  accent, accent-ink, danger, warning, success and their inks, focus. No `blue-500` in a
  component (scan `palette-color`). A token is used for its role only: a separator colour is
  not a text colour. A missing role gets a token.
- **One accent**, for what `## Look` lists (primary action, current selection, focus). Anything
  else in accent is a finding. One filled primary action per view.
- **Status colours** stay apart from the accent, and differ by label, icon or pattern too. Check
  them and chart series with the colour-blindness emulation in the browser's rendering tools.
- **Never colour alone**: an error has an icon and a message, the current tab a marker.
- **Secondary text on a tinted surface** is mixed from ink and that surface:
  `color-mix(in oklab, var(--color-ink) 65%, var(--color-surface))`, then measured.
- **Fix contrast with lightness**, keep the hue.
- **Icons** draw with `currentColor` (scan `svg-fixed-color`).
- **Hierarchy** by order, grouping, size, weight and grey value before hue (interface-craft,
  github.com/deanayoung3-droid, checked 2026-09-16).
- **A landing page** may let one colour own a whole region when `## Look` records it.

## 5. Dark mode and high contrast

- Ship one theme well before two badly. A second theme is a `## Look` decision.
- Not an inversion. Raised surfaces get lighter as they rise; shadows barely show, so elevation
  comes from tone. Accents lose saturation and gain lightness until they pass. Body text is
  off-white, not `#FFF` on black.
- One switching mechanism (`data-theme`), with `color-scheme` on the root so native controls
  follow. System preference plus a manual choice, set before first paint:

```html
<script>
  try {
    const saved = localStorage.getItem("theme"); // "light" | "dark" | null for system
    const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch {}
</script>
```

  With no saved choice, listen to `matchMedia("(prefers-color-scheme: dark)")` and update it.
- Switching must not run every colour transition at once: add a style with
  `*,*::before,*::after{transition:none!important}`, set `data-theme`, read
  `document.body.offsetHeight`, remove the style two animation frames later; the same in the
  `matchMedia` listener (next-themes calls it `disableTransitionOnChange`, read 2026-09-17).
- `@media (prefers-contrast: more)` moves `line`, `line-strong` and `ink-muted` toward `ink`,
  measured again (MDN, *prefers-contrast*, read 2026-09-17). `forced-colors` keeps the system
  colours; the focus outline rule is in `references/components.md` §5.
- React Native: `useColorScheme()`. Adobe CEP: follow the host skin,
  `new CSInterface().getHostEnvironment().appSkinInfo`, refreshed on
  `com.adobe.csxs.events.ThemeColorChanged`.

## 6. Report and proof

```markdown
## Colours: <scope>

| Pair | Theme | Ratio | Needs | Result |
|---|---|---|---|---|
| `ink-muted` on `surface` | dark | 6.98 | 4.5 | pass |

| Severity | Where | Now | After | Rule |
|---|---|---|---|---|
```

Severity follows `references/review-ui.md` §6: text under its threshold is P1 (P0 when it hides
the main task); a colour with two meanings P2; drift from the tokens P3. Proof: the pairs table
before and after, the `ui` scan with zero `block`, one capture per theme.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Swaps `#6366f1` for another hex in 14 components | Changes one token; components use `bg-accent` |
| "Looks readable" | The ratio, as a number, in both themes |
| Dark mode by inverting the light palette | Lighter raised surfaces, softer accents, own measurements |
| White text on every status fill | An ink token per fill, measured per theme |
| Grey secondary text on a tinted panel | Ink mixed with that surface, measured |
| A darker hue to fix contrast | The same hue, another lightness |
| `oklch()` dropped into a hex codebase | The project's notation |
| Colour as the only error signal | Colour, icon and message |
| Picks a trendy palette unasked | The direction question, once |
