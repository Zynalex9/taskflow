import { useParams } from "react-router-dom";

const Board = () => {
  const { boardId } = useParams();
  return <div>{boardId}</div>;
};

export default Board;
