import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  conversations: [],
  oneConversation: [],
  conversationsLoading: false,
  conversationLoading: false,
  conversationCreatedLoading: false,
  updateConversationLoading: false,
  updateMessageLoading: false,
  conversationCreatedMessage: '',
  conversationsMessage: '',
  updateConversationMessage: '',
  updateMessageMessage: '',
  messageReceived: '',
  error: '',
};

const conversationSlice = createSlice({
  name: 'conversation',
  initialState,
  reducers: {
    // createPost: (state, action) => {
    //   state.user = action.payload;
    // },
    receiveMessage: (state, action) => {
      state.oneConversation.push(action.payload);
      state.messageReceived =
        'From ' +
        action.payload.firstUser.senderId +
        ' to ' +
        action.payload.secondUser.receiverId;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(createConversations.pending, (state) => {
      state.conversationCreatedLoading = true;
    });
    builder.addCase(createConversations.fulfilled, (state, action) => {
      state.conversationCreatedLoading = false;
      state.oneConversation.push(action.payload);
      state.error = '';
    });
    builder.addCase(createConversations.rejected, (state, action) => {
      state.conversationCreatedLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(getOneConversation.pending, (state) => {
      state.conversationsLoading = true;
    });
    builder.addCase(getOneConversation.fulfilled, (state, action) => {
      state.conversationsLoading = false;
      state.oneConversation = action.payload;
      state.error = '';
    });
    builder.addCase(getOneConversation.rejected, (state, action) => {
      state.conversationsLoading = false;
      state.oneConversation = [];
      state.error = action.error.message;
    });

    builder.addCase(getAllConversations.pending, (state) => {
      state.conversationLoading = true;
    });
    builder.addCase(getAllConversations.fulfilled, (state, action) => {
      state.conversationLoading = false;
      state.conversations = action.payload;
      state.error = '';
    });
    builder.addCase(getAllConversations.rejected, (state, action) => {
      state.conversationLoading = false;
      state.conversations = [];
      state.error = action.error.message;
    });

    builder.addCase(updateOneConversation.pending, (state) => {
      state.updateConversationLoading = true;
    });
    builder.addCase(updateOneConversation.fulfilled, (state, action) => {
      state.updateConversationLoading = false;
      state.updateConversationMessage = action.payload;
      state.conversations.filter((conv) => conv.unreadMessageSecondUser === 1);
      state.error = '';
    });
    builder.addCase(updateOneConversation.rejected, (state, action) => {
      state.updateConversationLoading = false;
      state.updateConversationMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(updateReceivedMessage.pending, (state) => {
      state.updateMessageLoading = true;
    });
    builder.addCase(updateReceivedMessage.fulfilled, (state, action) => {
      state.updateMessageLoading = false;
      state.updateMessageMessage = action.payload;
      // state.conversations.filter((conv) => conv.unreadMessageSecondUser === 1);
      state.error = '';
    });
    builder.addCase(updateReceivedMessage.rejected, (state, action) => {
      state.updateMessageLoading = false;
      state.updateMessageMessage = '';
      state.error = action.error.message;
    });
  },
});

export const createConversations = createAsyncThunk(
  'conversation/createConversations',
  async (data) => {
    return axios
      .post('http://localhost:3001/api/conversation/' + data.secondUserId, {
        message: data.message,
        firstUser: data.firstUser,
        secondUser: data.secondUser,
        unreadMessageSecondUser: data.unreadMessageSecondUser,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const getOneConversation = createAsyncThunk(
  'conversation/getConversations',
  async (otherUserId) => {
    return axios
      .get('http://localhost:3001/api/conversation/' + otherUserId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const getAllConversations = createAsyncThunk(
  'conversation/getOneConversation',
  async (otherUserId) => {
    return axios
      .get('http://localhost:3001/api/conversation/')
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const updateOneConversation = createAsyncThunk(
  'conversation/updateOneConversation',
  async (otherUserId) => {
    return axios
      .put('http://localhost:3001/api/conversation/' + otherUserId)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const updateReceivedMessage = createAsyncThunk(
  'conversation/updateReceivedMessage',
  async (userIds) => {
    return axios
      .put(
        'http://localhost:3001/api/conversation/message/' + userIds.senderId,
        {
          userId: userIds.receiverId,
        }
      )
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

// export const { logout } = postSlice.actions;
export const { receiveMessage } = conversationSlice.actions;

export default conversationSlice.reducer;
