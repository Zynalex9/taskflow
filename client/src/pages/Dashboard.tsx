import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store/store";
import { useEffect } from "react";
import { getAllWorkspaces } from "@/store/workspacesSlice";
import { useGetAllWorkspacesQuery } from "@/store/workspaceApi";
import WorkspacesContext from "@/Context/workspacesContext";

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useGetAllWorkspacesQuery(undefined);
  const workspaces = data?.data;
  console.log(data);
  const fetchAllWorkspaces = async () => {
    try {
      await dispatch(getAllWorkspaces());
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllWorkspaces();
  }, []);

  return (
    <WorkspacesContext.Provider value={workspaces}>
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
