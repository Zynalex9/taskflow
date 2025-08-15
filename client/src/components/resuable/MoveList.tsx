import { useMoveListMutation } from "@/store/myApi";
import { IBoard, IBoardResponse } from "@/types/functionalites.types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

interface IBoardData {
  yourBoards: IBoard[];
  otherBoards: IBoard[];
}
export const MoveList = ({
  listId,
  setOpenListId,
}: {
  listId: string;
  setOpenListId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  const { workspaceId, boardId } = useParams();
  const [selectedBoard, setSelectedBoard] = useState("");
  const [boards, setBoards] = useState<IBoardData | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [moveList] = useMoveListMutation();
  const allBoards = boards
    ? [...(boards.yourBoards || []), ...(boards.otherBoards || [])]
    : [];

  const getAllBoards = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get<IBoardResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/board/${workspaceId}/get-boards`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setBoards(response.data.data);
      } else {
        console.error("Failed to fetch boards.");
      }
    } catch (error) {
      toast.error("Failed to fetch boards.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleMoveList = async () => {
    if (!boardId) return;
    try {
      setIsLoading(true);
      if (!selectedBoard) {
        setIsLoading(false);
        return;
      }
      const body = {
        currentBoardId: boardId,
        listId,
        targetedBoardId: selectedBoard,
      };
      await moveList(body).unwrap();
      setSelectedBoard("");
      setOpenListId(null);
    } catch (error: any) {
      toast.error(error.data.message || "Failed to move list.");
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    getAllBoards();
  }, []);
  useEffect(() => {
    console.log(selectedBoard);
  }, [selectedBoard]);

  return (
    <div className="h-36">
      <h2 className="text-lg font-charlie-text-r pl-1">Board</h2>
      <div className="flex items-start flex-col gap-10">
        <select
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
          disabled={isLoading}
          className="w-full p-2 border rounded bg-fprimary text-textP font-charlie-text-r focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-none transition-colors duration-150"
        >
          <option value="">Select a board</option>
          {allBoards.map((board) => (
            <option
              disabled={board._id === boardId}
              key={board._id}
              value={board._id}
            >
              {board.title}
            </option>
          ))}
        </select>
        <button
          className={`bg-blue-primary cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-150 ${
            isLoading || !selectedBoard ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isLoading || !selectedBoard}
          onClick={handleMoveList}
        >
          Move List
        </button>
      </div>
    </div>
  );
};
