import BoardPlaceHolder from "@/components/resuable/BoardPlaceHolder";
import { IBoard, IWorkspace } from "@/types/functionalites.types";
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
import { useWorkspaces } from "@/Context/workspacesContext";
import { useState } from "react";
import { useCreateBoardFromTemplateMutation } from "@/store/workspaceApi";
import { toast, ToastContainer } from "react-toastify";

export const TemplatesComponent = ({
  templates,
}: {
  templates: IBoard[] | undefined;
}) => {
  const { workspaces } = useWorkspaces();
  const allWorkspaces = [
    ...(workspaces?.ownedWorkspaces || []),
    ...(workspaces?.joinedWorkspaces || []),
  ];

  const [selectedWorkspace, setSelectedWorkspace] = useState<IWorkspace | null>(
    null
  );
  const [boardName, setBoardName] = useState("");
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [createBoard] = useCreateBoardFromTemplateMutation();

  const handleCreateBoard = async (
    workspaceId: string | undefined,
    templateId: string
  ) => {
    if (!workspaceId || !templateId || !boardName) return;
    const body = { workspaceId, templateId, boardName };

    try {
      setLoading(true);
      await createBoard(body).unwrap();
      setLoading(false);
      setSelectedWorkspace(null);
      setBoardName("");
      setOpenDialog(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Error creating board", { theme: "dark" });
    }
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {templates?.map((template) => (
        <AlertDialog key={template._id} open={openDialog}>
          <AlertDialogTrigger onClick={() => setOpenDialog(true)}>
            <BoardPlaceHolder
              bg={template.cover}
              title={template.title}
              isTemplete={true}
            />
          </AlertDialogTrigger>

          <AlertDialogContent className="bg-bgS border-none text-textP">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Create a new board from '{template.title}' template
              </AlertDialogTitle>

              <AlertDialogDescription className="space-y-4">
                {/* Board name */}
                <input
                  value={boardName}
                  onChange={(e) => setBoardName(e.target.value)}
                  placeholder="Add a title"
                  className="w-full p-2 border border-gray-500 rounded bg-bgS text-textP placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-primary"
                />

                {/* Workspace select */}
                <select
                  value={selectedWorkspace?._id || ""}
                  onChange={(e) => {
                    const ws = allWorkspaces.find(
                      (w) => w._id === e.target.value
                    );
                    setSelectedWorkspace(ws || null);
                  }}
                  className="w-full p-2 border border-gray-500 rounded bg-bgS text-textP focus:outline-none focus:ring-2 focus:ring-blue-primary"
                >
                  <option value="">Select a workspace</option>
                  {allWorkspaces?.map((workspace) => (
                    <option key={workspace._id} value={workspace._id}>
                      {workspace.name}
                    </option>
                  ))}
                </select>

                <AlertDialogFooter>
                  <AlertDialogCancel
                    disabled={loading}
                    onClick={() => setOpenDialog(false)}
                    className={`bg-bgS hover:bg-bgS/60 hover:text-white/30 text-white cursor-pointer ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    Cancel
                  </AlertDialogCancel>
                  <button
                    type="button"
                    disabled={
                      !selectedWorkspace || !boardName.trim() || loading
                    }
                    onClick={() =>
                      handleCreateBoard(selectedWorkspace?._id, template._id)
                    }
                    className={`px-4 py-2 rounded text-white flex items-center justify-center gap-2 transition ${
                      !selectedWorkspace || !boardName.trim() || loading
                        ? "bg-blue-primary/40 cursor-not-allowed"
                        : "bg-blue-primary/80 hover:bg-blue-primary"
                    }`}
                  >
                    {loading && (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                      </svg>
                    )}
                    {loading ? "Creating..." : "Create"}
                  </button>
                </AlertDialogFooter>
              </AlertDialogDescription>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      ))}
      <ToastContainer />
    </div>
  );
};
