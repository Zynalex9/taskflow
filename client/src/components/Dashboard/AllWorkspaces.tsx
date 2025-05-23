import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface IWorkspace {
  _id: string;
  name: string;
  admin: string[];
  boards: string[];
  members: { role: string; _id: string }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  cover?: string; // made optional in case backend returns undefined
}

const AllWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [loading, setLoading] = useState<Boolean>(false);
  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const response = await axios.get<{ data: IWorkspace[] }>(
        `${import.meta.env.VITE_BASE_URL}/api/workspace/get-workspaces`,
        { withCredentials: true }
      );
      setWorkspaces(response.data.data);
    } catch (error) {
      console.log("Error fetching workspaces");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);
  if (loading)
    return (
      <h1 className="text-center text-textP text-4xl font-charlie-text-sb">
        Loading workspaces...
      </h1>
    );

  return (
    <div className="p-8">
      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Link key={workspace._id} to={`/user/w/workspace/${workspace._id}`}>
              <div className="bg-fprimary text-white rounded-2xl shadow-md overflow-hidden transition-transform transform hover:scale-105">
                <div className="h-32 w-full">
                  {typeof workspace.cover === "string" &&
                  workspace.cover.startsWith("http") ? (
                    <img
                      src={workspace.cover}
                      alt="Workspace cover"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full"
                      style={{
                        backgroundColor: workspace.cover || "#ccc",
                      }}
                    />
                  )}
                </div>
                <div className="p-4">
                  <h2 className="text-xl font-semibold">{workspace.name}</h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Members: {workspace.members.length}
                  </p>
                  <p className="text-sm text-gray-500">
                    Boards: {workspace.boards.length}
                  </p>
                  <p className="text-sm text-gray-500">
                    Created:{" "}
                    {new Date(workspace.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center text-3xl text-gray-600">
          No Workspace found
        </div>
      )}
    </div>
  );
};

export default AllWorkspaces;
