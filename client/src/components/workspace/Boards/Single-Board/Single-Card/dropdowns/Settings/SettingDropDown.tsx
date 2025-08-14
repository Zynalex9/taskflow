import { useState } from "react";
import DropdownHeader from "../../DropdownHeader";
import { useDeleteCardMutation, useEditCardMutation } from "@/store/cardApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useCardSocketInvalidate } from "@/hooks/useSocketInvalidate";
import { useBoardSocketsInvalidate } from "@/hooks/useBoardSocketsInvalidate";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { closeAllDropDown } from "@/store/CardModalStatesSlice";

interface SettingDropDownProps {
  cardId: string;
  listId: string;
}

export const SettingDropDown = ({ cardId, listId }: SettingDropDownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const { workspaceId, boardId } = useParams();
  const [editCard] = useEditCardMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const handleEditCard = async () => {
    if (!newName) return;
    try {
      const body = {
        cardId,
        name: newName,
        workspaceId: workspaceId!,
        boardId: boardId!,
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
  useCardSocketInvalidate({ eventName: "cardEdited", id: cardId });
  const [deleteCard] = useDeleteCardMutation();
  const handleDeleteCard = async () => {
    try {
      const body = {
        cardId,
        workspaceId: workspaceId!,
        boardId: boardId!,
        listId,
      };
      setLoading(true);
      await deleteCard(body).unwrap();
      navigate(`/user/w/workspace/${workspaceId}/board/${boardId}`);
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
      dispatch(closeAllDropDown());
    }
  };
  useBoardSocketsInvalidate({ eventName: "cardDeleted", id: workspaceId! });

  return (
    <div
      data-ignore-click-outside="true"
      className="w-72 bg-bgS rounded shadow-md z-10 p-3 space-y-2"
    >
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
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleEditCard();
              }
            }}
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
