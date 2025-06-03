import { closeAllDropDown } from "@/store/CardModalStatesSlice";
import { AppDispatch } from "@/store/store";
import { X } from "lucide-react";
import { useDispatch } from "react-redux";
interface IProps {
  headerText: string;
}
const DropdownHeader = ({ headerText }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="w-full px-2 flex items-center justify-between">
      <div></div>
      <div className="text-textP font-charlie-text-r text-md">{headerText}</div>
      <div>
        <X size={16} onClick={() => dispatch(closeAllDropDown())} />
      </div>
    </div>
  );
};

export default DropdownHeader;
