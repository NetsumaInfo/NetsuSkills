#!/usr/bin/env node
// netsu-peccable scan: heuristic checks for interface text (`copy`) and the generic AI look (`ui`).
// Regex extraction, not a parser. It misses strings built at run time and can flag code, so every
// finding is a prompt to read the line in context, never an instruction to rewrite it.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative, extname, basename, dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const SKILL_DIR = join(dirname(fileURLToPath(import.meta.url)), "..");

const HELP = `Usage:
  node scan.mjs copy [paths...] [--lang <code>|auto] [--source <code>] [--address tu|vous] [--changed <git-ref>] [--list] [--json] [--strict]
  node scan.mjs ui   [paths...] [--changed <git-ref>] [--json] [--strict]

copy  extracts the strings a user reads (code, locale catalogs in JSON or TS, extension manifests,
      Markdown given by name) and checks words, buttons, typography and the form of "you".
      Catalogs of several languages are compared: broken placeholders, missing keys, text left
      in code, keys the code never names. Pass the code folder with the locale folder, and
      --source with the language the others are translated from.
      Lexicons: references/words-<code>.md for each language found (fr en es de ja zh ship).
ui    flags the generic AI look and focus/transition mistakes in markup and styles.

Default path: src if it exists, else the current directory.
Levels: block = wrong in any UI; check = often wrong, read it in context.
Exit code 0, or 1 with --strict when a block finding exists.`;

const SKIP_DIRS = new Set([
  "node_modules", "dist", "build", "out", ".git", "coverage", "target", ".next", ".nuxt",
  ".svelte-kit", ".turbo", ".cache", "vendor", "__tests__", "__mocks__", "storybook-static",
  ".venv", "venv", ".output", "tmp",
]);
const SKIP_FILE = /\.(test|spec|stories|story)\.[cm]?[jt]sx?$|\.d\.ts$|\.min\.[cm]?js$/;
const CODE_EXT = new Set([".tsx", ".jsx", ".ts", ".js", ".mjs", ".cjs", ".vue", ".svelte", ".html", ".htm"]);
const STYLE_EXT = new Set([".css", ".scss", ".sass", ".less"]);
const TEXT_EXT = new Set([".md", ".txt"]);
const LOCALE_DIR = /^_?(locales?|i18n|l10n|langs?|languages|translations?|messages)$/i;
const LANG_NAME = /^([a-z]{2})(?:[-_][A-Za-z]{2,4})?$/;

// ---------------------------------------------------------------- arguments

function fail(message) {
  console.error(`scan: ${message}\n\n${HELP}`);
  process.exit(2);
}

function parseArgs(argv) {
  const opts = { mode: argv[0], paths: [], lang: "auto", source: null, address: null, changed: null, list: false, json: false, strict: false };
  if (!opts.mode || opts.mode === "-h" || opts.mode === "--help") {
    console.log(HELP);
    process.exit(0);
  }
  if (opts.mode !== "copy" && opts.mode !== "ui") fail(`unknown mode "${opts.mode}"`);
  const rest = argv.slice(1);
  const value = (i, name) => {
    if (i >= rest.length || rest[i].startsWith("--")) fail(`${name} needs a value`);
    return rest[i];
  };
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--lang") opts.lang = value(++i, a);
    else if (a === "--source") opts.source = value(++i, a);
    else if (a === "--address") opts.address = value(++i, a);
    else if (a === "--changed") opts.changed = value(++i, a);
    else if (a === "--list") opts.list = true;
    else if (a === "--json") opts.json = true;
    else if (a === "--strict") opts.strict = true;
    else if (a === "-h" || a === "--help") { console.log(HELP); process.exit(0); }
    else if (a.startsWith("--")) fail(`unknown option ${a}`);
    else opts.paths.push(a);
  }
  if (!/^([a-z]{2}|auto)$/.test(opts.lang)) fail("--lang must be a two-letter language code or auto");
  if (opts.source && !/^[a-z]{2}$/.test(opts.source)) fail("--source must be a two-letter language code");
  if (opts.address && !["tu", "vous"].includes(opts.address)) fail("--address must be tu or vous");
  if (opts.mode === "ui" && (opts.list || opts.address || opts.source || opts.lang !== "auto")) fail("--list, --lang, --source and --address apply to copy only");
  if (opts.paths.length === 0) opts.paths.push(existsSync("src") ? "src" : ".");
  return opts;
}

// ---------------------------------------------------------------- files

function walk(target, explicit, out) {
  if (!existsSync(target)) fail(`path not found: ${target}`);
  const st = statSync(target);
  if (st.isFile()) {
    out.push({ path: target, explicit });
    return;
  }
  for (const entry of readdirSync(target, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name) && !entry.name.startsWith(".")) walk(join(target, entry.name), false, out);
    } else if (entry.isFile()) {
      out.push({ path: join(target, entry.name), explicit: false });
    }
  }
}

function changedFiles(ref) {
  const git = (args) => execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
  let root;
  try {
    root = git(["rev-parse", "--show-toplevel"]).trim();
  } catch {
    fail("--changed needs a git repository");
  }
  let names;
  try {
    names = git(["diff", "--name-only", ref, "--"]) + git(["ls-files", "--others", "--exclude-standard"]);
  } catch {
    fail(`git could not diff against "${ref}"`);
  }
  return new Set(names.split("\n").filter(Boolean).map((n) => resolve(root, n)));
}

// The folder decides first: `locales/fr/ae.json` is French, whatever the namespace is called.
// A bare two-letter file name counts only inside a locale folder or with a region (`fr-FR`).
// `group` is the path with the language replaced by `*`: files in one group translate each other.
// `ui.ts` in an i18n folder is not a language: the code must name a real one.
let languageNames = null;
try {
  languageNames = new Intl.DisplayNames(["en"], { type: "language", fallback: "none" });
} catch {}
const isLangCode = (code) => (languageNames ? Boolean(languageNames.of(code)) : true);

function localeInfo(file) {
  const parts = file.split(/[\\/]/);
  for (let i = parts.length - 2; i > 0; i--) {
    const d = LANG_NAME.exec(parts[i]);
    if (d && isLangCode(d[1]) && LOCALE_DIR.test(parts[i - 1])) return { lang: d[1], group: [...parts.slice(0, i), "*", ...parts.slice(i + 1)].join("/") };
  }
  const name = basename(file).replace(/\.[^.]+$/, "");
  const m = LANG_NAME.exec(name);
  if (m && isLangCode(m[1]) && (LOCALE_DIR.test(parts[parts.length - 2] ?? "") || /[-_]/.test(name))) {
    return { lang: m[1], group: [...parts.slice(0, -1), `*${extname(file)}`].join("/") };
  }
  return null;
}
const localeLang = (file) => localeInfo(file)?.lang ?? null;

// A JSON file in a locale folder is a catalog; a `.ts` or `.js` one only when it is named for a
// language (`locales/fr.ts`), so `i18n/index.ts` stays code.
function isLocaleFile(file) {
  const ext = extname(file).toLowerCase();
  if (ext === ".json") return Boolean(localeLang(file)) || file.split(/[\\/]/).slice(0, -1).some((p) => LOCALE_DIR.test(p));
  return [".ts", ".js", ".mjs", ".cjs"].includes(ext) && Boolean(localeLang(file));
}

// A file passed by name is always read when its type is known, and reported when it is not.
function selectFiles(opts, notes) {
  const found = [];
  for (const p of opts.paths) walk(p, true, found);
  const changed = opts.changed ? changedFiles(opts.changed) : null;
  const keep = ({ path, explicit }) => {
    if (changed && !changed.has(resolve(path))) return false;
    if (SKIP_FILE.test(path)) return false;
    const ext = extname(path).toLowerCase();
    if (opts.mode === "ui") return CODE_EXT.has(ext) || STYLE_EXT.has(ext);
    if (CODE_EXT.has(ext)) return true;
    if (ext === ".json") return explicit || isLocaleFile(path) || basename(path) === "manifest.json";
    return TEXT_EXT.has(ext) && explicit;
  };
  return found.filter((f) => {
    const ok = keep(f);
    if (!ok && f.explicit && !changed) notes.push(`skipped ${f.path}: the ${opts.mode} scan does not read this file type`);
    return ok;
  });
}

// ---------------------------------------------------------------- text helpers

function lineIndex(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i++) if (text[i] === "\n") starts.push(i + 1);
  return (offset) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= offset) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
}

// Blank out comments, keeping offsets and newlines so line numbers stay right.
function maskComments(src) {
  const blank = (m) => m.replace(/[^\n]/g, " ");
  return src
    .replace(/<!--[\s\S]*?-->/g, blank)
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[\s;{}()])\/\/[^\n]*/g, (m, lead) => lead + blank(m.slice(lead.length)));
}

const ENTITIES = {
  nbsp: "\u00A0", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", laquo: "«", raquo: "»",
  hellip: "…", rsquo: "’", lsquo: "‘", ldquo: "“", rdquo: "”", mdash: "—", ndash: "–",
  thinsp: "\u2009", nnbsp: "\u202F",
};

function decodeEntities(s) {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
    if (e[0] === "#") {
      const code = e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10);
      return Number.isInteger(code) && code <= 0x10ffff ? String.fromCodePoint(code) : m;
    }
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

function decodeJs(s) {
  return s.replace(/\\(u\{[0-9a-f]+\}|u[0-9a-f]{4}|x[0-9a-f]{2}|.)/gi, (m, e) => {
    // "C:\Users" is a legal string: an escape that is not a code point stays as written.
    if (e[0] === "u" || e[0] === "U") {
      const code = parseInt(e.replace(/[u{}]/gi, ""), 16);
      return Number.isInteger(code) && code <= 0x10ffff ? String.fromCodePoint(code) : e;
    }
    if (e[0] === "x") return String.fromCharCode(parseInt(e.slice(1), 16));
    return { n: "\n", t: "\t", r: "" }[e] ?? e;
  });
}

const KEY_LIKE = /^(?:[\w-]+(?:[.:][\w-]+)+|__MSG_\w+__)$/;
const CLASS_TOKEN = /^!?-?[a-z0-9]+(?:[:-][a-z0-9/.[\]%#()_,]+)+$/;
// Code that a string-literal regex picked up: template tails, concatenated HTML, TS signatures,
// CSS values and XML attributes. Each alternative needs code syntax, so prose ("Please let us
// know", "the document.") survives.
const CODE_HINT = new RegExp([
  /\$\{/, /=>/, /\}\s*\)\s*[;,}]/, /\)\s*\{/, /\w\(\s*\)/,
  /\(\s*[a-z]\w*\??:\s*(?:[A-Z]\w*|string|number|boolean|any|unknown)(?:<|\[\]|$)/,
  /@keyframes/, /\b(?:const|let|var)\s+[\w$]+\s*[=:]/, /\bfunction\s*[\w$]*\s*\(/, /\breturn\s*[;({[]/,
  /\bdocument\.\w+[.(]/, /getElementById/, /innerHTML/, /["'`]\s*\+/, /\+\s*["'`]/,
  /^\s*[,)\]}]/, /[{([]\s*$/, /\S;\s*$/, /[({[,]\s*\.\.\.[A-Za-z_$]/,
  /\b(?:var\(--|rgba?\(|hsla?\(|calc\(|url\()/, /\{\s*[\w-]+\s*:[^}]*;/, /\b[\w-]+="[^"]*"/,
  /,\s*(?:sans-serif|serif|monospace|system-ui|cursive)\b/,
  /^\s*(?:inset\s+)?-?\d+(?:\.\d+)?(?:px|rem|em|%|ms|s|deg)?\s+(?:-?\d|solid|dashed|dotted|none\b)/,
].map((re) => re.source).join("|"));

// A Tailwind class list: kebab-case tokens, half of them or more with a `-`, `:`, `/` or `[`.
function looksLikeClasses(t) {
  const tokens = t.trim().split(/\s+/).filter((x) => x !== "{…}");
  if (!tokens.length) return false;
  return tokens.every((x) => /^!?-?[a-z0-9][a-z0-9:/[\]().%#_,&>*=+-]*$/.test(x)) && tokens.filter((x) => /[-:/[]/.test(x)).length * 2 >= tokens.length;
}

function looksLikeText(s) {
  const t = s.trim();
  if (!/\p{L}/u.test(t)) return false;
  if (KEY_LIKE.test(t)) return false;
  if (/^(https?:|mailto:|\/|\.\/|#[\w-]+$|data:)/.test(t)) return false;
  if (/^[\p{L}\p{N}_.-]+\/[\p{L}\p{N}_ ./-]+\.[a-z0-9]{2,8}$/iu.test(t)) return false;
  const tokens = t.split(/\s+/);
  if (tokens.length > 1 && tokens.every((tok) => CLASS_TOKEN.test(tok))) return false;
  return true;
}

// `${a ? t("x", { n }) : ""}` becomes one placeholder, nested braces included.
function stripTemplates(s) {
  let out = "";
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== "$" || s[i + 1] !== "{") { out += s[i]; continue; }
    let depth = 0, j = i + 1;
    for (; j < s.length; j++) {
      if (s[j] === "{") depth++;
      else if (s[j] === "}" && --depth === 0) break;
    }
    out += "{…}";
    i = j;
  }
  return out;
}

function clean(s) {
  return stripTemplates(s).replace(/[ \t\r\n\f\v]+/g, " ").replace(/^ | $/g, "");
}

// ---------------------------------------------------------------- copy: extraction

const ATTRS = "placeholder|title|alt|aria-label|aria-description|aria-placeholder|aria-valuetext|label|description|helperText|helpText|hint|tooltip|tooltipText|tooltipContent|data-tooltip|data-tip|data-title|message|confirmText|cancelText|confirmLabel|cancelLabel|okText|emptyText|emptyMessage|errorMessage|errorText|successMessage|subtitle|heading|caption|summary|legend";
const PROPS = "label|title|description|message|placeholder|tooltip|tooltipText|tooltipContent|heading|subtitle|caption|hint|helperText|confirmLabel|cancelLabel|confirmText|cancelText|emptyText|emptyMessage|errorMessage|successMessage|defaultValue|body|text";

const RE_ATTR = new RegExp(`\\b(${ATTRS})\\s*=\\s*(?:"([^"]*)"|'([^']*)'|\\{\\s*(["'\`])((?:\\\\.|(?!\\4)[^\\\\])*?)\\4\\s*\\})`, "g");
const RE_PROP = new RegExp(`\\b(${PROPS})\\s*:\\s*(["'\`])((?:\\\\.|(?!\\2)[^\\\\\\n])*)\\2`, "g");
// Any other key holding a sentence: message tables such as `{ sendFailed: "Envoi impossible…" }`,
// and catalogs keyed by dotted strings (`'nav.product': 'Produit'`).
const RE_ANY_PROP = /(?:^|[{,\s])(?:"([^"\n]{1,120})"|'([^'\n]{1,120})'|([A-Za-z_$][\w$-]*))\s*:\s*(["'`])((?:\\.|(?!\4)[^\\\n])*)\4/gm;
const NOT_TEXT_KEY = /^(className|class|style|href|src|type|id|key|variant|size|color|icon|path|url|method|mode|format|role|as|to|from|lang|locale|kind|status|code|testId|data-testid|font|fontFamily|family|typeface|fontWeight|fontSize|background|backgroundColor|backgroundImage|border|borderColor|boxShadow|margin|padding|width|height|transform|transition|animation|cursor|display|position|inset|gridTemplateColumns|filter|mask|clipPath)$/;
const RE_CALL = /\b(toast(?:\.\w+)?|alert|confirm|prompt|notify\w*|show(?:Toast|Notification|Error|Message|Success|Warning|Info|Alert|Status)\w*|set(?:Error|Status|Message|Notice|Warning|Info|Toast)(?:Message|Text)?|message\.(?:success|error|info|warning)|new\s+(?:Notification|Option))\s*\(\s*(["'`])((?:\\.|(?!\2)[^\\])*?)\2/g;
const RE_ASSIGN = /\.(?:textContent|innerText|title|placeholder|alt|ariaLabel)\s*=\s*(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
const RE_SETATTR = /setAttribute\(\s*["'](?:aria-label|aria-description|title|placeholder|alt)["']\s*,\s*(["'`])((?:\\.|(?!\1)[^\\\n])*)\1/g;
const RE_TERNARY = /\?\s*(["'`])((?:\\.|(?!\1)[^\\\n])*)\1\s*:\s*(["'`])((?:\\.|(?!\3)[^\\\n])*)\3/g;
const RE_T_DEFAULT = /\bt\(\s*(["'`])[^"'`\n]+\1\s*,\s*(["'`])((?:\\.|(?!\2)[^\\])*?)\2/g;
const RE_JSX_EXPR = /\{\s*(["'`])((?:\\.|(?!\1)[^\\])*?)\1\s*\}/g;
const RE_JSX_TEXT = />([^<>]+)</g;
const RE_TOOLTIP = /<[\w.]*(?:Tooltip|Tip|Hint)\b[^<>]*?\b(?:content|text)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{\s*(["'`])((?:\\.|(?!\3)[^\\])*?)\3\s*\})/g;
const RE_PINNED_LOCALE = /(?:Intl\.(?:DateTimeFormat|NumberFormat|RelativeTimeFormat|PluralRules|ListFormat)|\.toLocale(?:Date|Time)?String)\(\s*["'`]([a-z]{2}(?:-[A-Za-z]{2,4})?)["'`]/g;

// `saveButton`, `dialog.confirm`, `__MSG_button_ok__`: a button label. `notebook`, `verdictOk`: not.
function isButtonKey(key) {
  if (!key) return false;
  const bare = key.replace(/^__MSG_|__$/g, "");
  const tokens = bare.split(/[._\-\s:]+|(?<=[a-z0-9])(?=[A-Z])/).filter(Boolean).map((t) => t.toLowerCase());
  if (tokens.some((t) => ["button", "buttons", "btn", "cta"].includes(t))) return true;
  const last = tokens[tokens.length - 1];
  const before = tokens[tokens.length - 2];
  const dialogish = (t) => ["confirm", "dialog", "modal", "alert", "prompt", "actions", "form"].includes(t);
  if (["ok", "okay"].includes(last) && tokens.some(dialogish)) return true;
  // `dialog.confirm` is a button label; `deleteConfirm` is the confirmation sentence.
  if (["confirm", "cancel"].includes(last)) return tokens.length === 1 || dialogish(before);
  return ["submit", "action"].includes(last) || /^(ok|okay)(text|label)?$/i.test(bare);
}
const sentenceLike = (t) => /\s/.test(t.trim()) || /^\p{Lu}/u.test(t.trim());

// The `>` must close a real tag: `<` not glued to an identifier (that is a generic type),
// a tag name or a fragment, and attributes that may hold `=>`.
function tagBefore(src, gt) {
  const lt = src.lastIndexOf("<", gt);
  if (lt < 0) return null;
  const seg = src.slice(lt, gt + 1);
  if (/[\w$.)\]]/.test(src[lt - 1] ?? "")) return null;
  const m = /^<(\/?)([A-Za-z][\w.:-]*)?(?:\s[^<]*)?\/?>$/s.exec(seg);
  if (!m) return null;
  return { closing: m[1] === "/", name: m[2] ?? "" };
}

// A catalog written as code (`locales/fr.ts`): every string value is text, keyed like JSON by its
// full path (`nav.title`), with a brace stack for nested objects.
const RE_CATALOG = /(?:"((?:\\.|[^"\\\n])*)"|'((?:\\.|[^'\\\n])*)'|([A-Za-z_$][\w$-]*))\s*:\s*(?:(\{)|(["'`])((?:\\.|(?!\5)[^\\])*?)\5)|(\{)|(\})|(["'`])(?:\\.|(?!\9)[^\\])*?\9/g;

function extractLocaleCode(src, file) {
  const out = [];
  const masked = maskComments(src);
  const line = lineIndex(src);
  const info = localeInfo(file);
  const stack = [];
  for (const m of masked.matchAll(RE_CATALOG)) {
    if (m[7]) { stack.push(null); continue; }
    if (m[8]) { stack.pop(); continue; }
    if (m[9]) continue;
    const key = m[1] ?? m[2] ?? m[3];
    if (/\?\s*$/.test(masked.slice(Math.max(0, m.index - 20), m.index))) continue;
    if (m[4]) { stack.push(key); continue; }
    const path = [...stack.filter((k) => k !== null), key].join(".");
    const value = decodeJs(m[6]);
    const text = clean(value);
    if (!looksLikeText(text)) continue;
    out.push({ file, line: line(m.index), text, key: path, group: info.group, edge: /^[ \t](?![ \t*•\-\d])|[^ \t][ \t]$/.test(value), context: isButtonKey(path) ? "button" : null, kind: "locale" });
  }
  return out;
}

function extractCode(src, file) {
  const out = [];
  const masked = maskComments(src);
  const line = lineIndex(src);
  const regions = classRegions(masked);
  const inClasses = (offset) => regions.some(([a, b]) => offset >= a && offset <= b);
  const push = (offset, raw, kind, context = null, key = undefined) => {
    const text = clean(raw);
    if (!looksLikeText(text) || CODE_HINT.test(text) || looksLikeClasses(text)) return;
    out.push({ file, line: line(offset), text, context, kind, key });
  };

  for (const m of masked.matchAll(RE_JSX_TEXT)) {
    const gt = m.index;
    const after = masked[gt + m[0].length] ?? "";
    if (!/[A-Za-z/>]/.test(after)) continue;
    const tag = tagBefore(masked, gt);
    if (!tag || tag.name.match(/^(style|script)$/i)) continue;
    let body = m[1];
    let outside = body.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, " ");
    while (/\{[^{}]*\}/.test(outside)) outside = outside.replace(/\{[^{}]*\}/g, "");
    if (/[=;{}]|=>|&&|\|\||\breturn\b|^\s*[)\]:]|[([]\s*$|\?\s*\(|\)\s*[:?]/.test(outside)) continue;
    while (/\{[^{}]*\}/.test(body)) body = body.replace(/\{[^{}]*\}/g, "\u0001");
    body = body.replace(/\u0001/g, "{…}");
    if (!/\p{L}/u.test(body.replace(/\{…\}/g, ""))) continue;
    const context = !tag.closing && /button$/i.test(tag.name) ? "button" : null;
    push(gt + 1 + (m[1].length - m[1].trimStart().length), decodeEntities(body), "jsx", context);
  }
  for (const m of masked.matchAll(RE_ATTR)) {
    const raw = m[2] ?? m[3];
    const text = raw !== undefined ? decodeEntities(raw) : decodeJs(m[5]);
    const context = /^(confirm|cancel|ok)/i.test(m[1]) ? "button" : /^(title|tooltip\w*|data-(tooltip|tip|title))$/i.test(m[1]) ? "tooltip" : null;
    push(m.index, text, "attr", context);
  }
  // Tooltip components take their text as `content` or `text`: <Tooltip content="Copier le lien">.
  for (const m of masked.matchAll(RE_TOOLTIP)) {
    push(m.index, m[1] ?? m[2] ?? decodeJs(m[4]), "attr", "tooltip");
  }
  for (const m of masked.matchAll(RE_JSX_EXPR)) {
    const before = masked.slice(Math.max(0, m.index - 2), m.index);
    if (/=\s*$/.test(before)) continue;
    const text = decodeJs(m[2]);
    if (/\s/.test(text.trim()) || /^\p{Lu}/u.test(text.trim())) push(m.index, text, "jsx");
  }
  if (extname(file) !== ".html" && extname(file) !== ".htm") {
    for (const m of masked.matchAll(RE_PROP)) {
      const text = decodeJs(m[3]);
      if (/\s/.test(text.trim()) || /^\p{Lu}/u.test(text.trim())) push(m.index, text, "prop");
    }
    for (const m of masked.matchAll(RE_ANY_PROP)) {
      const key = m[1] ?? m[2] ?? m[3];
      if (NOT_TEXT_KEY.test(key)) continue;
      const start = m.index + (m[0].length - m[0].trimStart().length);
      // `cond ? "a" : "b"` is a ternary, not a key; RE_TERNARY takes both branches.
      if (/\?\s*$/.test(masked.slice(Math.max(0, start - 20), start))) continue;
      const text = decodeJs(m[5]);
      if (!/^\p{Lu}/u.test(text) || !/\p{L}[\s\p{P}\p{S}]*\s[\s\p{P}\p{S}]*\p{L}/u.test(text)) continue;
      push(start, text, "prop", isButtonKey(key) ? "button" : null, key);
    }
    for (const m of masked.matchAll(RE_TERNARY)) {
      if (inClasses(m.index)) continue;
      for (const raw of [m[2], m[4]]) if (sentenceLike(raw)) push(m.index, decodeJs(raw), "prop");
    }
    for (const m of masked.matchAll(RE_CALL)) if (sentenceLike(m[3])) push(m.index, decodeJs(m[3]), "call");
    for (const m of masked.matchAll(RE_ASSIGN)) if (sentenceLike(m[2])) push(m.index, decodeJs(m[2]), "call");
    for (const m of masked.matchAll(RE_SETATTR)) if (sentenceLike(m[2])) push(m.index, decodeJs(m[2]), "attr");
    // `t("key", "Default")` is the fallback of a translated string, not text left in code.
    for (const m of masked.matchAll(RE_T_DEFAULT)) push(m.index, decodeJs(m[3]), "default");
  }
  const seen = new Set();
  return out.filter((s) => {
    const key = `${s.line}\u0000${s.text}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// The fields of a browser extension manifest that a user reads when they are not `__MSG_` keys.
const MANIFEST_TEXT = /^(name|short_name|description|(action|browser_action|page_action)\.default_title|commands\.[^.]+\.description)$/;

function extractJson(src, file) {
  const out = [];
  const chromeMessages = basename(file) === "messages.json";
  const manifest = basename(file) === "manifest.json";
  const group = localeInfo(file)?.group ?? null;
  const stack = [];
  let line = 1;
  const unquote = (raw) => {
    try {
      return JSON.parse(`"${raw}"`);
    } catch {
      return null;
    }
  };
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (c === "\n") { line++; continue; }
    if (c === "{" || c === "[") { stack.push({ key: null, index: 0, array: c === "[" }); continue; }
    if (c === "}" || c === "]") { stack.pop(); continue; }
    if (c === ",") { if (stack.at(-1)?.array) stack.at(-1).index++; continue; }
    if (c !== '"') continue;
    const startLine = line;
    let j = i + 1;
    while (j < src.length && src[j] !== '"') {
      if (src[j] === "\\") j++;
      else if (src[j] === "\n") line++;
      j++;
    }
    const raw = src.slice(i + 1, j);
    i = j;
    let k = j + 1;
    while (k < src.length && /\s/.test(src[k])) k++;
    if (src[k] === ":") {
      if (stack.length) stack.at(-1).key = unquote(raw) ?? raw;
      continue;
    }
    const path = stack.map((f) => (f.array ? String(f.index) : f.key)).filter((p) => p !== null);
    // Chrome's `_locales/*/messages.json`: the text is `<key>.message`; "description" is a note
    // for translators and "placeholders" holds `$1` references.
    if (chromeMessages && (path.at(-1) !== "message" || path.length !== 2)) continue;
    const key = chromeMessages ? path[0] : path.join(".");
    if (manifest && !MANIFEST_TEXT.test(key)) continue;
    let text = unquote(raw);
    if (text === null) continue;
    const edge = Boolean(group) && /^[ \t](?![ \t*•\-\d])|[^ \t][ \t]$/.test(text);
    text = clean(text);
    if (looksLikeText(text)) {
      out.push({ file, line: startLine, text, key, group, edge, context: isButtonKey(key) ? "button" : null, kind: "json" });
    }
  }
  return out;
}

// Markdown: code fences are skipped, except the ones tagged as text, where store listings and
// release notes often sit. Inline code keeps its words, quoted, because it names a control.
function extractText(src, file) {
  const out = [];
  let fence = false;
  let prose = false;
  src.split("\n").forEach((raw, i) => {
    const open = /^\s*```\s*([\w-]*)/.exec(raw);
    if (open) {
      if (fence) fence = false;
      else { fence = true; prose = /^(text|txt|plain|plaintext|markdown|md)$/i.test(open[1]); }
      return;
    }
    if (fence && !prose) return;
    const text = clean(
      raw.replace(/^\s{0,3}(#{1,6}\s+|[-*+]\s+|\d+\.\s+|>\s?)/, "")
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/`([^`]*)`/g, "“$1”")
        .replace(/(?<![\w*])(\*\*|__|\*|_)(\S[^*_]*?)\1(?![\w*])/g, "$2"),
    );
    if (looksLikeText(text)) out.push({ file, line: i + 1, text, context: null, kind: "text" });
  });
  return out;
}

// ---------------------------------------------------------------- copy: language

const FR_WORDS = new Set(("le la les de des une un du au aux et est pour avec sur dans par vous votre vos tu ton ta tes pas plus ce cette ces qui que ne en il elle nous sont être avoir aucun aucune ici nom " +
  "fichier fichiers dossier dossiers impossible ajouter ajoute ajoutez supprimer enregistrer annuler exporter importer ouvrir fermer réglages paramètres " +
  "chargement erreur nouveau nouvelle modifier afficher masquer rechercher filtrer trier connexion compte réessayer terminé suivant retour créer " +
  "télécharger partager copier coller aide propos bienvenue glisse glissez sélection projet projets cours état états " +
  "rushs vidéo vidéos lecture durée scène prise statut aperçu réglage enregistrement").split(" "));
const EN_WORDS = new Set(("the a an and is are for with on in at by you your to of this that it be not no all any can will from here has have now new more yet " +
  "file files folder folders unable add delete save cancel export import open close settings selected select clip clips loading error edit view show hide " +
  "search filter sort sign log account feature workflow try again retry done next back create update upload download share copy paste undo redo help " +
  "about welcome start drop").split(" "));

const ES_WORDS = new Set(("el los las una unos para con por del está están que archivo archivos carpeta guardar eliminar borrar cancelar abrir " +
  "cerrar buscar ajustes configuración cargando inténtalo inténtelo nuevo nueva ningún ninguna aquí después vuelve " +
  "quieres puedes hacer también más este esta estos cuando sin hay todo todos hasta desde pero muy ahora").split(" "));
const DE_WORDS = new Set(("der die das und ist nicht mit für sie du ein eine einen dem den des auf wird werden kein keine datei dateien ordner " +
  "speichern löschen abbrechen öffnen schließen suchen einstellungen laden fehler neu hier bitte").split(" "));

// Script first, then word lists for the Latin-script languages this skill has lexicons for.
function guessLang(text) {
  if (/[\p{Script=Hiragana}\p{Script=Katakana}]/u.test(text)) return "ja";
  if (/\p{Script=Hangul}/u.test(text)) return "ko";
  if (/\p{Script=Han}/u.test(text)) return "zh";
  if (/\p{Script=Cyrillic}/u.test(text)) return /[іїєґ]/i.test(text) ? "uk" : "ru";
  if (/\p{Script=Arabic}/u.test(text)) return "ar";
  if (/\p{Script=Hebrew}/u.test(text)) return "he";
  if (/\p{Script=Thai}/u.test(text)) return "th";
  const words = text.replace(/`[^`]*`|“[^”]*”/g, " ").toLowerCase().split(/[^\p{L}']+/u).filter(Boolean);
  const score = {
    fr: (text.match(/[àâçéèêëîïôûùÿœæ]/gi) || []).length,
    en: 0,
    // ¿ ¡ ñ are Spanish only and weigh more.
    es: (text.match(/[áíóú]/gi) || []).length + 3 * (text.match(/[ñ¿¡]/gi) || []).length,
    de: (text.match(/[äöüß]/gi) || []).length,
  };
  for (const w of words) {
    if (FR_WORDS.has(w) || /^(l|d|n|j|qu|s)['’]/.test(w)) score.fr++;
    else if (w.length > 3 && /(ez|ée|ées|eux|euse|ière)$/.test(w)) score.fr++;
    if (EN_WORDS.has(w) || /['’](s|t|re|ll|ve)$/.test(w)) score.en++;
    else if (w.length > 4 && /(ly|ed|ing)$/.test(w)) score.en++;
    if (ES_WORDS.has(w)) score.es++;
    if (DE_WORDS.has(w)) score.de++;
  }
  const [first, second] = Object.entries(score).sort((a, b) => b[1] - a[1]);
  if (first[1] > 0 && first[1] > second[1]) return first[0];
  // "du" is French and German: a tie between the two goes to French unless German letters show.
  const tied = Object.entries(score).filter(([, v]) => v === first[1] && v > 0).map(([k]) => k);
  if (tied.length === 2 && tied.includes("fr") && tied.includes("de") && !/[äöüß]/i.test(text)) return "fr";
  return null;
}

// One or two Latin words with no accent ("Upload", "Onglet Export") are too short to trust.
const weakGuess = (text) =>
  text.split(/\s+/).filter(Boolean).length <= 2 && !/[^\p{Script=Latin}\P{L}]/u.test(text) && !/[À-ÿœæñ¿¡]/iu.test(text);

// The locale folder wins, then --lang, then the text itself. A string with no clue, or too short
// to tell, takes its file's main language, then the project's, then its own guess.
function assignLanguages(strings, forced) {
  const perFile = new Map();
  const total = {};
  const bump = (m, k) => { m[k] = (m[k] || 0) + 1; };
  const top = (m) => {
    const [first, second] = Object.entries(m).sort((a, b) => b[1] - a[1]);
    return first && (!second || first[1] > second[1]) ? first[0] : null;
  };
  for (const s of strings) {
    const guess = guessLang(s.text);
    s.lang = localeLang(s.file) ?? (forced !== "auto" ? forced : weakGuess(s.text) ? null : guess);
    s.guess = guess;
    if (!perFile.has(s.file)) perFile.set(s.file, {});
    if (s.lang) { bump(perFile.get(s.file), s.lang); bump(total, s.lang); }
  }
  const global = top(total);
  for (const s of strings) {
    if (!s.lang) s.lang = top(perFile.get(s.file)) ?? global ?? s.guess;
    delete s.guess;
  }
}

// ---------------------------------------------------------------- copy: rules

// Languages written without spaces between words: a pattern matches anywhere in the string.
const NO_WORD_BOUNDARY = new Set(["ja", "zh", "ko", "th"]);

function loadLexicon(lang) {
  const file = join(SKILL_DIR, "references", `words-${lang}.md`);
  if (!existsSync(file)) return null;
  const rules = [];
  let inLexicon = false;
  for (const row of readFileSync(file, "utf8").split(/\r?\n/)) {
    if (/^## /.test(row)) inLexicon = /^## Lexicon/i.test(row);
    if (!inLexicon || !row.startsWith("|")) continue;
    const cells = row.split("|").slice(1, -1).map((c) => c.trim());
    if (cells.length !== 3 || !/^(block|check)$/.test(cells[2])) continue;
    for (const [, pattern] of cells[0].matchAll(/`([^`]+)`/g)) {
      const body = pattern
        .replace(/\*$/, "\u0000")
        .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
        .replace(/['’]/g, "['’]")
        .replace(/\s+/g, "[\\s\\u00A0\\u202F]+")
        .replace("\u0000", "[\\p{L}\\p{M}]*");
      const re = NO_WORD_BOUNDARY.has(lang) ? new RegExp(body, "iu") : new RegExp(`(?<![\\p{L}\\p{N}_])${body}(?![\\p{L}\\p{N}_])`, "iu");
      rules.push({ pattern, hint: cells[1], level: cells[2], re });
    }
  }
  return rules;
}

// Wrong on any control; the rest are only vague when they sit on a button.
const VAGUE_ANY = new Set(["submit", "soumettre", "click here", "cliquez ici", "clique ici"]);
const VAGUE_BUTTON = new Set(["ok", "okay", "yes", "no", "oui", "non", "continue", "continuer", "confirm", "confirmer", "valider", "learn more", "en savoir plus", "go"]);
const PERSONA = /(?<![\p{L}])(john doe|jane doe|john smith|jean dupont|marie dupont|acme(?: corp| inc)?|lorem ipsum|dolor sit amet|your company|votre entreprise|user@example\.com)(?![\p{L}])/iu;
const PEOPLE = "users|customers|teams|companies|developers|creators|downloads|clients|utilisateurs|utilisatrices|équipes|entreprises|créateurs|créatrices|téléchargements|développeurs";
const INVENTED = [
  new RegExp(`\\d{1,3}(?:[,.\\s\\u00A0\\u202F]\\d{3})+\\s*\\+?\\s*(?:${PEOPLE})`, "iu"),
  new RegExp(`\\d+(?:[.,]\\d+)?\\s?[kKM]\\s*\\+\\s*(?:${PEOPLE})`, "u"),
  /99[.,]9+\s?%/u,
  /(?<![\d.,])(?:4[.,][5-9]|5[.,]0)\s*\/\s*5(?![\d])/u,
  /(?<![\p{L}])(trusted by|thousands of|des milliers d['’]|approuvé par)(?![\p{L}])/iu,
];
const EMOJI = /\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F/u;
const FR_CAPS = /(?<![\p{L}])(Etat|Etats|Ecran|Ecrans|Echec|Echecs|Element|Elements|Etape|Etapes|Evenement|Evenements|Edition|Editer|Etiquette|Etiquettes|Etes|Etre|Ete|Egalement|Economiser|Ecrire|Epingler|Eteindre|Evaluer|Eviter|Ecouter|Echanger|Equipe|Equipes|Energie|Evolution|Electronique)(?![\p{L}])|(?<![\p{L}])A (?=propos|partir|venir|jour|bientôt|la |l['’]|votre|vos|ton |ta |tes )/u;
// "ton" is also the noun (le ton, par ton): it counts only before a word, and not after an article.
const TU = /(?<![\p{L}-])(tu|toi|(?<!(?<![\p{L}])(?:le|un|du|au|même|bon|ce)[\s\u00A0])ton(?![\s\u00A0]*(?:$|[.,;:!?»)]))|ta|tes|te|t['’](?=\p{L}))(?![\p{L}])/giu;

const VOUS = /(?<![\p{L}-])(vous|votre|vos)(?![\p{L}])/giu;
// Imperatives carry the address without a pronoun: "Réessayez", "Enregistrez-les", "Connecte-toi".
const TU_VERB = /(?:^|[.!?…:;]\s+|[—–]\s*)(ajoute|choisis|clique|connecte|crée|essaie|réessaie|glisse|importe|exporte|ouvre|renomme|saisis|sélectionne|supprime|vérifie|configure|donne|utilise|appuie|lance|relance|patiente|attends|reviens|recommence|enregistre|redémarre|installe|mets|fais)(?![\p{L}])|\p{L}-toi(?![\p{L}])/giu;
const VOUS_VERB = /(?:^|[.!?…:;]\s+|[—–]\s*)(?!assez|rendez)(\p{L}{3,}ez|faites|dites)(?=$|[^\p{L}-]|-(?:les?|la|lui|leur|moi|nous|en|y)(?![\p{L}]))|(?<!rendez)-vous(?![\p{L}])/giu;
const count = (re, t) => (t.match(re) || []).length;
const usesTu = (t) => count(TU, t) + count(TU_VERB, t);
const usesVous = (t) => count(VOUS, t) + count(VOUS_VERB, t);

// Formal and informal "you" in other languages, counted from pronouns only: a tally, and a
// `check` on the strings that use the rarer form.
const pron = (words, flags = "giu") => new RegExp(`(?<![\\p{L}])(?:${words})(?![\\p{L}])`, flags);
const ADDRESS = {
  de: { informal: ["du", pron("du|dich|dir|dein|deine|deinen|deinem|deiner|deines")], formal: ["Sie", /(?<=[\p{L}\p{N},)]\s)(?:Sie|Ihnen|Ihr|Ihre|Ihren|Ihrem|Ihrer|Ihres)(?![\p{L}])/gu] },
  es: { informal: ["tú", pron("tú|tu|tus|contigo")], formal: ["usted", pron("usted|ustedes")] },
  ru: { informal: ["ты", pron("ты|тебя|тебе|тобой|твой|твоя|твоё|твои|твоих|твоим|твоей")], formal: ["вы", pron("вы|вас|вам|вами|ваш|ваша|ваше|ваши|ваших|вашим|вашей")] },
  uk: { informal: ["ти", pron("ти|тебе|тобі|тобою|твій|твоя|твоє|твої|твоїх")], formal: ["ви", pron("ви|вас|вам|вами|ваш|ваша|ваше|ваші|ваших")] },
  zh: { informal: ["你", /你/g], formal: ["您", /您/g] },
};

function addressTally(strings) {
  const tally = {};
  for (const s of strings) {
    if (s.lang === "fr") {
      tally.fr ??= { forms: ["tu", "vous"], counts: [0, 0] };
      tally.fr.counts[0] += usesTu(s.text);
      tally.fr.counts[1] += usesVous(s.text);
    } else if (ADDRESS[s.lang]) {
      const a = ADDRESS[s.lang];
      tally[s.lang] ??= { forms: [a.informal[0], a.formal[0]], counts: [0, 0] };
      tally[s.lang].counts[0] += count(a.informal[1], s.text);
      tally[s.lang].counts[1] += count(a.formal[1], s.text);
    }
  }
  return tally;
}

// Title Case: every significant word capitalised. Words the project capitalises inside ordinary
// sentences ("Connect your Discord account") are names and do not count.
const SMALL = new Set(("a an the of to in on at by for and or but nor with from into as vs via per " +
  "de du des la le les et à au aux en pour sur par avec un une " +
  "el los las y del con para por al lo " +
  "il gli e di da dei delle " +
  "o os as do da dos das um uma com").split(" "));
const clip = (w) => w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "");
const isCap = (w) => /^\p{Lu}\p{Ll}/u.test(w);
const significant = (words) => words.map(clip).filter((w) => /^\p{L}{3,}$/u.test(w) && !SMALL.has(w.toLowerCase()) && !/.\p{Lu}/u.test(w));
const CASED = /[\p{Script=Latin}\p{Script=Cyrillic}\p{Script=Greek}]/u;
const titleCaseLang = (lang) => lang && lang !== "de" && !NO_WORD_BOUNDARY.has(lang) && !["ar", "he"].includes(lang);

// Per language: `names`, words capitalised inside ordinary sentences, and `lower`, words the
// project writes in lower case somewhere. A capital on a `lower` word is a Title Case capital.
function learnWords(strings) {
  const names = new Map();
  const lower = new Map();
  const bag = (m, lang) => {
    if (!m.has(lang)) m.set(lang, new Set());
    return m.get(lang);
  };
  for (const s of strings) {
    if (!titleCaseLang(s.lang)) continue;
    const words = s.text.split(/\s+/);
    for (const w of significant(words)) if (!isCap(w)) bag(lower, s.lang).add(w.toLowerCase());
    if (!significant(words).some((w) => !isCap(w))) continue;
    words.forEach((w, i) => {
      const bare = clip(w);
      if (i === 0 || /[.!?:]$/.test(words[i - 1]) || !isCap(bare) || /.\p{Lu}/u.test(bare)) return;
      bag(names, s.lang).add(bare);
    });
  }
  return { names, lower };
}

const COMMON = { fr: FR_WORDS, en: EN_WORDS, es: ES_WORDS, de: DE_WORDS };

// "Expand All", "Paramètres Du Compte": every word after the first is capitalised, and each of
// those words is an ordinary word, not a name. Labels joined by " · " are checked one by one.
function isTitleCase(segment, lang, vocab) {
  const tokens = segment.trim().split(/\s+/);
  if (tokens.length < 2 || tokens.length > 7) return false;
  const rest = significant(tokens.slice(1));
  if (!rest.length || !rest.every(isCap)) return false;
  const ordinary = (w) => vocab.lower.get(lang)?.has(w.toLowerCase()) || COMMON[lang]?.has(w.toLowerCase());
  const name = (w) => vocab.names.get(lang)?.has(w);
  return rest.some((w) => ordinary(w) && !name(w)) && rest.every((w) => ordinary(w) || name(w));
}

// Placeholders become a letter, so "Erreur {code} : …" keeps its space before the colon; entities
// become the characters they stand for.
const FR_ENTITIES = { "&nbsp;": "\u00A0", "&#160;": "\u00A0", "&#xa0;": "\u00A0", "&nnbsp;": "\u202F", "&#8239;": "\u202F", "&#x202f;": "\u202F", "&thinsp;": "\u2009" };

function frSpacing(text) {
  const findings = [];
  const t = text
    .replace(/\{[^{}]*\}/g, "x")
    .replace(/https?:\/\/\S+/g, "x")
    .replace(/&#?\w+;/g, (e) => FR_ENTITIES[e.toLowerCase()] ?? "x");
  for (const m of t.matchAll(/[^\s\u00A0\u202F]([;!?])(?=\s|$|["»)])/gu)) {
    findings.push({ rule: "fr-nbsp", level: "check", hint: `no space before "${m[1]}": France uses a narrow non-breaking space (\\u202F); Québec usage sets none, so match the product` });
  }
  if (/[^\s\u00A0\u202F\d]:(?=\s|$)/u.test(t)) {
    findings.push({ rule: "fr-nbsp", level: "check", hint: `no space before ":": use a non-breaking space (\\u00A0)` });
  }
  for (const m of t.matchAll(/ ([;:!?])/g)) {
    findings.push({ rule: "fr-nbsp", level: "block", hint: `regular space before "${m[1]}": the line can break before it; use \\u00A0 before ":" and \\u202F before ";!?"` });
  }
  if (/« |« *$| »/.test(t)) findings.push({ rule: "fr-nbsp", level: "block", hint: "regular space inside « »: use non-breaking spaces" });
  if (/\d (?:ms|s|min|h|Go|Mo|Ko|To|Gio|Mio|o|px|€|%|°C?)(?![\p{L}\p{N}])/u.test(t)) {
    findings.push({ rule: "fr-nbsp", level: "check", hint: "regular space between a number and its unit or %: use \\u00A0 («\u00A014\u00A0min\u00A0», «\u00A050\u00A0%\u00A0»)" });
  }
  if (/\d\.\d+[\s\u00A0\u202F]?(?:Go|Mo|Ko|To|%|€|s|min|h)(?![\p{L}])/u.test(t)) {
    findings.push({ rule: "fr-decimal", level: "check", hint: "French writes the decimal with a comma («\u00A08,9\u00A0Go\u00A0»); build numbers with Intl.NumberFormat" });
  }
  return findings;
}

function checkString(s, env) {
  const { lexiconFor, address, vocab, minority } = env;
  const f = [];
  const add = (rule, level, hint) => f.push({ rule, level, hint });
  const t = s.text;
  // Punctuation rules read the prose only: no inline code, tags or placeholders.
  const prose = t.replace(/`[^`]*`|“[^”]*”(?=[\s\p{P}]|$)|<[^<>]*>|\{[^{}]*\}/gu, " ");
  const bare = t.replace(/[.!…:]+$/u, "").trim().toLowerCase();

  const lexicon = s.lang ? lexiconFor(s.lang) : null;
  if (lexicon) {
    // Overlapping rows ("cliquez ici" and "cliquez") report once, on the longer match.
    const hits = [];
    for (const r of lexicon) {
      const m = r.re.exec(t);
      if (m) hits.push({ r, at: m.index, end: m.index + m[0].length });
    }
    for (const h of hits) {
      const inside = hits.some((o) => o !== h && o.at <= h.at && o.end >= h.end && o.end - o.at > h.end - h.at);
      if (!inside) add("lexicon", h.r.level, `"${h.r.pattern}": ${h.r.hint}`);
    }
  }
  const vague = VAGUE_ANY.has(bare) ? "block" : s.context === "button" && VAGUE_BUTTON.has(bare) ? "check" : null;
  if (vague && s.lang !== null && ["fr", "en"].includes(s.lang) && !f.some((x) => x.rule === "lexicon" && x.level === "block")) {
    add("vague-action", vague, "say what happens: verb + object (\"Delete project\", \"Exporter la timeline\")");
  }
  const words = t.split(/\s+/).filter(Boolean);
  if (s.context === "button" && (words.length > 5 || t.length > 32)) {
    add("long-button", "check", `${words.length} words, ${t.length} characters: a button is a verb and 1 to 4 words`);
  }
  if (titleCaseLang(s.lang) && CASED.test(t) && !/[▸›»>→←↔|/+=#*`()]/.test(t) && !/,.*,/.test(t) && !/name|author|owner|channel|user/i.test(s.key ?? "")) {
    // CamelCase, acronyms and the project's own names (NetsuRush, JSON, Discord) do not count.
    if (t.split(/\s+[·•–—-]\s+/).some((part) => isTitleCase(part, s.lang, vocab))) {
      add("title-case", "check", "use sentence case unless these are proper nouns");
    }
  }
  // Upper case counts when the words are words (DELETE, WARNING:), not acronyms (NVIDIA NVENC).
  const letters = t.replace(/[^\p{Lu}\p{Ll}\p{Lt}]/gu, "");
  if (!/\p{Lo}/u.test(t) && /\p{Lu}{4,}/u.test(t) && letters === letters.toUpperCase() && guessLang(t.toLowerCase())) {
    add("all-caps", "check", "write it in sentence case; uppercase belongs in CSS, and screen readers may spell it");
  } else if (/^\p{Lu}{5,}\s*:\s*\S/u.test(t) && /\p{Ll}/u.test(t)) {
    add("all-caps", "check", "an upper-case prefix (WARNING:, ERROR:) shouts; say what happened in a sentence");
  }
  if (/!(?!=)/.test(prose)) add("exclamation", "check", "keep exclamation marks for rare, real moments");
  if (s.edge) add("edge-space", "check", "starts or ends with a space: code glues it to a number or another string; use one string with a placeholder");
  if (EMOJI.test(t)) add("emoji", "check", "no emoji in interface text unless DESIGN.md allows it");
  if (PERSONA.test(t)) add("placeholder-persona", "block", "placeholder name or filler text: use real or clearly synthetic content");
  if (INVENTED.some((re) => re.test(t))) add("invented-number", "check", "keep only if the project states this figure with a source");
  if (/\.\.\./.test(prose)) add("ellipsis", "check", "use the ellipsis character …, unless DESIGN.md chose ... (some Japanese products do)");
  // A tooltip is a short hint. CJK text carries about twice the meaning per character.
  if (s.context === "tooltip" && [...t].length > (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(t) ? 40 : 80)) {
    add("long-tooltip", "check", "a tooltip is one short hint; longer help belongs on the screen, where touch and keyboard users can read it");
  }
  if (["fr", "en", "es", "de", "it", "pt"].includes(s.lang) && /\p{L}\((?:s|es|x|en|n|er)\)(?!\p{L})/u.test(t)) {
    add("paren-plural", "check", "write the real plural with Intl.PluralRules or an ICU plural, never « fichier(s) »");
  }
  if (minority.get(s.lang)?.test(t)) add(s.lang === "fr" ? "fr-apostrophe" : "address-mixed", "check", minority.get(`${s.lang}:hint`));

  if (s.lang === "fr") {
    f.push(...frSpacing(t));
    if (/"[^"]+"/.test(prose)) add("fr-quotes", "check", "use « » with non-breaking spaces inside");
    if (FR_CAPS.test(t)) add("fr-caps", "block", "accent the capital: État, Écran, Échec, À propos");
    if (address.minority && (address.minority === "tu" ? usesTu(t) : usesVous(t)) > 0) add("fr-address", "block", address.hint);
  }
  if (s.lang === "es") {
    if (prose.includes("?") && !prose.includes("¿")) add("es-marks", "check", "Spanish opens a question with ¿");
    if (/!(?!=)/.test(prose) && !prose.includes("¡")) add("es-marks", "check", "Spanish opens an exclamation with ¡");
  }
  if (s.lang === "de" && /"[^"]+"/.test(prose)) add("de-quotes", "check", "use „…“, or »…« if the product already does");
  // A numbered list ("1. サブ") and a decimal are not sentence punctuation; ？！ follow DESIGN.md.
  const cjk = prose.replace(/^\s*\d+[.)]\s?/, " ").replace(/\d[.,:]\d/g, " ").replace(/\.{2,}/g, "…").replace(/\.[A-Za-z0-9]{2,4}(?![A-Za-z0-9])/g, "");
  if ((s.lang === "ja" || s.lang === "zh") && /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}][,.;]|[,.;] ?[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(cjk)) {
    add("cjk-punct", "check", "next to CJK text use 、。 and ；; for ： ？ ！ follow Script conventions in DESIGN.md");
  }
  return f;
}

// Mixed forms across the project: the strings in the rarer form get a `check`.
function minorityForms(strings, tally) {
  const out = new Map();
  let straight = 0, curly = 0;
  for (const s of strings) {
    if (s.lang !== "fr") continue;
    straight += count(/\p{L}'\p{L}/gu, s.text);
    curly += count(/\p{L}’\p{L}/gu, s.text);
  }
  if (straight && curly && straight !== curly) {
    out.set("fr", straight < curly ? /\p{L}'\p{L}/u : /\p{L}’\p{L}/u);
    out.set("fr:hint", `apostrophes are mixed (' ${straight}, ’ ${curly}): this string uses the rarer one; pick one for the product`);
  }
  for (const [lang, { forms, counts }] of Object.entries(tally)) {
    // A tie has no rarer form: the main loop reports it as a note.
    if (lang === "fr" || !counts[0] || !counts[1] || counts[0] === counts[1]) continue;
    const rare = counts[0] < counts[1] ? 0 : 1;
    const a = ADDRESS[lang];
    out.set(lang, new RegExp((rare ? a.formal : a.informal)[1].source, (rare ? a.formal : a.informal)[1].flags.replace("g", "")));
    out.set(`${lang}:hint`, `${forms[0]} and ${forms[1]} are mixed (${counts[0]} / ${counts[1]}): this string uses ${forms[rare]}; pick one in DESIGN.md`);
  }
  return out;
}

function addressRule(strings, wanted) {
  let tu = 0, vous = 0;
  for (const s of strings) {
    if (s.lang !== "fr") continue;
    tu += usesTu(s.text);
    vous += usesVous(s.text);
  }
  if (wanted) {
    const other = wanted === "tu" ? "vous" : "tu";
    return { minority: other, hint: `uses ${other}; --address says ${wanted}${other === "vous" ? " (a plural vous is fine)" : ""}` };
  }
  if (tu > 0 && tu === vous) return { minority: null, tie: tu };
  if (tu === 0 || vous === 0) return { minority: null };
  const minority = tu < vous ? "tu" : "vous";
  return { minority, hint: `tu and vous are mixed (tu ${tu}, vous ${vous}, pronouns and imperatives); this string uses ${minority}` };
}

// ---------------------------------------------------------------- ui: rules

const ICON_LIBS = ["lucide-react", "lucide-vue-next", "lucide-svelte", "react-icons", "@heroicons/react", "@tabler/icons-react", "@phosphor-icons/react", "phosphor-react", "@radix-ui/react-icons", "react-feather", "@mui/icons-material", "@fortawesome/react-fontawesome", "iconoir-react", "@iconify/react", "remixicon", "@remixicon/react"];
const FONT_NAMES = "Inter|Roboto|Arial|Open Sans|Space Grotesk|Geist|Instrument Serif|Poppins|Montserrat";

const UI_RULES = [
  { id: "gradient-text", level: "check", all: [/\bbg-clip-text\b/, /\btext-transparent\b/], hint: "gradient text: a stock AI choice unless DESIGN.md picked it" },
  { id: "gradient-text", level: "check", any: [/background-clip:\s*text/], hint: "gradient text: a stock AI choice unless DESIGN.md picked it" },
  { id: "purple-gradient", level: "check", any: [/\b(?:from|via|to)-(?:purple|violet|indigo|fuchsia)-\d{2,3}\b/, /gradient\([^)]*(?:purple|violet|indigo|#(?:8b5cf6|7c3aed|6366f1|a855f7|9333ea|4f46e5|6d28d9))/i], hint: "purple or indigo gradient: the most common AI default" },
  { id: "glass", level: "check", any: [/\bbackdrop-blur(?:-[\w[\].]+)?\b/, /backdrop-filter:\s*blur/], hint: "blur behind a surface: keep it for a dismissible overlay backdrop" },
  { id: "glow", level: "check", any: [/\b(?:drop-)?shadow-\[0_0_(?!0[_\]])/, /box-shadow:\s*0(?:px)?\s+0(?:px)?\s+\d{2,}px/, /\bshadow-(?:purple|violet|indigo|cyan|fuchsia|pink|blue|emerald|sky)-\d{3}\b/], hint: "coloured glow: decoration, not hierarchy" },
  { id: "radial-glow", level: "check", any: [/radial-gradient\(/], hint: "radial glow or halo behind content: decoration unless DESIGN.md chose it (a vignette over media is fine)" },
  { id: "side-accent-border", level: "check", all: [/\bborder-[lt]-(?:[2-8]|\[\d+px\])(?!\S)/, /\brounded/], near: [/aria-current|aria-\[current|data-\[(?:active|selected|current)|\bisActive\b/], hint: "thick coloured side border on a rounded card: a strong AI tell; fine as the active marker of a nav or list item" },
  { id: "side-accent-border", level: "check", any: [/border-left:\s*(?:[3-9]|\d{2})px/], hint: "thick side border: a strong AI tell on cards and alerts" },
  { id: "eyebrow-label", level: "check", all: [/\buppercase\b/, /\btracking-(?:wide|wider|widest|\[[\d.]+(?:em|px|rem)\])/, /\btext-(?:xs|\[(?:9|10|11|12)px\])/], hint: "tiny uppercase tracked label: the eyebrow pattern above a heading; a quiet section label in a dense tool is fine if DESIGN.md says so" },
  { id: "heavy-shadow", level: "check", any: [/\bshadow-(?:xl|2xl)\b/, /box-shadow:[^;]*\b(?:[3-9]\d|\d{3})px/], hint: "wide soft shadow: one elevation level, overlays only" },
  { id: "transition-all", level: "block", any: [/\btransition-all\b/, /transition(?:-property)?:\s*all\b/], hint: "list the properties that change (transform, opacity, colors)" },
  { id: "bounce-pulse", level: "check", any: [/\banimate-(?:bounce|pulse|ping)\b/, /cubic-bezier\(\s*0?\.68\s*,\s*-0?\.55/], hint: "idle or bouncy motion: fine on a skeleton or a loader tied to real work, nowhere else" },
  // Popups, positioners and `tabIndex={-1}` targets take focus programmatically: no ring needed.
  { id: "outline-none", level: "check", all: [/(?:^|[\s"'`:])(?:focus:)?outline-none\b/], none: [/\bfocus-visible:/, /\bfocus-within:/, /\bdata-\[(?:focus|highlighted)/, /\bdata-highlighted:/, /\bfocus:(?:ring|outline-(?!none)|border|shadow)/, /@apply[^;]*\bring-/], near: [/Positioner|Popup|Popover(?:Primitive)?\.Content|Viewport|Portal|tabIndex=\{-1\}|tabindex="-1"|role="(?:dialog|menu|listbox|tooltip)"/], hint: "focus outline removed: check that a visible focus style exists here or on a focus-within wrapper. Tailwind v4: outline-hidden keeps the outline Windows high contrast needs" },
  { id: "hover-only", level: "block", all: [/\bopacity-0\b/, /\bgroup-hover(?:\/[\w-]+)?:opacity-100\b/, /hover:none|hoverless|pointer-coarse|any-hover/], none: [/\bpointer-events-none\b/, /aria-hidden/, /\b(?:group-)?focus(?:-within|-visible)?(?:\/[\w-]+)?:opacity-100\b/], hint: "action shown on hover (and touch) only: keyboard users tab to a button they cannot see; add group-focus-within:opacity-100" },
  { id: "hover-only", level: "block", all: [/\bopacity-0\b/, /\bgroup-hover(?:\/[\w-]+)?:opacity-100\b/], none: [/\bpointer-events-none\b/, /aria-hidden/, /\b(?:group-)?focus(?:-within|-visible)?(?:\/[\w-]+)?:opacity-100\b/], hint: "action shown on hover only: keyboard and touch users never see it" },
  { id: "hover-only", level: "check", all: [/\bopacity-0\b/, /\bgroup-hover(?:\/[\w-]+)?:opacity-100\b/], none: [/\bpointer-events-none\b/, /aria-hidden/, /hover:none|hoverless|pointer-coarse|any-hover/], hint: "shown on hover and focus only: still invisible on touch screens; add a (hover: none) variant" },
  { id: "default-font", level: "check", any: [new RegExp(`font-family:[^;]*\\b(?:${FONT_NAMES})\\b`), new RegExp(`\\bfont-\\[['"]?(?:${FONT_NAMES.replace(/ /g, "_")})`), /@fontsource(?:-variable)?\/(?:inter|roboto|space-grotesk|geist|instrument-serif|poppins|montserrat|open-sans)\b/, new RegExp(`family=(?:${FONT_NAMES.replace(/ /g, "\\+")})\\b`)], hint: "a default AI font: fine only if DESIGN.md chose it" },
  { id: "centered-hero", level: "check", all: [/\b(?:min-)?h-(?:screen|dvh|svh|\[100vh\])/, /\bjustify-center\b/, /\bitems-center\b/, /\btext-center\b/], hint: "full-screen centred block: the template hero (fine for a loading or error screen)" },
];

// A class list often spans several lines inside cn()/clsx()/cva() or a template literal, so
// co-occurrence rules look at the whole region and report the line that carries the first token.
function classRegions(src) {
  const regions = [];
  for (const m of src.matchAll(/\b(?:cn|clsx|classNames|cva|twMerge|tv)\s*\(/g)) {
    let depth = 0, i = m.index + m[0].length - 1;
    for (; i < src.length; i++) {
      if (src[i] === "(") depth++;
      else if (src[i] === ")" && --depth === 0) break;
    }
    regions.push([m.index, i]);
  }
  for (const m of src.matchAll(/\bclass(?:Name)?\s*=\s*\{?\s*(`[^`]*`|"[^"]*"|'[^']*')/g)) {
    regions.push([m.index, m.index + m[0].length]);
  }
  for (const m of src.matchAll(/\bclass(?:Name)?\s*=\s*\{/g)) {
    let depth = 0, i = m.index + m[0].length - 1;
    for (; i < src.length && i < m.index + 2000; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}" && --depth === 0) break;
    }
    regions.push([m.index, i]);
  }
  return regions;
}

const DEFAULT_FONT = new RegExp(`^\\s*["']?(?:${FONT_NAMES})\\b`);
const EMOJI_IN_TEXT = new RegExp(`>[^<]*(?:${EMOJI.source})`, "u");

function cssBlock(src, offset) {
  const open = src.lastIndexOf("{", offset);
  const close = src.indexOf("}", offset);
  return open < 0 || close < 0 ? "" : src.slice(open, close);
}

function scanUi(files) {
  const findings = [];
  const libs = new Map();
  for (const { path } of files) {
    const src = maskComments(readFileSync(path, "utf8"));
    const ext = extname(path).toLowerCase();
    const regions = classRegions(src);
    const seen = new Set();
    const add = (line, rule, level, hint, text) => {
      const key = `${line}:${rule}`;
      if (seen.has(key)) return;
      seen.add(key);
      findings.push({ file: path, line, text: text.trim().slice(0, 120), rule, level, hint });
    };
    let offset = 0, radiusLine = null, radiusText = "", radiusCount = 0;
    const lines = src.split("\n");
    lines.forEach((text, i) => {
      const line = i + 1;
      // Every class list that touches this line is judged on its own.
      const touching = regions.filter(([a, b]) => offset <= b && offset + text.length >= a);
      const ctxs = touching.length ? touching.map(([a, b]) => src.slice(a, b + 1)) : [text];
      // The element this line belongs to (from its last `<`), and the next three lines, where a
      // class array often carries the focus style.
      const above = lines.slice(Math.max(0, i - 8), i + 1).join("\n");
      const opening = [...above.matchAll(/<(?!\/)/g)].pop();
      const near = opening ? above.slice(opening.index) : above;
      const after = lines.slice(i + 1, i + 8).filter((l) => !/^\s*(\/\/|\/?\*)/.test(l)).slice(0, 6).join("\n").split(/<|\/>|(?<!=)>/)[0];
      // In a stylesheet, a rule scoped to :focus or :focus-visible already is the focus style.
      const selector = STYLE_EXT.has(ext) ? src.slice(src.lastIndexOf("}", offset) + 1, src.lastIndexOf("{", offset + text.length) + 1) : "";
      offset += text.length + 1;
      for (const r of UI_RULES) {
        if (r.any && !r.any.some((re) => re.test(text))) continue;
        if (r.all && !r.all[0].test(text)) continue;
        const hit = ctxs.some((ctx) => (!r.all || r.all.every((re) => re.test(ctx))) && !(r.none && r.none.some((re) => re.test(ctx) || (r.id === "outline-none" && re.test(after)))));
        if (!hit) continue;
        if (r.near && r.near.some((re) => re.test(near))) continue;
        if (r.id === "outline-none" && /:focus/.test(selector)) continue;
        add(line, r.id, r.level, r.hint, text);
      }
      // A font stack often starts on the line after `font-family:`.
      if (STYLE_EXT.has(ext) && /font-family:\s*$/.test(text) && DEFAULT_FONT.test(lines[i + 1] ?? "")) {
        add(line, "default-font", "check", "a default AI font: fine only if DESIGN.md chose it", `${text.trim()} ${lines[i + 1].trim()}`);
      }
      const radii = (text.match(/\brounded-(?:2xl|3xl|\[(?:1[6-9]|[2-9]\d)px\])/g) || []).length;
      if (radii) {
        radiusCount += radii;
        if (radiusLine === null) { radiusLine = line; radiusText = text; }
      }
      if ([".tsx", ".jsx", ".html", ".htm", ".vue", ".svelte"].includes(ext) && EMOJI_IN_TEXT.test(text)) {
        add(line, "emoji-icon", "check", "emoji used as an icon or decoration: use the project's icon library", text);
      }
      for (const m of text.matchAll(/from\s+["']([^"']+)["']/g)) {
        const lib = ICON_LIBS.find((l) => m[1] === l || m[1].startsWith(`${l}/`));
        if (lib && !libs.has(lib)) libs.set(lib, { file: path, line, text });
      }
      if (STYLE_EXT.has(ext) && /outline:\s*(?:none|0)\b/.test(text) && !/:focus-visible/.test(src) && !/(border|box-shadow|background|text-decoration)[\w-]*\s*:/.test(cssBlock(src, offset - text.length - 1 + text.search(/outline:/)))) {
        add(line, "outline-none", "check", "focus outline removed and no :focus-visible style in this file", text);
      }
    });
    if (radiusCount >= 3) add(radiusLine, "big-radius", "check", `${radiusCount} large radii (16px and up) in this file: one radius scale, from DESIGN.md`, radiusText);
  }
  if (libs.size > 1) {
    const names = [...libs.keys()];
    for (const [lib, at] of libs) {
      findings.push({ file: at.file, line: at.line, text: at.text.trim().slice(0, 120), rule: "icon-libs", level: "check", hint: `${names.length} icon libraries (${names.join(", ")}): keep one; this is ${lib}` });
    }
  }
  return findings;
}

// ---------------------------------------------------------------- copy: catalogs

// `{count}`, `{{count}}`, ICU `{count, plural, one {# file} other {# files}}`, Chrome `$count$`,
// Rails `%{count}`, printf `%s`. ICU branch bodies (`{# file}`, `{He}`) are text, not arguments:
// the walk descends into them and only collects the arguments inside.
function placeholders(text) {
  const out = [];
  const closing = (s, open) => {
    let depth = 0;
    for (let i = open; i < s.length; i++) {
      if (s[i] === "{") depth++;
      else if (s[i] === "}" && --depth === 0) return i;
    }
    return s.length;
  };
  const walk = (s) => {
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== "{") continue;
      if (s[i + 1] === "{") {
        const end = s.indexOf("}}", i);
        if (end < 0) return;
        out.push(`{{${s.slice(i + 2, end).trim()}}}`);
        i = end + 1;
        continue;
      }
      const end = closing(s, i);
      if (end >= s.length) return;
      const head = /^([^{},\s]+)\s*(?:,\s*(\w+)\s*(?:,([\s\S]*))?)?$/.exec(s.slice(i + 1, end));
      if (head) {
        out.push(`{${head[1]}}`);
        if (/^(plural|select|selectordinal)$/.test(head[2] ?? "") && head[3]) {
          const branches = head[3];
          for (let k = branches.indexOf("{"); k >= 0; k = branches.indexOf("{", closing(branches, k) + 1)) {
            walk(branches.slice(k + 1, closing(branches, k)));
          }
        }
      }
      i = end;
    }
  };
  walk(text);
  for (const m of text.matchAll(/\$([A-Za-z_]\w*)\$|%(?:\d+\$)?[sd@]/g)) out.push(m[1] ? `$${m[1]}$` : m[0]);
  return out.sort().join(" ");
}


// Files of one group translate each other. A key whose placeholders differ from the other
// languages is a broken string; a key the fullest file has and another lacks falls back.
function catalogChecks(strings, source) {
  const out = [];
  const groups = new Map();
  for (const s of strings) {
    if (!s.group || s.key == null) continue;
    if (!groups.has(s.group)) groups.set(s.group, new Map());
    const byFile = groups.get(s.group);
    if (!byFile.has(s.file)) byFile.set(s.file, new Map());
    const keys = byFile.get(s.file);
    keys.set(s.key, keys.has(s.key) ? null : s);
  }
  for (const byFile of groups.values()) {
    if (byFile.size < 2) continue;
    const ranked = [...byFile].sort((a, b) => b[1].size - a[1].size);
    const [refFile, refKeys] = ranked[0];
    // The source language decides what the placeholders should be: --source, else the file whose
    // keys are its own text (sentences used as keys), else the majority of the languages.
    const own = (keys) => [...keys.values()].filter((x) => x && x.key === x.text).length;
    const sourceFile = ranked.find(([file]) => source && localeLang(file) === source)
      ?? [...ranked].sort((a, b) => own(b[1]) - own(a[1])).find(([, keys]) => own(keys) >= 3);
    const allKeys = new Set(ranked.flatMap(([, keys]) => [...keys.keys()]));
    for (const key of allKeys) {
      const entries = ranked.map(([, keys]) => keys.get(key)).filter(Boolean);
      if (entries.length < 2) continue;
      const sets = entries.map((s) => placeholders(s.text));
      const freq = new Map();
      for (const p of sets) freq.set(p, (freq.get(p) || 0) + 1);
      const best = Math.max(...freq.values());
      const ref = refKeys.get(key) ? placeholders(refKeys.get(key).text) : null;
      const fromSource = sourceFile?.[1].get(key);
      const expected = fromSource ? placeholders(fromSource.text) : freq.get(ref) === best ? ref : [...freq].find(([, n]) => n === best)[0];
      entries.forEach((s, i) => {
        if (sets[i] === expected) return;
        out.push({ file: s.file, line: s.line, text: s.text, lang: s.lang, key, rule: "placeholder-mismatch", level: "block", hint: `placeholders ${sets[i] || "none"}, ${fromSource ? "the source language has" : "the other languages have"} ${expected || "none"}: a translated or missing placeholder shows broken text` });
      });
    }
    for (const [file, keys] of ranked.slice(1)) {
      const missing = [...refKeys.keys()].filter((k) => !keys.has(k));
      if (!missing.length) continue;
      const sample = missing.slice(0, 3).join(", ") + (missing.length > 3 ? ", …" : "");
      out.push({ file, line: 1, text: basename(file), lang: localeLang(file), rule: "locale-missing", level: "check", hint: `${missing.length} of ${refKeys.size} keys missing compared with ${rel(refFile)} (${sample}): those strings fall back to another language or show the key` });
    }
  }
  return out;
}

// Every string literal in the scanned code, to tell which catalog keys the code never names.
function codeLiterals(files) {
  const names = new Set();
  const prefixes = [];
  let scanned = 0;
  for (const { path } of files) {
    if (!CODE_EXT.has(extname(path).toLowerCase()) || isLocaleFile(path)) continue;
    scanned++;
    const src = readFileSync(path, "utf8");
    for (const m of src.matchAll(/(["'`])((?:\\.|(?!\1)[^\\\n]){1,300})\1/g)) {
      names.add(m[2]);
      names.add(m[2].slice(m[2].lastIndexOf(":") + 1));
      const dynamic = /^(?:[\w-]+:)?([\w.-]+)\$\{/.exec(m[2]);
      if (dynamic) prefixes.push(dynamic[1]);
    }
    for (const m of src.matchAll(/__MSG_(\w+?)__/g)) { names.add(m[0]); names.add(m[1]); }
  }
  return scanned ? { names, prefixes } : null;
}

function keyUsed(key, code) {
  const bare = key.replace(/_(?:zero|one|two|few|many|other|plural)$/, "");
  const parts = bare.split(".");
  for (let i = 0; i < Math.max(1, parts.length - 1); i++) if (code.names.has(parts.slice(i).join("."))) return true;
  return code.prefixes.some((p) => p && bare.startsWith(p));
}

// ---------------------------------------------------------------- output

const rel = (p) => relative(process.cwd(), p).split("\\").join("/") || p;
const cell = (s) => String(s ?? "").replace(/\|/g, "\\|").replace(/\n/g, " ");
const cut = (s, n) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
const show = (s) => s.replace(/\u00A0/g, "⍽").replace(/\u202F/g, "·");

function report(opts, files, strings, findings, notes) {
  findings.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
  const counts = {};
  for (const f of findings) {
    const k = `${f.rule} (${f.level})`;
    counts[k] = (counts[k] || 0) + 1;
  }
  if (opts.json) {
    console.log(JSON.stringify({
      mode: opts.mode, files: files.length, fileList: files.map((f) => rel(f.path)), strings: strings?.length,
      inventory: opts.list ? strings.map((s) => ({ file: rel(s.file), line: s.line, lang: s.lang, key: s.key, text: s.text })) : undefined,
      findings: findings.map((f) => ({ ...f, file: rel(f.file) })), counts, notes,
    }, null, 2));
    return;
  }
  if (opts.list) {
    console.log("| where | lang | text |\n|---|---|---|");
    for (const s of strings) console.log(`| ${cell(`${rel(s.file)}:${s.line}`)} | ${s.lang ?? "?"} | ${cell(cut(show(s.text), 100))} |`);
    console.log(`\n${strings.length} strings in ${files.length} files.`);
    return;
  }
  if (findings.length) {
    console.log("| where | text | rule | level | hint |\n|---|---|---|---|---|");
    for (const f of findings) {
      console.log(`| ${cell(`${rel(f.file)}:${f.line}`)} | ${cell(cut(show(f.text), 80))} | ${f.rule} | ${f.level} | ${cell(f.hint)} |`);
    }
    console.log("");
  }
  const scanned = opts.mode === "copy" ? `${strings.length} strings in ${files.length} files` : `${files.length} files`;
  const blocks = findings.filter((f) => f.level === "block").length;
  console.log(`Scanned ${scanned}. ${findings.length} findings: ${blocks} block, ${findings.length - blocks} check.`);
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) console.log(`  ${k}: ${v}`);
  for (const n of notes) console.log(`Note: ${n}`);
  console.log("Shown as ⍽ = U+00A0, · = U+202F. Heuristic: read each finding in context before changing anything.");
}

// ---------------------------------------------------------------- main

const opts = parseArgs(process.argv.slice(2));
const notes = [];
const files = selectFiles(opts, notes);
let strings = null;
let findings;

if (opts.mode === "ui") {
  findings = scanUi(files);
} else {
  strings = [];
  const pinned = [];
  for (const { path } of files) {
    const src = readFileSync(path, "utf8");
    const ext = extname(path).toLowerCase();
    if (ext === ".json") strings.push(...extractJson(src, path));
    else if (TEXT_EXT.has(ext)) strings.push(...extractText(src, path));
    else if (isLocaleFile(path)) strings.push(...extractLocaleCode(src, path));
    else {
      strings.push(...extractCode(src, path));
      const line = lineIndex(src);
      for (const m of maskComments(src).matchAll(RE_PINNED_LOCALE)) pinned.push({ file: path, line: line(m.index), text: m[0], lang: null });
    }
  }
  strings.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
  assignLanguages(strings, opts.lang);
  findings = [];
  if (!opts.list) {
    const cache = new Map();
    const lexiconFor = (lang) => {
      if (!cache.has(lang)) cache.set(lang, loadLexicon(lang));
      return cache.get(lang);
    };
    const address = addressRule(strings, opts.address);
    if (address.tie) notes.push(`tu and vous appear equally often (${address.tie} each): decide in DESIGN.md, then rerun with --address`);
    const tally = addressTally(strings);
    const env = { lexiconFor, address, vocab: learnWords(strings), minority: minorityForms(strings, tally) };
    for (const s of strings) {
      for (const f of checkString(s, env)) findings.push({ file: s.file, line: s.line, text: s.text, lang: s.lang, key: s.key, ...f });
    }

    // Catalogs: broken placeholders, missing keys, text left in code, locales fixed in code.
    const catalogLangs = new Set(strings.filter((s) => s.group).map((s) => s.lang));
    findings.push(...catalogChecks(strings, opts.source));
    if (catalogLangs.size > 1) {
      // A string that is itself a catalog key ("Image suivante" passed to t() later) is translated.
      const catalogKeys = new Set(strings.filter((s) => s.group && s.key != null).map((s) => s.key));
      for (const s of strings) {
        if (s.group || !["jsx", "attr", "prop", "call"].includes(s.kind) || catalogKeys.has(s.text)) continue;
        if (s.file.split(/[\\/]/).slice(0, -1).some((p) => LOCALE_DIR.test(p))) continue;
        const words = s.text.replace(/\{[^{}]*\}/g, " ").split(/\s+/).filter((w) => /\p{L}{2,}/u.test(w));
        if (words.length < 2) continue;
        findings.push({ file: s.file, line: s.line, text: s.text, lang: s.lang, rule: "not-translated", level: "check", hint: "text written in code while the app has locale files: every language shows it as is" });
      }
    }
    if (catalogLangs.size > 1) {
      for (const p of pinned) findings.push({ ...p, rule: "pinned-locale", level: "check", hint: "dates and numbers follow the UI language: pass the current i18n language, not a fixed locale" });
    }
    const code = catalogLangs.size ? codeLiterals(files) : null;
    if (code) {
      const keyed = strings.filter((s) => s.group && s.key != null);
      const id = (file, key) => JSON.stringify([file, key]);
      const unused = new Set(keyed.filter((s) => !keyUsed(s.key, code)).map((s) => id(s.file, s.key)));
      if (unused.size > keyed.length * 0.6) {
        // Most keys unnamed means the scan saw part of the app (one screen), not dead strings.
        notes.push(`${unused.size} of ${keyed.length} catalog entries are not named in the scanned code: the scan covers part of the app, so no key is marked unused. Scan the whole app to find dead strings`);
      } else {
        let hits = 0;
        for (const f of findings) {
          if (f.key == null || !unused.has(id(f.file, f.key))) continue;
          f.unused = true;
          f.hint += " · key not found in the scanned code";
          hits++;
        }
        if (unused.size) notes.push(`${unused.size} of ${keyed.length} catalog entries have a key the scanned code never names (unused, or built at run time); ${hits} findings sit on them`);
      }
    }
    for (const [lang, t] of Object.entries(tally)) {
      if (lang !== "fr" && t.counts[0] && t.counts[0] === t.counts[1]) notes.push(`${lang}: ${t.forms[0]} and ${t.forms[1]} appear equally often (${t.counts[0]} each): decide in DESIGN.md`);
    }


    const forms = Object.entries(tally).filter(([, t]) => t.counts[0] + t.counts[1] > 0);
    if (forms.length) notes.push(`address: ${forms.map(([lang, t]) => `${lang} ${t.forms[0]} ${t.counts[0]} / ${t.forms[1]} ${t.counts[1]}`).join(" · ")} (pronouns${tally.fr ? "; fr counts imperatives too" : ""})`);
    const perLang = {};
    for (const s of strings) perLang[s.lang] = (perLang[s.lang] || 0) + 1;
    const missing = [...cache].filter(([, v]) => v === null).map(([k]) => k);
    const real = missing.filter((l) => perLang[l] >= 3 || catalogLangs.has(l));
    const stray = missing.filter((l) => !real.includes(l));
    if (real.length) notes.push(`no lexicon for ${real.join(", ")}: only language-neutral rules ran; review with references/words-any.md`);
    if (stray.length) notes.push(`${stray.join(", ")}: fewer than 3 strings, probably names (a language's own name, a channel); load words-any.md only if it is a UI language`);
  }
}

report(opts, files, strings, findings, notes);
if (opts.strict && findings.some((f) => f.level === "block")) process.exit(1);
