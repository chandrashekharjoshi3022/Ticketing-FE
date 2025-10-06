
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SubCategoryService from './SubCategoryService';

// Thunks
export const fetchSubCategories = createAsyncThunk(
  'subcategories/fetchAll',
  async (categoryId = null, { rejectWithValue }) => {
    try {
      const res = await SubCategoryService.listSubCategories(categoryId);
      // returns { subcategories: [...] }
      return res.subcategories ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchSubCategory = createAsyncThunk(
  'subcategories/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await SubCategoryService.getSubCategory(id);
      return res.subcategory ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createSubCategory = createAsyncThunk(
  'subcategories/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await SubCategoryService.createSubCategory(payload);
      return res.subcategory ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateSubCategory = createAsyncThunk(
  'subcategories/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await SubCategoryService.updateSubCategory(id, payload);
      return res.subcategory ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteSubCategory = createAsyncThunk(
  'subcategories/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await SubCategoryService.deleteSubCategory(id);
      return { id, data: res };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// initial state
const initialState = {
  items: [], // array of subcategory objects
  current: null, // single subcategory for edit/view
  loading: false,
  error: null,
  lastUpdated: null
};

const subcategorySlice = createSlice({
  name: 'subcategories',
  initialState,
  reducers: {
    clearSubcategoryError: (state) => { state.error = null; },
    clearCurrentSubcategory: (state) => { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchSubCategories.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : (action.payload.subcategories ?? []);
        state.lastUpdated = Date.now();
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // fetch one
      .addCase(fetchSubCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // create
      .addCase(createSubCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(createSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        // push created item if backend returned it
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // update
      .addCase(updateSubCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        if (updated) {
          const idx = state.items.findIndex((s) => (s.subcategory_id ?? s.id) === (updated.subcategory_id ?? updated.id));
          if (idx !== -1) state.items[idx] = updated;
        }
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // delete
      .addCase(deleteSubCategory.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload?.id;
        if (id) state.items = state.items.filter((s) => (s.subcategory_id ?? s.id) !== id);
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  }
});

export const { clearSubcategoryError, clearCurrentSubcategory } = subcategorySlice.actions;
export default subcategorySlice.reducer;
