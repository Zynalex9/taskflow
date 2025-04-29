import { LucideIcon } from "lucide-react";
import React from "react";

interface IProps {
  Icon: LucideIcon;
  heading: string;
  buttonText?: string;
  description: string;
}

const Card: React.FC<IProps> = ({ Icon, buttonText, description, heading }) => {
  return (
    <div className="w-full lg:w-1/3 bg-[#FAFBFC] shadow-xl space-y-3 text-heading p-6 h-[60vh] rounded-lg flex flex-col  justify-between">
      <Icon size={40} className="mb-4 text-primary" />
      <h1 className="text-2xl font-semibold">{heading}</h1>
      <p className="text-base text-gray-600 mt-2">{description}</p>
      {buttonText && (
        <button className="mt-4 py-2 px-6 bg-white ring-1 ring-primary cursor-pointer text-black rounded-md hover:bg-blue-200 transition-all duration-300">
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default Card;

