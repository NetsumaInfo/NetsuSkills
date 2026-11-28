---
name: skill-name-in-kebab-case
description: Use when the user <literal words they would actually type>. Covers <scope A>, <scope B>, <scope C>. Do NOT use for <adjacent thing that belongs to another skill>.
---

# <Skill Name>

<One sentence: what this produces. No preamble, no role-play.>

## Requirements

<Delete this section if none.> Tools, MCP servers, or env this skill needs. Check availability
before acting; fail loudly if missing.

## Procedure

1. <Imperative step. Exact command or exact decision.>
2. <Next step.>
3. <Next step.>

## Rules

<Delete this line if the skill has no competing authorities. Otherwise state the order of
precedence once, here, and have every later mention point back to it instead of restating it:>

**Order of precedence.** <A> beats <B>, and <B> beats <C>.

- <Hard constraint. "Never X." / "Always Y.">
- <Hard constraint.>

## Anti-patterns

| ❌ Default behavior | ✅ What we want |
|---|---|
| <what the model does on its own> | <what this skill enforces> |

## Checklist

- [ ] <verifiable outcome>
- [ ] <verifiable outcome>

## References

- `references/<topic>.md` — <when to load it>

---

**Authoring notes — delete before shipping**

The full contract is `docs/SKILL-RULES.md`; nothing here replaces reading it. These are the four
that a template cannot scaffold for you:

- **One order of precedence, stated once** (rule 17). Two rules that cannot both be followed is a
  defect, not a nuance — and you cannot fix it by putting the correction lower down, because the
  earlier line is the one that wins. Edit the earlier line.
- **Adding to this file later is where conflicts get in** (rule 17). Read the whole file before
  you change a section of it.
- **Run the critique pass, then the three tests, then commit** (rules 18, 11, 16). In that order:
  closing a critique issue changes the text the tests would have run on.
- **Date every number you cite about model behaviour**, with what it was measured on (rule 8). If
  you cannot date it, drop it.
