import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check } from "lucide-react";
import { useState } from "react";

export const CommentsPopover = () => {
  const options = [
    {
      id: "disabled",
      title: "Disabled",
      description: "No one can comment or react.",
    },
    {
      id: "members",
      title: "Members",
      description: "Admins and board members can comment and react.",
    },
    {
      id: "members_observers",
      title: "Members and observers",
      description:
        "Admins, board members, and observers can comment and react.",
    },
    {
      id: "workspace",
      title: "Workspace members",
      description:
        "Admins, board members, observers, and team members can comment and react.",
    },
    {
      id: "any_user",
      title: "Any Trello user",
      description:
        "Any Trello user can comment and react, provided they can see this board.",
    },
  ];

  const [selected, setSelected] = useState("members");

  return (
    <div>
      <Popover>
        <PopoverTrigger className="text-textP hover:text-gray-700 text-left space-y-2 cursor-pointer">
          <h2 className="text-sm font-charlie-display-sm text-textP font-bold">Commenting</h2>
          <p className="text-xs font-charlie-text-r text-textP/80">
            {options.find((o) => o.id === selected)?.title}
          </p>
        </PopoverTrigger>
        <PopoverContent
          className="w-96 p-2 border-none space-y-1 h-72  overflow-y-auto custom-scrollbar bg-fprimary"
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
