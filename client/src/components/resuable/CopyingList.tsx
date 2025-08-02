import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { DialogContent } from "../ui/dialog";
import ModalButton from "./ModalButton";
import { useState } from "react";
import { useCopyListIntoNewListMutation } from "@/store/myApi";

export const CopyingList = ({ listId }: { listId: string }) => {
  const { board } = useSingleBoardContext();
  const [loading, setLoading] = useState(false);
  const [copyList] = useCopyListIntoNewListMutation();
  const handleCopy = async () => {
    try {
      if (!board._id || !listId) {
        console.error("Missing required parameters");
        return;
      }
      const body = {
        listId,
        boardId: board._id,
      };
      setLoading(true);
      await copyList(body).unwrap();

      setLoading(false);
    } catch (error) {
      console.error("Failed to copy list:", error);
      setLoading(false);
    }
  };
  return (
    <DialogContent
      data-ignore-click-outside="true"
      className="bg-bgS text-textP border-none"
    >
      <h2 className="text-lg">Copy List</h2>
      <div>
        <select className="w-full p-2 bg-bgS text-textP rounded-lg mb-2 focus:outline-0 focus:border-0 focus:ring-blue-400 focus:ring-2">
          <option value="" disabled selected>
            Select a board
          </option>
          {board.lists.map((list) => (
            <option key={list._id} value={list._id}>
              {list.name}
            </option>
          ))}
        </select>
      </div>
      <ModalButton
        btnText="Copy"
        disabled={loading}
        onClickFn={handleCopy}
        customStyles={`${loading ? "opacity-50 cursor-not-allowed" : ""} w-1/2`}
      />
    </DialogContent>
  );
};
