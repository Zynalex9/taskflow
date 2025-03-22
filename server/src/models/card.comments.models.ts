import mongoose, { Schema, Document, Types } from "mongoose";
interface IComment extends Document {
  comment: string;
  author: Types.ObjectId;
}
const commentsSchema = new Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const commentsModel = mongoose.model<IComment>(
  "Comment",
  commentsSchema
);
