import { Ellipsis } from "lucide-react";

import { ListItems } from "./ListItem";

export const ListDropdown = ({
  listId,
  openListId,
  setOpenListId,
  setActiveListId
}: {
  listId: string;
  openListId: string | null;
  setOpenListId: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveListId: React.Dispatch<React.SetStateAction<string | null>>;
}) => {
  return (
    <div className="relative">
      <Ellipsis
        onClick={() => setOpenListId(openListId === listId ? null : listId)}
      />

      {openListId === listId && <ListItems setOpenListId={setOpenListId} setActiveListId={setActiveListId} listId={listId} />}
    </div>
  );
};
