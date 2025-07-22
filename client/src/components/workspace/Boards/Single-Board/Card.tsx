import { ICard } from "../../../../types/functionalites.types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToggleCompleteMutation } from "@/store/cardApi";

interface IProps {
  card: ICard | undefined;
}
const Card: React.FC<IProps> = ({ card }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { workspaceId, boardId } = useParams();
  const cardId = card?._id!;
  const [isChecked, setIsChecked] = useState(card?.checked);
  const [toggleCard] = useToggleCompleteMutation();
  useEffect(() => {
    if (card?.checked !== undefined) {
      setIsChecked(card.checked);
    }
  }, [card?.checked]);
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
  const [showChecked, setShowChecked] = useState(false);
  return (
    <div
      onMouseEnter={() => setShowChecked(true)}
      onMouseLeave={() => setShowChecked(false)}
    >
      <div className="flex items-center gap-1">
        <div
          className={`transition-all duration-200 ease-in ${
            showChecked
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 absolute pointer-events-none"
          }`}
        >
          <label className="cursor-pointer">
            <input
              type="checkbox"
              name="option"
              className="peer hidden"
              checked={isChecked}
              onChange={handleCheckChange}
            />
            <div className="w-6 h-6 border  rounded-full flex items-center justify-center peer-checked:bg-[#29AD77] peer-checked:border-0"></div>
          </label>
        </div>
        <div
          onClick={() => {
            card?._id !== "temp-card-id"
              ? navigate(
                  `/user/w/workspace/${workspaceId}/board/${boardId}/card/${card?._id}`,
                  { state: { background: location } }
                )
              : "";
          }}
          className="bg-[#22272B] rounded-lg py-2 px-1.5 my-2 w-full transition-all duration-100 hover:border-white hover:border"
        >
          {card && card.labels && card.labels.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.labels.map((label) => (
                <div
                  style={{ backgroundColor: label.color }}
                  className="px-1 min-w-14 h-4 truncate rounded flex items-center justify-center"
                >
                  <h1 className="text-xs text-white drop-shadow-md">
                    {label.name}
                  </h1>
                </div>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2 my-1">
            <h1>{card?.name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
