import React from "react";
import { ICard } from "../../../../types/functionalites.types";
interface IProps {
  card: ICard | undefined;
}
const Card: React.FC<IProps> = ({ card }) => {
  console.log("c", card);

  return (
    <div className="bg-[#22272B] rounded-xl py-2 px-1 my-2 max-w-full transition-all duration-100 hover:border-white hover:border">
      {card?.name}
    </div>
  );
};

export default Card;
