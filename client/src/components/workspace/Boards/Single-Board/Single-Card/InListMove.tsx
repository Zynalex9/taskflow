import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";

const InListMove = () => {
  const { card } = useSelector((state: RootState) => state.card);
  if (card)
    return (
      <h1 className="my-2">
        In The List
        <span className="bg-gray-700 m-1 p-1.5 text-white rounded shadow-2xl">
          {card.list.name}
        </span>
      </h1>
    );
};

export default InListMove;
