import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { useEffect } from "react";
import { isImageUrl } from "../../../utils/helper";
import { Link } from "react-router-dom";
import { fetchAllBoards } from "../../../store/BoardSlice";

const BoardDisplay = () => {
  const dispatch  = useDispatch<AppDispatch>()
  const { workspace } = useSelector((state: RootState) => state.workspace); 
  const { boards,loading } = useSelector((state: RootState) => state.boards); 

  useEffect(() => {
    if (workspace?._id) {
      dispatch(fetchAllBoards(workspace._id));
    }
  }, [workspace, dispatch]);

  if(loading) return <h1 className="text-center text-textP text-4xl font-charlie-text-sb">Loading boards...</h1>
  return (
    <div className="py-8 flex flex-wrap items-center justify-center gap-2">
      <div className="bg-[#333C43] text-center font-charlie-text-sb text-textP text-2xl p-12 w-[30%] rounded-xl shadow-2xl transition-colors duration-150 hover:bg-[#333C43]/50">
        <h2>Create new board</h2>
      </div>
      {boards?.yourBoards.map((board) => (
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
