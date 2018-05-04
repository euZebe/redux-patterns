## Redux
#### bonnes et moins bonnes pratiques


### les bases
![](resources/transistor.png)
- librairie JS
- indépendante
- gérant l'état de l'application

Note:
- indépendante de toute lib et de tout framework


### 3 principes
1. single source of truth
1. state is read only
1. changes are made with pure functions (reducers)

Note:
1. le _store_ est le garant de l'état de l'application. A aucun moment on ne doit modifier une donnée présente dans le store.
1. ne mutez pas une partie du state là où vous l'accédez ; la seule façon de changer le state est en émettant une action, qui générera un nouvel état.


```javascript
// impure
const ext = 2;
function addToC(value) {
  return value + ext; // dépend d'un contexte, ext
}

// pure
function add4(value) {
  return value + 4;
}
```



### illustration du principe: Mölkky
Note: rappeler les règles brièvement


#### state
<!-- .slide: class="only-image" -->
![initialState](resources/initialState.jpg)
![initialState](resources/newState.jpg)

Note: mettre image SVG des quilles + score des joueurs + nb de ratés
    (_7)(_8)(_9)                Alice:  { score: 0, ratés: 0 }
  (_5)(11)(12)(_6)              Bob:    { score: 0, ratés: 0 }
    (_3)(10)(_4)
      (_1)(_2)

                (_4)
 (11)       (_2)
    (_7) (_8)     (_9)          Alice: { score: 26, ratés: 0 }
  (_5)  (12)   (_6)             Bob: { score: 12, ratés: 2 }
    (_3)    (10)
      (_1)


#### action
![action](resources/action.jpg)


#### reducer
![reducer](resources/gears.jpg)


#### listeners
![listeners](resources/listeners.jpg) // TODO: joueurs + supporters


#### store
- 2 connecteurs (fonctions _subscribe_ et _dispatch_)
- le.s reducer.s
- le state courant
=> notifie le.s _subscriber.s_ à chaque nouveau state

// TODO schéma global du store + action + reducer.s + state

Note:
le _Store_ met à disposition un
---( _State_ : l'état actuel de l'application)--->
Des _Listeners_ souscrivent au modification de ce store (store.subscribe()).
Une action est
---( ( _dispatch_ ))--->
les _Reducers_ traitent cette action pour générer un nouveau
---( _State_ )--->
les Listeners sont notifiées d'une modification du store (et se rafraichissent par exemple, s'il s'agit de vues).

TODO: mettre des pictos pour chaque terme (loupe pour selector, ->[]-> pour reducer, document pour state, personne pour listener, flèche avec un message pour action, arc pour dispatch), et rappeler le picto pour chaque slide

TODO: montrer un exemple de code (sans React dedans)

action:
```
{
  type: 'SONG_ADD',
  payload: { title: "Exogenesis", year:2010, authorID: "2842" },
}
```
Une action est rarement créée à la main, mais souvent instanciée à partir d'un actionCreator (picto écrivain)



### est-ce le meilleur gestionnaire d'état ?
"je ne crois pas qu'il y ait de bonne ou de mauvaise situation"
le but n'est pas de dire que que redux est mieux ou moins bien que telle ou telle solution de gestion d'état,
elle a ses inconvénients et ses avantages ; elle reste néanmoins une librairie très utilisée et qu'il est bon de maîtriser pour l'exploiter au mieux



### objectif de la présentation:
montrer quelques bonnes et mauvaises pratiques (mettre en lumière certaines pratiques ?)



## bonnes pratiques


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


### nommage
- selectors commencent par get
- actionCreators: addUser
- action types: NOM_VERBE (ex: USER_ADD), pour namespacer les actions



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

### NE PAS modifier un objet imbriqué du state
TODO: take examples from https://redux.js.org/recipes/structuring-reducers/immutable-update-patterns

##### remèdes:
- rigueur, ou
- librairie garantissant l'absence de mutation du state, Immutable-js par exemple

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



### ? tout dans le store ? Des states locaux ?
Débat non tranché ; certains considèrent qu'il faut tout mettre dans le store pour une meilleure visibilité de l'état général de l'appli,
d'autres considèrent qu'on ne met dans le store que ce qui va être partagé par d'autres composants...
"Un composant vraiment autonome qu'on se verrait pousser sur github => state local"



### librairies et outils connexes
- redux devtools et le time travelling (démo)
- reselect
- redux-thunk pour des actionCreators plutôt que des actions => accès au state et au dispatch
- ? redux-saga
- ? normalizr (pour convertir une réponse d'API par exemple, en de la donnée normalisée ?)
- redux-undo



### si vous ne deviez retenir que ça...

- With great power comes great responsibility
- faire preuve de pragmatisme ; comme en tout, ne pas appliquer de règles sans discernement ni sans les comprendre

### ressources
* [Site officiel](http://redux.js.org)
* [The complete redux book](https://camo.githubusercontent.com/e2d8c7d2793f36e8ef5a5ec942ff0f6d1333a873/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f7469746c6570616765732e6c65616e7075622e636f6d2f72656475782d626f6f6b2f6865726f3f3134373639373939333725323025374325323077696474683d323030)
* https://tech.affirm.com/redux-patterns-and-anti-patterns-7d80ef3d53bc
* https://medium.com/@kylpo/redux-best-practices-eef55a20cc72
