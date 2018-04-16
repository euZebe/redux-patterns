import { combineReducers } from 'redux';
import articlesReducer from './articles';

// reducer
const reducers = combineReducers({
  articles: articlesReducer,
});
export default reducers;

// selectors
export function getArticlesById(state) {
  return state.articles
};

