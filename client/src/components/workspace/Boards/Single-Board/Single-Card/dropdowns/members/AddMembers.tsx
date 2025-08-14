import { ICard } from "@/types/functionalites.types";
import DropdownHeader from "../../DropdownHeader";
import { ChangeEvent, useState } from "react";
import { UserMinus } from "lucide-react";
import { useParams } from "react-router-dom";
import { useGetSingleBoardQuery } from "@/store/myApi";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useEditCardMutation } from "@/store/cardApi";
interface Props {
  card: ICard;
}
const AddMembers = ({ card }: Props) => {
  const [search, setSearch] = useState("");
  const [editCard] = useEditCardMutation();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const { boardId, workspaceId } = useParams();
  const { data } = useGetSingleBoardQuery(boardId!, {
    skip: !boardId, // don't fetch if no boardId yet
    refetchOnMountOrArgChange: false, // don't refetch if already cached
  });
  const { user } = useSelector((state: RootState) => state.auth);
  const isAdmin = data?.data.members.some(
    (m) => m.user === user?._id && m.role === "admin"
  );
  const [removing, setRemoving] = useState(false);
  const removeMember = async (memberId: string[]) => {
    try {
      setRemoving(true);
      await editCard({
        cardId: card._id,
        workspaceId: workspaceId!,
        boardId: boardId!,
        removeMembers: memberId,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setRemoving(false);
    }
  };
  return (
    <div
      data-ignore-click-outside="true"
      className="absolute -left-10 w-80 rounded bg-[#282E33] p-4 shadow-2xl text-white z-30"
    >
      <DropdownHeader headerText="Members" />
      <input
        type="text"
        placeholder="Search members"
        value={search}
        onChange={handleChange}
        className="w-full bg-[#2a2d31] my-10 text-white border border-[#3a3d42] rounded px-3 py-2 mb-4 outline-none focus:ring-1 focus:ring-blue-500"
      />
      <h1 className="text-textP  mb-4 font-charlie-text-r">Card Members</h1>
      <div className="">
        {card &&
          card.members.length > 0 &&
          card.members.map((c) =>
            typeof c === "object" &&
            c !== null &&
            "_id" in c &&
            "username" in c &&
            "profilePicture" in c ? (
              <div
                key={c._id}
                className=" flex gap-2 items-center justify-between "
              >
                <div className=" flex gap-2 items-center my-2">
                  <img
                    src={c.profilePicture}
                    alt={c.username}
                    className="size-9 rounded-2xl object-cover"
                  />
                  <h1 className="text-textP text-xl font-charlie-text-r">
                    {c.username}
                  </h1>
                </div>
                {isAdmin && user?._id !== c._id && (
                  <UserMinus
                    className="text-red-500 cursor-pointer"
                    size={18}
                    onClick={() => {
                      removeMember([c._id]);
                    }}
                  />
                )}
              </div>
            ) : null
          )}
      </div>
    </div>
  );
};

export default AddMembers;
