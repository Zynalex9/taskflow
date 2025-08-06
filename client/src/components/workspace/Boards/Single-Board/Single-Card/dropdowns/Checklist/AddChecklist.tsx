import { closeAllDropDown } from "@/store/CardModalStatesSlice";
import DropdownHeader from "../../DropdownHeader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useEffect, useState } from "react";
import { cardApi, useAddChecklistMutation } from "@/store/cardApi";
import ModalButton from "@/components/resuable/ModalButton";
import { socket } from "@/socket/socket";
import { IChecklist } from "@/types/functionalites.types";
import { useParams } from "react-router-dom";

const AddChecklist = ({ cardId }: { cardId: string }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { workspaceId } = useParams();
  const [title, setTitle] = useState("");
  const [addChecklist] = useAddChecklistMutation();
  const onSubmit = async () => {
    const body = {
      title,
      cardId,
      workspaceId: workspaceId!,
    };
    try {
      setTitle("");
      dispatch(closeAllDropDown());
      await addChecklist(body);
      console.log(body);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const handleCheckListCreated = (data: IChecklist) => {
      console.log("data", data);
      dispatch(
        cardApi.util.updateQueryData("getSingleCard", { cardId }, (draft) => {
          draft.data.checklist.push(data);
        })
      );
    };
    socket.on("checkListCreated", handleCheckListCreated);
    return () => {
      socket.off("checkListCreated", handleCheckListCreated);
    };
  }, [dispatch, cardId]);
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
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-[#3A3F44] bg-[#1E2225] px-3 py-2 text-sm text-white placeholder-gray-500 focus:border-[#4C9AFF] focus:outline-none"
        />
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <ModalButton onClickFn={onSubmit} btnText="Add"></ModalButton>
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
