import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useDeleteBoardMutation } from "@/store/myApi";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { LoaderCircle, Minus, X } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CloseBoard = () => {
  const [openModal, setOpenModal] = useState(false);
  const [deleteBoard] = useDeleteBoardMutation();
  const { board } = useSingleBoardContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleDeleteBoard = async () => {
    setLoading(true);
    try {
      await deleteBoard(board._id).unwrap();
      setOpenModal(false);
      navigate(`/user/w/workspace/${board.workspace}`, {
        replace: true,
      });
    } catch (error) {
      console.error("Failed to delete board:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Popover open={openModal} onOpenChange={setOpenModal}>
      <PopoverTrigger>
        <div className="mt-4 w-full flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer">
          <Minus size={18} />
          <h2>Close Board</h2>
        </div>
      </PopoverTrigger>
      <PopoverContent
        data-ignore-click-outside="true"
        sideOffset={-10}
        side="top"
        className="bg-fprimary p-4 rounded-lg w-96 overflow-y-auto custom-scrollbar h-44"
      >
        <div className="flex items-center justify-between mb-4">
          <div></div>
          <h2 className="text-sm font-charlie-display-sm font-bold text-textP">
            Delete Board?
          </h2>
          <X size={16} onClick={() => setOpenModal(false)} />
        </div>
        <p className="text-textP/60 text-sm font-charlie-text-r">
          Are you sure you want to close this board? This action cannot be
          undone.
        </p>
        <button
          disabled={loading}
          onClick={handleDeleteBoard}
          className="w-full bg-danger my-3 px-2 py-1.5 text-fprimary rounded-md text-sm font-charlie-text-r hover:bg-danger/80 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <h1>Deleting Board</h1>
              <LoaderCircle size={16} className="animate-spin" />
            </div>
          ) : (
            "Delete board"
          )}
        </button>
      </PopoverContent>
    </Popover>
  );
};
