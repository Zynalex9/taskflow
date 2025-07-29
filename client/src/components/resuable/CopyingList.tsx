import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { DialogContent } from "../ui/dialog";
import ModalButton from "./ModalButton";

export const CopyingList = () => {
  const { board } = useSingleBoardContext();
  return (
    <DialogContent
      data-ignore-click-outside="true"
      className="bg-bgS text-textP border-none"
    >
      <h2 className="text-lg">Copy List</h2>
      <div>
        <select className="w-full p-2 bg-bgS text-textP rounded-lg mb-2 focus:outline-0 focus:border-0 focus:ring-blue-400 focus:ring-2">
          <option value="" disabled selected>
            Select a board
          </option>
          {board.lists.map((list) => (
            <option key={list._id} value={list._id}>
              {list.name}
            </option>
          ))}
        </select>
      </div>
      <ModalButton btnText="Copy" />
    </DialogContent>
  );
};
