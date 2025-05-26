import axios from "axios";
import { useEffect, useState } from "react";
import Images from "./Images";
import ImageSkeleton from "@/components/Skeletons/ImageSkeleton";

const ImagesPopUp = () => {
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("nature");
  const fetchImages = async (query: string) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        "https://api.unsplash.com/search/photos",
        {
          params: {
            query: query,
            per_page: 20,
          },
          headers: {
            Authorization:
              "Client-ID _uof60J_1T_CUCL2xBa9Wmr0_cCd4wuqMDOUJGXPrA0",
          },
        }
      );
      setImages(response.data.results);
    } catch (err) {
      setError("Failed to fetch images");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchImages(searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);
  useEffect(() => {
    fetchImages(searchTerm);
  }, []);
  useEffect(() => {
    console.log(images);
  }, [images]);
  if (error) {
    <div className="px-2 z-[99900999] shadow-2xl h-[32rem] rounded-xl bg-[#282E33] absolute top-18 left-138 border-gray-700 border-2 w-[22.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
      Sorry couldn't fetch images
    </div>;
  }
  return (
    <div className="px-2 z-[99900999] shadow-2xl h-[32rem] rounded-xl bg-[#282E33] absolute top-18 left-138 border-gray-700 border-2 w-[22.5rem] overflow-y-scroll custom-scrollbar text-textP font-charlie-text-r">
      <h1 className="text-center my-4">
        Images from
        <a
          href={"https://unsplash.com/"}
          target="_blank"
          className="text-blue-500"
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
          <Images ImgArray={images} />
        )}
      </div>
    </div>
  );
};

export default ImagesPopUp;
