import { Link, NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NavBarFeatures from "./dropdowns/Features";
import Solutions from "./dropdowns/Solutions";
import Plans from "./dropdowns/Plans";

const NavBar = () => {
  const [openFeatures, setOpenFeatures] = useState(false);
  const [openSolutions, setOpenSolutions] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const plansRef = useRef<HTMLDivElement | null>(null);

  const handleFeatures = () => {
    setOpenSolutions(false);
    setOpenPlans(false);
    setOpenFeatures(!openFeatures);
  };

  const handleSolutions = () => {
    setOpenSolutions(!openSolutions);
    setOpenPlans(false);
    setOpenFeatures(false);
  };

  const handlePlans = () => {
    setOpenSolutions(false);
    setOpenPlans(!openPlans);
    setOpenFeatures(false);
  };

  console.log(featuresRef)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (featuresRef.current && !featuresRef.current.contains(event.target as Node)) {
        setOpenFeatures(false);
      }
      if (solutionsRef.current && !solutionsRef.current.contains(event.target as Node)) {
        setOpenSolutions(false);
      }
      if (plansRef.current && !plansRef.current.contains(event.target as Node)) {
        setOpenPlans(false);
      }
    
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={navRef}
      className=" bg-white shadow-xl z-10 flex items-center justify-between w-full h-16 p-2  font-charlie-text-r"
    >
      <div className="logo">
        <Link to={"/"}>
          <h1 className="text-primary text-4xl font-poppins">TaskFlow</h1>
        </Link>
      </div>
      <div className="links hidden lg:flex lg:gap-4 lg:ml-8">
        <div className="flex justify-center items-center" ref={featuresRef}>
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
            className={`absolute top-16 left-0 w-[100vw] z-50 transition-all duration-300 ease-in-out transform bg-white ${
              openFeatures
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
            }`}
          >
            <NavBarFeatures />
          </div>
        </div>

        <div className="flex" ref={solutionsRef}>
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
          <div
            className={`absolute bg-white top-16 left-0 w-full transition-all duration-300 ease-in-out transform ${
              openSolutions
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
            }`}
          >
            <Solutions />
          </div>
        </div>

        <div className="flex" ref={plansRef}>
          <NavLink
            to="/plans"
            className={({ isActive }) =>
              `flex items-center space-x-1 ${
                isActive ? "underline underline-offset-4 text-blue-600" : ""
              }`
            }
          >
            <span>Plans</span>
          </NavLink>
          <button className="cursor-pointer" onClick={handlePlans}>
            <ChevronDown size={12} color="#000" />
          </button>
          <div
            className={`absolute top-16 left-0 w-full transition-all ease-in-out duration-200 transform ${
              openPlans
                ? "opacity-100 scale-100 -translate-y-0 "
                : "opacity-0 scale-95 -translate-y-4 pointer-events-none"
            }`}
          >
            <Plans />
          </div>
        </div>

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
