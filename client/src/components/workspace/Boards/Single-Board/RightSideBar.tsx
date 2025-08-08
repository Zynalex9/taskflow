import { useCallback, useEffect, useRef, useState } from "react";
import ShareComp from "./RightSidebarComps/Share";
import AboutBoard from "./RightSidebarComps/AboutBoard";
import Visibility from "./RightSidebarComps/Visibility";
import ExportsComp from "./RightSidebarComps/Exports/ExportsComp";
import StarComp from "./RightSidebarComps/StarComp";
import { Eye, X } from "lucide-react";
import SettingsComp from "./RightSidebarComps/Settings/SettingsComp";
import ChangeBG from "./RightSidebarComps/BG/ChangeBG";
import CustomBorder from "@/components/resuable/CustomBorder";
import { useClickOutside } from "@/Context/useRefContext";
import { PanelView } from "./RightSidebarComps/Panel/PanelView";
import { useSingleBoardContext } from "@/Context/SingleBoardContext";
import { CopyBoardPopover } from "./RightSidebarComps/CopyBoardPopover";
import { CloseBoard } from "./RightSidebarComps/CloseBoard";
import { useBoardSocketsInvalidate } from "@/hooks/useBoardSocketsInvalidate";

interface IProps {
  setOpenSideBar: React.Dispatch<React.SetStateAction<boolean>>;
  openSidebar: boolean;
}

const RightSideBar = ({ openSidebar, setOpenSideBar }: IProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "BracketRight" || e.key === "]") {
        e.preventDefault();
        setOpenSideBar((prev) => !prev);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { board } = useSingleBoardContext();
  const [activePanel, setActivePanel] = useState<null | string>(null);
  const handleClickOutside = useCallback(() => {
    setOpenSideBar(false);
  }, []);
  useClickOutside(sidebarRef, handleClickOutside);
  useBoardSocketsInvalidate({ eventName: "boardUpdated", id: board._id?? "" });
  return (
    <div
      ref={sidebarRef}
      className={`fixed z-[100] px-2 top-30 overflow-x-hidden pb-3 right-0  transition-opacity duration-300 ease-in-out transform bg-[#282E33] w-[20rem] h-[72vh] custom-scrollbar text-textP font-charlie-text-r ${
        openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {activePanel === null ? (
        <div className="custom-scrollbar px-4 overflow-y-auto h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between w-full my-2">
            <div></div>
            <h2>Menu</h2>
            <X size={18} onClick={() => setOpenSideBar(false)} />
          </div>

          <ShareComp />
          <CustomBorder />

          <div onClick={() => setActivePanel("about")}>
            <AboutBoard />
          </div>

          <div className="z-[102]">
            <Visibility />
          </div>

          <div>
            <ExportsComp boardId={board._id}/>
          </div>

          <StarComp />

          <CustomBorder customStyles="mt-2" />

          <div onClick={() => setActivePanel("settings")}>
            <SettingsComp />
          </div>

          <div onClick={() => setActivePanel("bg")}>
            <ChangeBG />
          </div>

          <CustomBorder customStyles="mt-2" />

          <div className="mt-4 flex items-center gap-6 hover:bg-gray-700 p-1 rounded-md transition-colors duration-150 cursor-pointer">
            <Eye size={18} />
            <h2>Watch</h2>
          </div>

          <div>
            <CopyBoardPopover />
          </div>
          <div>
            <CloseBoard />
          </div>
        </div>
      ) : (
        <PanelView
          panel={activePanel}
          goBack={() => setActivePanel(null)}
          goToPanel={(param: string) => setActivePanel(param)}
        />
      )}
    </div>
  );
};

export default RightSideBar;
