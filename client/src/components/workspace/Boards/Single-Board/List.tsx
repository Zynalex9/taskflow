import React from "react";
import { IList } from "../../../../types/functionalites.types";
import Card from "./Card";

interface ListProps {
  list: IList[] | undefined;
}
const List: React.FC<ListProps> = ({ list }) => {
  console.log("l", list);
  return (
    <div className="flex gap-4">
      {list?.map((singleList) => (
        <div key={singleList._id} className="bg-gray-100 p-4 rounded">
          <h2 className="font-bold mb-2">{singleList.name}</h2>
          {singleList.cards.map((card) => (
            <Card key={card._id} card={card} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default List;
