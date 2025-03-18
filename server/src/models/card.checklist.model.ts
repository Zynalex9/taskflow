import mongoose, { Schema } from "mongoose";

const CheckListSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        text: {
          type: String,
          required: true,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    card: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
      required: true,
    },
  },
  { timestamps: true }
);
export const CheckListModel = mongoose.model("Checklist", CheckListSchema);
