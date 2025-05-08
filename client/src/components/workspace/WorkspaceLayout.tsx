import { Outlet, useParams } from "react-router-dom";
import Topbar from "../Topbar";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchworkspace } from "../../store/workspaceSlice";
import { toast, ToastContainer } from "react-toastify";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { workspace } = useSelector((state: RootState) => state.workspace);
  useEffect(() => {
    const getWorkspace = async () => {
      if (workspaceId) {
        try {
          const res = await dispatch(fetchworkspace(workspaceId)).unwrap();
          console.log("Workspace data:", res);
          console.log("workspace", workspace);
        } catch (error: any) {
          toast.error(error, { theme: "dark" });
        }
      }
    };

    getWorkspace();
  }, [workspaceId, dispatch]);
  return (
    <div className="w-full h-screen flex flex-col bg-fprimary">
      <div className="sticky top-0 z-[999]">
        <Topbar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/5 h-full">
          <Sidebar />
        </div>
        <div className="w-4/5 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
