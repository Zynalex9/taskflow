import { useState } from "react";
import { useWorkspaces } from "@/Context/workspacesContext";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const MembersOutlet = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [filter, setFilter] = useState("");
  const { workspaces } = useWorkspaces();
  const { workspaceId } = useParams();
  const ownedWorkspaces = workspaces.ownedWorkspaces || [];
  const joinedWorkspaces = workspaces.joinedWorkspaces || [];

  const allWorkspaces = [...ownedWorkspaces, ...joinedWorkspaces];
  const workspace = allWorkspaces?.find((w) => w._id === workspaceId);
  const workspaceMembers = workspace?.members || [];
  const getBoardsCountForUser = (userId: string) => {
    return (
      workspaces.ownedWorkspaces
        ?.find((w) => w._id === workspaceId)
        ?.boards.filter((board) =>
          board.members.some((member) => member.user === userId)
        ).length || 0
    );
  };

  const [loading, setIsLoading] = useState(false);
  const [linkCreated, setLinkCreated] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const handleCopy = async () => {
    try {
      if (!inviteLink) {
        toast.error("No link to copy", { theme: "dark" });
        return;
      }
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setInviteLink("");
      }, 2000);
    } catch (error) {
      toast.error("Failed to copy text", { theme: "dark" });
    }
  };
  const handleLink = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/workspace/generate-share-link`,
        {
          entityId: workspaceId,
          entityType: "workspace",
          workspaceId: workspaceId,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setInviteLink(
          `${import.meta.env.VITE_CLIENT_URL}/join/${workspace?._id}/${
            response.data.data.inviteLink
          }`
        );
        setLinkCreated(true);
      } else {
        toast.error("Failed to create link", { theme: "dark" });
      }
    } catch (error) {
      toast.error("Error creating link", { theme: "dark" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-white pl-2 py-8 space-y-8">
      <div className="font-charlie-text-r">
        <h1 className="text-xl font-semibold">
          Workspace members ({workspaceMembers.length})
        </h1>
        <p className="text-sm text-gray-400 mt-2">
          Workspace members can view and join all Workspace visible boards and
          create new boards in the Workspace. Adding new members will
          automatically update your billing.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <p className="text-sm text-gray-400 w-full md:w-96">
          Anyone with an invite link can join this paid Workspace. You’ll be
          billed for each member that joins. You can also disable and create a
          new invite link for this Workspace at any time.
        </p>
        <div className="flex gap-2 mt-4 md:mt-0">
            {inviteLink.length > 0 ? (
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded-md text-sm hover:bg-gray-600"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          ) : (
            <button
              onClick={handleLink}
              className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded-md text-sm hover:bg-gray-600"
            >
              {loading ? "Generating link..." : "Invite with link"}
            </button>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-sm text-white"
      />

      <div className="space-y-4 ">
        {workspaceMembers.length > 0 ? (
          workspaceMembers
            .filter((member) =>
              member.user.username.toLowerCase().includes(filter.toLowerCase())
            )
            .map((member) => (
              <div
                key={member._id}
                className="flex items-center justify-between border-b border-gray-700 pb-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold overflow-hidden">
                    {member.user.profilePicture ? (
                      <img
                        src={member.user.profilePicture}
                        alt={member.user.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                    ) : (
                      member.user.username.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {member.user.username}
                    </p>
                    <p className="text-xs text-gray-400">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link to={`/user/w/workspace/${workspaceId}`}>
                    <button className="text-sm bg-gray-800 px-2.5 py-1.5 rounded-md">
                      View boards ({getBoardsCountForUser(member.user._id)})
                    </button>
                  </Link>
                  <select
                    value={member.role}
                    className="bg-gray-800 text-sm px-2 py-1 rounded-md"
                    disabled
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                  {member.user._id === user?._id && (
                    <button className="text-sm bg-gray-800 px-2.5 py-1.5 rounded-md text-red-400">
                      Leave
                    </button>
                  )}
                </div>
              </div>
            ))
        ) : (
          <div className="text-gray-400">No members found</div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default MembersOutlet;
