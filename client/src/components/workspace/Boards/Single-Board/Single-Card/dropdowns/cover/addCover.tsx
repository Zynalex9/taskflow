import DropdownHeader from "../../DropdownHeader";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { closeAllDropDown } from "@/store/CardModalStatesSlice";
import { useUploadCardCoverMutation } from "@/store/cardApi";

const AddCover = ({ cardId }: { cardId: string }) => {
  const [loading, setLoading] = useState(false);
  const [addCover] = useUploadCardCoverMutation();
  const dispatch = useDispatch<AppDispatch>();
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formdata = new FormData();
    formdata.append("cardCover", file);
    formdata.append("cardId", cardId);
    try {
      setLoading(true);
      await addCover(formdata).unwrap();
      toast.success("Cover added successfully", { theme: "dark" });
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
      dispatch(closeAllDropDown());
    }
  };
  if (loading)
    return (
      <div className="relative w-72 h-52 bg-[#282E33]/60 rounded overflow-hidden">
        <Skeleton className="absolute inset-0 skeleton-shimmer  bg-[#282E33]/60" />
      </div>
    );

  return (
    <div className="absolute top-2 left-2 w-72 rounded bg-[#282E33] p-4 shadow-2xl text-white z-30">
      <DropdownHeader headerText="Add a cover" />
      <h1 className="text-textP text-center font-charlie-text-r text-sm my-2">
        Add an image from your computer
      </h1>
      <div className="bg-[#B6C2CF]/20 rounded hover:bg-[#B6C2CF]/10 w-full my-4 p-2">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddCover;
