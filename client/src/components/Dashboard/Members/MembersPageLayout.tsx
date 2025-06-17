import { useWorkspaces } from "@/Context/workspacesContext";
import { UserPlus } from "lucide-react";
import { NavLink, Outlet, useParams } from "react-router-dom";

const MembersPageLayout = () => {
  const { workspaceId } = useParams();
  const workspaces = useWorkspaces();
  console.log(workspaceId);
  const workspace = workspaces?.find((w) => w._id === workspaceId);
  if (!workspace) return <div>No Workspace found</div>;
  return (
    <div>
      <div className="flex items-center justify-between w-full">
        <h2>Collaborators (2)</h2>
        <button className="flex items-center px-1.5 py-2 bg-blue-500 justify-between  text-black gap-2">
          <UserPlus size={18} /> Invite members to workspace
        </button>
      </div>
      <div className="flex flex-col pl-8">
        <NavLink
          to={`/user/dashboard/${workspace._id}/members`}
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 bg-gray-600 rounded p-2 w-52"
              : "text-textP p-2 w-52"
          }
          end
        >
          <h1 className="font-charlie-display-sm text-sm"> Workspace members (2)</h1>
        </NavLink>
        <NavLink
          to={`/user/dashboard/${workspace._id}/members/guests`}
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 bg-gray-600 rounded p-2 w-52"
              : "text-textP p-2 w-52"
          }
        >
          <h1 className="font-charlie-display-sm text-sm"> Guests (2)</h1>
        </NavLink>
        <div className="border-[0.5px] border-gray-400 w-52 my-2"></div>
        <NavLink
          to={`/user/dashboard/${workspace._id}/members/invites`}
          className={({ isActive }) =>
            isActive
              ? "text-blue-400 bg-gray-600 rounded p-2 w-52"
              : "text-textP p-2 w-52"
          }
        >
          <h1 className="font-charlie-display-sm text-sm"> Invites (2)</h1>
        </NavLink>
      </div>
      <Outlet />
    </div>
  );
};

export default MembersPageLayout;
