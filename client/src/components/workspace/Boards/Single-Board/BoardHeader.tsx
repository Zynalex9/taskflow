import { Ellipsis, Star } from "lucide-react";
import { useState } from "react";
import RightSideBar from "./RightSideBar";
import { useToggleFavouriteMutation } from "@/store/myApi";

const BoardHeader = ({
  title,
  boardId,
  favourite,
}: {
  title?: string;
  favourite: boolean;
  boardId: string;
}) => {
  const [openSidebar, setOpenSideBar] = useState(false);
  const [toggleFavourite] = useToggleFavouriteMutation();
  return (
    <div className="p-4 min-w-full bg-white/5 font-charlie-display-sm backdrop-blur-3xl shadow-md flex items-center justify-between">
      <div className="flex gap-2 items-center text-[#172B4D]">
        <h1 className="text-lg font-bold ">{title}</h1>
        {favourite ? (
          <Star
            size={18}
            fill="yellow"
            stroke="yellow"
            onClick={() => toggleFavourite(boardId)}
          />
        ) : (
          <Star size={18} onClick={() => toggleFavourite(boardId)} />
        )}
      </div>
      <div className="flex gap-2 items-center text-[#172B4D]">
        <Ellipsis
          className="cursor-pointer"
          onClick={() => setOpenSideBar(true)}
        />
      </div>
      <RightSideBar setOpenSideBar={setOpenSideBar} openSidebar={openSidebar} />
    </div>
  );
};

export default BoardHeader;
