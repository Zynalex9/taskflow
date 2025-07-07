import { Cog } from "lucide-react";

const SettingsComp = () => {
  return (
    <div className="mt-4 flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer">
      <Cog size={18} />
      <h2 className=" text-sm">Settings</h2>
    </div>
  );
};

export default SettingsComp;
