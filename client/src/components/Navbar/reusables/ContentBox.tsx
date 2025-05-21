import { LucideIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ContentBoxProps {
  Icon: LucideIcon;
  heading: string;
  text: string;
  bg:string
  to:string 
}
const ContentBox: React.FC<ContentBoxProps> = ({ Icon, heading, text,bg,to }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={to}>
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-start gap-4 p-2 flex-col transition-colors duration-200 cursor-pointer`}
      style={{ backgroundColor: isHovered ? bg : "transparent" }}
    >

      <div className="flex items-center gap-1">
        <Icon className="text-blue-600 w-4 h-4" color="#7A869A" />
        <h2 className="text-lg font-charlie-text-sb">{heading}</h2>
      </div>
      <div className="lg:max-w-[205px]">
        <p className="text-[#798495] text-xs  leading-relaxed font-charlie-text-r">{text}</p>
      </div>
    </div>
    </Link>
  );
};

export default ContentBox;
