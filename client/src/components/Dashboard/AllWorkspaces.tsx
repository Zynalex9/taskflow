import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { isImageUrl } from "@/utils/helper";
import BoardPlaceHolder from "../resuable/BoardPlaceHolder";
import { Link } from "react-router-dom";

const AllWorkspaces = () => {
  const { workspaces } = useSelector((state: RootState) => state.workspaces);
  return (
    <div>
      <h1 className="py-2 text-textP">Your Workspaces</h1>
      {workspaces &&
        workspaces.length > 0 &&
        workspaces.map((workspace) => (
          <div key={workspace._id}>
            <div className="flex gap-2 items-center  w-full cursor-pointer rounded py-0.5 px-1">
              {isImageUrl(workspace.cover) ? (
                <img
                  src={workspace.cover}
                  className="size-12 object-cover object-center rounded"
                />
              ) : (
                <div
                  className="size-10 rounded-lg text-center flex items-center justify-center"
                  style={{ backgroundColor: workspace.cover }}
                >
                  <h2 className="text-black text-2xl font-charlie-text-sb">
                    {workspace.name[0]}
                  </h2>
                </div>
              )}
              <div className="flex items-center justify-between w-full">
                <h1 className="text-lg text-textP font-charlie-text-r">
                  {workspace.name}
                </h1>
              </div>
            </div>
            <div className="flex gap-2 flex-wrap items-center  my-6 w-full">
              {workspace.boards.map((board) => (
                <BoardPlaceHolder
                  key={board._id}
                  bg={board.cover}
                  isTemplete={false}
                  title={board.title}
                  to={`/user/w/workspace/${workspace._id}/board/${board._id}`}
                />
              ))}
              <Link to={`/user/w/workspace/${workspace._id}`}>
                <button className="min-w-[12rem] h-32 bg-[#333C43] flex items-center justify-center text-center font-charlie-text-sb text-textP text-lg rounded-xl shadow-2xl transition-colors duration-150 hover:bg-[#333C43]/50">
                  <h2>Create new board</h2>
                </button>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AllWorkspaces;
