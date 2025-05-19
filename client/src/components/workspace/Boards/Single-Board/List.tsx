import React from "react";
import { IList } from "../../../../types/functionalites.types";
import Card from "./Card";
import { Plus, SquareArrowOutUpLeftIcon } from "lucide-react";
import AddList from "./AddList";

interface ListProps {
  list: IList[] | undefined;
}
const List: React.FC<ListProps> = ({ list }) => {
  console.log("l", list);
  return (
    <div className="flex gap-4 w-max min-w-full"> 
      {list && list?.length > 0
        ? list?.map((singleList) => (
            <div
              key={singleList._id}
              className="bg-[#101204] w-[300px] p-4 text-textP rounded-xl shadow-lg shadow-black/80 flex-shrink-0"
            >
              <div className="font-bold mb-2 w-full flex items-center justify-between">
                <h1>{singleList.name}</h1>
                <SquareArrowOutUpLeftIcon size={16} />
              </div>
              {singleList.cards.map((card) => (
                <Card key={card._id} card={card} />
              ))}
              <button className="w-full flex items-center gap-2 text-sm text-textP hover:text-white hover:bg-[#282F27] px-4 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm shadow-sm">
                <Plus className="w-4 h-4" />
                <span>Add a card</span>
              </button>
            </div>
          ))
        : <AddList/>}
    </div>
  );
};

export default List;
