# Research

Where the rules in [`SKILL-RULES.md`](SKILL-RULES.md) come from. Every source is listed with its
date, what it actually measured, and which rule it changed — or that it changed nothing.

**What this file owns.** The full citation, the sample size, the numbers, and how much to trust
them. `SKILL-RULES.md` keeps a short citation next to each rule, because a rule needs its
evidence in view; the long version lives here and nowhere else (rule 19).

**How to read the confidence column.** *Read* means the page was opened and read in full.
*Summarised* means it was fetched through a model that rewrote it, so the wording is close but not
guaranteed verbatim — check the live page before quoting. *Secondary* means someone else's
account of a primary source; used for orientation, never as a number.

Research done 2026-11-27. Dates in the tables are the sources' own.

---

## 1. Conflicting instructions

The question: when two rules in one file contradict each other, what actually happens?

### WhoWins — Position, Role or Label? A Controlled Study of Instruction Conflicts in LLM Agents

[arXiv:2610.33201](https://arxiv.org/abs/2610.33201) · 2026-10-23 · paper · summarised

1,080 scenarios, 14 open models from 0.6B to 122B, 26 model × thinking modes, 1,887,356
code-graded responses.

| Setup | Result |
|---|---|
| Two contradictory lines, same message | the **first** wins 72.42–94.66 % of decided responses |
| Two lines in the system message | the **second** wins only 10.80–36.21 % — under half in all 26 modes |
| Two messages | the earlier message keeps 22.95–62.65 %; the recent one wins in 16 of 26 modes |
| Policy in a real system message vs the same text labelled inside a user message | the system message loses in all 26 modes, by 6.41 to 48.75 points |
| Two rule levels declared in order | **no model** honoured the declared order in 95 % of responses |

Thinking improves the last row on Qwen (75.67 % → 95.44 % for Qwen3.5-122B).

**What it changed.** Rule 17 exists because of this paper. It is the reason a correction appended
under an older rule does not correct it, and the reason "unless stated otherwise below" is
decoration. It also set the repair pattern used on five skills: move the condition into the
earlier line rather than adding an exception later.

### xAI, speech-to-speech prompting guide

[docs.x.ai](https://docs.x.ai/developers/model-capabilities/audio/speech-to-speech/prompting-guide)
· page says "Last updated: August 17, 2026" · official docs · read

Written for voice agents, but the only official vendor page found that names the accretion
problem directly:

- "Be precise. Ambiguity or conflicting instructions degrade performance."
- On an appended overrides section: "Use this section sparingly: every rule added here dilutes
  the emphasis of the others."
- "Conflicting tool descriptions between the prompt and the actual tool schema degrade
  performance." Only mention tools that exist in the tool definition.
- "Iterate relentlessly. Small wording changes often produce large behavior differences."
- A fixed five-section order, because prompts written that way "sit closest to the training
  distribution".
- A meta-prompt, *Instruction quality check*, that audits a prompt for ambiguity, missing
  definitions, conflicting instructions and unstated assumptions.

**What it changed.** Rule 18 uses that meta-prompt unchanged. Its two `Do NOT` clauses — do not
invent tools or external information, do not list issues you are unsure about — are the reason it
does not manufacture problems to look thorough, which is the same discipline as rule 12.

### Anthropic, memory and CLAUDE.md

[code.claude.com/docs/en/memory](https://code.claude.com/docs/en/memory) · no date on page ·
official docs · summarised

- "if two instructions contradict each other, Claude may pick one arbitrarily."
- Review `CLAUDE.md`, nested `CLAUDE.md` and `.claude/rules/` periodically for instructions that
  are stale or contradictory.
- `CLAUDE.md` target: under 200 lines. `@import` does not reduce context.
- `/doctor prompt-audit` (Claude Code v2.1.283+) searches `CLAUDE.md`, `AGENTS.md`, skills,
  commands and subagents for instructions written for older models, references to files or
  commands that no longer exist, and contradictory files.

**What it changed.** Confirms rule 17's premise from the vendor whose models run these skills.
`/doctor prompt-audit` is the tool to run before a critique pass, and it covers files this
contract does not: the user's own global memory and slash commands.

### Where position puts the sources in disagreement

| Source | Claim |
|---|---|
| WhoWins (above) | first line wins inside a message; recent message wins across messages |
| IFScale ([arXiv:2507.11538](https://arxiv.org/abs/2507.11538)) | a bias toward the earlier instructions |
| OpenAI, GPT-4.1 prompting guide ([cookbook](https://developers.openai.com/cookbook/examples/gpt4-1_prompting_guide), date not confirmed) | for long context, put instructions at the start **and** the end; on conflict the model "tends to follow the one closest to the end" |
| Lost in the Middle ([arXiv:2307.03172](https://arxiv.org/abs/2307.03172), 2023-07, TACL) | best at the beginning or the end, degrades in the middle |

There is no portable rule for who wins. That disagreement is why rule 17 allows the hardest
prohibition to appear at both ends in the same words, and forbids relying on order for anything
else.

---

## 2. Length, redundancy and attention

### Chroma, Context Rot

[trychroma.com/research/context-rot](https://www.trychroma.com/research/context-rot) · 2025-07-14
· technical report · summarised

18 models (5 Anthropic, 7 OpenAI, 3 Google, 3 Alibaba), 194,480 LLM calls.

- Degradation appears at every length step, not only near the window limit — already at 50K
  tokens, including on a model with a 1M window.
- A **single** distractor lowers performance against the needle-only baseline; four compound it.
- Distractors that are close in topic to the real instruction are the worst kind.
- Even a trivial text-repetition task degrades with length.
- The report has no percentages in its prose; the curves are in the figures, which were not read.
  No tested mechanism is proposed.

**What it changed.** It is the argument in rule 17 that two near-identical rules in one skill are
not harmless duplication — they are the topically-close distractor this report measures. It also
backs rule 2's existing position that a skill gets less reliable as it gets longer.

### IFScale — How Many Instructions Can LLMs Follow at Once?

[arXiv:2507.11538](https://arxiv.org/abs/2507.11538) · 2025-07-15 · paper · summarised

500 simultaneous keyword-inclusion instructions, 20 models, 7 providers. Best frontier models
hold **68 % accuracy at density 500**. Three degradation patterns across models: threshold,
linear, exponential. The paper also reports a bias toward earlier instructions; the per-model
breakdown could not be extracted.

**What it changed.** Cited in rule 17 as the reason an instruction count is a budget, not a free
list. A third-party tracker reports newer models at 100 % on the same benchmark; that figure is
not primary and is not used here.

### SkillReducer — Optimizing LLM Agent Skills for Token Efficiency

[arXiv:2603.29919](https://arxiv.org/abs/2603.29919) · 2026-03-31 · preprint · summarised

55,315 public skills surveyed; 26.4 % have no description at all. On 90 sampled skills, 15,107
paragraphs were classified:

| Paragraph kind | Share |
|---|---|
| Central rule | 38.5 % |
| Context | 40.7 % |
| Example | 12.9 % |
| Template | 7.6 % |
| Redundant | 0.3 % |

Their compression: −48 % on descriptions, −39 % on bodies, with functional quality +2.8 %
(0.742 against 0.722, d = 0.107 — a small effect). Gains concentrated in official skills
(+11.8 points) over community ones (+1.1).

**Limitation, stated here because the authors evaluate their own method**: the optimisation signal
and the evaluation criterion overlap. The compression ratios are more trustworthy than the quality
gain.

**What it was used for.** The 38.5 % figure is the yardstick the nine skills in this repo were
measured against. They run 70–95 % rule paragraphs, which is why the audit found the redundancy
problem in the contract and in `AGENTS.md` rather than inside the skills.

### ETH Zurich — Evaluating AGENTS.md

[arXiv:2602.11988](https://arxiv.org/abs/2602.11988) · 2026-02-12, v3 2026-09-29 · paper ·
summarised

AGENTbench / CTXbench, 138 instances, and SWE-bench Lite, 300 tasks.

| Context file | Resolution | Cost |
|---|---|---|
| Written by an LLM | −0.5 % (SWE-bench, p = 0.87), −2 % (CTXbench, p = 0.37) | about +20 % |
| Written by developers | +2.4 % (p = 0.21) | up to +19 % |

None of it statistically significant. Steps rose by +2.45 to +3.92 (LLM) and +3.34 (human).
Instructions are followed: a file that mentions `uv` produced 1.6 mentions per instance against
under 0.01 without. **With the repository's own documentation removed, the LLM-written files
gained +2.7 %** — they were largely redundant with documentation that already existed.

**What it changed.** Rule 19 cites the last row. It is the measured cost of the same rule living
in two files, and the reason `AGENTS.md` went from 118 lines to 64 instead of being tidied.

---

## 3. The state of published skills

### What Keeps Agent Skills from Being Reusable? Evidence from 138K SKILL.md Files

[arXiv:2608.08453](https://arxiv.org/abs/2608.08453) · 2026-08-09 · preprint · summarised

| Measure | Value |
|---|---|
| Skills with at least one detected defect | 91.8 % (88.8–94.6 % depending on threshold) |
| Violating at least one official spec rule | 89.3 % |
| Mean defects per skill | 2.5 |
| Routing accuracy, clean skills | 88.5 % hit@1 |
| Routing accuracy, defective skills | 82.6 % |
| An LLM repairer | fixes 58.4 % of defects, introduces 0.06 per skill |

The authors note the 91.8 % mixes cosmetic and serious defects.

**What it was used for.** The 6-point routing gap is the measured cost of a sloppy
`description`, which is what rule 4 is about. Nothing in the contract changed because of this
paper; it is context for why the bar exists.

---

## 4. Authoring guidance from the vendors

### Anthropic, skill authoring best practices

[platform.claude.com](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
· no date on page · official docs · summarised

Hard limits: `name` 64 characters, lowercase, digits and hyphens, no XML tags, and the words
`anthropic` and `claude` are reserved. `description` non-empty, 1024 characters maximum. Body
under 500 lines. References one level deep from `SKILL.md`, since Claude may read only excerpts.
A table of contents in any reference past 100 lines. Forward slashes in paths, even on Windows.
Scripts execute without entering context; only their output costs tokens.

On writing: third person, since the description is injected into the system prompt. Be "pushy" —
Claude under-triggers skills. Keep only what Claude does not already know; their example prefers
a 50-token `pdfplumber` snippet over a 150-token explanation. Three degrees of freedom — prose for
several valid approaches, pseudo-code or a parameterised script for the middle, an exact command
for fragile operations. One default plus a fallback, not a list of options. One terminology
throughout. No dated information in the body; if it is needed, a folded "old patterns" section.

Their iteration loop: Claude A writes the skill, Claude B uses it on real tasks, you watch where
B fails and return to A with the specific cases.

Also, on the record: "Claude models handle the Skill format and structure natively. You don't need
special system prompts or a 'writing skills' skill."

**Where this contract disagrees, deliberately.** Anthropic puts dated information out of the body;
rule 8 requires the date to stay next to the number. Both are trying to stop a stale threshold
from being trusted — a folded section hides it, a date lets the next reader judge it. A repo whose
rules cite measurements needs the second.

### Anthropic, skills in Claude Code

[code.claude.com/docs/en/skills](https://code.claude.com/docs/en/skills) · no date on page ·
official docs · summarised

`when_to_use` is concatenated onto `description`. `disable-model-invocation: true` keeps the
description out of context entirely and is for side-effectful workflows such as a deploy.
`user-invocable: false` makes a skill background knowledge only. Other fields: `allowed-tools`,
`context: fork`. Unknown fields are ignored silently.

Budgets and failure modes worth knowing: `description` plus `when_to_use` are truncated to 1536
characters in the skills listing, and the listing's whole budget is 1 % of the context window
(`skillListingBudgetFraction`). Malformed YAML frontmatter loads the skill **without** metadata,
so it stops auto-triggering and nothing reports an error. Angle brackets render escaped — use
`argument-hint` or square brackets. After compaction a skill is only partly restored, so important
instructions belong at the top of `SKILL.md`. A rule that must hold every time belongs in a hook,
not only in a skill.

Tooling: `/skill-doctor` (v2.1.252+) reports skill usage and context cost, for finding skills
nobody uses. `claude plugin validate` (v2.1.233+) checks frontmatter, not behaviour.

**What it changed.** Rule 11's Static layer is now `claude plugin validate` by name. The
1536-character listing truncation is why rule 2's description target stays well under the 1024
hard limit rather than treating 1024 as the goal.

### Anthropic, skill evals

[code.claude.com/docs/en/plugin-evals](https://code.claude.com/docs/en/plugin-evals) · no date ·
official docs · summarised · and
[claude.com/blog](https://claude.com/blog/improving-skill-creator-test-measure-and-refine-agent-skills)
· **2026-03-03** · official blog · summarised

`claude plugin eval` (Claude Code v2.1.269+) runs each case with and without the plugin and
reports `WITH`, `W/OUT` and `Δ` columns, plus an estimated cost at public rates. It exits non-zero
under a threshold (`--threshold`, default 1.0) so it can gate CI. Six grader types, including
`tool_used: Skill` — excluded from the score of both arms — and `llm`. Each case runs 3 times by
default and the case score is the mean. A Δ near zero with `tool_used: Skill` failing means Claude
is not choosing the skill: the description is the problem, not the body.

The 2026-03-03 post adds benchmark mode (success rate, elapsed time, tokens over the eval suite),
parallel runs with a clean context per case, blind A/B comparator agents, and description
optimisation for skills that mis-trigger — reported as improving 5 of 6 public document-creation
skills, with no per-skill figures given.

The sentence from that post worth keeping: "a skill that worked well last month might behave
differently today." And: for a skill that adds a capability, if the base model passes the evals
without it, the skill may have become unnecessary rather than broken.

**What it changed.** Nothing in the contract yet — this repo has no eval suite. It is the next
real gap: rule 11's three tests are run by hand, so a model release can silently make a rule
obsolete and nothing here would notice. `claude plugin eval` with a threshold is the mechanical
version of that check.

### xAI, skills

[grok-build user guide, 08-skills.md](https://raw.githubusercontent.com/xai-org/grok-build/main/crates/codegen/xai-grok-pager/docs/user-guide/08-skills.md)
· date unknown · official docs · summarised

Name: lowercase letters, digits and hyphens, up to 64 characters; the directory name is used if
absent. "Write a specific `description`. It determines when Grok invokes the skill automatically."
No length limit stated for it. **"Grok inlines at most the first 25,000 tokens of a skill body"** —
past that, reference content must go in separate files. No formal body structure; the page asks
for concrete ordered steps and for naming the tools used. "Write one skill per workflow." "Keep
skills focused."

Precedence between install locations: "a higher-priority location overrides a lower one", in the
order local, repo, user. A local skill of the same name replaces a bundled one; a plugin skill
does not replace a native one. On a collision with a built-in command, "Grok keeps **both**
invocable", the skill taking a qualified name.

Nothing on resolving contradictory content inside or between skills.

### xAI, other pages checked

| Page | Useful content |
|---|---|
| [text best practices](https://docs.x.ai/developers/model-capabilities/text/best-practices) | Put static content first, for caching. "state the task, constraints, and output format directly." Nothing on length, redundancy or conflicts |
| [skills, plugins & marketplaces](https://docs.x.ai/build/features/skills-plugins-marketplaces) | Discovery paths. `allowed-tools` "Does not grant or restrict tools." No authoring guidance |

### Anthropic engineering, the 2025 posts

Still the reference for context and tooling, and none of them is from 2026:

| Post | Date | Line worth keeping |
|---|---|---|
| [Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | 2025-09-29 | aim for "the smallest set of high-signal tokens"; avoid both brittle if-else logic and vagueness |
| [Writing tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | 2025-09-11 | "More tools don't always lead to better outcomes" |
| [Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) | 2025-11-04 | — |

---

## 5. Secondary sources, kept for orientation only

No number from this section is used in a rule.

| Source | Date | Why it is here |
|---|---|---|
| [Thoughtworks Technology Radar, "Agent instruction bloat"](https://www.thoughtworks.com/en-gb/radar/techniques/agent-instruction-bloat) | published 2026-04-15, updated 2026-11-04 | Names the pattern, and the "progression testing" idea: re-test whether a rule is still needed after a model release |
| [Codex KB, "The AGENTS.md Bloat Problem"](https://codex.danielvaughan.com/2026/03/27/agents-md-bloat-problem/) | 2026-03-27 | Summarises the ETH paper, but attributes it to attention dilution where the paper describes instruction-following and redundancy. The primary version is used above |
| [Arize, IFScale tracking](https://arize.com/blog/llm-instruction-following-benchmark-2026/) | 2026 | Reports newer models at 100 % at N=500 against the 2025 paper's 68 %. Different dates, not a contradiction, but not primary either |

---

## 6. Looked for and not found

Recorded so the next search starts here instead of repeating this one.

- **No xAI page on prompt bloat, context rot or instruction hierarchy.** The speech-to-speech
  guide is the closest thing, and it is written for voice agents.
- **No precedence rule for layered instruction files** (`AGENTS.md` and friends) in the xAI skills
  docs. A rule of that kind appears in a leaked system prompt mirror; leaked prompts are not cited
  here.
- **No Grok 5 prompting guide.**
- **No Anthropic engineering post on skills in 2026.** Only the 2026-03-03 blog post.
- **No date on Anthropic's skill authoring best practices page**, so it cannot be told whether it
  is 2025 or 2026 guidance.
- **No primary study measuring markdown-skill degradation on production tasks with rule-by-rule
  ablation.** The nearest things are the ETH paper, on context files rather than skills, and
  SkillReducer, whose authors evaluate their own method. Ablation — remove a rule, run a small
  suite, compare — remains something to do here, not something to cite.
- **No marginal price of a rule:** nothing measures one added rule's token cost against its effect.
- **The exact text of xAI's audit meta-prompt via automated fetch** — the tool refused to
  reproduce it past quotation limits. It was read in a browser instead, which is why rule 18 can
  carry it verbatim.
- **Deliberately excluded**: a "Classifier Context Rot" claim about 2–30× more misses past 800K
  tokens, found only in a blog; SkillsBench figures of 61.2 % with skills against 43.0 % without,
  a third-party preprint that was not verified; and the claim that Anthropic removed over 80 % of
  a system prompt with no loss, which is unsourced.

---

## 7. What this changed in the repo

| Change | Driven by |
|---|---|
| Rule 17, never two rules in conflict in one file | WhoWins; Chroma; IFScale; the position disagreement |
| Rule 18, critique pass before the tests | xAI speech-to-speech guide |
| Rule 19, one home per rule | ETH Zurich |
| Rule 20, every rule is PASS/FAIL | Nothing external. It came from auditing this contract and finding rules no two readers would settle the same way |
| Five contradictions repaired in five skills, by editing the earlier line | WhoWins |
| `AGENTS.md`, 118 lines to 64 | ETH Zurich |
| Per-skill descriptions removed from the README | ETH Zurich, and four of eight counts in it having already drifted |
| Rule 3's naming prescription downgraded to a suggestion | Nothing external. The prefix is a local convention and does not belong in a contract other people read |

The measurements above are dated on purpose (rule 8). A threshold calibrated on a model
generation that no longer exists fires on nothing, and the mechanism usually outlives the rate —
where a source gives both, this file says which is which.
