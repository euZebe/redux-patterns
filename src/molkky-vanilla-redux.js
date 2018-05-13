const { createStore } = require('redux');

const action = {
  type: 'INIT_SCORES_SHEET',
  players: ['Alice', 'Bob']
};

function initGame(players) {
  console.log("=> jeu initialisé");
  // TODO: check no duplicates
  return {
    type: 'INIT_SCORES_SHEET',
    players, // same as players: players
  };
}

function throwPin(fallenPins = [], player) {
  if (fallenPins.length) {
    console.log(`${player} a fait tomber la/les quille.s ${fallenPins}`);
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

    default:
      return state;
  }
}

// init store
const store = createStore(rootReducer);

// define listeners
function PlayerListener(name) {
  return () => {
    const playerState = store.getState()[name];
    if (playerState) {
      console.log(`${name}: ${playerState.score}, ${playerState.consecutiveFailures} échecs en cours`);
    }
  }
}

const AliceListener = PlayerListener('Alice');
const BobListener = PlayerListener('Bob');

function crowd() {
  const fallenPinsOnLastThrow = store.getState().fallenPins;
  if (fallenPinsOnLastThrow) {
    console.log('👏👏 audience applauses 👏👏\n');
  } else {
    console.log('😞😞\n');
  }
}

// store.subscribe returns a function to unregister the listener
const unsubscribeAliceListener = store.subscribe(AliceListener);
const unsubscribeBobListener = store.subscribe(BobListener);
store.subscribe(crowd);

store.dispatch(initGame(['Alice', 'Bob']));
store.dispatch(throwPin([12, 4, 6, 2], 'Alice'));
store.dispatch(throwPin([], 'Bob'));
store.dispatch(throwPin([11], 'Alice'));
store.dispatch(throwPin([], 'Bob'));
store.dispatch(throwPin([], 'Alice'));
store.dispatch(throwPin([3, 6, 7, 1, 10, 12], 'Bob'));
