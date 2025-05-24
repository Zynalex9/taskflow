import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { Lock } from "lucide-react";
import Button from "../../resuable/Button";

const BoardTop = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);

  return (
      <div className="mx-4 max-lg:w-3xl flex items-center justify-between p-6 border-b border-gray-200/50  shadow-sm">
        <div className="flex items-center space-x-4">
          <img
            src={workspace?.cover}
            alt="cover-image"
            className="w-14 h-14 object-cover rounded-md border border-gray-300"
          />
          <div>
            <h1 className="text-lg font-semibold  text-textP font-charlie-text-r">
              {workspace?.name}
            </h1>
            <p className="text-sm text-gray-500 flex items-center space-x-1">
              <Lock size={14} className="mr-1" />
              <span>Private</span>
            </p>
          </div>
        </div>

        <div>
          <Button buttonText="Invite members to workspace" />
        </div>
      </div>
  );
};

export default BoardTop;
