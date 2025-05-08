import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialState = {
  blogs: [],
  blog: null,
  page: 1,
  pages: 1,
  isLoading: false,
  error: null,
};

// Fetch all blogs
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async ({ keyword = '', pageNumber = '' }, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(
        `/api/blog?keyword=${keyword}&pageNumber=${pageNumber}`
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch blogs by category
export const fetchBlogsByCategory = createAsyncThunk(
  'blog/fetchBlogsByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/blog/category/${category}`);
      return { blogs: data, page: 1, pages: 1 };
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

// Fetch single blog
export const fetchBlogDetails = createAsyncThunk(
  'blog/fetchBlogDetails',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      );
    }
  }
);

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearBlogDetails: (state) => {
      state.blog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Fetch Blogs by Category
      .addCase(fetchBlogsByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
      })
      .addCase(fetchBlogsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      })
      // Fetch Blog Details
      .addCase(fetchBlogDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blog = action.payload;
      })
      .addCase(fetchBlogDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        toast.error(action.payload);
      });
  },
});

export const { clearBlogDetails, clearError } = blogSlice.actions;

export default blogSlice.reducer;