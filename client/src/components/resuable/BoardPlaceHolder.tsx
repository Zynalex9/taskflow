import { isImageUrl } from "@/utils/helper";
import React from "react";
import { Link } from "react-router-dom";

interface IProps {
  to: string;
  isTemplete: boolean;
  title: string;
  bg: string;
}

const BoardPlaceHolder: React.FC<IProps> = ({ isTemplete, bg, title, to }) => {
  return (
    <Link to={to}>
      <div className="rounded w-56 h-32 p-2 shadow-2xl cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-110">
        <div
          className="w-full h-20 rounded-t"
          style={
            isImageUrl(bg)
              ? { backgroundImage: `url(${bg})`, backgroundSize: "cover",backgroundPosition:"center center" }
              : { background: bg }
          }
        ></div>

        <div className="w-full h-12 bg-fprimary px-2 py-1 rounded-b flex items-center justify-between">
          <h1 className="text-md font-medium text-textP truncate">{title}</h1>
          {isTemplete && (
            <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
              Template
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default BoardPlaceHolder;
