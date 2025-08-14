import {
  LayoutTemplate,
  Trello,
  ChevronDown,
  Plus,
  UserPlus,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { isImageUrl } from "@/utils/helper";
import { useState } from "react";
import { useWorkspaces } from "@/Context/workspacesContext";

const Sidebar = () => {
  const { workspaces } = useWorkspaces();
  const [openWorkspaceId, setOpenWorkspaceId] = useState<string | null>(null);

  const toggleWorkspace = (id: string) => {
    setOpenWorkspaceId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="pt-6 max-w-4xl mx-auto space-y-1">
      <div>
        <NavLink
          to={"/user/dashboard"}
          end
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "text-textP"
          }
        >
          <div className="flex items-center gap-2 my-4">
            <LayoutTemplate size={14} />
            <h1 className="text-md font-charlie-text-r">Boards</h1>
          </div>
        </NavLink>
        <NavLink
          to={"/user/dashboard/templates"}
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "text-textP"
          }
        >
          <div className="flex items-center gap-2 my-4">
            <Trello size={14} />
            <h1 className="text-md font-charlie-text-r">Templates</h1>
          </div>
        </NavLink>
    
        <NavLink
          to={"/user/dashboard/edit-info"}
          className={({ isActive }) =>
            isActive ? "text-blue-600" : "text-textP"
          }
        >
          <div className="flex items-center gap-2 my-4">
            <UserPlus size={14} />
            <h1 className="text-md font-charlie-text-r">Edit Profile</h1>
          </div>
        </NavLink>
      </div>

      <div className="border-[0.5px] my-4 border-gray-500 w-full"></div>
      <h1 className="text-xs text-textP font-charlie-display-sm">Workspaces</h1>
      <div className="space-y-2">
        {workspaces && workspaces.ownedWorkspaces?.length > 0 ? (
          workspaces?.ownedWorkspaces.map((workspace) => {
            const isOpen = openWorkspaceId === workspace._id;
            return (
              <div key={workspace._id}>
                <div
                  className="flex gap-2 items-center w-full cursor-pointer transition-all duration-100 hover:bg-gray-500 rounded py-0.5 px-1"
                  onClick={() => toggleWorkspace(workspace._id)}
                >
                  {isImageUrl(workspace.cover) ? (
                    <img
                      src={workspace.cover}
                      className="w-8 h-6 object-cover object-center rounded"
                    />
                  ) : (
                    <div
                      className="w-8 h-6 rounded flex items-center justify-center text-black font-charlie-display-sm"
                      style={{ backgroundColor: workspace.cover }}
                    >
                      {workspace.name[0]}
                    </div>
                  )}
                  <div className="flex items-center justify-between w-full">
                    <h1 className="text-sm text-textP font-charlie-text-r">
                      {workspace.name}
                    </h1>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="pl-6 pt-2">
                    <NavLink
                      to={`/user/dashboard/${workspace._id}/boards-view`}
                      className={({ isActive }) =>
                        isActive ? "text-blue-600" : "text-textP"
                      }
                    >
                      <div className="flex items-center gap-2">
                        <LayoutTemplate size={14} />
                        <h1 className="text-sm font-charlie-text-r">Boards</h1>
                      </div>
                    </NavLink>
                    <NavLink
                      to={`/user/dashboard/${workspace._id}/members`}
                      className={({ isActive }) =>
                        isActive ? "text-blue-600" : "text-textP"
                      }
                    >
                      <div className="flex items-center  text-textP  gap-2">
                        <UserPlus size={14} />

                        <h1 className="text-sm my-2 flex-grow text-textP font-charlie-text-r">
                          Members
                        </h1>
                        <Plus size={14} />
                      </div>
                    </NavLink>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-gray-400 font-charlie-text-r italic">
            No workspaces found.
          </p>
        )}
      </div>
      <h1 className="text-xs text-textP font-charlie-display-sm mt-5">
        Joined Workspaces
      </h1>
      <div className="space-y-2">
        {workspaces &&
          workspaces.joinedWorkspaces?.length > 0 &&
          workspaces?.joinedWorkspaces.map((workspace) => {
            const isOpen = openWorkspaceId === workspace._id;

            return (
              <div key={workspace._id}>
                <div
                  className="flex gap-2 items-center w-full cursor-pointer transition-all duration-100 hover:bg-gray-500 rounded py-0.5 px-1"
                  onClick={() => toggleWorkspace(workspace._id)}
                >
                  {isImageUrl(workspace.cover) ? (
                    <img
                      src={workspace.cover}
                      className="w-8 h-6 object-cover object-center rounded"
                    />
                  ) : (
                    <div
                      className="w-8 h-6 rounded flex items-center justify-center text-black font-charlie-display-sm"
                      style={{ backgroundColor: workspace.cover }}
                    >
                      {workspace.name[0]}
                    </div>
                  )}
                  <div className="flex items-center justify-between w-full">
                    <h1 className="text-sm text-textP font-charlie-text-r">
                      {workspace.name}
                    </h1>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </div>

                {isOpen && (
                  <div className="pl-6 pt-2">
                    <NavLink
                      to={`/user/dashboard/${workspace._id}/boards-view`}
                      className={({ isActive }) =>
                        isActive ? "text-blue-600" : "text-textP"
                      }
                    >
                      <div className="flex items-center gap-2">
                        <LayoutTemplate size={14} />
                        <h1 className="text-sm font-charlie-text-r">Boards</h1>
                      </div>
                    </NavLink>
                    <NavLink
                      to={`/user/dashboard/${workspace._id}/members`}
                      className={({ isActive }) =>
                        isActive ? "text-blue-600" : "text-textP"
                      }
                    >
                      <div className="flex items-center  text-textP  gap-2">
                        <UserPlus size={14} />

                        <h1 className="text-sm my-2 flex-grow text-textP font-charlie-text-r">
                          Members
                        </h1>
                        <Plus size={14} />
                      </div>
                    </NavLink>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Sidebar;
