import { ICard } from "@/types/functionalites.types";
import DropdownHeader from "../../DropdownHeader";
import { ChangeEvent, useState } from "react";
interface Props {
  card: ICard;
}
const AddMembers = ({ card }: Props) => {
  const [search, setSearch] = useState("");
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  return (
    <div className="absolute -left-10 w-80 rounded bg-[#282E33] p-4 shadow-2xl text-white z-30">
      <DropdownHeader headerText="Members" />
      <input
        type="text"
        placeholder="Search members"
        value={search}
        onChange={handleChange}
        className="w-full bg-[#2a2d31] my-10 text-white border border-[#3a3d42] rounded px-3 py-2 mb-4 outline-none focus:ring-1 focus:ring-blue-500"
      />
      <h1 className="text-textP  mb-4 font-charlie-text-r">Card Members</h1>
      <div className="space-y-2">
        {card &&
          card.members.length > 0 &&
          card.members.map((c) =>
            typeof c === "object" &&
            c !== null &&
            "_id" in c &&
            "username" in c &&
            "profilePicture" in c ? (
              <div key={c._id} className="my-0.5 flex gap-2 items-center">
                <img
                  src={c.profilePicture}
                  alt={c.username}
                  className="size-6 rounded-2xl object-cover"
                />
                <h1 className="text-textP font-charlie-text-r">{c.username}</h1>
              </div>
            ) : null
          )}
      </div>
    </div>
  );
};

export default AddMembers;
