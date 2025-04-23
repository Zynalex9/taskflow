import { Link, NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import NavBarFeatures from "./dropdowns/Features";
const NavBar = () => {
  const [openFeatures, setOpenFeatures] = useState<Boolean>(false);
  const [openSolutions, setOpenSolutions] = useState<Boolean>(false);
  const [openResources, setOpenResources] = useState<Boolean>(false);
  const [openPlans, setOpenPlans] = useState<Boolean>(false);
  return (
    <div className="shadow-2xl flex items-center justify-between w-full h-16 p-2">
      <div className="logo">
        <Link to={"/"}>
          <h1 className="text-primary text-4xl font-poppins">TaskFlow</h1>
        </Link>
      </div>
      <div className="links hidden lg:flex lg:gap-4 lg:ml-8">
        <div className=" group">
          <NavLink
            to="/features"
            className={({ isActive }) =>
              `flex items-center space-x-1 ${
                isActive ? "underline underline-offset-4 text-blue-600" : ""
              }`
            }
          >
            <span>Features</span>
            <button className="cursor-pointer">
              {openFeatures ? (
                <ChevronDown
                  size={20}
                  color="#000"
                  onClick={() => setOpenFeatures(!openFeatures)}
                />
              ) : (
                <ChevronUp
                  size={20}
                  color="#000"
                  onClick={() => setOpenFeatures(!openFeatures)}
                />
              )}
            </button>
          </NavLink>
          {openFeatures ? <NavBarFeatures /> : ""}
        </div>
        <NavLink
          to="/solutions"
          className={({ isActive }) =>
            `flex items-center space-x-1 ${
              isActive ? "underline underline-offset-4 text-blue-600" : ""
            }`
          }
        >
          <span>Solutions</span>
          <ChevronDown size={20} color="#000" />
        </NavLink>
        <NavLink
          to="/plans"
          className={({ isActive }) =>
            `flex items-center space-x-1 ${
              isActive ? "underline underline-offset-4 text-blue-600" : ""
            }`
          }
        >
          <span>Plans</span>
          <ChevronDown size={20} color="#000" />
        </NavLink>
        <NavLink
          to="/pricing"
          className={({ isActive }) =>
            `flex items-center space-x-1 ${
              isActive ? "underline underline-offset-4 text-blue-600" : ""
            }`
          }
        >
          <span>Pricing</span>
        </NavLink>
        <NavLink
          to="/resources"
          className={({ isActive }) =>
            `flex items-center space-x-1 ${
              isActive ? "underline underline-offset-4 text-blue-600" : ""
            }`
          }
        >
          <span>Resources</span>
          <ChevronDown size={20} color="#000" />
        </NavLink>
      </div>
      <div className="buttons ml-auto flex gap-4">
        <button className="font-poppins cursor-pointer">Login</button>
        <button className="cursor-pointer bg-primary py-4 px-2 mx-1 text-white">
          Get Taskflow for Free
        </button>
      </div>
    </div>
  );
};

export default NavBar;
