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

~~~
## 3 principes
1. single source of truth
1. _state_ en lecture seule
1. changements de _state_ par functions pure (_reducers_)

Note:
1. le _store_ est le garant de l'état de l'application. A aucun moment on ne doit modifier une donnée présente dans le store.
1. ne mutez pas une partie du state là où vous l'accédez ; la seule façon de changer le state est en émettant une action, qui générera un nouvel état.

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

///
## la meilleure solution de gestion d'état ?
![otis](resources/bonne-ou-mauvaise-solution.jpg)<!-- .element: class="fragment" data-fragment-index="1" -->

Note: le but n'est pas de dire que que redux est mieux ou moins bien que telle ou telle solution de gestion d'état, elle a ses inconvénients et ses avantages ; elle reste néanmoins une librairie très utilisée et qu'il est bon de maîtriser pour l'exploiter au mieux



///
## objectif de la présentation
=> mettre en lumière certaines pratiques


~~~
### structuration du store
- définir "normalisation" des données (Think of the app’s state as a database.) => séparer les articles de blogs, les auteurs et les commentaires dans des morceaux différents du store.
- dictionnaire (hashmap de things dans thingById) plutôt que tableaux (pour accéder à l'élément avec l'ID X, il faut alors faire un array.find() plutôt qu'un dictionnaire[x])
- dissocier data de l'UI, ne pas structurer son store en fonction de l'UI
- éviter la duplication (par exemple un dictionnaire d'objets session ET un objet currentSession => Quid de la MaJ de ladite session ?
- normalisation (aplatir son schéma) pour une accessibilité plus aisée aux données (exemple d'un article de blog avec des commentaires et des commentateurs)
- éviter les nested states, qui
  * complexifient le reducer, et
  * recharger trop de composants puisqu'on met à jour tout le super-state en modifiant un sous-state

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
TODO: faire un exemple (en pur JS + redux) avec des console.log dans les subscribers à plusieurs niveaux du state, puis normaliser le state et montrer la différence.
- gérer les listes par un index: des attributs d'un objet dont les clés sont les identifiants des objets listés (hashmap) => exemple usersById (object) et usersByCountry  (tableau de UserID)... (ou mieux, utilisez des selectors)


~~~
### Selector (picto)
un sélecteur, comme son nom l'indique, permet de sélectionner des données d'un state. Il s'agit d'une fonction (pure) qui prend la forme suivante:
```
// (state, props?) => Object
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

```
=> utiliser des selectors PARTOUT où vous accédez au state, pour rendre votre modèle plus aisément modifiable. Si on veut modifier l'organisation de notre store, par exemple renommer songsById par songs dans l'exemple précédent, il n'y a qu'à le modifier dans le reducer et dans le selector ; tous les composants utilisant le selector récupéreront alors la donnée au bon nouvel endroit. Idem pour tous les selectors dérivés.

Dans la doc Redux, il est proposé une organisation par catalogue + indexes. Reselect permet de s'affranchir des indexes... en créant des sélecteurs mémorisés pour tout ce qui est calculé ; le sélecteur n'est réévalué que lorsqu'un paramètre d'entrée change
- => reselect et la mémorisation

- Pour un composant React par exemple, éviter de calculer des données (sort, filter, map, reduce...) dans le render d'un composant ou dans le mapStateToProps du Container ; préférez faire la préparation des données dans un selector, appelé dans le Container (rappeler qu'un Container souscrit aux modifications du store, et est donc réexécuté à chaque modification de celui-ci... impact sur les perfs)


~~~
### nommage
- selectors commencent par get
- actionCreators: addUser
- action types: NOM_VERBE (ex: USER_ADD), pour namespacer les actions


~~~
### ducks
préconisation de structuration des éléments Redux: rassemblement du reducer, des types, et des actionCreators dans un seul fichier par périmètre fonctionnel.
https://github.com/erikras/ducks-modular-redux
Export nommé pour les actionCreators et les sélecteurs, export par défaut du reducer
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
### ? tout dans le store ? Des states locaux ?
Débat non tranché ; certains considèrent qu'il faut tout mettre dans le store pour une meilleure visibilité de l'état général de l'appli,
d'autres considèrent qu'on ne met dans le store que ce qui va être partagé par d'autres composants...
"Un composant vraiment autonome qu'on se verrait pousser sur github => state local"


~~~
### librairies et outils connexes
- redux devtools et le time travelling (démo)
- reselect
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
