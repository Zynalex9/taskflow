import { Ellipsis, Star } from "lucide-react";
import { useToggleFavouriteMutation } from "@/store/myApi";

const BoardHeader = ({
  title,
  boardId,
  favourite,
  setOpenSideBar,
  openSidebar
}: {
  title?: string;
  favourite: boolean;
  boardId: string;
   setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  openSidebar: boolean;
}) => {
  const [toggleFavourite] = useToggleFavouriteMutation();
  return (
    <div className="p-4 z-[100] min-w-full bg-white/5 font-charlie-display-sm backdrop-blur-3xl shadow-md flex items-center justify-between">
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
          onClick={() => setOpenSideBar(!openSidebar)}
        />
      </div>
    </div>
  );
};

export default BoardHeader;
