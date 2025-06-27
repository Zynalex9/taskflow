import { useCallback, useEffect, useRef, useState } from "react";
import ShareComp from "./RightSidebarComps/Share";
import AboutBoard from "./RightSidebarComps/AboutBoard";
import Visibility from "./RightSidebarComps/Visibility";
import ExportsComp from "./RightSidebarComps/Exports/ExportsComp";
import StarComp from "./RightSidebarComps/StarComp";
import { Copy, Eye, ListCollapse, Minus, X } from "lucide-react";
import SettingsComp from "./RightSidebarComps/Settings/SettingsComp";
import ChangeBG from "./RightSidebarComps/BG/ChangeBG";
import CustomBorder from "@/components/resuable/CustomBorder";
import { useClickOutside } from "@/Context/useRefContext";
import { PanelView } from "./RightSidebarComps/Panel/PanelView";

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
  const [activePanel, setActivePanel] = useState<null | string>(null);
  const handleClickOutside = useCallback(() => {
    setOpenSideBar(false);
  }, []);
  useClickOutside(sidebarRef, handleClickOutside);
  return (
    <div
      ref={sidebarRef}
      className={`fixed z-[999999] px-4 pb-3 right-0 top-15 transition-opacity duration-300 ease-in-out transform bg-[#282E33] w-[20rem] h-[78vh] custom-scrollbar overflow-y-auto text-textP font-charlie-text-r ${
        openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {activePanel === null ? (
        <>
          {/* Sidebar header */}
          <div className="flex items-center justify-between w-full my-2">
            <div></div>
            <h2>Menu</h2>
            <X size={18} onClick={() => setOpenSideBar(false)} />
          </div>

          {/* Sidebar menu items */}
          <ShareComp />
          <CustomBorder />

          <div onClick={() => setActivePanel("about")}>
            <AboutBoard />
          </div>

          <div onClick={() => setActivePanel("visibility")}>
            <Visibility />
          </div>

          <div onClick={() => setActivePanel("exports")}>
            <ExportsComp />
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

          <div className="mt-4 text-sm flex items-center gap-6">
            <Eye size={18} />
            <h2>Watch</h2>
          </div>
          <div className="mt-4 text-sm flex items-center gap-6">
            <ListCollapse size={18} />
            <h2>Collapse All</h2>
          </div>
          <div className="mt-4 text-sm flex items-center gap-6">
            <Copy size={18} />
            <h2>Copy Board</h2>
          </div>
          <div className="mt-4 text-sm flex items-center gap-6">
            <Minus size={18} />
            <h2>Close Board</h2>
          </div>
        </>
      ) : (
        <PanelView panel={activePanel} goBack={() => setActivePanel(null)} />
      )}
    </div>
  );
};

export default RightSideBar;
