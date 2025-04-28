import { LucideIcon } from "lucide-react";
import { useState } from "react";

interface ContentBoxProps {
  Icon: LucideIcon;
  heading: string;
  text: string;
  bg:string
}
const ContentBox: React.FC<ContentBoxProps> = ({ Icon, heading, text,bg }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-start gap-4 p-2 flex-col transition-colors duration-200 cursor-pointer`}
      style={{ backgroundColor: isHovered ? bg : "transparent" }}
    >

      <div className="flex items-center gap-2">
        <Icon className="text-blue-600 w-4 h-4" />
        <h2 className="text-lg font-charlie-text-sb font-semibold">{heading}</h2>
      </div>
      <div className="max-w-3xs">
        <p className="text-gray-700 text-sm font-charlie-text-r">{text}</p>
      </div>
    </div>
  );
};

export default ContentBox;
