import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import authService from "../../services/authService";

const initialState = {
  status: "idle",
  isAuthenticated: false,
  loading: false,
  error: false,
  email: null,
  userToken: null,
  user: null,
  success: false,
};

// LOGIN
export const loginUser = createAsyncThunk(
  "auth/login",
  async (payload) => {
    const { data } = await authService.login(payload);

    localStorage.setItem("token", data.accessToken);
    localStorage.setItem("nexoraUser", JSON.stringify(data.user));

    return data;
  }
);

// REGISTER
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload) => {
    const { data } = await authService.register(payload);

    return data;
  }
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout(state) {
      state.status = "idle";
      state.isAuthenticated = false;
      state.loading = false;
      state.error = false;
      state.email = null;
      state.userToken = null;
      state.user = null;
      state.success = false;

      localStorage.removeItem("token");
      localStorage.removeItem("nexoraUser");
    },

    clearAuthError(state) {
      state.error = false;
    },
  },

  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = false;
        state.isAuthenticated = false;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.loading = false;
        state.error = false;

        state.isAuthenticated = true;
        state.email = action.payload.user.email;
        state.userToken = action.payload.accessToken;
        state.user = action.payload.user;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;

        state.error =
          action.error.message || "Login failed";

        state.isAuthenticated = false;
        state.email = null;
        state.userToken = null;
        state.user = null;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.loading = true;
        state.error = false;
        state.success = false;
        state.isAuthenticated = false;
      })

      .addCase(registerUser.fulfilled, (state) => {
        state.status = "succeeded";
        state.loading = false;
        state.error = false;

        // Dupa register nu facem login automat
        state.isAuthenticated = false;
        state.email = null;
        state.userToken = null;
        state.user = null;
        state.success = true;
      })

      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.loading = false;

        state.error =
          action.error.message || "Register failed";

        state.isAuthenticated = false;
        state.email = null;
        state.userToken = null;
        state.user = null;
        state.success = false;
      });
  },
});

export const {
  logout,
  clearAuthError,
} = authSlice.actions;

export const authReducer = authSlice.reducer;