import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";

interface IData {
  oldPassword: string;
  newPassword: string;
}
const ChangePassword = () => {
  const [isChanging, setChanging] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<IData>();
  const onSubmit = async (data: IData) => {
    try {
      const response = await axios.patch(
        "http://localhost:3000/api/user/reset-password",
        data,
        { withCredentials: true }
      );
      if (response.data.success) {
        toast.success(response.data.message);
      }
      reset();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="w-md lg:w-xl mx-auto bg-fprimary shadow-md rounded p-6">
      <button
        onClick={() => setChanging(!isChanging)}
        className="bg-blue-primary px-4 py-2 rounded-md"
      >
        Change Password
      </button>

      {isChanging && (
        <div>
          <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
            <input
              {...register("oldPassword", {
                required: "Please enter old password",
              })}
              type="password"
              placeholder="Old Password"
              className="px-3 py-1.5 block text-sm rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {errors.oldPassword && (
              <p className="text-sm text-red-500">
                {errors.oldPassword.message}
              </p>
            )}

            <input
              {...register("newPassword", {
                required: "Please enter the new password",
              })}
              type="password"
              placeholder="New Password"
              className="px-3 py-1.5 block text-sm rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            {errors.newPassword && (
              <p className="text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}

            <button
              type="submit"
              className="bg-blue-primary px-4 py-2 rounded-md"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default ChangePassword;
