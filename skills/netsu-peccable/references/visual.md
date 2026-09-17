# Visual: fonts, colours, spacing, density, dark mode

Change how the product looks through its tokens. Load this for a font, palette, spacing,
radius, density or theme request, and from `references/new-ui.md` when it builds tokens.

## 1. Read `## Look`

- `## Look` answers the question: apply it.
- The user names a value ("use Atkinson Hyperlegible", "accent #2B4C7E"): apply it and write it
  into `## Look`.
- Nothing decided and the request is open ("make it look better", "pick fonts"): run the
  direction step of `references/new-ui.md` (step 4). Do not pick silently.

## 2. Audit the current values

Portable greps: no `-P`, because Git Bash on Windows ships a grep whose `-P` fails or returns
nothing, depending on the locale. Replace `src/index.css` with the token file.

```bash
# colours written outside the token definitions
grep -rnE '#[0-9a-fA-F]{3,8}([^0-9a-zA-Z_-]|$)|rgba?\(|hsla?\(|oklch\(' src --include='*.ts' --include='*.tsx' --include='*.jsx' --include='*.css' | grep -v '^src/index.css:.*--color-'
# Tailwind arbitrary values: bg-[#...], text-[13px], rounded-[20px], shadow-[...]
grep -rnoE '[a-z-]+-\[[^]]+\]' src --include='*.ts' --include='*.tsx' --include='*.jsx'
# font families and where fonts load from
grep -rnE "font-family|font-\[|@fontsource|fonts\.googleapis" src index.html package.json 2>/dev/null
# radius and shadow variety: more than 3 radii or 2 shadows in use is a finding
grep -rhoE '(rounded|shadow)(-[a-z0-9]+)*(-\[[^]]+\])?' src --include='*.tsx' --include='*.jsx' | sort | uniq -c | sort -rn
grep -rnE 'border-radius|box-shadow' src --include='*.css'
# inline styles
grep -rnE 'style=\{\{' src --include='*.tsx' --include='*.jsx'
```

Report the result as counts (colours outside tokens, arbitrary values, families, radii, shadows,
inline styles), then read each hit in the files you will change. Across a large app, group the
hits by value and read one per group. An anchor like `href="#abc"` matches the colour grep: skip it.

## 3. Change tokens, not instances

Edit the token file, then replace each instance with the token utility and delete the arbitrary
value. A one-off value that no token covers is either a missing token or a mistake.

Tailwind v4 token block. The values are the "shot log" example from `references/new-ui.md`; each
pair was checked with the snippet in §Colour.

```css
@import "tailwindcss";
@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

@theme {
  --color-page: #F3F5F2;        /* bg */
  --color-surface: #FFFFFF;     /* panels, cards, inputs */
  --color-raised: #FFFFFF;      /* menus, dialogs */
  --color-ink: #1B2420;         /* text: 14.51 on page */
  --color-ink-muted: #5B6660;   /* secondary text: 5.98 on surface */
  --color-line: #D5DBD7;        /* dividers */
  --color-line-strong: #8C968F; /* input borders: 3.05 on surface */
  --color-accent: #1F6F5C;
  --color-accent-ink: #FFFFFF;  /* text on accent: 6.02 */
  --color-danger: #B42318;
  --color-warning: #8A5A00;
  --color-success: #18794E;
  --font-sans: "Source Sans 3", ui-sans-serif, system-ui, sans-serif;
  --radius-control: 4px;
  --radius-panel: 8px;
}

@layer base {
  :root { color-scheme: light; }
  [data-theme="dark"] {
    color-scheme: dark;
    --color-page: #161A18;
    --color-surface: #1D2220;
    --color-raised: #252B28;
    --color-ink: #E4E8E5;       /* 14.20 on page */
    --color-ink-muted: #A3ADA7; /* 6.98 on surface, 6.25 on raised */
    --color-line: #333B37;
    --color-line-strong: #6F7B75; /* 3.66 on surface */
    --color-accent: #5FB39B;    /* lighter and softer than in light: 6.46 on surface */
    --color-accent-ink: #0E1512;
    --color-danger: #F07A6E;
    --color-warning: #D9A441;
    --color-success: #4CC38A;
  }
}
```

Utilities follow the names: `bg-page`, `bg-surface`, `text-ink`, `text-ink-muted`,
`border-line`, `bg-accent`, `text-accent-ink`, `rounded-control`, `rounded-panel`.

shadcn/ui projects keep their variable names; map instead of adding a second set:

| Role | shadcn/ui variable |
|---|---|
| page, ink | `--background`, `--foreground` |
| surface, raised | `--card`, `--popover` |
| ink-muted | `--muted-foreground` |
| line, line-strong | `--border`, `--input` |
| accent, accent-ink | `--primary`, `--primary-foreground` |
| danger | `--destructive` |

React Native: the same roles as keys of one theme object per scheme, read through a hook.

## Typography

- Two families at most. One is often right for product UI.
- Serif display, a system stack or Inter are all legitimate when `## Look` records them for a
  reason. None of them is a default: some guides ban serif headlines, others recommend them, and
  `DESIGN.md` settles it for this product.
- Scale: ratio about 1.2 for dense UI, 1.25 to 1.333 for content and landing pages.

| Ratio | Steps in px (base in bold) |
|---|---|
| 1.2 from 14 | 12, **14**, 17, 20, 24, 29 |
| 1.25 from 16 | 13, **16**, 20, 25, 31, 39 |

- UI body 14 to 16 px. Captions not below 12 px.
- Line height about 1.5 for body, 1.1 to 1.25 for headings. Negative tracking only on large
  headings, and not past -0.04em.
- Measure 60 to 75ch for reading text: `max-w-[65ch]`. Tables and dense panels may run wider.
- Numbers that change or line up in columns: `font-variant-numeric: tabular-nums`
  (`tabular-nums`).
- Headings `text-wrap: balance` (`text-balance`), body `text-wrap: pretty` (`text-pretty`).
- Load only the weights in use, self-hosted (`@fontsource/<name>`, or local `@font-face` files
  when there is no package manager), with `font-display: swap`. A system stack is a valid choice
  for a tool that must match its host or work offline; record it in `## Look`.
- Emphasis by weight or size. Not by gradient text, not by one italic serif word.
- Never block zoom (`user-scalable=no`, `maximum-scale=1`). Sizes in `rem`, so text zoomed to
  200% still fits (WCAG 2.2 SC 1.4.4, read 2026-09-17). React Native keeps `allowFontScaling` on.

## Colour

- Semantic tokens only: page, surface, ink, ink-muted, line, accent, danger, warning, success.
  No `blue-500` in a component.
- Status colours and chart series also differ by label, icon or pattern. Check them with the
  colour-blindness emulation in the browser's rendering tools.
- A landing page may let one colour own a whole region when `## Look` records it. Product UI
  keeps the accent for the primary action and the current selection.
- One accent. `## Look` lists what it is used for (primary action, current selection, focus).
  Anything else in accent is a finding.
- Hierarchy by order, grouping, size, weight and grey value before hue (interface-craft,
  github.com/deanayoung3-droid, checked 2026-09-16).
- Contrast, WCAG 2.2 (w3.org/TR/WCAG22):
  - text and placeholder 4.5:1 (SC 1.4.3);
  - large text 3:1: 24 px regular or 18.66 px bold and up (SC 1.4.3);
  - control boundaries that identify a control, focus indicators and meaningful icons 3:1
    against adjacent colours (SC 1.4.11). An input whose only outline is its border needs
    `line-strong`;
  - disabled controls are exempt, but still carry a reason (`references/states.md`).
- Secondary text on a coloured or tinted surface is mixed from ink and that surface, not a
  stock grey: `color-mix(in oklab, var(--color-ink) 65%, var(--color-surface))`, then check it.
- Never colour alone: an error has an icon and a message, a chart series has a label or a
  shape, the current tab has a marker.
- OKLCH is an option for ramps: keep hue and chroma, step lightness
  (`oklch(0.52 0.08 170)`, hover `oklch(0.47 0.08 170)`). Check the resulting hex for contrast.

Contrast proof, zero dependencies, pairs as `text background`. Works in Git Bash and PowerShell 7:

```bash
node -e 'const L=h=>{h=h.replace("#","");if(h.length<6)h=[...h].map(c=>c+c).join("");return[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255).map(c=>c<=0.04045?c/12.92:((c+0.055)/1.055)**2.4).reduce((s,c,i)=>s+c*[0.2126,0.7152,0.0722][i],0)};const a=process.argv.slice(1);for(let i=0;i<a.length;i+=2){const[x,y]=[L(a[i]),L(a[i+1])];console.log(a[i],"on",a[i+1],((Math.max(x,y)+0.05)/(Math.min(x,y)+0.05)).toFixed(2))}' '#000' '#fff' '#777' '#fff'
```

```text
#000 on #fff 21.00
#777 on #fff 4.48
```

`#777` on white fails body text by 0.02. Run every text and surface pair, in every theme, the
label on the accent included: white on a mid blue often fails.

## Spacing and shape

- A 4/8 scale: 4, 8, 12, 16, 24, 32, 48, 64. In Tailwind v4 that is `1 2 3 4 6 8 12 16`. No
  `p-[13px]`.
- Tight inside a group, wide between groups, more above a heading than below it. One gap
  repeated everywhere flattens the page.
- Density is a `## Look` choice, applied through tokens:

| Token | Compact | Comfortable |
|---|---|---|
| Control height | 28 to 32 px | 36 to 40 px |
| Table row | 32 px | 44 to 48 px |
| Body text | 13 to 14 px | 15 to 16 px |
| Gap inside a group | 4 to 8 px | 8 to 12 px |

  Declare them in `@theme` as `--spacing-control: 2rem;` so `h-control` exists. Touch screens
  keep 44 pt (iOS) or 48 dp (Android) targets at any density.
- One radius scale, two or three values, recorded in `## Look`. Pills only for chips and
  toggles.
- Nested corners: outer radius = inner radius + padding. A 6 px button in a card with 8 px
  padding sits in a 14 px card.
- Elevation, one method per level:

| Level | Carried by |
|---|---|
| Page | Nothing |
| In-flow surface (card, panel) | A 1 px `line` border or a tone step. No shadow |
| Overlay (menu, popover, dialog) | One shadow token, small blur; a border only if the shadow alone is lost on the page |

  A hairline under a wide soft shadow is two systems at once: pick one. Some guides prefer
  shadows, others borders; `## Look` records the choice.
- A sticky bar never hides the focused element: `scroll-padding-top` equal to its height (WCAG 2.2
  SC 2.4.11, read 2026-09-17). Full-height layouts use `100dvh`; fixed bars add
  `env(safe-area-inset-*)`.
- One z-index scale in tokens: base, sticky, dropdown, overlay, toast. No `z-[9999]`.

## Dark mode

- Ship one theme well before two badly. A second theme is a `## Look` decision.
- Not an inversion. Raised surfaces get lighter as they rise (page, surface, raised). Shadows
  barely show, so elevation comes from tone.
- Accents lose saturation and gain lightness until they pass on the dark surface. Body text is
  off-white, not `#FFF` on black.
- `color-scheme` on the root, so native controls and scrollbars follow.
- System preference plus a manual choice (System, Light, Dark), set before first paint. Put this
  in the document `<head>`:

```html
<script>
  try {
    const saved = localStorage.getItem("theme"); // "light" | "dark" | null for system
    const dark = saved ? saved === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch {}
</script>
```

  With no saved choice, listen to `matchMedia("(prefers-color-scheme: dark)")` changes and update
  `data-theme`.
- Contrast is checked in both themes, with the snippet above.
- React Native: `useColorScheme()`. Adobe CEP: follow the host skin, not the OS:
  `new CSInterface().getHostEnvironment().appSkinInfo`, refreshed on the
  `com.adobe.csxs.events.ThemeColorChanged` event.

Old engines. CEP 11 ships Chromium 88 and CEP 12 Chromium 99 (Adobe CEP-Resources); support
per caniuse:

| Feature | Needs Chromium | In CEP 11 / 12 |
|---|---|---|
| `oklch()`, `color-mix()`, Tailwind v4 | 111 | no. Use hex and plain CSS or Tailwind v3 |
| `text-wrap: balance` / `pretty` | 114 / 117 | no. Harmless, simply ignored |
| `:has()`, container queries | 105 | no |
| `prefers-color-scheme`, `prefers-reduced-motion` | 76, 74 | yes |

## Proof

- Contrast numbers for each text and surface pair, per theme, from the snippet.
- Before and after screenshots at the same size and theme.
- The audit counts from §2, before and after, and
  `node <skill dir>/scripts/scan.mjs ui <changed files>` with zero `block` findings.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Swaps `#6366f1` for another hex in 14 components | Changes one token; components use `bg-accent` |
| Picks Inter, or bans it, by reflex | Uses what `## Look` records, and records the reason |
| Grey secondary text on a tinted panel | Ink mixed with that surface, checked at 4.5:1 |
| "Looks readable" | The contrast ratio, as a number, in both themes |
| Dark mode by inverting the light palette | Lighter raised surfaces, softer accents, own contrast check |
| `rounded-2xl` on everything, card and button alike | Two or three radii; outer = inner + padding |
| A 1 px border plus a 40 px soft shadow on in-flow cards | Border or tone for in-flow, one shadow for overlays |
| `text-[13px] p-[13px]` | The scale steps |
| Colour as the only error signal | Colour, icon and message |
| Tailwind v4 and `oklch()` in a CEP panel | Hex values and plain CSS, checked in the host |
