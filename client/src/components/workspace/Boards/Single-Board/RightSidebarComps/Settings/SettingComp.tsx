import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { CommentsPopover } from "./CommentsPopover";
import { AddMembersPermissions } from "./AddMembersPermissions";
import { JoinAnEdit } from "./JoinAnEdit";

export const SettingComp = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);

  return (
    <div className="space-y-4 px-4 py-6 ">
      <div className="space-y-2">
        <h1 className="text-xl font-charlie-display-sm  text-textP font-bold">
          Workspace
        </h1>
        <p className="text-xs font-charlie-text-r  text-textP/80">
          {workspace?.name}
        </p>
      </div>
      <div className="space-y-2">
        <h1 className="text-xl  font-charlie-display-sm  text-textP font-bold">
          Permissions
        </h1>
        <CommentsPopover />
        <AddMembersPermissions />
        <JoinAnEdit />
      </div>
    </div>
  );
};
