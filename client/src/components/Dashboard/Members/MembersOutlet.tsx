import { useState } from "react";
import { ClipboardCopy } from "lucide-react";
import { useWorkspaces } from "@/Context/workspacesContext";
import { useParams } from "react-router-dom";
import { IWorkspace } from "@/types/functionalites.types"; 

const MembersOutlet = () => {
  const [filter, setFilter] = useState("");
  const workspaces = useWorkspaces();
  const { workspaceId } = useParams();
  const workspace: IWorkspace | undefined = workspaces?.find((w) => w._id === workspaceId);
  const workspaceMembers = workspace?.members || [];

  const getBoardsCountForUser = (userId: string) => {
    return workspaces
      ?.find((w) => w._id === workspaceId)
      ?.boards.filter((board) =>
        board.members.some((member) => member.user === userId)
      ).length || 0;
  };

  return (
    <div className="text-white px-6 py-8 space-y-8">
      <div>
        <h1 className="text-xl font-semibold flex items-center gap-2">
          Workspace members ({workspaceMembers.length})
          <ClipboardCopy size={16} className="cursor-pointer" />
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
          <button className="text-sm text-gray-300">Disable invite link</button>
          <button className="flex items-center gap-1 px-3 py-1.5 bg-gray-700 rounded-md text-sm hover:bg-gray-600">
            Invite with link
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Filter by name"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-sm text-white"
      />

      <div className="space-y-4">
        {workspaceMembers.length > 0 ? (
          workspaceMembers
            .filter((member) =>
              member.user.username.toLowerCase().includes(filter.toLowerCase())
            )
            .map((member, index) => (
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
                    <p className="text-sm font-medium">{member.user.username}</p>
                    <p className="text-xs text-gray-400">{member.user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="text-sm bg-gray-800 px-2.5 py-1.5 rounded-md">
                    View boards ({getBoardsCountForUser(member.user._id)})
                  </button>
                  <select
                    value={member.role}
                    className="bg-gray-800 text-sm px-2 py-1 rounded-md"
                    disabled
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                  <button className="text-sm bg-gray-800 px-2.5 py-1.5 rounded-md text-red-400">
                    {index === 0 ? "Remove" : "Leave"}
                  </button>
                </div>
              </div>
            ))
        ) : (
          <div className="text-gray-400">No members found</div>
        )}
      </div>
    </div>
  );
};

export default MembersOutlet;
