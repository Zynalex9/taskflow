import { Link, NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import NavBarFeatures from "./dropdowns/Features";
import Solutions from "./dropdowns/Solutions";

const NavBar = () => {
  const [openFeatures, setOpenFeatures] = useState(false);
  const [openSolutions, setOpenSolutions] = useState(false);
  const [openResources, setOpenResources] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);

  const handleFeatures = () => {
    setOpenSolutions(false);
    setOpenResources(false);
    setOpenPlans(false);
    setOpenFeatures(!openFeatures);
  };

  const handleSolutions = () => {
    setOpenSolutions(!openSolutions);
    setOpenResources(false);
    setOpenPlans(false);
    setOpenFeatures(false);
  };

  const handleResources = () => {
    setOpenSolutions(false);
    setOpenResources(!openResources);
    setOpenPlans(false);
    setOpenFeatures(false);
  };

  const handlePlans = () => {
    setOpenSolutions(false);
    setOpenResources(false);
    setOpenPlans(!openPlans);
    setOpenFeatures(false);
  };

  return (
    <div className="shadow-2xl flex items-center justify-between w-full h-16 p-2 relative font-charlie-text-r">
      <div className="logo">
        <Link to={"/"}>
          <h1 className="text-primary text-4xl font-poppins">TaskFlow</h1>
        </Link>
      </div>
      <div className="links hidden lg:flex lg:gap-4 lg:ml-8">
        <div className="flex justify-center items-center  ">
          <NavLink
            to="/features"
            className={({ isActive }) =>
              `flex items-center space-x-1 ${
                isActive ? "underline underline-offset-4 text-blue-600" : ""
              }`
            }
          >
            <span>Features</span>
          </NavLink>
          <button className="cursor-pointer" onClick={handleFeatures}>
            {openFeatures ? (
              <ChevronUp size={12} color="#000" />
            ) : (
              <ChevronDown size={12} color="#000" />
            )}
          </button>

          <div
            className={`absolute top-0 left-0 w-[100vw] z-50 transition-all duration-300 ease-in-out transform bg-white ${
              openFeatures
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
            }`}
          >
            <NavBarFeatures />
          </div>
        </div>
        <div className="">
          <div className="flex">
          <NavLink
            to="/solutions"
            className={({ isActive }) =>
              `flex items-center space-x-1 ${
                isActive ? "underline underline-offset-4 text-blue-600" : ""
              }`
            }
          >
            <span>Solutions</span>
          </NavLink>
          <button className="cursor-pointer" onClick={handleSolutions}>
              <ChevronDown size={12} color="#000" />
            </button>
            </div>
          <div
            className={`absolute top-15 left-0 w-full transition-all duration-300 ease-in-out
            transform ${
              openSolutions
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
            }`}
          >
            <Solutions />
          </div>
        </div>
        <NavLink
          to="/plans"
          className={({ isActive }) =>
            `flex items-center space-x-1 ${
              isActive ? "underline underline-offset-4 text-blue-600" : ""
            }`
          }
        >
          <span>Plans</span>
          <ChevronDown size={12} color="#000" />
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
          <ChevronDown size={12} color="#000" />
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
