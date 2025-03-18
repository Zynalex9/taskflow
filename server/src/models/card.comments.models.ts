import mongoose, { Schema } from "mongoose";

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

export const commentsModel = mongoose.model("Comment", commentsSchema);
