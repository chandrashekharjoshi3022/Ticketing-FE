import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { workingHoursService } from './workingHoursService';

// Async thunks
export const fetchWorkingHours = createAsyncThunk(
  'workingHours/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await workingHoursService.getAll();
      return response.working_hours;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch working hours');
    }
  }
);

export const createWorkingHours = createAsyncThunk(
  'workingHours/create',
  async (workingHoursData, { rejectWithValue }) => {
    try {
      const response = await workingHoursService.create(workingHoursData);
      return response.working_hours;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create working hours');
    }
  }
);

export const updateWorkingHours = createAsyncThunk(
  'workingHours/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await workingHoursService.update(id, data);
      return response.working_hours;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update working hours');
    }
  }
);

export const deleteWorkingHours = createAsyncThunk(
  'workingHours/delete',
  async (id, { rejectWithValue }) => {
    try {
      await workingHoursService.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete working hours');
    }
  }
);

export const setDefaultWorkingHours = createAsyncThunk(
  'workingHours/setDefault',
  async (id, { rejectWithValue }) => {
    try {
      const response = await workingHoursService.setDefault(id);
      return response.working_hours;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to set default working hours');
    }
  }
);

const workingHoursSlice = createSlice({
  name: 'workingHours',
  initialState: {
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    setCurrentItem: (state, action) => {
      state.currentItem = action.payload;
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchWorkingHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWorkingHours.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchWorkingHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create
      .addCase(createWorkingHours.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createWorkingHours.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload);
        state.success = true;
        state.error = null;
      })
      .addCase(createWorkingHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Update
      .addCase(updateWorkingHours.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateWorkingHours.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.working_hours_id === action.payload.working_hours_id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        state.success = true;
        state.error = null;
      })
      .addCase(updateWorkingHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      // Delete
      .addCase(deleteWorkingHours.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWorkingHours.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.working_hours_id !== action.payload);
        state.error = null;
      })
      .addCase(deleteWorkingHours.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Set Default
      .addCase(setDefaultWorkingHours.fulfilled, (state, action) => {
        // Update all items to remove default flag except the new default
        state.items = state.items.map(item => ({
          ...item,
          is_default: item.working_hours_id === action.payload.working_hours_id
        }));
      });
  }
});

export const { clearError, clearSuccess, setCurrentItem, clearCurrentItem } = workingHoursSlice.actions;
export default workingHoursSlice.reducer;