import { Outlet, useParams } from "react-router-dom";
import Topbar from "../Topbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
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
    const [barOpen, setBarOpen] = useState(true);
  
  return (
    <div className="w-full h-screen flex flex-col bg-fprimary">
      <div className="sticky top-0 z-[999]">
        <Topbar />
      </div>
      <div className="flex flex-1 overflow-hidden  ">
        <div className={`h-full ${barOpen? "bg-fprimary":"bg-[#535659]"}`}>
          <Sidebar barOpen={barOpen} setBarOpen={setBarOpen}/>
        </div>
        <div className="w-full h-full overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
