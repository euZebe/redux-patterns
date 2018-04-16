import { generate } from 'shortid';

const defaultState = {};

export default function articlesReducer(state = defaultState, action) {
  switch (action.type) {
    case FORM_CREATE:
      const id = generate();
      const { title, body } = action.payload;
      return {
        ...state,
        [id]: {
          id,
          title,
          body,
        },
      };
    default:
      return state;
  }
}

const FORM_CREATE = 'FORM_CREATE';
export const createForm = (title, body) => ({
  type: FORM_CREATE,
  payload: {
    title,
    body,
  }
});