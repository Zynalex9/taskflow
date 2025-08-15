import { ICard } from "@/types/functionalites.types";
import { AlignLeft } from "lucide-react";
import Description from "./Single-Card/Description";
import { useState } from "react";
import { useAddDescriptionMutation } from "@/store/cardApi";
import { useParams } from "react-router-dom";
import { useCardSocketInvalidate } from "@/hooks/useSocketInvalidate";
import { toast } from "sonner";

export const CardModalDescription = ({ card }: { card: ICard }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    card?.description || ""
  );
  const [addDescription] = useAddDescriptionMutation();
  const { workspaceId } = useParams();

  const handleEditDescription = async () => {
    const cardId = card?._id;
    if (editedDescription && cardId) {
      const body = {
        description: editedDescription,
        cardId,
        workspaceId: workspaceId!,
      };
      console.log("body:",body)
      try {
        await addDescription(body).unwrap();
      } catch (error: any) {
        toast.error(error.data.message || "Something went wrong");
      }
    }
  };
  console.log(card);
  useCardSocketInvalidate({ eventName: "descriptionAdded", id: card?._id });
  return (
    <div>
      {card?.description ? (
        isEditingDescription ? (
          <>
            <div className="flex gap-5 items-center pt-3">
              <AlignLeft className="text-textP" />
              <h1 className="text-textP font-charlie-text-sb text-xl">
                Edit Description
              </h1>
            </div>
            <textarea
              className="ml-10 mt-3 w-[90%] p-2 border border-gray-300 rounded font-charlie-text-r text-textP"
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              rows={4}
            />
            <div className="ml-10 mt-2">
              <button
                className="m-1 px-3 py-2 bg-fprimary/60 rounded font-charlie-text-r"
                onClick={() => setIsEditingDescription(false)}
              >
                Cancel
              </button>
              <button
                className="m-1 px-3 py-2 bg-primary rounded font-charlie-text-r"
                onClick={() => {
                  setIsEditingDescription(false);
                  handleEditDescription();
                }}
              >
                Save
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <div className="flex gap-5 items-center pt-3">
                <AlignLeft className="text-textP" />
                <h1 className="text-textP font-charlie-text-sb text-xl">
                  Description
                </h1>
              </div>
              <button
                className="px-2 py-1 rounded cursor-pointer items-center transition-colors duration-150 bg-[#B6C2CF]/20 hover:bg-[#B6C2CF]/10 font-charlie-display-sm shadow-2xl text-[#B3BFCC]"
                onClick={() => {
                  setIsEditingDescription(true);
                  setEditedDescription(card.description);
                }}
              >
                Edit
              </button>
            </div>
            <div className="ml-10 mt-3 text-textP/80 leading-loose font-charlie-text-r">
              {card.description}
            </div>
          </>
        )
      ) : showDescription ? (
        <>
          <div className="flex gap-5 items-center pt-3">
            <AlignLeft className="text-textP" />
            <h1 className="text-textP font-charlie-text-sb text-md">
              Description
            </h1>
          </div>
          <Description
            setShowDescription={setShowDescription}
            cardId={card._id}
          />
        </>
      ) : (
        <>
          <div className="flex gap-5 items-center pt-3">
            <AlignLeft className="text-textP" />
            <h1 className="text-textP font-charlie-text-sb text-md">
              Description
            </h1>
          </div>
          <div className="ml-10">
            <button
              className="w-full bg-[#0D0F11] text-start p-4 mt-1 rounded-sm font-charlie-display-sm text-textP cursor-pointer"
              onClick={() => setShowDescription(true)}
            >
              Add a more detailed description…
            </button>
          </div>
        </>
      )}
    </div>
  );
};
