const { createStore } = require('redux');

// here is a non-normalized state
// FIXME: duplication on author name: when changed, think about changing it everywhere
const blogPosts = {
  post1: {
    id: "post1",
    author: { username: "user1", name: "User 1" },
    body: "......",
    comments: {
      comment1: {
        id: "comment1",
        author: { username: "user2", name: "User 2" },
        comment: ".....",
      },
      comment2: {
        id: "comment2",
        author: { username: "user3", name: "User 3" },
        comment: ".....",
      }
    }
  },
  post2: {
    id: "post2",
    author: { username: "user2", name: "User 2" },
    body: "......",
    comments: {
      comment3: {
        id: "comment3",
        author: { username: "user3", name: "User 3" },
        comment: ".....",
      },
      comment4: {
        id: "comment4",
        author: { username: "user1", name: "User 1" },
        comment: ".....",
      },
      comment5: {
        id: "comment5",
        author: { username: "user3", name: "User 3" },
        comment: ".....",
      }
    }
  }
};

const reducer = (previousState, action) => {
  console.log(`\n${action.type} dispatched`);
  switch (action.type) {
    case 'COMMENT_UPDATE':
      const { blogPostID, commentID, comment } = action;

      // FIXME difficulty to generate a new state from the previous one, just changing a comment
      return {
        ...previousState,
        [blogPostID]: {
          ...previousState[blogPostID],
          comments: {
            ...previousState[blogPostID].comments,
            [commentID]: {
              ...previousState[blogPostID].comments[commentID],
              comment,
            }
          }
        }
      };
    default:
      return previousState;
  }
};

const store = createStore(reducer, blogPosts);

// this listener keeps a cached reference of the given post's nested state
const postListener = (postID) => {
  let cachedPost = store.getState()[postID];
  return () => {
    const nextPost = store.getState()[postID];
    if (cachedPost !== nextPost) {
      console.log(`Post ${postID} updated ! /!\\`);
    } else {
      console.log(`Post ${postID} unchanged.`);
    }
    cachedPost = nextPost;
  }
};

store.subscribe(postListener('post1'));
store.subscribe(postListener('post2'));

store.dispatch({ type: 'COMMENT_UPDATE', blogPostID: 'post1', commentID: 'comment2', comment: 'bidule' });
// => COMMENT_UPDATE dispatched
// Post post1 updated ! /!\
// Post post2 unchanged.

// FIXME :( reference to post1 changed whereas just a nested state attribute changed
// This means components displaying only post1 data (without comment), and hence subscribing to post1 state changes,
// could be refreshed unnecessarly