import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Images, { ImageProps } from "./Images";
import ImageSkeleton from "@/components/Skeletons/ImageSkeleton";
import { ArrowLeft, X } from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { closeMore, closeMoreImgs } from "@/store/BoardBGSlice";

const ImagesPopUp = () => {
  const [images, setImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasmore] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("nature");
  const observer = useRef<IntersectionObserver | null>(null);


  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm]);

  const lastElemRef = useCallback<(node: HTMLDivElement | null) => void>(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  const fetchImages = async (query: string, page: number) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query: query,
            per_page: 20,
            page: page,
          },
          headers: {
            Authorization: `Client-ID ${import.meta.env.VITE_CLIENT_ID}`,
          },
        }
      );
      setImages(prev =>
        page === 1 ? response.data.results : [...prev, ...response.data.results]
      );
    } catch (err) {
      setError("Failed to fetch images");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

const [defaultSearch] = useState("nature"); 

useEffect(() => {
  const delayDebounce = setTimeout(() => {
    if (searchTerm.trim() !== "") {
      fetchImages(searchTerm, 1);
    } else {
      fetchImages(defaultSearch, 1);
    }
  }, 500);

  return () => clearTimeout(delayDebounce);
}, [searchTerm, pageNumber]);

  useEffect(() => {
    fetchImages(searchTerm, 1);
  }, []);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    console.log(images);
    if (images.length > 0) {
      setHasmore(true);
    } else {
      setHasmore(false);
    }
  }, [images]);
  const dispatch = useDispatch<AppDispatch>();
  if (error) {
    <div className="px-2 z-[99900999] shadow-2xl h-[32rem] bg-[#282E33] absolute top-18 left-138 border-gray-700 border-2 w-[22.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
      Sorry couldn't fetch images
    </div>;
  }
  return (
    <div className="px-2 z-[99900999] shadow-2xl h-[24rem] lg:h-[32rem] rounded bg-[#282E33] absolute top-44 lg:top-18 left-24 lg:left-138 border-gray-700 border-2 w-[22.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
      <div className="flex items-center justify-between  p-2">
        <ArrowLeft onClick={() => dispatch(closeMoreImgs())} />
        <X onClick={() => dispatch(closeMore())} />
      </div>
      <h1 className="text-center my-4">
        Images from
        <a
          href={"https://unsplash.com/"}
          target="_blank"
          className="text-blue-500 pl-0.5"
        >
          Unsplash
        </a>
      </h1>
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block p-2 bg-[#22272B] text-textP/60 w-full border-1 border-[#22272B]/50 focus:outline-1"
      />
      <div>
        {isLoading ? (
          <div>
            <ImageSkeleton />
          </div>
        ) : (
          <>
            {images && images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 p-1 my-4">
                {images &&
                  images.length > 0 &&
                  images.map((image: ImageProps, idx: number) => {
                    if (images.length === idx + 1) {
                      return (
                        <Images
                          image={image}
                          key={image.id}
                          ref={lastElemRef}
                        />
                      );
                    }
                    return <Images image={image} key={image.id} />;
                  })}
              </div>
            ) : (
              <h1 className="text-center mt-10 text-3xl font-charlie-display-sm">
                Sorry No Images found
              </h1>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImagesPopUp;
