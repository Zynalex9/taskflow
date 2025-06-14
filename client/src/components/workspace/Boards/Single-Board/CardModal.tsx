import { usePreventScroll } from "./PreventScroll";
import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { AlignLeft, X } from "lucide-react";
import InListMove from "./Single-Card/InListMove";
import CardInfos from "./Single-Card/CardInfos";
import Description from "./Single-Card/Description";
import ModalSidebar from "./Single-Card/ModalSidebar";
import CommentInput from "./Single-Card/CommentInput";
import Attachments from "./Single-Card/Attachments";
import Checklist from "./Single-Card/dropdowns/Checklist/Checklist";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useAddDescriptionMutation,
  useGetSingleCardQuery,
  useToggleCompleteMutation,
} from "@/store/cardApi";
import { isImageUrl } from "@/utils/helper";
const CardModal = () => {
  const { cardId } = useParams();
  if (!cardId) return;
  const [toggleCard] = useToggleCompleteMutation();
  const { data, isLoading, error } = useGetSingleCardQuery({ cardId });
  const card = data?.data;
  const [isChecked, setIsChecked] = useState(card?.checked);
  const [showDescription, setShowDescription] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [editedDescription, setEditedDescription] = useState(
    card?.description || ""
  );
  const navigate = useNavigate();
  const location = useLocation();
  const background = location.state?.background;
  usePreventScroll(true);
  const handleClose = () => {
    navigate(background?.pathname || -1);
  };
  const [addDescription] = useAddDescriptionMutation();

  const handleEditDescription = async () => {
    if (editedDescription && cardId) {
      const body = {
        description: editedDescription,
        cardId,
      };
      await addDescription(body);
    }
  };
  const handleCheckChange = async () => {
    if (!cardId) return;
    setIsChecked(!isChecked);
    const body = {
      cardId,
      isComplete: isChecked,
    };
    await toggleCard(body);
  };

  if (isLoading)
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 pt-[60px] flex items-start justify-center p-4">
        <div className="bg-[#323940] rounded-lg w-full max-w-4xl flex gap-4 min-h-screen p-6">
          <div className="flex-1 space-y-3">
            <Skeleton className="w-2/3 h-4 rounded" />
            <Skeleton className="w-1/3 h-4 rounded" />
            <Skeleton className="w-2/3 h-4 rounded" />
            <Skeleton className="w-1/4 h-4 rounded" />
            <Skeleton className="w-2/3 h-4 rounded" />
          </div>

          <div className="hidden md:block md:w-1/5 bg-[#2c333a] rounded-lg p-4 space-y-3">
            <Skeleton className="w-full h-6 rounded" />
            <Skeleton className="w-full h-6 rounded" />
            <Skeleton className="w-full h-6 rounded" />
            <Skeleton className="w-full h-6 rounded" />
            <Skeleton className="w-full h-6 rounded" />
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center pt-[60px]">
        <h1>Error fetching cards....</h1>
      </div>
    );

  if (card)
    return (
      <>
        {isImageUrl(card.cover) ? (
          <div className="w-full h-44">
            <img
              src={card.cover}
              alt=""
              className="object-cover w-4/5 mx-auto"
            />
          </div>
        ) : (
          ""
        )}
        <div
          className="fixed inset-0 z-[90] bg-black/70 top-[20px]"
          onClick={handleClose}
        />

        <div className=" fixed inset-0 z-[100] overflow-y-auto flex items-start justify-center p-4 top-[60px]">
          <div
            className="bg-[#323940] shadow-lg rounded-lg text-white w-full max-w-4xl my-4  min-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="option"
                      checked={isChecked}
                      onChange={handleCheckChange}
                      className="peer hidden"
                    />
                    <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center peer-checked:bg-[#29AD77] peer-checked:border-0"></div>
                  </label>

                  <h1 className="text-textP font-charlie-text-sb text-2xl pl-4">
                    {card?.name}
                  </h1>
                </div>

                <X
                  onClick={handleClose}
                  className="cursor-pointer hover:text-gray-300"
                  size={24}
                />
              </div>
              <div className="pl-10">
                <InListMove />
              </div>
              <div className="w-full flex flex-col md:flex-row mt-4">
                <div className="w-full md:w-4/5 md:pr-4">
                  <CardInfos card={card} />
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
                  {card?.attachments && card?.attachments.length > 0 && (
                    <Attachments Attachment={card?.attachments || []} />
                  )}
                  {card?.checklist && card?.checklist.length > 0 && (
                    <Checklist Checklist={card.checklist} cardId={card._id} />
                  )}
                  <CommentInput comments={card?.comments} cardId={card._id} />
                </div>

                <div className="w-full md:w-1/5  mt-4 md:mt-0 p-4 rounded-lg">
                  <ModalSidebar card={card} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
};

export default CardModal;
