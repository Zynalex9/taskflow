import { useAddWorkspaceAdminMutation } from "@/store/workspace.members.api";
import ModalButton from "./ModalButton";
import { toast, ToastContainer } from "react-toastify";

interface IMember {
  userId: string;
  username: string;
  email: string;
  profilePicture: string;
  role: string;
}
interface MembersData {
  data: IMember[];
}
interface MembersDisplayProps {
  membersData: MembersData;
  workspaceId: string;
}
export const MembersDisplay = ({
  membersData,
  workspaceId,
}: MembersDisplayProps) => {
  const [addAdmin] = useAddWorkspaceAdminMutation();

  const addAdminHandler = async (memberId: string) => {
    try {
      const res = await addAdmin({
        workspaceId,
        adminId: memberId,
      }).unwrap();
      if (res.success) {
        toast.success(res.data.message || "Admin added successfully");
      }
    } catch (error) {
      toast.error("Failed to add admin");
    }
  };
  return (
    <div>
      {membersData && membersData?.data?.length > 0 ? (
        <div className="space-y-6">
          {membersData.data.map((member: IMember, idx: number) => {
            return (
              <div
                key={member.userId}
                className={`flex items-center justify-between gap-2 ${
                  idx % 2 === 0 ? "bg-gray-700" : ""
                } p-4 rounded-lg shadow-sm`}
              >
                <div className="flex items-center gap-2">
                  <img
                    src={member.profilePicture}
                    alt={member.username}
                    className="w-12 h-12 rounded-full object-cover shadow-sm"
                  />
                  <div>
                    <h2 className="text-xl text-textP">{member.username}</h2>
                    <p className={`text-xs text-gray-400`}>
                      {member.role[0].toLocaleUpperCase() +
                        member.role.slice(1)}
                    </p>
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
                  <ModalButton
                    btnText="Make an admin"
                    onClickFn={() => addAdminHandler(member.userId)}
                  />
                  <ModalButton btnText="Demote an admin" />
                </div>
              </div>
            );
          })}
        </div>
      ) : null}
      <ToastContainer theme="dark" />
    </div>
  );
};
