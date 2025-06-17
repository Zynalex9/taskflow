import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import { useGetAllWorkspacesQuery } from "@/store/workspaceApi";
import WorkspacesContext from "@/Context/workspacesContext";
import { useEffect, useState } from "react";
import { IWorkspace } from "@/types/functionalites.types";

const Dashboard = () => {
  const { data } = useGetAllWorkspacesQuery(undefined);
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  useEffect(() => {
    if (data?.data) {
      setWorkspaces(data.data);
    }
  }, [data]);

  return (
    <WorkspacesContext.Provider value={{ workspaces, setWorkspaces }}>
      <div className="w-full min-h-screen bg-fprimary">
        <div className="w-[90%] mx-auto text-white font-charlie-text-r flex items-start flex-col lg:flex-row">
          <aside className="w-full lg:w-[20%] sticky top-0 px-4 bg-fprimary  z-10">
            <div className="hidden lg:block">
              <Sidebar />
            </div>
          </aside>

          <main className="w-full lg:w-[80%] pt-4">
            <div>
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </WorkspacesContext.Provider>
  );
};

export default Dashboard;
