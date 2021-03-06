import { createStore } from 'redux';
import deepFreeze from 'deep-freeze';
import { createArticle, getArticlesSortedByCreationDate, getLastModification } from './articles';
import reducer from './reducers';

describe('articles duck', () => {
  test('should update last modification when an article is added', () => {
    const store = createStore(reducer);
    const previousState = deepFreeze(store.getState());
    expect(getLastModification(previousState)).toBeNull();
    expect(getArticlesSortedByCreationDate(previousState)).toHaveLength(0);

    store.dispatch(createArticle('mon titre', 'mon contenu'));

    const nextState = store.getState();
    expect(getLastModification(nextState)).not.toBeNull();
    expect(getArticlesSortedByCreationDate(nextState)).toHaveLength(1);
  });
});