import { Outlet, useParams } from "react-router-dom";
import Topbar from "../Topbar";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchworkspace } from "../../store/workspaceSlice";
import { toast } from "react-toastify";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getWorkspace = async () => {
      if (workspaceId) {
        try {
           await dispatch(fetchworkspace(workspaceId)).unwrap();
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
