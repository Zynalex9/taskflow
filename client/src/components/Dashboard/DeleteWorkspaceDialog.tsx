import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ModalButton from "../resuable/ModalButton";
import { useState } from "react";

export function DeleteWorkspacePopover() {
  const [openPopOver, setOpenPopOver] = useState(false);
  return (
    <Popover open={openPopOver}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => setOpenPopOver(!openPopOver)}
          variant="destructive"
        >
          Delete workspace
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-fprimary text-textP">
        <div>
          <p>Are you sure you want to delete this workspace?</p>
          <div className="flex gap-2 items-end justify-end mt-4">
            <ModalButton
              btnText="Cancel"
              onClickFn={() => setOpenPopOver(!openPopOver)}
            />
            <ModalButton btnText="Delete" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
