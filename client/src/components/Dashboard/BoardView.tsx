import { useWorkspaces } from "@/Context/workspacesContext";
import { Link, useParams } from "react-router-dom";
import BoardPlaceHolder from "../resuable/BoardPlaceHolder";

const BoardView = () => {
  const { workspaces } = useWorkspaces();
  const { workspaceId } = useParams();

  if (!workspaces) {
    return (
      <div className="text-center py-10 text-gray-400">
        Loading workspaces...
      </div>
    );
  }

  const ownedWorkspaces = workspaces.ownedWorkspaces || [];
  const joinedWorkspaces = workspaces.joinedWorkspaces || [];

  const allWorkspaces = [...ownedWorkspaces, ...joinedWorkspaces];

  if (!workspaceId) {
    return (
      <div className="text-center py-10 text-red-400">Invalid workspace ID</div>
    );
  }

  const workspace = allWorkspaces.find((w) => w._id === workspaceId);

  if (!workspace) {
    return (
      <div className="text-center py-10 text-red-400">
        Couldn't find workspace
      </div>
    );
  }
  return (
    <div>
      <h2 className="text-2xl text-textP font-charlie-text-r pl-5 my-4">
        Boards
      </h2>
      <div className="flex items-center gap-4 w-full flex-wrap pl-5">
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
  );
};

export default BoardView;
