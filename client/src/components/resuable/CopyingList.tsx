import { DialogContent } from "../ui/dialog";
import ModalButton from "./ModalButton";

export const CopyingList = () => {
  return (
    <DialogContent
      data-ignore-click-outside="true"
      className="bg-bgS text-textP border-none"
    >
      <h2 className="text-lg">Copy List</h2>
      <p>Confirm copying list...</p>
      <ModalButton btnText="Copy" />
    </DialogContent>
  );
};
