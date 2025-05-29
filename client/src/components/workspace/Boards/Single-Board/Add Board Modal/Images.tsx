import { forwardRef } from 'react';
import { changeSelectedImg } from "@/store/BoardBGSlice";
import { useDispatch } from "react-redux";

export interface ImageProps {
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
  image: ImageProps;
}

const Images = forwardRef<HTMLDivElement, Data>(({ image }, ref) => {
  const dispatch = useDispatch();
  
  return (
    <div 
      ref={ref}
      key={image.id} 
      className="aspect-square overflow-hidden rounded"
    >
      <img
        onClick={() => dispatch(changeSelectedImg(image.urls.full))}
        src={image.urls.small}
        alt={image.alt_description || "Unsplash image"}
        className="h-full w-full object-cover"
      />
    </div>
  );
});

Images.displayName = 'Images';

export default Images;