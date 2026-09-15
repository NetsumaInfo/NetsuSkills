# Règles NetsuSkills

Les règles qu'une skill doit respecter pour entrer dans ce repo.
Si une règle est violée, la skill ne merge pas. Pas d'exception "on corrigera plus tard".

---

## 0. Le principe de base

> Une skill n'est pas de la documentation. C'est une **procédure** que Claude exécute.

La plupart des skills trouvées sur internet échouent parce qu'elles sont des articles de blog
déguisés : du contexte, des généralités, du "you are an expert in X". Claude sait déjà.
Ce qu'il ne sait pas, c'est **ta** manière de faire, **tes** contraintes, **tes** étapes exactes.

Test à appliquer à chaque paragraphe écrit : *est-ce que Claude ferait autrement sans cette phrase ?*
Si non → supprimer.

---

## 1. Une skill = un job

- Un seul objectif, un seul moment de déclenchement.
- Si la description contient " et aussi ", c'est deux skills.
- Nom en `kebab-case`, ≤ 64 caractères, sans préfixe marketing (`netsu-`, `super-`, `ultra-`).
- Le nom dit l'action ou le domaine, pas la qualité : `review-react-perf`, pas `amazing-react-helper`.

## 2. La `description` est la seule chose toujours chargée

C'est elle — et rien d'autre — qui décide si la skill se déclenche. Donc :

- Rédigée à la **3e personne** : "Use when the user…", jamais "I will help you…".
- Contient les **mots littéraux** que l'utilisateur taperait vraiment.
  Pas de synonymes savants si l'utilisateur dit "commit" et pas "version control operation".
- Contient explicitement le **quand NE PAS** l'utiliser, dès qu'un recouvrement existe avec une autre skill.
- ≤ 1024 caractères. Dense, pas de phrase d'ambiance.
- Elle doit passer ce test : lue seule, hors contexte, permet-elle de trancher oui/non ?

## 3. Le corps est court et progressif

- `SKILL.md` ≤ ~500 lignes. Au-delà, on découpe.
- Détails lourds → `references/*.md`, chargés seulement quand la skill en a besoin.
- Code réutilisable → `scripts/`, pas collé dans le markdown.
- Fichiers à copier → `assets/`.
- Structure imposée :

```
skills/<nom-de-la-skill>/
├── SKILL.md          # obligatoire
├── references/       # optionnel — détails chargés à la demande
├── scripts/          # optionnel — code exécutable
└── assets/           # optionnel — templates, fichiers à copier
```

## 4. Voix impérative, zéro remplissage

- Interdit : "You are an expert…", "Certainly!", "It's important to note that…", "Best practices include…".
- Autorisé : des ordres. "Run X. If Y, do Z. Never do W."
- Pas de tableau de généralités. Des checklists actionnables ou des commandes exactes.

## 5. Concret > abstrait

Chaque skill doit contenir au moins un de :
- une commande exacte à exécuter,
- un template de fichier prêt à copier,
- une checklist de vérification,
- un exemple avant/après.

Une skill qui ne contient que des conseils est refusée.

## 6. Section anti-patterns obligatoire

Dire quoi faire ne suffit pas : les modèles dérivent vers le défaut. Chaque skill liste
explicitement les pièges, sous forme `❌ ce qui arrive par défaut` → `✅ ce qu'on veut`.

## 7. Portable par défaut

- Aucune dépendance à un chemin machine (`S:\projet_app\…`), à une clé, à un MCP,
  **sauf** si c'est déclaré en tête de skill dans une section `Requirements`.
- Si la skill pilote un outil externe (Blender, After Effects, Resolve, Photoshop),
  elle vérifie la disponibilité avant d'agir et échoue proprement.

## 8. Testée avant merge

Avant de committer une skill, vérifier les trois :
1. **Déclenchement** — une phrase naturelle de l'utilisateur la déclenche bien.
2. **Non-déclenchement** — une phrase proche mais hors sujet ne la déclenche pas.
3. **Exécution** — suivie littéralement, elle produit le bon résultat sur un cas réel.

Le résultat de ce test va dans `docs/JOURNAL.md`.

## 9. Anglais pour le contenu, français pour nos docs

- `SKILL.md`, `references/`, `scripts/` → **anglais** (fiabilité du déclenchement + partageable).
- `docs/`, notes de travail, `.private/` → **français**.
- `README.md` → anglais (le repo est public).

## 10. Git

- Commits en anglais, impératif, préfixés par le scope :
  `add(skill): design-critique`, `fix(skill): commit trigger too broad`, `docs: rules v2`.
- **Jamais** de trailer `Co-Authored-By`. Netsuma est le seul contributeur affiché.
- Un commit = une skill ou un changement cohérent. Pas de commit fourre-tout.
- `.private/` n'est jamais commité. Vérifier avant chaque push.

---

## Checklist de merge

- [ ] Un seul job, nom clair en kebab-case
- [ ] Description 3e personne, mots-clés réels, "quand ne pas utiliser" présent
- [ ] SKILL.md ≤ 500 lignes, détails déportés en `references/`
- [ ] Voix impérative, zéro phrase de remplissage
- [ ] Au moins un élément concret (commande / template / checklist / avant-après)
- [ ] Section anti-patterns présente
- [ ] Aucune dépendance machine non déclarée
- [ ] Les 3 tests passés et notés dans `docs/JOURNAL.md`
- [ ] Anglais dans la skill, commit sans `Co-Authored-By`
