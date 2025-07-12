import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  commentDeleteLoading: false,
  commentDeleteMessage: '',
  commentsByPostId: {}, // This must be initialized as an object
  loading: false,
  error: null,
};

const commentSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    // Optional: Add a reset action if needed
    resetComments: (state) => {
      state.commentsByPostId = {};
    }
  },
  extraReducers: (builder) => {
     builder
      .addCase(getComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.loading = false;
        const { postId, data } = action.payload;
        
        // Ensure commentsByPostId exists
        if (!state.commentsByPostId) {
          state.commentsByPostId = {};
        }
        
        // Safely update the state
        const existingComments = state.commentsByPostId[postId]?.comments || [];
        
        state.commentsByPostId = {
          ...state.commentsByPostId,
          [postId]: {
            comments: data.currentPage === 1 
              ? data.comments 
              : [...existingComments, ...data.comments],
            currentPage: data.currentPage,
            totalPages: data.totalPages,
            hasMore: data.hasMore
          }
        };
      })
      .addCase(getComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

    builder.addCase(deleteComment.pending, (state) => {
      state.commentDeleteLoading = true;
    });
    builder.addCase(deleteComment.fulfilled, (state, action) => {
      state.commentDeleteLoading = false;
      state.commentDeleteMessage = action.payload;
      state.error = '';
    });
    builder.addCase(deleteComment.rejected, (state, action) => {
      state.commentDeleteLoading = false;
      state.commentDeleteMessage = '';
      state.error = action.error.message;
    });
  }
});

export const deleteComment = createAsyncThunk(
  'post/deletePost',
  async (commentId) => {
    return axios
      .delete('http://localhost:3001/api/comment/' + commentId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const getComments = createAsyncThunk(
  'comments/getComments',
  async ({ postId, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/comment/${postId}?page=${page}`);
      return {
        postId,
        data: response.data
      };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load comments');
    }
  }
);
// export const { logout } = postSlice.actions;
export const { resetComments } = commentSlice.actions;
export default commentSlice.reducer;
