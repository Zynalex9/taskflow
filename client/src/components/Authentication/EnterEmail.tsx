import { sendOTPRequest } from "@/store/ForgetSlice";
import { AppDispatch, RootState } from "@/store/store";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { useEffect } from "react";

interface IData {
  identifier: string;
}

const EnterEmail = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success, message } = useSelector(
    (state: RootState) => state.resetPassword
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IData>();

  useEffect(() => {
    if (success && message) {
      navigate("/user/forget/enter-otp");
    }

    if (error) {
      toast.error(error);
    }
  }, [success, error, message, navigate]);

  const onSubmit = async ({ identifier }: IData) => {
    try {
      await dispatch(sendOTPRequest(identifier)).unwrap();
    } catch (err) {
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl p-10 rounded-lg max-w-md w-full">
        <h1 className="text-center font-bold text-3xl text-blue-600 mb-2">
          Task Flow
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Enter your username or email to continue
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email Address or Username
            </label>
            <input
              type="text"
              id="identifier"
              {...register("identifier", {
                required: "Please enter an username or email",
              })}
              placeholder="your.email@example.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            {errors.identifier && (
              <p className="text-xs text-red-500">
                {errors.identifier.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || loading}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 ease-in-out ${
              isSubmitting || loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting || loading ? "Sending OTP..." : "Get OTP"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          By continuing, you agree to our Terms of Service
        </p>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EnterEmail;
