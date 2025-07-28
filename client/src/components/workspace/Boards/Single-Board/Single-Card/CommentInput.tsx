import { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../../store/store";
import { formatDistanceToNow } from "date-fns";
import { IComment } from "@/types/functionalites.types";
import { useAddCommentMutation, useEditCommentMutation } from "@/store/cardApi";
import { Pencil, Trash } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
interface IProps {
  comments: IComment[];
  cardId: string;
}
const CommentInput = ({ comments, cardId }: IProps) => {
  const [newComment, setNewComment] = useState("");
  const { user } = useSelector((state: RootState) => state.auth);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  console.log(isEditing, editingCommentId, editText);
  const [addComment] = useAddCommentMutation();
  const [editComment] = useEditCommentMutation();
  const handleSubmit = async () => {
    try {
      setNewComment("");

      const newCommentData = {
        cardId,
        comment: newComment,
      };
      await addComment(newCommentData).unwrap();
      setIsInputFocused(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleEdit = async () => {
    try {
      setNewComment("");
      if (!editingCommentId) return;
      const newCommentData = {
        cardId,
        comment: editText,
        commentId: editingCommentId,
      };
      await editComment(newCommentData).unwrap();
      setIsEditing(false);
      setEditingCommentId(null);
      toast("Comment edited successfully", {
        theme: "dark",
        type: "success",
      });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to edit comment", {
        theme: "dark",
      });
    }
  };
  return (
    <div>
      <div className="flex items-center justify-center my-2 gap-2">
        <img
          src={user?.profilePicture}
          alt="profile picture"
          className="rounded shadow-xl cursor-pointer w-8 h-8"
        />
        <input
          type="text"
          placeholder="Write a comment..."
          className="bg-[#22272B] text-textP transition-all duration-150 hover:text-white hover:bg-[#22272B]/80 cursor-pointer rounded w-full px-3 py-2 peer"
          onFocus={() => setIsInputFocused(true)}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        {isInputFocused && (
          <button
            onClick={handleSubmit}
            className="text-white cursor-pointer transition-all duration-150 hover:bg-blue-primary/60 font-charlie-display-sm bg-blue-primary rounded px-2 py-3"
          >
            Submit
          </button>
        )}
      </div>
      {comments &&
        comments.length > 0 &&
        [...comments].reverse().map((c) => (
          <>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={c.author.profilePicture}
                  alt="profile picture"
                  className="rounded shadow-xl cursor-pointer w-8 h-8"
                />
                <h1 className="text-[#B6C2CF] font-charlie-text-r">
                  {c.author.username} {c.author._id === user?._id && "(You)"}
                </h1>
                <h2 className="text-[#B6C2CF]/50 text-sm font-charlie-text-r">
                  {formatDistanceToNow(new Date(c.createdAt), {
                    addSuffix: true,
                  })}
                </h2>
              </div>
              {c.author._id === user?._id && (
                <div className="flex items-center gap-2">
                  <Trash size={16} className="text-red-500 cursor-pointer" />
                  <Pencil
                    size={16}
                    className="text-blue-500 cursor-pointer"
                    onClick={() => {
                      setIsEditing(true);
                      setEditText(c.comment);
                      setEditingCommentId(c._id);
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <div className="bg-[#22272B] ml-10 text-textP rounded px-3 py-2">
                {isEditing && editingCommentId === c._id ? (
                  <input
                    type="text"
                    value={editText}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleEdit();
                      }
                    }}
                    className="bg-transparent w-full text-textP outline-0"
                    onChange={(e) => setEditText(e.target.value)}
                  />
                ) : (
                  <h1>{c.comment}</h1>
                )}
              </div>
            </div>
          </>
        ))}
      <ToastContainer />
    </div>
  );
};

export default CommentInput;
