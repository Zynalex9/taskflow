import { useAddListMutation } from "@/store/myApi";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const AddList = () => {
  const [isAddList, setIsAddList] = useState(false);
  const [addList] = useAddListMutation();
  const { register, handleSubmit, reset } = useForm<{ name: string }>();
  const { boardId } = useParams();

  const onSubmit = async (data: { name: string }) => {
    if (boardId) {
      const body = {
        ...data,
        boardId,
      };
      try {
        reset();
        await addList(body).unwrap();
      } catch (error: any) {
        console.log(error.data.message);
        toast.error(error.data.message, { theme: "dark" });
      }
    }
  };

  return (
    <div
      className={`${
        isAddList ? "h-24" : "h-10"
      } font-charlie-display-sm backdrop-blur-3xl shadow-xl shadow-gray-400 hover:bg-gray-50/30 bg-transparent w-56 rounded-lg p-1.5`}
    >
      {isAddList ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-1.5"
        >
          <input
            {...register("name", { required: true })}
            autoFocus
            placeholder="Enter list title"
            className="rounded p-1 border border-gray-300 text-sm h-8"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-blue-500 text-white px-3 py-1 rounded text-sm h-8"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddList(false)}
              className="px-3 py-1 rounded border border-gray-300 text-sm h-8"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <button
          className="text-xl flex items-center justify-center gap-2 w-56"
          onClick={() => setIsAddList(true)}
        >
          <Plus className="w-4 h-4" />
          Add a list
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default AddList;
