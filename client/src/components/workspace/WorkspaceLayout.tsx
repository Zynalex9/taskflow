import { Outlet, useParams } from "react-router-dom";
import Topbar from "../Topbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchworkspace } from "../../store/workspaceSlice";
import { toast } from "react-toastify";

const WorkspaceLayout = () => {
  const { workspaceId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const workspace = useSelector(
    (state: RootState) => state.workspace.workspace
  );
  const loading = useSelector((state: RootState) => state.workspace.loading);
  const error = useSelector((state: RootState) => state.workspace.error);

  const user = useSelector((state: RootState) => state.auth.user);

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

  if (loading) {
    return <div>Loading workspace...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!workspace) {
    return <div>No workspace found.</div>;
  }

  const isAuthenticated =
    (!!user && workspace.createdBy === user._id) ||
    workspace.admin?.some((admin) => admin === user?._id) ||
    workspace.members?.some((member) => member.user === user?._id);

  if (!isAuthenticated) {
    return (
      <div>
        You are not authorized to view this workspace. Please contact the
        workspace owner.
      </div>
    );
  }

  return (
    <div className="w-full h-screen flex flex-col bg-fprimary">
      <div className="sticky top-0 z-[999]">
        <Topbar />
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className={`h-full ${barOpen ? "bg-fprimary" : "bg-[#535659]"}`}>
          <Sidebar barOpen={barOpen} setBarOpen={setBarOpen} />
        </div>
        <div className="w-full h-full overflow-y-auto custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
