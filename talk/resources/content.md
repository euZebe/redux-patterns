# Redux
___
Jean Martineau-Figuette <!-- .element class="align-right" -->

~~~
## Programme
📅 <!-- .element class="slide-icon" -->

1. présentation des concepts
- travaux pratiques

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
- séparation des responsabilités Redux vs UI

~~~
## Que signifie "reduce" ?
```
[1, 2, 3, 5, 8, 13].reduce((aggregator, value) => {
  return aggregator + value;
}, 6); // <= initial value

// returns 32
```
~~~
## another example
```
[
  {code: 'fr', popul: 66}, 
  {code:'fin', popul: 5}, 
  {code: 'can', popul: 36}
].reduce((aggregator, country) => {
  aggregator[country.code] = country.popul;
  return aggregator;
}, {});

// => {fr: 66, fin: 5, can: 36}
```
~~~
## 3 principes
1. _single source of truth_
1. _state_ en lecture seule
1. changements de _state_ par fonctions pures (_reducers_)

Note:
1. L'état de l'application est défini par un seul objet, géré par un _store_ unique.
2. PAS DE MUTATION
~~~
## fonction pure / impure
```javascript
// pure
function withVAT(value) {
  return value * 1.206;
}

// impure
let counter = 2;
function addToCounter(value) {
  return counter += value; // dépend d'un contexte, counter
}

```

~~~
## Flux Redux

![Redux flow](resources/Redux.png) <!-- .element class="no-border-image" -->

Note:
flux unidirectionnel

1. action "dispatchée" dans le store
- le store exécute le reducer
- (oldState, action) => newState
- listeners notifiés d'un possible changement de state

Rappeler contenu du store

///
## action
```javascript
{
    type: 'TASK_ADD',
    title: 'speak about actions'
}
     
```

~~~
## dispatch
fonction de l'objet `store`
```javascript
store.dispatch({ 
  type: 'TASK_ADD', 
  title: 'speak about dispatch' 
})
```

~~~
## action creator
```javascript
const addTask = title => ({
    type: 'TASK_ADD', 
    title: title,
    id: generateID()
});

store.dispatch(addTask('speak about action creators'))
```
permet d'abstraire la mécanique interne (type, génération d'ID)

~~~
## reducer
```javascript
function reducer(state = [], action) {
// [] ==> initial value, if state is undefined
  switch (action.type) {
    
    case 'TASK_ADD':
      return [...state, action.title];
    
    case 'TASK_REMOVE':
      return state.filter(task => task !== action.title);
    
    default:
      return state; // don't forget me !
  }
}
```

~~~
## accès au state
```javascript
store.getState()
```
Note:
state immutable ; pas de setState
~~~
## subscriber
fonctions notifiées à chaque dispatch
```javascript
store.subscribe(() => {
  console.clear();
  console.table(store.getState());
});

```

~~~
## combine reducers
```javascript
import { combineReducers } from 'redux';

const filterReducer = (state, action) => (
    action.type === 'FILTER_CHANGE' 
        ? action.filter 
        : state
);

const rootReducer = combineReducers({
    tasks: tasksReducer,
    filter: filterReducer    
});
```
Note:
- chaque sous-reducer manipule son petit périmètre

///

### redux devtools
![](https://media.giphy.com/media/yPO3Yxx3jRSlG/giphy_s.gif)
- visualisation des actions exécutées
- déclenchement d'une action à la main
- voyage dans le temps

Note:
- cas d'usage: un message d'info qui disparaît au bout de 3 secondes
- DEMO

