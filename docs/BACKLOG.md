# Backlog — skills à construire

Liste de travail. Rien ici n'est encore écrit : on choisit, on tranche, **puis** on code.

## Méthode

Pour chaque skill candidate, on répond à 3 questions avant d'écrire une ligne :

1. **Quel moment précis ?** — la phrase exacte que je taperais pour la déclencher.
2. **Qu'est-ce que Claude fait de travers sans elle ?** — si rien, on ne l'écrit pas.
3. **Qu'est-ce qu'elle remplace ?** — quelle(s) skill(s) tierce(s) on désinstalle en échange.

Une skill qui ne répond pas aux 3 reste dans "Idées", pas dans "À faire".

---

## État des lieux — machine de Netsuma

180 skills installées dans `~/.claude/skills`. Redondance massive :

| Cluster | Nombre installé | Problème |
|---|---|---|
| Design / UI / UX | ~21 | `frontend-design`, `ui-ux-designer`, `ui-ux-pro-max`, `minimalist-ui`, `sleek-design-mobile-apps`, `stitch-design`, `huashu-design`, `make-interfaces-feel-better`, `delight`, `use-style`… toutes disent la même chose, aucune ne déclenche au bon moment |
| Git / workflow / review | ~22 | 3 `commit`, 2 `merge`, 2 `oneshot`, 2 `ultrathink`, 3 skills de review qui se marchent dessus |
| Docs / meta (README, skills, prompts, mémoire) | ~20 | 3 générateurs de README, 3 créateurs de prompts, 3 gestionnaires de skills |
| TanStack | 15 | une par lib — granularité correcte, mais qualité à vérifier |
| Next.js | 5 | **stack abandonnée** → à désinstaller, pas à réécrire |
| Convex | 6 | **backend principal confirmé** → à auditer puis custom |

Conclusion : le gain immédiat n'est pas d'ajouter des skills, c'est d'en **remplacer 20 par 1**
qui déclenche correctement.

---


## Stack de référence (confirmée)

Toute skill technique de ce repo vise cette stack. Rien d'autre.

| Domaine | Ce qu'on vise | Ce qu'on ignore |
|---|---|---|
| Web full-stack | **TanStack Start** | Next.js (abandonné) |
| Web SPA | **Vite + React + TypeScript** | — |
| Desktop | **Tauri v2** | Electron |
| Mobile | **React Native** | — |
| Backend / data | **Convex** (backend principal) | — |
| Autres frameworks | à préciser au cas par cas | — |

Conséquence directe : les 5 skills `nextjs-*` installées sont à désinstaller, pas à réécrire.
Les 15 `tanstack-*` et les 6 `convex-*` sont à auditer — on garde ce qui déclenche bien,
on réécrit le reste.

---

## Découverte critique — 68 % des skills installées ne peuvent pas se déclencher

Mesure faite sur la machine le 15/09/2026 :

| Mesure | Valeur |
|---|---|
| Dossiers dans `~/.claude/skills` | 180 (dont 170 symlinks) |
| `SKILL.md` atteignables | 257 |
| Avec `disable-model-invocation: true` | **175 (68 %)** |
| Réellement auto-sélectionnables par l'agent | 82 |

`disable-model-invocation: true` interdit à l'agent de choisir la skill tout seul : elle ne
part que si on l'invoque à la main. C'est **la** cause de « je ne les utilise pas » et de
« ça me saoule de retenir tous les skills ». Ce n'est pas un problème de pertinence, c'est un
interrupteur coupé.

Conséquence sur la priorité : avant d'écrire quoi que ce soit, un audit qui liste les skills
coupées et qui tranche skill par skill (rallumer / désinstaller) rapporte plus que n'importe
quelle nouvelle skill. Voir `skill-audit` en vague 6.

Second constat, sur la qualité : `copy-editing` ouvre sur « You are an expert copy editor
specializing in… ». C'est exactement le remplissage que la règle 4 interdit. Bon cas d'école
à citer dans les anti-patterns.

---

## Vague 1 — le socle

**Statut : documentée, non démarrée.** On écrit quand Netsuma donne le signal.

| # | Skill | Déclenchement | Remplace |
|---|---|---|---|
| 1 | `design-review` | "critique cette UI", "c'est moche", "améliore le design" | ~10 skills design génériques |
| 2 | `readme` | "fais le README", "refais le README" | `create-readme`, `readme-blueprint-generator`, `readme-i18n` |
| 3 | `commit` | "commit", "commit et push" | `commit`, `aiblueprint-git-commit`, `caveman-commit` |
| 4 | `code-review` | "relis mon code", "review la PR" | `requesting-/receiving-code-review`, `thermo-nuclear-…`, `caveman-review` |

Point de vigilance sur `code-review` : `/code-review` existe déjà en natif. La skill ne se
justifie que si elle encode des critères propres à Netsuma que le natif ne connaît pas.
À trancher au moment de l'écrire, pas avant.

Note : `readme` et `design-review` recoupent la vague 5 (anti-slop). Décider si l'anti-slop
est une skill à part ou une règle intégrée dans chacune — voir question ouverte n°2.

## Vague 2 — stack web

| # | Skill | Périmètre |
|---|---|---|
| 5 | `tanstack-start-setup` | démarrage d'un projet TanStack Start selon les conventions maison |
| 6 | `convex-schema` | modélisation + migrations Convex, à cadrer après audit des 6 skills existantes |
| 7 | `tauri-setup` | app desktop Tauri v2 |
| 8 | `rn-setup` | app React Native |

Préalable commun : auditer les 15 `tanstack-*` et 6 `convex-*`. Peut-être que 3 sont bonnes
et qu'il n'y a rien à refaire.

## Vague 3 — outils créatifs

Aucune skill installée ne pilote ces outils alors que les MCP sont connectés. Territoire vierge.
Règle : une skill par **tâche répétitive précise**, jamais "piloter Blender" en général.

| # | Outil | MCP | À cadrer |
|---|---|---|---|
| 9 | DaVinci Resolve | connecté (scripting, LUTs, DCTL) | cœur de NetsuRush — la plus légitime des trois |
| 10 | After Effects | connecté (comps, effets, keyframes, expressions) | NetsuRush fait déjà un pont vers AE |
| 11 | Blender | connecté (bpy, screenshots, API docs) | quel usage récurrent ? |

Photoshop : MCP connecté, hors périmètre pour l'instant.

## Vague 4 — NetsuRush

`NetsumaInfo/NetsuRush` — *footage-review hub for DaVinci Resolve Studio : preview rushes,
AI shot detection, lossless cuts, frame-accurate timelines. Bridges to Premiere Pro and
After Effects.* TypeScript, public.

Recoupe directement la vague 3 : les skills Resolve et AE servent d'abord ce projet.

| # | Skill envisagée | Note |
|---|---|---|
| 12 | `netsurush-conventions` | conventions du projet, à extraire du code existant |
| 13 | `resolve-scripting` | scripting Resolve récurrent pour NetsuRush |

À trancher : publiques ici, ou privées dans `NetsuRush/.claude/skills/` ? Une skill de
conventions projet n'a de sens pour personne d'autre — probablement dans le projet.

## Vague 5 — anti-slop (thème prioritaire de Netsuma)

Objectif déclaré : **retirer le slop IA**. Trop d'informations pour rien, mots que personne
n'emploie au quotidien, commentaires qui paraphrasent le code, README gonflés.

Existant installé à disséquer avant d'écrire :

| Skill installée | Ce qu'elle fait | Verdict provisoire |
|---|---|---|
| `deslop` | retire le slop du diff de la branche | bonne idée, périmètre trop étroit (code uniquement) |
| `uncodixfy` | évite les patterns UI génériques IA | prévention UI, pas du nettoyage |
| `copy-editing` | édition de copy marketing | ironique : elle est elle-même pleine de slop |
| `writing-shape` | met en forme de la matière brute | orthogonal |

| # | Skill envisagée | Déclenchement | Périmètre |
|---|---|---|---|
| 14 | `deslop-prose` | "enlève le slop", "c'est trop verbeux", "allège ce README" | README, docs, textes d'UI. Coupe le remplissage, bannit le vocabulaire qu'on n'emploie jamais à l'oral |
| 15 | `deslop-code` | "nettoie les commentaires", "y'a trop de commentaires" | commentaires qui paraphrasent le code, gardes défensives inutiles, noms pompeux |
| 16 | `no-slop` (préventive) | aucune — règle chargée en amont de l'écriture | empêche le slop d'apparaître plutôt que de le retirer après |

Point de conception à trancher : **retirer après** (14, 15) ou **empêcher avant** (16) ?
Le préventif ne se déclenche pas de façon fiable ; le curatif demande une passe explicite.
Probablement les deux, mais 14/15 d'abord car testables.

Matière nécessaire avant d'écrire : une **liste noire de vocabulaire** et une collection
d'exemples avant/après tirés de vrais fichiers. À accumuler dans `.private/` au fil de l'eau.

## Vague 6 — méta : routeur et audit

Demande de Netsuma : une skill « chapeau » par thème, qui laisse l'agent choisir la bonne
sous-procédure, pour ne plus avoir à retenir les noms.

**Précision technique avant d'écrire quoi que ce soit** : une skill ne peut pas en appeler une
autre ni forcer son chargement. Un « routeur » qui distribuerait vers d'autres skills
installées ne marchera pas. Ce qui marche :

1. **La skill-parapluie** — une seule skill par thème, dont le `SKILL.md` est un index court
   qui renvoie vers `references/<cas>.md` chargés à la demande. Un seul nom à retenir par
   thème, l'agent choisit le bon cas. C'est le vrai remède au problème.
2. **Des descriptions correctes** — l'agent choisit déjà tout seul si la `description` contient
   les bons mots et si `disable-model-invocation` n'est pas à `true`. 68 % des skills installées
   échouent sur ce second point.

Autrement dit : le besoin est réel, mais la réponse est « moins de skills, mieux décrites »,
pas « une skill de plus qui aiguille ».

| # | Skill envisagée | Rôle |
|---|---|---|
| 17 | `skill-audit` | lister les skills installées, repérer `disable-model-invocation: true`, les doublons, les descriptions qui ne déclenchent jamais. Sortie : un tableau de décisions |
| 18 | `cleanup-skills` | désinstallation de masse (les 5 `nextjs-*` en premier client) |

`skill-audit` est probablement la première skill à écrire de tout le repo : elle se teste sur
un cas réel immédiat (les 180 dossiers de la machine) et elle produit la matière des autres vagues.

---

## Distribution

Trois canaux, tous couverts par la structure actuelle :

| Canal | Commande | État |
|---|---|---|
| Plugin Claude Code | `/plugin marketplace add NetsumaInfo/NetsuSkills` | prêt |
| Copie manuelle | `cp -r skills/<nom> ~/.claude/skills/` | prêt |
| [skills.sh](https://www.skills.sh/) | `npx skills add NetsumaInfo/NetsuSkills` | **compatible par construction** |

skills.sh (projet `vercel-labs/skills`) scanne `skills/<nom>/SKILL.md` jusqu'à trois niveaux
et n'exige que `name` + `description` en frontmatter — exactement notre layout et notre règle 2.
Aucun manifeste supplémentaire à écrire.

Point non résolu : le mécanisme d'indexation du site n'est pas documenté publiquement
(question posée dans `vercel-labs/skills`, issue 880, sans réponse). Il faut au moins une skill
publiée pour tester si l'indexation est automatique.

À noter : `metadata.internal: true` masque une skill de la découverte skills.sh — utile si une
skill NetsuRush reste dans le repo sans être proposée à tout le monde.

---

## Idées (pas encore qualifiées)

- `design-system` — tokens, échelles, thèmes
- `debug` — remplacerait `systematic-debugging`
- `prd` / `tasks` — à voir si les versions existantes suffisent

## Questions ouvertes

1. **Par quoi on démarre ?** `skill-audit` (vague 6) rapporte plus vite que la vague 1 : il se
   teste sur les 180 dossiers de la machine et il produit la matière du reste. À valider.
2. **Anti-slop : skill séparée ou règle intégrée ?** Si `readme` intègre déjà l'anti-slop,
   `deslop-prose` fait double emploi. Trancher avant d'écrire l'une des deux.
3. **Les 175 skills coupées** : on les rallume au cas par cas, ou on désinstalle en masse et on
   ne garde que ce qu'on réécrit ici ?
4. **Blender** : quelle tâche répétitive précise ? Resolve et AE sont justifiés par NetsuRush,
   Blender pas encore.
5. **Skills NetsuRush** : publiques ici, ou privées dans le repo du projet ?
