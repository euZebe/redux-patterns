# Redux
## bonnes et moins bonnes pratiques

Note:
couper le téléphone

~~~
## objectifs de la présentation
- introduire Redux
- mettre en lumière certaines pratiques

Note: en se concentrant sur Redux, et non sur le couple React + Redux

///
## les bases
![](resources/transistor-transparent.png) <!-- .element: class="slide-icon" -->
~~~
## Qu'est-ce ?
- librairie JS 
- indépendante
- gérant l'état de l'application

Note:
- "état": données mises en cache, route active de l'appli, onglet sélectionné, langue courante.....
- séparation des responsabilités Redux vs UI (pas d'adhérence UI => modèle)

~~~
## 3 principes
1. _single source of truth_
1. _state_ en lecture seule (pas de mutation)
1. changements de _state_ par functions pure (_reducers_)

Note:
1. L'état de l'application est défini par un seul objet, géré par un _store_ unique.
2. ne mutez pas une partie du state là où vous l'accédez ; la seule façon de changer le state est en émettant une action, qui donne lieu à un nouvel état.

~~~
## fonction pure / impure
```javascript
// pure
function withVAT(value) {
  return value * 1.206;
}

// impure
const counter = 2;
function addToCounter(value) {
  return value + counter; // dépend d'un contexte, counter
}

```

~~~
## Flux Redux

1. action "dispatchée" dans le store <!-- .element class="fragment" -->
- le store exécute le reducer <!-- .element class="fragment" -->
- (oldState, action) => newState <!-- .element class="fragment" -->
- le store notifie les listeners <!-- .element class="fragment" -->

```
[action] ➡ [STORE: [reducer] ➡ [state] ] ➡ [listeners]
```

Note:
- flux unidirectionnel
- reducer peut être une combinaison de plusieurs reducers

///
## illustration du principe :
## le Mölkky
<!-- .slide: class="only-image" -->
![initial state](resources/initialState.jpg)
![new state](resources/newState.jpg)

Note:
- règles: points, victoire, élimination

~~~
### state
📄 <!-- .element: class="slide-icon" -->
```
    (_7)(_8)(_9)            Alice:  { score: 0, ratés: 0 }
  (_5)(11)(12)(_6)          Bob:    { score: 0, ratés: 0 }
    (_3)(10)(_4)
      (_1)(_2)
```
```
      (_9)                  Alice:  { score: 26, ratés: 0 }
 (_2)       (_8)            Bob:    { score: 12, ratés: 2 }
               (12) 
                 (_4) 
                 (_5)
			   
     (_7) 
 (_3)	(11)   (_6)
          (10)   (_4)
```

~~~
### action
![icon](resources/throw.png)<!-- .element: class="slide-icon" -->
![action](resources/action.jpg)

Note: action = Objet { joueur, quilles tombées }

~~~
### reducer
![throw](resources/gears.png)<!-- .element: class="slide-icon" -->
fonction pure
```
reducer: (previousScore, action) => nextScore
```

~~~
### listeners
![listeners](resources/supporters.png)<!-- .element: class="slide-icon" -->
Alice + Bob + supporters


~~~
### store
![listeners](resources/Redux-with-pictos.png)

Note:
- 2 connecteurs (fonctions _subscribe_ et _dispatch_)
- le.s reducer.s
- le state courant

le _Store_ met à disposition un
---( _State_ : l'état actuel de l'application)--->
Des _Listeners_ souscrivent au modification de ce store (store.subscribe()).
Une action est
---( ( _dispatch_ ))--->
les _Reducers_ traitent cette action pour générer un nouveau
---( _State_ )--->
les Listeners sont notifiées d'une modification du store (et se rafraichissent par exemple, s'il s'agit de vues).


~~~
## et en pratique
```javascript
const { createStore } = require('redux');

function initGame(players) {
  console.log('=> jeu initialisé');
  return {
    type: 'INIT_SCORES_SHEET',
    players, // same as players: players
  };
}

function throwPin(fallenPins = [], player) {
  if (fallenPins.length) {
    console.log(`${player} a fait tomber la/les quille(s) ${fallenPins}`);
  } else {
    console.log(`${player} n'a fait tomber aucune quille`);
  }
  return {
    type: 'THROW',
    player,
    fallenPins,
  };
}

function rootReducer(state = {}, action) {
  switch (action.type) {

    case 'INIT_SCORES_SHEET':
      return action.players.reduce((aggregator, player) => {
        aggregator[player] = {
          name: player,
          score: 0,
          consecutiveFailures: 0,
        };
        return aggregator;
      }, {});

    case 'THROW':
      const { player, fallenPins } = action;
      const previousPlayerState = state[player];

      // no pin falled
      if (!fallenPins.length) {
        const nextPlayerState = {
          ...previousPlayerState,
          consecutiveFailures: previousPlayerState.consecutiveFailures + 1, // pas de ++, on ne modifie pas previousPlayerState
        };
        return {
          ...state,
          fallenPins: fallenPins.length,
          [player]: nextPlayerState,
        };
      }

      // one pin falled
      if (fallenPins.length === 1) {
        const nextPlayerState = {
          ...previousPlayerState,
          score: previousPlayerState.score + fallenPins[0],
          consecutiveFailures: 0,
        };
        return {
          ...state,
          fallenPins: fallenPins.length,
          [player]: nextPlayerState,
        };
      }

      // else, several pins falled

      // TODO: toggle this block and the next one to make reducer unpure
      const nextPlayerState = {
        ...previousPlayerState,
        score: previousPlayerState.score + fallenPins.length,
        consecutiveFailures: 0,
      };
      return {
        ...state,
        fallenPins: fallenPins.length,
        [player]: nextPlayerState
      };

      // FIXME: unpure reducer: state mutated => audience and referee won't see the action
      // state[player].score += fallenPins.length;
      // state[player].consecutiveFailures = 0;
      // state.fallenPins = fallenPins.length;
      // return state;

      // FIXME: unpure reducer: nested state mutated => player listener won't see the action
      // const nextState = { ...state, fallenPins: fallenPins.length };
      // nextState[player].consecutiveFailures = 0;
      // nextState[player].score += fallenPins.length;
      // return nextState;

    default:
      return state;
  }
}

// init store
const store = createStore(rootReducer);

/**
 * Listener which keeps a cache of the player state, executing itself only on new player state
 * @param name
 * @returns {Function}
 * @constructor
 */
function PlayerListener(name) {
  let cachedState = store.getState()[name];
  return () => {
    const playerState = store.getState()[name];
    if (playerState !== cachedState) {
      console.log(`${name}: ${playerState.score}, ${playerState.consecutiveFailures} échecs en cours`);
    }
    cachedState = playerState;
  }
}

const AliceListener = PlayerListener('Alice');
const BobListener = PlayerListener('Bob');

/**
 * function which keeps a cache of the currentState, updated at the end of the
 * @returns {Function}
 */
function crowd() {
  let cachedState = store.getState();
  return () => {
    const nextState = store.getState();
    if (nextState !== cachedState) {
      const fallenPinsOnLastThrow = nextState.fallenPins;
      if (fallenPinsOnLastThrow) {
        console.log('👏👏 audience applauses 👏👏\n');
      } else {
        console.log('😞😞\n');
      }
    } else {
      console.log('\t\t\t/!\\TOUTE L\'ASSISTANCE AVAIT-ELLE LES YEUX FERMÉS ??');
    }
    cachedState = nextState;
  }
}

// store.subscribe returns a function to unregister the listener
const unsubscribeAliceListener = store.subscribe(AliceListener);
const unsubscribeBobListener = store.subscribe(BobListener);
store.subscribe(crowd());

store.dispatch(initGame(['Alice', 'Bob']));
store.dispatch(throwPin([12, 4, 6, 2], 'Alice'));
store.dispatch(throwPin([], 'Bob'));
store.dispatch(throwPin([11], 'Alice'));
store.dispatch(throwPin([], 'Bob'));
store.dispatch(throwPin([], 'Alice'));
store.dispatch(throwPin([3, 6, 7, 1, 10, 12], 'Bob'));
```
Note: on pourrait avoir comme listener un composant graphique, une fonction qui stocke les modifications en base de données ou dans le localStorage...


///
## la meilleure solution de gestion d'état ?
![otis](resources/bonne-ou-mauvaise-solution.jpg)<!-- .element: class="fragment" -->

Note: le but n'est pas de dire que que redux est mieux ou moins bien que telle ou telle solution de gestion d'état, elle a ses inconvénients et ses avantages ; elle reste néanmoins une librairie très utilisée et qu'il est bon de maîtriser pour l'exploiter au mieux


///
### structuration du _state_
📄 <!-- .element: class="slide-icon" -->
- "normaliser" les données <!-- .element: class="fragment" data-fragment-index="1" -->
- <!-- .element: class="fragment" data-fragment-index="2" --> 
  ~~duplication~~ <!-- .element: class="fragment" data-fragment-index="2" -->
- ne pas structurer son store en fonction de l'UI <!-- .element: class="fragment" data-fragment-index="3" -->

Note: 
- normaliser => aplatir son schéma. Considérez votre état d'application comme une base de données 
  * séparer les articles de blogs, les auteurs et les commentaires dans des "collections" différentes du _state_.
- exemple: dictionnaire d'objets session ET un objet currentSession => Quid de la MaJ de ladite session ?
- un changement de structure UI ne devrait pas changer la structure du _state_

~~~
### structuration du _state_
### épisode II
📄 <!-- .element: class="slide-icon" -->

~~états imbriqués~~
```javascript
reducer(state = {}, action) {
  switch(action.type){
    case 'MAILS_COUNTER_INCREMENT':
      return {
        ...state,
        toolbar: {
          ...state.toolbar,
          indicators: {
            ...state.toolbar.indicators,
            counter: state.toolbar.indicators + 1,
          },
        },
      };
  }
}
```
Note:
- si l'indicateur n'est plus mis dans la toolbar, l'organisation du state est incohérente => pas d'adhérence à l'UI
- si incrémentation du compteur de mail, tous les listeners d'une partie de toolbarState seront également rafraichis

~~~
### structuration du _state_
### épisode II
📄 <!-- .element: class="slide-icon" -->

~~états imbriqués~~
- complexifient le reducer, et <!-- .element: class="fragment" -->
- rafraîchissent trop de composants <!-- .element: class="fragment" -->
- ➡ rigueur, ou <!-- .element: class="fragment" -->
- ➡ librairie garantissant l'absence de mutation du state, Immutable-js par exemple <!-- .element: class="fragment" -->

Note:
- pb rafraichissement puisqu'on clone l'état imbriqué en modifiant un sous-state

~~~
### structuration du _state_
### épisode III
📄 <!-- .element: class="slide-icon" -->

dictionnaire (hashmap&lt;id, value>) plutôt que tableau

exemple: liste de pays triée par population <!-- .element: class="fragment" data-fragment-index="1" -->

```javascript
const state = {
  countries: {
    CN: {id: 'CN', name: 'China', population: 1381943057},
    ID: {id: 'ID', name: 'Indonesia', population: 264905894},
    IN: {id: 'IN', name: 'India', population: 1347781156},
    US: {id: 'US', name: 'United States', population: 327163096},
  },
  countriesByPopulationDesc: ['CN', 'IN', 'US', 'ID'],
};
``` 
<!-- .element: class="fragment" data-fragment-index="1" -->
Note: 
- permet l'accès rapide au détail d'un pays (sans avoir à faire de countries.find() de + en + coûteux avec le nb croissant d'éléments), et un accès rapide aux tris. 
- /!\ si un pays est ajouté, il faut penser à MaJ le dictionnaire ET le.s tableau.x ➡ mieux: selector

~~~
### Selector 
🔎<!-- .element: class="slide-icon" -->

- permet de sélectionner quelques données d'un state
- API d'accès au state de votre application

```javascript
const getCountries = state => state.countries;

function getCountriesByPopulationDesc(state) {
  return getCountries(state).sort(
    (a, b) => a.population - b.population
  );
}
```
- permet de s'affranchir des index 👍 <!-- .element: class="fragment" -->
- recalcule l'index à chaque fois qu'on y accède 👎 <!-- .element: class="fragment" -->

Note:
- selectors PARTOUT => forme de state plus aisément modifiable. Ex: pour renommer _countries_ par _mostPopulatedCountries_, il n'y a qu'à le modifier dans le reducer et dans l'unique selector pour cet attribut ; tous les sélecteurs dérivés (getCountriesByPopulationDesc) et composants utilisant le selector récupéreront alors la donnée au bon nouvel endroit. 
- la façon de structurer le state devient un détail d'implémentation.

~~~
### Reselect (librairie)
🔎<!-- .element: class="slide-icon" -->


sélecteurs mémorisés, et réévalués seulement au changement d'un paramètre d'entrée
```javascript
import { createSelector } from 'reselect';

const getCountries = state => state.countries;

const getCountriesByPopulationDesc = createSelector(
  getCountries,
  countries => countries.sort(
    (a, b) => a.population - b.population
  );
}
```
Note:
- Pour un composant React par exemple, éviter de calculer des données (sort, filter, map, reduce...) dans le render d'un composant ou dans le mapStateToProps du Container ; préférez faire la préparation des données dans un selector, appelé dans le Container (rappeler qu'un Container souscrit aux modifications du store, et est donc réexécuté à chaque modification de celui-ci... impact sur les perfs)

~~~
### ducks
📂<!-- .element: class="slide-icon" -->

préconisation de structuration des éléments Redux
- regrouper au sein d'un fichier par périmètre fonctionnel _reducer_, _types_, et _actionCreators_.
- Export nommé pour les _actionCreators_ et les _selectors_, export par défaut du _reducer_

__Rappel:__ <!-- .element: class="fragment" data-fragment-index="1" -->
##### mapping action - reducer: 1-n <!-- .element: class="fragment" data-fragment-index="1" -->

Note: Une même action peut faire réagir plusieurs reducers. Exemple:
`dispatch({ type: COMMENT_SUBMIT ... });` peut être traité par
- commentReducer: qui va ajouter/modifier le commentaire
- uiReducer: qui va fermer le formulaire
- articleReducer: qui va mettre à jour la date de dernier commentaire

~~~
### Tests
✓❌ <!-- .element: class="slide-icon" -->

- tester les reducers est simple (fonction pure) <!-- .element: class="fragment" -->
- possibilité de tester par duck <!-- .element: class="fragment" -->
- ➡ utiliser deepFreeze sur le state dans chaque test <!-- .element: class="fragment" -->

Note:
### deepFreeze:
- garantit l'immutabilité du state.
- DEMO articles.spec.js et articles.js
- PAS EN PROD (ou au moyen d'une lib dédiée à l'immutabilité => optimisée)

~~~
### all in redux state
###### vs
### local (component) state
📄 <!-- .element: class="slide-icon" -->
Note: Débat non tranché
##### tout mettre dans le store
- meilleure visibilité de l'état global de l'appli,
- possibilité d'utiliser toute la puissance de Redux (time traveling notamment)
##### __you might not need redux__
- on ne met dans le store que ce qui va être partagé par d'autres composants...
- cf. talk de @MoOx

~~~
### redux-thunk (lib)
![icon](resources/throw.png)<!-- .element: class="slide-icon" -->
- _thunk_: action de type 'function'
- accès au state dans le thunk <!-- .element: class="fragment" -->
- multiples dispatch possibles <!-- .element: class="fragment" -->
- appels asynchrones possibles (Promise.then(dispatch).catch(dispatch)) <!-- .element: class="fragment" -->


~~~
### redux-thunk example
![icon](resources/throw.png)<!-- .element: class="slide-icon" -->
```javascript
function validateAndCloseForm(formValues) {
  return (dispatch, getState) => {
    const previousState = getState();

    dispatch({ type: 'VALIDATE_FORM', formValues });
    //dispatch is synchronous => getState() gets the new state
    const intermediateState = getState();

    dispatch({ type: 'CLOSE_FORM', id: formValues.id });
    const finalState = getState();
    
    // previousState !== intermediateState !== finalState
  }
}
```
~~~
### redux-saga
![icon](resources/throw.png)<!-- .element: class="slide-icon" -->
- facilite l'orchestration d'actions complexes et/ou asynchrones
- facile à tester

~~~
### redux devtools
![](https://media.giphy.com/media/yPO3Yxx3jRSlG/giphy_s.gif)
- visualisation des actions exécutées <!-- .element: class="fragment" -->
- déclenchement d'une action à la main <!-- .element: class="fragment" -->
- voyage dans le temps <!-- .element: class="fragment" -->

Note:
- cas d'usage: un message d'info qui disparaît au bout de 3 secondes
- DEMO

~~~
### autres librairies notables
- normalizr (pour convertir une réponse d'API par exemple, en de la donnée normalisée ?)
- redux-undo


///
### si vous ne deviez retenir que ça...

![great responsibility](resources/with-great-power.jpg) <!-- .element: class="fragment" -->
- faites preuve de pragmatisme <!-- .element: class="fragment" -->

Note:
- great responsibility: redux = petite librairie (150 lignes) avec grandes possibilités, dont celle de faire du code sale
- ne pas appliquer de règles sans discernement ni sans les comprendre
- j'espère que cette présentation vous aidera à mieux appréhender redux lors de vos prochains projets

~~~
### remerciements
Jean-Baptiste, Alexandra, Julien,

Zélia, Silvère, Mab, Thibault

~~~
### ressources
* [Site officiel](http://redux.js.org)
* [The complete redux book](https://camo.githubusercontent.com/e2d8c7d2793f36e8ef5a5ec942ff0f6d1333a873/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f7469746c6570616765732e6c65616e7075622e636f6d2f72656475782d626f6f6b2f6865726f3f3134373639373939333725323025374325323077696474683d323030)
* https://tech.affirm.com/redux-patterns-and-anti-patterns-7d80ef3d53bc
* https://medium.com/@kylpo/redux-best-practices-eef55a20cc72
* https://decembersoft.com/posts/redux-thunk-vs-redux-saga/