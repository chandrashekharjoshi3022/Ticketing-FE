// src/features/exceptions/exceptionSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import ExceptionService from './ExceptionService';

// Thunks
export const fetchExceptions = createAsyncThunk(
  'exceptions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await ExceptionService.fetchExceptions();
      return res?.exceptions ?? res?.data ?? res;
    } catch (err) {
      console.error('fetchExceptions error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createException = createAsyncThunk(
  'exceptions/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await ExceptionService.createException(payload);
      return res;
    } catch (err) {
      console.error('createException error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateException = createAsyncThunk(
  'exceptions/update',
  async ({ exception_id, payload }, { rejectWithValue }) => {
    try {
      const res = await ExceptionService.updateException(exception_id, payload);
      return { exception_id, data: res };
    } catch (err) {
      console.error('updateException error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteException = createAsyncThunk(
  'exceptions/delete',
  async (exception_id, { rejectWithValue }) => {
    try {
      const res = await ExceptionService.deleteException(exception_id);
      return { exception_id, data: res };
    } catch (err) {
      console.error('deleteException error', err);
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null
};

const exceptionSlice = createSlice({
  name: 'exceptions',
  initialState,
  reducers: {
    clearExceptionError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchExceptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExceptions.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.lastUpdated = Date.now();
      })
      .addCase(fetchExceptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // create
      .addCase(createException.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createException.fulfilled, (state, action) => {
        state.loading = false;
        const created = action.payload?.exception ?? action.payload?.data ?? action.payload;
        if (created) state.items = [created, ...state.items];
        state.lastUpdated = Date.now();
      })
      .addCase(createException.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // update
      .addCase(updateException.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateException.fulfilled, (state, action) => {
        state.loading = false;
        const { exception_id, data } = action.payload ?? {};
        const updated = data?.exception ?? data?.data ?? data;
        if (exception_id && updated) {
          const idx = state.items.findIndex((e) => (e.exception_id ?? e.id) === (exception_id ?? updated.exception_id ?? updated.id));
          if (idx !== -1) state.items[idx] = { ...state.items[idx], ...updated };
        }
        state.lastUpdated = Date.now();
      })
      .addCase(updateException.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // delete
      .addCase(deleteException.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteException.fulfilled, (state, action) => {
        state.loading = false;
        const id = action.payload?.exception_id ?? null;
        if (id != null) {
          state.items = state.items.filter((e) => (e.exception_id ?? e.id) !== id);
        }
        state.lastUpdated = Date.now();
      })
      .addCase(deleteException.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      });
  }
});

export const { clearExceptionError } = exceptionSlice.actions;
export default exceptionSlice.reducer;