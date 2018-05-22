const { createStore } = require('redux');

/*
  ACTIONS (and rather ACTION CREATORS)
 */

/**
 * @param players: string[]
 * @returns {{ type: string, players: string[] }}
 */
function initGame(players) {
  console.log('=> jeu initialisé');
  return {
    type: 'INIT_SCORES_SHEET',
    players, // same as players: players
  };
}

/**
 *
 * @param fallenPins: number[]
 * @param player: string
 * @returns {{ type: string, player: string, fallenPins: number[] }}
 */
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


/*
  REDUCER
 */

/**
 * @param previousState shape = {
 *    fallenPins: number,
 *    playerX: {      // iterated over players
 *      name: string,
 *      score: number,
 *      consecutiveFailures: number,
 *    }
 * }
 * @param action
 * @returns a new state, with the shape described above
 */
function rootReducer(previousState = {}, action) {
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
      const previousPlayerState = previousState[player];

      // no pin fell
      if (!fallenPins.length) {
        const nextPlayerState = {
          ...previousPlayerState,
          consecutiveFailures: previousPlayerState.consecutiveFailures + 1, // pas de ++, on ne modifie pas previousPlayerState
        };
        return {
          ...previousState,
          fallenPins: fallenPins.length,
          [player]: nextPlayerState,
        };
      }

      // one pin fell
      if (fallenPins.length === 1) {
        const nextPlayerState = {
          ...previousPlayerState,
          score: previousPlayerState.score + fallenPins[0],
          consecutiveFailures: 0,
        };
        return {
          ...previousState,
          fallenPins: fallenPins.length,
          [player]: nextPlayerState,
        };
      }

      // else, several pins fell

      // TODO: toggle this block and the next one to make reducer unpure
      const nextPlayerState = {
        ...previousPlayerState,
        score: previousPlayerState.score + fallenPins.length,
        consecutiveFailures: 0,
      };
      return {
        ...previousState,
        fallenPins: fallenPins.length,
        [player]: nextPlayerState
      };

      // FIXME: unpure reducer: state mutated => audience and referee won't see the action
      previousState[player].score += fallenPins.length;
      previousState[player].consecutiveFailures = 0;
      previousState.fallenPins = fallenPins.length;
      return previousState;

      // FIXME: unpure reducer: nested state mutated => player listener won't see the action
      // FIXME: !! BobListener listens modifications on Bob's substate
      // const nextState = { ...previousState, fallenPins: fallenPins.length };
      // nextState[player].consecutiveFailures = 0;
      // nextState[player].score += fallenPins.length;
      // return nextState;

    default:
      return previousState;
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
const playerListener = (name) => {
  let cachedState = store.getState()[name];
  return () => {
    const playerState = store.getState()[name];
    if (playerState !== cachedState) {
      console.log(`${name}: ${playerState.score}, échecs en cours: ${playerState.consecutiveFailures}`);
    }
    cachedState = playerState;
  }
};

// Listen to the sub-state corresponding to its player
const AliceListener = playerListener('Alice');
const BobListener = playerListener('Bob');

/**
 * function which keeps a cache of the currentState, updated at the end of the
 * @returns {Function}
 */
const crowd = () => {
  let cachedState = store.getState();
  return () => {
    const nextState = store.getState();
    if (nextState !== cachedState) {
      const fallenPinsOnLastThrow = nextState.fallenPins;
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


// store.subscribe returns a function to unregister the listener
store.subscribe(AliceListener);
store.subscribe(BobListener);
store.subscribe(crowd());

store.dispatch(initGame(['Alice', 'Bob']));
store.dispatch(throwPin([12, 4, 6, 2], 'Alice'));
store.dispatch(throwPin([], 'Bob'));
store.dispatch(throwPin([11], 'Alice'));
store.dispatch(throwPin([], 'Bob'));
store.dispatch(throwPin([], 'Alice'));
store.dispatch(throwPin([3, 6, 7, 1, 10, 12], 'Bob'));
