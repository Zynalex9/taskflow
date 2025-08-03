import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ModalButton from "../resuable/ModalButton";
import { useState } from "react";
import { useDeleteWorkspaceMutation } from "@/store/workspaceApi";
import { toast } from "react-toastify";
import { useWorkspaces } from "@/Context/workspacesContext";

export function DeleteWorkspacePopover({
  workspaceId,
}: {
  workspaceId: string;
}) {
  const [openPopOver, setOpenPopOver] = useState(false);
  const [deleteWorkspace] = useDeleteWorkspaceMutation();
  const { workspaces, setWorkspaces } = useWorkspaces();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    try {
      setLoading(true);
      const body = {
        workspaceId,
      };
      const response: any = await deleteWorkspace(body);

      if (response.error) {
        toast.error(response.error.data.message || "Something went wrong", {
          theme: "dark",
        });
      } else {
        toast.success("Workspace deleted", {
          theme: "dark",
        });
        setWorkspaces(workspaces.ownedWorkspaces.filter((ws) => ws._id !== workspaceId));
      }
    } catch (error) {
      toast.error("Unexpected error occurred", {
        theme: "dark",
      });
    } finally {
      setLoading(true);
    }
  };

  return (
    <Popover open={openPopOver}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpenPopOver(!openPopOver)}
          variant="destructive"
        >
          Delete workspace
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-fprimary text-textP">
        <div>
          <p>Are you sure you want to delete this workspace?</p>
          <div className="flex gap-2 items-end justify-end mt-4">
            <ModalButton
              btnText="Cancel"
              onClickFn={() => setOpenPopOver(!openPopOver)}
              disabled={loading}
            />
            <ModalButton
              btnText={`${loading ? "Deleting..." : "Delete"}`}
              disabled={loading}
              onClickFn={handleDelete}
              customStyles={`${loading ? " bg-[#B6C2CF]/60" : ""}`}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
