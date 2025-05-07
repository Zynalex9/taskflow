import axios from "axios";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store/store";
import { changeProfilePicture } from "../../../store/AuthSlice";
import { toast } from "react-toastify";
interface FormData {
  newPicture: FileList;
}
const ChangeProfilePicture = () => {
  const dispath = useDispatch<AppDispatch>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<FormData>();
  const onSubmit = async (profilePicture: FormData) => {
    const file = profilePicture.newPicture[0];
    try {
      const res = await dispath(changeProfilePicture(file));
      if (changeProfilePicture.fulfilled.match(res)) {
        toast.success("Profile picture changed", {
          theme: "dark",
        });
        reset();
      }
    } catch (error) {
      toast.error("Error changing profile picture", {
        theme: "dark",
      });
    }
  };
  return (
    <div className="w-xl bg-fprimary p-6 rounded shadow-md">
      <div>
        <h2 className="text-xl font-semibold mb-4 font-charlie-display-sm">
          Change Profile Picture
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block">
            <span className="text-sm text-white/80 mb-1 block">
              Upload new profile picture
            </span>
            <input
              type="file"
              accept="image/*"
              {...register("newPicture", {
                required: "Please upload a profile picture",
              })}
              className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              hover:file:bg-primary/80
              bg-white/10 rounded-md p-2"
            />
          </label>
          {errors.newPicture && (
            <p className="text-sm text-red-500">{errors.newPicture.message}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary px-4 py-2 rounded-md text-white hover:bg-primary/90 transition"
          >
            {isSubmitting ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangeProfilePicture;
