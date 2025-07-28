import { RootState } from "@/store/store";
import { useAddWorkspaceMemberMutation } from "@/store/workspace.members.api";
import { IUser } from "@/types/functionalites.types";
import axios from "axios";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
interface ApiResponse {
  data: IUser;
  message: string;
  status: string;
  success: boolean;
}
export const AddMembersInput = () => {
  const [searchValue, setSearchValue] = useState("");
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<string>("");
  const [loading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [responsedReturned, setResponsedReturned] = useState(false);
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const [addMember] = useAddWorkspaceMemberMutation();
  const handleSearch = async () => {
    try {
      setIsLoading(true);
      console.log("sending request with searchValue:", searchValue);
      if (!searchValue.trim()) return;
      const response = await axios.get<ApiResponse>(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/user/${searchValue}/find-by-identifier`
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
  const handleAddMember = async () => {
    if (selectedMember && workspace) {
      const body = {
        workspaceId: workspace._id,
        memberCredentials: selectedMember,
      };
      try {
        setIsAdding(true);
        await addMember(body).unwrap();
        setSearchValue("");
        toast.success("Member added successfully!");
        setSelectedMember("");
        setIsSelected(false);
        setApiResponse(null);
      } catch (error: any) {
        toast.error(error.data.message);
      } finally {
        setIsAdding(false);
      }
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
        <div className="relative w-full">
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search a Taskflow user"
            className="w-full px-10 py-1.5 ring-1 ring-blue-600 rounded-md text-textP my-4 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          {searchValue && (
            <X
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 cursor-pointer"
              onClick={() => {
                setSearchValue("");
                setSelectedMember("");
                setIsSelected(false);
                setApiResponse(null);
                setResponsedReturned(false);
              }}
            />
          )}
        </div>
        <button
          onClick={handleAddMember}
          disabled={!selectedMember || isAdding}
          type="button"
          className={
            "bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors" +
            (isAdding || !selectedMember
              ? " opacity-50 cursor-not-allowed"
              : "")
          }
        >
          Add
        </button>
        {searchValue && (
          <div className="absolute shadow-2xl top-14 left-0 w-[59rem] bg-fprimary  rounded border border-textP/40">
            {loading ? (
              <h1 className="text-xl">Searching...</h1>
            ) : apiResponse?.success ? (
              <div
                className={`flex items-center curso gap-2 px-1.5 py-1 rounded ${
                  selectedMember === apiResponse.data._id ? "bg-gray-500" : ""
                }`}
                onClick={() => {
                  if (!isSelected) {
                    setSelectedMember(apiResponse.data._id);
                    setIsSelected(true);
                  } else {
                    setSelectedMember("");
                    setIsSelected(false);
                  }
                }}
              >
                <img
                  src={apiResponse.data.profilePicture}
                  alt="profile-picture"
                  className="size-6 rounded-full object-cover object-center"
                />
                <p className="text-textP text-md font-charlie-text-r">
                  {apiResponse.data.username}
                </p>
              </div>
            ) : responsedReturned ? (
              <div className="text-center text-textP p-2">No user found</div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};
