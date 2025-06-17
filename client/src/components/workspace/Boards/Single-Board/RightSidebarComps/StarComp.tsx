import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useToggleFavouriteMutation } from "@/store/myApi";
import { Star } from "lucide-react";

const StarComp = () => {
  const [toggleFavourite] = useToggleFavouriteMutation();
  const { board } = useSingleBoardContext();
  return (
    <div className="mt-4 flex items-center gap-6 ">
      <Star
        fill={`${board.favourite ? "yellow" : ""}`}
        color={`${board.favourite ? "yellow" : "#b6c2cf"}`}
        onClick={() => toggleFavourite(board._id)}
      />
      <h1 className="text-sm">Star</h1>
    </div>
  );
};

export default StarComp;
