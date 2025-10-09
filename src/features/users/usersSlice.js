import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import UserService from './UserService';

// Thunks - Only keep user-related thunks
export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await UserService.listUsers();
      return res.users ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const fetchUser = createAsyncThunk(
  'users/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const res = await UserService.getUser(id);
      return res.user ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const createUser = createAsyncThunk(
  'users/create',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await UserService.createUser(payload);
      return res.user ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/update',
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const res = await UserService.updateUser(id, payload);
      return res.user ?? res;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id, { rejectWithValue }) => {
    try {
      const res = await UserService.deleteUser(id);
      return { id, data: res };
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Remove fetchReferenceData thunk since APIs don't exist

// Initial state - remove referenceData
const initialState = {
  items: [],
  current: null,
  loading: false,
  error: null,
  lastUpdated: null,
  operationLoading: false,
  operationError: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => { 
      state.error = null;
      state.operationError = null;
    },
    clearCurrentUser: (state) => { state.current = null; },
    clearOperationStatus: (state) => {
      state.operationLoading = false;
      state.operationError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all users
      .addCase(fetchUsers.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = Array.isArray(action.payload) ? action.payload : [];
        state.lastUpdated = Date.now();
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Fetch single user
      .addCase(fetchUser.pending, (state) => { 
        state.loading = true; 
        state.error = null; 
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error;
      })

      // Create user
      .addCase(createUser.pending, (state) => { 
        state.operationLoading = true; 
        state.operationError = null; 
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.operationLoading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(createUser.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload || action.error;
      })

      // Update user
      .addCase(updateUser.pending, (state) => { 
        state.operationLoading = true; 
        state.operationError = null; 
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.operationLoading = false;
        const updated = action.payload;
        if (updated) {
          const idx = state.items.findIndex((u) => (u.user_id ?? u.id) === (updated.user_id ?? updated.id));
          if (idx !== -1) state.items[idx] = updated;
          if (state.current && (state.current.user_id ?? state.current.id) === (updated.user_id ?? updated.id)) {
            state.current = updated;
          }
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload || action.error;
      })

      // Delete user
      .addCase(deleteUser.pending, (state) => { 
        state.operationLoading = true; 
        state.operationError = null; 
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.operationLoading = false;
        const id = action.payload?.id;
        if (id) {
          state.items = state.items.filter((u) => (u.user_id ?? u.id) !== id);
          if (state.current && (state.current.user_id ?? state.current.id) === id) {
            state.current = null;
          }
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload || action.error;
      });

    // Remove the fetchReferenceData cases
  }
});

export const { clearUserError, clearCurrentUser, clearOperationStatus } = usersSlice.actions;
export default usersSlice.reducer;