import { IUser } from "@/types/functionalites.types";
import axios from "axios";
import { useEffect, useState } from "react";
interface ApiResponse {
  data: IUser;
  message: string;
  status: string;
  success: boolean;
}
export const AddMembersInput = () => {
  const [searchValue, setSearchValue] = useState("");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [loading, setIsLoading] = useState(false);
  const [responsedReturned, setResponsedReturned] = useState(false);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      console.log("sending request with searchValue:", searchValue);
      if (!searchValue.trim()) return;
      const response = await axios.get<ApiResponse>(
        `${import.meta.env.VITE_BASE_URL}/api/user/${searchValue}/find-by-email`
      );
      if (response.data.success) {
        setApiResponse(response.data);
      }
    } catch (error) {
      console.error("Error searching for user:", error);
      setApiResponse(null);
    } finally {
      setIsLoading(false);
      setResponsedReturned(true);
    }
  };
  useEffect(() => {
    if (!searchValue.trim()) {
      setResponsedReturned(false);
      setApiResponse(null);
      return;
    }
    const timer = setTimeout(() => {
      handleSearch();
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchValue]);
  return (
    <div>
      <p className="text-textP text-xl py-2 font-charlie-text-r text-center">
        Add Members
      </p>
      <div className="flex items-center gap-2 relative">
        <input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search a Taskflow user"
          className="w-full px-2 py-1.5 ring-1 ring-blue-600 rounded-md text-textP my-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Add
        </button>
        {searchValue && (
          <div className="absolute shadow-2xl top-14 left-0 w-[59rem] bg-fprimary p-2 rounded border border-textP/40">
            {loading ? (
              <div>Searching...</div>
            ) : apiResponse?.success ? (
              <div className={`flex items-center curso gap-2`}>
                <img
                  src={apiResponse.data.profilePicture}
                  alt="profile-picture"
                  className="size-6 rounded-full object-cover object-center"
                />
                <p className="text-textP text-md font-charlie-text-r">{apiResponse.data.username}</p>
              </div>
            ) : responsedReturned ? (
              <div>No user found</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
