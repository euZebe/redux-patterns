import { combineReducers } from 'redux';
import articlesReducer from './articles';

// reducer
const reducers = combineReducers({
  articles: articlesReducer,
});
export default reducers;

// selectors
export const getArticles = state => state.articlesById;

