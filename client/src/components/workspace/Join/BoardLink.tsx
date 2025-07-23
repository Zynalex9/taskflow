import { RootState } from "@/store/store";
import { IBoard, ISingleBoardResponse } from "@/types/functionalites.types";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const BoardLink = () => {
  const [isMember, setIsMember] = useState<boolean | null>(null);
  const [board, setBoard] = useState<IBoard | null>(null);
  const { user } = useSelector((state: RootState) => state.auth);
  const { boardId, workspaceId } = useParams();
  const navigator = useNavigate();
  const checkMemberShip = async () => {
    try {
      const res = await axios.get<ISingleBoardResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/board/single/${boardId}`,
        {
          withCredentials: true,
        }
      );
      const boardData = res.data.data;
      setBoard(boardData);
      const members = boardData.members?.map((m) => m._id) || [];
      setIsMember(members.includes(user?._id!));
    } catch (error) {
      console.error("Error checking board membership:", error);
    }
  };

  useEffect(() => {
    if (boardId && user) checkMemberShip();
  }, [boardId, user]);

  if (isMember === null) {
    return (
      <div className="w-full h-screen bg-fprimary text-white flex items-center justify-center">
        <p className="text-lg">Checking membership...</p>
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
                navigator(`/user/w/workspace/${workspaceId}/board/${boardId}`)
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
            <button className="mt-4 bg-blue-primary hover:bg-blue-600 text-black font-medium px-6 py-2 rounded-lg shadow-sm transition duration-200">
              Join Board
            </button>
          </>
        )}
      </div>
    </div>
  );
};
