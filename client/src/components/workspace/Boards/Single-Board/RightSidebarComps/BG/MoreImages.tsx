import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { ImageProps } from "../../Add Board Modal/Images";
import ImageSkeleton from "@/components/Skeletons/ImageSkeleton";
import { useUpdateBoardCoverMutation } from "@/store/myApi";
import { useSingleBoardContext } from "@/Context/SingleBoardContext";

export const MoreImages = () => {
  const [selectedImage, setSelectedImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState("nature");
  const [pageNumber, setPageNumber] = useState(1);
  const [images, setImages] = useState<ImageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const controller = new AbortController();
  const { board } = useSingleBoardContext();
  const [updateCover] = useUpdateBoardCoverMutation();
  const handleUpload = async (imageUrl: string) => {
    try {
      await updateCover({
        boardId: board._id,
        cover: imageUrl,
      }).unwrap();
      setSelectedImage("");
      setUploadingImage(false);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  useEffect(() => {
    setPageNumber(1);
    setImages([]);
    setHasMore(true);
    setIsLoading(true);
  }, [searchTerm]);
  const lastElemRef = useCallback<(node: HTMLDivElement | null) => void>(
    (node) => {
      if (isLoading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setPageNumber((prev) => prev + 1);
          }
        },
        {
          rootMargin: "50px",
          threshold: 0.1,
        }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );
  const fetchImages = async () => {
    if (!searchTerm.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

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

      setImages((prev) =>
        pageNumber === 1
          ? response.data.results
          : [...prev, ...response.data.results]
      );

      setHasMore(response.data.results.length > 0);
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("Request canceled:", err.message);
      } else {
        console.error("Error fetching images:", err);
      }
    } finally {
      setIsLoading(false);
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
  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
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
                  <div
                    ref={idx === images.length - 1 ? lastElemRef : null}
                    key={image.id}
                    className="aspect-square overflow-hidden rounded"
                  >
                    <img
                      onClick={() => {
                        setSelectedImage(image.urls.full);
                        setUploadingImage(true);
                        handleUpload(image.urls.full);
                      }}
                      src={image.urls.small}
                      alt={image.alt_description || "Unsplash image"}
                      className={`h-full w-full object-cover ${
                        uploadingImage && selectedImage === image.urls.full
                          ? "opacity-50  transition-opacity duration-300"
                          : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <h1 className="text-center mt-10 text-3xl font-charlie-display-sm custom-scrollbar">
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
