import mongoose, { Schema, Types } from "mongoose";
export interface IList extends Document {
  name: string;
  color: string;
  cards: Types.ObjectId[];
  createdBy: Types.ObjectId;
  position: Number;
  board: Types.ObjectId;
  isArchived: Boolean;
}
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
      ref: "Todo",
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

export const ListModel = mongoose.model<IList>("List", listSchema);
