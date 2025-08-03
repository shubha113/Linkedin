import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import api from "../../utils/api.js";

// Create post thunk
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/post/create", postData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get All post thunk
export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async ({ limit = 10, lastCreatedAt }, { rejectWithValue }) => {
    try {
      let url = `/api/v1/post/posts?limit=${limit}`;
      if (lastCreatedAt) {
        url += `&lastCreatedAt=${lastCreatedAt}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Get user posts thunk
export const getUserPosts = createAsyncThunk(
  "posts/getUserPosts",
  async ({ userId, limit = 10, lastCreatedAt }, { rejectWithValue }) => {
    try {
      let url = `/api/v1/post/user-posts/${userId}?limit=${limit}`;
      if (lastCreatedAt) {
        url += `&lastCreatedAt=${lastCreatedAt}`;
      }
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Like post thunk
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/post/${id}/like`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

// Comment thunk
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ id, comment }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/post/${id}/comment`, {
        comment,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  posts: [],
  currentPost: null,
  loading: false,
  error: null,
  hasMore: true,
  createLoading: false,
};

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentPost: (state) => {
      state.currentPost = null;
    },
    resetPosts: (state) => {
      state.posts = [];
      state.hasMore = true;
    },
    updatePostInList: (state, action) => {
      const updatedPost = action.payload;
      const index = state.posts.findIndex(
        (post) => post._id === updatedPost._id
      );
      if (index !== -1) {
        state.posts[index] = updatedPost;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Post
      .addCase(createPost.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.createLoading = false;
        state.posts.unshift(action.payload.post);
        toast.success(action.payload.message);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get All Posts
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.lastCreatedAt) {
          state.posts = [...state.posts, ...action.payload.posts];
        } else {
          state.posts = action.payload.posts;
        }
        state.hasMore = action.payload.hasMore;
      })
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Get User Posts
      .addCase(getUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        if (action.meta.arg.lastCreatedAt) {
          state.posts = [...state.posts, ...action.payload.posts];
        } else {
          state.posts = action.payload.posts;
        }
      })
      .addCase(getUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Like Post
      .addCase(likePost.fulfilled, (state, action) => {
        const updatedPost = action.payload.post;

        // Update in posts array
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }

        // Update current post if it's the same
        if (state.currentPost && state.currentPost._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }

        toast.success(action.payload.message);
      })
      .addCase(likePost.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      })

      // Add Comment
      .addCase(addComment.fulfilled, (state, action) => {
        const updatedPost = action.payload.post;

        // Update in posts array
        const index = state.posts.findIndex(
          (post) => post._id === updatedPost._id
        );
        if (index !== -1) {
          state.posts[index] = updatedPost;
        }

        // Update current post if it's the same
        if (state.currentPost && state.currentPost._id === updatedPost._id) {
          state.currentPost = updatedPost;
        }

        toast.success(action.payload.message);
      })
      .addCase(addComment.rejected, (state, action) => {
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearError, clearCurrentPost, resetPosts, updatePostInList } =
  postSlice.actions;
export default postSlice.reducer;
