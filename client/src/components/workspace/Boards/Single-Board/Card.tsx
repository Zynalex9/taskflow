import { ICard } from "../../../../types/functionalites.types";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Paperclip } from "lucide-react";

interface IProps {
  card: ICard | undefined;
}
const Card: React.FC<IProps> = ({ card }) => {
  console.log("c", card);
  const location = useLocation();
  const navigate = useNavigate();
  const { workspaceId, boardId } = useParams();
  const background = location.state?.background;
  console.log(background);
  return (
    <HoverCard>  
      <HoverCardTrigger>
        <div
          onClick={() => {
            navigate(
              `/user/w/workspace/${workspaceId}/board/${boardId}/card/${card?._id}`,
              { state: { background: location } }
            );
          }}
          className="bg-[#22272B] rounded-xl py-2 px-1 my-2 max-w-full transition-all duration-100 hover:border-white hover:border"
        >
          {card?.name}
        </div>
      </HoverCardTrigger>
      {card && (
        <HoverCardContent className="w-80 bg-[#1e1e1e] border border-[#2a2a2a] shadow-lg rounded-md p-4 space-y-3">
          <h2 className="text-white text-lg font-semibold mb-2">
            {card?.name}
          </h2>

          {card?.description && (
            <p className="text-sm text-[#B3BFCC] line-clamp-3">
              {card.description}
            </p>
          )}

          {card?.labels.length> 0 && (
            <div className="flex flex-wrap gap-2">
              {card.labels.map((label) => (
                <span
                  key={label._id}
                  className="text-xs px-2 py-1 rounded-full font-medium"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
          {card?.attachments.length > 0 && (
            <div className=" text-textP">
              <Paperclip className="inline" size={16} /> {card.attachments.length} attachment
              {card.attachments.length > 1 ? "s" : ""}
            </div>
          )}

          {card?.priority && (
            <div className="text-xs text-[#B3BFCC]">
              Priority:{" "}
              <span
                className={`inline-block ml-1 px-2 py-0.5 rounded-full text-white text-[10px] ${
                  card.priority === "High"
                    ? "bg-red-600"
                    : card.priority === "Medium"
                    ? "bg-yellow-600"
                    : "bg-green-600"
                }`}
              >
                {card.priority}
              </span>
            </div>
          )}

          {card?.endDate && (
            <div className="text-xs text-[#B3BFCC]">
              📅 Due: {new Date(card.endDate).toLocaleDateString()}
            </div>
          )}
        </HoverCardContent>
      )}
    </HoverCard>
  );
};

export default Card;
