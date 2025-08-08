import { socket } from "@/socket/socket";
import { myApi } from "@/store/myApi";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

interface socketInvalidateOptions {
  eventName: string;
  id: string;
}
export const useBoardSocketsInvalidate = ({
  eventName,
  id,
}: socketInvalidateOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const fn = () => {
      dispatch(myApi.util.invalidateTags([{ type: "singleBoard", id }]));
    };
    socket.on(eventName, fn);
    return () => {
      socket.off(eventName, fn);
    };
  }, [dispatch, id]);
};
export const useAllBoardSocketsInvalidate = ({
  eventName,
  id,
}: socketInvalidateOptions) => {
  const dispatch = useDispatch<AppDispatch>();
  console.log("I am called");

  useEffect(() => {
    const fn = () => {
      dispatch(myApi.util.invalidateTags([{ type: "Board", id }]));
    };
    socket.on(eventName, fn);
    return () => {
      socket.off(eventName, fn);
    };
  }, [dispatch, id]);
};
