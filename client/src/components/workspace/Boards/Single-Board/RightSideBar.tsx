import { useEffect } from "react";
import ShareComp from "./RightSidebarComps/Share";
import AboutBoard from "./RightSidebarComps/AboutBoard";
import Visibility from "./RightSidebarComps/Visibility";
import ExportsComp from "./RightSidebarComps/Exports/ExportsComp";
import StarComp from "./RightSidebarComps/StarComp";
import { Copy, Eye, ListCollapse, Minus, X } from "lucide-react";
import SettingsComp from "./RightSidebarComps/Settings/SettingsComp";
import ChangeBG from "./RightSidebarComps/BG/ChangeBG";
import CustomBorder from "@/components/resuable/CustomBorder";

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
  return (
    <div
      className={`fixed z-[999999] px-4  right-0 top-15 transition-opacity duration-300 ease-in-out transform bg-[#282E33] w-[20rem] h-[78vh] custom-scrollbar overflow-y-auto text-textP font-charlie-text-r ${
        openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between w-full my-2">
        <div></div>
        <h2>Menu</h2>
        <X size={18} onClick={() => setOpenSideBar(false)} />
      </div>
      <ShareComp />
      <CustomBorder />

      <AboutBoard />
      <Visibility />
      <ExportsComp />
      <StarComp />
      <CustomBorder customStyles="mt-2" />
      <SettingsComp />
      <ChangeBG />
      <CustomBorder customStyles="mt-2" />
      <div className="mt-4    text-sm flex items-center gap-6">
        <Eye size={18} />
        <h2 className="">Watch</h2>
      </div>
      <div className="mt-4    text-sm flex items-center gap-6">
        <ListCollapse size={18} />
        <h2 className="">Collapse All</h2>
      </div>
      <div className="mt-4    text-sm flex items-center gap-6">
        <Copy size={18} />
        <h2 className="">Copy Board</h2>
      </div>
      <div className="mt-4    text-sm flex items-center gap-6">
        <Minus size={18} />
        <h2 className="">Close Board</h2>
      </div>
    </div>
  );
};

export default RightSideBar;
