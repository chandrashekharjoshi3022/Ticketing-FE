// features/sla/slaSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import SLAService from './slaService';

// Thunks
export const fetchSLAs = createAsyncThunk(
  'sla/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await SLAService.fetchSLAs();
      return res?.slas ?? res?.data ?? res;
    } catch (err) {
      console.error('fetchSLAs error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchUsers = createAsyncThunk(
  'sla/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const res = await SLAService.fetchUsers();
      return res?.users ?? res?.data ?? res;
    } catch (err) {
      console.error('fetchUsers error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createSLA = createAsyncThunk(
  'sla/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await SLAService.createSLA(payload);
      return res;
    } catch (err) {
      console.error('createSLA error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateSLA = createAsyncThunk(
  'sla/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await SLAService.updateSLA(id, payload);
      return { id, data: res };
    } catch (err) {
      console.error('updateSLA error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteSLA = createAsyncThunk(
  'sla/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await SLAService.deleteSLA(id);
      return { id, data: res };
    } catch (err) {
      console.error('deleteSLA error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  items: [],
  users: [],
  loading: false,
  error: null,
  lastUpdated: null
};

const slaSlice = createSlice({
  name: 'sla',
  initialState,
  reducers: {
    clearSLAError: (state) => {
      state.error = null;
    },
    clearEditing: (state) => {
      state.editing = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch SLAs
      .addCase(fetchSLAs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSLAs.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.lastUpdated = Date.now();
      })
      .addCase(fetchSLAs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })
      
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Create SLA
      .addCase(createSLA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSLA.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload?.sla ?? action.payload?.data ?? action.payload;
        if (created) state.items = [created, ...state.items];
        state.lastUpdated = Date.now();
      })
      .addCase(createSLA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Update SLA
      .addCase(updateSLA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSLA.fulfilled, (state, action) => {
        state.loading = false;
        const { id, data } = action.payload ?? {};
        const updated = data?.sla ?? data?.data ?? data;
        if (id && updated) {
          const idx = state.items.findIndex((s) => (s.sla_id ?? s.id) === id);
          if (idx !== -1) state.items[idx] = { ...state.items[idx], ...updated };
        }
        state.lastUpdated = Date.now();
      })
      .addCase(updateSLA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Delete SLA
      .addCase(deleteSLA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSLA.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload?.id ?? null;
        if (id != null) {
          state.items = state.items.filter((s) => (s.sla_id ?? s.id) !== id);
        }
        state.lastUpdated = Date.now();
      })
      .addCase(deleteSLA.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  }
});

export const { clearSLAError, clearEditing } = slaSlice.actions;
export default slaSlice.reducer;