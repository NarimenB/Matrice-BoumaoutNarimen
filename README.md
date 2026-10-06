# MATRiCE – Planning (rattrapage WEB2 : F1, F2, F3)

Mini-application React de planning pédagogique, réalisée dans le cadre du rattrapage individuel WEB2 (HETIC, 2025-2026) par Narimen Boumaout. Une seule application sert à démontrer trois compétences notées séparément : F1 (React avancé), F2 (tests front) et F3 (bibliothèques UI).

Dépôt : https://github.com/NarimenB/Matrice-BoumaoutNarimen

## Ce que fait l'application

- Affiche les séances regroupées par jour (« Lundi 19 octobre », « Mardi 20 octobre »), sous forme de cartes : titre, domaine, groupe, période (matin / après-midi), formateur, statut.
- Trois filtres combinables sans recharger la page : groupe, domaine, recherche texte.
- Règle métier : le groupe A affiche les séances A **et** Promotion ; le groupe B affiche les séances B **et** Promotion.
- États visibles : chargement, erreur avec bouton « Réessayer », résultat vide.
- Protection contre les réponses obsolètes : si une requête lente répond après une requête plus récente, l'écran reste sur la plus récente.
- Détail d'une séance dans une modale accessible : le focus est piégé dans la modale, `Echap` la ferme, le focus revient sur la carte.
- Modification locale du statut d'une séance, cohérente entre la liste et le détail.
- Interface utilisable à 360 px et 1280 px. Le statut se lit par le texte et le symbole (✓ / ○), pas seulement par la couleur.

Les données sont fictives (fournies par le sujet). Il n'y a ni backend, ni base de données, ni authentification.

## Prérequis

- Node.js et npm (version utilisée : v24.14.0)
- Git

## Installation

```bash
git clone https://github.com/NarimenB/Matrice-BoumaoutNarimen.git
cd Matrice-BoumaoutNarimen
npm install
```

## Lancement

```bash
npm run dev
```

L'application est alors disponible sur http://localhost:5173.

Pour construire la version de production :

```bash
npm run build
```

## Tests

Les tests s'exécutent avec une commande non interactive :

```bash
npm run test
```

Pour les relancer automatiquement à chaque modification :

```bash
npm run test:watch
```

La suite contient 12 tests répartis dans 4 fichiers :

| Fichier | Tests |
| --- | --- |
| `src/api/loadSessions.test.js` | le groupe A inclut la Promotion ; le groupe B inclut la Promotion mais pas A |
| `src/hooks/useSessions.test.jsx` | chargement ; succès ; résultat vide ; erreur puis nouvelle tentative ; réponses dans le désordre |
| `src/App.test.jsx` | nom accessible du champ de recherche ; utilisation du champ de recherche au clavier |
| `src/utils/groupByDay.test.js` | regroupement par jour trié (matin avant après-midi) ; libellé du jour en français ; liste vide |

Les tests du hook utilisent un faux « loader » injecté à la place du vrai `loadSessions`, ce qui permet de contrôler précisément les délais et les erreurs.

## Structure du projet

```
src/
  data/sessions.js         jeu de données fourni par le sujet (6 séances + formateurs)
  api/loadSessions.js      filterSessions (filtre) et loadSessions (version asynchrone avec délai)
  hooks/useSessions.js     état, chargement, protection contre les réponses obsolètes, modification du statut
  utils/groupByDay.js      regroupement des séances par jour
  components/
    StatusBadge.jsx        badge « Confirmée » / « Proposée »
    FiltersBar.jsx         filtres groupe, domaine, recherche
    SessionCard.jsx        une séance dans la liste
    SessionList.jsx        liste par jour et états chargement / erreur / vide
    SessionDetail.jsx      modale de détail accessible au clavier
  test/setup.js            configuration des tests (jest-dom)
  App.jsx                  assemblage de l'application
Preuves/
  F2/                      preuves des tests (traces rouge puis vert, tableau des scénarios)
  F3/                      captures 360 px et 1280 px, protocole clavier, mesures de contraste
README.md
JUSTIFICATIONS.md
SOURCES_IA.md
```

## Où trouver ce qui valide F1, F2 et F3

| Compétence | Où |
| --- | --- |
| **F1 – React avancé** | `src/hooks/useSessions.js` (état, effets, compteur `requestId` contre les réponses dans le désordre), `src/api/loadSessions.js`, `src/App.jsx` (liste et détail lisent le même tableau). Explications dans `JUSTIFICATIONS.md`, sections 2 à 4. |
| **F2 – Tests front** | fichiers `*.test.js(x)` ci-dessus ; preuves dans `Preuves/F2/F2-PREUVES.md` |
| **F3 – Bibliothèques UI** | Tailwind CSS dans tous les composants ; preuves dans `Preuves/F3/F3-PREUVES.md` |

## Documentation complémentaire

- [JUSTIFICATIONS.md](JUSTIFICATIONS.md) : choix techniques, alternatives, preuves et limites.
- [SOURCES_IA.md](SOURCES_IA.md) : usages de l'IA, fichiers concernés, adaptations et vérifications.

## Notes

- Aucun secret, fichier `.env` ou donnée personnelle n'est versionné.
- Les fichiers de composants importent `React` explicitement : l'environnement de test lisait le JSX en cherchant `React` dans chaque fichier, ce qui provoquait l'erreur « React is not defined ».