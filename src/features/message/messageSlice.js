import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  messages: [],
  message: {},
  messagesLoading: false,
  messageCreatedLoading: false,
  error: '',
};

const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    // createPost: (state, action) => {
    //   state.user = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(createMessage.pending, (state) => {
      state.messageCreatedLoading = true;
    });
    builder.addCase(createMessage.fulfilled, (state, action) => {
      state.messageCreatedLoading = false;
      state.message = action.payload;
      state.error = '';
    });
    builder.addCase(createMessage.rejected, (state, action) => {
      state.messageCreatedLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(getMessages.pending, (state) => {
      state.messagesLoading = true;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.messagesLoading = false;
      state.messages = action.payload;
      state.error = '';
    });
    builder.addCase(getMessages.rejected, (state, action) => {
      state.messagesLoading = false;
      state.messages = '';
      state.error = action.error.message;
    });
  },
});

export const createMessage = createAsyncThunk(
  'message/createMessages',
  async (conversationId) => {
    return axios
      .post('http://localhost:3001/api/message/' + conversationId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const getMessages = createAsyncThunk(
  'message/getMessages',
  async (conversationId) => {
    return axios
      .get('http://localhost:3001/api/message/' + conversationId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

// export const { logout } = postSlice.actions;

export default messageSlice.reducer;
