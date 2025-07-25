import {
  Calendar,
  CheckSquare,
  ImageIcon,
  Paperclip,
  Tag,
  User,
  UserPlus,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  closeAllDropDown,
  openAttachmentsDropDown,
  openChecklistDropDown,
  openCoverDropDown,
  openDatesDropDown,
  openLabelsDropDown,
  openMembersDropDown,
} from "@/store/CardModalStatesSlice";
import AddChecklist from "./dropdowns/Checklist/AddChecklist";
import AddAttachment from "./dropdowns/attachment/AddAttachment";
import DateCalendar from "./dropdowns/Date/DateCalendar";
import AddLabelDropDown from "./dropdowns/Label/AddLabelDropDown";
import AddMembers from "./dropdowns/members/AddMembers";
import { CustomTooltip } from "./CustomTooltip";
import { ICard } from "@/types/functionalites.types";
import AddCover from "./dropdowns/cover/addCover";
import { useEffect, useState } from "react";
import { useJoinCardMutation, useLeaveCardMutation } from "@/store/cardApi";
import { toast, ToastContainer } from "react-toastify";

interface Props {
  card: ICard;
}
export function ModalSidebar({ card }: Props) {
  const [isMember, setIsMember] = useState(false);

  const { user } = useSelector((state: RootState) => state.auth);
  const [joinCard] = useJoinCardMutation();
  const [leaveCard] = useLeaveCardMutation();
  const ToggleJoin = async () => {
    const body = {
      cardId: card._id,
      userId: user?._id!,
    };

    try {
      let res;

      if (!isMember) {
        res = await joinCard(body).unwrap();
      } else {
        res = await leaveCard(body).unwrap();
      }

      if (res.success) {
        toast.success(
          res.message ||
            (!isMember ? "Joined successfully 🎉" : "Left the card"),
          { theme: "dark" }
        );
        setIsMember(!isMember);
      } else {
        toast.warning(res.message || "Operation failed", { theme: "dark" });
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || err?.message || "Something went wrong 😓";
      toast.error(errorMessage, { theme: "dark" });
    }
  };

  const {
    openChecklist,
    openAttachments,
    openDates,
    openLabels,
    openMembers,
    openCover,
  } = useSelector((state: RootState) => state.cardModalState);

  useEffect(() => {
    if (!user?._id) return;

    const userIsMember = card.members.some((member) =>
      typeof member === "string" ? member === user._id : member._id === user._id
    );

    setIsMember(userIsMember);
  }, [card.members, user?._id]);

  const dispatch = useDispatch<AppDispatch>();
  const cardId = card._id;
  const sidebarItems = [
    {
      icon: UserPlus,
      label: isMember ? "Leave" : "Join",
      tooltip: isMember ? "Leave Card" : "Join Card",
      onClick: () => ToggleJoin(),
    },
    {
      icon: User,
      label: "Members",
      tooltip: "Manage members",
      dropdown: <AddMembers card={card} />,
      isOpen: openMembers,
      onClick: openMembers
        ? () => dispatch(closeAllDropDown())
        : () => dispatch(openMembersDropDown()),
    },
    {
      icon: Tag,
      label: "Labels",
      tooltip: "Manage labels",
      onClick: openLabels
        ? () => dispatch(closeAllDropDown())
        : () => dispatch(openLabelsDropDown()),
      dropdown: (
        <AddLabelDropDown cardId={cardId} existingLabels={card.labels} />
      ),
      isOpen: openLabels,
    },
    {
      icon: openChecklist ? X : CheckSquare,
      label: "Checklist",
      tooltip: "Add checklist -",
      onClick: openChecklist
        ? () => dispatch(closeAllDropDown())
        : () => dispatch(openChecklistDropDown()),
      isOpen: openChecklist,
      dropdown: <AddChecklist cardId={cardId} />,
    },
    {
      icon: openAttachments ? X : Paperclip,
      label: "Attachment",
      tooltip: "Add attachment",
      onClick: openAttachments
        ? () => dispatch(closeAllDropDown())
        : () => dispatch(openAttachmentsDropDown()),
      dropdown: <AddAttachment cardId={cardId} />,
      isOpen: openAttachments,
    },
    {
      icon: ImageIcon,
      label: "Cover",
      tooltip: "Add cover",
      dropdown: <AddCover cardId={card._id} />,
      isOpen: openCover,
      onClick: openCover
        ? () => dispatch(closeAllDropDown())
        : () => dispatch(openCoverDropDown()),
    },
    {
      icon: Calendar,
      label: "Date",
      tooltip: "Add Date",
      dropdown: <DateCalendar cardId={cardId} />,
      isOpen: openDates,
      onClick: openDates
        ? () => dispatch(closeAllDropDown())
        : () => dispatch(openDatesDropDown()),
    },
  ];

  return (
    <div className="space-y-2.5">
      {sidebarItems.map((item, index) => (
        <div key={index} className="relative">
          <CustomTooltip content={item.tooltip} side="right" sideOffset={10}>
            <button
              onClick={item.onClick}
              className="flex w-full gap-2 px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC]"
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          </CustomTooltip>

          <div
            className={`absolute transition-all duration-75 top-5 mt-2 -left-0 z-20 bg-[#282E33] shadow-lg  ${
              item.isOpen ? "block" : "hidden"
            }`}
          >
            {item.dropdown}
          </div>
        </div>
      ))}
      <ToastContainer className={`mt-20`} />
    </div>
  );
}

export default ModalSidebar;
