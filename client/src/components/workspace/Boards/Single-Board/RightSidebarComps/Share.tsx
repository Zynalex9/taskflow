import { RootState } from "@/store/store";
import { UserPlus } from "lucide-react";
import { useSelector } from "react-redux";

const ShareComp = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  return (
    <div className="text-textP flex w-full justify-between items-center px-4 pt-2 pb-1">
      <div className="flex items-center gap-2">
        <UserPlus className="inline" size={18} />
        <h1 className="text-sm font-charlie-text-r">Share</h1>
      </div>
      <img
        src={user?.profilePicture}
        alt="Profile Picture"
        className="size-9 rounded-full object-cover object-center "
      />
    </div>
  );
};

export default ShareComp;
