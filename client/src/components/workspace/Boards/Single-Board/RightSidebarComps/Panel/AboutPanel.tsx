import CustomBorder from "@/components/resuable/CustomBorder";
import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { AlignLeft, Trash, User2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAddBoardDescriptionMutation } from "@/store/myApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export const AboutPanel = () => {
  const { board } = useSingleBoardContext();
  const [description, setDescription] = useState(board.description);
  const [loading, setLoading] = useState(false);
  const [addDesc, setAddDesc] = useState(false);
  const [addDescription] = useAddBoardDescriptionMutation();
  const { user } = useSelector((state: RootState) => state.auth);
  const handleDescription = async () => {
    try {
      if (description === "") return;
      setLoading(true);
      await addDescription({ description, boardId: board._id }).unwrap();
    } catch (error: any) {
      toast.error(error.data.message || "Error adding description");
      setDescription(board.description);
    } finally {
      setLoading(false);
      setAddDesc(false);
    }
  };
  const myRole = board.members.find((m) => m.user === user?._id)?.role;
  return (
    <div>
      <div className="flex flex-col gap-4 px-2 py-1  rounded-lg shadow-md">
        <div className="text-lg font-semibold flex items-center gap-3">
          <User2 size={18} />
          <h1>Board Members</h1>
        </div>
        <div className="h-36 overflow-y-auto custom-scrollbar">
          {board.members.map((member) => (
            <div
              key={member._id}
              className="flex items-center justify-between "
            >
              <div className="flex items-center gap-2 p-2">
                <img
                  src={member.profilePicture}
                  alt={member.firstName}
                  className="w-12 h-12 rounded-full object-cover shadow-sm"
                />
                <div>
                  <h1 className="text-lg text-gray-400 font-charlie-text-r underline font-medium">
                    {member.firstName} {member.secondName}{" "}
                    <span className="text-xs text-gray-500">
                      ({member.role})
                    </span>
                  </h1>
                  <h1 className="text-sm text-textP underline">
                    @{member.username}
                  </h1>
                </div>
              </div>
              <div>
                {myRole === "admin" && member.role !== "admin" && (
                  <Trash size={18} className="text-red-500 mx-1" />
                )}
              </div>
            </div>
          ))}
        </div>
        <CustomBorder />
        <div>
          <div className="flex gap-1 items-center">
            <AlignLeft />
            <h2>Description</h2>
          </div>

          {addDesc ? (
            <div className="grid w-full mb-4 gap-2">
              <Textarea
                placeholder="Type your message here."
                className="h-44 mt-4"
                value={description}
                disabled={loading}
                onChange={(e) => setDescription(e.target.value)}
              />
              <Button disabled={loading} onClick={handleDescription}>
                {loading ? "Adding..." : "Add Description"}
              </Button>
            </div>
          ) : (
            <div
              className="grid w-full gap-2 bg-gray-600 rounded h-44 my-4 p-2 cursor-pointer"
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
