import { Outlet } from "react-router-dom";
import Sidebar from "../components/Dashboard/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

const Dashboard = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-full  bg-fprimary min-h-screen flex max-lg:flex-col lg:items-start text-white font-charlie-text-r">
      <div className="w-full h-full lg:w-[20%]  sticky top-[1px] lg:p-4">
        <Sidebar />
      </div>
      <div className="w-full lg:w-[80%] p-4">
      <div>
      <div className="flex items-center justify-between  border-b border-gray-400 w-full p-8">
        <img src={user.profilePicture} alt="profile-picture" className="w-[10%] rounded-full object-center object-cover border" />
        <h1 className="font-charlie-display-sm text-3xl">{user.username}</h1>
      </div>
      <div>
      </div>
        <Outlet />
      </div>
    </div>
    </div>
  );
};

export default Dashboard;
