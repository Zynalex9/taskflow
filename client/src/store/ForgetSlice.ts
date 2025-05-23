import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  _id: string;
  username: string;
  email: string;
  workspace: string[];
  teamspace: string[];
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  resetOTP: string;
  resetOTPExpiry: string;
}

interface OTPResponse {
  statusCode: number;
  data: {
    user: User;
  };
  message: string;
  success: boolean;
}

interface ErrorResponse {
  message: string;
  statusCode?: number;
  success?: boolean;
}

interface ForgetPasswordState {
  loading: boolean;
  error: string | null;
  success: boolean;
  user: User | null;
  message: string | null;
  token: string | null; 
  emailEntered:boolean
}

interface IVerifyOTPResponse {
  success: boolean;
  data: string; 
  message: string;
}

const initialState: ForgetPasswordState = {
  loading: false,
  error: null,
  success: false,
  user: null,
  message: null,
  token: null,
  emailEntered:false
};

export const verifyOTP = createAsyncThunk<
  IVerifyOTPResponse,
  { otp: string; login: string },
  { rejectValue: string }
>("verifyOTP", async ({ otp, login }, { rejectWithValue }) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/user/verify-otp",
      { login, OTP: otp } 
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error?.response?.data?.message || "Failed to verify OTP"
    );
  }
});

export const sendOTPRequest = createAsyncThunk<
  OTPResponse,
  string,
  {
    rejectValue: ErrorResponse;
  }
>("auth/sendOTPRequest", async (login: string, { rejectWithValue }) => {
  try {
    const response = await axios.post<OTPResponse>(
      "http://localhost:3000/api/user/send-otp",
      { login },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    if (response.data.success) {
      console.log("Response from slice", response.data);
    }
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue({
        message: error.response?.data?.message || "Failed to send OTP",
        statusCode: error.response?.status,
        success: error.response?.data?.success || false,
      });
    }
    return rejectWithValue({
      message: "An unexpected error occurred while sending OTP",
      success: false,
    });
  }
});

const forgetSlice = createSlice({
  name: "forgetPassword",
  initialState,
  reducers: {
    resetState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
      state.message = null;
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // sendOTPRequest
      .addCase(sendOTPRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
          state.emailEntered= false
      })
      .addCase(
        sendOTPRequest.fulfilled,
        (state, action: PayloadAction<OTPResponse>) => {
          state.loading = false;
          state.success = true;
          state.user = action.payload.data.user;
          state.message = action.payload.message;
          state.emailEntered= true
        }
      )
      .addCase(
        sendOTPRequest.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "Unknown error occurred";
          state.success = false;
          state.emailEntered= false
        }
      )

      // verifyOTP
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        verifyOTP.fulfilled,
        (state, action: PayloadAction<IVerifyOTPResponse>) => {
          state.loading = false;
          state.success = true;
          state.token = action.payload.data; 
                    state.message = action.payload.message;
          state.error = null;
        }
      )
      .addCase(
        verifyOTP.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload || "Failed to verify OTP";
          state.success = false;
          state.token = null;
        }
      );
  },
});

export const { resetState } = forgetSlice.actions;
export default forgetSlice.reducer;
