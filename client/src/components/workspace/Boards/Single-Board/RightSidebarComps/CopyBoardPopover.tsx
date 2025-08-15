import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useBoardSocketsInvalidate } from "@/hooks/useBoardSocketsInvalidate";
import { useCopyBoardIntoNewMutation } from "@/store/myApi";
import { useGetAllWorkspacesQuery } from "@/store/workspaceApi";
import { IWorkspace } from "@/types/functionalites.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Copy, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const CopyBoardPopover = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const { board } = useSingleBoardContext();
  const [boardName, setBoardName] = useState(board.title);
  const { data } = useGetAllWorkspacesQuery(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [copyBoardIntoNew] = useCopyBoardIntoNewMutation();
  useBoardSocketsInvalidate({ eventName: "boardCreated", id: board._id ?? "" });
  const handleCopyBoard = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const body = {
        workspaceId: selectedWorkspace,
        boardId: board._id,
      };
      const response = await copyBoardIntoNew(body).unwrap();

      if (response.success) {
        toast.success(response.message);
      }
    } catch (error: any) {
      toast.error(error.data.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };
  const allWorkspaces = [
    ...(data?.data.ownedWorkspaces || []),
    ...(data?.data.joinedWorkspaces || []),
  ] as IWorkspace[];
  return (
    <div>
      <Popover open={openModal} onOpenChange={setOpenModal}>
        <PopoverTrigger>
          <div className="mt-4 flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer">
            <Copy size={18} />
            <h2>Copy Board</h2>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="bg-fprimary p-4 rounded-lg w-96 overflow-y-auto custom-scrollbar h-80"
          data-ignore-click-outside="true"
          side="bottom"
          sideOffset={-30}
        >
          <div className="flex items-center justify-between mb-4">
            <div></div>
            <h2 className="text-sm font-charlie-display-sm font-bold text-textP">
              Copy Board
            </h2>
            <X size={16} onClick={() => setOpenModal(false)} />
          </div>
          <div>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full p-2 border rounded bg-fprimary text-textP font-charlie-text-r focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-none transition-colors duration-150"
              placeholder="Enter new board name here (leave empty to copy with same name)"
            />
            <div className="mt-2">
              <label
                htmlFor="workspaces"
                className="font-charlie-display-sm font-bold "
              >
                Workspace
              </label>
              <select
                value={selectedWorkspace}
                onChange={(e) => setSelectedWorkspace(e.target.value)}
                name="workspaces"
                id="workspaces"
                className="w-full p-2 border rounded bg-fprimary text-textP font-charlie-text-r focus:outline-none focus:ring-2 focus:ring-blue-primary focus:border-none transition-colors duration-150"
              >
                <option value="" disabled>
                  Select workspace
                </option>
                {allWorkspaces.map((workspace: IWorkspace) => (
                  <option key={workspace._id} value={workspace._id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500 font-charlie-text-r">
                Activity, comments, and members will not be copied to the new
                board.
              </p>
              <button
                disabled={isLoading || !selectedWorkspace}
                onClick={handleCopyBoard}
                className={`px-2 py-1.5 text-fprimary bg-blue-primary rounded font-charlie-text-sb text-sm hover:bg-blue-primary/80 transition-colors duration-150 mt-4 w-full ${
                  !selectedWorkspace ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Creating..." : "Create"}
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
