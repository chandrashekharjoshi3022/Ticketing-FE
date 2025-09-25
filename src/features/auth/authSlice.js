// src/features/auth/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from './AuthService';

export const login = createAsyncThunk('auth/login', async (data, thunkAPI) => {
  try { 
    const response = await AuthService.login(data);
    return response;
  } catch (err) { 
    return thunkAPI.rejectWithValue(err.response?.data?.message || err.message); 
  }
});

export const getMe = createAsyncThunk('auth/getMe', async (_, thunkAPI) => {
  try { 
    const response = await AuthService.getMe();
    return response;
  } catch (err) { 
    // For getMe, we don't want to show errors - just mark as initialized
    console.log('getMe failed - user not authenticated');
    return thunkAPI.rejectWithValue('Not authenticated');
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  return await AuthService.logout();
});

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  message: '',
  isInitialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isInitialized = true;
      state.isLoading = false;
      state.isError = false;
      state.message = '';
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isInitialized = true;
    }
  },
  extraReducers: (builder) => {
    builder
      // getMe - This is crucial for page refresh
      .addCase(getMe.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(getMe.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user || action.payload;
        state.isInitialized = true;
        state.isError = false;
        state.message = '';
        console.log('getMe successful:', state.user);
      })
      .addCase(getMe.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isInitialized = true;
        state.isError = true;
        state.message = action.payload;
        console.log('getMe failed - user not authenticated');
      })

      // login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload?.user || action.payload;
        state.isInitialized = true;
        state.isError = false;
        state.message = '';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isError = true;
        state.message = action.payload || 'Login failed';
        state.isInitialized = true;
      })

      // logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isInitialized = true;
        state.isLoading = false;
        state.isError = false;
        state.message = '';
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.isInitialized = true;
        state.isLoading = false;
      });
  }
});

export const { clearAuth, setUser } = authSlice.actions;

// Selectors
export const selectUserRole = (state) => state.auth.user?.role || 'user';
export const selectCurrentUser = (state) => state.auth.user;
export const selectIsInitialized = (state) => state.auth.isInitialized;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectUser = (state) => state.auth.user;
export const selectAuthError = (state) => state.auth.message;

export default authSlice.reducer;