import { RootState } from "@/store/store";
import { IBoard } from "@/types/functionalites.types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

export const BoardLink = () => {
  const [loading, setLoading] = useState(true);
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [board, setBoard] = useState<IBoard | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { boardId, workspaceId, token } = useParams();
console.log(boardId,workspaceId,token)
  const navigate = useNavigate();

  // Check if the user is already a member
  const checkMembership = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/board/single/${boardId}`,
        { withCredentials: true }
      );
      const boardData = res.data.data;
      setBoard(boardData);
      const members =
        boardData.members?.map((m: any) => m.user?._id || m._id) || [];
      setIsMember(members.includes(user?._id!));
    } catch (error) {
      console.error("Error checking membership:", error);
      toast.error("Failed to check membership", { theme: "dark" });
    } finally {
      setLoading(false);
    }
  };

  // Join board via invite
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
        navigate(`/user/w/workspace/${workspaceId}/board/${boardId}`);
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
    if (boardId && user) {
      checkMembership();
    }
  }, [boardId, user]);

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
              ✅ You are already a member of the board:
            </p>
            <h2 className="text-2xl text-blue-primary font-bold">
              {board?.title}
            </h2>
            <button
              className="mt-4 bg-blue-primary hover:bg-blue-600 text-black font-medium px-6 py-2 rounded-lg shadow-sm transition duration-200"
              onClick={() =>
                navigate(`/user/w/workspace/${workspaceId}/board/${boardId}`)
              }
            >
              View Board
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold">
              👋 Hello{" "}
              <span className="text-blue-primary">{user?.firstName}</span>!
            </h2>
            <p className="text-lg">
              You’re invited to join the board{" "}
              <span className="text-blue-primary font-medium">
                {board?.title}
              </span>
              .
            </p>
            <button
              onClick={handleJoin}
              className="mt-4 bg-blue-primary hover:bg-blue-600 text-black font-medium px-6 py-2 rounded-lg shadow-sm transition duration-200"
            >
              Join Board
            </button>
          </>
        )}
      </div>
    </div>
  );
};
