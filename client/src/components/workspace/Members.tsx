// If someone is a workspace member. he can view any public board
// if someone is a workspace admin, he can view/edit any public board and manage members
// if someone is a workspace owner, he can do everything an admin can do and also delete the workspace
// if someone is a specific board member only then he can read/write
//if someone is workspace admin or board admin he can remove members from the board
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import CustomBorder from "../resuable/CustomBorder";
import { useGetWorkspaceMembersQuery } from "@/store/workspace.members.api";
import ModalButton from "../resuable/ModalButton";
interface IMember {
  userId: string;
  username: string;
  email: string;
  profilePicture: string;
  role: string;
}
const Members = () => {
  const { workspace } = useSelector((state: RootState) => state.workspace);

  if (!workspace) {
    return <div className="px-2 py-4">Loading...</div>;
  }
  const { data: membersData, isLoading } = useGetWorkspaceMembersQuery(
    workspace._id || ""
  );
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
      {membersData && membersData?.data?.length > 0 ? (
        <div className="space-y-10">
          {membersData.data.map((member: IMember) => {
            return (
              <div
                key={member.userId}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={member.profilePicture}
                    alt={member.username}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <h2 className="text-xl text-textP">{member.username}</h2>
                    <p className={`text-xs text-gray-400`}>{member.role[0].toLocaleUpperCase()+member.role.slice(1)}</p>
                    <p className="text-xs text-gray-400 underline">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <ModalButton
                    btnText="Remove"
                    customStyles="bg-red-500 text-white"
                  />
                  <ModalButton btnText="Make an admin" />
                  <ModalButton btnText="Demote an admin" />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
};

export default Members;
