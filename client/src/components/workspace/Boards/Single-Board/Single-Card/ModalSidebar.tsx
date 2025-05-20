import { Calendar, CheckSquare, ImageIcon, Paperclip, Settings, Tag, User, UserPlus } from "lucide-react"
import { CustomTooltip } from "./CustomTooltip"

export function ModalSidebar() {
  const sidebarItems = [
    { icon: UserPlus, label: "Join", tooltip: "Join Card" },
    { icon: User, label: "Members", tooltip: "Manage members" },
    { icon: Tag, label: "Labels", tooltip: "Manage labels" },
    { icon: CheckSquare, label: "Checklist", tooltip: "Add checklist" },
    { icon: Calendar, label: "Dates", tooltip: "Set dates" },
    { icon: Paperclip, label: "Attachment", tooltip: "Add attachment" },
    { icon: ImageIcon, label: "Cover", tooltip: "Add cover" },
    { icon: Settings, label: "Custom field", tooltip: "Add custom field" },
  ]

  return (
    <div className="space-y-2.5">
      {sidebarItems.map((item, index) => (
        <CustomTooltip key={index} content={item.tooltip} side="right" sideOffset={10}>
          <button className="flex w-full gap-2 px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC]">
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        </CustomTooltip>
      ))}
    </div>
  )
}

export default ModalSidebar
