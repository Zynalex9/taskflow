import { BellRingIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RootState } from "../store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "axios";

const Topbar = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activites, SetActivities] = useState<string[]>();
  const getActivites = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/user/activity-log",
        { withCredentials: true }
      );
      SetActivities(response.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };
  useEffect(() => {
    getActivites();
  }, []);
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
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BellRingIcon className="text-white size-5 cursor-pointer hover:text-white/90 transition-colors" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            {activites && activites.length > 0 ? (
              activites.map((a) => <DropdownMenuItem>{a}</DropdownMenuItem>)
            ) : (
              <DropdownMenuItem>No activites found</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <img
              src={user?.profilePicture}
              alt="Profile"
              className="w-9 h-9 rounded-full object-cover border border-white/10"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to={"/user/dashboard/edit-info"}>Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={""}>Workspaces</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link to={""}></Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Topbar;
