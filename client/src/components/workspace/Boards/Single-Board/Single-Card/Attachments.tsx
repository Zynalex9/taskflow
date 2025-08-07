import { MoveUpRight, Paperclip, Trash } from "lucide-react";
import { IAttachment } from "../../../../../types/functionalites.types";
import { formatDistanceToNow } from "date-fns";
import { useDeleteAttachmentMutation } from "@/store/cardApi";
import { toast } from "react-toastify";
import { useCardSocketInvalidate } from "@/hooks/useSocketInvalidate";
import { useParams } from "react-router-dom";

interface AttachmentsProps {
  Attachment: IAttachment[];
}
const Attachments: React.FC<AttachmentsProps> = ({ Attachment }) => {
  const {workspaceId} = useParams()
  const [deleteAttachment] = useDeleteAttachmentMutation();

  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      const response = await deleteAttachment({
        attachmentId,
        cardId: Attachment[0].cardId,
        workspaceId:workspaceId!
      }).unwrap();
      toast.success(response.message, { theme: "dark" });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to delete attachment", {
        theme: "dark",
      });
    }
  };

  useCardSocketInvalidate({
    eventName: "attachmentDeleted",
    id: Attachment[0].cardId,
  });

  return (
    <div className="my-3">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <Paperclip className="text-textP" />
          <h1 className="text-textP font-charlie-text-sb text-xl">
            Attachments
          </h1>
        </div>
        <button className="px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC]">
          Add
        </button>
      </div>
      <div className="pl-10">
        <h3 className="text-textP text-md my-3">Files</h3>
        {[...Attachment].reverse().map((a) => (
          <div className="flex justify-between items-center my-4">
            <div className="flex gap-2 items-center">
              <img
                src={a.fileUrl}
                alt=""
                className="w-30 h-20 shadow-2xl object-cover border-2 border-fprimary/60 rounded"
              />
              <div>
                <h1 className="text-textP text-xl font-charlie-display-sm truncate w-2xs">
                  {a.filename}
                </h1>
                <h3 className="text-textP/90 text-sm font-charlie-text-r">
                  {formatDistanceToNow(new Date(a.createdAt), {
                    addSuffix: true,
                  })}
                </h3>
              </div>
            </div>
            <div className="flex gap-2 ">
              <a
                href={a.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-pointer text-textP"
              >
                <MoveUpRight size={16} />
              </a>
              <button className="cursor-pointer text-textP">
                <Trash
                  className="text-red-500"
                  size={16}
                  onClick={() => handleDeleteAttachment(a._id)}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Attachments;
