import mongoose, { Schema } from "mongoose";
const CardSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  startDate: Date,
  endDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  list: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "List",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  labels: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Label",
    },
  ],
  cover: {
    type: String,
    default: "#000000",
  },
  priority: {
    type: String,
    enum: ["highest", "high", "medium", "low", "lowest"],
  },
  checklist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Checklist",
    },
  ],
  checked: {
    type: Boolean,
    default: false,
  },
});

export const CardModel = mongoose.model("Todo", CardSchema);
