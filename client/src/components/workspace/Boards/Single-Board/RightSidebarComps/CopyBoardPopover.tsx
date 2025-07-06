import { Checkbox } from "@/components/ui/checkbox";
import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useGetAllWorkspacesQuery } from "@/store/workspaceApi";
import { IWorkspace } from "@/types/functionalites.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Copy, X } from "lucide-react";
import { useState } from "react";

export const CopyBoardPopover = () => {
  const [checked, setChecked] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<string>("");
  const { board } = useSingleBoardContext();
  const [boardName, setBoardName] = useState(board.title);
  const { data } = useGetAllWorkspacesQuery(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const handleCopyBoard = () => {
    console.log("Copying board with name:", boardName);
    console.log("Selected workspace ID:", selectedWorkspace);
    console.log("Keep cards:", checked);
    console.log("Board ID:", board._id);
  };
  return (
    <div>
      <Popover open={openModal} onOpenChange={setOpenModal}>
        <PopoverTrigger>
          <div className="mt-4 text-sm flex items-center gap-6 cursor-pointer">
            <Copy size={18} />
            <h2>Copy Board</h2>
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="bg-fprimary p-4 rounded-lg w-96 overflow-y-auto custom-scrollbar h-96"
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
                {data?.data.map((workspace: IWorkspace) => (
                  <option key={workspace._id} value={workspace._id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => setChecked(!checked)}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                />
                <span>Keep cards</span>
              </label>
              <p className="text-sm text-gray-500 font-charlie-text-r">
                Activity, comments, and members will not be copied to the new
                board.
              </p>
              <button
                disabled={!selectedWorkspace || isLoading}
                onClick={handleCopyBoard}
                className="px-2 py-1.5 text-fprimary bg-blue-primary rounded font-charlie-text-sb text-sm hover:bg-blue-primary/80 transition-colors duration-150 mt-4 w-full"
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
