import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-full min-h-screen bg-fprimary text-white font-charlie-text-r flex items-start flex-col lg:flex-row">
      <aside className="w-full lg:w-[20%] sticky top-0 p-4 bg-fprimary border-r border-white/10 z-10">
        <Sidebar />
      </aside>

      <main className="w-full lg:w-[80%] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover border border-white/20"
          />
          <h1 className="font-charlie-display-sm text-2xl lg:text-3xl">
            {user.username}
          </h1>
        </div>

        <div>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
