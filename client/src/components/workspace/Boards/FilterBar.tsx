import { useState } from "react";
import BoardDisplay from "./BoardDisplay";

const FilterBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  return (
    <div className="mx-4 max-lg:w-xl">
      <h1 className="text-5xl mt-4 font-charlie-text-sb text-textP">Boards</h1>
      <div className="mt-4 w-full flex items-center justify-between">
        <div>
          <label className="text-textP text-md font-charlie-text-r block mb-1">
            Sort By
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="w-52 max-w-xs p-2 border-1 border-textP rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-textP/70 bg-fprimary font-charlie-text-r"
          >
            <option value="">Select an option</option>
            <option value={"asc"}>Alphabaticaly A-Z</option>
            <option value={"desc"}>Alphabaticaly Z-A</option>
          </select>
        </div>
        <div>
          <label className="text-textP text-md font-charlie-text-r block mb-1">
            Search
          </label>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search"
            className="w-52 max-w-xs p-2 border-1 border-textP rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-textP/70 bg-fprimary font-charlie-text-r"
          />
        </div>
      </div>
      <div>
        <BoardDisplay searchTerm={searchTerm} sortOption={sortOption} />
      </div>
    </div>
  );
};

export default FilterBar;
