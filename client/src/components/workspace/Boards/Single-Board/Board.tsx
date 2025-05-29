import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/store";
import { useEffect } from "react";
import { fetchSingleBoard } from "../../../../store/BoardSlice";
import List from "./List";
import BoardHeader from "./BoardHeader";
import { isImageUrl } from "../../../../utils/helper";
import { Skeleton } from "@/components/ui/skeleton";

const Board = () => {
  const { boardId } = useParams();
  const { board, loading } = useSelector((state: RootState) => state.board);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (boardId) {
      dispatch(fetchSingleBoard(boardId));
      console.log(board);
    }
  }, [boardId]);
  if (loading)
   return (
    <div className="flex gap-4 w-max min-w-full mt-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="bg-[#101204] w-[300px] p-4 text-textP rounded-xl shadow-lg shadow-black/80 flex-shrink-0"
        >
          <Skeleton className="h-6 w-3/4 mb-4" /> 

          {[...Array(2)].map((__, j) => (
            <Skeleton key={j} className="h-10 w-full rounded-lg mb-2" />
          ))}

          <Skeleton className="h-10 w-full mt-4" /> 
        </div>
      ))}
    </div>
  );
  if (board)
    return (
      <div
        className="w-full h-[89.8vh] "
        style={
          isImageUrl(board[0].cover)
            ? { backgroundImage: `url(${board[0].cover})`,backgroundSize:"cover",backgroundPosition:"center center" }
            : {background:board[0].cover}
        }
      >
        <BoardHeader />
        <div className="p-8 w-full min-h-[79vh] ">
          {board?.map((data) => (
            <List key={data._id} list={data.lists} />
          ))}
        </div>
      </div>
    );
};

export default Board;
