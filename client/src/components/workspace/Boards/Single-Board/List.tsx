import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IList } from "../../../../types/functionalites.types";
import Card from "./Card";
import { Ellipsis, Plus } from "lucide-react";
import AddList from "./AddList";
import { useParams } from "react-router-dom";
import { myApi, useAddCardMutation } from "@/store/myApi";
import { toast, ToastContainer } from "react-toastify";
import { socket } from "@/socket/socket";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";

interface ListProps {
  list: IList[] | undefined;
}

const List: React.FC<ListProps> = ({ list }) => {
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<{ cardName: string }>();
  const [addCard] = useAddCardMutation();
  const { boardId } = useParams();
  const { workspace } = useSelector((state: RootState) => state.workspace);
  const onSubmit = async (data: { cardName: string }) => {
    if (activeListId && boardId && workspace) {
      const body = {
        name: data.cardName,
        listId: activeListId,
        boardId,
        workspaceId: workspace._id,
      };
      try {
        reset();
        await addCard(body).unwrap();
      } catch (error: any) {
        toast.error(error.data.message, { theme: "dark" });
        reset();
      }
      setActiveListId(null);
    }
  };
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (!boardId) return;

    const handleListCreated = (newList: IList) => {
      console.log("New list received:", newList);
      dispatch(
        myApi.util.updateQueryData("getSingleBoard", boardId, (draft) => {
          const exists = draft.data.lists.some(
            (list) => list._id === newList._id
          );
          if (!exists) {
            draft.data.lists.push(newList);
          }
        })
      );
    };

    socket.on("listCreated", handleListCreated);
    socket.on("cardCreated", (e) => {
      console.log("csadsadsadsadasdsadsadadasdsdasdsa");
    });

    return () => {
      socket.off("listCreated", handleListCreated);
    };
  }, [dispatch, boardId]);

  return (
    <div className="flex gap-4 w-full items-stretch">
      {list?.length
        ? list.map((singleList) => (
            <div>
              <div
                key={singleList._id}
                className="bg-[#101204] w-[300px] p-4 text-textP rounded-xl shadow-lg shadow-black/80 flex-shrink-0"
              >
                <div className="font-bold mb-2 w-full flex items-center justify-between">
                  <h1>{singleList.name}</h1>
                  <Ellipsis size={16} />
                </div>
                <div className="custom-scrollbar  overflow-y-auto max-h-56 pr-3">
                  {singleList.cards.map((card) => (
                    <Card key={card._id} card={card} />
                  ))}
                </div>

                {activeListId === singleList._id ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
                    <input
                      type="text"
                      autoFocus
                      placeholder="Enter card name"
                      {...register("cardName", { required: true })}
                      className="w-full p-2 text-textP rounded-lg mb-2 focus:outline-0 focus:border-0 focus:ring-blue-400 focus:ring-2"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-blue-primary/80 hover:bg-blue-primary/50 text-white px-3 py-1 rounded"
                      >
                        Add
                      </button>
                      <button
                        type="button"
                        className="bg-gray-600 hover:bg-gray-600/50 text-white px-3 py-1 rounded"
                        onClick={() => setActiveListId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setActiveListId(singleList._id)}
                    className="w-full flex items-center gap-2 text-sm text-textP hover:text-white hover:bg-[#282F27] px-4 py-3 rounded-lg transition-all duration-200 backdrop-blur-sm shadow-sm mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add a card</span>
                  </button>
                )}
              </div>
            </div>
          ))
        : null}

      <AddList />
      <ToastContainer />
    </div>
  );
};

export default List;
