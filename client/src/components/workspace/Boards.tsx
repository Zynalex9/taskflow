import BoardTop from "./Boards/BoardTop";
import FilterBar from "./Boards/FilterBar";

const Boards = () => {
  return <div className="min-h-screen overflow-auto">
    <BoardTop/>
    <FilterBar/>
  </div>;
};

export default Boards;
