# Redux
## bonnes et moins bonnes pratiques

///
## les bases
![](resources/transistor-transparent.png) <!-- .element: class="slide-icon" -->
~~~
## Qu'est-ce ?
- librairie JS 
- indépendante
- gérant l'état de l'application

Note:
- indépendante de toute lib et de tout framework
- "état": données mises en cache, route active de l'appli, onglet sélectionné, langue courante.....

~~~
## 3 principes
1. single source of truth
1. _state_ en lecture seule
1. changements de _state_ par functions pure (_reducers_)

Note:
1. L'état de l'application est défini par un seul objet, géré par un _store_ unique.
2. ne mutez pas une partie du state là où vous l'accédez ; la seule façon de changer le state est en émettant une action, qui donne lieu à un nouvel état.

~~~
## fonction pure / impure
```javascript
// impure
const counter = 2;
function addToCounter(value) {
  return value + counter; // dépend d'un contexte, counter
}

// pure
function withVAT(value) {
  return value * 1.206;
}
```


///
## illustration du principe :
## le Mölkky
<!-- .slide: class="only-image" -->
![initial state](resources/initialState.jpg)
![new state](resources/newState.jpg)

Note: rappeler les règles brièvement

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

~~~
### reducer
![throw](resources/gears.png)<!-- .element: class="slide-icon" -->
fonction pure
```
reducer: (previousScore, action) => nextScore
```

~~~
### listeners
Alice + Bob + supporters

![listeners](resources/supporters.png)

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
### createStore
```javascript
import { createStore } from 'redux';

const action = {
  type: 'INIT_SCORES_SHEET',
  players: ['Alice', 'Bob']
};

function initGame(players) {
  // TODO: check no duplicates
  return {
    type: 'INIT_SCORES_SHEET',
    players, // same as players: players
  };
}

function throw(fallenPins = [], player) {
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
      }), {});
      
    case 'THROW':
      const { player } = action;
      const previousPlayerState = state[player];

      // no pin falled
      if (!fallenPins.length) { 
        const nextPlayerState = {
          ...previousPlayerState,
          consecutiveFailures: previousPlayerState.consecutiveFailures + 1, // pas de ++, on ne modifie pas previousPlayerState
        };
        return {
          ...state,
          [player]: nextPlayerState
        };
      }
      
      // one pin falled
      if (fallenPins.length === 1) {
        const nextPlayerState = {
          ...previousPlayerState,
          score: previousPlayerState.score + fallenPins[0]
        };
        return {
          ...state,
          [player]: nextPlayerState
        };        
      }

      // else, several pins falled
      const nextPlayerState = {
        ...previousPlayerState,
        score: previousPlayerState.score + fallenPins.length
      };
      return {
        ...state,
        [player]: nextPlayerState
      };
      
    default:
      return state;
  }
}

// init store
const store = createStore(rootReducer);

// define listeners
function logListener(content) {
  console.log(content);
}

// store.subscribe returns a function to unregister the listener
const unsubscribe = store.subscribe(logListener);

store.dispatch(initGame(['Alice', 'Bob']);
store.dispatch(throw([12, 4, 6, 2], 'Alice');
store.dispatch(throw([], 'Bob');
store.dispatch(throw([11], 'Alice');
store.dispatch(throw([], 'Bob');
store.dispatch(throw([], 'Alice');
store.dispatch(throw([3, 6, 7, 1, 10, 12], 'Bob');

```
Note: on pourrait avoir comme listener un composant graphique, une fonction qui stocke les modifications en base de données ou dans le localStorage...

// TODO: redécouper l'exemple en plusieurs slides avec le picto pour chaque partie concernée
// TODO: quel est le contenu envoyé au listener lors d'un nouveau state

///
## la meilleure solution de gestion d'état ?
![otis](resources/bonne-ou-mauvaise-solution.jpg)<!-- .element: class="fragment" data-fragment-index="1" -->

Note: le but n'est pas de dire que que redux est mieux ou moins bien que telle ou telle solution de gestion d'état, elle a ses inconvénients et ses avantages ; elle reste néanmoins une librairie très utilisée et qu'il est bon de maîtriser pour l'exploiter au mieux


///
## objectif de la présentation
=> mettre en lumière certaines pratiques


~~~
### structuration du _state_
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
### structuration du _state_, épisode II
#### ~~états imbriqués~~
- complexifient le reducer, et <!-- .element: class="fragment" -->
- recharger trop de composants puisqu'on met à jour tout le super-state en modifiant un sous-state <!-- .element: class="fragment" -->

~~~
### illustration des états imbriqués
```javascript
reducer(state = {}, action) {
  switch(action.type){
    case 'NESTED_COUNTER_INCREMENT':
      return {
        ...state,
        subState: {
          ...state.subState,
          counter: state.subState.counter + 1,
        },
      };
  }
}
```
Note: 
TODO: faire un exemple (en pur JS + redux) avec des console.log dans les subscribers à plusieurs niveaux du state, puis normaliser le state et montrer la différence.

~~~
### structuration du _state_, épisode III
dictionnaire (hashmap&lt;id, value>) plutôt que tableau

exemple: liste de pays triée par population <!-- .element: class="fragment" -->

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
<!-- .element: class="fragment" -->
Note: 
- permet l'accès rapide au détail d'un pays (sans avoir à faire de countries.find() de + en + coûteux avec le nb croissant d'éléments), et un accès rapide aux tris. 
- /!\ si un pays est ajouté, il faut penser à MaJ le dictionnaire ET le.s tableau.x => mieux: selector

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


sélecteurs mémorisés, et réévalués qu'au changement d'un paramètre d'entrée
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
- préconisation de structuration des éléments Redux
- regrouper au sein d'un fichier par périmètre fonctionnel reducer, types, et actionCreators.
- Export nommé pour les actionCreators et les sélecteurs, export par défaut du reducer

==> EN GARDANT BIEN A L'ESPRIT QUE...
### mapping action - reducer: 1-n
Une même action peut faire réagir plusieurs reducers. Exemple:
`dispatch({ type: COMMENT_SUBMIT ... });` peut être traité par
- commentReducer: qui va ajouter/modifier le commentaire
- uiReducer: qui va fermer le formulaire
- articleReducer: qui va mettre à jour la date de dernier commentaire

~~~
### NE PAS modifier un objet imbriqué du state
TODO: take examples from https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns

##### remèdes:
- rigueur, ou
- librairie garantissant l'absence de mutation du state, Immutable-js par exemple


~~~
### Tests
- tester les reducers est simple (fonction pure).
- possibilité de tester par duck: (TODO exemple)


```javascript
const state = {
  songsById: {
    1: { title: "Shine", year: 2001, authorID: "2842" }
    2: { title: "Feeling good", year: 2001, authorID: "2842" }
  },
  authorsById: {
    2842: { name: "Muse", fromYear: 1999 }
  },
};

const getSongs = state => state.songsById
const getSongsSortedByName = state => getSongs(state).sort((a, b) => a.title < b.title)

const reducer = (state = {}, action) {
  switch(action.type) {
    case 'SONG_ADD':
      const id = shortid.generate();
      return {
        ...state,
        [id]: action.payload,
      };
    default:
      return state;
  }
}
```
- utiliser deepFreeze sur le state dans chaque test, pour s'assurer qu'on conserve l'immutabilité du state. Ne pas le faire en prod pour son coût.


~~~
### global state
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
### redux-thunk
![icon](resources/throw.png)<!-- .element: class="slide-icon" -->
- thunk: action de type 'function' <!-- .element: class="fragment" -->
- accès au state entier <!-- .element: class="fragment" -->
- multiples dispatch possibles <!-- .element: class="fragment" -->
- appels asynchrones possibles (Promise.then(dispatch).catch(dispatch)) <!-- .element: class="fragment" -->


~~~
### redux-thunk example
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
### redux devtools
![](https://media.giphy.com/media/yPO3Yxx3jRSlG/giphy_s.gif)
- visualisation des actions exécutées <!-- .element: class="fragment" -->
- déclenchement d'une action à la main <!-- .element: class="fragment" -->
- voyage dans le temps <!-- .element: class="fragment" -->

Note:
cas d'usage: un message d'info qui disparaît au bout de 3 secondes
~~~
### librairies et outils connexes
- redux-thunk pour des actionCreators plutôt que des actions => accès au state et au dispatch
- ? redux-saga
- ? normalizr (pour convertir une réponse d'API par exemple, en de la donnée normalisée ?)
- redux-undo


///
### si vous ne deviez retenir que ça...

- ![great responsibility](resources/with-great-power.jpg)
- pragmatisme

Note: comme en tout, ne pas appliquer de règles sans discernement ni sans les comprendre

~~~
### remerciements
Jean-Baptste, Alexandra, Julien, Zélia, Silvère, mab, Thibault

~~~
### ressources
* [Site officiel](http://redux.js.org)
* [The complete redux book](https://camo.githubusercontent.com/e2d8c7d2793f36e8ef5a5ec942ff0f6d1333a873/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f7469746c6570616765732e6c65616e7075622e636f6d2f72656475782d626f6f6b2f6865726f3f3134373639373939333725323025374325323077696474683d323030)
* https://tech.affirm.com/redux-patterns-and-anti-patterns-7d80ef3d53bc
* https://medium.com/@kylpo/redux-best-practices-eef55a20cc72
