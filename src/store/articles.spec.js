import { createStore } from 'redux';
import { createForm, getArticlesSortedByCreationDate, getLastModification } from './articles';
import reducers from './reducers';

describe('articles duck', () => {
  test('should update last modification when an article is added', () => {
    const store = createStore(reducers);
    expect(getLastModification(store.getState())).toBeNull();
    expect(getArticlesSortedByCreationDate(store.getState())).toHaveLength(0);

    store.dispatch(createForm('mon titre', 'mon contenu'));

    expect(getLastModification(store.getState())).not.toBeNull();
    expect(getArticlesSortedByCreationDate(store.getState())).toHaveLength(1);
  });
});