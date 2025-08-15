import { useDeleteListMutation } from "@/store/myApi";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

export const DeleteList = ({ listId }: { listId: string }) => {
  const { workspaceId, boardId } = useParams();
  const [loading, setLoading] = useState(false);
  const [deleteList] = useDeleteListMutation();
  const handleDelete = async () => {
    try {
      if (!workspaceId || !boardId || !listId) {
        console.error("Missing required parameters");
        return;
      }
      setLoading(true);
      await deleteList({ workspaceId, boardId, listId }).unwrap();
      setLoading(false);
    } catch (error: any) {
      toast.error(error.data.message || "Failed to delete list");
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-red-500">Delete List</h2>
      <p>This action cannot be undone.</p>
      <button
        disabled={loading}
        onClick={handleDelete}
        className={
          "bg-red-600 text-white px-2 py-1 rounded mt-2" +
          (loading ? " opacity-50 cursor-not-allowed" : "")
        }
      >
        Delete
      </button>
    </div>
  );
};
