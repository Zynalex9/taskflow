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
        <h2 className="text-2xl font-charlie-text-r my-2">Collaborators </h2>
        <button className="flex items-center px-1.5 py-2 bg-blue-500 justify-between  text-black gap-2">
          <UserPlus size={18} /> Invite members to workspace
        </button>
      </div>
      <div className="flex flex-col pl-8 mt-4">
        <NavLink
          to={`/user/dashboard/${workspace._id}/members`}
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 bg-gray-600 rounded p-2 w-52"
              : "text-textP p-2 w-52"
          }
          end
        >
          <h1 className="font-charlie-display-sm text-sm">
            {" "}
            Workspace members 
          </h1>
        </NavLink>
        <NavLink
          to={`/user/dashboard/${workspace._id}/guests`}
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 bg-gray-600 rounded p-2 w-52"
              : "text-textP p-2 w-52"
          }
        >
          <h1 className="font-charlie-display-sm text-sm"> Guests </h1>
        </NavLink>
        <div className="border border-gray-400 w-52 my-2"></div>
        <NavLink
          to={`/user/dashboard/${workspace._id}/invites`}
          className={({ isActive }) =>
            isActive
              ? "text-blue-500 bg-gray-600 rounded p-2 w-52"
              : "text-textP p-2 w-52"
          }
        >
          <h1 className="font-charlie-display-sm text-sm"> Join Requests </h1>
        </NavLink>
      </div>
      <div className="pl-8">
        <Outlet />
      </div>
    </div>
  );
};

export default MembersPageLayout;
