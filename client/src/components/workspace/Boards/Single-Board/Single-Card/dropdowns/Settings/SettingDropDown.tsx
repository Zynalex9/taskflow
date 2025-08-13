import { useState } from "react";
import DropdownHeader from "../../DropdownHeader";
import { useEditCardMutation } from "@/store/cardApi";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

interface SettingDropDownProps {
  cardId: string;
}

export const SettingDropDown = ({ cardId }: SettingDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const { workspaceId } = useParams();
  const [editCard] = useEditCardMutation();
  const handleDeleteCard = async () => {};
  const handleEditCard = async () => {
    if (!newName) return;
    try {
      const body = {
        cardId,
        name: newName,
        workspaceId: workspaceId!,
      };
      setLoading(true);
      const response = await editCard(body).unwrap();
      toast.success(response.message, { theme: "dark" });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setNewName("");
    }
  };
  return (
    <div className="w-72 bg-bgS rounded shadow-md z-10 p-3 space-y-2">
      <DropdownHeader headerText="Card settings" />

      <div>
        <label htmlFor="new-name" className="text-textP text-sm">
          Edit Card Name
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="New card name"
            value={newName}
            id="new-name"
            onChange={(e) => setNewName(e.target.value)}
            className="w-full border px-2 py-1 rounded text-sm"
          />
          <button
            onClick={handleEditCard}
            disabled={loading}
            className={`flex gap-2 px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC] ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Edit
          </button>
        </div>
      </div>

      {/* Delete Card Button */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(true)}
          className="w-full bg-red-500 text-white py-1 rounded text-sm hover:bg-red-600"
        >
          🗑 Delete Card
        </button>

        {isOpen && (
          <div className="absolute -top-4 bg-bgS text-textP shadow-lg border rounded p-3 mt-2 w-full">
            <p className="text-sm text-textP">
              Are you sure you want to delete this card?
            </p>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-3 py-1 bg-bgS/90 rounded text-sm hover:bg-gray-400"
              >
                No
              </button>
              <button
                onClick={handleDeleteCard}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
              >
                Yes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
