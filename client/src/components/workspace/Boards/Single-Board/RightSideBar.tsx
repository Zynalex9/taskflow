import { useEffect } from "react";
import ShareComp from "./RightSidebarComps/Share";
import AboutBoard from "./RightSidebarComps/AboutBoard";
import Visibility from "./RightSidebarComps/Visibility";
import ExportsComp from "./RightSidebarComps/Exports/ExportsComp";
import StarComp from "./RightSidebarComps/StarComp";
import { X } from "lucide-react";

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
      className={`fixed z-[999999] px-4  right-0 top-0 transition-opacity duration-300 ease-in-out transform bg-[#282E33] w-[20rem] h-[89.8vh] overflow-y-auto text-textP font-charlie-text-r ${
        openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between w-full my-2">
        <div></div>
        <h2>Menu</h2>
        <X size={18} onClick={() => setOpenSideBar(false)} />
      </div>
      <ShareComp />
      <div className="border border-gray-500 "></div>
      <AboutBoard />
      <Visibility />
      <ExportsComp />
      <StarComp />
    </div>
  );
};

export default RightSideBar;
