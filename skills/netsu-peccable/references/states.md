# States

What each state shows, what it says, what it never does, and how assistive technology hears it.
Loaded by `references/components.md`, `references/copy-app.md` and `references/review-ui.md`.
French examples use *vous*; follow `## Voice`. Nouns come from `### Words we use`.

Every component that holds data or runs an action gets each state that can happen to it. A state
the design forgot ships as a blank area or a frozen button.

## Empty

Show the reason and the next action, in the place the content would be. Each kind has its own
message:

| Kind | FR | EN |
|---|---|---|
| First use | Aucun rush pour l'instant. Glissez un dossier pour commencer. [Importer des rushs] | No clips yet. Drop a folder to start. [Import clips] |
| No results | Aucun rush ne correspond à « interview ». [Effacer la recherche] | No clips match "interview". [Clear search] |
| Cleared by the user | Tous les rushs sont triés. | All clips sorted. |
| No permission | Seule l'équipe Montage voit ce dossier. [Demander l'accès] | Only the Editing team can see this folder. [Request access] |
| Failed to load | Impossible de charger les rushs. Vérifiez la connexion, puis réessayez. [Réessayer] | Couldn't load clips. Check your connection, then try again. [Try again] |

- **Never**: one generic message for all five; the first-use screen while a filter is on;
  « Rien à voir ici ! »; an illustration with no action; an empty table with only its headers.
- **A11y**: the message is real text, not text inside an image. After a search, announce the
  count in a `role="status"` region.

## Loading

Thresholds from Jakob Nielsen, *Response Times: The 3 Important Limits* (NN/g, 1993, updated
2014): 0.1 s feels instant, 1 s keeps the flow of thought, 10 s is the limit of attention.
Katie Sherwin, *Progress Indicators* (NN/g, 2014-10-26): a looping indicator under 1 s
distracts; use it for 2 to 10 s, and a percent-done bar past 10 s.

| Expected wait | Show |
|---|---|
| Under 0.1 s | Nothing |
| 0.1 to 1 s | Nothing for the first 300 ms, then the loading state. Once shown, keep it at least 500 ms so it does not flicker. Both numbers are project defaults, not measured limits |
| 1 to 10 s | Content: a skeleton with the final layout's size. Action: a spinner inside the button, which keeps its width and its label |
| Over 10 s | A progress bar with a percentage or a step, a way to cancel, and the rest of the app usable. See Long operation |

| Where | FR | EN |
|---|---|---|
| Button, while running | [spinner] Exporter | [spinner] Export |
| Operation line | Export de 3 rushs… | Exporting 3 clips… |
| Long job | Export : étape 2 sur 3, encodage. 45 % | Exporting: step 2 of 3, encoding. 45% |

- **Never**: « Chargement… » alone when the operation is known; a bar that jumps back or waits
  at 99%; a full-page spinner for one panel; a button that shrinks to a spinner; content that
  shifts when it arrives.
- **A11y**: `aria-busy="true"` on the region being replaced. A running button gets
  `aria-disabled="true"`, keeps its name and keeps focus. Progress uses `<progress>` or
  `role="progressbar"` with `aria-valuenow` and a readable `aria-valuetext`. Announce the end in
  `role="status"`.

## Error

| Scope | Where it goes | FR | EN |
|---|---|---|---|
| Field | Under the field | Le nom du projet ne peut pas dépasser 60 caractères (72 actuellement). | Project name can't be longer than 60 characters (it has 72). |
| Form | A summary at the top, one link per field, focus moved to it on submit | 2 champs à corriger | 2 fields to fix |
| Section | Inside the panel that failed; the rest keeps working | Impossible de charger l'historique. [Réessayer] | Couldn't load history. [Try again] |
| Page | Replaces the page: what happened, what is safe, the way out | Cette page ne s'est pas ouverte. Vos projets ne sont pas touchés. [Recharger] [Retour aux projets] | This page didn't open. Your projects are safe. [Reload] [Back to projects] |
| Background | A toast that stays until dismissed, plus a status marker on the item | 2 rushs n'ont pas été synchronisés. [Voir] | 2 clips didn't sync. [View] |

- **Prevent**: the right `autocomplete` token on personal fields (WCAG 2.2 SC 1.3.5),
  `spellcheck="false"` on emails and codes, spaces trimmed before validating, keystrokes never
  filtered away.
- **Say**: what failed, why when known, what to do now. Same words inline and in the summary
  (GOV.UK Design System, *Error message*). An error code goes in a details line, for support.
- **Never**: « Une erreur est survenue » alone; « Oups »; color as the only signal; a cleared
  form; an error toast that fades out; a failure the user must fix shown only in a toast.
- **A11y**: field: `aria-invalid="true"` and `aria-describedby` pointing at the message. Summary:
  `role="alert"`, `tabindex="-1"`, focused on submit, each link jumps to its field. Background
  and page errors: `role="alert"`. Do not make every inline error an alert when the summary
  already announces them.

## Success

- **Show**: often the change itself is enough (the row appears, the toggle flips, "Enregistré"
  next to the field). A toast when the result is off screen or remote. A toast with Undo when
  the action was destructive and can be reversed.
- **Optimistic**: show the result at once; if the server refuses, put the old value back where it
  was, with the reason next to it. Never for a payment, or for a deletion without Undo.
- **Say**: the thing and where it went.

| Case | FR | EN |
|---|---|---|
| Inline | Enregistré | Saved |
| Remote result | Timeline exportée dans Montage/Export | Timeline exported to Editing/Export |
| Reversible deletion | 3 rushs supprimés. [Annuler] | 3 clips deleted. [Undo] |

- **Never**: « Succès ! », « avec succès », "successfully"; a modal for routine success;
  confetti on a save.
- **A11y**: a `role="status"` region (`aria-live="polite"`) that is in the page, empty, before
  its text changes: a region added together with its message is often not announced (MDN, *ARIA
  live regions*, read 2026-09-17; scan `late-live-region`). Focus stays where it was. A toast
  with an action never dismisses on a timer: it stays until dismissed, and the action is
  reachable by keyboard.

## Disabled

- **Show**: the reason, always, as helper text beside the control. A tooltip alone fails for
  keyboard users: a native `disabled` button cannot take focus, so its tooltip never opens.
- **Prefer**: an enabled control that answers with the validation message on click. A Submit
  that stays grey until the form is valid leaves the user hunting for the problem.

| FR | EN |
|---|---|
| Sélectionnez au moins un rush pour exporter. | Select at least one clip to export. |
| Disponible une fois l'import terminé. | Available once the import finishes. |

- **Never**: a grey control with no reason; a label so faint it cannot be read.
- **A11y**: `disabled` removes the control from the tab order and from form submission. Use it
  when the control truly does not apply. `aria-disabled="true"` keeps it focusable and
  announced as unavailable; the handler must then block the action itself. Link the reason with
  `aria-describedby`.

## Offline

- **Show**: a persistent banner, not a toast. What still works, what is waiting, and a retry
  that happens by itself when the network comes back.
- **Detect**: `navigator.onLine === false` means offline; `true` does not prove the server is
  reachable. Confirm with a failed request, and word a server outage differently.

| Case | FR | EN |
|---|---|---|
| Device offline | Hors ligne. Vos modifications restent sur cet appareil et partiront au retour du réseau. | You're offline. Changes stay on this device and sync when you're back online. |
| Server unreachable | Le serveur ne répond pas. Nouvel essai dans 30 s. [Réessayer] | Can't reach the server. Retrying in 30 s. [Try again] |
| Back online | Connexion rétablie. 3 modifications synchronisées. | Back online. 3 changes synced. |

- **Never**: a blank page; one error per failed request; lost typing; "No internet
  connection" when the server is the problem.
- **A11y**: announce the banner change in `role="status"`; text next to any icon.

## Partial success

- **Show**: how many worked out of how many, what failed, and a way to see or retry the rest.
  It stays until dismissed.
- **Say**: « 12 rushs exportés sur 14. 2 fichiers introuvables. [Voir] » /
  "Exported 12 of 14 clips. 2 files not found. [View]". The detail view lists the failed items
  with their reason and offers « Réessayer les 2 » / "Retry 2".
- **Never**: "Export complete" when 2 failed; "Export failed" when 12 worked; 14 lines in a
  toast.
- **A11y**: `role="alert"`, because part of it needs action.

## Stale data

- **Show**: the age of the data next to it, and a refresh action. Say so when data is served
  from cache.
- **Say**: « Mis à jour il y a 5 min. [Actualiser] » / "Updated 5 min ago. [Refresh]". Build
  the age with `Intl.RelativeTimeFormat` and keep the exact time in `<time datetime>`.
- **Never**: cached data presented as live; "Last sync: 2026-09-16T08:32:11Z".
- **A11y**: announce "Updated" once after a refresh, in `role="status"`. Never tick the
  relative time inside a live region.

## Permission denied

Two kinds: the account lacks a role, or the operating system or browser refused access (files,
camera, notifications, an extension permission).

| Kind | FR | EN |
|---|---|---|
| Account role | Seuls les administrateurs peuvent supprimer ce projet. Demandez à {owner}. | Only admins can delete this project. Ask {owner}. |
| System, asked at the moment of use | Autorisez l'accès aux fichiers pour importer depuis la carte SD. [Autoriser] | Allow file access to import from the SD card. [Allow] |
| System, refused | L'accès aux fichiers est bloqué. Activez-le dans les réglages du système. [Ouvrir les réglages] | File access is blocked. Turn it on in system settings. [Open settings] |

- **Ask** at the moment the feature needs it, with one line of why, never all at first launch.
  A Chrome extension requests optional permissions with `chrome.permissions.request` inside a
  user gesture.
- **Never**: « Accès refusé », "403 Forbidden" alone; a feature that disappears without a word.
- **A11y**: the reason in text, not only a lock icon.

## Long or background operation

- **Show**: a step or a percentage, the time left only when it is measured, a cancel action,
  and the rest of the app usable. When the user moves on, keep a small indicator (status bar,
  tray, badge) and notify at the end if the window may be in the background.
- **Say**: « Encodage de 2 rushs sur 5. Vous pouvez continuer à travailler. » / "Encoding 2 of 5
  clips. You can keep working." At the end: « Export terminé : Montage_v3.mp4 » / "Export
  finished: Edit_v3.mp4".
- **Cancel**: confirm only if work is lost: « Arrêter l'export ? Les 2 rushs déjà encodés sont
  conservés. » [Arrêter l'export] [Continuer].
- **Never**: a modal that locks the app for minutes; a job lost when the window closes without a
  warning.
- **A11y**: `role="progressbar"` with `aria-valuetext="2 rushs sur 5"`. Announce milestones and
  the end in `role="status"`, not every percent.

## Other failures

| Case | Show | EN |
|---|---|---|
| Session expired | Sign in again in place; everything typed is kept | Your session ended. Sign in to keep going; your changes are kept. |
| Not found | What is missing, and a link back to the list | This project doesn't exist or was deleted. [Back to projects] |
| Rate limited | The real wait, from `Retry-After`, and an automatic retry | Too many requests. Trying again in 20 s. |
| Edit conflict | Both versions; the user picks. Never overwrite silently | Someone changed this project while you were editing. [See both versions] |

French follows the same shape and `## Voice`: « Ce projet n'existe pas ou a été supprimé. »

## First use and hints

A whole first-run flow is `references/onboarding.md`.

- Offer a sample or a template next to the first-use empty state when the product has one.
- A hint shows once, next to what it explains, and stays dismissed. A tour runs only when asked.
- **Never**: a tour that blocks the first screen; « Vous êtes prêt ! »; the same hint on every
  visit.

## Confirmation dialog

Confirm only what cannot be undone. Everything else runs at once and offers Undo.

```text
Title    <Verb> <object>?          Supprimer le projet « Montage » ?     Delete project "Edit"?
Body     <one line: consequence>   Ses notes et ses exports sont effacés.  Its notes and exports are erased.
Primary  <verb> [object]           Supprimer le projet                  Delete project
Cancel   Annuler / Cancel          Annuler                              Cancel
```

- The title names the action and the object. The primary button repeats the verb.
- Irreversible and large (a project, an account): the user types the object's name to confirm.
- **Never**: « Êtes-vous sûr ? », "Are you sure?"; Oui / Non, Yes / No, OK; a confirmation for
  a reversible action.
- **A11y**: `role="alertdialog"` with `aria-labelledby` on the title and `aria-describedby` on the
  body. Escape cancels. For a destructive action, initial focus goes to the least destructive
  button (WAI-ARIA Authoring Practices, *Dialog (Modal) pattern*, read 2026-09-16). Focus
  returns to the trigger on close.

A timed toast pauses while hovered or focused (WCAG 2.2 SC 2.2.1). A dialog or drawer whose body
scrolls keeps its title and action row in place, with `overscroll-behavior: contain`.

## Toast or inline?

| Situation | Use |
|---|---|
| The result is visible where the user is looking | Inline, no toast |
| The result is off screen or remote (sent, synced, written to disk) | Toast |
| Destructive and reversible | Toast with Undo |
| Irreversible | Confirmation dialog before, inline result after |
| A field is wrong | Inline under the field, plus the summary on submit |
| A background task failed | Toast that stays, plus a marker on the item |
| The user must fix something to continue | Inline, never only a toast |
| A lasting condition (offline, read-only, trial ended) | Banner |

## Anti-patterns

| ❌ Default behaviour | ✅ What we want |
|---|---|
| Only the happy path is built | Every state in this file that can happen to the component |
| A spinner on every fetch, even a 50 ms one | Nothing under 300 ms, a skeleton for content |
| The button turns into a bare spinner and shrinks | Same width, same label, spinner inside |
| "Something went wrong" | What failed, why, what to do |
| A grey button with no reason | The reason in text beside it |
| A success toast for a change already on screen | The change itself |
| "Are you sure?" before every deletion | Delete at once, offer Undo |
| "Export complete" when 2 of 14 failed | "Exported 12 of 14 clips. 2 files not found." |
