import CustomBorder from "@/components/resuable/CustomBorder";
import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { AlignLeft, User2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAddBoardDescriptionMutation } from "@/store/myApi";
import { toast } from "react-toastify";

export const AboutPanel = () => {
  const { board } = useSingleBoardContext();
  const [description, setDescription] = useState(board.description);
  const [addDesc, setAddDesc] = useState(false);
  const [addDescription] = useAddBoardDescriptionMutation();
  const handleDescription = async () => {
    try {
      if (description === "") return;
      await addDescription({ description, boardId: board._id });
    } catch (error) {
      toast.error("Error adding description", { theme: "dark" });
    } finally {
      setAddDesc(false);
    }
  };
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
              <h1 className="text-lg text-gray-400 font-charlie-text-r underline font-medium">
                {member.firstName} {member.secondName}
              </h1>
              <h1 className="text-sm text-textP underline">
                @{member.username}
              </h1>
            </div>
          </div>
        ))}
        <CustomBorder />
        <div>
          <div className="flex gap-1 items-center">
            <AlignLeft />
            <h2>Description</h2>
          </div>

          {addDesc ? (
            <div className="grid w-full gap-2">
              <Textarea
                placeholder="Type your message here."
                className="h-44 mt-4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button onClick={handleDescription}>Add Description</Button>
            </div>
          ) : (
            <div
              className="grid w-full gap-2 bg-gray-600 rounded h-44 mt-4 p-2 cursor-pointer"
              onClick={() => setAddDesc(true)}
            >
              <h1 className="">
                {description ? description : "Click here to add description"}
              </h1>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
