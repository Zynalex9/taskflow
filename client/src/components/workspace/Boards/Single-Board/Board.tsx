import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/store";
import { useEffect } from "react";
import { fetchSingleBoard } from "../../../../store/BoardSlice";
import List from "./List";
import BoardHeader from "./BoardHeader";
import { isImageUrl } from "../../../../utils/helper";

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
      <h1 className="text-center text-textP text-4xl font-charlie-text-sb">
        Loading
      </h1>
    );
  if (board)
    return (
      <div
        className="w-full h-[89.8vh] overflow-auto custom-scrollbar"
        style={
          isImageUrl(board[0].cover)
            ? { backgroundImage: `url(${board[0].cover})`,backgroundSize:"cover",backgroundPosition:"center center" }
            : {backgroundColor:board[0].cover}
        }
      >
        <BoardHeader />
        <div className="p-8 w-full">
          {board?.map((data) => (
            <List key={data._id} list={data.lists} />
          ))}
        </div>
      </div>
    );
};

export default Board;
