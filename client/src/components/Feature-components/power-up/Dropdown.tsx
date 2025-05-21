import { Search, Star } from "lucide-react";
import { NavLink } from "react-router-dom";

type DropdownProps = {
  setIsBarOpened: (open: boolean) => void;
};

const Dropdown = ({ setIsBarOpened }: DropdownProps) => {
  return (
    <div className="space-y-5">
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
      <div className="flex flex-col gap-8 items-center">
        <NavLink
          to="/feature/power-ups/featured"
          onClick={() => setIsBarOpened(false)}
          className={({ isActive }) =>
            `text-lg ${
              isActive ? "text-blue-primary  underline underline-offset-4" : ""
            }`
          }
        >
          <span className="flex items-center gap-1">
            <Star className="inline mr-1" size={16} />
            Featured
          </span>
        </NavLink>
        <NavLink
          onClick={() => setIsBarOpened(false)}
          to="/feature/power-ups/automation"
          className={({ isActive }) =>
            `${
              isActive ? "text-blue-primary  underline underline-offset-4" : ""
            }`
          }
        >
          <span className="flex items-center gap-1 text-sm">Automation</span>
        </NavLink>
        <NavLink
          onClick={() => setIsBarOpened(false)}
          to="/feature/power-ups/analytics-reporting"
          className={({ isActive }) =>
            `${
              isActive ? "text-blue-primary  underline underline-offset-4" : ""
            }`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            Analytics & reporting
          </span>
        </NavLink>
        <NavLink
          onClick={() => setIsBarOpened(false)}
          to="/feature/power-ups/developer-tools"
          className={({ isActive }) =>
            `${
              isActive ? "text-blue-primary  underline underline-offset-4" : ""
            }`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            Developer Tools
          </span>
        </NavLink>
        <NavLink
          onClick={() => setIsBarOpened(false)}
          to="/feature/power-ups/board-utilities"
          className={({ isActive }) =>
            `${
              isActive ? "text-blue-primary  underline underline-offset-4" : ""
            }`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            Board Utilities
          </span>
        </NavLink>
        <NavLink
          onClick={() => setIsBarOpened(false)}
          to="/feature/power-ups/hr-operations"
          className={({ isActive }) =>
            `${
              isActive ? "text-blue-primary  underline underline-offset-4" : ""
            }`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            HR & Operations
          </span>
        </NavLink>
        <NavLink
          onClick={() => setIsBarOpened(false)}
          to="/feature/power-ups/project-management"
          className={({ isActive }) =>
            `${
              isActive ? "text-blue-primary  underline underline-offset-4" : ""
            }`
          }
        >
          <span className="flex items-center gap-1 text-sm">
            IT & project management
          </span>
        </NavLink>
      </div>
    </div>
  );
};

export default Dropdown;
