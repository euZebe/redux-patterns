import { combineReducers } from 'redux';
import articlesReducer from './articles';
import counterReducer from './counter';

// reducer
const reducers = combineReducers({
  articles: articlesReducer,
  counter: counterReducer,
});
export default reducers;

// selectors
export function getArticlesById(state) {
  return state.articles
};

