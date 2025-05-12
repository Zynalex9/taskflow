import React from "react";
import { ICard } from "../../../../types/functionalites.types";
interface IProps {
  card: ICard  | undefined;
}
const Card: React.FC<IProps> = ({ card }) => {
    console.log("c",card)

  return <div>{card?.name}</div>;
};

export default Card;
