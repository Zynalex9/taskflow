import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Check } from "lucide-react";
import { useState } from "react";

export const AddMembersPermissions = () => {
  const options = [
    {
      id: "admins",
      title: "Admins",
      description: "Only admins can add or remove members and observers.",
    },
    {
      id: "all_members",
      title: "All members",
      description:
        "Admins and board members can add or remove members and observers.",
    },
  ];
  const [selected, setSelected] = useState("all_members");
  return (
    <div>
      <Popover >
        <PopoverTrigger className="text-textP hover:text-gray-700 text-left ">
          <h2 className="text-sm font-charlie-text-r text-textP">
            Adding and removing members
          </h2>
          <p className="text-xs font-charlie-text-r text-textP/80">
            {options.find((o) => o.id === selected)?.title}
          </p>
        </PopoverTrigger>
        <PopoverContent
          className="w-80 rounded-lg p-2 border-none space-y-1  overflow-y-auto custom-scrollbar bg-fprimary"
          data-ignore-click-outside="true"
        >
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`w-full text-left p-2 rounded hover:bg-fprimary/80 ${
                selected === option.id ? "bg-gray-600" : ""
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-textP">
                  {option.title}
                </span>
                {selected === option.id && (
                  <Check className="w-4 h-4 text-textP" />
                )}
              </div>
              <p className="text-xs text-textP/90 mt-1">{option.description}</p>
            </button>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
};
