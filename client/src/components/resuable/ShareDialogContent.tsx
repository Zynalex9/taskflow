import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { useAddBoardMemberMutation } from "@/store/myApi";
import { RootState } from "@/store/store";
import { IUser } from "@/types/functionalites.types";
import axios from "axios";
import { CheckCircle, Link } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

interface ApiResponse {
  data: IUser;
  message: string;
  status: string;
  success: boolean;
}

export const ShareDialogContent = () => {
  const [searchValue, setSearchValue] = useState("");
  const [loading, setIsLoading] = useState(false);
  const [loadingLink, setIsLoadingLink] = useState(false);
  const [responsedReturned, setResponsedReturned] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [linkCreated, setLinkCreated] = useState<boolean>(false);
  const [inviteLink, setInviteLink] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);
  const { board } = useSingleBoardContext();
  const [selectedMember, setSelectedMember] = useState<string[]>([]);
  const [addMember] = useAddBoardMemberMutation();

  const { workspace } = useSelector((state: RootState) => state.workspace);
  const handleCopy = async () => {
    try {
      if (!inviteLink) {
        toast.error("No link to copy");
        return;
      }
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy text");
    }
  };

  const handleLink = async () => {
    try {
      setIsLoadingLink(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/generate-share-link`,
        {
          entityId: board._id,
          entityType: "board",
          boardId: board._id,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setInviteLink(
          `${import.meta.env.VITE_CLIENT_URL}/join/${workspace?._id}/${
            board._id
          }/${response.data.data.inviteLink}`
        );
        setLinkCreated(true);
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Error creating link");
    } finally {
      setIsLoadingLink(true);
    }
  };

  const handleSearch = async () => {
    try {
      setIsLoading(true);
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
    const body = {
      boardId: board._id,
      targetedId: selectedMember[0],
      workspaceId: board.workspace,
    };
    try {
      setIsLoading(true);
      await addMember(body).unwrap();
      setSearchValue("");
      toast.success("Member added successfully!");
      setSelectedMember([]);
      setApiResponse(null);
    } catch (error: any) {
      toast.error(error.data.message);
    } finally {
      setIsLoading(false);
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
            onClick={handleAddMember}
            className="bg-blue-primary px-2 py-2 text-black rounded cursor-pointer border-black border-1"
          >
            {loading ? "Adding" : "Add"}{" "}
          </button>
        </div>
        {searchValue.trim() && (
          <div className="absolute shadow-2xl top-10 left-0 w-4/5 bg-fprimary p-2 rounded border border-textP/40">
            {loading ? (
              <div>Searching...</div>
            ) : apiResponse?.success ? (
              <div
                className={`flex items-center gap-2 cursor-pointer ${
                  selectedMember?.includes(apiResponse.data._id)
                    ? "bg-gray-500 p-2"
                    : ""
                }`}
                onClick={() => {
                  setSelectedMember((prev) => {
                    if (prev.includes(apiResponse.data._id)) return prev;
                    return [...prev, apiResponse.data._id];
                  });
                }}
              >
                <img
                  src={apiResponse.data.profilePicture}
                  alt="profile"
                  className="size-6 rounded-full object-cover object-center"
                />
                {apiResponse.data.username}
              </div>
            ) : responsedReturned ? (
              <div>No user found</div>
            ) : null}
          </div>
        )}
      </div>

      <DialogDescription className="text-textP/70">
        Share this board with your team members by entering their email
        addresses or creating an invite link.
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
          {linkCreated ? (
            <div className="flex gap-4">
              <button
                onClick={handleCopy}
                className="text-blue-primary cursor-pointer underline text-sm"
              >
                {copied ? (
                  <div className="flex gap-1 items-center">
                    <p>Text Copied</p>
                    <CheckCircle size={14} />
                  </div>
                ) : (
                  "Copy Link"
                )}
              </button>
              <button
                onClick={() => {
                  setLinkCreated(false);
                  setInviteLink("");
                }}
                className="text-blue-primary cursor-pointer underline text-sm"
              >
                Delete Link
              </button>
            </div>
          ) : (
            <button
              disabled={loadingLink}
              onClick={handleLink}
              className={`text-blue-primary cursor-pointer underline text-sm ${
                loadingLink ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loadingLink ? "Creating link..." : " Create link"}
            </button>
          )}
        </div>
      </div>
    </DialogHeader>
  );
};
