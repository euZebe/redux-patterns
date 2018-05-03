const INCREMENT_COUNTER = 'INCREMENT_COUNTER';

export function dispatchSeveralTimes() {
  return (dispatch, getState) => {
    const previousState = getState().counter;
    dispatch({ type: INCREMENT_COUNTER });
    const intermediateState = getState().counter;
    dispatch({ type: INCREMENT_COUNTER });
    const nextState = getState().counter;
    console.log('previous:', previousState, ', intermediate:', intermediateState, ', final:', nextState);
  };
}

export default function counterReducer(counterState = 0, action) {
  switch (action.type) {
    case INCREMENT_COUNTER:
      return counterState + 1;
    default:
      return counterState;
  }
}