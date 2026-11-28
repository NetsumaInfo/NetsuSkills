---
name: theme-name
description: Use when the user <literal words for case A>, <literal words for case B>, or <literal words for case C>. Covers <child 1>, <child 2>, <child 3>. Do NOT use for <adjacent theme owned by another skill>.
---

# <Theme>

<One sentence: what this theme covers.>

This is an index. Pick the case below, load that file, follow it. Do not work from this page
alone — it deliberately holds no procedure.

## Pick the case

| The user wants to… | Load |
|---|---|
| <review or critique something existing> | `references/<child-1>.md` |
| <build something new from scratch> | `references/<child-2>.md` |
| <fix or migrate an existing thing> | `references/<child-3>.md` |

If none fits, say so and ask — do not improvise from this file.

## Requirements

<Delete if none.> Anything every child needs: tools, MCP servers, files that must exist.

## Rules that hold across every case

<State the theme's order of precedence once, here, if it has competing authorities. Children
point back to it; none of them restates it in its own words.>

- <Constraint that applies to the whole theme.>
- <Constraint that applies to the whole theme.>

## The report

<Delete if this theme produces no findings. Otherwise the output contract lives here, in the
parent, and nowhere else: the severity scale with the literal conditions for each level, the
ranking, the cap as a number, and the table shape. Two children that each define a scale
disagree the moment both load.>

---

**Authoring notes — delete before shipping**

The full contract is `docs/SKILL-RULES.md`. What is specific to this shape:

- Keep this parent at 100 lines or fewer (rule 2). It routes; it does not teach.
- Every child listed above must exist, and every child that exists must be listed here —
  including the resources, which are named outside the routing table.
- Say which kind each child is (rule 1). An **entry point** is a case the user can arrive at
  directly: a full procedure, same bar as an atomic skill, with its own anti-patterns section. A
  **resource** is shared detail a procedure pulls in mid-run: detail only, no steps, no
  anti-patterns section, never loaded on its own.
- The parent owns the output contract. Children own principles and checks, nothing else.
- The `description` must cover the union of all children's triggers, or the skill never fires.
- A skill cannot call another skill, which is the whole reason this shape exists: one name to
  remember per theme, and the agent picks the child.
- Rules 17, 18 and 11, in the authoring notes of `SKILL.md`, apply here too — and to every child.
