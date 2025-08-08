import { socket } from "@/socket/socket";
import { AppDispatch } from "@/store/store";
import { workspaceMembersApi } from "@/store/workspace.members.api";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

export const useWorkspaceSocketInvalidation = ({
  eventName,
}: {
  eventName: string;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fn = () => {
        console.log("I am called brother")
      dispatch(
        workspaceMembersApi.util.invalidateTags([
          {
            type: "workspaceMember",
          },
          {
            type: "workspaceMembers",
          },
        ])
      );
    };
    socket.on(eventName, fn);
    return () => {
      socket.off(eventName, fn);
    };
  }, [dispatch]);
};
