import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { DialogContent } from "../ui/dialog";
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
      className="bg-bgS text-textP border-none max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold mb-4">Copy List</h2>
      <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
        <p className="text-white text-center text-lg font-medium">
          Copying the list in: <span className="text-blue-400">{board.title}</span>
        </p>
      </div>

      <button
        onClick={handleCopy}
        disabled={loading}
        className={`
          w-full py-3 rounded-md text-white font-semibold 
          bg-gradient-to-r from-blue-600 to-blue-500 
          hover:from-blue-700 hover:to-blue-600 
          transition-colors duration-300 ease-in-out
          focus:outline-none focus:ring-4 focus:ring-blue-300
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
      >
        {loading ? "Copying..." : "Copy"}
      </button>
    </DialogContent>
  );
};
