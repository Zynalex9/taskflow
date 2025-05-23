import { AppDispatch, RootState } from "@/store/store";
import { useForm, SubmitHandler } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { verifyOTP } from "@/store/ForgetSlice";

type OTPFormData = {
  otp: string;
};

const EnterOTP = () => {
  const navigator = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const login = location.state?.login;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OTPFormData>();

  const onSubmit: SubmitHandler<OTPFormData> = async (data) => {
    if (!login) {
      toast.error("Missing login information. Please restart the process.");
      navigator("/user/forget/enter-email");
      return;
    }
    try {
      const result = await dispatch(verifyOTP({ otp: data.otp, login })).unwrap();
      toast.success("OTP verified! Please reset your password.");
      navigator("/user/forget/reset-password", { state: { token: result.data, login } });
    } catch (err: any) {
      toast.error(err || "Failed to verify OTP");
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-2xl p-10 rounded-xl w-full max-w-md">
        <h2 className="text-center text-3xl font-semibold text-gray-800 mb-6">
          Enter Your OTP
        </h2>

        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              One-Time Password
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "OTP must be a 6-digit number",
                },
              })}
              className={`w-full px-4 py-2 border ${
                errors.otp ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-widest text-lg`}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition duration-200"
          >
            Verify OTP
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EnterOTP;
