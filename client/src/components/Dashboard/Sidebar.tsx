import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../store/store";
import { logoutUser } from "../../store/AuthSlice";

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {loading} = useSelector((state:RootState)=>state.auth);

  return (
    <div className="flex flex-col h-[88vh] justify-between p-6 text-xl">
      <div className="flex flex-col gap-4">
        <Link to="/user/dashboard">Workspaces</Link>
        <Link to="/user/dashboard/edit-info">Edit</Link>
      </div>

      <button
        className={`${loading?'bg-blue-primary/80':'bg-blue-primary'} px-4 py-2 truncate text-white font-charlie-display-sm rounded-md w-2/3`}
        onClick={() => dispatch(logoutUser())}
      >
        {loading ? "Loging out..":"Logout"}
      </button>
    </div>
  );
};

export default Sidebar;
