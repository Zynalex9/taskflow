import { RootState } from "@/store/store";
import {
  ISingleWorkspaceResponse,
  IWorkspace,
} from "@/types/functionalites.types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

export const WorkspaceLink = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { workspaceId, token } = useParams();
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const getWorkspace = async () => {
    try {
      setLoading(true)
      const response = await axios.get<ISingleWorkspaceResponse>(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/workspace/get-workspace?workspaceId=${workspaceId}`,
        { withCredentials: true }
      );
      if (response.data.success) {
        setWorkspace(response.data.data);
      }
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false)
    }
  };
  const handleJoin = async () => {
    if (!token) {
      toast.error("Invalid invite link", { theme: "dark" });
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/join-via-link`,
        { token },
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("Joined successfully!", { theme: "dark" });
        navigate(`/user/w/workspace/${workspaceId}`);
      } else {
        toast.error(res.data.message || "Failed to join", { theme: "dark" });
      }
    } catch (error: any) {
      console.error("Error joining:", error);
      toast.error(error.response?.data?.message || "Error joining the board", {
        theme: "dark",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getWorkspace();
  }, [workspaceId]);
  const { user } = useSelector((state: RootState) => state.auth);
  const isMember = workspace?.members.some(
    (u) => u.user.toString() === user?._id.toString()
  );

  if (loading) {
    return (
      <div className="w-full h-screen bg-fprimary text-white flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-fprimary w-full h-screen flex items-center justify-center text-white px-4">
      <div className="bg-[#1f1f24] w-full max-w-xl rounded-2xl shadow-2xl px-8 py-10 flex flex-col items-center gap-6 text-center">
        {isMember ? (
          <>
            <p className="text-xl font-semibold">
              ✅ You are already a member of the workspace:
            </p>
            <h2 className="text-2xl text-blue-primary font-bold">
              {workspace?.name}
            </h2>
            <button
              className="mt-4 bg-blue-primary hover:bg-blue-600 text-black font-medium px-6 py-2 rounded-lg shadow-sm transition duration-200"
              onClick={() => navigate(`/user/w/workspace/${workspaceId}`)}
            >
              View Workspace
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">
              👋 Hello{" "}
              <span className="text-blue-primary">{user?.firstName}</span>!
            </h2>
            <p className="text-lg">
              You’re invited to join the workspace{" "}
              <span className="text-blue-primary font-medium">
                {workspace?.name}
              </span>
              .
            </p>
            <button
              onClick={handleJoin}
              className="mt-4 bg-blue-primary hover:bg-blue-600 text-black font-medium px-6 py-2 rounded-lg shadow-sm transition duration-200"
            >
              Join workspace
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};
