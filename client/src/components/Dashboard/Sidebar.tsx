import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch } from "../../store/store";
import { logoutUser } from "../../store/AuthSlice";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex flex-col h-[88vh] justify-between p-6 text-xl">
      <div className="flex flex-col gap-4">
        <Link to="/user/dashboard">Workspaces</Link>
        <Link to="/user/dashboard/edit-info">Edit</Link>
      </div>

      <button
        className="bg-primary px-4 py-2 text-white font-charlie-display-sm rounded-md w-2/3"
        onClick={() => dispatch(logoutUser())}
      >
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
