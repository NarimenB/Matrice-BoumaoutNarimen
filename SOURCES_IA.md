# Sources et usages de l'IA

Outil utilisé : **Claude** (Anthropic), en conversation, pendant le rattrapage.

## Déclaration

J'ai écrit moi-même la plupart des composants et les tests. J'ai utilisé Claude pour la structure de la documentation, pour relire mes tests, pour compléter la modale et le fichier de données, pour corriger les erreurs, et pour deux parties que je n'avais pas réussi à écrire : la fonction asynchrone `loadSessions` (`loadSessions.js`) et l'effet de chargement de `useSessions.js`. Je précise ci-dessous, fichier par fichier, ce qui vient de moi et ce qui vient de l'IA.

## Détail par partie

| Partie | Fichiers | Ce que j'ai fait | Ce que Claude a fait |
| --- | --- | --- | --- |
| Composants | `StatusBadge.jsx`, `FiltersBar.jsx`, `SessionCard.jsx`, `SessionList.jsx` | Écrits par moi | Corrections ponctuelles après erreurs ou relectures |
| Modale | `SessionDetail.jsx` | Début écrit par moi | Suite : gestion du focus (piège, Echap, retour du focus) |
| Données | `src/data/sessions.js` | Contenu fourni par le sujet ; moitié retapée par moi | L'autre moitié, pour éviter une saisie répétitive |
| Chargement et filtre | `src/api/loadSessions.js` | Le reste du fichier, dont le filtre ; exécution, tests, preuve rouge puis verte | La fonction asynchrone `loadSessions` (`Promise` et `setTimeout`), que je n'avais pas réussi à écrire, avec son explication |
| Hook | `src/hooks/useSessions.js` | Le reste du hook ; exécution, tests, preuve rouge puis verte | La partie `useEffect`, que je n'avais pas réussi à écrire, avec son explication (dont le compteur `requestIdRef`) |
| Tests | `src/**/*.test.js(x)`, `src/test/setup.js` | Écrits par moi | Relecture : je les lui ai montrés pour vérifier qu'ils étaient corrects |
| Documentation | `README.md`, `JUSTIFICATIONS.md`, `Preuves/*` | Contenu, captures, mesures, vérifications | Aide pour la structure des documents |

## Ce que j'ai fait moi-même

- Installation, lancement et exécution du projet sur ma machine.
- Exécution des tests et des preuves rouge puis vert (retrait volontaire d'une ligne, échec du test, `git restore`, test vert).
- Toutes les mesures de contraste (WebAIM) et toutes les captures d'écran.
- Protocole de navigation au clavier, fait à la main.
- Tests manuels de l'application, qui ont confirmé deux limites : statut perdu au changement de filtre, confirmation possible sans formateur.
- Relecture croisée de la documentation : j'ai repéré 9 tests / 3 fichiers dans un fichier contre 12 / 4 ailleurs, refait la capture et corrigé.
- Gestion du dépôt Git et préparation de la remise.

## Corrections faites avec Claude

Chaque point est parti d'une erreur ou d'un constat de ma part :
- `React is not defined` dans les tests : `import React from "react"` ajouté dans les fichiers JSX.
- Tailwind 4 installé par défaut : retour à la version 3.4.
- `lang="en"` hérité de Vite : remplacé par `lang="fr"`.
- Texte d'aide de la recherche trop pâle (mesuré à 2,53:1) : `placeholder:text-slate-600`.
- Documentation incohérente sur le nombre de tests : corrigée.

## Autres sources

- Sujet du rattrapage (MATRiCE, WEB2) : jeu de données, règles métier et consignes F1, F2, F3.
- WebAIM Contrast Checker : mesures de contraste.
- Aucune autre documentation, aucun autre outil d'IA.


## Points à approfondir

- La fonction asynchrone de `loadSessions` (`Promise`, `setTimeout`) et l'effet de `useSessions`, que j'ai écrits avec l'aide de Claude.