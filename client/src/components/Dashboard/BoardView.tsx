import { useWorkspaces } from "@/Context/workspacesContext";
import { Link, useParams } from "react-router-dom";
import BoardPlaceHolder from "../resuable/BoardPlaceHolder";
import BoardTop from "../workspace/Boards/BoardTop";

const BoardView = () => {
  const {workspaces} = useWorkspaces();
  const { workspaceId } = useParams();

  if (!workspaceId || !workspaces) return <div>Loading...</div>;

  const workspace = workspaces.find((w) => w._id === workspaceId);

  if (!workspace) {
    return <div>Couldn't find workspace</div>;
  }

  return (
    <div>
      <BoardTop />
      <h2 className="text-2xl text-textP font-charlie-text-r pl-5 my-4">
        Your boards
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
