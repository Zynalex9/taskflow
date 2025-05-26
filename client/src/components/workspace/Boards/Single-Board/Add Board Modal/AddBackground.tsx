import {
  changeSelectedColor,
  changeSelectedImg,
  closeMore,
  openMore,
} from "@/store/BoardBGSlice";
import { AppDispatch, RootState } from "@/store/store";
import { Ellipsis, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";


const AddBackground = () => {
  const firstImages = [
    {
      title: "custom-image",
      src: "https://trello-backgrounds.s3.amazonaws.com/SharedBackground/2560x1707/c176ec219cc71b83695da82802ab31a7/photo-1742156345582-b857d994c84e.webp",
    },
    {
      title: "custom-image",
      src: "https://images.unsplash.com/photo-1468618367903-e50d699d4f78?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "custom-image",
      src: "https://images.unsplash.com/photo-1433838552652-f9a46b332c40?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "custom-image",
      src: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  const firstColors = [
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
      hex: "linear-gradient(90deg,rgba(25, 184, 247, 1) 0%, rgba(38, 51, 166, 1) 50%, rgba(40, 50, 71, 1) 100%)",
    },
    {
      title: "White",
      hex: "radial-gradient(circle,rgba(238, 174, 202, 1) 0%, rgba(148, 187, 233, 1) 100%)",
    },
  ];
  const dispatch = useDispatch<AppDispatch>();
  const { showMore } = useSelector(
    (state: RootState) => state.boardModalControll
  );
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {firstImages.map((img) => (
          <img
            src={img.src}
            alt={img.title}
            onClick={() => dispatch(changeSelectedImg(img.src))}
            className="h-9 w-18 rounded-sm object-cover"
          />
        ))}
      </div>
      <div className="flex gap-2">
        {firstColors.map((color) => (
          <div
            onClick={() => dispatch(changeSelectedColor(color.hex))}
            style={{ background: color.hex }}
            className={`h-9 w-18 p-4 rounded-sm object-cover`}
          ></div>
        ))}
        {showMore ? (
          <button
            className="bg-gray-500/60 rounded cursor-pointer hover:bg-gray-500 px-1 py-0.5"
            onClick={() => dispatch(closeMore())}
          >
            <X size={16} />
          </button>
        ) : (
          <button
            className="bg-gray-500/60 rounded cursor-pointer hover:bg-gray-500 px-1 py-0.5"
            onClick={() => dispatch(openMore())}
          >
            <Ellipsis size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AddBackground;
