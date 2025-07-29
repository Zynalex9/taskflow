import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useState, useRef } from "react";
import { useClickOutside } from "@/Context/useRefContext";
import { X } from "lucide-react";
import CustomBorder from "./CustomBorder";
import { CopyingList } from "./CopyingList";

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
      dialogContent: <CopyingList />,
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
      id: "moveAllCards",
      label: "Move all cards in this list",
      type: "panel" as const,
      panelContent: (
        <>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ipsa alias
          quam inventore architecto maiores officiis sed quod commodi corporis
          dolore eius molestias mollitia provident recusandae quia, delectus eos
          ut nisi sunt ea expedita reiciendis iusto beatae. Obcaecati
          exercitationem perferendis quia iure quod quisquam aliquid sint
          similique harum officia. Nam sed officia debitis quasi fugit numquam
          nulla tenetur ullam ea laudantium delectus facilis ad dolor quaerat
          libero ducimus mollitia, earum fuga, magnam id unde in magni velit
          alias. Debitis laborum natus soluta, illo quasi quo. Quam quia enim,
          necessitatibus molestiae et fugit aliquid. Aut quaerat quod, molestias
          voluptatem odit ab placeat explicabo reiciendis ducimus, rerum fugit
          eligendi minus fuga odio inventore ad quia officiis? Obcaecati esse
          itaque aperiam sapiente soluta facilis ducimus tempora recusandae illo
          iure. Repudiandae in mollitia cumque officia dolorum laborum magni
          sequi repellendus, provident ipsum. Cupiditate molestias numquam
          labore sunt accusamus, suscipit illo optio necessitatibus omnis quis
          sint, dolore esse dicta, voluptas quasi facilis fuga atque nulla.
          Veniam, voluptates similique eum ut adipisci suscipit distinctio?
          Magnam cum consectetur, illo culpa, nulla sint officiis corrupti
          tempora officia, ratione nobis! Cupiditate ipsa voluptatibus dolores
          laborum optio fugiat est unde iste cum, maiores rerum quas magni ea et
          totam. Blanditiis, tempora?
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
    {
      id: "watchCard",
      label: "Watch Card",
      type: "button" as const,
      action: () => {
        console.log("Card Added");
        closeDropdown();
      },
    },
  ];

  return (
    <div
      ref={dropdownRef}
      className="absolute -top-10 bg-bgS w-[18rem] rounded-md z-[30]"
    >
      {activePanel ? (
        <div className="h-56 overflow-y-auto custom-scrollbar p-4">
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
        <ul className="space-y-2 h-[19rem]">
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
