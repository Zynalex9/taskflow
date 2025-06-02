import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { IData } from "../components/Authentication/SignIn";
import { IUser } from "../types/functionalites.types";
interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}
interface UpdateDetailsPayload {
  username: string;
  email: string;
}
const expiry = localStorage.getItem("expiry");

const isExpired = Date.now() > parseInt(expiry ?? "0");
const initialState: AuthState = {
  user:
    localStorage.getItem("user") && !isExpired
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
        `${import.meta.env.VITE_BASE_URL}/api/user/login`,
        loginData,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        const expiryDate = Date.now() + 3 * 24 * 60 * 60 * 1000;
        localStorage.setItem("expiry", expiryDate.toString());
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
      await axios.get(`${import.meta.env.VITE_BASE_URL}/api/user/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("user");
    } catch (error: any) {
      console.error("Logout error:", error);
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);
export const updateDetails = createAsyncThunk(
  "changeDetails",
  async (details: UpdateDetailsPayload, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/user/change-details`,
        details,
        { withCredentials: true }
      );
      if (response.data.success) {
        return response.data;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);
export const changeProfilePicture = createAsyncThunk(
  "changeProfilePicture",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("newPicture", file);

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/user/change-profile-picture`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        return response.data;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to change profile picture"
      );
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
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDetails.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isLoggedIn = false;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })
      .addCase(updateDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changeProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(changeProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.user = action.payload.data;
      });
  },
});

export default authSlice.reducer;
