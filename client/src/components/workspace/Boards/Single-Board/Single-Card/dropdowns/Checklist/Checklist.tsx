import { ListChecks } from "lucide-react";
import {
  IChecklist,
  IChecklistItems,
} from "../../../../../../../types/functionalites.types";
import { useState } from "react";
import {
  useAddItemToCheckListMutation,
  useToggleCheckListItemCompleteMutation,
} from "@/store/cardApi";
import { Checkbox } from "@/components/ui/checkbox";
interface ChecklistProps {
  Checklist: IChecklist[];
  cardId: string;
}
const Checklist: React.FC<ChecklistProps> = ({ Checklist, cardId }) => {
  const [toggleItem] = useToggleCheckListItemCompleteMutation();
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
      };
      setItemTitle("");
      setActiveChecklistId(null);
      await addItemToChecklist(body);
    } else {
      setActiveChecklistId(checkListId);
    }
  };
  const handleChange = async (checklistId: string, itemId: string) => {
    const body = {
      cardId,
      checklistId,
      itemId,
    };
    try {
      await toggleItem(body);
    } catch (error) {
      console.log("Error in toggling");
    }
  };

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
            <button className="px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC]">
              Delete
            </button>
          </div>
          <div className="pl-10">
            {c.items.map((i) => (
              <div key={i._id} className="flex items-center gap-4">
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
            ))}
            {activeChecklistId === c._id && (
              <input
                placeholder="Add item"
                className="block w-full rounded-xl border-1 my-2 px-2 py-1.5  focus:border-0 focus:outline-0 focus:ring-2 focus:ring-[#85B8FF]"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
              />
            )}
            {activeChecklistId === c._id ? (
              <div>
                <button
                  onClick={() => HandleSubmit(c.card, c._id)}
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
                onClick={() => HandleSubmit(c.card, c._id)}
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
