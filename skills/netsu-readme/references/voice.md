# Voice

How to write so it reads like a person wrote it. Load this before writing any prose, and load it
on its own when the job is to clean an existing file.

## The principle

Word lists go stale. `delve` peaked in early 2024 and has been decaying since; the em dash was a
real tell in 2025 and by mid-2026 ChatGPT used *fewer* than professional human writers. Chasing
the markers is a losing game, and optimising against them just hides the problem.

The target is a README that is **true and specific**, which then happens not to read as AI.
Three habits get you there, and the rest of this file is detail:

1. **A number, a command, or an error string wherever an adjective wants to go.** Not "robust
   retry logic" — "retries 3 times with 2s backoff, then gives up."
2. **State a limit.** What it does badly, when not to use it, what it does not support. SQLite's
   README-adjacent page says it competes with `fopen()`, not with client/server databases. That
   single admission does more for trust than any feature list.
3. **Leave the author in.** One opinion, one tradeoff, one preference stated as preference.
   Writing-assistance measurably strips variance and the fine-grained markers of a person —
   pronouns, emotion words, moral language. That loss is exactly what readers detect.

## 1. Context leak — the blocker

The failure the user cares about most: something said in the conversation ends up in the file.
The formal name is OWASP LLM02, Sensitive Information Disclosure. The fix is data minimisation.

**One rule catches most of it: a README sentence must be traceable to a file in the repository.**
If you cannot point at the line of code, the config key, the CI job or the LICENSE that makes it
true, delete it. The repository is the input. The conversation is not.

### Never include without an explicit instruction in a committed file

1. Real names, handles, employers, job titles, clients.
2. Email addresses, including the one in `git config`.
3. Absolute local paths (`S:\...`, `/Users/<name>/...`, `C:\Users\...`), machine names,
   hostnames, LAN IPs, drive letters.
4. Tokens, API keys, connection strings, internal URLs, bucket names, locally-open ports.
5. Internal or in-conversation terminology: codenames, the working name before the real name,
   "phase 2", "the new approach", "as we discussed", a module nickname absent from the code.
6. The assistant's own uncertainty or reasoning: "likely", "appears to", "based on the code I
   could see", "this may need verification", "as of my knowledge cutoff".
7. Conversational wrapper: "Certainly!", "I hope this helps", "Let me know if…", "Would you like
   me to…", "Here is a…", "As requested", "You're absolutely right".
8. Process narration: "This was refactored from…", "Previously this used X", "Added error
   handling here". That belongs in git history.
9. Anything the user said as an aside: deadlines, why they are building it, what they tried
   first, their frustration with another tool, their hardware, their location, their skill level.
10. Anything unverifiable in the repo: benchmark numbers with no script, "used in production
    by…", adoption claims, roadmaps nobody committed to, "battle-tested".
11. Generation attribution — "Generated with…", `Co-Authored-By: <model>` — unless asked for.
12. Unfilled placeholders: `[Your Name]`, `<your-repo>`, `INSERT_`, `TODO`, `2025-xx-xx`,
    `example.com` where a real URL belongs.

This is not theoretical. 768 published papers have been catalogued containing phrases like "as an
AI language model"; Amazon listings shipped titled "I'm sorry but I cannot fulfill this request";
a 2025 dataset was built purely by grepping public repositories for generation signatures and
found 8,320 files with "readme" in the name.

### The four tests, all must pass

1. **Reader need** — a stranger evaluating the project needs this to decide, install, use or
   debug. If only the author or the assistant benefits, cut it.
2. **Repository** — verifiable from the repo itself.
3. **Durability** — still true in six months with nobody editing it.
4. **Attribution** — the project's public identity would say it in public, under its own name.

## 2. Words

Tier **A** is measured in a peer-reviewed corpus (Kobak et al., *Science Advances* 2025, 15M
PubMed abstracts; Liang et al., ICML 2024). Tier **B** is community-measured. Tier **C** is
developer-marketing cliché with no corpus behind it — still bad writing, flag on density.

| Term | Tier | Write instead |
|---|---|---|
| comprehensive | A | Say what it covers, or delete |
| seamless, seamlessly | A | Delete, or "no config file needed" |
| leverage, leverages, leveraging | A | use |
| utilize, utilizes, utilizing | A | use |
| streamline(d/s/ing) | A | "removes the build step" |
| empower(s) | A | "lets you" |
| unlock(ing), elevate(s), harness(ing) | A | Say what becomes possible |
| ensure, ensures, ensuring | A | Name the mechanism: "validates the schema before write" |
| crucial, pivotal | A | Delete, or say why |
| meticulous, meticulously | A | Delete |
| intricate, intricacies | A | "complex", or describe it |
| delve, delves, delving | A | "covers", "looks at" |
| showcase(s/ing) | A | "shows", "includes an example of" |
| underscore(s/ing) | A | Delete |
| groundbreaking, transformative, revolutionize | A | Delete |
| innovative, notable, noteworthy, remarkable, commendable | A | Delete |
| invaluable, unparalleled, exceptional | A | Delete |
| multifaceted, holistic, nuanced | A/B | Delete |
| foster(s/ing) | A | help |
| realm, in the realm of | A | Name the field |
| modern, core | A | Delete — both content-free, both measurably spiking |
| additionally, moreover, furthermore | A | Start the sentence |
| across, amid, amidst, alongside | A | Name the actual scope |
| robust | B | Name the failure it survives: "retries on 5xx" |
| cutting-edge, game-changer | B | Say what is new |
| testament to, cannot be overstated | B | Say what it proves |
| valuable insights, plays a crucial role | B | Delete |
| one-size-fits-all, double-edged sword | B | Delete |
| in today's fast-paced / ever-changing world | C | Delete. Start with what the thing is |
| it's worth noting, it's important to note | C | State the fact |
| dive into, deep dive, let's dive in | C | Delete |
| designed to, built to, aims to | C | State behaviour: "reads X, writes Y" |
| battle-tested, production-ready, enterprise-grade | C | "Running in production at X since Y", or delete |
| blazingly fast | C | A number, with the method |
| state-of-the-art | C | Keep only with a benchmark figure |
| first-class, out of the box, under the hood | C | At most one per README |
| simply, easily, just, quickly | C | Delete. Google's style guide bans these in procedures |

The UK government style guide independently bans most of the same list and supplies replacements:
`deliver→make`, `deploy→use`, `facilitate→run`, `impact→affect`, `key→important`,
`tackle→solve`, `utilise→use`. Worth reading once if you write a lot of these.

## 3. Structure

| Marker | Rule |
|---|---|
| **Emoji** | The strongest current tell — 70% of mid-2025 ChatGPT messages carried one. An emoji on *every* heading is machine output. Cap: 0 in a project README unless the user asks. Presence is not the signal; uniformity is |
| **"It's not X, it's Y" / "Not only… but also"** | Ban it. Present in 6% of mid-2025 chats. The shape lets a sentence avoid a falsifiable claim |
| **Trailing `-ing` clause** | `, ensuring seamless integration` / `, allowing developers to` / `, making it easy to`. Measured at 2–5× the human rate. The highest-value thing to grep for. Split into two sentences or cut |
| **Rule of three** | Every bullet a triad, every list exactly three items. Vary the count, or the list is decoration |
| **Bold-lead bullets** | `- **Fast**: …` is a real human README convention. It becomes a tell when *every* bullet has it. Under 60% of a list |
| **Title Case Headings** | Use sentence case. Title case on every heading is a documented tell |
| **`---` between every section** | Use a horizontal rule deliberately or not at all |
| **Heading pathologies** | Starting at H3 with no H2; a heading containing only other headings; a section with two sentences under its own heading |
| **"Conclusion" / "In summary"** | A README has no conclusion. Stop when done |
| **"Future prospects" / "Challenges" closer** | The rigid formula is the tell, not the topic |
| **Small tables where prose would do** | A four-fact table is one sentence |
| **Spaced em dash — English only** | Not the em dash itself, the *spacing*. A habitual English writer sets it closed: `word—word`. The spaced form `word — word` is the sub-tell that survived. Under 8 per 1,000 words either way. **Does not apply outside English**: French, Spanish and Russian typography set dashes spaced by rule, so the count is meaningless there. Check the README's language before running this one |

## 4. Grep

Context leak — any hit is a blocker.

Run these as six separate commands. Do **not** merge them into one pattern with `-i`: the last two
are case-sensitive on purpose, and `/Users/` folded to lowercase matches the `/users/` in ordinary
URLs, so a page full of badge links reports a leak that is not there.

```bash
grep -rniE "certainly!|i hope this helps|let me know if|would you like me to|as requested|you'?re absolutely right|here'?s a (template|breakdown)" README.md
grep -rniE "as of my (last )?(knowledge|training)|knowledge cutoff|i (don'?t|do not) have (access|specific)|based on (the )?available" README.md
grep -rnE "\[Your Name\]|<your-|INSERT_|TODO|XXX|PLACEHOLDER|20[0-9][0-9]-(xx|XX)-|example\.com" README.md
grep -rniE "co-authored-by|generated with|written (with the help of|by) (an? )?(ai|claude|chatgpt|copilot|gpt)" README.md
grep -rnE "([A-Za-z]:\\\\|/Users/|/home/|/mnt/[a-z]/)" README.md
grep -rnE "[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}" README.md
```

Style:

```bash
grep -onEi "\b(comprehensive|robust|seamless(ly)?|leverag(e|es|ing)|utiliz(e|es|ing)|streamlin(e|es|ing)|empower(s)?|unlock(s|ing)?|elevate[sd]?|harness(es|ing)?|cutting-edge|battle-tested|production-ready|blazingly|delve[sd]?|crucial|pivotal|meticulous(ly)?|intricate|showcas(e|es|ing)|underscore[sd]?|ensur(e|es|ing)|foster(s|ing)?|transformative|groundbreaking|realm|testament|multifaceted|holistic|nuanced|modern)\b" README.md
grep -onE ", [a-z]+ing [a-z]" README.md                        # trailing participles
grep -onE "^[-*] \*\*[^*]+\*\*:" README.md                     # bold-lead bullets
grep -onEi "not just [^.]{1,40}(—|,) (it'?s|but)" README.md
LC_ALL=C grep -nE '^#+ +[^ -~]' README.md                      # emoji-led headings
LC_ALL=C grep -o ' — ' README.md | wc -l                       # spaced em dashes, ENGLISH ONLY
```

No `grep -P` anywhere above, deliberately. Git Bash on Windows ships a grep built without PCRE,
and `-P` there fails silently — it returns nothing and the check looks clean. `LC_ALL=C` plus
`[^ -~]` (any byte outside printable ASCII) is the portable way to catch an emoji.

## 5. Do not over-fire

These are **not** evidence of anything, and treating them as such produces false accusations:
perfect grammar; formal register; transition words on their own; "bland" prose; correct
formatting; bizarre formatting; an unsourced sentence.

**Check the language before running any typographic check.** Most of the structural markers in
§3 were measured on English text. Spaced dashes are correct French, Spanish and Russian
typography; accented characters are not emoji. Running the English checks on a French README
flags the whole file and tells you nothing.

Neural AI detectors do not work — OpenAI withdrew its own after publishing a 26% true-positive
rate, and detectors measurably misclassify non-native English writing as machine-generated. Use
the lexical and structural checks above, and read for specificity. Never accuse.

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| "A comprehensive, robust solution designed to seamlessly…" | "Reads a CSV, writes Parquet. Streams, so a 40 GB file fits in 200 MB of RAM." |
| Emoji on every heading | No emoji unless asked |
| Every bullet: `- **Bold thing**: sentence, ensuring benefit.` | Vary the shape. Cut the trailing `-ing` clause entirely |
| Three items in every list because three feels complete | The number of items there actually are |
| A claim the repo does not support, written confidently | A question to the user |
| Something the user mentioned in chat, written into the file | Only what a file in the repo supports |
| Hedging in the artefact — "this may need verification" | Verify it, or leave it out and ask |
| Ending on "Conclusion" or an offer to help | Stop |
