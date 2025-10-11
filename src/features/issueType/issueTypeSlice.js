// features/issueType/issueTypeSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import IssueTypeService from './issueTypeService';

// Thunks
export const fetchIssueTypes = createAsyncThunk(
  'issueType/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await IssueTypeService.fetchIssueTypes();
      return res?.issue_types ?? res?.data ?? res;
    } catch (err) {
      console.error('fetchIssueTypes error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchIssueType = createAsyncThunk(
  'issueType/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await IssueTypeService.fetchIssueType(id);
      return res?.issue_type ?? res?.data ?? res;
    } catch (err) {
      console.error('fetchIssueType error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createIssueType = createAsyncThunk(
  'issueType/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await IssueTypeService.createIssueType(payload);
      return res;
    } catch (err) {
      console.error('createIssueType error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateIssueType = createAsyncThunk(
  'issueType/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await IssueTypeService.updateIssueType(id, payload);
      return { id, data: res };
    } catch (err) {
      console.error('updateIssueType error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteIssueType = createAsyncThunk(
  'issueType/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await IssueTypeService.deleteIssueType(id);
      return { id, data: res };
    } catch (err) {
      console.error('deleteIssueType error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchUserIssueTypes = createAsyncThunk(
  'issueType/fetchUserIssueTypes',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await IssueTypeService.fetchUserIssueTypes(userId);
      return res;
    } catch (err) {
      console.error('fetchUserIssueTypes error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  items: [],
  userItems: [],
  currentUser: null,
  loading: false,
  userLoading: false,
  error: null,
  lastUpdated: null
};

const issueTypeSlice = createSlice({
  name: 'issueType',
  initialState,
  reducers: {
    clearIssueTypeError: (state) => {
      state.error = null;
    },
    clearUserIssueTypes: (state) => {
      state.userItems = [];
      state.currentUser = null;
    },
    clearEditing: (state) => {
      state.editing = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Issue Types
      .addCase(fetchIssueTypes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIssueTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.lastUpdated = Date.now();
      })
      .addCase(fetchIssueTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Fetch User Issue Types
      .addCase(fetchUserIssueTypes.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(fetchUserIssueTypes.fulfilled, (state, action) => {
        state.userLoading = false;
        state.userItems = action.payload?.issue_types || [];
        state.currentUser = action.payload?.user || null;
      })
      .addCase(fetchUserIssueTypes.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload || action.error;
      })

      // Create Issue Type
      .addCase(createIssueType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIssueType.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload?.issue_type ?? action.payload?.data ?? action.payload;
        if (created) state.items = [created, ...state.items];
        state.lastUpdated = Date.now();
      })
      .addCase(createIssueType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Update Issue Type
      .addCase(updateIssueType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIssueType.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload ?? {};
        const updated = data?.issue_type ?? data?.data ?? data;
        if (id && updated) {
          const idx = state.items.findIndex((it) => (it.issue_type_id ?? it.id) === id);
          if (idx !== -1) state.items[idx] = { ...state.items[idx], ...updated };
        }
        state.lastUpdated = Date.now();
      })
      .addCase(updateIssueType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Delete Issue Type
      .addCase(deleteIssueType.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIssueType.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload?.id ?? null;
        if (id != null) {
          state.items = state.items.filter((it) => (it.issue_type_id ?? it.id) !== id);
        }
        state.lastUpdated = Date.now();
      })
      .addCase(deleteIssueType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  }
});

export const { clearIssueTypeError, clearUserIssueTypes, clearEditing } = issueTypeSlice.actions;
export default issueTypeSlice.reducer;