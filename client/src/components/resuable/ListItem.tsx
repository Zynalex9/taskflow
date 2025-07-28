import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { useClickOutside } from "@/Context/useRefContext";

interface IProps {
  setOpenListId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ListItems: React.FC<IProps> = ({ setOpenListId }) => {
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
        console.log("Card Added");
        closeDropdown();
      },
    },
    {
      id: "copyList",
      label: "Copy List",
      type: "dialog" as const,
      dialogContent: (
        <DialogContent>
          <h2 className="text-lg">Copy List</h2>
          <p>Confirm copying list...</p>
        </DialogContent>
      ),
    },
    {
      id: "moveList",
      label: "Move List",
      type: "panel" as const,
      panelContent: (
        <>
          <h2 className="text-lg font-bold">Move List</h2>
          <p>Select board or position to move.</p>
          <button className="bg-blue-500 text-white px-2 py-1 rounded mt-2">
            Move
          </button>
        </>
      ),
    },
    {
      id: "deleteList",
      label: "Delete List",
      type: "panel" as const,
      panelContent: (
        <>
          <h2 className="text-lg font-bold text-red-500">Delete List</h2>
          <p>This action cannot be undone.</p>
          <button className="bg-red-600 text-white px-2 py-1 rounded mt-2">
            Delete
          </button>
        </>
      ),
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute -top-10 bg-bgS h-[27.5rem] w-[18rem] p-4 rounded-md z-[40000]"
    >
      {activePanel ? (
        <div>
          <button
            className="text-sm text-blue-400 mb-2"
            onClick={() => setActivePanel(null)}
          >
            ← Back
          </button>
          <div>
            {menuItems.find((item) => item.id === activePanel)?.panelContent}
          </div>
        </div>
      ) : (
        <ul className="space-y-2">
          {menuItems.map((item) => {
            if (item.type === "button") {
              return (
                <li
                  key={item.id}
                  onClick={item.action}
                  className="cursor-pointer text-sm text-textP hover:text-white hover:bg-gray-500 p-2 rounded"
                >
                  {item.label}
                </li>
              );
            }

            if (item.type === "dialog") {
              return (
                <Dialog key={item.id}>
                  <DialogTrigger asChild>
                    <li className="cursor-pointer text-sm text-textP hover:text-white hover:bg-gray-500 p-2 rounded">
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
                  className="cursor-pointer text-sm text-textP hover:text-white hover:bg-gray-500 p-2 rounded"
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
