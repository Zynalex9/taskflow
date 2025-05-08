import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Workspace {
  _id: string;
  name: string;
  admin: string[];
  boards: string[];
  members: { role: string; _id: string }[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const getRandomColor = (): string => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 85%)`;
};

const AllWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);

  const fetchWorkspaces = async () => {
    try {
      const response = await axios.get<{ data: Workspace[] }>(
        "http://localhost:3000/api/workspace/get-workspaces",
        { withCredentials: true }
      );
      setWorkspaces(response.data.data);
    } catch (error) {
      console.log("Error fetching workspaces");
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return (
    <div className="p-8">
      {workspaces.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaces.map((workspace) => (
            <Link to={`/user/w/workspace/${workspace._id}`}>
              <div
                key={workspace._id}
                className="bg-fprimary text-white rounded-2xl shadow-md overflow-hidden transition-transform transform hover:scale-105"
              >
                <div
                  className="h-32"
                  style={{ backgroundColor: getRandomColor() }}
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold ">{workspace.name}</h2>
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
