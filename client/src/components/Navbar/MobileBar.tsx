import { AppDispatch, RootState } from "@/store/store";
import { ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBarFeatures from "./dropdowns/Features";
import Solutions from "./dropdowns/Solutions";
import Plans from "./dropdowns/Plans";
import {
  closeOverAllMenus,
  openShowFeatures,
  openShowPlans,
  openShowSolutions,
} from "@/store/NavBarSlice";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "@/store/AuthSlice";
interface MobileBarProps {
  furtherMenuOpen: boolean;
  setFurtherMenuOpen: Dispatch<SetStateAction<boolean>>;
}
const MobileBar: React.FC<MobileBarProps> = () => {
  const { showFeature, showFurtherMenu, showPlans, showSolutions } =
    useSelector((state: RootState) => state.navControl);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const navigator = useNavigate();
  const handleLogout = async () => {
    await dispatch(logoutUser());
    dispatch(closeOverAllMenus());
  };
  return (
    <div className="flex relative flex-col gap-40 overflow-y-scroll h-[85vh] ">
      <div className="px-4 space-y-4">
        <div className="flex justify-between border-b border-gray-200 py-4 relative">
          <button
            onClick={() => {
              dispatch(openShowFeatures());
            }}
            className="text-heading font-charlie-text-r"
          >
            Features
          </button>
          <ArrowRight className="text-black/60 transition-all duration-200 hover:text-black/100" />
        </div>

        <div className="flex justify-between border-b border-gray-200 py-4">
          <button
            onClick={() => {
              dispatch(openShowSolutions());
            }}
            className="text-heading font-charlie-text-r"
          >
            Solution
          </button>
          <ArrowRight className="text-black/60 transition-all duration-200 hover:text-black/100" />
        </div>
        <div className="flex justify-between border-b border-gray-200 py-4">
          <button
            onClick={() => {
              dispatch(openShowPlans());
            }}
            className="text-heading font-charlie-text-r"
          >
            Plans
          </button>
          <ArrowRight className="text-black/60 transition-all duration-200 hover:text-black/100" />
        </div>
        <div className="flex justify-between border-b border-gray-200 py-4">
          <button className="text-heading font-charlie-text-r">Pricing</button>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-4">
          <button className="text-heading font-charlie-text-r">
            Resources
          </button>
        </div>
      </div>
      <div className="px-4">
        {user ? (
          <>
            <button
              onClick={handleLogout}
              className="w-full text-white border-0 py-4  rounded bg-blue-primary cursor-pointer text-2xl font-charlie-display-sm"
            >
              Logout
            </button>
            <button
              onClick={() => navigator("/user/dashboard")}
              className="w-full text-white border-0 py-4  rounded bg-blue-primary cursor-pointer text-2xl font-charlie-display-sm"
            >
              Dashboard
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              navigator("/user/sign-in");
              dispatch(closeOverAllMenus());
            }}
            className="text-white w-full border-0 py-4  rounded bg-blue-primary cursor-pointer text-2xl font-charlie-display-sm"
          >
            Login
          </button>
        )}
      </div>

      <div
        className={`absolute top-0 left-0 h-[88vh] w-full bg-white transition-all duration-300 ease-in-out z-50 transform ${
          showFeature && showFurtherMenu
            ? "opacity-100 pointer-events-auto translate-x-0"
            : "opacity-0 pointer-events-none -translate-x-[40rem]"
        }`}
      >
        <NavBarFeatures />
      </div>
      <div
        className={`absolute top-0 left-0 h-[88vh] w-full bg-white transition-all duration-300 ease-in-out z-50 transform ${
          showSolutions && showFurtherMenu
            ? "opacity-100 pointer-events-auto translate-x-0"
            : "opacity-0 pointer-events-none -translate-x-[40rem]"
        }`}
      >
        <Solutions />
      </div>
      <div
        className={`absolute top-0 left-0 h-[88vh] w-full bg-white transition-all duration-300 ease-in-out z-50 transform ${
          showPlans && showFurtherMenu
            ? "opacity-100 pointer-events-auto translate-x-0"
            : "opacity-0 pointer-events-none -translate-x-[40rem]"
        }`}
      >
        <Plans />
      </div>
    </div>
  );
};

export default MobileBar;
