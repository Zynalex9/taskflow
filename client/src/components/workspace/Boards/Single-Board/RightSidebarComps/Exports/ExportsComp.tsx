import { Share } from "lucide-react";

const ExportsComp = () => {
  return (
    <div className="mt-4 flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer">
      <Share size={18} />
      <h2 className="">Print, Export and share</h2>
    </div>
  );
};

export default ExportsComp;
