import {
  changeSelectedColor,
  closeMore,
  closeMoreColors,
} from "@/store/BoardBGSlice";
import { AppDispatch, RootState } from "@/store/store";
import { ArrowLeft, Check, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";

const ColorsPopUp = () => {
  const firstColors = [
    {
      title: "White",
      hex: "linear-gradient(90deg,rgba(25, 184, 247, 1) 0%, rgba(38, 51, 166, 1) 50%, rgba(40, 50, 71, 1) 100%)",
    },
    {
      title: "White",
      hex: "#E2EDFD",
    },
    {
      title: "White",
      hex: "linear-gradient(90deg,rgba(42, 123, 155, 1) 0%, rgba(87, 199, 133, 1) 50%, rgba(237, 221, 83, 1) 100%)",
    },
    {
      title: "White",
      hex: "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)",
    },
    {
      title: "White",
      hex: "linear-gradient(90deg,rgba(15, 181, 247, 1) 0%, rgba(9, 207, 230, 1) 50%, rgba(47, 115, 90, 1) 100%)",
    },
    {
      title: "White",
      hex: "linear-gradient(141deg,rgba(219, 237, 59, 1) 0%, rgba(75, 191, 114, 1) 100%)",
    },
  ];
  const secondColors = [
    {
      title: "White",
      hex: "#FC8F54",
    },
    {
      title: "White",
      hex: "#36BA98",
    },
    {
      title: "White",
      hex: "#F3CA52",
    },
    {
      title: "White",
      hex: "#4ED7F1",
    },
    {
      title: "White",
      hex: "#FFB100",
    },
    {
      title: "White",
      hex: "#ADCF9F",
    },
  ];
  const dispatch = useDispatch<AppDispatch>();
  const { selectedColor } = useSelector(
    (state: RootState) => state.boardModalControll
  );
  return (
    <div className="z-[99900999] top-44 lg:top-18 left-24 lg:left-138 h-[24rem] lg:h-[32rem] custom-scrollbar rounded-xl bg-[#282E33] absolute  border-gray-700 border-2 w-[22.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
      <div className="flex items-center justify-between p-2">
        <ArrowLeft onClick={() => dispatch(closeMoreColors())} />
        <X onClick={() => dispatch(closeMore())} />
      </div>
      <div className="w-[95%] mx-auto">
        <div className="flex items-center justify-center mt-4">
          <div className="flex flex-wrap gap-2">
            {firstColors.map((color) => (
              <div
                key={color.title}
                onClick={() => dispatch(changeSelectedColor(color.hex))}
                style={{ background: color.hex }}
                className={`h-24 w-26 p-4 rounded-sm object-cover flex items-center justify-center text-black`}
              >
                <Check
                  className={`${
                    color.hex == selectedColor ? "block" : "hidden"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="border-1 border-gray-400 my-4"></div>
        <div className="flex items-center justify-center mt-4">
          <div className="flex flex-wrap gap-2">
            {secondColors.map((color) => (
              <div
                key={color.title}
                onClick={() => dispatch(changeSelectedColor(color.hex))}
                style={{ background: color.hex }}
                className={`h-24 w-26 p-4 rounded-sm object-cover cursor-pointer flex items-center justify-center text-black`}
              >
                <Check
                  className={`${
                    color.hex == selectedColor ? "block" : "hidden"
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorsPopUp;
