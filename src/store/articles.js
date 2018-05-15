import { generate } from 'shortid';
import { createSelector } from 'reselect';
import _sortBy from 'lodash/sortBy';
import { getArticlesById } from './reducers';

/*
 * action types
 */
const FORM_CREATE = 'FORM_CREATE';

/*
 * action creators
 */
export const createArticle = (title, body) => ({
  type: FORM_CREATE,
  payload: {
    title,
    body,
    creationDate: new Date().getTime(),
  }
});

/*
 * reducer
 */
export default function articlesReducer(state = {}, action) {
  switch (action.type) {
    case 'FORM_CREATE':
      const id = generate();
      const { title, body, creationDate } = action.payload;
      // FIXME: uncomment to show deepFreeze action
      // state[id].truc = 'machin';
      return {
        ...state,
        [id]: {
          id,
          title,
          body,
          creationDate,
        },
      };
    default:
      return state;
  }
}

/*
 * selectors
 */
export const getArticlesSortedByCreationDate = createSelector(
  getArticlesById,
  articles => articles ? _sortBy(Object.values(articles), a => a.creationDate) : []
);

export const getLastModification = createSelector(
  getArticlesSortedByCreationDate,
  articles => articles.length ? articles[articles.length - 1].creationDate : null
);

