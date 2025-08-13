import { RootState } from "@/store/store";
import { UserPlus } from "lucide-react";
import { useSelector } from "react-redux";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCallback, useRef, useState } from "react";
import { ProfileCard } from "./ProfileCard";
import { useClickOutside } from "@/Context/useRefContext";
import { ToastContainer } from "react-toastify";
import { ShareDialogContent } from "@/components/resuable/ShareDialogContent";

const ShareComp = () => {
  const profileCardRef = useRef<HTMLElement>(null);
  const handleClickOutside = useCallback(() => {
    setShowCard(false);
  }, []);
  useClickOutside(profileCardRef, handleClickOutside);
  const { user } = useSelector((state: RootState) => state.auth);
  const [showCard, setShowCard] = useState(false);
  return (
    <div className="text-textP flex w-full justify-between items-center pt-2 pb-1">
      <Dialog>
        <DialogTrigger>
          <div className="flex items-center gap-2">
            <UserPlus className="inline" size={18} />

            <h1 className="text-sm font-charlie-text-r">Share</h1>
          </div>
        </DialogTrigger>

        <DialogContent
          data-ignore-click-outside="true"
          className="bg-fprimary text-textP border-none"
        >
          <ShareDialogContent />
        </DialogContent>
      </Dialog>
      <div>
        <img
          src={user?.profilePicture}
          alt="Profile Picture"
          className="size-9 rounded-full object-cover object-center "
          onClick={(e) => {
            e.stopPropagation();
            setShowCard(!showCard);
          }}
        />
        <div
          ref={profileCardRef}
          className="absolute shadow-2xl top-12 left-0 w-4/5 z-100"
        >
          {showCard && <ProfileCard setShowCard={setShowCard} />}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default ShareComp;
