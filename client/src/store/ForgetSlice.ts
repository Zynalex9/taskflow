import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Define TypeScript interfaces based on the response
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
    OTP:number;
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
  OTP: number | null;
}

const initialState: ForgetPasswordState = {
  loading: false,
  error: null,
  success: false,
  user: null,
  message: null,
OTP:null,
};

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

    if(response.data.success){
      console.log("Response from slice",response.data)
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
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendOTPRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        sendOTPRequest.fulfilled,
        (state, action: PayloadAction<OTPResponse>) => {
          state.loading = false;
          state.success = true;
          state.OTP= action.payload.data.OTP
          state.user = action.payload.data.user;
          state.message = action.payload.message;
        }
      )
      .addCase(
        sendOTPRequest.rejected,
        (state, action: PayloadAction<ErrorResponse | undefined>) => {
          state.loading = false;
          state.error = action.payload?.message || "Unknown error occurred",
          
          state.success = false;
        }
      );
  },
});

export const { resetState } = forgetSlice.actions;
export default forgetSlice.reducer;