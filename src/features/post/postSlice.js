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
  postLoading: false,
  postRecievedMessage: '',
  followedPostsMessage: '',
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  userPostsCurrentPage: 1,
  userPostsTotalPages: 1,
  userPostsHasMore: false,
  postsLoading: false,
  postsCurrentPage: 1,
  postsTotalPages: 1,
  postsHasMore: false,
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
    // Update the reducer cases
    builder.addCase(getAllPosts.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllPosts.fulfilled, (state, action) => {
      state.loading = false;
      
      // If it's the first page, replace posts, otherwise append
      if (action.payload.currentPage === 1) {
        state.posts = action.payload.posts;
      } else {
        // Filter out duplicates just in case
        const newPosts = action.payload.posts.filter(
          newPost => !state.posts.some(post => post.id === newPost.id)
        );
        state.posts = [...state.posts, ...newPosts];
      }
      
      state.postsCurrentPage = action.payload.currentPage;
      state.postsTotalPages = action.payload.totalPages;
      state.postsHasMore = action.payload.hasMore;
      state.postRecievedMessage = 'Posts received';
      state.error = '';
    });

    builder.addCase(getAllPosts.rejected, (state, action) => {
      state.loading = false;
      state.posts = [];
      state.postRecievedMessage = '';
      state.error = action.error.message;
    });

    // Optimistically add comment
    builder.addCase(createComment.pending, (state, action) => {
      const { PostId, comment } = action.meta.arg;
      const currentUser = action.meta.arg; // User data passed from component
      
      const tempComment = {
        id: `temp-${Date.now()}`,
        message: comment,
        PostId,
        pending: true,
        createdAt: new Date().toISOString(),
        User: currentUser,
        UserId: currentUser.id
      };

      // Add to all relevant post arrays
      const addTempComment = (posts) => {
        return posts.map(post => {
          if (post.id === PostId) {
            return {
              ...post,
              Comments: [tempComment, ...(post.Comments || [])]
            };
          }
          return post;
        });
      };

      state.posts = addTempComment(state.posts);
      state.followedPosts = addTempComment(state.followedPosts);
      state.userPosts = addTempComment(state.userPosts);
    });

    builder.addCase(createComment.fulfilled, (state, action) => {
      const { comment: createdComment } = action.payload;
      const PostId = createdComment.PostId;

      const updateComments = (posts) => {
        return posts.map(post => {
          if (post.id === PostId) {
            // Remove temp comment and add real one
            const filteredComments = (post.Comments || []).filter(
              c => !c.pending
            );
            return {
              ...post,
              Comments: [createdComment, ...filteredComments]
            };
          }
          return post;
        });
      };

      state.posts = updateComments(state.posts);
      state.followedPosts = updateComments(state.followedPosts);
      state.userPosts = updateComments(state.userPosts);
    });

    builder.addCase(createComment.rejected, (state, action) => {
      const { PostId } = action.meta.arg;
      
      const removeTempComment = (posts) => {
        return posts.map(post => {
          if (post.id === PostId) {
            return {
              ...post,
              Comments: (post.Comments || []).filter(c => !c.pending)
            };
          }
          return post;
        });
      };

      state.posts = removeTempComment(state.posts);
      state.followedPosts = removeTempComment(state.followedPosts);
      state.userPosts = removeTempComment(state.userPosts);
    });

    builder.addCase(createPost.pending, (state) => {
      state.postLoading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.postLoading = false;
      state.postMessage = action.payload.message;
      
      // Add the new post to the beginning of the followedPosts array
      if (action.payload.post) {
        state.followedPosts = [action.payload.post, ...(state.followedPosts || [])];
      }
      console.log(state.followedPosts)
      
      state.error = '';
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.postLoading = false;
      state.postMessage = '';
      state.error = action.error.message;
    });

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
      
      if (action.payload.isNewPage) {
        // Replace posts if it's the first page
        state.followedPosts = action.payload.posts;
      } else {
        // Filter out duplicates before adding new posts
        const newPosts = action.payload.posts.filter(
          newPost => !state.followedPosts.some(post => post.id === newPost.id)
        );
        state.followedPosts = [...state.followedPosts, ...newPosts];
      }
      
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.hasMore = action.payload.hasMore;
      state.error = '';
    });
    builder.addCase(getFollowedPosts.rejected, (state, action) => {
      state.followedPostsLoading = false;
      state.followedPostsMessage = '';
      state.error = action.error.message;
    });

    // Update the reducer cases
    builder.addCase(getUserPosts.pending, (state) => {
      state.userPostsLoading = true;
    });
    builder.addCase(getUserPosts.fulfilled, (state, action) => {
      state.userPostsLoading = false;
      // If it's the first page, replace posts, otherwise append
      if (action.payload.currentPage === 1) {
        state.userPosts = action.payload.posts;
      } else {
        // Filter out duplicates just in case
        const newPosts = action.payload.posts.filter(
          newPost => !state.userPosts.some(post => post.id === newPost.id)
        );
        state.userPosts = [...state.userPosts, ...newPosts];
      }
      state.userPostsCurrentPage = action.payload.currentPage;
      state.userPostsTotalPages = action.payload.totalPages;
      state.userPostsHasMore = action.payload.hasMore;
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
      state.error = '';
      
      // Get the updated post data from the action meta
      const { postId, formData } = action.meta.arg;
      const updatedPost = {
        content: formData.content,
        attachmentUrl: formData.attachmentUrl
      };

      // Helper function to update posts in different arrays
      const updatePostInArray = (postArray) => {
        return postArray.map(post => 
          post.id === postId 
            ? { ...post, ...updatedPost } 
            : post
        );
      };

      // Update all relevant post lists
      if (state.posts) {
        state.posts = updatePostInArray(state.posts);
      }
      if (state.userPosts) {
        state.userPosts = updatePostInArray(state.userPosts);
      }
      if (state.followedPosts) {
        state.followedPosts = updatePostInArray(state.followedPosts);
      }
      
      // Also update the single post if it's the one being edited
      if (state.post && state.post.id === postId) {
        state.post = { ...state.post, ...updatedPost };
      }
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

// In postSlice.js
export const createComment = createAsyncThunk(
  'post/createComment',
  async (formData, { getState }) => {
    const { PostId, comment } = formData;
    const state = getState();
    const currentUser = state.user.userLogin.user;
    
    try {
      const response = await axios.post(
        `http://localhost:3001/api/comment/${PostId}`,
        { message: comment }
      );
      
      return {
        ...response.data,
        user: currentUser
      };
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Failed to create comment');
    }
  }
);

export const createPost = createAsyncThunk(
  'post/createPost',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:3001/api/post', formData);
      return response.data;  // Will now include the full post object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create post');
    }
  }
);

export const modifyPost = createAsyncThunk(
  'post/modifyPost',
  async (updateObj, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/post/${updateObj.postId}`,
        updateObj.formData
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update post');
    }
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

export const getAllPosts = createAsyncThunk(
  'post/getAllPosts',
  async ({ page = 1 } = {}) => {
    return axios
      .get(`http://localhost:3001/api/post?page=${page}`, { withCredentials: true })
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response?.data?.message || 'Failed to load posts');
      });
  }
);

export const getFollowedPosts = createAsyncThunk(
  'post/getFollowedPosts',
  async ({ userId, page = 1 }, { getState }) => {
    // If page > 1, we need to calculate the correct offset
    const adjustedPage = page;
    return axios
      .get(`http://localhost:3001/api/post/followed/${userId}?page=${adjustedPage}`, { 
        withCredentials: true 
      })
      .then((res) => ({
        ...res.data,
        isNewPage: page === 1 // Flag to indicate if we're loading a new page
      }))
      .catch((err) => {
        throw new Error(err.response?.data?.message || 'Failed to load posts');
      });
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
  async ({ userId, page = 1 }) => {
    return axios
      .get(`http://localhost:3001/api/post/posts/${userId}?page=${page}`)
      .then((res) => res.data)
      .catch((err) => {
        throw new Error(err.response?.data?.message || 'Failed to load posts');
      });
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
