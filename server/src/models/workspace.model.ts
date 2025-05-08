import mongoose, { Schema } from "mongoose";
import { Types } from "mongoose";
import { getRandomColor } from "../utils/helpers";

export interface IWorkspace {
  _id?: Types.ObjectId;
  name: string;
  admin: Types.ObjectId[];
  calendar: Types.ObjectId;
  boards: Types.ObjectId[];
  table: Types.ObjectId;
  members: {
    user: Types.ObjectId;
    role: "admin" | "member";
  }[];
  createdBy: Types.ObjectId;
  cover: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const workspaceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    admin: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    calendar: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Calender",
    },
    boards: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Board",
      },
    ],
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
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
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const workSpaceModel = mongoose.model<IWorkspace>(
  "Workspace",
  workspaceSchema
);
