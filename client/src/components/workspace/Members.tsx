import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import CustomBorder from "../resuable/CustomBorder";
import { useGetWorkspaceMembersQuery } from "@/store/workspace.members.api";
import { AddMembersInput } from "../resuable/AddMembersInput";
import { MembersDisplay } from "../resuable/MembersDisplay";
import { useWorkspaceSocketInvalidation } from "@/hooks/useWorkspaceSocketInvalidation";

const Members = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);
  if (!workspace) {
    return <div className="px-2 py-4">Loading...</div>;
  }
  const { data: membersData } = useGetWorkspaceMembersQuery(workspace._id || "");
  useWorkspaceSocketInvalidation({ eventName: "workspaceAdminUpdated" });

  return (
    <div className="px-2 sm:px-4 py-4">
      <h1 className="font-charlie-display-sm text-textP text-lg sm:text-xl my-4 sm:my-6">
        Members ({membersData?.data.length || 0})
      </h1>
      <CustomBorder />
      <AddMembersInput />
      <MembersDisplay membersData={membersData} workspaceId={workspace._id} />
    </div>
  );
};

export default Members;
