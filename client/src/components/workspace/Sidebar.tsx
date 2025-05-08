import { BookMarked, BookTemplate, Waves } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div>
      <div className="text-[#B6C2CF] font-charlie-text-r font-semibold">
        <NavLink to={'/user/w/workspace/:workspaceId/board/:id'}><BookMarked/> Boards</NavLink>
        <NavLink to={'/templates'}><BookTemplate/> Templates</NavLink>
        <NavLink to={'/user/dashboard'}><Waves/>Home</NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
