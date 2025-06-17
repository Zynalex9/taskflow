import { useEffect } from "react";
import ShareComp from "./RightSidebarComps/Share";

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
      onClick={() => setOpenSideBar(false)}
      className={`fixed z-[999999]  right-0 top-0 transition-opacity duration-300 ease-in-out transform bg-[#282E33] w-[20rem] h-[89.8vh]  overflow-y-auto ${
        openSidebar ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <ShareComp />
      <div className="border border-gray-500 mx-5"></div>
    </div>
  );
};

export default RightSideBar;
