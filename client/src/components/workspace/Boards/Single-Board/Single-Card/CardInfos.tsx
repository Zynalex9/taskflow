import ModalButton from "@/components/resuable/ModalButton";
import { socket } from "@/socket/socket";
import { cardApi } from "@/store/cardApi";
import { AppDispatch } from "@/store/store";
import { ICard, ILabel } from "@/types/functionalites.types";
import {
  format,
  isBefore,
  isToday,
  isWithinInterval,
  addDays,
  parseISO,
} from "date-fns";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const CardInfos = ({ card }: { card: ICard }) => {
  if (!card) return null;
  const dispatch = useDispatch<AppDispatch>();
  const hasStartDate = !!card.startDate;
  const hasEndDate = !!card.endDate;

  const hasLabels = card.labels?.length > 0;
  const hasMembers = card.members.length > 0;

  const getDeadlineLabel = () => {
    if (!card.endDate) return null;

    const end = parseISO(card.endDate);
    const now = new Date();

    if (isBefore(end, now)) return "Overdue";
    if (isToday(end)) return "Due Today";
    if (
      isWithinInterval(end, {
        start: now,
        end: addDays(now, 3),
      })
    )
      return "Due Soon";

    return null;
  };

  const deadlineLabel = getDeadlineLabel();
  useEffect(() => {
    const handleNewLabels = (data: ILabel[]) => {
      console.log("data", data);
      dispatch(
        cardApi.util.updateQueryData(
          "getSingleCard",
          { cardId: card._id },
          (draft) => {
            const existingLabels = draft.data.labels;

            const mergedLabels = [
              ...existingLabels,
              ...data.filter(
                (newLabel) =>
                  !existingLabels.some(
                    (existingLabel) => existingLabel._id === newLabel._id
                  )
              ),
            ];

            draft.data.labels = mergedLabels;
          }
        )
      );
    };

    const handleAddDate = () => {
      dispatch(
        cardApi.util.invalidateTags([{ type: "singleCard", id: card._id }])
      );
    };
    socket.on("dateAdded", handleAddDate);
    socket.on("labelAdded", handleNewLabels);
    return () => {
      socket.off("dateAdded", handleAddDate);
      socket.off("labelAdded", handleNewLabels);
    };
  }, [dispatch, card._id]);
  return (
    <div className="ml-12">
      <div className="flex flex-wrap items-center gap-4">
        {(hasStartDate || hasEndDate) && (
          <div>
            <h1 className="text-textP font-charlie-text-sb">Date</h1>
            <div className="flex items-center gap-2">
              <button className="transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 px-4 py-2 rounded text-white text-sm">
                {hasStartDate && format(new Date(card.startDate), "MMMM dd")}
                {hasEndDate && (
                  <>
                    {" - "}
                    {format(new Date(card.endDate), "MMMM dd, yyyy")}
                    {deadlineLabel && (
                      <span
                        className={`text-xs font-semibold px-2 py-1 ml-2 rounded ${
                          deadlineLabel === "Overdue"
                            ? "bg-red-600 text-white"
                            : deadlineLabel === "Due Today"
                            ? "bg-yellow-500 text-black"
                            : "bg-blue-600 text-white"
                        }`}
                      >
                        {deadlineLabel}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        {hasLabels && (
          <div className="">
            <h1 className="text-textP font-charlie-text-sb">Labels</h1>
            <div className="flex flex-wrap gap-2">
              {card.labels.map((label) => (
                <div
                  key={label._id}
                  className="px-6 py-2 rounded-xs shadow-sm text-white text-xs truncate max-w-[120px]"
                  style={{ backgroundColor: label.color }}
                >
                  {label.name}
                </div>
              ))}
              <ModalButton btnText="+" />
            </div>
          </div>
        )}

        {hasMembers && (
          <div>
            <h1 className="text-textP font-charlie-text-sb">Members</h1>
            <div className="flex flex-wrap gap-2">
              {card.members.map((member) => (
                <div className="flex flex-wrap gap-2" key={member._id}>
                  <img
                    src={member.profilePicture}
                    alt={member.username}
                    className="size-9 shadow-lg rounded"
                  />
                </div>
              ))}
              <ModalButton btnText="+" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardInfos;
