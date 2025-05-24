import BoardTop from "./Boards/BoardTop";
import FilterBar from "./Boards/FilterBar";

const Boards = () => {
  return <div className="w-full min-h-screen overflow-scroll custom-scrollbar">
    <BoardTop/>
    <FilterBar/>
  </div>;
};

export default Boards;
