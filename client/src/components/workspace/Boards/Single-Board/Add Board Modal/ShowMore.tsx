import MoreColors from "./MoreColors";
import MoreImages from "./MoreImages";

const ShowMore = () => {
  return (
    <div className="absolute custom-scrollbar overflow-y-auto top-50 lg:top-30 left-20 lg:left-138 border-gray-700 border-2 rounded-md p-4 h-[20rem] lg:h-[26rem] bg-[#282E33] w-[19.5rem] z-[50000] space-y-4 ">
      <MoreImages />
      <MoreColors/>
    </div>
  );
};

export default ShowMore;
