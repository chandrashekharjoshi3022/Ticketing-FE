import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AuthService from "./AuthService";

const initialState = {
  user: null,
  isLoading: false,
  isError: false,
  message: "",
};

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async (userData, thunkAPI) => {
    try {
      return await AuthService.login(userData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

// Get current user from cookie
export const getMe = createAsyncThunk("auth/getMe", async (_, thunkAPI) => {
  try {
    return await AuthService.getMe();
  } catch (err) {
    return thunkAPI.rejectWithValue("Not authenticated");
  }
});

// Logout
export const logout = createAsyncThunk("auth/logout", async () => {
  return await AuthService.logout();
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // GetMe
      .addCase(getMe.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(getMe.rejected, (state) => {
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;
