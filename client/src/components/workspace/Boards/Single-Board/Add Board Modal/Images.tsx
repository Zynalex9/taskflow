import { changeSelectedImg } from "@/store/BoardBGSlice";
import { useDispatch } from "react-redux";

interface IProps {
  id: string;
  urls: {
    full: string;
    raw: string;
    regular: string;
    small: string;
  };
  slug: string;
  alt_description: string;
}

interface Data {
  ImgArray: IProps[];
}

const Images = ({ ImgArray }: Data) => {
  const dispatch = useDispatch();
  return (
    <div className="grid grid-cols-2 gap-2 p-1 my-4">
      {ImgArray.map((i) => (
        <div key={i.id} className="aspect-square overflow-hidden rounded">
          <img
            onClick={() => dispatch(changeSelectedImg(i.urls.full))}
            src={i.urls.small}
            alt={i.alt_description || "Unsplash image"}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default Images;
