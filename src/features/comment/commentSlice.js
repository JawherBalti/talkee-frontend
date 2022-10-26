import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  commentDeleteLoading: false,
  commentDeleteMessage: '',
  error: '',
};

const postSlice = createSlice({
  name: 'comment',
  initialState,
  reducers: {
    // createPost: (state, action) => {
    //   state.user = action.payload;
    // },
  },
  extraReducers: (builder) => {
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
  },
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

// export const { logout } = postSlice.actions;

export default postSlice.reducer;
