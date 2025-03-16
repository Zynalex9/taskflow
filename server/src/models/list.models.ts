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
  todos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
    },
  ],
});

export const listModel = mongoose.model("List",listSchema);
