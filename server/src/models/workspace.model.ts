import mongoose, { Mongoose, Schema } from "mongoose";

const workspaceSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  calender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Calender",
  },
  boards: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Board",
  },
  tables: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Table",
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
},{timestamps:true});


export const workSpaceSchema = mongoose.model("Workspace", workspaceSchema);