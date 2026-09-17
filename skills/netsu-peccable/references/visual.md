# Visual: tokens, radius, elevation

Change the look as a whole through its tokens. Load this for a request about the look in general
or its tokens, radius and shadows, and from `references/new-ui.md` when it builds tokens. Fonts,
colours and spacing have their own files (§5).

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
pair was checked with the snippet in `references/colors.md` §2.

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
  --color-danger-ink: #FFFFFF;  /* text on danger: 6.57 */
  --color-warning-ink: #FFFFFF; /* 5.93 */
  --color-success-ink: #FFFFFF; /* 5.41 */
  --color-focus: #1F6F5C;       /* ring 2px off the control: 5.49 on page, 6.02 on surface */
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
    --color-danger-ink: #0E1512;  /* 6.80; white would be 2.72 */
    --color-warning-ink: #0E1512; /* 8.23 */
    --color-success-ink: #0E1512; /* 8.36 */
    --color-focus: #5FB39B;       /* 7.04 on page, 6.46 on surface */
  }
}
```

Utilities follow the names: `bg-page`, `bg-surface`, `text-ink`, `text-ink-muted`,
`border-line`, `bg-accent`, `text-accent-ink`, `text-danger-ink`, `outline-focus`,
`rounded-control`, `rounded-panel`.

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

## 4. Shape: radius and elevation

- One radius scale, two or three values, recorded in `## Look`. Pills only for chips and toggles.
- Nested corners: outer radius = inner radius + padding. A 6 px button in a card with 8 px
  padding sits in a 14 px card. Past about 24 px of padding, or with an uneven inset, each
  radius is chosen on its own.
- Elevation, one method per level:

| Level | Carried by |
|---|---|
| Page | Nothing |
| In-flow surface (card, panel) | A 1 px `line` border or a tone step. No shadow |
| Overlay (menu, popover, dialog) | One shadow token, small blur; a border only if the shadow alone is lost on the page |

  A hairline under a wide soft shadow is two systems at once: pick one. Some guides prefer
  shadows, others borders; `## Look` records the choice.

## 5. Where the rest lives

| Part of the look | File |
|---|---|
| Fonts, sizes, wrapping, numbers | `references/typography.md` |
| Colours, contrast, dark mode | `references/colors.md` |
| Spacing, alignment, density, responsive | `references/layout.md` |
| Small details: radius pairs, optical alignment, icons, surfaces | `references/details.md` |
| Bolder, calmer or simpler as a whole | `references/emphasis.md` |

## 6. Old engines

CEP 11 ships Chromium 88 and CEP 12 Chromium 99 (Adobe CEP-Resources); support per caniuse:

| Feature | Needs Chromium | In CEP 11 / 12 |
|---|---|---|
| `oklch()`, `color-mix()`, Tailwind v4 | 111 | no. Use hex and plain CSS or Tailwind v3 |
| `text-wrap: balance` / `pretty` | 114 / 117 | no. Harmless, simply ignored |
| `:has()`, container queries | 105 | no |
| `prefers-color-scheme`, `prefers-reduced-motion` | 76, 74 | yes |

Tauri renders with the system webview: check against the oldest one you ship.

## Proof

- The audit counts from §2, before and after, and
  `node <skill dir>/scripts/scan.mjs ui <changed files>` with zero `block` findings.
- Before and after screenshots at the same size and theme.
- For colour changes, the pairs table of `references/colors.md` §2.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Swaps `#6366f1` for another hex in 14 components | Changes one token; components use `bg-accent` |
| Picks Inter, or bans it, by reflex | Uses what `## Look` records, and records the reason |
| A second set of variables next to shadcn's | The shadcn names, mapped to the roles |
| `rounded-2xl` on everything, card and button alike | Two or three radii; outer = inner + padding |
| A 1 px border plus a 40 px soft shadow on in-flow cards | Border or tone for in-flow, one shadow for overlays |
| `text-[13px] p-[13px] rounded-[20px]` | The scale steps |
| Tailwind v4 and `oklch()` in a CEP panel | Hex values and plain CSS, checked in the host |
