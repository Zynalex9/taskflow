import { closeModal } from "@/store/BoardBGSlice";
import { useAddBoardMutation } from "@/store/myApi";
import { AppDispatch, RootState } from "@/store/store";
import { Asterisk } from "lucide-react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
interface IData {
  title: string;
}
const Form = () => {
  const [addBoard] = useAddBoardMutation();
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const { selectedColor, selectedImg } = useSelector(
    (state: RootState) => state.boardModalControll
  );
  const { user } = useSelector((state: RootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
    watch,
  } = useForm<IData>();
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = async (data: IData) => {
    const newData = {
      ...data,
      cover: selectedColor ? selectedColor : selectedImg,
      workspaceId: workspace?._id,
      memberId: [user?._id],
      visibility: "workspace",
    };
    try {
      await addBoard(newData).unwrap();
      dispatch(closeModal());
    } catch (error: any) {
      toast.error(error.data.message, { theme: "dark" });
    }
  };
  const titleValue = watch("title");
  return (
    <div>
      <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="title">
            Board Title <Asterisk className="inline" color="red" size={12} />
          </label>
          <input
            type="text"
            className="block p-2 bg-gray-900/50 text-textP w-full border-1 border-gray-700 focus:outline-1"
            placeholder="Enter board title"
            autoFocus
            {...register("title", {
              required: "Please enter a title",
            })}
          />
          <p className="my-1.5 text-sm font-charlie-text-r text-textP">
            👋 Board title is required
          </p>
          {errors.title && <p>{errors.title.message}</p>}
        </div>
        <div>
          <label htmlFor="Workspace">Workspace</label>
          <input
            type="text"
            className="block p-2 bg-gray-900/50 text-textP/60 w-full border-1 border-gray-700 focus:outline-1"
            value={workspace?.name}
            disabled={true}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </div>
        <button
          type="submit"
          className="w-full mt-2 py-1.5 px-3 rounded bg-blue-primary text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!titleValue || isSubmitting}
        >
          {isSubmitting ? "Creating..." : "Create"}
        </button>
        <p className="my-1.5 text-sm font-charlie-text-r text-textP">
          By using images from Unsplash, you agree to their license and Terms of
          Service
        </p>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Form;
