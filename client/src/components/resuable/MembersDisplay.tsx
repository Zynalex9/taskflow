import {
  useAddWorkspaceAdminMutation,
  useRemoveWorkspaceAdminMutation,
  useRemoveWorkspaceMemberMutation,
} from "@/store/workspace.members.api";
import ModalButton from "./ModalButton";
import { toast, ToastContainer } from "react-toastify";
import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

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
  const { user } = useSelector((state: RootState) => state.auth);

  const [addAdmin] = useAddWorkspaceAdminMutation();
  const [removeAdmin] = useRemoveWorkspaceAdminMutation();
  const [removeMember] = useRemoveWorkspaceMemberMutation();

  const [adminLoadingIds, setAdminLoadingIds] = useState<string[]>([]);
  const [removingMemberIds, setRemovingMemberIds] = useState<string[]>([]);

  const addAdminHandler = async (memberId: string) => {
    if (adminLoadingIds.includes(memberId)) return;
    setAdminLoadingIds((prev) => [...prev, memberId]);
    try {
      const res = await addAdmin({ workspaceId, adminId: memberId }).unwrap();
      if (res.success) toast.success(res.message || "Admin added successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to add admin");
    } finally {
      setAdminLoadingIds((prev) => prev.filter((id) => id !== memberId));
    }
  };

  const removeAdminHandler = async (memberId: string) => {
    if (adminLoadingIds.includes(memberId)) return;
    setAdminLoadingIds((prev) => [...prev, memberId]);
    try {
      const res = await removeAdmin({
        workspaceId,
        adminId: memberId,
      }).unwrap();
      if (res.success)
        toast.success(res.message || "Admin demoted successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to remove admin");
    } finally {
      setAdminLoadingIds((prev) => prev.filter((id) => id !== memberId));
    }
  };

  const removeMemberHandler = async (memberId: string) => {
    if (removingMemberIds.includes(memberId)) return;
    setRemovingMemberIds((prev) => [...prev, memberId]);
    try {
      const res = await removeMember({
        workspaceId,
        memberId,
      }).unwrap();
      if (res.success)
        toast.success(res.message || "Member removed successfully");
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to remove member");
    } finally {
      setRemovingMemberIds((prev) => prev.filter((id) => id !== memberId));
    }
  };

  return (
    <div>
      {membersData?.data?.length > 0 ? (
        <div className="space-y-6">
          {membersData.data.map((member: IMember, idx: number) => {
            const isAdminLoading = adminLoadingIds.includes(member.userId);
            const isRemoving = removingMemberIds.includes(member.userId);

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
                    <h2 className="text-xl text-textP">
                      {user?._id === member.userId
                        ? `${member.username} (You)`
                        : member.username}
                    </h2>
                    <p className="text-xs text-gray-400 capitalize">
                      {member.role}
                    </p>
                    <p className="text-xs text-gray-400 underline">
                      {member.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {user?._id === member.userId ? (
                    ""
                  ) : (
                    <ModalButton
                      disabled={isRemoving}
                      btnText={isRemoving ? "Removing..." : "Remove"}
                      customStyles="bg-red-500 text-white"
                      onClickFn={() => removeMemberHandler(member.userId)}
                    />
                  )}

                  {user?._id === member.userId ? (
                    ""
                  ) : (
                    <ModalButton
                      disabled={isAdminLoading}
                      btnText={
                        member.role === "admin"
                          ? isAdminLoading
                            ? "Removing..."
                            : "Remove admin"
                          : isAdminLoading
                          ? "Adding..."
                          : "Make an admin"
                      }
                      onClickFn={() =>
                        member.role === "admin"
                          ? removeAdminHandler(member.userId)
                          : addAdminHandler(member.userId)
                      }
                    />
                  )}
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
