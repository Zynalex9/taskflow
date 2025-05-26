import { changeSelectedColor } from "@/store/BoardBGSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

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
const MoreColors = () => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div>
      <div className="flex items-center justify-between text-textP font-charlie-text-r">
        <h1 className="text-md text-center mb-2">Colors</h1>
        <button className=" px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 shadow-2xl text-[#B3BFCC]">
          See more
        </button>
      </div>
      <div className="flex items-center justify-center mt-4">
        <div className="flex flex-wrap gap-2">
          {firstColors.map((color) => (
            <div
              onClick={() => dispatch(changeSelectedColor(color.hex))}
              style={{ background: color.hex }}
              className={`h-9 w-21 p-4 rounded-sm object-cover`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoreColors;
