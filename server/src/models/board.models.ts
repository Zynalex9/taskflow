import mongoose, { Mongoose, Schema } from "mongoose";
const boardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lists: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "List",
      },
    ],
    favourite: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: "#ffffff", 
    },
    backgroundOptions: {
      type: [String],
      default: ["#ffffff", "#f4f4f4", "#ffcccc", "#ccffcc", "#ccccff"],
    },
    visibility: {
      type: String,
      enum: ["workspace", "private"],
      default: "workspace",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    workspace:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    }
  },
  { timestamps: true }
);
export const boardModel = mongoose.model("Board", boardSchema);
