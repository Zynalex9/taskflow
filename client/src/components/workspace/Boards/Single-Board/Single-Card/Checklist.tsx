import { ListChecks } from "lucide-react";
import {
  IChecklist,
  IChecklistItems,
} from "../../../../../types/functionalites.types";

interface ChecklistProps {
  Checklist: IChecklist[];
}
const Checklist: React.FC<ChecklistProps> = ({ Checklist }) => {
  const calculateCompletion = (items: IChecklistItems[]) => {
    if (!items.length) return 0;
    const completed = items.filter((item) => item.completed).length;
    return Math.round((completed / items.length) * 100);
  };
  return (
    <div className="space-y-6 mb-8">
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
                <input
                  type="checkbox"
                  name={i.title}
                  id={i.title}
                  checked={i.completed}
                  className="size-4 my-2"
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default Checklist;
