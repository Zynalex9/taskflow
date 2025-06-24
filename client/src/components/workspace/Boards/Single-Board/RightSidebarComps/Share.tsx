import { RootState } from "@/store/store";
import { Link, UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { IUser } from "@/types/functionalites.types";
import axios from "axios";
interface ApiResponse {
  data: IUser;
  message: string;
  status: string;
  success: boolean;
}
const ShareComp = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [responsedReturned, setResponsedReturned] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
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
  useEffect(() => {
    console.log("apiResponse", apiResponse);
  }, [apiResponse]);
  return (
    <div className="text-textP flex w-full justify-between items-center pt-2 pb-1">
      <Dialog>
        <DialogTrigger>
          <div className="flex items-center gap-2">
            <UserPlus className="inline" size={18} />

            <h1 className="text-sm font-charlie-text-r">Share</h1>
          </div>
        </DialogTrigger>

        <DialogContent className="bg-fprimary text-textP border-none">
          <DialogHeader>
            <DialogTitle>Share Board</DialogTitle>
            <div className="relative">
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="Enter the email of taskflow member"
                  className="w-4/5 p-2 rounded bg-fprimary border border-textP/40 text-textP placeholder:text-textP/20 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => setSearchValue(e.target.value)}
                  value={searchValue}
                />
                <button
                  disabled={loading}
                  className="bg-blue-primary px-2 py-2 text-black rounded border-black border-1"
                >
                  Share
                </button>
              </div>
              {searchValue.trim() && (
                <div className="absolute shadow-2xl top-12 left-0 w-4/5 bg-fprimary p-2 rounded border border-textP/40">
                  {loading ? (
                    <div>Searching...</div>
                  ) : apiResponse?.success ? (
                    <div>{apiResponse.data.username}</div>
                  ) : responsedReturned ? (
                    <div>No user found</div>
                  ) : null}
                </div>
              )}
            </div>

            <DialogDescription className="text-textP/70">
              Share this board with your team members by entering their email
              addresses. They will receive an invitation to join the board.
            </DialogDescription>
            <div className="flex items-center gap-2 mt-4">
              <Link
                className="bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 p-2 rounded text-textP"
                size={32}
              />
              <div>
                <h2 className="text-sm text-textP font-charlie-text-sb">
                  Share this board with a link
                </h2>
                <button className="text-blue-primary">Create link</button>
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <img
        src={user?.profilePicture}
        alt="Profile Picture"
        className="size-9 rounded-full object-cover object-center "
      />
    </div>
  );
};

export default ShareComp;
