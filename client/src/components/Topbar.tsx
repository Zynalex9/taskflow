import { BellRingIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";

const Topbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="w-full px-6 py-3 bg-fprimary border-b border-white/10 text-white flex items-center justify-between shadow-sm">
      <div className="flex gap-6 text-sm font-medium">
        <Link
          to="/user/dashboard/edit-info#"
          className="hover:text-white transition-all duration-200 hover:bg-[#333C43] p-2 rounded"
        >
          Profile
        </Link>
        <Link
          to="/user/dashboard"
          className="hover:text-white transition-all duration-200 hover:bg-[#333C43] p-2 rounded"
        >
          Workspaces
        </Link>

        <Link
          to="#"
          className="hover:text-white transition-all duration-200 hover:bg-[#333C43] p-2 rounded"
        >
          Starred
        </Link>
        <Link
          to="#"
          className="hover:text-white transition-all duration-200 hover:bg-[#333C43] p-2 rounded"
        >
          More
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <input
          type="text"
          placeholder="Search"
          className="px-3 py-1.5 text-sm rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20"
        />
        <BellRingIcon className="text-white size-5 cursor-pointer hover:text-white/90 transition-colors" />
        <img
          src={user.profilePicture}
          alt="Profile"
          className="w-9 h-9 rounded-full object-cover border border-white/10"
        />
      </div>
    </div>
  );
};

export default Topbar;
