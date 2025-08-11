import { useCardSocketInvalidate } from "@/hooks/useSocketInvalidate";
import { socket } from "@/socket/socket";
import { useToggleCompleteMutation } from "@/store/cardApi";
import { myApi } from "@/store/myApi";
import { AppDispatch } from "@/store/store";
import { ICard } from "@/types/functionalites.types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";

export const CardModalTopBar = ({ card }: { card: ICard }) => {
  const [isChecked, setIsChecked] = useState(card?.checked);

  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
  const handleClose = () => {
    navigate(background?.pathname || -1);
  };

  const { boardId } = useParams();
  const [toggleCard] = useToggleCompleteMutation();

  useEffect(() => {
    if (card?.checked !== undefined) {
      setIsChecked(card.checked);
    }
  }, [card?.checked]);
  const cardId = card?._id;
  const handleCheckChange = async () => {
    if (!cardId) return;
    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    await toggleCard({
      cardId,
      isComplete: newCheckedState,
      boardId: boardId!,
    });
  };

  useCardSocketInvalidate({ eventName: "cardToggled", id: cardId });
  const dispatch = useDispatch<AppDispatch>();
useEffect(() => {
  if (!boardId) return;

  const handleToggled = (payload: { cardId: string; checked: boolean }) => {
    dispatch(
      myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
        draft.data.lists.forEach((list) => {
          list.cards.forEach((card) => {
            if (card._id === payload.cardId) {
              card.checked = payload.checked;
            }
          });
        });
      })
    );

    if (payload.cardId === cardId) {
      setIsChecked(payload.checked);
    }
  };

  socket.on("cardToggled", handleToggled);

  return () => {
    socket.off("cardToggled", handleToggled);
  };
}, [dispatch, boardId, cardId]);


  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <label className="cursor-pointer">
            <input
              type="checkbox"
              name="option"
              checked={isChecked}
              onChange={handleCheckChange}
              className="peer hidden"
            />
            <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center peer-checked:bg-[#29AD77] peer-checked:border-0"></div>
          </label>

          <h1 className="text-textP font-charlie-text-sb text-2xl pl-4">
            {card?.name}
          </h1>
        </div>

        <X
          onClick={handleClose}
          className="cursor-pointer hover:text-gray-300"
          size={24}
        />
      </div>
    </div>
  );
};
