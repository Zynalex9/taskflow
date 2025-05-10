import BoardDisplay from "./BoardDisplay";

const FilterBar = () => {
  return (
    <div className="mx-4">
      <h1 className="text-5xl mt-4 font-charlie-text-sb text-textP">Boards</h1>
      <div className="mt-14 w-full flex items-center justify-between">
        <div>
          <label className="text-textP text-md font-charlie-text-r block mb-1">
            Sort By
          </label>
          <select className="w-52 max-w-xs p-2 border-1 border-textP rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-textP/70 bg-fprimary font-charlie-text-r">
            <option >Most recently active</option>
            <option>Least active recently</option>
            <option>Alphabaticaly A-Z</option>
            <option>Alphabaticaly Z-A</option>
          </select>
        </div>
        <div>
          <label className="text-textP text-md font-charlie-text-r block mb-1">
            Search
          </label>
          <input type="text" placeholder="Search" className="w-52 max-w-xs p-2 border-1 border-textP rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-textP/70 bg-fprimary font-charlie-text-r"/>  
        </div>
      </div>
      <div>
        <BoardDisplay/>
      </div>
    </div>
  );
};

export default FilterBar;
