// If someone is a workspace member. he can view any public board
// if someone is a workspace admin, he can view/edit any public board and manage members
// if someone is a workspace owner, he can do everything an admin can do and also delete the workspace
// if someone is a specific board member only then he can read/write
//if someone is workspace admin or board admin he can remove members from the board
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
  const { data: membersData } = useGetWorkspaceMembersQuery(
    workspace._id || ""
  );
  useWorkspaceSocketInvalidation({ eventName: "workspaceAdminUpdated" });
  return (
    <div className="px-2 py-4">
      <h1 className="font-charlie-display-sm text-textP text-xl my-6">
        Members ({membersData?.data.length || 0})
      </h1>
      <CustomBorder />
      <AddMembersInput />
      <MembersDisplay membersData={membersData} workspaceId={workspace._id} />
    </div>
  );
};

export default Members;
