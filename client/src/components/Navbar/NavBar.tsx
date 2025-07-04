import { Link, NavLink } from "react-router-dom";
import { ChevronDown, ChevronUp, MenuIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NavBarFeatures from "./dropdowns/Features";
import Solutions from "./dropdowns/Solutions";
import Plans from "./dropdowns/Plans";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { logoutUser } from "../../store/AuthSlice";
import MobileBar from "./MobileBar";
import {
  closeAllMenus,
  closeOverAllMenus,
  openDropDown,
} from "@/store/NavBarSlice";

const NavBar = () => {
  const { showFurtherMenu, showDropDown } = useSelector(
    (state: RootState) => state.navControl
  );
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const [openFeatures, setOpenFeatures] = useState(false);
  const [openSolutions, setOpenSolutions] = useState(false);
  const [openPlans, setOpenPlans] = useState(false);
  const navRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);
  const solutionsRef = useRef<HTMLDivElement | null>(null);
  const plansRef = useRef<HTMLDivElement | null>(null);
  const [furtherMenuOpen, setFurtherMenuOpen] = useState<boolean>(false);

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
  useEffect(() => {
    if (showDropDown) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }

    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [showDropDown]);
  console.log(featuresRef);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        featuresRef.current &&
        !featuresRef.current.contains(event.target as Node)
      ) {
        setOpenFeatures(false);
      }
      if (
        solutionsRef.current &&
        !solutionsRef.current.contains(event.target as Node)
      ) {
        setOpenSolutions(false);
      }
      if (
        plansRef.current &&
        !plansRef.current.contains(event.target as Node)
      ) {
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
      className=" bg-white fixed top-0 shadow-xl text-xl z-[99999] flex items-center justify-between w-full h-16 py-2 pl-2  font-charlie-text-r"
    >
      <div className="logo">
        <Link to={"/"}>
          {showFurtherMenu ? (
            <button onClick={() => dispatch(closeAllMenus())}>Back</button>
          ) : (
            <h1 className="text-blue-primary text-4xl font-charlie-display-b">
              TaskFlow
            </h1>
          )}
        </Link>
      </div>
      <div className="links hidden lg:flex lg:gap-4 lg:ml-8">
        <div className="flex justify-center items-center" ref={featuresRef}>
          <NavLink
            to="/feature/power-ups/featured"
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

        <div
          className={`flex items-center space-x-1`} ref={solutionsRef}
        >
          <span>Solutions</span>
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

      <div
        className={`absolute top-16 left-0 w-full bg-white flex flex-col gap-4 py-4 shadow-lg lg:hidden z-50 
          transition-all duration-300 ease-in-out transform 
          ${
            showDropDown
              ? "translate-y-0 opacity-100"
              : "-translate-y-6 opacity-0 pointer-events-none"
          }`}
      >
        <MobileBar
          furtherMenuOpen={furtherMenuOpen}
          setFurtherMenuOpen={setFurtherMenuOpen}
        />
      </div>

      {user ? (
        <>
          <div className="hidden  lg:ml-auto lg:flex lg:gap-4">
            <button
              className="cursor-pointer font-charlie-text-r"
              onClick={() => dispatch(logoutUser())}
            >
              Logout
            </button>
            <button className="cursor-pointer bg-blue-primary py-4 px-2 mx-1 font-charlie-text-r text-white">
              <Link to={"/user/dashboard"}> Dashboard</Link>
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="hidden  lg:ml-auto lg:flex lg:gap-4">
            <button className="cursor-pointer font-charlie-text-r">
              <Link to={"/user/sign-in"}> Login</Link>
            </button>
            <button className="cursor-pointer bg-blue-primary py-4 px-2 mx-1 font-charlie-text-r text-white">
              <Link to={"/user/sign-up"}> Get Taskflow for Free</Link>
            </button>
          </div>
        </>
      )}

      <div className="block lg:hidden px-3">
        {showDropDown ? (
          <button
            onClick={() => {
              dispatch(closeOverAllMenus());
            }}
          >
            <XIcon />
          </button>
        ) : (
          <button
            onClick={() => {
              dispatch(openDropDown());
            }}
          >
            <MenuIcon />
          </button>
        )}
      </div>
    </div>
  );
};

export default NavBar;
