import { createStore } from 'redux';
import deepFreeze from 'deep-freeze';
import { createForm, getArticlesSortedByCreationDate, getLastModification } from './articles';
import reducers from './reducers';

describe('articles duck', () => {
  test('should update last modification when an article is added', () => {
    const store = createStore(reducers);
    const previousState = deepFreeze(store.getState());
    expect(getLastModification(previousState)).toBeNull();
    expect(getArticlesSortedByCreationDate(previousState)).toHaveLength(0);

    store.dispatch(createForm('mon titre', 'mon contenu'));

    const nextState = store.getState();
    expect(getLastModification(nextState)).not.toBeNull();
    expect(getArticlesSortedByCreationDate(nextState)).toHaveLength(1);
  });
});