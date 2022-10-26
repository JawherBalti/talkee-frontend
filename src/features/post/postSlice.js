import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  posts: [],
  post: {},
  userPosts: [],
  followedPosts: [],
  loading: false,
  userPostsLoading: false,
  updatePostLoading: false,
  deleteLoading: false,
  likeLoading: false,
  followedPostsLoading: false,
  comment: '',
  error: '',
  postMessage: '',
  postRecievedMessage: '',
  followedPostsMessage: '',
  deleteMessage: '',
  likeMessage: '',
  postUpdatedMessage: '',
};

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    // createPost: (state, action) => {
    //   state.user = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllPosts.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllPosts.fulfilled, (state, action) => {
      state.loading = false;
      state.postRecievedMessage = 'posts recieved';
      typeof action.payload === 'string'
        ? (state.postMessage = action.payload)
        : (state.posts = action.payload);
      state.error = '';
    });
    builder.addCase(getAllPosts.rejected, (state, action) => {
      state.loading = false;
      state.posts = [];
      state.postRecievedMessage = '';
      state.error = action.error.message;
    });

    // builder.addCase(createComment.pending, (state) => {
    //   state.commentLoading = true;
    // });
    // builder.addCase(createComment.fulfilled, (state, action) => {
    //   state.commentLoading = false;
    //   state.commentCreatedMessage = action.payload;
    //   state.error = '';
    // });
    // builder.addCase(createComment.rejected, (state, action) => {
    //   state.commentLoading = false;
    //   state.commentCreatedMessage = '';
    //   state.error = action.error.message;
    // });

    // builder.addCase(createPost.pending, (state) => {
    //   state.postLoading = true;
    // });
    // builder.addCase(createPost.fulfilled, (state, action) => {
    //   state.postLoading = false;
    //   state.postMessage = action.payload;
    //   state.error = '';
    // });
    // builder.addCase(createPost.rejected, (state, action) => {
    //   state.postLoading = false;
    //   state.postMessage = '';
    //   state.error = action.error.message;
    // });

    builder.addCase(deletePost.pending, (state) => {
      state.deleteLoading = true;
    });
    builder.addCase(deletePost.fulfilled, (state, action) => {
      state.deleteLoading = false;
      state.deleteMessage = action.payload;
      state.posts = state.posts.filter(
        (p) => p.id !== parseInt(state.deleteMessage.message.split(' ')[1])
      );
      state.userPosts = state.userPosts.filter(
        (p) => p.id !== parseInt(state.deleteMessage.message.split(' ')[1])
      );
      state.error = '';
    });
    builder.addCase(deletePost.rejected, (state, action) => {
      state.deleteLoading = false;
      state.deleteMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(reactToPost.pending, (state) => {
      state.likeLoading = true;
    });
    builder.addCase(reactToPost.fulfilled, (state, action) => {
      state.likeLoading = false;
      state.likeMessage = action.payload;
      state.error = '';
    });
    builder.addCase(reactToPost.rejected, (state, action) => {
      state.likeLoading = false;
      state.likeMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(getFollowedPosts.pending, (state) => {
      state.followedPostsLoading = true;
    });
    builder.addCase(getFollowedPosts.fulfilled, (state, action) => {
      state.followedPostsLoading = false;
      state.followedPosts = action.payload;
      state.followedPostsMessage = 'Posts Recieved!';
      state.error = '';
    });
    builder.addCase(getFollowedPosts.rejected, (state, action) => {
      state.followedPostsLoading = false;
      state.followedPostsMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(getUserPosts.pending, (state) => {
      state.userPostsLoading = true;
    });
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      state.userPostsLoading = false;
      state.userPosts = action.payload;
      state.error = '';
    });
    builder.addCase(getUserPosts.rejected, (state, action) => {
      state.userPostsLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(modifyPost.pending, (state) => {
      state.updatePostLoading = true;
    });
    builder.addCase(modifyPost.fulfilled, (state, action) => {
      state.updatePostLoading = false;
      state.postUpdatedMessage = action.payload;
      getAllPosts();
      state.error = '';
    });
    builder.addCase(modifyPost.rejected, (state, action) => {
      state.updatePostLoading = false;
      state.postUpdatedMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(getOnePost.pending, (state) => {
      state.postLoading = true;
    });
    builder.addCase(getOnePost.fulfilled, (state, action) => {
      state.postLoading = false;
      state.post = action.payload;
      state.error = '';
    });
    builder.addCase(getOnePost.rejected, (state, action) => {
      state.postLoading = false;
      state.error = action.error.message;
    });
  },
});

export const createComment = createAsyncThunk(
  'comment/createComment',
  async (formData) => {
    const { comment, PostId } = formData;
    const message = comment;
    return axios
      .post('http://localhost:3001/api/comment/' + PostId, { message })
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

// export const createPost = createAsyncThunk(
//   'post/createPost',
//   async (formData) => {
//     return axios
//       .post('http://localhost:3001/api/post', formData)
//       .then((res) => {
//         return res.data;
//       })
//       .catch((err) => err.response.data.message);
//   }
// );

export const modifyPost = createAsyncThunk(
  'post/modifyPost',
  async (updateObj) => {
    return axios
      .put(
        'http://localhost:3001/api/post/' + updateObj.postId,
        updateObj.formData
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const reactToPost = createAsyncThunk(
  'like/reactToPost',
  async (PostId) => {
    return axios
      .post('http://localhost:3001/api/like/' + PostId, {})
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const getAllPosts = createAsyncThunk('post/getAllPosts', async () => {
  return axios
    .get('http://localhost:3001/api/post')
    .then((res) => {
      return res.data;
    })
    .catch((err) => err.response.data.message);
});

export const getFollowedPosts = createAsyncThunk(
  'post/getFollowedPosts',
  async (userId) => {
    return axios
      .get('http://localhost:3001/api/post/followed/' + userId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const getOnePost = createAsyncThunk(
  'post/getOnePost',
  async (postId) => {
    return axios
      .get('http://localhost:3001/api/post/' + postId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const getUserPosts = createAsyncThunk(
  'post/getUserPosts',
  async (userId) => {
    return axios
      .get(`http://localhost:3001/api/post/posts/${userId}`)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const deletePost = createAsyncThunk(
  'post/deletePost',
  async (postId) => {
    return axios
      .delete('http://localhost:3001/api/post/' + postId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

// export const { logout } = postSlice.actions;

export default postSlice.reducer;
