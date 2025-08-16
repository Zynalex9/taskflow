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
import { isImageUrl } from "@/utils/helper";
import BoardPlaceHolder from "../resuable/BoardPlaceHolder";
import { Link } from "react-router-dom";
import { useWorkspaces } from "@/Context/workspacesContext";
import ModalButton from "../resuable/ModalButton";
import { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateWorkspaceMutation } from "@/store/workspaceApi";
import { WorkspaceFormInputs } from "../Topbar";
import { useForm } from "react-hook-form";
import { toast, ToastContainer } from "react-toastify";
import { DeleteWorkspacePopover } from "./DeleteWorkspaceDialog";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { TemplatesComponent } from "./Members/TemplatesComponent";

const AllWorkspaces = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [addWorkspace] = useCreateWorkspaceMutation();
  const { register, handleSubmit } = useForm<WorkspaceFormInputs>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, SetLoading] = useState(false);

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

  const { workspaces } = useWorkspaces();

  return (
    <div>
      <h1 className="py-2 text-textP">Templates</h1>
      <TemplatesComponent />

      {/* Owned Workspaces */}
      <h1 className="py-2 text-textP">Your Workspaces</h1>
      {workspaces && workspaces.ownedWorkspaces?.length > 0 ? (
        workspaces.ownedWorkspaces.map((workspace) => (
          <div key={workspace._id} className="mb-6">
            {/* Workspace Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full cursor-pointer rounded py-1 px-1">
              <Link to={`/user/w/workspace/${workspace._id}`}>
                {isImageUrl(workspace.cover) ? (
                  <img
                    src={workspace.cover}
                    className="size-12 object-cover object-center rounded mx-auto sm:mx-0"
                  />
                ) : (
                  <div
                    className="size-12 rounded-lg text-center flex items-center justify-center"
                    style={{ backgroundColor: workspace.cover }}
                  >
                    <h2 className="text-black text-2xl font-charlie-text-sb">
                      {workspace.name[0]}
                    </h2>
                  </div>
                )}
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                <Link to={`/user/w/workspace/${workspace._id}`}>
                  <h1 className="text-lg text-textP font-charlie-text-r text-center sm:text-left">
                    {workspace.name}
                  </h1>
                </Link>
                <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-end">
                  <Link to={`/user/dashboard/${workspace._id}/boards-view`}>
                    <ModalButton btnText="Boards" />
                  </Link>
                  <Link to={`/user/dashboard/${workspace._id}/members`}>
                    <ModalButton btnText="Members" />
                  </Link>
                  <DeleteWorkspacePopover workspaceId={workspace._id} />
                </div>
              </div>
            </div>

            {/* Boards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6 w-full">
              {workspace.boards.map((board) => (
                <BoardPlaceHolder
                  key={board._id}
                  bg={board.cover}
                  isTemplete={false}
                  title={board.title}
                  to={`/user/w/workspace/${workspace._id}/board/${board._id}`}
                />
              ))}
              <Link to={`/user/w/workspace/${workspace._id}`}>
                <button className="w-full h-32 bg-[#333C43] flex items-center justify-center text-center font-charlie-text-sb text-textP text-lg rounded-xl shadow-2xl transition-colors duration-150 hover:bg-[#333C43]/50">
                  <h2>Create new board</h2>
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-gray-400 font-charlie-text-r italic">
            Add a workspace
          </p>
          <AlertDialog open={openDialog}>
            <AlertDialogTrigger asChild>
              <button
                onClick={() => setOpenDialog(true)}
                className="bg-blue-primary px-2 py-1 rounded text-white hover:text-textP hover:bg-blue-primary/50 cursor-pointer"
              >
                <Plus size={16} />
              </button>
            </AlertDialogTrigger>

            <AlertDialogContent className="bg-bgS border-none text-textP max-w-lg w-[90%]">
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
                    <AlertDialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <AlertDialogCancel
                        className="bg-bgS hover:bg-S/60 text-white hover:text-white cursor-pointer w-full sm:w-auto"
                        onClick={() => setOpenDialog(false)}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`w-full sm:w-auto ${
                          loading ? "bg-blue-primary/80" : "bg-blue-primary"
                        } text-white px-4 py-2 rounded hover:bg-blue-primary/80`}
                      >
                        {loading ? "Creating workspace" : "Continue"}
                      </button>
                    </AlertDialogFooter>
                  </form>
                </AlertDialogDescription>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Joined Workspaces */}
      <h1 className="py-2 text-textP">Joined Workspaces</h1>
      {workspaces && workspaces.joinedWorkspaces?.length > 0 ? (
        workspaces.joinedWorkspaces.map((workspace) => (
          <div key={workspace._id} className="mb-6">
            {/* Workspace Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full cursor-pointer rounded py-1 px-1">
              <Link to={`/user/w/workspace/${workspace._id}`}>
                {isImageUrl(workspace.cover) ? (
                  <img
                    src={workspace.cover}
                    className="size-12 object-cover object-center rounded mx-auto sm:mx-0"
                  />
                ) : (
                  <div
                    className="size-12 rounded-lg text-center flex items-center justify-center"
                    style={{ backgroundColor: workspace.cover }}
                  >
                    <h2 className="text-black text-2xl font-charlie-text-sb">
                      {workspace.name[0]}
                    </h2>
                  </div>
                )}
              </Link>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-2">
                <Link to={`/user/w/workspace/${workspace._id}`}>
                  <h1 className="text-lg text-textP font-charlie-text-r text-center sm:text-left">
                    {workspace.name}
                  </h1>
                </Link>
                <div className="flex flex-wrap gap-2 sm:gap-4 justify-center sm:justify-end">
                  <Link to={`/user/dashboard/${workspace._id}/boards-view`}>
                    <ModalButton btnText="Boards" />
                  </Link>
                  <Link to={`/user/dashboard/${workspace._id}/members`}>
                    <ModalButton btnText="Members" />
                  </Link>
                  {workspace.createdBy === user?._id && (
                    <DeleteWorkspacePopover workspaceId={workspace._id} />
                  )}
                </div>
              </div>
            </div>

            {/* Boards Section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 my-6 w-full">
              {workspace.boards.map((board) => (
                <BoardPlaceHolder
                  key={board._id}
                  bg={board.cover}
                  isTemplete={false}
                  title={board.title}
                  to={`/user/w/workspace/${workspace._id}/board/${board._id}`}
                />
              ))}
              <Link to={`/user/w/workspace/${workspace._id}`}>
                <button className="w-full h-32 bg-[#333C43] flex items-center justify-center text-center font-charlie-text-sb text-textP text-lg rounded-xl shadow-2xl transition-colors duration-150 hover:bg-[#333C43]/50">
                  <h2>Create new board</h2>
                </button>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-gray-400 font-charlie-text-r italic">
            You're not member of any other workspace
          </p>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default AllWorkspaces;
