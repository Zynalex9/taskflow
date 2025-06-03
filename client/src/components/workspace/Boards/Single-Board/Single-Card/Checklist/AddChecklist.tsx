import { closeAllDropDown } from "@/store/CardModalStatesSlice";
import DropdownHeader from "../DropdownHeader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useState } from "react";
import { useAddChecklistMutation } from "@/store/cardApi";

const AddChecklist = ({ cardId }: { cardId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [title, setTitle] = useState("");
  const [addChecklist] = useAddChecklistMutation();
  const onSubmit = async () => {
    const body = {
      title,
      cardId,
    };
    try {
      await addChecklist(body);
      setTitle("");
      console.log(body);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="absolute top-2 left-2 w-72 rounded bg-[#282E33] p-4 shadow-2xl text-white z-30">
      <DropdownHeader headerText="Add a checklist" />

      <div className="mt-4 space-y-2">
        <label htmlFor="title" className="block text-sm text-gray-300">
          Title
        </label>
        <input
          type="text"
          id="title"
          placeholder="Enter a title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-[#3A3F44] bg-[#1E2225] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#4C9AFF] focus:outline-none"
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <button
          onClick={onSubmit}
          className="px-3 py-1 text-sm rounded bg-[#4C9AFF] hover:bg-[#388BFF] text-white"
        >
          Add
        </button>
        <button
          onClick={() => dispatch(closeAllDropDown())}
          className="px-3 py-1 text-sm rounded bg-[#555B61] hover:bg-[#444A50] text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddChecklist;
