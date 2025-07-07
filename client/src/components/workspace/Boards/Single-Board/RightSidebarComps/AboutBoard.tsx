import { InfoIcon } from "lucide-react";

const AboutBoard = () => {
  return (
    <div className="mt-4 flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer">
      <InfoIcon size={20} />
      <div>
        <h2 className="text-sm">About this board</h2>
        <p className="text-xs text-gray-300">Add a description to your board</p>
      </div>
    </div>
  );
};

export default AboutBoard;
