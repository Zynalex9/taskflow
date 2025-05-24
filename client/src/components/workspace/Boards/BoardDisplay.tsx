import {  useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { isImageUrl } from "../../../utils/helper";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const BoardDisplay = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const { boards, loading } = useSelector((state: RootState) => state.boards);

  if (loading)
    return (
      <div className="py-8 flex flex-wrap items-center justify-center gap-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="aspect-video w-[30%] rounded-xl shadow-2xl bg-[#333C43]"
          >
            <div className="h-full w-full flex flex-col items-center justify-center p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  return (
    <div className="py-8 flex flex-wrap items-center justify-center gap-4">
      <div className="bg-[#333C43] aspect-video flex items-center justify-center text-center font-charlie-text-sb text-textP text-2xl w-[30%] rounded-xl shadow-2xl transition-colors duration-150 hover:bg-[#333C43]/50">
        <h2>Create new board</h2>
      </div>
      {boards?.yourBoards.map((board) => (
        <Link
          to={`/user/w/workspace/${workspace?._id}/board/${board._id}`}
          key={board._id}
          style={
            isImageUrl(board.cover)
              ? {
                  backgroundImage: `url(${board.cover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { backgroundColor: board.cover }
          }
          className="aspect-video flex items-center justify-center w-[30%] rounded-xl shadow-2xl transition-transform duration-200 hover:scale-95"
        >
          <h1 className="text-textP font-bold font-charlie-text-sb text-2xl text-center">
            {board.title}
          </h1>
        </Link>
      ))}
    </div>
  );
};

export default BoardDisplay;
