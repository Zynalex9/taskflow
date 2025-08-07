import { socket } from "@/socket/socket";
import { cardApi } from "@/store/cardApi";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface socketInvalidateOptions {
  eventName: string;
  id: string;
}
export const useCardSocketInvalidate = ({
  eventName,
  id,
}: socketInvalidateOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    console.log(`${eventName} triggered`);
    const fn = () => {
      dispatch(cardApi.util.invalidateTags([{ type: "singleCard", id }]));
    };
    socket.on(eventName, fn);
    return () => {
      socket.off(eventName, fn);
    };
  }, [dispatch, id]);
};
