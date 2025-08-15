import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useToggleFavouriteMutation } from "@/store/myApi";
import { RootState } from "@/store/store";
import { Star } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const StarComp = () => {
  const [toggleFavourite] = useToggleFavouriteMutation();
  const { board } = useSingleBoardContext();
  const { user } = useSelector((state: RootState) => state.auth);
  const boardId = board._id;
  const userId = user?._id ?? "";
  const body = {
    userId,
    boardId,
  };
  return (
    <div
      className="mt-4 flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer"
      onClick={async () => {
        try {
          await toggleFavourite(body).unwrap();
        } catch (error: any) {
          toast.error(error.data.message || "Couldn't toggle favourite");
        }
      }}
    >
      <Star
        fill={`${
          board.favouritedBy.includes(user?._id ?? "")
            ? "yellow"
            : "transparent"
        }`}
        color={`${
          board.favouritedBy.includes(user?._id ?? "") ? "yellow" : "#b6c2cf"
        }`}
        size={18}
      />
      <h1 className="text-sm">Star</h1>
    </div>
  );
};

export default StarComp;
