import { usePreventScroll } from "./PreventScroll";
import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import InListMove from "./Single-Card/InListMove";
import CardInfos from "./Single-Card/CardInfos";
import ModalSidebar from "./Single-Card/ModalSidebar";
import CommentInput from "./Single-Card/CommentInput";
import Attachments from "./Single-Card/Attachments";
import Checklist from "./Single-Card/dropdowns/Checklist/Checklist";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetSingleCardQuery,
} from "@/store/cardApi";
import { isImageUrl } from "@/utils/helper";
import { socket } from "@/socket/socket";
import { CardModalDescription } from "./CardModalDescription";
import { CardModalTopBar } from "./CardModalTopBar";
const CardModal = () => {
  const { cardId,workspaceId } = useParams();
  if (!cardId) return;
  const { data, isLoading, error } = useGetSingleCardQuery({ cardId });
  const card = data?.data;
  usePreventScroll(true);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.emit("joinedWorkspace", workspaceId);
  }, []);

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
      <div ref={modalRef}>
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
        />

        <div className=" fixed inset-0 z-[100] overflow-y-auto flex items-start justify-center p-4 top-[60px]">
          <div
            className="bg-[#323940] shadow-lg rounded-lg text-white w-full max-w-4xl my-4  min-h-screen"
            onClick={(e) => e.stopPropagation()}
          >
            {isImageUrl(card.cover) ? (
              <div className="w-full">
                <img
                  src={card.cover}
                  alt=""
                  className="object-cover object-top h-56 w-full mx-auto"
                />
              </div>
            ) : (
              ""
            )}
            <div className="p-6">
              <CardModalTopBar card={card} />
              <div className="pl-10">
                <InListMove />
              </div>
              <div className="w-full flex flex-col md:flex-row mt-4">
                <div className="w-full md:w-4/5 md:pr-4">
                  <CardInfos card={card} />
                  <CardModalDescription card={card} />
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
      </div>
    );
};

export default CardModal;
