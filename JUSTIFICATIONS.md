# Justifications techniques

Ce document explique les choix faits dans le projet, les alternatives que j'ai écartées, les preuves et les limites. Les preuves sont dans le dossier `Preuves/` (un sous-dossier par compétence : F2 et F3, avec leur fichier `*-PREUVES.md`).

## 1. Choix techniques

| Choix | Alternatives | Pourquoi |
| --- | --- | --- |
| React + Vite | Next.js, Create React App | Imposé par le sujet. Vite lance un serveur de développement rapide et construit la version finale. |
| Tailwind CSS 3.4 | MUI, Tailwind 4 | Le sujet demande une bibliothèque UI. Tailwind permet de styler directement dans le JSX. J'ai pris la version 3, dont la configuration est plus simple à comprendre que celle de la version 4. |
| Hook `useSessions` | état dans `App.jsx`, `useReducer`, bibliothèque de données (React Query) | Le hook isole l'état, le chargement et la protection contre la concurrence : `App.jsx` ne contient que l'assemblage. Une bibliothèque externe aurait caché justement ce que le sujet veut que je montre. |
| `filterSessions` séparée de `loadSessions` | un seul bloc asynchrone | La partie filtre est une fonction pure : elle se teste sans async ni React. `loadSessions` ne fait qu'ajouter le délai artificiel. |
| `loader` injectable dans le hook | `vi.mock` du module, appel direct | Le sujet demande une fonction asynchrone « interchangeable ». En passant le loader en paramètre, les tests le remplacent par un faux loader dont je contrôle les délais et les erreurs. |
| Modale écrite à la main | `<dialog>` natif, bibliothèque de composants accessibles | Je voulais gérer et pouvoir expliquer moi-même le focus (entrée, piège, retour). Je n'ai pas vérifié si `<dialog>` se teste correctement dans jsdom. |
| Une carte = un `<button>` | `div` cliquable, lien | Atteignable au clavier et activable sans code supplémentaire. |
| Liste regroupée par jour (`groupByDay`) | liste plate | Plus proche d'un vrai planning et ajoute un niveau de hiérarchie (jour, séance, détail). |

## 2. F1 : état, valeurs calculées, effets, nettoyage, clés

### État local (`useState`)

- Dans `useSessions` : `filters` (groupe, domaine, recherche), `sessions` (la liste affichée), `status` (`idle`, `loading`, `success`, `empty`, `error`) et `error`.
- Dans `App.jsx` : `selectedId`, l'identifiant de la séance dont le détail (la modale) est ouvert.

Je ne garde que l'identifiant de la séance sélectionnée, pas une copie de la séance. L'identifiant sert de clé primaire : c'est lui qui permet de retrouver la bonne séance parmi des séances qui se ressemblent.

### Valeurs calculées (pas stockées dans un état)

- `selectedSession = sessions.find((s) => s.id === selectedId)` est recalculée à chaque rendu. Si j'avais gardé une copie de la séance dans un état, elle ne se serait pas mise à jour quand `updateStatus` change le statut dans le tableau `sessions` : la modale aurait affiché l'ancien statut pendant que la liste affichait le nouveau. En ne gardant que l'identifiant, la liste et la modale lisent toujours le même tableau.
- `groupByDay(sessions)` est recalculée à chaque rendu de `SessionList`.
- Le nom du formateur (`formateurs[session.formateurId]`) et le libellé du domaine sont calculés au moment de l'affichage.

### Effets (`useEffect`)

- Dans `useSessions` : un effet relance le chargement à chaque changement de `filters` (et au premier affichage). La règle ESLint sur les dépendances est désactivée pour cette ligne, parce que `runLoad` ne change que si `loader` change, et `loader` est déjà dans la liste des dépendances.
- Dans `SessionDetail` : un effet déplace le focus dans la modale et installe un écouteur de clavier (Echap pour fermer, Tab pour garder le focus dans la modale) quand une séance est ouverte.

### Nettoyage

- `SessionDetail` : la fonction retournée par l'effet retire l'écouteur de clavier à la fermeture et remet le focus sur la carte qui avait ouvert la modale. Sans ce retrait, chaque ouverture ajouterait un nouvel écouteur : après plusieurs ouvertures, un seul appui sur Echap déclencherait plusieurs fois la fermeture, et les écouteurs des modales déjà fermées resteraient actifs.
- Chargement des séances : l'effet n'annule pas la requête en cours, il ignore ses réponses obsolètes avec le `requestId` (voir la section 3). Ce n'est pas une annulation : la promesse précédente se termine quand même, mais son résultat est jeté.

### Clés stables

- `key={session.id}` pour les cartes, `key={day.date}` pour les sections de jour, `key={opt.value}` pour les options des menus. Je n'utilise jamais l'index : les identifiants restent les mêmes quand la liste change (filtre, tri), donc React ne mélange pas les éléments.

### Règle « une confirmation exige un formateur »

Le sujet impose qu'une séance sans formateur (comme « Travail autonome ») ne puisse pas être confirmée. Je l'applique à deux endroits :
- dans `updateStatus` (`useSessions.js`) : si on demande « confirmed » pour une séance sans `formateurId`, la séance est renvoyée inchangée ;
- dans la modale (`SessionDetail.jsx`) : l'option « Confirmée » est désactivée pour une séance sans formateur, avec une phrase d'explication reliée au menu par `aria-describedby`.

La règle est dans le hook et pas seulement dans la modale : même si un autre composant appelait `updateStatus`, la règle serait respectée. Elle est testée par le scénario 7 (`Preuves/F2/F2-PREUVES.md`, preuve 3).


## 3. La concurrence (réponses dans le désordre)

**Le problème :** A est lancé à t = 0 et répond à 800 ms, B est lancé à t = 100 ms et répond à 200 ms. B répond donc à t = 300 ms, et A arrive après. Sans protection, A écraserait B alors que l'utilisateur a demandé B en dernier. C'est comme commander un café (long à préparer), puis changer d'avis pour un thé (rapide) : le thé arrive d'abord, puis le café arrive en retard et prend sa place alors qu'on n'en veut plus.

**Ma solution :** un compteur `requestIdRef` (un `useRef`). Chaque appel à `runLoad` l'incrémente et mémorise son propre numéro dans une variable locale, comme le numéro d'une commande. Quand une réponse arrive, elle compare son numéro au compteur : si ce n'est plus le plus récent, elle est ignorée (`if (requestId !== requestIdRef.current) return;`). Ici, A reçoit le numéro 1 et B le numéro 2. Quand la réponse de A arrive en retard, le compteur vaut 2, donc elle est jetée, et l'écran reste sur B. J'ai pris un `useRef` plutôt qu'un `useState`, parce que sa valeur est toujours à jour dans une fonction asynchrone et qu'il ne provoque pas de nouveau rendu.

**Alternatives :** un drapeau `ignore` dans la fonction de nettoyage de l'effet (autre méthode courante), ou un `AbortController` pour annuler vraiment la requête. L'`AbortController` n'a pas d'effet sur un `setTimeout` simulé, et le compteur marche aussi pour le bouton « Réessayer », qui n'est pas lié à un effet.

## 4. Deux scénarios reproductibles pour F1

**Filtres combinés** (à la main, avec `npm run dev`) :
1. Groupe A + recherche « react » : seule « React composants » reste (« React événements » est du groupe B).
2. Groupe A + domaine Projet : seule « Travail autonome » reste (séance Promotion, visible par le groupe A).
3. Domaine Web + groupe B : seule « React événements » reste.

**Réponses dans le désordre :** reproductible par le test `useSessions - scénario 6` (`npx vitest run src/hooks/useSessions.test.jsx -t "désordre"`), avec preuve rouge puis verte dans `Preuves/F2/`. Dans le navigateur, le délai est fixe (400 ms) : je ne peux pas produire le désordre à la main.

## 5. Choix pour les tests (F2)

- Les tests du hook injectent un faux loader : ils sont rapides et prévisibles, mais ne testent pas le vrai délai de 400 ms.
- Le test de concurrence utilise de vrais délais (environ 1,3 s). J'aurais pu utiliser les faux timers de Vitest, plus rapides, mais ils se combinent mal avec les mises à jour d'état de React et j'ai préféré un test que je comprends.
- Les preuves 1 et 2 sont obtenues en retirant volontairement une ligne de code, puis en la restaurant avec `git restore` : elles prouvent que les tests détectent la panne. La preuve 3 (confirmation sans formateur) porte sur un défaut réel de mon application : le test a été écrit avant la correction, a échoué sur le code d'origine, puis est passé après la correction.

## 6. Problèmes rencontrés

- **`React is not defined` dans les tests.** Vitest lisait le JSX de mes composants en cherchant `React` dans chaque fichier, alors que `npm run dev` n'en a pas besoin. J'ai ajouté `import React from "react"` en tête des fichiers JSX. Une autre piste est de régler `esbuild: { jsx: 'automatic' }` dans `vite.config.js`, mais je ne l'ai pas testée.
- **`lang="en"` hérité du gabarit Vite.** Le contenu étant en français, je l'ai remplacé par `lang="fr"` pour les lecteurs d'écran.
- **Texte d'aide de la recherche trop pâle.** Mesuré à 2,53:1, corrigé à 7,57:1 (voir `Preuves/F3/`).
- **Tailwind 4 par défaut.** `npx tailwindcss init` n'existe plus avec la version 4 : j'ai installé la version 3.4.
- **`npm audit`.** Des vulnérabilités sont signalées dans les dépendances de développement. Je n'ai pas lancé `npm audit fix --force`, qui aurait pu changer les versions des outils de test.

## 7. Preuves

- F2 : `Preuves/F2/F2-PREUVES.md` (tableau des scénarios, traces rouge puis vert, configuration, limites).
- F3 : `Preuves/F3/F3-PREUVES.md` (captures 360 px et 1280 px, protocole clavier, contrastes, trois décisions).
- F1 : le code (`src/hooks/useSessions.js`, `src/api/loadSessions.js`, `src/App.jsx`), la section 2 et la section 4 de ce document.

## 8. Limites

- **Le statut modifié n'est pas conservé quand on change de filtre.** Un nouveau filtre recharge les séances depuis les données d'origine, donc un statut changé localement revient à sa valeur initiale.
- **L'état d'erreur n'est pas déclenchable dans le navigateur.** Il est testé (scénario « erreur puis nouvelle tentative »), mais le vrai `loadSessions` ne renvoie jamais d'erreur dans l'application.
- **Pas d'annulation de requête :** je ne fais qu'ignorer les réponses obsolètes.
- La modale est testée à la main (protocole clavier), pas par des tests automatiques ; seul le champ de recherche a un test d'accessibilité. L'option « Confirmée » désactivée et sa phrase d'explication ont été vérifiées à la main ; seule la règle dans `updateStatus` est couverte par un test automatique.
- Les limites propres aux tests et aux captures sont détaillées dans `F2-PREUVES.md` et `F3-PREUVES.md`.