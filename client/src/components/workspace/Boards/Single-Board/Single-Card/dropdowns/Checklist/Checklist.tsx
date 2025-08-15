import { ListChecks, Trash } from "lucide-react";
import {
  IChecklist,
  IChecklistItems,
} from "../../../../../../../types/functionalites.types";
import { useState } from "react";
import {
  useAddItemToCheckListMutation,
  useDeleteChecklistMutation,
  useDeleteItemMutation,
  useToggleCheckListItemCompleteMutation,
} from "@/store/cardApi";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useCardSocketInvalidate } from "@/hooks/useSocketInvalidate";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
interface ChecklistProps {
  Checklist: IChecklist[];
  cardId: string;
}
const Checklist: React.FC<ChecklistProps> = ({ Checklist, cardId }) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [deleteItem] = useDeleteItemMutation();
  const { workspaceId } = useParams();

  const [toggleItem] = useToggleCheckListItemCompleteMutation();
  const [isItemLoading, setIsItemLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const calculateCompletion = (items: IChecklistItems[]) => {
    if (!items.length) return 0;
    const completed = items.filter((item) => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };
  const [activeChecklistId, setActiveChecklistId] = useState<string | null>(
    null
  );
  const [itemTitle, setItemTitle] = useState("");
  const [addItemToChecklist] = useAddItemToCheckListMutation();
  const HandleSubmit = async (cardId: string, checkListId: string) => {
    if (activeChecklistId === checkListId) {
      const body = {
        cardId,
        title: itemTitle,
        checkListId,
        workspaceId: workspaceId!,
      };
      setItemTitle("");
      setActiveChecklistId(null);
      try {
        await addItemToChecklist(body).unwrap();
      } catch (error: any) {
        toast.error(error.data.message || "Failed to add item");
      }
    } else {
      setActiveChecklistId(checkListId);
    }
  };
  const [deleteCheckList] = useDeleteChecklistMutation();
  const handleDelete = async (cardId: string, checkListId: string) => {
    try {
      setIsLoading(true);
      await deleteCheckList({
        cardId,
        checkListId,
        workspaceId: workspaceId!,
      }).unwrap();
    } catch (error: any) {
      toast.error(error.data.message || "Error deleteing checklist");
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = async (checklistId: string, itemId: string) => {
    const body = {
      cardId,
      checklistId,
      itemId,
      workspaceId: workspaceId!,
    };
    try {
      await toggleItem(body).unwrap();
    } catch (error: any) {
      toast.error(error.data.message || "Error in toggling");
    }
  };
  const handleDeleteItem = async (checklistId: string, itemId: string) => {
    try {
      setIsItemLoading(true);
      await deleteItem({
        checkListId: checklistId,
        itemId,
        cardId,
        workspaceId: workspaceId!,
      });
    } catch (error: any) {
      toast.error(error.data.message || "Error in deleting item");
    } finally {
      setIsItemLoading(false);
    }
  };

  useCardSocketInvalidate({ eventName: "checkListDeleted", id: cardId });
  useCardSocketInvalidate({ eventName: "checkListItemCreated", id: cardId });
  useCardSocketInvalidate({ eventName: "checkListItemDeleted", id: cardId });
  useCardSocketInvalidate({ eventName: "checkListItemToggled", id: cardId });

  return (
    <div className="space-y-6 my-12">
      {Checklist.map((c) => (
        <div key={c._id}>
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <ListChecks className="text-textP" />
              <h1 className="text-textP font-charlie-text-sb text-xl">
                {c.title}
              </h1>
              <span className="text-sm text-[#B6C2CF]">
                {calculateCompletion(c.items)}%
              </span>
            </div>
            <button
              disabled={isLoading}
              onClick={() => handleDelete(cardId, c._id)}
              className={`px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC] ${
                isLoading ? "cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
          <div className="pl-10">
            {c.items.map((i) => (
              <div
                key={i._id}
                className="flex items-center justify-between mt-1 gap-4"
              >
                <div className="flex items-center gap-4">
                  <Checkbox
                    onCheckedChange={() => handleChange(c._id, i._id)}
                    checked={i.completed}
                  />
                  <h3
                    className={`${
                      i.completed ? "line-through text-[#B6C2CF]" : ""
                    }`}
                  >
                    {i.title}
                  </h3>
                </div>
                {c.createdBy === user?._id ? (
                  <Trash
                    size={17}
                    className={`text-red-500 cursor-pointer ${
                      isItemLoading
                        ? "cursor-not-allowed pointer-events-none opacity-80 animate-pulse text-red-500/60"
                        : ""
                    }`}
                    onClick={() => handleDeleteItem(c._id, i._id)}
                  />
                ) : (
                  ""
                )}
              </div>
            ))}
            {activeChecklistId === c._id && (
              <input
                placeholder="Add item"
                className="block w-full rounded-xl border-1 my-2 px-2 py-1.5 focus:border-0 focus:outline-0 focus:ring-2 focus:ring-[#85B8FF]"
                value={itemTitle}
                autoFocus
                onChange={(e) => setItemTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    HandleSubmit(cardId, c._id);
                  }
                }}
              />
            )}
            {activeChecklistId === c._id ? (
              <div>
                <button
                  onClick={() => HandleSubmit(cardId, c._id)}
                  className="px-2 py-1 mt-2  rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC]"
                >
                  Add Item
                </button>{" "}
                <button
                  onClick={() => setActiveChecklistId(null)}
                  className="px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC]"
                >
                  Close
                </button>
              </div>
            ) : (
              <button
                onClick={() => HandleSubmit(cardId, c._id)}
                className="px-2 mt-4 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC]"
              >
                Add Item
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
