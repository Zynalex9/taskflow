import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IData } from "../components/Authentication/SignIn";
interface AuthState {
  user: any;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") as string)
    : null,
  loading: false,
  error: null,
  isLoggedIn: false,
};

export const loginUser = createAsyncThunk(
  "loginUser",
  async (loginData: IData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        loginData,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        return response.data;
      } else {
        return rejectWithValue("Login failed");
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);
export const logoutUser = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Logging out...");
      await axios.get("http://localhost:3000/api/user/logout", {
        withCredentials: true,
      });
      localStorage.removeItem("user");
    } catch (error: any) {
      console.error("Logout error:", error);
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isLoggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export default authSlice.reducer;
