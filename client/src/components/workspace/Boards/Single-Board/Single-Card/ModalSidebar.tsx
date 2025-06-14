import {
  Calendar,
  CheckSquare,
  ImageIcon,
  Paperclip,
  Settings,
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
interface Props {
  card: ICard;
}
export function ModalSidebar({ card }: Props) {
  const { openChecklist, openAttachments, openDates, openLabels, openMembers } =
    useSelector((state: RootState) => state.cardModalState);
  const dispatch = useDispatch<AppDispatch>();
  const cardId = card._id;
  const sidebarItems = [
    { icon: UserPlus, label: "Join", tooltip: "Join Card" },
    {
      icon: User,
      label: "Members",
      tooltip: "Manage members",
      dropdown: <AddMembers card={card}/>,
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
      dropdown: <AddLabelDropDown cardId={cardId} />,
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
    { icon: ImageIcon, label: "Cover", tooltip: "Add cover" },
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
    { icon: Settings, label: "Custom field", tooltip: "Add custom field" },
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
    </div>
  );
}

export default ModalSidebar;
