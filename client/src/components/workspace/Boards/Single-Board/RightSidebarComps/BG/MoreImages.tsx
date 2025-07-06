import axios from "axios";
import { useEffect, useState } from "react";
import Images, { ImageProps } from "../../Add Board Modal/Images";
import ImageSkeleton from "@/components/Skeletons/ImageSkeleton";

export const MoreImages = () => {
  const [searchTerm, setSearchTerm] = useState("nature");
  const [pageNumber, setPageNumber] = useState(1);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const controller = new AbortController();
  const fetchImages = async () => {
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
          signal: controller.signal,
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to fetch images");
      }
      console.log("Response data:", response.data.results);
      setImages((prev) =>
        pageNumber === 1
          ? response.data.results
          : [...prev, ...response.data.results]
      );
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setIsLoading(false);
      setHasMore(images.length > 0);
    }
  };
  useEffect(() => {
    fetchImages();
    const delayDebounce = setTimeout(() => {
      fetchImages();
    }, 500);
    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [searchTerm, pageNumber]);
  return (
    <div>
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
        className="block p-2 bg-[#22272B] text-textP/60 w-full border-1 border-[#22272B]/50 focus:outline-none focus:border-blue-500 rounded-md mb-4"
      />
      <div className="w-full">
        {isLoading && pageNumber === 1 ? (
          <div>
            <ImageSkeleton />
          </div>
        ) : (
          <>
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 p-1 my-4">
                {images.map((image, idx) => (
                  <Images image={image} key={`${image.id}-${idx}`} />
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
