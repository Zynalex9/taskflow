import { RootState } from "@/store/store";
import { ArrowRight } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";
import { useSelector } from "react-redux";
import NavBarFeatures from "./dropdowns/Features";
interface MobileBarProps {
  furtherMenuOpen: boolean;
  setFurtherMenuOpen: Dispatch<SetStateAction<boolean>>;
}
const MobileBar: React.FC<MobileBarProps> = ({
  setFurtherMenuOpen,
  furtherMenuOpen,
}) => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [showFeatures, setShowFeatures] = useState<boolean>(false);
  return (
    <div className="flex relative flex-col gap-40 overflow-y-scroll h-[85vh] ">
      <div className="px-4 space-y-4">
        <div className="flex justify-between border-b border-gray-200 py-4 relative">
          <button
            onClick={() => {
              setShowFeatures(true);
              setFurtherMenuOpen(true);
            }}
            className="text-heading font-charlie-text-r"
          >
            Features
          </button>
          <ArrowRight className="text-black/60 transition-all duration-200 hover:text-black/100" />
        </div>

        <div className="flex justify-between border-b border-gray-200 py-4">
          <button className="text-heading font-charlie-text-r">
            Solutions
          </button>
          <ArrowRight className="text-black/60 transition-all duration-200 hover:text-black/100" />
        </div>
        <div className="flex justify-between border-b border-gray-200 py-4">
          <button className="text-heading font-charlie-text-r">Plans</button>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-4">
          <button className="text-heading font-charlie-text-r">Pricing</button>
        </div>
        <div className="flex justify-between border-b border-gray-200 py-4">
          <button className="text-heading font-charlie-text-r">
            Resources
          </button>
          <ArrowRight className="text-black/60 transition-all duration-200 hover:text-black/100" />
        </div>
      </div>
      <div className="px-4">
        {user ? (
          <button className="w-full text-white border-0 py-4  rounded bg-blue-primary cursor-pointer text-2xl font-charlie-display-sm">
            Logout
          </button>
        ) : (
          <button className="text-white w-full border-0 py-4  rounded bg-blue-primary cursor-pointer text-2xl font-charlie-display-sm">
            Login
          </button>
        )}
      </div>

      <div
        className={`absolute top-0 left-0 h-[88vh] w-full bg-white transition-all duration-300 ease-in-out z-50 transform ${
          showFeatures && furtherMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-[40rem]"
        }`}
      >
        <NavBarFeatures />
      </div>
    </div>
  );
};

export default MobileBar;
