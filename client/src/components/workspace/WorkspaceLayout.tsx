import { Outlet, useParams } from "react-router-dom";
import Topbar from "../Topbar";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchworkspace } from "../../store/workspaceSlice";
import { toast } from "react-toastify";
import { Skeleton } from "../ui/skeleton";
import { socket } from "@/socket/socket";

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
    socket.emit("joinedWorkspace", workspaceId);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    }
  }, []);
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
    return (
      <div className="w-full h-screen flex flex-col bg-fprimary p-4">
        <Skeleton className="h-12 w-full mb-4" />

        <div className="flex flex-1 gap-4 overflow-hidden custom-scrollbar">
          <Skeleton className="h-screen w-64" />

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <Skeleton className="h-screen w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!workspace) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="max-w-md bg-gray-800 border border-gray-600 rounded-lg shadow-md p-8 text-center">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L15 12l-5.25-5"
            />
          </svg>
          <h2 className="text-2xl font-semibold text-white mb-2">
            Workspace Not Found
          </h2>
          <p className="text-gray-400">
            Sorry, we couldn&apos;t find the workspace you are looking for.
          </p>
        </div>
      </div>
    );
  }

  const isAuthenticated =
    (!!user && workspace.createdBy === user._id) ||
    workspace.admin?.some((admin) => admin === user?._id) ||
    workspace.members?.some((member) => member.user === user?._id);
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4">
        <div className="max-w-md bg-gray-800 border border-red-600 rounded-lg shadow-lg p-8 text-center">
          <svg
            className="mx-auto mb-4 w-16 h-16 text-red-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>

          <h2 className="text-2xl font-semibold text-white mb-2">
            Access Denied
          </h2>
          <p className="text-gray-300 mb-4">
            You are not authorized to view this workspace.
          </p>
          <p className="text-gray-400">
            Please contact the{" "}
            <span className="font-semibold text-red-400">workspace owner</span>{" "}
            for access.
          </p>
        </div>
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
        <div className="w-full h-full overflow-y-hidden custom-scrollbar">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
