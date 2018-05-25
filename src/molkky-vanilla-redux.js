import { createStore } from 'redux';
import reducer, { getFallenPins, getPlayerState, initGame, throwPin } from './molkky';

// init store
const store = createStore(reducer);


/**
 * Listener which keeps a cache of the player state, executing itself only on new player state
 * @param name
 * @returns {Function}
 * @constructor
 */
export const playerListener = (name) => {
  let cachedState = getPlayerState(store.getState(), name);
  return () => {
    const playerState = getPlayerState(store.getState(), name);
    if (playerState !== cachedState) {
      console.log(`${name}: ${playerState.score}, échecs en cours: ${playerState.consecutiveFailures}`);
    }
    cachedState = playerState;
  }
};

/**
 * function which keeps a cache of the currentState, updated at the end of the
 * @returns {Function}
 */
export const crowdListener = () => {
  let cachedState = store.getState();
  return () => {
    const nextState = store.getState();
    if (nextState !== cachedState) {
      const fallenPinsOnLastThrow = getFallenPins(nextState);
      if (fallenPinsOnLastThrow) {
        console.log('Spectateurs: 👏👏👏👏\n');
      } else if (fallenPinsOnLastThrow === 0) {
        console.log('Spectateurs: 😞\n');
      }
    } else {
      console.log('\t\t\t/!\\ L\'ASSISTANCE N\'A RIEN VU ?!');
    }
    cachedState = nextState;
  }
};


// Listen to the sub-state corresponding to its player
const AliceListener = playerListener('Alice');
const BobListener = playerListener('Bob');

// store.subscribe returns a function to unregister the listener
store.subscribe(AliceListener);
store.subscribe(BobListener);
store.subscribe(crowdListener());

store.dispatch(initGame(['Alice', 'Bob']));
store.dispatch(throwPin([12, 4, 6, 2], 'Alice'));
store.dispatch(throwPin([], 'Bob'));
store.dispatch(throwPin([11], 'Alice'));
store.dispatch(throwPin([], 'Bob'));
store.dispatch(throwPin([], 'Alice'));
store.dispatch(throwPin([3, 6, 7, 1, 10, 12], 'Bob'));
