import { ArrowDown, Search, Star } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import Dropdown from "./Dropdown";

const Sidebar = () => {
  const [isBarOpen, setIsBarOpened] = useState(false);
  return (
    <>
   <div className="mob-bar block relative w-full lg:hidden  bg-[#1D2125] " style={{zIndex:10000000}}>
  <button
    onClick={() => setIsBarOpened(!isBarOpen)}
    className="w-full flex items-center justify-between text-xl font-charlie-display-sm border-b-2 border-black py-2 px-4 cursor-pointer text-gray-200"
  >
    View all links
    <span>
      <ArrowDown />
    </span>
  </button>

  <div
    className={`absolute left-0 top-full w-full bg-[#1D2125] text-gray-200 shadow-2xl overflow-hidden transition-all duration-300 ease-in-out ${
      isBarOpen ? "min-h-[500px] opacity-100" : "max-h-0 opacity-0"
    }`}
    style={{ zIndex: 999324 }}
  >
    <Dropdown />
  </div>
</div>

      <div className="min-h-screen hidden lg:flex flex-col gap-3 text-white/80 text-lg ">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-2 text-gray-200 border border-gray-200 rounded"
          />
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-200">
            <Search size={20} />
          </span>
        </div>
        <NavLink
          to="/feature/power-ups/featured"
          className={({ isActive }) =>
            `text-lg ${
              isActive ? "text-blue-primary underline underline-offset-4" : ""
            }`
          }
        >
          <span className="flex items-center gap-1">
            <Star className="inline mr-1" size={16} />
            Featured
          </span>
        </NavLink>
        <NavLink
          to="/feature/power-ups/automation"
          className={({ isActive }) =>
            `${isActive ? "text-primary underline underline-offset-4" : ""}`
          }
        >
          <span className="flex items-center gap-1 text-sm">Automation</span>
        </NavLink>
        <NavLink
          to="/feature/power-ups/analytics-reporting"
          className={({ isActive }) =>
            `${isActive ? "text-primary underline underline-offset-4" : ""}`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            Analytics & reporting
          </span>
        </NavLink>
        <NavLink
          to="/feature/power-ups/developer-tools"
          className={({ isActive }) =>
            `${isActive ? "text-primary underline underline-offset-4" : ""}`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            Developer Tools
          </span>
        </NavLink>
        <NavLink
          to="/feature/power-ups/board-utilities"
          className={({ isActive }) =>
            `${isActive ? "text-primary underline underline-offset-4" : ""}`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            Board Utilities
          </span>
        </NavLink>
        <NavLink
          to="/feature/power-ups/hr-operations"
          className={({ isActive }) =>
            `${isActive ? "text-primary underline underline-offset-4" : ""}`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            HR & Operations
          </span>
        </NavLink>
        <NavLink
          to="/feature/power-ups/project-management"
          className={({ isActive }) =>
            `${isActive ? "text-primary underline underline-offset-4" : ""}`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            IT & project management
          </span>
        </NavLink>
      </div>
    </>
  );
};

export default Sidebar;
