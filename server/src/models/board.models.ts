import mongoose, { Mongoose, Schema } from "mongoose";
import { Types } from "mongoose";
export interface IBoard extends Document {
  title: string;
  lists: Types.ObjectId[];
  favourite: Boolean;
  background: string;
  visibility: string;
  createdBy: Types.ObjectId;
  workspace: Types.ObjectId;
  cover: string;
  description: string;
  members: {
    user: Types.ObjectId;
    role: "member" | "workspace-admin" | "admin";
  }[];
  isTemplate: Boolean;
  templateVersion: Number;
}
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
    visibility: {
      type: String,
      enum: ["workspace", "private", "public"],
      default: "workspace",
    },
    description: {
      type: String,
      default: "",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
    },
    cover: {
      type: String,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        role: {
          type: String,
          enum: ["admin", "workspace-admin", "member"],
          default: "member",
        },
      },
    ],
    isTemplate: {
      type: Boolean,
      default: false,
    },
    templateVersion: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
);
export const boardModel = mongoose.model<IBoard>("Board", boardSchema);
