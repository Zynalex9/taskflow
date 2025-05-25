import { useSelector } from "react-redux";
import AddBackground from "./AddBackground";
import { RootState } from "@/store/store";

const AddBoardModal = () => {
  const { selectedImg, selectedColor } = useSelector((state: RootState) => state.boardModalControll);
  
  const getBackgroundStyle = () => {
    if (selectedColor) {
      return { background: selectedColor };
    }
    return {
      backgroundImage: `url(${selectedImg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
    };
  };

  return (
    <div className="z-[999] shadow-2xl h-[32rem] bg-[#282E33] py-4 absolute top-18 left-40 lg:left-62 border-gray-700 border-2 w-[19.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
      <h1 className="text-sm text-center mb-2 font-charlie-display-sm">Create Board</h1>
      
      <div
        className="flex items-center justify-center p-2 rounded-md shadow-2xl mx-4 h-28"
        style={getBackgroundStyle()}
      >
        <img
          src="https://trello.com/assets/14cda5dc635d1f13bc48.svg"
          alt="Trello logo"
          className="rounded shadow-2xs"
        />
      </div>
      
      <div className="mt-2 px-1.5 space-y-2">
        <h1>Backgrounds</h1>
        <AddBackground />
      </div>
    </div>
  );
};

export default AddBoardModal;