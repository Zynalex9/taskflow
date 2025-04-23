import { Inbox, LucideIcon } from "lucide-react";

interface ContentBoxProps {
  Icon: LucideIcon;
  heading: string;
  text: string;
}
const ContentBox: React.FC<ContentBoxProps> = ({ Icon, heading, text }) => {
  return (
    <div className="flex items-start gap-4 p-4 flex-col px-24">
      <div className="flex items-center gap-2">
        <Icon className="text-blue-600 w-4 h-4" />
        <h2 className="text-md font-semibold">{heading}</h2>
      </div>
      <div className="max-w-3xs">
        <p className="text-gray-700 text-xs">{text}</p>
      </div>
    </div>
  );
};

export default ContentBox;
