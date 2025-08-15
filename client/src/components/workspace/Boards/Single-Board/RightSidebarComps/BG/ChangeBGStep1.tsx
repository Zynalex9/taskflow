import CustomBorder from "@/components/resuable/CustomBorder";
import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useUpdateBoardCoverMutation } from "@/store/myApi";
import { LoaderCircle, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const ChangeBGStep1 = ({ goTo }: { goTo: (param: string) => void }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [updateCover] = useUpdateBoardCoverMutation();
  const { board } = useSingleBoardContext();
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    const formData = new FormData();
    try {
      setIsLoading(true);
      formData.append("image", file ?? new Blob(), file?.name || "image.png");
      await updateCover({
        boardId: board._id,
        cover: formData,
      }).unwrap();
    } catch (error: any) {
      toast.error(error.data.message || "Error uploading image");
    } finally {
      setIsLoading(false);
      event.target.value = "";
    }
  };
  return (
    <div>
      <div className="flex items-center w-full justify-center gap-4 px-2 py-1 rounded-lg shadow-md">
        <div
          className="flex flex-col items-center gap-2"
          onClick={() => goTo("bg-images")}
        >
          <div
            className="h-32 w-32 rounded-lg shadow-md"
            style={{
              backgroundImage: `url(https://trello.com/assets/8f9c1323c9c16601a9a4.jpg)`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <h1>Photos</h1>
        </div>
        <div
          className="flex flex-col items-center gap-2"
          onClick={() => goTo("bg-colors")}
        >
          <div
            className="h-32 w-32 rounded-lg shadow-md"
            style={{
              backgroundImage: `url(https://trello.com/assets/97db30fe74a58b7b7a18.png)`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
          ></div>
          <h1>Colors</h1>
        </div>
      </div>
      <CustomBorder />
      <div className="flex flex-col justify-center">
        <label htmlFor="customImageUpload">
          <div
            className={`mt-4 rounded-lg h-40 w-32 flex items-center justify-center bg-gray-600 ${
              isLoading ? "transition-all duration-150 opacity-50" : ""
            } cursor-pointer hover:bg-gray-500 transition-colors`}
          >
            {isLoading ? <LoaderCircle className="animate-spin" /> : <Plus />}
          </div>
        </label>
        <h1>Custom</h1>
        <input
          id="customImageUpload"
          type="file"
          accept="image/*"
          className="hidden"
          disabled={isLoading}
          onChange={handleUpload}
        />
      </div>
    </div>
  );
};
