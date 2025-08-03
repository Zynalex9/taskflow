export type WorkspaceFormInputs = {
  name: string;
  "workspace-cover": FileList;
};
import { BellRingIcon, MenuIcon, Plus, SearchIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../store/store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { useCreateWorkspaceMutation } from "@/store/workspaceApi";
import { toast, ToastContainer } from "react-toastify";
import ModalButton from "./resuable/ModalButton";
import { logoutUser } from "@/store/AuthSlice";
const Topbar = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const [activities, setActivities] = useState<string[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { register, handleSubmit } = useForm<WorkspaceFormInputs>();
  const [addWorkspace] = useCreateWorkspaceMutation();
  const [loading, SetLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const onSubmit = async (data: WorkspaceFormInputs) => {
    const formData = new FormData();
    formData.append("name", data.name);
    if (data["workspace-cover"] && data["workspace-cover"].length > 0) {
      formData.append("workspace-cover", data["workspace-cover"][0]);
    }
    try {
      SetLoading(true);
      await addWorkspace(formData).unwrap();
      toast.success("Workspace created successfully!");
      setOpenDialog(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong", {
        theme: "dark",
      });
    } finally {
      SetLoading(false);
    }
  };
  const getActivities = async () => {
    try {
      const response = await axios.get(
       `${import.meta.env.VITE_BASE_URL}/api/user/activity-log`,
        { withCredentials: true }
      );
      setActivities(response.data.data);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getActivities();
  }, []);

  return (
    <>
      <div className="w-full px-4 py-3 bg-fprimary border-b border-white/10 text-white flex flex-col md:flex-row items-center justify-between shadow-sm">
        <div className="w-full md:hidden flex items-center justify-between mb-2 md:mb-0">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="p-2 rounded-md hover:bg-[#333C43]"
          >
            <MenuIcon className="size-5" />
          </button>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-md hover:bg-[#333C43]"
            >
              <SearchIcon className="size-5" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <BellRingIcon className="text-white size-5 cursor-pointer hover:text-white/90 transition-colors" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuSeparator />
                {activities && activities.length > 0 ? (
                  activities.map((a, i) => (
                    <DropdownMenuItem key={i}>{a}</DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem>No activities found</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {showSearch && (
          <div className="w-full md:hidden mb-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-1.5 text-sm rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none"
            />
          </div>
        )}

        {(showMobileMenu || !showMobileMenu) && (
          <div
            className={`${
              showMobileMenu ? "flex" : "hidden"
            } md:flex flex-col items-center md:flex-row gap-2 md:gap-6 text-sm font-medium w-full md:w-auto`}
          >
            <Link
              to="/user/dashboard/edit-info"
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
            <AlertDialog  open={openDialog}>
              <AlertDialogTrigger asChild>
                <button
                  onClick={() => setOpenDialog(true)}
                  className="bg-blue-primary px-1.5 py-1 rounded text-white hover:text-textP hover:bg-blue-primary/50 cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-bgS border-none text-textP">
                <AlertDialogHeader>
                  <AlertDialogTitle>Create a new workspace</AlertDialogTitle>
                  <AlertDialogDescription>
                    <form
                      onSubmit={handleSubmit(onSubmit)}
                      className="space-y-4 mt-2"
                    >
                      <input
                        {...register("name")}
                        placeholder="Add a title"
                        className="w-full p-2 border rounded text-textP"
                      />
                      <input
                        {...register("workspace-cover")}
                        type="file"
                        accept="image/*"
                        className="w-full p-2 border rounded text-textP"
                      />
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          className="bg-bgS hover:bg-S/60 text-white hover:text-white cursor-pointers"
                          onClick={() => setOpenDialog(false)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <button
                          type="submit"
                          disabled={loading}
                          className={` ${
                            loading ? "bg-blue-primary/80" : "bg-blue-primary"
                          } text-white px-4 py-2 rounded hover:bg-blue-primary/80`}
                        >
                          {loading ? "Creating workspace" : " Continue "}
                        </button>
                      </AlertDialogFooter>
                    </form>
                  </AlertDialogDescription>
                </AlertDialogHeader>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        )}
        <div className="hidden md:flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="px-3 py-1.5 text-sm rounded-md bg-white/10 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/20 w-48"
            />
            <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 size-4 text-white/60" />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <BellRingIcon className="text-white size-5 cursor-pointer hover:text-white/90 transition-colors" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuSeparator />
              {activities && activities.length > 0 ? (
                activities.map((a, i) => (
                  <DropdownMenuItem key={i}>{a}</DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem>No activities found</DropdownMenuItem>
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
                <Link to="/user/dashboard/edit-info">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/user/dashboard">Workspaces</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <ModalButton
            onClickFn={() => {
              dispatch(logoutUser());
            }}
            btnText="Logout"
          />
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Topbar;
