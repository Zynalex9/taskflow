import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { useClickOutside } from "@/Context/useRefContext";
import { X } from "lucide-react";
import CustomBorder from "./CustomBorder";
import { CopyingList } from "./CopyingList";
import { MoveList } from "./MoveList";
import { DeleteList } from "./DeleteList";

interface IProps {
  setOpenListId: React.Dispatch<React.SetStateAction<string | null>>;
  listId: string;
  setActiveListId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ListItems: React.FC<IProps> = ({
  setOpenListId,
  listId,
  setActiveListId,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  useClickOutside(dropdownRef, () => setOpenListId(null));
  const [activePanel, setActivePanel] = useState<string | null>(null);

  const closeDropdown = () => setOpenListId(null);

  const menuItems = [
    {
      id: "addCard",
      label: "Add Card",
      type: "button" as const,
      action: () => {
        setActiveListId(listId);
        closeDropdown();
      },
    },
    {
      id: "copyList",
      label: "Copy List",
      type: "dialog" as const,
      dialogContent: <CopyingList listId={listId} />,
    },
    {
      id: "moveList",
      label: "Move List",
      type: "panel" as const,
      panelContent: <MoveList listId={listId} setOpenListId={setOpenListId} />,
    },
    
    {
      id: "deleteList",
      label: "Delete List",
      type: "panel" as const,
      panelContent: <DeleteList listId={listId} />,
    },
    // {
    //   id: "watchCard",
    //   label: "Watch Card",
    //   type: "button" as const,
    //   action: () => {
    //     console.log("Card Added");
    //     closeDropdown();
    //   },
    // },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute -top-10 bg-bgS w-[18rem] rounded-md z-[30]"
    >
      {activePanel ? (
        <div className="overflow-y-auto custom-scrollbar p-4 font-charlie-text-r">
          <button
            className="text-sm text-blue-400 mb-2 "
            onClick={() => setActivePanel(null)}
          >
            ← Back
          </button>
          <div>
            {menuItems.find((item) => item.id === activePanel)?.panelContent}
          </div>
        </div>
      ) : (
        <ul className="space-y-2 h-[14rem]">
          <div className="flex items-center justify-between px-2 py-1">
            <X size={16} onClick={closeDropdown} />
            <h2 className="text-sm text-textP font-charlie-text-r">
              List actions
            </h2>
            <div></div>
          </div>
          <CustomBorder />
          {menuItems.map((item) => {
            if (item.type === "button") {
              return (
                <li
                  key={item.id}
                  onClick={item.action}
                  className="cursor-pointer font-charlie-text-r text-sm text-textP hover:text-white hover:bg-gray-500 p-2 rounded"
                >
                  {item.label}
                </li>
              );
            }

            if (item.type === "dialog") {
              return (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <li className="cursor-pointer  font-charlie-text-r text-sm text-textP hover:text-white hover:bg-gray-500 p-2 rounded">
                      {item.label}
                    </li>
                  </DialogTrigger>
                  {item.dialogContent}
                </Dialog>
              );
            }

            if (item.type === "panel") {
              return (
                <li
                  key={item.id}
                  onClick={() => setActivePanel(item.id)}
                  className="cursor-pointer  font-charlie-text-r text-sm text-textP hover:text-white hover:bg-gray-500 p-2 rounded"
                >
                  {item.label}
                </li>
              );
            }
          })}
        </ul>
      )}
    </div>
  );
};
