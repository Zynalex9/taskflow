import { Binoculars, Check, Globe, Lock, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useUpdateVisibilityMutation } from "@/store/myApi";

const visibilityOptions = [
  {
    value: "private",
    label: "Private",
    icon: <Lock size={15} className="text-red-500" />,
    description:
      "Only the board members can see this board. Workspace admins can close or delete the board as well.",
  },
  {
    value: "workspace",
    label: "Workspace",
    icon: <Lock size={15} className="text-green-400" />,
    description:
      "Everyone in the workspace can see this board. Workspace admins can close or delete the board as well.",
  },
  {
    value: "public",
    label: "Public",
    icon: <Globe size={15} className="" />,
    description:
      "Anyone on the internet can see this board. Workspace admins can close or delete the board as well.",
  },
];

const Visibility = () => {
  const { board } = useSingleBoardContext();
  const [updateVisibility] = useUpdateVisibilityMutation();
  const [selectedVisibility, setSelectedVisibility] = useState(
    board.visibility
  );
  const handleVisibilityChange = async () => {
    try {
      await updateVisibility({
        boardId: board._id,
        visibility: selectedVisibility,
      }).unwrap();
    } catch (error) {
      console.error("Failed to update visibility:", error);
    }
  };
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <div
          className="mt-4 flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Binoculars size={18} />
          <h2 className="text-sm capitalize">
            Visibility: {selectedVisibility}
          </h2>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-fprimary border-none text-textP">
        <div>
          <div className="flex justify-between items-center mb-4 font-charlie-text-r">
            <div></div>
            <h1 className="text-sm">Change visibility</h1>
            <X
              size={16}
              className="cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>
          <div>
            {visibilityOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  setSelectedVisibility(option.value);
                  handleVisibilityChange();
                }}
                className={`flex flex-col p-2 rounded-lg font-charlie-text-r cursor-pointer hover:bg-fsecondary ${
                  selectedVisibility === option.value ? "bg-fsecondary" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  {option.icon}
                  <h1 className="text-textP text-sm">{option.label}</h1>
                  {selectedVisibility === option.value && <Check size={15} />}
                </div>
                <p className="text-xs text-textP/70 px-2 mt-1 font-charlie-text-r">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Visibility;
