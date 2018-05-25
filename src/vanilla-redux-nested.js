const { createStore } = require('redux');
function rootReducer(previousState = {family: { parent1: {}}}, action) {
  console.log(`>\n> ${action.type}`);
  switch (action.type) {

    case 'INIT_FAMILY':
      return {
        family: {
          parent1: {
            child1: { name: 'Niobé' },
            child2: { name: 'Ernest' },
            child3: { name: 'Eusèbe' },
            name: 'Mademoiselle',
          },
        },
      };

    case 'CHANGE_CHILD2_NAME':
      return {
        ...previousState,
        family: {
          ...previousState.family,
          parent1: {
            ...previousState.family.parent1,
            child1: {name: 'Nio' }
          }
        }
      };

    case 'CHANGE_PARENT1_NAME':
      return {
        ...previousState,
        family: {
          ...previousState.family,
          parent1: {
            ...previousState.family.parent1,
            name: 'Madame'
          }
        }
      };

    default:
      return previousState;
  }
}

// init store
const store = createStore(rootReducer);

const listenerOnParent = () => {
  let cachedState = store.getState().family.parent1;
  return () => {
    const nextState = store.getState().family.parent1;
    if (nextState !== cachedState) {
      console.log('> parent state changed');
    } else {
      console.log('> no parent state change');
    }
    cachedState = nextState;
  }
};

const listenerOnChild2 = () => {
  let cachedState = store.getState().family.parent1.child2;
  return () => {
    const nextState = store.getState().family.parent1.child2;
    if (nextState !== cachedState) {
      console.log('> child2 state changed')
    } else {
      console.log('> no child2 state change');
    }
    cachedState = nextState;
  }
};

store.subscribe(listenerOnChild2());
store.subscribe(listenerOnParent());

store.dispatch({ type: 'INIT_FAMILY' });
store.dispatch({ type: 'CHANGE_CHILD2_NAME' });
store.dispatch({ type: 'CHANGE_PARENT1_NAME' });
