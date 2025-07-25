// If someone is a workspace member. he can view any public board
// if someone is a workspace admin, he can view/edit any public board and manage members
// if someone is a workspace owner, he can do everything an admin can do and also delete the workspace
// if someone is a specific board member only then he can read/write
//if someone is workspace admin or board admin he can remove members from the board
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import CustomBorder from "../resuable/CustomBorder";

const Members = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);
  console.log(workspace);
  if (!workspace) {
    return <div className="px-2 py-4">Loading...</div>;
  }
  return (
    <div className="px-2 py-4">
      <h1 className="font-charlie-display-sm text-textP text-xl my-6">
        Members ({workspace.members.length})
      </h1>
      <CustomBorder />
      <div className="mt-4">
        {workspace.members.length > 0 ? (
          <div>{}</div>
        ) : (
          <p className="text-gray-400 text-xl text-center">No member</p>
        )}
      </div>
    </div>
  );
};

export default Members;
