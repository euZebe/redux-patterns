import { generate } from 'shortid';
import { createSelector } from 'reselect';
import _sortBy from 'lodash/sortBy';
import { getArticlesById } from './reducers';

export default function articlesReducer(state = {}, action) {
  switch (action.type) {
    case 'FORM_CREATE':
      const id = generate();
      const { title, body, creationDate } = action.payload;
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

export const getArticlesSortedByCreationDate = createSelector(
  getArticlesById,
  articles => articles ? _sortBy(Object.values(articles), a => a.creationDate) : []
);

export const getLastModification = createSelector(
  getArticlesSortedByCreationDate,
  articles => articles.length ? articles[articles.length - 1].creationDate : null
)

const FORM_CREATE = 'FORM_CREATE';
export const createForm = (title, body) => ({
  type: FORM_CREATE,
  payload: {
    title,
    body,
    creationDate: new Date().getTime(),
  }
});