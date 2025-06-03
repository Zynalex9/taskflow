import DropdownHeader from "../../DropdownHeader";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast, ToastContainer } from "react-toastify";
import { useAddAttachmentMutation } from "@/store/cardApi";

const AddAttachment = ({ cardId }: { cardId: string }) => {
  const [loading, setLoading] = useState(false);
  const [AddAttachment] = useAddAttachmentMutation();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      await AddAttachment({ uploadedFile: file, cardId }).unwrap();
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };
  if (loading)
    return (
      <div>
        <Skeleton className="w-72 h-52 bg-[#282E33]" />
      </div>
    );
  return (
    <div className="absolute top-2 left-2 w-72 rounded bg-[#282E33] p-4 shadow-2xl text-white z-30">
      <DropdownHeader headerText="Add an attachment" />
      <h1 className="text-textP text-center font-charlie-text-r text-sm my-2">
        Add a file from your computer
      </h1>
      <div className="bg-[#B6C2CF]/20 rounded hover:bg-[#B6C2CF]/10 w-full my-4 p-2">
        <input type="file" onChange={handleFileChange} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddAttachment;
