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
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("nature");
  const observer = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    setPageNumber(1);
    setImages([]);
    setHasMore(true);
  }, [searchTerm]);

  const lastElemRef = useCallback<(node: HTMLDivElement | null) => void>(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      }, {
        rootMargin: "50px",
        threshold: 0.1
      });
      
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      if (!searchTerm.trim()) return;
      
      try {
        setIsLoading(true);
        const response = await axios.get(
          "https://api.unsplash.com/search/photos",
          {
            params: {
              query: searchTerm || "nature",
              per_page: 20,
              page: pageNumber,
            },
            headers: {
              Authorization: `Client-ID ${import.meta.env.VITE_CLIENT_ID}`,
            },
            signal,
          }
        );

        if (!isMounted.current) return;

        setImages(prev => 
          pageNumber === 1
            ? response.data.results
            : [...prev, ...response.data.results]
        );

        setHasMore(response.data.results.length > 0);
      } catch (err) {
        if (!axios.isCancel(err)){
          setError("Failed to fetch images");
          console.error(err);
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };

    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(delayDebounce);
    };
  }, [searchTerm, pageNumber]);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  if (error) {
    return (
      <div className="px-2 z-[99900999] shadow-2xl h-[32rem] bg-[#282E33] absolute top-18 left-138 border-gray-700 border-2 w-[22.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
        Sorry couldn't fetch images
      </div>
    );
  }

  return (
    <div className="px-2 z-[99900999] shadow-2xl h-[24rem] lg:h-[32rem] rounded bg-[#282E33] absolute top-44 lg:top-18 left-24 lg:left-138 border-gray-700 border-2 w-[22.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
      <div className="flex items-center justify-between p-2">
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
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="block p-2 bg-[#22272B] text-textP/60 w-full border-1 border-[#22272B]/50 focus:outline-1"
      />
      
      <div>
        {isLoading && pageNumber === 1 ? (
          <div>
            <ImageSkeleton />
          </div>
        ) : (
          <>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 p-1 my-4">
                {images.map((image, idx) => (
                  <Images
                    image={image}
                    key={`${image.id}-${idx}`}
                    ref={images.length === idx + 1 ? lastElemRef : null}
                  />
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-10 text-3xl font-charlie-display-sm">
                {searchTerm ? "No images found" : "Type to search images"}
              </h1>
            )}
            
            {isLoading && pageNumber > 1 && (
              <div className="flex justify-center py-4">
                <div className="animate-pulse">Loading more images...</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ImagesPopUp;