
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const finalCreateStore = composeEnhancers(
  applyMiddleware(thunk),
)(createStore);

export default function configureStore(initialState) {
  const store = finalCreateStore(
    rootReducer,
    initialState,
  );

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducer
  //   module.hot.accept('../reducer', () => {
  //     const nextReducer = require('../reducer')
  //     store.replaceReducer(nextReducer)
  //   })
  // }

  return store;
}