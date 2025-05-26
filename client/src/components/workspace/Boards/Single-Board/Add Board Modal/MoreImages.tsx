import { changeSelectedImg } from "@/store/BoardBGSlice";
import { AppDispatch } from "@/store/store";
import { useDispatch } from "react-redux";

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
  {
    title: "custom-image",
    src: "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    title: "custom-image",
    src: "https://images.unsplash.com/photo-1501446690852-da55df7bfe07?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const MoreImages = () => {
const dispatch = useDispatch<AppDispatch>()
    return (
    <div>
      <h1 className="text-sm text-center mb-2 font-charlie-display-sm text-textP">
        Board Backgrounds
      </h1>
      <div className="flex items-center justify-between text-textP font-charlie-text-r">
        <h1 className="text-md text-center mb-2">Photos</h1>
        <button className=" px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 shadow-2xl text-[#B3BFCC]">
          See more
        </button>
      </div>
      <div className="flex items-center justify-center mt-4">
      <div className="flex flex-wrap gap-2">
        {firstImages.map((img) => (
          <img
            src={img.src}
            alt={img.title}
            onClick={() => dispatch(changeSelectedImg(img.src))}
            className="h-14 w-21 rounded-sm object-cover"
          />
        ))}
      </div>
      </div>
    </div>
  );
};

export default MoreImages;
