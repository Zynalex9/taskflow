import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useUpdateBoardCoverMutation } from "@/store/myApi";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const BGColors = () => {
  const [updateCover] = useUpdateBoardCoverMutation();
  const [selectedColor, setSelectedColor] = useState("");
  const [loadingColor, setLoadingColor] = useState(""); 
  const { board } = useSingleBoardContext();

  const updateCoverColor = async (color: string) => {
    try {
      setLoadingColor(color);
      await updateCover({
        boardId: board._id,
        cover: color,
      }).unwrap();
      toast.success("Cover updated!");
    } catch (error: any) {
      toast.error(error?.data?.message || "Error updating cover color");
    } finally {
      setLoadingColor("");
      setSelectedColor("");
    }
  };

  useEffect(() => {
    if (selectedColor) {
      updateCoverColor(selectedColor);
    }
  }, [selectedColor]);

  const firstColors = [
    {
      id: 1,
      hex: "linear-gradient(90deg,rgba(25, 184, 247, 1) 0%, rgba(38, 51, 166, 1) 50%, rgba(40, 50, 71, 1) 100%)",
    },
    { id: 2, hex: "#E2EDFD" },
    {
      id: 3,
      hex: "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)",
    },
    {
      id: 4,
      hex: "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)",
    },
    {
      id: 5,
      hex: "linear-gradient(90deg,rgba(15, 181, 247, 1) 0%, rgba(9, 207, 230, 1) 50%, rgba(47, 115, 90, 1) 100%)",
    },
    {
      id: 6,
      hex: "linear-gradient(141deg,rgba(219, 237, 59, 1) 0%, rgba(75, 191, 114, 1) 100%)",
    },
  ];

  const secondColors = [
    { id: 1, hex: "#FC8F54" },
    { id: 2, hex: "#36BA98" },
    { id: 3, hex: "#F3CA52" },
    { id: 4, hex: "#4ED7F1" },
    { id: 5, hex: "#FFB100" },
    { id: 6, hex: "#ADCF9F" },
  ];

  const renderColorBox = (color: string) => (
    <div
      key={color}
      onClick={() => !loadingColor && setSelectedColor(color)}
      style={{ background: color }}
      className={`relative h-20 w-20 rounded-md cursor-pointer flex items-center justify-center border transition ${
        loadingColor === color
          ? "opacity-70 pointer-events-none"
          : "hover:scale-105"
      }`}
    >
      {loadingColor === color && (
        <Loader2 className="w-6 h-6 animate-spin text-white" />
      )}
    </div>
  );

  return (
    <div className="pb-4">
      <div className="w-[95%] mx-auto">
        <div className="flex items-center justify-center mt-4">
          <div className="flex flex-wrap gap-3">
            {firstColors.map((c) => renderColorBox(c.hex))}
          </div>
        </div>
        <div className="border-t border-gray-400 my-6"></div>
        <div className="flex items-center justify-center mt-4">
          <div className="flex flex-wrap gap-3">
            {secondColors.map((c) => renderColorBox(c.hex))}
          </div>
        </div>
      </div>
    </div>
  );
};
