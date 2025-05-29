import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import {
  AlignVerticalJustifyStartIcon,
  CloudLightning,
  Ellipsis,
  ListFilter,
  Rocket,
  Star,
  Tally1,
} from "lucide-react";
import { useState } from "react";
import RightSideBar from "./RightSideBar";

const BoardHeader = () => {
  const { board } = useSelector((state: RootState) => state.board);
  const [openSidebar, setOpenSideBar] = useState(false);
  if (board)
    return (
      <div className="p-4 min-w-full bg-white/5 font-charlie-display-sm backdrop-blur-3xl shadow-md flex items-center justify-between">
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
          <Tally1 />
          <Ellipsis className="cursor-pointer" onClick={()=>setOpenSideBar(true)}/>
        </div>
        <RightSideBar
          setOpenSideBar={setOpenSideBar}
          openSidebar={openSidebar}
        />
      </div>
    );
};

export default BoardHeader;
