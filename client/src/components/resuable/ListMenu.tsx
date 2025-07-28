import { Ellipsis } from "lucide-react";
import { ListItems } from "./ListItem";

interface IListDropdownProps {
  activeListId: string | null;
  setActiveListId: React.Dispatch<React.SetStateAction<string | null>>;
  listId: string;
  openListId: string | null;
  setOpenListId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const ListDropdown: React.FC<IListDropdownProps> = ({
  setActiveListId,
  listId,
  openListId,
  setOpenListId,
}) => {
  return (
    <div className="relative">
      <Ellipsis
        onClick={
          () => setOpenListId(openListId === listId ? null : listId) 
        }
      />
      {openListId === listId && <ListItems />}
    </div>
  );
};
