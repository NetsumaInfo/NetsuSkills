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

- <Constraint that applies to the whole theme.>
- <Constraint that applies to the whole theme.>

---

**Authoring notes — delete before shipping**

- Keep this parent under 100 lines. It routes; it does not teach.
- Every child listed above must exist, and every child that exists must be listed here.
- The `description` must cover the union of all children's triggers, or the skill never fires.
- Each child is a full procedure held to the same bar as an atomic skill: imperative voice,
  a concrete artifact, an anti-patterns section.
