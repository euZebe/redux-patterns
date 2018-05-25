import { createStore } from 'redux';
import deepFreeze from 'deep-freeze';

import reducer, { getFallenPins, getPlayerState, initGame, throwPin } from '../components/Molkky';

describe('mölkky duck', () => {

  test('should create a new game, removing old players', () => {
    const store = createStore(reducer, {
      Niobe: {
        name: 'Niobe',
        score: 14,
        consecutiveFailures: 1
      }
    });
    const previousState = deepFreeze(store.getState());
    expect(getPlayerState(previousState, 'Niobe').score).toEqual(14);

    store.dispatch(initGame(['Alice', 'Bob']));

    const nextState = store.getState();
    expect(getPlayerState(nextState, 'Niobé')).toBeUndefined();
    expect(getPlayerState(nextState, 'Alice')).toEqual({name: 'Alice', score: 0, consecutiveFailures:0 });
    expect(getPlayerState(nextState, 'Bob')).toEqual({name: 'Bob', score: 0, consecutiveFailures:0 });
  });

  test('should add the single pin number to the previous score when one pin fell, reseting consecutive failures', () => {
    const store = createStore(reducer, { Alice: {name: 'Alice', score: 12, consecutiveFailures: 1 }});
    store.dispatch(throwPin([7], 'Alice'));
    const nextState = store.getState();
    expect(getPlayerState(nextState, 'Alice')).toEqual({ name: 'Alice', score: 19, consecutiveFailures: 0});
  });

  test('should add the amount of fallen pins to the previous score when several pins fell, reseting consecutive failures', () => {
    const store = createStore(reducer, { Alice: {name: 'Alice', score: 12, consecutiveFailures: 1 }});
    store.dispatch(throwPin([7, 12, 1, 2], 'Alice'));
    const nextState = store.getState();
    expect(getPlayerState(nextState, 'Alice')).toEqual({ name: 'Alice', score: 16, consecutiveFailures: 0});
  });

  test('should increment consecutive failures when no pin fell', () => {
    const store = createStore(reducer, { Alice: {name: 'Alice', score: 12, consecutiveFailures: 1 }});
    store.dispatch(throwPin([], 'Alice'));
    const nextState = store.getState();
    expect(getPlayerState(nextState, 'Alice')).toEqual({ name: 'Alice', score: 12, consecutiveFailures: 2});
  });

});