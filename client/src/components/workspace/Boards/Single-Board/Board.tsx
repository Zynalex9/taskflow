import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/store";
import { useEffect } from "react";
import { fetchSingleBoard } from "../../../../store/BoardSlice";
import List from "./List";

const Board = () => {
  const { boardId } = useParams();
  const { board } = useSelector((state: RootState) => state.board);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (boardId) {
      dispatch(fetchSingleBoard(boardId));
      console.log(board);
    }
  }, [boardId]);
  return (
    <div>
      {board?.map((data) => (
        <List key={data._id} list={data.lists} />
      ))}
    </div>
  );
};

export default Board;
