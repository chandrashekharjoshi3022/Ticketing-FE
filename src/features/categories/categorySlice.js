
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import CategoryService from './CategoryService';

// Thunks
export const fetchCategories = createAsyncThunk(
  'categories/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await CategoryService.fetchCategories();
      // backend might return { categories: [...] } or [...]
      return res?.categories ?? res?.data ?? res;
    } catch (err) {
      console.error('fetchCategories error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createCategory = createAsyncThunk(
  'categories/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await CategoryService.createCategory(payload);
      return res;
    } catch (err) {
      console.error('createCategory error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateCategory = createAsyncThunk(
  'categories/update',
  async ({ category_id, payload }, { rejectWithValue }) => {
    try {
      const res = await CategoryService.updateCategory(category_id, payload);
      return { category_id, data: res };
    } catch (err) {
      console.error('updateCategory error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'categories/delete',
  async (category_id, { rejectWithValue }) => {
    try {
      const res = await CategoryService.deleteCategory(category_id);
      return { category_id, data: res };
    } catch (err) {
      console.error('deleteCategory error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  items: [], // array of categories as returned by backend
  loading: false,
  error: null,
  lastUpdated: null
};

const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    // local-only clears
    clearCategoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        // ensure array
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.lastUpdated = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // create
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        // backend may return the created object; if so add it
        const created = action.payload?.category ?? action.payload?.data ?? action.payload;
        if (created) state.items = [created, ...state.items];
        state.lastUpdated = Date.now();
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // update
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const { category_id, data } = action.payload ?? {};
        const updated = data?.category ?? data?.data ?? data;
        if (category_id && updated) {
          const idx = state.items.findIndex((c) => (c.category_id ?? c.id) === (category_id ?? updated.category_id ?? updated.id));
          if (idx !== -1) state.items[idx] = { ...state.items[idx], ...updated };
        }
        state.lastUpdated = Date.now();
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // delete
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload?.category_id ?? null;
        if (id != null) {
          state.items = state.items.filter((c) => (c.category_id ?? c.id) !== id);
        }
        state.lastUpdated = Date.now();
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  }
});

export const { clearCategoryError } = categorySlice.actions;
export default categorySlice.reducer;
