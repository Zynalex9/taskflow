import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import {
  AlignVerticalJustifyStartIcon,
  CloudLightning,
  ListFilter,
  Rocket,
  Star,
} from "lucide-react";

const BoardHeader = () => {
  const { board } = useSelector((state: RootState) => state.board);

  if (board)
    return (
      <div className="p-4 w-full bg-white/5 font-charlie-display-sm backdrop-blur-3xl shadow-md flex items-center justify-between">
        <div className="flex gap-2 items-center text-[#172B4D]">
          <h1 className="text-lg font-bold ">{board[0].title}</h1>
          <Star size={18} />
          <AlignVerticalJustifyStartIcon size={18} />
        </div>
        <div className="flex gap-2 items-center text-[#172B4D]">
          <Rocket size={18} />
          <CloudLightning size={18} />
          <h1 className="flex items-center gap-1">
            <ListFilter className="inline" size={18} />
            Filters
          </h1>
        </div>
      </div>
    );
};

export default BoardHeader;
