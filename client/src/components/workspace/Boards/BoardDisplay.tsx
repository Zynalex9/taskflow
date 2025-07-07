import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { isImageUrl } from "../../../utils/helper";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { myApi } from "../../../store/myApi";
import { openModal } from "@/store/BoardBGSlice";
const BoardDisplay = ({
  searchTerm,
  sortOption,
}: {
  searchTerm: string;
  sortOption: string;
}) => {
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const { loading } = useSelector((state: RootState) => state.boards);
  const dispatch = useDispatch<AppDispatch>();
  const bboards = useSelector((state: RootState) =>
    myApi.endpoints.getAllBoards.select(workspace?._id ?? "")(state)
  );
  const filteredBoards = bboards?.data?.data?.yourBoards?.filter((board) =>
    board.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (sortOption === "asc") {
    filteredBoards?.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "desc") {
    filteredBoards?.sort((a, b) => b.title.localeCompare(a.title));
  }
  if (!workspace?._id) {
    return <div>Loading workspace...</div>;
  }

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
        <button onClick={() => dispatch(openModal())}>
          <h2>Create new board</h2>
        </button>
      </div>
      {filteredBoards?.map((board) => (
        <Link
          to={`/user/w/workspace/${workspace._id}/board/${board._id}`}
          key={board._id}
          style={
            isImageUrl(board.cover)
              ? {
                  backgroundImage: `url(${board.cover})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { background: board.cover }
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
