import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useEffect } from "react";

const Layout = () => {
  useEffect(() => {
    document.documentElement.classList.add("dark");

    return () => {
      document.documentElement.classList.remove("dark");
    };
  }, []);

  return (
    <div className="w-full  bg-[#1D2125] min-h-screen flex max-lg:flex-col lg:items-start text-white font-charlie-text-r">
      <div className="w-full lg:w-[20%]  sticky top-[1px] lg:p-4">
        <Sidebar />
      </div>
      <div className="w-full max-lg:mt-20 lg:w-[80%] p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
