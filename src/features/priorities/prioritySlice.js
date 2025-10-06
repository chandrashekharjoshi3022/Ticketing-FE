
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import PriorityService from './PriorityService';

export const fetchPriorities = createAsyncThunk(
  'priorities/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await PriorityService.listPriorities();
      // expect { priorities: [...] }
      return res.priorities ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createPriority = createAsyncThunk(
  'priorities/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await PriorityService.createPriority(payload);
      return res.priority ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updatePriority = createAsyncThunk(
  'priorities/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await PriorityService.updatePriority(id, payload);
      return res.priority ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deletePriority = createAsyncThunk(
  'priorities/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await PriorityService.deletePriority(id);
      return { id, data: res };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
  lastUpdated: null
};

const prioritySlice = createSlice({
  name: 'priorities',
  initialState,
  reducers: {
    clearPriorityError: (state) => { state.error = null; },
    clearCurrentPriority: (state) => { state.current = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPriorities.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchPriorities.fulfilled, (s, a) => {
        s.loading = false;
        s.items = Array.isArray(a.payload) ? a.payload : (a.payload.priorities ?? []);
        s.lastUpdated = Date.now();
      })
      .addCase(fetchPriorities.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; })

      .addCase(createPriority.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createPriority.fulfilled, (s, a) => {
        s.loading = false;
        const created = a.payload;
        if (created) s.items.unshift(created);
      })
      .addCase(createPriority.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; })

      .addCase(updatePriority.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(updatePriority.fulfilled, (s, a) => {
        s.loading = false;
        const updated = a.payload;
        if (updated) {
          const id = updated.priority_id ?? updated.id;
          const idx = s.items.findIndex((p) => (p.priority_id ?? p.id) === id);
          if (idx !== -1) s.items[idx] = updated;
        }
      })
      .addCase(updatePriority.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; })

      .addCase(deletePriority.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(deletePriority.fulfilled, (s, a) => {
        s.loading = false;
        const id = a.payload?.id;
        if (id) s.items = s.items.filter((p) => (p.priority_id ?? p.id) !== id);
      })
      .addCase(deletePriority.rejected, (s, a) => { s.loading = false; s.error = a.payload || a.error; });
  }
});

export const { clearPriorityError, clearCurrentPriority } = prioritySlice.actions;
export default prioritySlice.reducer;
