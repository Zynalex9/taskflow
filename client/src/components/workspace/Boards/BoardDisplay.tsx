import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { useEffect, useState } from "react";
import { IBoard, IBoardResponse } from "../../../types/functionalites.types";
import { isImageUrl } from "../../../utils/helper";
import { Link } from "react-router-dom";

const BoardDisplay = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const [myBoards, setMyBoards] = useState<IBoard[]>([]);
  const [otherBoards, setOtherBoards] = useState<IBoard[]>([]);
  const fetchBoards = async () => {
    try {
      const response = await axios.get<IBoardResponse>(
        `http://localhost:3000/api/board/${workspace?._id}/get-boards`,
        { withCredentials: true }
      );
      if (response?.data.success) {
        setMyBoards(response.data.data.yourBoards);
        setOtherBoards(response.data.data.otherBoards);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    fetchBoards();
  }, []);
  useEffect(() => {
    console.log("MY Boards:", myBoards);
    console.log("yOUR Boards:", otherBoards);
  }, [myBoards]);
  return (
    <div className="py-8 flex flex-wrap items-center justify-center gap-2">
      <div className="bg-[#333C43] text-center font-charlie-text-sb text-textP text-2xl p-12 w-[30%] rounded-xl shadow-2xl transition-colors duration-150 hover:bg-[#333C43]/50">
        <h2>Create new board</h2>
      </div>
      {myBoards.map((board) => (
        <Link
          to=" "
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
          className="p-12 w-[30%] rounded-xl shadow-2xl transition-transform duration-200 hover:scale-95"
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
