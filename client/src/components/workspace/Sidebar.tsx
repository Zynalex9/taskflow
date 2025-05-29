import {
  LayoutGrid,
  Users,
  Settings,
  Table,
  Calendar,
  Plus,
  ChevronDown,
  ArrowLeftIcon,
  ArrowRight,
} from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { Link } from "react-router-dom";
import { isImageUrl } from "../../utils/helper";
import { Skeleton } from "../ui/skeleton";
import { useEffect} from "react";
import { fetchAllBoards } from "@/store/BoardSlice";
import AddBoardModal from "./Boards/Single-Board/Add Board Modal/AddBoardModal";
import { closeModal, openModal } from "@/store/BoardBGSlice";
import ShowMore from "./Boards/Single-Board/Add Board Modal/ShowMore";
import ColorsPopUp from "./Boards/Single-Board/Add Board Modal/ColorsPopUp";
import ImagesPopUp from "./Boards/Single-Board/Add Board Modal/ImagesPopUp";
interface Props {
  barOpen: boolean;
  setBarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
const Sidebar = ({ barOpen, setBarOpen }: Props) => {
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const { boards, loading } = useSelector((state: RootState) => state.boards);
  const { showBoardModal,showMore,showMoreImgs,showMoreColors } = useSelector(
    (state: RootState) => state.boardModalControll
  );
  const workspaceName = workspace?.name;
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (workspace?._id) {
      dispatch(fetchAllBoards(workspace._id));
    }
  }, [workspace, dispatch]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "BracketLeft") {
        setBarOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <>
      <aside
        className={`custom-scrollbar h-screen bg-[#1D2125]/90 text-white/90 border-r border-gray-100/30 p-4 pb-20 space-y-4 transition-all duration-200 ease-in-out
    ${barOpen ? "w-40 lg:w-64 translate-x-0" : "w-0 -translate-x-36"}
    overflow-y-auto backdrop-blur-sm
  `}
      >
        <div className="flex justify-between items-center">
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
          <div>
            <button
              onClick={() => {
                setBarOpen(false);
                dispatch(closeModal());
              }}
              className="lg:block"
            >
              <HoverCard>
                <HoverCardTrigger asChild>
                  <ArrowLeftIcon
                    size={16}
                    className="text-textP hover:text-white cursor-pointer transition-colors"
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-[200px] p-3 bg-[#22272B] border border-[#3C4043] shadow-lg rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-textP text-sm">Collapse section</span>
                    <span className="text-white bg-[#3C4043] px-2 py-1 rounded text-xs font-mono">
                      [
                    </span>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </button>
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
          <Link to={`/user/w/workspace/${workspace?._id}/calendar`}>
            <div className="flex items-center  text-[#9FADBC] font-charlie-text-r space-x-2 hover:bg-gray-700 p-2 rounded cursor-pointer">
              <Calendar size={16} />
              <span>Calendar</span>
            </div>
          </Link>
        </div>

        <div className="text-sm">
          <div className="flex justify-between items-center text-gray-400">
            <p className="text-xl font-charlie-display-sm mb-1 text-gray-400 px-2 mt-4 ">
              Your boards
            </p>
            {showBoardModal ? (
              <button
                onClick={() => dispatch(closeModal())}
                className="cursor-pointer"
              >
                <Plus size={14} />
              </button>
            ) : (
              <button
                onClick={() => dispatch(openModal())}
                className="cursor-pointer"
              >
                <Plus size={14} />
              </button>
            )}
          </div>
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded animate-pulse"
                >
                  <div className="flex items-center space-x-2">
                    <Skeleton className="w-6 h-4 rounded-sm" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))
            : boards?.yourBoards.map((board) => (
                <Link
                key={board._id}
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
                            : { background: board.cover }
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
      <div
        className={`p-1.5 shadow-2xl flex items-center justify-center  absolute top-32 left-4 bg-fprimary rounded-full text-center z-[100] text-gray-300 ${
          barOpen ? "hidden" : "block"
        }`}
      >
        <button onClick={() => setBarOpen(true)}>
          <HoverCard>
            <HoverCardTrigger asChild>
              <ArrowRight
                size={16}
                className="text-textP hover:text-white cursor-pointer transition-colors"
              />
            </HoverCardTrigger>
            <HoverCardContent className="w-[200px] p-3 bg-[#22272B] border border-[#3C4043] shadow-lg rounded-md">
              <div className="flex justify-between items-center">
                <span className="text-textP text-sm">Expand section</span>
                <span className="text-white bg-[#3C4043] px-2 py-1 rounded text-xs font-mono">
                  [
                </span>
              </div>
            </HoverCardContent>
          </HoverCard>
        </button>
      </div>
      {showBoardModal ? <AddBoardModal /> : ""}
      {showMore && <ShowMore />}
      {showMoreColors && <ColorsPopUp />}
      {showMoreImgs && <ImagesPopUp />}

    </>
  );
};

export default Sidebar;
