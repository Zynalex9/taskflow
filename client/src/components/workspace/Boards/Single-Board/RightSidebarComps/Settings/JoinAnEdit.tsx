import { Check } from "lucide-react";
import { useState } from "react";

export const JoinAnEdit = () => {
  const [isSelected, setIsSelected] = useState(true);
  return (
    <div className="space-y-2 cursor-pointer" onClick={() => setIsSelected(!isSelected)}>
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-charlie-display-sm font-bold text-textP">
          Workspace editing
        </h2>
        {isSelected ? <Check className="w-4 h-4 text-textP" /> : " "}
      </div>
      <p className="text-xs font-charlie-text-r text-textP/80">
        Any worksapce member can edit this board.
      </p>
    </div>
  );
};
