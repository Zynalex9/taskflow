import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { User2 } from "lucide-react";

export const AboutPanel = () => {
  const { board } = useSingleBoardContext();
  return (
    <div>
      <div className="flex flex-col gap-4 px-2 py-1  rounded-lg shadow-md">
        <div className="text-lg font-semibold flex items-center gap-3">
          <User2 size={18} />
          <h1>Board Members</h1>
        </div>
        {board.membersData.map((member) => (
          <div key={member._id} className="flex items-center gap-2 p-2">
            <img
              src={member.profilePicture}
              alt={member.firstName}
              className="w-12 h-12 rounded-full object-cover shadow-sm"
            />
            <div>
              <h1 className="text-md font-medium">
                {member.firstName} {member.secondName}
              </h1>
              <h1 className="text-textP text-sm">@{member.username}</h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
