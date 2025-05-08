import { Outlet, useParams } from "react-router-dom";
import Topbar from "../Topbar";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store/store";
import { fetchworkspace } from "../../store/workspaceSlice";
import { toast, ToastContainer } from "react-toastify";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const getWorkspace = async () => {
      if (workspaceId) {
        try {
          const res = await dispatch(fetchworkspace(workspaceId)).unwrap();
          console.log("Workspace data:", res);
        } catch (error:any) {
          toast.error(error, { theme: "dark" });
        }
      }
    };

    getWorkspace();
  }, [workspaceId, dispatch]);
  return (
    <div className="w-full bg-fprimary">
      <Topbar />
      <div className="w-full flex items-start">
        <div className="w-1/5 h-screen  sticky top-0">
          <Sidebar />
        </div>
        <div className="w-4/5 ">
          <Outlet />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WorkspaceLayout;
