import { createSlice, createAsyncThunk, current } from '@reduxjs/toolkit';
import axios from 'axios';

axios.defaults.withCredentials = true;

const initialState = {
  user: {},
  currentUser: {},
  updatedUser: {},
  isLoggedIn: false,
  users: [],
  usersFound: [],
  error: '',
  userLogin: {},
  message: '',
  signupMessage: '',
  postMessage: '',
  commentCreatedMessage: '',
  followMessage: '',
  unfollowMessage: '',
  loading: false,
  postLoading: false,
  commentLoading: false,
  userLoading: false,
  currentUserLoading: false,
  updateUserLoading: false,
  updateRoleLoading: false,
  updatePasswordLoading: false,
  findUserLoading: false,
  blockUserLoading: false,
  followUserLoading: false,
  unfollowUserLoading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // login: (state, action) => {
    //   state.user = action.payload;
    // },
    setUserStatus: (state, action) => {
      state.users.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload;
      state.error = '';
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.users = [];
      state.error = action.error.message;
    });

    builder.addCase(getUser.pending, (state) => {
      state.userLoading = true;
    });
    builder.addCase(getUser.fulfilled, (state, action) => {
      state.userLoading = false;
      state.user = action.payload;
      state.error = '';
    });
    builder.addCase(getUser.rejected, (state, action) => {
      state.userLoading = false;
      state.user = '';
      state.error = action.error.message;
    });

    builder.addCase(getCurrentUser.pending, (state) => {
      state.currentUserLoading = true;
    });
    builder.addCase(getCurrentUser.fulfilled, (state, action) => {
      state.currentUserLoading = false;
      state.currentUser = action.payload;
      state.error = '';
    });
    builder.addCase(getCurrentUser.rejected, (state, action) => {
      state.currentUserLoading = false;
      state.user = '';
      state.error = action.error.message;
    });

    builder.addCase(signup.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(signup.fulfilled, (state, action) => {
      state.loading = false;
      state.signupMessage = action.payload;
      state.error = '';
    });
    builder.addCase(signup.rejected, (state, action) => {
      state.loading = false;
      state.signupMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.userLogin = action.payload;
      if (typeof state.userLogin === 'string') state.isLoggedIn = false;
      else if (typeof state.userLogin === 'object') state.isLoggedIn = true;
      state.error = '';
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(logout.pending, (state) => {
      state.logoutLoading = true;
    });
    builder.addCase(logout.fulfilled, (state, action) => {
      state.logoutLoading = false;
      state.userLogin = {};
      state.isLoggedIn = false;
      state.error = '';
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.logoutLoading = false;
      state.error = action.error.message;
    });

    builder.addCase(createComment.pending, (state) => {
      state.commentLoading = true;
    });
    builder.addCase(createComment.fulfilled, (state, action) => {
      state.commentLoading = false;
      state.commentCreatedMessage = action.payload;
      state.error = '';
    });
    builder.addCase(createComment.rejected, (state, action) => {
      state.commentLoading = false;
      state.commentCreatedMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(createPost.pending, (state) => {
      state.postLoading = true;
    });
    builder.addCase(createPost.fulfilled, (state, action) => {
      state.postLoading = false;
      state.postMessage = action.payload;
      state.error = '';
    });
    builder.addCase(createPost.rejected, (state, action) => {
      state.postLoading = false;
      state.postMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.updateUserLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.updateUserLoading = false;
      state.message = action.payload;
      state.error = '';
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.updateUserLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(updateAvatar.pending, (state) => {
      state.updateUserLoading = true;
    });
    // builder.addCase(updateAvatar.fulfilled, (state, action) => {
    //   state.updateUserLoading = false;
    //   state.message = action.payload;
    //   state.error = '';
    // });
    builder.addCase(updateAvatar.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.user) {
        state.currentUser.user = action.payload.user;
        state.message = action.payload;
        state.error = '';
      }
    });
    builder.addCase(updateAvatar.rejected, (state, action) => {
      state.updateUserLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(updateBanner.pending, (state) => {
      state.updateUserLoading = true;
    });
    // builder.addCase(updateBanner.fulfilled, (state, action) => {
    //   state.updateUserLoading = false;
    //   state.message = action.payload;
    //   state.error = '';
    // });
    builder.addCase(updateBanner.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload?.user) {
        state.currentUser.user = action.payload.user;
        state.message = action.payload;
        state.error = '';
      }
    });
    builder.addCase(updateBanner.rejected, (state, action) => {
      state.updateUserLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(updateUserInfo.pending, (state) => {
      state.updateUserLoading = true;
    });
    builder.addCase(updateUserInfo.fulfilled, (state, action) => {
      state.updateUserLoading = false;
      state.message = action.payload;
      state.error = '';
    });
    builder.addCase(updateUserInfo.rejected, (state, action) => {
      state.updateUserLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(blockUser.pending, (state) => {
      state.blockUserLoading = true;
    });
    builder.addCase(blockUser.fulfilled, (state, action) => {
      state.blockUserLoading = false;
      state.message = action.payload.message;
      state.updatedUser = action.payload.user;
      state.error = '';
    });
    builder.addCase(blockUser.rejected, (state, action) => {
      state.blockUserLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(updateUserRole.pending, (state) => {
      state.updateRoleLoading = true;
    });
    builder.addCase(updateUserRole.fulfilled, (state, action) => {
      state.updateRoleLoading = false;
      state.message = action.payload;
      state.error = '';
    });
    builder.addCase(updateUserRole.rejected, (state, action) => {
      state.updateRoleLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(updatePassword.pending, (state) => {
      state.updatePasswordLoading = true;
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      state.updatePasswordLoading = false;
      state.message = action.payload;
      state.error = '';
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      state.updatePasswordLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(findUser.pending, (state) => {
      state.findUserLoading = true;
    });
    builder.addCase(findUser.fulfilled, (state, action) => {
      state.findUserLoading = false;
      state.usersFound = action.payload;
      state.error = '';
    });
    builder.addCase(findUser.rejected, (state, action) => {
      state.findUserLoading = false;
      state.message = '';
      state.error = action.error.message;
    });

    builder.addCase(followUser.pending, (state) => {
      state.followUserLoading = true;
    });
    builder.addCase(followUser.fulfilled, (state, action) => {
      state.followUserLoading = false;
      state.followMessage = action.payload;
      state.error = '';
    });
    builder.addCase(followUser.rejected, (state, action) => {
      state.followUserLoading = false;
      state.followMessage = '';
      state.error = action.error.message;
    });

    builder.addCase(unfollowUser.pending, (state) => {
      state.unfollowUserLoading = true;
    });
    builder.addCase(unfollowUser.fulfilled, (state, action) => {
      state.unfollowUserLoading = false;
      state.unfollowMessage = action.payload;
      state.error = '';
    });
    builder.addCase(unfollowUser.rejected, (state, action) => {
      state.unfollowUserLoading = false;
      state.unfollowMessage = '';
      state.error = action.error.message;
    });
  },
});

//createAsyncThunk: automatically dispatch lifecycle actions based on returned promise
//a promise is either pending, fulfilled or rejected
export const getAllUsers = createAsyncThunk('user/getUsers', () => {
  return axios.get('http://localhost:3001/api/user').then((res) => res.data);
});

export const getUser = createAsyncThunk('user/getUser', async (userId) => {
  return axios
    .get(`http://localhost:3001/api/user/${userId}`)
    .then((res) => res.data);
});

export const getCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (userId) => {
    return axios
      .get(`http://localhost:3001/api/user/${userId}`)
      .then((res) => res.data);
  }
);

export const findUser = createAsyncThunk('user/findUser', async (user) => {
  return axios
    .post(`http://localhost:3001/api/user/search`, { user: user })
    .then((res) => res.data);
});

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (updateObj) => {
    console.log(updateObj);
    return axios
      .put(`http://localhost:3001/api/user/${updateObj.userId}`, {
        firstName: updateObj.formData.firstName,
        familyName: updateObj.formData.familyName,
      })
      .then((res) => {
        console.log(res.data);
        return res.data;
      });
  }
);

export const updateUserInfo = createAsyncThunk(
  'user/updateUserInfo',
  async (updateObj) => {
    console.log(updateObj);
    return axios
      .put(`http://localhost:3001/api/user/${updateObj.userId}`, {
        biography: updateObj.formData.bio,
        skills: updateObj.formData.skills,
      })
      .then((res) => {
        return res.data;
      });
  }
);

export const updateUserRole = createAsyncThunk(
  'user/updateUserRole',
  async (updateObj) => {
    return axios
      .put(`http://localhost:3001/api/user/${updateObj.userId}`, {
        role: updateObj.formData.newRole,
      })
      .then((res) => {
        return res.data;
      });
  }
);

export const blockUser = createAsyncThunk(
  'user/blockUser',
  async (updateObj) => {
    return axios
      .put(`http://localhost:3001/api/user/${updateObj.userId}`, {
        isBlocked: updateObj.formData.block,
      })
      .then((res) => {
        console.log(updateObj.formData.block);
        return res.data;
      });
  }
);

export const updateAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (updateObj) => {
    return axios
      .put(
        `http://localhost:3001/api/user/${updateObj.userId}`,
        updateObj.formData
      )
      .then((res) => {
        return res.data;
      });
  }
);

export const updateBanner = createAsyncThunk(
  'user/updateBanner',
  async (updateObj) => {
    return axios
      .put(
        `http://localhost:3001/api/user/banner/${updateObj.userId}`,
        updateObj.formData
      )
      .then((res) => {
        return res.data;
      });
  }
);

export const updatePassword = createAsyncThunk(
  'user/updatePassword',
  async (updateObj) => {
    return axios
      .put(`http://localhost:3001/api/user/pwd/${updateObj.userId}`, {})
      .then((res) => res.data);
  }
);

export const signup = createAsyncThunk('user/signup', async (formData) => {
  return axios
    .post('http://localhost:3001/api/user/signup', formData)
    .then((res) => {
      return res.data.message;
    })
    .catch((err) => err.response.data.message);
});

export const login = createAsyncThunk('user/login', async (formData) => {
  return axios
    .post('http://localhost:3001/api/user/login', formData)
    .then((res) => {
      return res.data;
    })
    .catch((err) => err.response.data.message);
});

export const createComment = createAsyncThunk(
  'comment/createComment',
  async (formData) => {
    const { PostId, comment } = formData;
    const response = await axios
      .post('http://localhost:3001/api/comment/' + PostId, { message: comment })
    return response.data; // Ensure this includes { id, PostId, UserId, message, createdAt, etc. }
  }
);


export const createPost = createAsyncThunk(
  'post/createPost',
  async (formData) => {
    return axios
      .post('http://localhost:3001/api/post', formData)
      .then((res) => {
        return res.data;
      })
      .catch((err) => err.response.data.message);
  }
);

export const logout = createAsyncThunk('user/logout', async (formData) => {
  return axios
    .post('http://localhost:3001/api/user/logout', {})
    .then((res) => {
      return res.data;
    })
    .catch((err) => new Error('An Error Happened While Logging Out ! '));
});

export const followUser = createAsyncThunk(
  'user/followUser',
  async (userId) => {
    return axios
      .post(`http://localhost:3001/api/follow/${userId}`, {})
      .then((res) => res.data);
  }
);

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (userId) => {
    return axios
      .delete(`http://localhost:3001/api/follow/${userId}`, {})
      .then((res) => res.data);
  }
);

//add like reducer here

export const { setUserStatus } = userSlice.actions;

export default userSlice.reducer;
