
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
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept('../reducers', () => {
  //     const nextReducer = require('../reducers')
  //     store.replaceReducer(nextReducer)
  //   })
  // }

  return store;
}