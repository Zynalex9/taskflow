import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useUpdateBoardCoverMutation } from "@/store/myApi";
import { useEffect, useState } from "react";

export const BGColors = () => {
  const [updateCover] = useUpdateBoardCoverMutation();
  const [selectedColor, changeSelectedColor] = useState("");
  const { board } = useSingleBoardContext();
  const updateCoverColor = async (color: string) => {
    try {
      await updateCover({
        boardId: board._id,
        cover: color,
      }).unwrap();
      changeSelectedColor(color);
    } catch (error) {
      console.error("Error updating cover color:", error);
    }
  };
  useEffect(() => {
    updateCoverColor(selectedColor);
  }, [selectedColor]);
  const firstColors = [
    {
      id: 1,
      title: "White",
      hex: "linear-gradient(90deg,rgba(25, 184, 247, 1) 0%, rgba(38, 51, 166, 1) 50%, rgba(40, 50, 71, 1) 100%)",
    },
    {
      id: 2,
      title: "White",
      hex: "#E2EDFD",
    },
    {
      id: 3,
      title: "White",
      hex: "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)",
    },
    {
      id: 4,
      title: "White",
      hex: "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)",
    },
    {
      id: 5,
      title: "White",
      hex: "linear-gradient(90deg,rgba(15, 181, 247, 1) 0%, rgba(9, 207, 230, 1) 50%, rgba(47, 115, 90, 1) 100%)",
    },
    {
      id: 6,
      title: "White",
      hex: "linear-gradient(141deg,rgba(219, 237, 59, 1) 0%, rgba(75, 191, 114, 1) 100%)",
    },
  ];

  const secondColors = [
    {
      id: 1,
      title: "White",
      hex: "#FC8F54",
    },
    {
      id: 2,
      title: "White",
      hex: "#36BA98",
    },
    {
      id: 3,
      title: "White",
      hex: "#F3CA52",
    },
    {
      id: 4,
      title: "White",
      hex: "#4ED7F1",
    },
    {
      id: 5,
      title: "White",
      hex: "#FFB100",
    },
    {
      id: 6,
      title: "White",
      hex: "#ADCF9F",
    },
  ];

  return (
    <div className="pb-4">
      <div className="w-[95%] mx-auto">
        <div className="flex items-center justify-center mt-4">
          <div className="flex flex-wrap gap-2">
            {firstColors.map((color) => (
              <div
                key={color.hex}
                onClick={() => {
                  changeSelectedColor(color.hex);
                }}
                style={{ background: color.hex }}
                className={`h-24 w-22 p-4 rounded-sm object-cover flex items-center justify-center text-black`}
              ></div>
            ))}
          </div>
        </div>
        <div className="border-1 border-gray-400 my-4"></div>
        <div className="flex items-center justify-center mt-4">
          <div className="flex flex-wrap gap-2">
            {secondColors.map((color) => (
              <div
                key={color.hex}
                onClick={() => changeSelectedColor(color.hex)}
                style={{ background: color.hex }}
                className={`h-24 w-22 p-4 rounded-sm object-cover cursor-pointer flex items-center justify-center text-black`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
