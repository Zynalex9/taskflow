import { useToggleFavouriteMutation } from "@/store/myApi";
import { IBoard } from "@/types/functionalites.types";
import { Star } from "lucide-react";

const StarComp = ({ board }: { board: IBoard }) => {
  const [toggleFavourite] = useToggleFavouriteMutation();
  return (
    <div className="mt-4 flex items-center gap-6 ">
      <Star
        fill={`${board.favourite ? "yellow" : ""}`}
        color={`${board.favourite ? "yellow" : "#b6c2cf"}`}
        onClick={toggleFavourite}
      />
      <h1 className="text-sm">Star</h1>
    </div>
  );
};

export default StarComp;
