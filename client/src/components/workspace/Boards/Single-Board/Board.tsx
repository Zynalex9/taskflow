import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../../store/store";
import { useEffect } from "react";
import { fetchSingleBoard } from "../../../../store/BoardSlice";

const Board = () => {
  const { boardId } = useParams();
  const {board,loading,error} = useSelector((state:RootState)=>state.board)
  const dispatch = useDispatch<AppDispatch>()
useEffect(()=>{
  if(boardId){
    dispatch(fetchSingleBoard(boardId))
    console.log(board)
  }
},[boardId])
  return <div>{boardId}</div>;
};

export default Board;
