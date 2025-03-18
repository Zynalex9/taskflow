import mongoose, { mongo, Schema } from "mongoose";

const listSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: "#000000",
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  position: {
    type: Number,
    default: 0,
  },
  board: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
});

export const ListModel = mongoose.model("List", listSchema);
