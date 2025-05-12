import {
  LayoutGrid,
  Users,
  Settings,
  Table,
  Calendar,
  Plus,
  ChevronDown,
} from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { Link } from "react-router-dom";
import { isImageUrl } from "../../utils/helper";

const Sidebar = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const { boards, loading } = useSelector((state: RootState) => state.boards);
  const workspaceName = workspace?.name;
  return (
    <aside className="custom-scrollbar w-64 overflow-y-auto h-screen bg-[#1D2125] text-white border-r border-gray-100/50 p-4 pb-20 space-y-4">
      <div className="flex items-center">
        <div>
          {workspace?.cover?.startsWith("http") ? (
            <div
              style={{
                backgroundImage: `url(${workspace.cover})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-8 h-8 flex items-center justify-center rounded text-[#1D2125] font-bold"
            >
              {workspaceName?.[0]}
            </div>
          ) : (
            <div
              style={{ backgroundColor: workspace?.cover }}
              className="w-8 h-8 flex items-center justify-center rounded text-[#1D2125] font-bold"
            >
              {workspaceName?.[0]}
            </div>
          )}
        </div>
        <div className="flex flex-col ml-2">
          <span className="font-semibold text-sm">{workspaceName}</span>
        </div>
      </div>

      <nav className="space-y-2 text-[#9FADBC] font-charlie-text-r ">
        <Link to={`/user/w/workspace/${workspace?._id}`}>
          <div className="flex items-center space-x-2 text-sm hover:bg-gray-700 p-2 rounded cursor-pointer">
            <LayoutGrid size={16} />
            <span>Boards</span>
          </div>
        </Link>
        <Link to={`/user/w/workspace/${workspace?._id}/members`}>
          <div className="flex items-center  justify-between p-2 hover:bg-gray-700 rounded cursor-pointer">
            <div className="flex items-center space-x-2 text-sm">
              <Users size={16} />
              <span>Members</span>
            </div>
            <Plus size={14} />
          </div>
        </Link>

        <div>
          <div className="flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer">
            <div className="flex items-center space-x-2 text-sm">
              <Settings size={16} />
              <span>Workspace settings</span>
            </div>
            <ChevronDown size={14} />
          </div>
        </div>
      </nav>

      <div className="text-sm ">
        <p className="text-xs text-[#9FADBC] font-charlie-text-r px-2 mt-4">
          Workspace views
        </p>
        <Link to={`/user/w/workspace/${workspace?._id}/table`}>
          {" "}
          <div className="flex items-center text-[#9FADBC] font-charlie-text-r space-x-2 hover:bg-gray-700 p-2 rounded cursor-pointer mt-1">
            <Table size={16} />
            <span>Table</span>
          </div>
        </Link>
        <div className="flex items-center  text-[#9FADBC] font-charlie-text-r space-x-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
          <Calendar size={16} />
          <span>Calendar</span>
        </div>
      </div>

      <div className="text-sm">
        <p className="text-xl font-charlie-display-sm mb-1 text-gray-400 px-2 mt-4 ">
          Your boards
        </p>
        {loading
          ? "Loading boards"
          : boards?.yourBoards.map((board) => (
              <Link
                to={`/user/w/workspace/${workspace?._id}/board/${board._id}`}
              >
                <div className="flex items-center justify-between hover:bg-gray-700 p-2 rounded cursor-pointer ">
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-6 h-4 rounded-sm"
                      style={
                        isImageUrl(board.cover)
                          ? {
                              backgroundImage: `url(${board.cover})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }
                          : { backgroundColor: board.cover }
                      }
                    />
                    <span className="text-[#9FADBC] font-charlie-text-r text-md">
                      {board.title}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </aside>
  );
};

export default Sidebar;
