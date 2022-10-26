import userReducer from './features/user/userSlice';
import postReducer from './features/post/postSlice';
import commentReducer from './features/comment/commentSlice';
import conversationReducer from './features/conversation/conversationSlice';
import messageReducer from './features/message/messageSlice';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer } from 'redux-persist';

const persistConfig = {
  key: 'root',
  storage,
};

const reducer = combineReducers({
  user: userReducer,
  post: postReducer,
  comment: commentReducer,
  conversation: conversationReducer,
  message: messageReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
});
